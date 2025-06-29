import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { FamilyMember } from '../types';

interface AddFamilyMemberModalProps {
  onClose: () => void;
  onAdd: (member: FamilyMember) => void;
}

const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    isoCode: '+91',
    mobileNumber: ''
  });

  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [showIsoDropdown, setShowIsoDropdown] = useState(false);

  const relationships = [
    { value: 'guardian', label: 'Guardian/Parent' },
    { value: 'partner', label: 'Spouse/Partner' },
    { value: 'child', label: 'Child' },
    { value: 'childGuardian', label: 'Child Guardian' },
    { value: 'other', label: 'Other Family Member' }
  ];

  // ISO country codes for top 25 countries by GDP
  const isoCodes = [
    { value: '+1', label: '+1 (United States)' },
    { value: '+86', label: '+86 (China)' },
    { value: '+49', label: '+49 (Germany)' },
    { value: '+81', label: '+81 (Japan)' },
    { value: '+91', label: '+91 (India)' },
    { value: '+44', label: '+44 (United Kingdom)' },
    { value: '+33', label: '+33 (France)' },
    { value: '+55', label: '+55 (Brazil)' },
    { value: '+39', label: '+39 (Italy)' },
    { value: '+1', label: '+1 (Canada)' },
    { value: '+7', label: '+7 (Russia)' },
    { value: '+52', label: '+52 (Mexico)' },
    { value: '+61', label: '+61 (Australia)' },
    { value: '+82', label: '+82 (South Korea)' },
    { value: '+34', label: '+34 (Spain)' },
    { value: '+62', label: '+62 (Indonesia)' },
    { value: '+31', label: '+31 (Netherlands)' },
    { value: '+90', label: '+90 (Turkey)' },
    { value: '+966', label: '+966 (Saudi Arabia)' },
    { value: '+41', label: '+41 (Switzerland)' },
    { value: '+48', label: '+48 (Poland)' },
    { value: '+886', label: '+886 (Taiwan)' },
    { value: '+32', label: '+32 (Belgium)' },
    { value: '+46', label: '+46 (Sweden)' },
    { value: '+54', label: '+54 (Argentina)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship || !formData.email) {
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      email: formData.email,
      isoCode: formData.isoCode,
      mobileNumber: formData.mobileNumber
    };

    onAdd(newMember);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="header-custom">Add a family member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field-custom"
              placeholder="Name"
              aria-label="Family member name"
            />
          </div>

          {/* Relationship Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
              className="input-field-custom flex items-center justify-between"
              aria-label="Select relationship"
            >
              <span className={formData.relationship ? 'text-gray-900' : 'text-purple-400'}>
                {formData.relationship 
                  ? relationships.find(r => r.value === formData.relationship)?.label 
                  : 'Relationship'
                }
              </span>
              <ChevronDown className="w-5 h-5 text-custom-purple" />
            </button>
            
            {showRelationshipDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10">
                {relationships.map((relationship) => (
                  <button
                    key={relationship.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, relationship: relationship.value }));
                      setShowRelationshipDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors text-base"
                  >
                    {relationship.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-field-custom"
              placeholder="Email"
              aria-label="Family member email"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex gap-2">
            {/* ISO Code Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowIsoDropdown(!showIsoDropdown)}
                className="px-4 py-4 bg-custom-bg-input rounded-xl text-custom-text flex items-center gap-2 text-base"
                aria-label="Select country code"
              >
                <span>{formData.isoCode}</span>
                <ChevronDown className="w-4 h-4 text-custom-purple" />
              </button>
              
              {showIsoDropdown && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10 min-w-[200px] max-h-60 overflow-y-auto">
                  {isoCodes.map((iso) => (
                    <button
                      key={iso.label}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, isoCode: iso.value }));
                        setShowIsoDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors text-sm"
                    >
                      {iso.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Number */}
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
              className="input-field-custom flex-1"
              placeholder="Mobile Number"
              aria-label="Family member mobile number"
              inputMode="tel"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={!formData.name || !formData.relationship || !formData.email}
              className="btn-primary-custom w-full"
            >
              Add to My Family
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all duration-300 text-base"
            >
              Add More Family
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;