import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import sgMail from '@sendgrid/mail';

interface FormDataObject {
  name: string;
  email: string;
  phone: string;
  constructionBudget: string;
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

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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
    const formData = await request.formData();
    const formDataObj: FormDataObject = {} as FormDataObject;

    // Convert FormData to object and parse JSON strings
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('inspiration_image_')) {
        continue;
      } else {
        try {
          formDataObj[key] = JSON.parse(value as string);
        } catch {
          formDataObj[key] = value;
        }
      }
    }

    if (!formDataObj.constructionBudget || formDataObj.constructionBudget.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Construction budget is required' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("construction-forms");
    
    const result = await db.collection('submissions').insertOne({
      ...formDataObj,
      submittedAt: new Date()
    });

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
      <p><strong>Number of Inspiration Images:</strong> ${Array.from(formData.entries()).filter(([key]) => key.startsWith('inspiration_image_')).length}</p>

      <p><strong>Database ID:</strong> ${result.insertedId}</p>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    const attachments = await Promise.all(
      Array.from(formData.entries())
        .filter(([key]) => key.startsWith('inspiration_image_'))
        .map(async ([_, value]) => {
          const file = value as File;
          return {
            content: await convertFileToBase64(file),
            filename: file.name,
            type: file.type,
            disposition: 'attachment'
          };
        })
    );

    const emailRecipients = [
      'mitchell@barnhaussteelbuilders.com',
      'michael@barnhaussteelbuilders.com',
      'larry@barnhaussteelbuilders.com',
      'shannon@barnhaussteelbuilders.com'
    ];

    await sgMail.send({
      to: emailRecipients,
      from: 'mitchell@barnhaussteelbuilders.com',
      subject: `New Pre-Design Form Submission from ${formDataObj.name}`,
      html: emailHtml,
      attachments: attachments
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully' 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting form' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
