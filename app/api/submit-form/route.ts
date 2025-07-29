import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // Validate required fields
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
    console.log(`Form submitted successfully with ${uploadedImages.length} images`);

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully! Your submission has been saved.',
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
