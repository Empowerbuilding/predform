import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

interface FormDataObject {
  name: string;
  email: string;
  phone: string;
  constructionBudget: string | number;
  propertyAddress: string;
  hasSurvey: string;
  hasSlope: string;
  padDirection: string;
  living: string;
  patios: string;
  garage: string;
  bedrooms: string;
  bathrooms: string;
  desiredRooms: Record<string, boolean>;
  roofStyle: string;
  ceilingHeight: string;
  kitchenFeatures: Record<string, boolean>;
  masterBathroom: Record<string, boolean>;
  masterCloset: Record<string, boolean>;
  countertopFinishes: Record<string, boolean>;
  flooringFinishes: Record<string, boolean>;
  fireplace: string;
  fireplaceType: Record<string, boolean>;
  porchLocations: Record<string, boolean>;
  patiosCovered: string;
  patioCeilingMaterial: string;
  waterHeater: string;
  insulationType: Record<string, boolean>;
  additionalRequests: string;
  additionalItems: string;
  unwantedItems: string;
  pinterestLink: string;
  [key: string]: unknown;
}

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

async function uploadFileToSupabase(file: File, fileName: string) {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  
  const { data, error } = await supabase.storage
    .from('inspiration-images')
    .upload(fileName, uint8Array, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error('File upload error:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('inspiration-images')
    .getPublicUrl(fileName);

  return {
    path: data.path,
    url: urlData.publicUrl,
    name: file.name,
    type: file.type,
    size: file.size
  };
}

async function convertFileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

function formatCheckboxSection(data: Record<string, boolean>, title: string) {
  const selectedItems = Object.entries(data)
    .filter(([, value]) => value)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
    .join(', ');
  
  return selectedItems.length > 0 ? 
    `<p><strong>${title}:</strong> ${selectedItems}</p>` : 
    `<p><strong>${title}:</strong> None selected</p>`;
}

export async function POST(request: Request) {
  try {
    console.log('Starting form submission process...');
    
    const formData = await request.formData();
    console.log('Form data received');
    
    const formDataObj: FormDataObject = {} as FormDataObject;

    // Convert FormData to object and parse JSON strings
    for (const [key, value] of formData.entries()) {
      console.log(`Processing key: ${key}`);
      if (key.startsWith('inspiration_image_')) {
        console.log(`Found image: ${(value as File).name}`);
        continue;
      } else {
        try {
          formDataObj[key] = JSON.parse(value as string);
          console.log(`Parsed JSON for ${key}`);
        } catch {
          formDataObj[key] = value;
          console.log(`Set value for ${key}`);
        }
      }
    }

    if (!formDataObj.constructionBudget || 
        (typeof formDataObj.constructionBudget === 'string' && formDataObj.constructionBudget.trim() === '') ||
        (typeof formDataObj.constructionBudget === 'number' && formDataObj.constructionBudget <= 0)) {
      return NextResponse.json(
        { success: false, message: 'Construction budget is required' },
        { status: 400 }
      );
    }

    console.log('Processing file uploads...');
    const imageFiles = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('inspiration_image_'))
      .map(([_, value]) => value as File);

    const uploadedImages = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `${Date.now()}-${i}-${file.name}`;
      console.log(`Uploading file: ${fileName}`);
      
      try {
        const uploadResult = await uploadFileToSupabase(file, fileName);
        uploadedImages.push(uploadResult);
        console.log(`File uploaded successfully: ${fileName}`);
      } catch (error) {
        console.error(`Failed to upload file ${fileName}:`, error);
        // Continue with other files even if one fails
      }
    }

    console.log('Saving to Supabase database...');
    const { data, error } = await supabase
      .from('construction_submissions')
      .insert([
        {
          // Basic Information
          name: formDataObj.name,
          email: formDataObj.email,
          phone: formDataObj.phone,
          construction_budget: formDataObj.constructionBudget.toString(),
          property_address: formDataObj.propertyAddress,
          has_survey: formDataObj.hasSurvey,
          has_slope: formDataObj.hasSlope,
          pad_direction: formDataObj.padDirection,
          
          // Property Details
          living: formDataObj.living,
          patios: formDataObj.patios,
          garage: formDataObj.garage,
          bedrooms: formDataObj.bedrooms,
          bathrooms: formDataObj.bathrooms,
          desired_rooms: formDataObj.desiredRooms,
          
          // Design Preferences
          roof_style: formDataObj.roofStyle,
          ceiling_height: formDataObj.ceilingHeight,
          kitchen_features: formDataObj.kitchenFeatures,
          master_bathroom: formDataObj.masterBathroom,
          master_closet: formDataObj.masterCloset,
          countertop_finishes: formDataObj.countertopFinishes,
          flooring_finishes: formDataObj.flooringFinishes,
          
          // Special Features
          fireplace: formDataObj.fireplace,
          fireplace_type: formDataObj.fireplaceType,
          porch_locations: formDataObj.porchLocations,
          patios_covered: formDataObj.patiosCovered,
          patio_ceiling_material: formDataObj.patioCeilingMaterial,
          water_heater: formDataObj.waterHeater,
          insulation_type: formDataObj.insulationType,
          
          // Additional Information
          additional_requests: formDataObj.additionalRequests,
          additional_items: formDataObj.additionalItems,
          unwanted_items: formDataObj.unwantedItems,
          pinterest_link: formDataObj.pinterestLink,
          
          // File attachments
          inspiration_images: uploadedImages,
          
          submitted_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to save form data' },
        { status: 500 }
      );
    }

    console.log('Database insertion complete');

    console.log('Preparing email...');
    const emailHtml = `
      <h1>New Pre-Design Form Submission</h1>
      
      <h2>Basic Information</h2>
      <p><strong>Name:</strong> ${formDataObj.name}</p>
      <p><strong>Email:</strong> ${formDataObj.email}</p>
      <p><strong>Phone:</strong> ${formDataObj.phone}</p>
      <p><strong>Budget:</strong> ${formDataObj.constructionBudget}</p>
      <p><strong>Property Address:</strong> ${formDataObj.propertyAddress}</p>
      <p><strong>Survey Available:</strong> ${formDataObj.hasSurvey}</p>
      <p><strong>Slope Grade:</strong> ${formDataObj.hasSlope}</p>
      <p><strong>Pad Direction:</strong> ${formDataObj.padDirection}</p>
      
      <h2>Property Details</h2>
      <p><strong>Living Space:</strong> ${formDataObj.living} sqft</p>
      <p><strong>Patios:</strong> ${formDataObj.patios} sqft</p>
      <p><strong>Garage:</strong> ${formDataObj.garage} sqft</p>
      <p><strong>Bedrooms:</strong> ${formDataObj.bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${formDataObj.bathrooms}</p>
      
      <h2>Selected Rooms & Features</h2>
      ${formatCheckboxSection(formDataObj.desiredRooms, 'Desired Rooms')}
      
      <h2>Design Preferences</h2>
      <p><strong>Roof Style:</strong> ${formDataObj.roofStyle}</p>
      <p><strong>Ceiling Height:</strong> ${formDataObj.ceilingHeight} feet</p>
      ${formatCheckboxSection(formDataObj.kitchenFeatures, 'Kitchen Features')}
      ${formatCheckboxSection(formDataObj.masterBathroom, 'Master Bathroom Features')}
      ${formatCheckboxSection(formDataObj.masterCloset, 'Master Closet Features')}
      ${formatCheckboxSection(formDataObj.countertopFinishes, 'Countertop Finishes')}
      ${formatCheckboxSection(formDataObj.flooringFinishes, 'Flooring Finishes')}
      
      <h2>Special Features</h2>
      <p><strong>Fireplace:</strong> ${formDataObj.fireplace}</p>
      ${formDataObj.fireplace === 'yes' ? formatCheckboxSection(formDataObj.fireplaceType, 'Fireplace Type') : ''}
      ${formatCheckboxSection(formDataObj.porchLocations, 'Porch Locations')}
      <p><strong>Covered Patios:</strong> ${formDataObj.patiosCovered}</p>
      ${formDataObj.patiosCovered === 'yes' ? `<p><strong>Patio Ceiling Material:</strong> ${formDataObj.patioCeilingMaterial}</p>` : ''}
      <p><strong>Water Heater Type:</strong> ${formDataObj.waterHeater}</p>
      ${formatCheckboxSection(formDataObj.insulationType, 'Insulation Types')}
      
      <h2>Additional Information</h2>
      <p><strong>Additional Requests:</strong> ${formDataObj.additionalRequests || 'None'}</p>
      <p><strong>Additional Items Wanted:</strong> ${formDataObj.additionalItems || 'None'}</p>
      <p><strong>Unwanted Items:</strong> ${formDataObj.unwantedItems || 'None'}</p>
      <p><strong>Pinterest Board:</strong> ${formDataObj.pinterestLink || 'None provided'}</p>
      
      <h2>Inspiration Images</h2>
      <p><strong>Number of Images:</strong> ${uploadedImages.length}</p>
      ${uploadedImages.length > 0 ? `
        <h3>Image Links:</h3>
        <ul>
          ${uploadedImages.map(img => `<li><a href="${img.url}" target="_blank">${img.name}</a></li>`).join('')}
        </ul>
      ` : ''}

      <p><strong>Database ID:</strong> ${data[0].id}</p>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    console.log('Processing email attachments...');
    const attachments = await Promise.all(
      Array.from(formData.entries())
        .filter(([key]) => key.startsWith('inspiration_image_'))
        .map(async ([_, value]) => {
          const file = value as File;
          console.log(`Converting file for email: ${file.name}`);
          return {
            content: await convertFileToBase64(file),
            filename: file.name,
            type: file.type,
            disposition: 'attachment'
          };
        })
    );
    console.log(`Processed ${attachments.length} email attachments`);

    const emailRecipients = [
      'mitchell@barnhaussteelbuilders.com',
      'michael@barnhaussteelbuilders.com',
      'larry@barnhaussteelbuilders.com',
      'shannon@barnhaussteelbuilders.com'
    ];

    console.log('Sending email...');
    await sgMail.send({
      to: emailRecipients,
      from: 'mitchell@barnhaussteelbuilders.com',
      subject: `New Pre-Design Form Submission from ${formDataObj.name}`,
      html: emailHtml,
      attachments: attachments
    });
    console.log('Email sent successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      id: data[0].id,
      images: uploadedImages.length
    });

  } catch (error: unknown) {
    console.error('Detailed server error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Error submitting form: ${error instanceof Error ? error.message : 'Unknown error occurred'}` 
      },
      { status: 500 }
    );
  }
}
