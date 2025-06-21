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

  const isoCodes = [
    { value: '+91', label: '+91 (India)' },
    { value: '+1', label: '+1 (US/Canada)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+971', label: '+971 (UAE)' }
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
          <h2 className="text-lg font-bold text-gray-900">Add a family member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
              placeholder="Name"
            />
          </div>

          {/* Relationship Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center justify-between text-base"
            >
              <span className={formData.relationship ? 'text-gray-900' : 'text-purple-400'}>
                {formData.relationship 
                  ? relationships.find(r => r.value === formData.relationship)?.label 
                  : 'Relationship'
                }
              </span>
              <ChevronDown className="w-5 h-5 text-purple-600" />
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
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
              placeholder="Email"
            />
          </div>

          {/* Mobile Number */}
          <div className="flex gap-2">
            {/* ISO Code Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowIsoDropdown(!showIsoDropdown)}
                className="px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center gap-2 text-base"
              >
                <span>{formData.isoCode}</span>
                <ChevronDown className="w-4 h-4 text-purple-600" />
              </button>
              
              {showIsoDropdown && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10 min-w-[140px]">
                  {isoCodes.map((iso) => (
                    <button
                      key={iso.value}
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
              className="flex-1 px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
              placeholder="Mobile Number"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={!formData.name || !formData.relationship || !formData.email}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
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