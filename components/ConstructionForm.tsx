"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FormData {
  // Your existing interface remains exactly the same
  name: string;
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
}

const ConstructionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Your existing initial state remains exactly the same
    name: '',
    constructionBudget: '',
    propertyAddress: '',
    hasSurvey: 'yes',
    hasSlope: 'yes',
    padDirection: '',
    living: '',
    patios: '',
    garage: '',
    bedrooms: '',
    bathrooms: '',
    desiredRooms: {
      greatRoom: false,
      eatInKitchen: false,
      breakfastNook: false,
      laundryRoom: false,
      officeStudy: false,
      jackAndJillBathroom: false,
      formalLivingRoom: false,
      formalDiningRoom: false,
      masterSeatingSpace: false
    },
    roofStyle: 'gable',
    ceilingHeight: '9',
    kitchenFeatures: {
      butlerPantry: false,
      cornerPantry: false,
      kitchenIsland: false,
      galleryKitchen: false,
      lShapedKitchen: false,
      uShapedKitchen: false,
      breakfastBar: false
    },
    masterBathroom: {
      walkInShower: false,
      butlerPantry: false,
      customShowerSeat: false,
      shampooNiche: false,
      freestandingBathtub: false,
      makeupVanitySpace: false,
      chandelier: false
    },
    masterCloset: {
      hisAndHerSpaces: false,
      oneLargeSpace: false,
      connectedToMasterBedroom: false,
      accessFromMasterBathroom: false,
      builtInDrawersAndShelving: false
    },
    countertopFinishes: {
      granite: false,
      marble: false,
      quartz: false,
      laminate: false,
      tile: false
    },
    flooringFinishes: {
      ceramicTile: false,
      stainedConcrete: false,
      woodFlooring: false,
      vinylFlooring: false,
      carpet: false
    },
    fireplace: 'yes',
    fireplaceType: {
      woodBurning: false,
      electric: false,
      gasPropane: false
    },
    porchLocations: {
      frontPorch: false,
      rearPorch: false,
      sidePorch: false
    },
    patiosCovered: 'yes',
    patioCeilingMaterial: '',
    waterHeater: 'tank',
    insulationType: {
      sprayFoam: false,
      vinylBacked: false,
      batt: false,
      looseFillAndBlowIn: false
    },
    additionalRequests: '',
    additionalItems: '',
    unwantedItems: '',
    pinterestLink: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (section: string, field: string) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...(prevState[section as keyof typeof prevState] as Record<string, boolean>),
        [field]: !(prevState[section as keyof typeof prevState] as Record<string, boolean>)[field]
      }
    }));
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Only allow submission from the review step
    if (currentStep !== 5) {
      setCurrentStep(5);
      return;
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      alert('Form submitted successfully! Our team will review your submission.');
      
      // Reset form to initial state
      setFormData({
        // Your exact same initial state values as before
        name: '',
        constructionBudget: '',
        propertyAddress: '',
        hasSurvey: 'yes',
        hasSlope: 'yes',
        padDirection: '',
        living: '',
        patios: '',
        garage: '',
        bedrooms: '',
        bathrooms: '',
        desiredRooms: {
          greatRoom: false,
          eatInKitchen: false,
          breakfastNook: false,
          laundryRoom: false,
          officeStudy: false,
          jackAndJillBathroom: false,
          formalLivingRoom: false,
          formalDiningRoom: false,
          masterSeatingSpace: false
        },
        roofStyle: 'gable',
        ceilingHeight: '9',
        kitchenFeatures: {
          butlerPantry: false,
          cornerPantry: false,
          kitchenIsland: false,
          galleryKitchen: false,
          lShapedKitchen: false,
          uShapedKitchen: false,
          breakfastBar: false
        },
        masterBathroom: {
          walkInShower: false,
          butlerPantry: false,
          customShowerSeat: false,
          shampooNiche: false,
          freestandingBathtub: false,
          makeupVanitySpace: false,
          chandelier: false
        },
        masterCloset: {
          hisAndHerSpaces: false,
          oneLargeSpace: false,
          connectedToMasterBedroom: false,
          accessFromMasterBathroom: false,
          builtInDrawersAndShelving: false
        },
        countertopFinishes: {
          granite: false,
          marble: false,
          quartz: false,
          laminate: false,
          tile: false
        },
        flooringFinishes: {
          ceramicTile: false,
          stainedConcrete: false,
          woodFlooring: false,
          vinylFlooring: false,
          carpet: false
        },
        fireplace: 'yes',
        fireplaceType: {
          woodBurning: false,
          electric: false,
          gasPropane: false
        },
        porchLocations: {
          frontPorch: false,
          rearPorch: false,
          sidePorch: false
        },
        patiosCovered: 'yes',
        patioCeilingMaterial: '',
        waterHeater: 'tank',
        insulationType: {
          sprayFoam: false,
          vinylBacked: false,
          batt: false,
          looseFillAndBlowIn: false
        },
        additionalRequests: '',
        additionalItems: '',
        unwantedItems: '',
        pinterestLink: ''
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">Your Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </div>

      <div>
      <label className="block mb-2">What is your Budget for Construction? (Not including Land/Site Prep)</label>
      <input
        type="text"
        name="constructionBudget"
        className="w-full p-2 border rounded"
        value={formData.constructionBudget}
        onChange={handleInputChange}
        placeholder="Type here..."
      />
    </div>

      <div>
        <label className="block mb-2">Has a property been purchased? If yes, what is the address?</label>
        <input
          type="text"
          name="propertyAddress"
          className="w-full p-2 border rounded"
          value={formData.propertyAddress}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </div>

      <div>
        <label className="block mb-2">Do you currently have a Survey of said property?</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSurvey"
              value="yes"
              checked={formData.hasSurvey === 'yes'}
              onChange={handleInputChange}
              className="mr-2"
            /> Yes
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSurvey"
              value="no"
              checked={formData.hasSurvey === 'no'}
              onChange={handleInputChange}
              className="mr-2"
            /> No
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-2">Does the property's current state have a significant slope/grade?</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSlope"
              value="yes"
              checked={formData.hasSlope === 'yes'}
              onChange={handleInputChange}
              className="mr-2"
            /> Yes
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasSlope"
              value="no"
              checked={formData.hasSlope === 'no'}
              onChange={handleInputChange}
              className="mr-2"
            /> No
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-2">Pad Location: Which Direction would you like your home to face?</label>
        <input
          type="text"
          name="padDirection"
          className="w-full p-2 border rounded"
          value={formData.padDirection}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </div>
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Living (Sqft)</label>
          <input
            type="text"
            name="living"
            className="w-full p-2 border rounded"
            value={formData.living}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-2">Patios (Sqft)</label>
          <input
            type="text"
            name="patios"
            className="w-full p-2 border rounded"
            value={formData.patios}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Garage (Sqft)</label>
          <input
            type="text"
            name="garage"
            className="w-full p-2 border rounded"
            value={formData.garage}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Number of Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            className="w-full p-2 border rounded"
            value={formData.bedrooms}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-2">Number of Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            className="w-full p-2 border rounded"
            value={formData.bathrooms}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block mb-2">Specific Types of Rooms/Spaces Desired</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.desiredRooms).map(([room, checked]) => (
            <label key={room} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('desiredRooms', room)}
                className="form-checkbox"
              />
              <span>{room.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesignPreferences = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">What is your Desired Roof Style?</label>
        <div className="space-x-4">
          {['Gable', 'Single Slope', 'Flat', 'Parapet Wall'].map(style => (
            <label key={style} className="inline-flex items-center">
              <input
                type="radio"
                name="roofStyle"
                value={style.toLowerCase().replace(' ', '-')}
                checked={formData.roofStyle === style.toLowerCase().replace(' ', '-')}
                onChange={handleInputChange}
                className="mr-2"
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">What ceiling height would you like throughout your home?</label>
        <div className="space-x-4">
          {['9', '10', '12'].map(height => (
            <label key={height} className="inline-flex items-center">
              <input
                type="radio"
                name="ceilingHeight"
                value={height}
                checked={formData.ceilingHeight === height}
                onChange={handleInputChange}
                className="mr-2"
              />
              {height}'
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Kitchen Features</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.kitchenFeatures).map(([feature, checked]) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('kitchenFeatures', feature)}
                className="form-checkbox"
              />
              <span>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Master Bathroom Features</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.masterBathroom).map(([feature, checked]) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('masterBathroom', feature)}
                className="form-checkbox"
              />
              <span>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Master Closet Features</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.masterCloset).map(([feature, checked]) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('masterCloset', feature)}
                className="form-checkbox"
              />
              <span>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Countertop Finishes</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.countertopFinishes).map(([finish, checked]) => (
            <label key={finish} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('countertopFinishes', finish)}
                className="form-checkbox"
              />
              <span>{finish.charAt(0).toUpperCase() + finish.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Flooring Finishes</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.flooringFinishes).map(([finish, checked]) => (
            <label key={finish} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('flooringFinishes', finish)}
                className="form-checkbox"
              />
              <span>{finish.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSpecialFeatures = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Fireplace</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="fireplace"
              value="yes"
              checked={formData.fireplace === 'yes'}
              onChange={handleInputChange}
              className="mr-2"
            /> Yes
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="fireplace"
              value="no"
              checked={formData.fireplace === 'no'}
              onChange={handleInputChange}
              className="mr-2"
            /> No
          </label>
        </div>

        {formData.fireplace === 'yes' && (
          <div className="mt-4">
            <label className="block mb-2">Fireplace Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(formData.fireplaceType).map(([type, checked]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxChange('fireplaceType', type)}
                    className="form-checkbox"
                  />
                  <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2">Porch Sizing & Locations</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.porchLocations).map(([location, checked]) => (
            <label key={location} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('porchLocations', location)}
                className="form-checkbox"
              />
              <span>{location.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Are these patios covered?</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="patiosCovered"
              value="yes"
              checked={formData.patiosCovered === 'yes'}
              onChange={handleInputChange}
              className="mr-2"
            /> Yes
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="patiosCovered"
              value="no"
              checked={formData.patiosCovered === 'no'}
              onChange={handleInputChange}
              className="mr-2"
            /> No
          </label>
        </div>
      </div>

      {formData.patiosCovered === 'yes' && (
        <div>
          <label className="block mb-2">Covered Patio Ceiling Material</label>
          <input
            type="text"
            name="patioCeilingMaterial"
            className="w-full p-2 border rounded"
            value={formData.patioCeilingMaterial}
            onChange={handleInputChange}
            placeholder="Type here..."
          />
        </div>
      )}

      <div>
        <label className="block mb-2">Water Heater</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="waterHeater"
              value="tank"
              checked={formData.waterHeater === 'tank'}
              onChange={handleInputChange}
              className="mr-2"
            /> Tank
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="waterHeater"
              value="tankless"
              checked={formData.waterHeater === 'tankless'}
              onChange={handleInputChange}
              className="mr-2"
            /> Tankless
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-2">Insulation Type</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.insulationType).map(([type, checked]) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange('insulationType', type)}
                className="form-checkbox"
              />
              <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Additional Requests</label>
        <textarea
          name="additionalRequests"
          className="w-full p-2 border rounded"
          rows={3}
          value={formData.additionalRequests}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Are there any items or spaces that you would like in your new home that were not covered in this predesign form?</label>
        <textarea
          name="additionalItems"
          className="w-full p-2 border rounded"
          rows={3}
          value={formData.additionalItems}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </div>

      <div>
        <label className="block mb-2">Are there any specific items that you DO NOT WANT in your new home?</label>
        <textarea
          name="unwantedItems"
          className="w-full p-2 border rounded"
          rows={3}
          value={formData.unwantedItems}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </div>

      <div>
        <label className="block mb-2">Pinterest Board of Ideas for:</label>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Exterior Look</li>
          <li>Interior Design</li>
          <li>Windows</li>
          <li>Bathrooms</li>
          <li>Bedroom / Closets</li>
          <li>Kitchen</li>
          <li>Mudroom</li>
          <li>Office</li>
          <li>Great Room</li>
          <li>Floorplans you like</li>
          <li>Store (if applicable)</li>
        </ul>

        <label className="block mb-2">Do you have a Pinterest Board filled with your visions? If so, we would love to see it!</label>
        <input
          type="text"
          name="pinterestLink"
          className="w-full p-2 border rounded"
          value={formData.pinterestLink}
          onChange={handleInputChange}
          placeholder="Paste Link Here"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderPropertyDetails();
      case 3:
        return renderDesignPreferences();
      case 4:
        return renderSpecialFeatures();
      case 5:
        return renderReview();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
      <CardHeader className="pb-8 border-b">
    <div className="flex flex-col">
      <div className="flex justify-between items-start w-full">
        <div className="relative h-16 w-48 transition-transform hover:scale-105">
          <Image
            src="/logo.png"
            alt="Barnhaus Steel Builders Logo"
            width={192}
            height={64}
            priority
            className="drop-shadow-md object-contain"
          />
        </div>
      </div>
      <div className="text-center mt-6">
        <CardTitle className="text-3xl font-bold">Pre-Design Form</CardTitle>
        <p className="mt-2 text-gray-600">
          Help us understand your construction needs
        </p>
      </div>
    </div>
  </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex space-x-2 overflow-x-auto justify-center">
              {['Basic Info', 'Property Details', 'Design Preferences', 'Special Features', 'Review'].map((step, index) => (
                <button
                  key={step}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep(index + 1);
                  }}
                  className={`px-4 py-2 rounded whitespace-nowrap ${
                    currentStep === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-blue-500 rounded transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ml-auto"
                >
                  Next
                </button>
              )}
              
              {currentStep === 5 && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ml-auto"
                >
                  Submit Form
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionForm;