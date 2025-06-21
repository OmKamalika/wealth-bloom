import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PersonalInfo, FormErrors } from '../types';
import { validateFullName, validateIndianMobile, validateEmail } from '../utils/validation';

interface OnboardingScreenProps {
  onBack: () => void;
  onNext: (data: PersonalInfo) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    fullName: '',
    mobileNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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
          <h1 className="text-xl font-bold mb-4 text-gray-900">
            Let's create your family's safety net.
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="text-sm text-gray-600 mb-2">Step 1 of 5</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full w-1/5 transition-all duration-300"></div>
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
              className={`w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 transition-all text-base ${
                errors.fullName && touched.fullName
                  ? 'focus:ring-red-500 bg-red-50'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Name"
            />
            {errors.fullName && touched.fullName && (
              <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Mobile for all important communication</h3>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              onBlur={() => handleBlur('mobileNumber')}
              className={`w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 transition-all text-base ${
                errors.mobileNumber && touched.mobileNumber
                  ? 'focus:ring-red-500 bg-red-50'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Mobile Number"
            />
            {errors.mobileNumber && touched.mobileNumber && (
              <p className="text-red-500 text-sm mt-2">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Email ID for sharing important documents</h3>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 transition-all text-base ${
                errors.email && touched.email
                  ? 'focus:ring-red-500 bg-red-50'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Email"
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
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
        disabled={!formData.fullName || !formData.mobileNumber || !formData.email}
      >
        Next: Add Beneficiaries →
      </button>
    </div>
  );
};

export default OnboardingScreen;