import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown, MapPin } from 'lucide-react';
import { LocationInfo } from '../types';
import LocationDetector from './LocationDetector';

interface LocationScreenProps {
  onBack: () => void;
  onNext: (location: LocationInfo) => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState<LocationInfo>({
    state: '',
    zipCode: ''
  });
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.state && formData.zipCode) {
      onNext(formData);
    }
  };

  const handleLocationDetected = (location: any) => {
    setFormData({
      state: location.state,
      zipCode: location.zipCode
    });
  };

  const handleDetectionError = (error: Error) => {
    setDetectionError(error.message);
    setUseManualInput(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          My Legacy
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">Step 3 of 5</div>
          <div className="progress-bar-track-custom h-2">
            <div className="progress-bar-fill-custom h-2 rounded-full w-3/5 transition-all duration-300"></div>
          </div>
          <div className="text-sm text-custom-purple mt-2">60% done already!</div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="header-custom mb-4">Where do you live?</h1>
          <p className="text-gray-600">
            We need to know your state so your will follows the right legal rules. Each state has different requirements.
          </p>
        </div>

        {/* Location Detector */}
        {!useManualInput && (
          <div className="mb-6">
            <LocationDetector 
              onLocationDetected={handleLocationDetected}
              onError={handleDetectionError}
            />
          </div>
        )}

        {/* Manual Input Toggle */}
        {!useManualInput && (
          <button
            type="button"
            onClick={() => setUseManualInput(true)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl mb-6 hover:bg-gray-200 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Enter location manually
          </button>
        )}

        {/* Form */}
        {(useManualInput || formData.state || formData.zipCode) && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {detectionError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 text-sm">
                <p className="font-medium mb-1">Location detection failed</p>
                <p>{detectionError}</p>
              </div>
            )}

            {/* State Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className="input-field-custom flex items-center justify-between w-full"
                aria-label="Select your state"
              >
                <span className={formData.state ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.state || 'Select State'}
                </span>
                <ChevronDown className="w-5 h-5 text-custom-purple" />
              </button>
              
              {showStateDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                  {indianStates.map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, state }));
                        setShowStateDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                    >
                      {state}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Zip Code */}
            <div>
              <input
                type="tel"
                value={formData.zipCode}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                className="input-field-custom w-full"
                placeholder="Zip Code"
                aria-label="Zip code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            {/* Smart Legal Preview */}
            {formData.state && (
              <div className="bg-green-50 rounded-2xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">Smart Legal Preview</h3>
                <p className="text-green-700 text-sm">
                  Legal requirements loaded! We'll make sure your will is valid in {formData.state}.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.state || !formData.zipCode}
              className="btn-primary-custom w-full py-4"
            >
              Next: Your Assets
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LocationScreen;