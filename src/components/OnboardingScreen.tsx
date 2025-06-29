import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { PersonalInfo, FormErrors } from '../types';
import { validateFullName, validateIndianMobile, validateEmail } from '../utils/validation';

interface OnboardingScreenProps {
  onBack: () => void;
  onNext: (data: PersonalInfo) => void;
  capturedEmail?: string;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onBack, onNext, capturedEmail }) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    fullName: '',
    mobileNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showIsoDropdown, setShowIsoDropdown] = useState(false);
  const [selectedIsoCode, setSelectedIsoCode] = useState('+91');

  // ISO country codes for top 25 countries by GDP
  const isoCodes = [
    { code: '+1', country: 'United States' },
    { code: '+86', country: 'China' },
    { code: '+49', country: 'Germany' },
    { code: '+81', country: 'Japan' },
    { code: '+91', country: 'India' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+33', country: 'France' },
    { code: '+55', country: 'Brazil' },
    { code: '+39', country: 'Italy' },
    { code: '+1', country: 'Canada' },
    { code: '+7', country: 'Russia' },
    { code: '+52', country: 'Mexico' },
    { code: '+61', country: 'Australia' },
    { code: '+82', country: 'South Korea' },
    { code: '+34', country: 'Spain' },
    { code: '+62', country: 'Indonesia' },
    { code: '+31', country: 'Netherlands' },
    { code: '+90', country: 'Turkey' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+41', country: 'Switzerland' },
    { code: '+48', country: 'Poland' },
    { code: '+886', country: 'Taiwan' },
    { code: '+32', country: 'Belgium' },
    { code: '+46', country: 'Sweden' },
    { code: '+54', country: 'Argentina' }
  ];

  // Pre-populate email if available from previous screen
  useEffect(() => {
    if (capturedEmail && !formData.email) {
      setFormData(prev => ({ ...prev, email: capturedEmail }));
    }
  }, [capturedEmail]);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof PersonalInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error: string | undefined;
    switch (field) {
      case 'fullName':
        error = validateFullName(formData.fullName);
        break;
      case 'mobileNumber':
        error = validateIndianMobile(formData.mobileNumber);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateFullName(formData.fullName);
    const mobileError = validateIndianMobile(formData.mobileNumber);
    const emailError = validateEmail(formData.email);
    
    const newErrors: FormErrors = {
      fullName: nameError,
      mobileNumber: mobileError,
      email: emailError
    };
    
    setErrors(newErrors);
    setTouched({ fullName: true, mobileNumber: true, email: true });
    
    if (!nameError && !mobileError && !emailError) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="header-custom mb-4">
            Let's create your family's safety net.
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="text-sm text-gray-600 mb-2">Step 1 of 5</div>
          <div className="progress-bar-track-custom h-2">
            <div className="progress-bar-fill-custom h-2 rounded-full w-1/5 transition-all duration-300"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">What's your full legal name?</h2>
            <p className="text-gray-600 text-sm mb-4">
              This will appear on your will. We'll ask only what's necessary — nothing more.
            </p>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={`input-field-custom ${
                errors.fullName && touched.fullName
                  ? 'focus:ring-red-500 bg-red-50'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Name"
              aria-label="Full legal name"
            />
            {errors.fullName && touched.fullName && (
              <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile Number with ISO Code */}
          <div>
            <h3 className="label-custom font-semibold mb-4">Mobile for all important communication</h3>
            <div className="flex gap-2">
              {/* ISO Code Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIsoDropdown(!showIsoDropdown)}
                  className="flex items-center gap-2 px-4 py-4 bg-custom-bg-input rounded-xl text-custom-text min-w-[100px]"
                  aria-label="Select country code"
                >
                  <span>{selectedIsoCode}</span>
                  <ChevronDown className="w-4 h-4 text-custom-purple" />
                </button>
                
                {showIsoDropdown && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                    {isoCodes.map((iso) => (
                      <button
                        key={`${iso.code}-${iso.country}`}
                        type="button"
                        onClick={() => {
                          setSelectedIsoCode(iso.code);
                          setShowIsoDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                      >
                        <span className="font-medium">{iso.code}</span> {iso.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Number Input */}
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                onBlur={() => handleBlur('mobileNumber')}
                className={`input-field-custom flex-1 ${
                  errors.mobileNumber && touched.mobileNumber
                    ? 'focus:ring-red-500 bg-red-50'
                    : 'focus:ring-purple-500'
                }`}
                placeholder="Mobile Number"
                aria-label="Mobile number"
                inputMode="tel"
              />
            </div>
            {errors.mobileNumber && touched.mobileNumber && (
              <p className="text-red-500 text-sm mt-2">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <h3 className="label-custom font-semibold mb-4">Email ID for sharing important documents</h3>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`input-field-custom ${
                errors.email && touched.email
                  ? 'focus:ring-red-500 bg-red-50'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Email"
              aria-label="Email address"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
        </form>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            We'll ask only what's necessary — nothing more.<br />
            Your answers stay private and secure.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="btn-primary-custom text-lg mt-8"
        disabled={!formData.fullName || !formData.mobileNumber || !formData.email}
      >
        Next: Add Beneficiaries →
      </button>
    </div>
  );
};

export default OnboardingScreen;