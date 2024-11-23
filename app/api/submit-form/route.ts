import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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
    const formData = await request.json();

    await client.connect();
    const db = client.db("construction-forms");
    
    const result = await db.collection('submissions').insertOne({
      ...formData,
      submittedAt: new Date()
    });

    // Create comprehensive email HTML
    const emailHtml = `
      <h1>New Pre-Design Form Submission</h1>
      
      <h2>Basic Information</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Budget:</strong> ${formData.constructionBudget}</p>
      <p><strong>Property Address:</strong> ${formData.propertyAddress}</p>
      <p><strong>Survey Available:</strong> ${formData.hasSurvey}</p>
      <p><strong>Slope Grade:</strong> ${formData.hasSlope}</p>
      <p><strong>Pad Direction:</strong> ${formData.padDirection}</p>
      
      <h2>Property Details</h2>
      <p><strong>Living Space:</strong> ${formData.living} sqft</p>
      <p><strong>Patios:</strong> ${formData.patios} sqft</p>
      <p><strong>Garage:</strong> ${formData.garage} sqft</p>
      <p><strong>Bedrooms:</strong> ${formData.bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${formData.bathrooms}</p>
      
      <h2>Selected Rooms & Features</h2>
      ${formatCheckboxSection(formData.desiredRooms, 'Desired Rooms')}
      
      <h2>Design Preferences</h2>
      <p><strong>Roof Style:</strong> ${formData.roofStyle}</p>
      <p><strong>Ceiling Height:</strong> ${formData.ceilingHeight} feet</p>
      ${formatCheckboxSection(formData.kitchenFeatures, 'Kitchen Features')}
      ${formatCheckboxSection(formData.masterBathroom, 'Master Bathroom Features')}
      ${formatCheckboxSection(formData.masterCloset, 'Master Closet Features')}
      ${formatCheckboxSection(formData.countertopFinishes, 'Countertop Finishes')}
      ${formatCheckboxSection(formData.flooringFinishes, 'Flooring Finishes')}
      
      <h2>Special Features</h2>
      <p><strong>Fireplace:</strong> ${formData.fireplace}</p>
      ${formData.fireplace === 'yes' ? formatCheckboxSection(formData.fireplaceType, 'Fireplace Type') : ''}
      ${formatCheckboxSection(formData.porchLocations, 'Porch Locations')}
      <p><strong>Covered Patios:</strong> ${formData.patiosCovered}</p>
      ${formData.patiosCovered === 'yes' ? `<p><strong>Patio Ceiling Material:</strong> ${formData.patioCeilingMaterial}</p>` : ''}
      <p><strong>Water Heater Type:</strong> ${formData.waterHeater}</p>
      ${formatCheckboxSection(formData.insulationType, 'Insulation Types')}
      
      <h2>Additional Information</h2>
      <p><strong>Additional Requests:</strong> ${formData.additionalRequests || 'None'}</p>
      <p><strong>Additional Items Wanted:</strong> ${formData.additionalItems || 'None'}</p>
      <p><strong>Unwanted Items:</strong> ${formData.unwantedItems || 'None'}</p>
      <p><strong>Pinterest Board:</strong> ${formData.pinterestLink || 'None provided'}</p>

      <p><strong>Database ID:</strong> ${result.insertedId}</p>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    // Multiple recipients array
    const emailRecipients = [
      'mitchell@barnhaussteelbuilders.com',
      'michael@barnhaussteelbuilders.com',
      'larry@barnhaussteelbuilders.com',
      'shannon@barnhaussteelbuilders.com'
      // Add as many email addresses as needed
    ];

    await sgMail.send({
      to: emailRecipients,
      from: 'mitchell@barnhaussteelbuilders.com',
      subject: `New Pre-Design Form Submission from ${formData.name}`,
      html: emailHtml,
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