import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { LocationInfo } from '../types';

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
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full w-3/5 transition-all duration-300"></div>
          </div>
          <div className="text-sm text-purple-600 mt-2">60% done already!</div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Where do you live?</h1>
          <p className="text-gray-600">
            We need to know your state so your will follows the right legal rules. Each state has different requirements.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* State Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center justify-between"
            >
              <span className={formData.state ? 'text-gray-900' : 'text-gray-500'}>
                {formData.state || 'Select State'}
              </span>
              <ChevronDown className="w-5 h-5 text-purple-600" />
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
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Zip Code"
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
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Next: Your Assets
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationScreen;