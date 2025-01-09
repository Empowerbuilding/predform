"use client";

import React, { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { FormField, TextInput, RadioGroup, CheckboxGroup } from './FormComponents';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, maxImages = 5 }) => {
  const [previewUrls, setPreviewUrls] = useState<{ file: File; url: string }[]>([]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (previewUrls.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setPreviewUrls(prev => [...prev, ...newPreviews]);
    onImagesChange([...previewUrls.map(p => p.file), ...files]);
  }, [maxImages, onImagesChange, previewUrls]);

  const removeImage = useCallback((indexToRemove: number) => {
    setPreviewUrls(prev => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      onImagesChange(newPreviews.map(p => p.file));
      return newPreviews;
    });
  }, [onImagesChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {previewUrls.map((preview, index) => (
          <div key={preview.url} className="relative aspect-square">
            <div className="relative w-full h-full">
              <Image
                src={preview.url}
                alt={`Preview ${index + 1}`}
                className="object-cover rounded-lg"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized // Add this since we're using object URLs
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {previewUrls.length < maxImages && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Upload up to {maxImages} images of your inspiration or specific details you'd like to include
      </p>
    </div>
  );
};

interface FormData {
  // Your existing interface remains exactly the same
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
  inspirationImages: File[];
}

const ConstructionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Your existing initial state remains exactly the same
    name: '',
    email: '',
    phone: '',
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
    pinterestLink: '',
    inspirationImages: []
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
    e.preventDefault();
    
    // Validate budget field when moving from first step
    if (currentStep === 1) {
      if (!formData.constructionBudget || formData.constructionBudget.trim() === '') {
        alert('Please enter your construction budget');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Validate required fields before submission
  if (!formData.constructionBudget || formData.constructionBudget.trim() === '') {
    alert('Please enter your construction budget');
    setCurrentStep(1); // Take user back to first step
    return;
  }

  try {
    const formDataToSubmit = new FormData();
    
    // Log what we're sending
    console.log('Preparing form data...');
    
    // Add all form fields except images
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'inspirationImages') {
        if (typeof value === 'object' && value !== null) {
          console.log(`Adding ${key}:`, value);
          formDataToSubmit.append(key, JSON.stringify(value));
        } else {
          console.log(`Adding ${key}:`, value);
          formDataToSubmit.append(key, value.toString());
        }
      }
    });
    
    // Log image uploads
    console.log('Adding images...');
    formData.inspirationImages.forEach((image, index) => {
      console.log(`Adding image ${index}:`, image.name);
      formDataToSubmit.append(`inspiration_image_${index}`, image);
    });

    console.log('Submitting form...');
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      body: formDataToSubmit,
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Submission failed');
    }

    alert('Form submitted successfully! Our team will review your submission.');
    
    // Reset form to initial state
    setFormData({
      name: '',
      email: '',
      phone: '',
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
      pinterestLink: '',
      inspirationImages: [] // Make sure to include this in the reset
    });
    setCurrentStep(1);
    
  } catch (error) {
    console.error('Detailed submission error:', error);
    alert('There was an error submitting the form. Please try again.');
  }
};

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <FormField label="Your Full Name">
        <TextInput
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </FormField>

      <FormField label="Email Address">
        <TextInput
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
        />
      </FormField>

      <FormField label="Phone Number">
        <TextInput
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
      </FormField>
  
      <FormField label="What is your Budget for Construction? (Not including Land/Site Prep) *">
        <TextInput
          name="constructionBudget"
          value={formData.constructionBudget}
          onChange={handleInputChange}
          placeholder="Type here..."
          required
        />
      </FormField>
  
      <FormField label="Has a property been purchased? If yes, what is the address?">
        <TextInput
          name="propertyAddress"
          value={formData.propertyAddress}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </FormField>
  
      <FormField label="Do you currently have a Survey of said property?">
        <RadioGroup
          name="hasSurvey"
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]}
          value={formData.hasSurvey}
          onChange={handleInputChange}
        />
      </FormField>
  
      <FormField label="Does the property's current state have a significant slope/grade?">
        <RadioGroup
          name="hasSlope"
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]}
          value={formData.hasSlope}
          onChange={handleInputChange}
        />
      </FormField>
  
      <FormField label="Pad Location: Which Direction would you like your home to face?">
        <TextInput
          name="padDirection"
          value={formData.padDirection}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
      </FormField>
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Living (Sqft)">
          <TextInput
            name="living"
            value={formData.living}
            onChange={handleInputChange}
            placeholder="Enter square footage"
            type="number"
          />
        </FormField>
        
        <FormField label="Patios (Sqft)">
          <TextInput
            name="patios"
            value={formData.patios}
            onChange={handleInputChange}
            placeholder="Enter square footage"
            type="number"
          />
        </FormField>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Garage (Sqft)">
          <TextInput
            name="garage"
            value={formData.garage}
            onChange={handleInputChange}
            placeholder="Enter square footage"
            type="number"
          />
        </FormField>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Number of Bedrooms">
          <TextInput
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            type="number"
            placeholder="Enter number of bedrooms"
          />
        </FormField>
        
        <FormField label="Number of Bathrooms">
          <TextInput
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            type="number"
            placeholder="Enter number of bathrooms"
          />
        </FormField>
      </div>
  
      <FormField label="Specific Types of Rooms/Spaces Desired">
        <CheckboxGroup
          section="desiredRooms"
          options={Object.entries(formData.desiredRooms).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.desiredRooms}
          onChange={handleCheckboxChange}
        />
      </FormField>
    </div>
  );

  const renderDesignPreferences = () => (
    <div className="space-y-6">
      <FormField label="What is your Desired Roof Style?">
        <RadioGroup
          name="roofStyle"
          options={[
            { label: 'Gable', value: 'gable' },
            { label: 'Single Slope', value: 'single-slope' },
            { label: 'Flat', value: 'flat' },
            { label: 'Parapet Wall', value: 'parapet-wall' }
          ]}
          value={formData.roofStyle}
          onChange={handleInputChange}
        />
      </FormField>
  
      <FormField label="What ceiling height would you like throughout your home?">
        <RadioGroup
          name="ceilingHeight"
          options={[
            { label: '9 Feet', value: '9' },
            { label: '10 Feet', value: '10' },
            { label: '12 Feet', value: '12' }
          ]}
          value={formData.ceilingHeight}
          onChange={handleInputChange}
        />
      </FormField>
  
      <FormField label="Kitchen Features">
        <CheckboxGroup
          section="kitchenFeatures"
          options={Object.entries(formData.kitchenFeatures).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.kitchenFeatures}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Master Bathroom Features">
        <CheckboxGroup
          section="masterBathroom"
          options={Object.entries(formData.masterBathroom).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.masterBathroom}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Master Closet Features">
        <CheckboxGroup
          section="masterCloset"
          options={Object.entries(formData.masterCloset).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.masterCloset}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Countertop Finishes">
        <CheckboxGroup
          section="countertopFinishes"
          options={Object.entries(formData.countertopFinishes).map(([key, _]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
            value: key
          }))}
          values={formData.countertopFinishes}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Flooring Finishes">
        <CheckboxGroup
          section="flooringFinishes"
          options={Object.entries(formData.flooringFinishes).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.flooringFinishes}
          onChange={handleCheckboxChange}
        />
      </FormField>
    </div>
  );

  const renderSpecialFeatures = () => (
    <div className="space-y-6">
      <FormField label="Fireplace">
        <RadioGroup
          name="fireplace"
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]}
          value={formData.fireplace}
          onChange={handleInputChange}
        />
      </FormField>
  
      {formData.fireplace === 'yes' && (
        <FormField label="Fireplace Type">
          <CheckboxGroup
            section="fireplaceType"
            options={Object.entries(formData.fireplaceType).map(([key, _]) => ({
              label: key
                .split(/(?=[A-Z])/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' '),
              value: key
            }))}
            values={formData.fireplaceType}
            onChange={handleCheckboxChange}
          />
        </FormField>
      )}
  
      <FormField label="Porch Sizing & Locations">
        <CheckboxGroup
          section="porchLocations"
          options={Object.entries(formData.porchLocations).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.porchLocations}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Are these patios covered?">
        <RadioGroup
          name="patiosCovered"
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]}
          value={formData.patiosCovered}
          onChange={handleInputChange}
        />
      </FormField>
  
      {formData.patiosCovered === 'yes' && (
        <FormField label="Covered Patio Ceiling Material">
          <TextInput
            name="patioCeilingMaterial"
            value={formData.patioCeilingMaterial}
            onChange={handleInputChange}
            placeholder="Enter ceiling material"
          />
        </FormField>
      )}
  
      <FormField label="Water Heater">
        <RadioGroup
          name="waterHeater"
          options={[
            { label: 'Tank', value: 'tank' },
            { label: 'Tankless', value: 'tankless' }
          ]}
          value={formData.waterHeater}
          onChange={handleInputChange}
        />
      </FormField>
  
      <FormField label="Insulation Type">
        <CheckboxGroup
          section="insulationType"
          options={Object.entries(formData.insulationType).map(([key, _]) => ({
            label: key
              .split(/(?=[A-Z])/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' '),
            value: key
          }))}
          values={formData.insulationType}
          onChange={handleCheckboxChange}
        />
      </FormField>
  
      <FormField label="Additional Requests">
        <textarea
          name="additionalRequests"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          rows={4}
          value={formData.additionalRequests}
          onChange={handleInputChange}
          placeholder="Enter any additional requests here..."
        />
      </FormField>
    </div>
  );

  const renderReview = () => (
  <div className="space-y-8">
    <FormField label="Are there any items or spaces that you would like in your new home that were not covered in this predesign form?">
      <textarea
        name="additionalItems"
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
        rows={4}
        value={formData.additionalItems}
        onChange={handleInputChange}
        placeholder="Enter any additional items or spaces here..."
      />
    </FormField>

    <FormField label="Are there any specific items that you DO NOT WANT in your new home?">
      <textarea
        name="unwantedItems"
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
        rows={4}
        value={formData.unwantedItems}
        onChange={handleInputChange}
        placeholder="Enter any unwanted items here..."
      />
    </FormField>

    <div className="space-y-4">
      <FormField label="Pinterest Board of Ideas for:">
        <ul className="list-disc pl-6 space-y-2 text-gray-900">
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
      </FormField>

      <FormField label="Do you have a Pinterest Board filled with your visions? If so, we would love to see it!">
        <TextInput
          name="pinterestLink"
          value={formData.pinterestLink}
          onChange={handleInputChange}
          placeholder="Paste your Pinterest board link here"
        />
      </FormField>

      <FormField label="Upload Inspiration Images">
        <ImageUpload
          onImagesChange={(images) => setFormData(prev => ({ ...prev, inspirationImages: images }))}
          maxImages={5}
        />
      </FormField>
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
    <div className="min-h-screen bg-gray-50">
      <Card className="mx-auto border-none rounded-none sm:rounded-lg sm:my-4 sm:mx-4 shadow-none sm:shadow-sm">
        <CardHeader className="border-b space-y-4 px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-40 sm:h-16 sm:w-48">
              <Image
                src="/Logo.PNG"
                alt="Barnhaus Steel Builders Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <CardTitle className="text-2xl sm:text-3xl">Pre-Design Form</CardTitle>
              <p className="mt-2 text-sm text-gray-600">
                Help us understand your construction needs
              </p>
            </div>
          </div>
          
          <div className="w-full mt-6">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto px-1 py-2">
              {['Basic Info', 'Property Details', 'Design Preferences', 'Special Features', 'Review'].map((step, index) => (
                <button
                  key={step}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep(index + 1);
                  }}
                  className={`
                    flex-none px-3 py-1.5 text-sm rounded-full whitespace-nowrap
                    ${currentStep === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
  
        <CardContent className="p-4 pb-24 sm:p-6 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {renderStepContent()}
            </div>
  
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:relative sm:bg-transparent sm:border-t-0 sm:p-0 sm:mt-6">
              <div className="flex justify-between max-w-4xl mx-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-5 py-2.5 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors ml-auto"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionForm;
