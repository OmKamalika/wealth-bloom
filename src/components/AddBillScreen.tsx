import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, Lock } from 'lucide-react';
import { FamilyMember, BillForm } from '../types';

interface AddBillScreenProps {
  familyMembers: FamilyMember[];
  onBack: () => void;
  onAddBill: (billData: any) => void;
}

const AddBillScreen: React.FC<AddBillScreenProps> = ({ familyMembers, onBack, onAddBill }) => {
  const [formData, setFormData] = useState<BillForm>({
    familyMemberId: '',
    provider: '',
    accountNumber: '',
    amount: '',
    dueDate: ''
  });
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.familyMemberId && formData.provider && formData.accountNumber) {
      onAddBill({
        type: 'other',
        provider: formData.provider,
        amount: parseInt(formData.amount) || 0,
        dueDate: formData.dueDate,
        familyMemberId: formData.familyMemberId,
        accountNumber: formData.accountNumber
      });
    }
  };

  const handleFetchBillDetails = () => {
    // Simulate fetching bill details
    setFormData(prev => ({
      ...prev,
      amount: '1250',
      dueDate: '2024-01-15'
    }));
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          Caring for your parents' bills?
        </h1>
      </div>

      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        Add their utility info here. We'll track due dates and help coordinate payments with your siblings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Family Member */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
            className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex items-center justify-between text-base"
            aria-label="Select family member"
          >
            <span className={formData.familyMemberId ? 'text-gray-900' : 'text-gray-500'}>
              {formData.familyMemberId 
                ? familyMembers.find(m => m.id === formData.familyMemberId)?.name || 'Select Family Member'
                : 'Select Family Member'
              }
            </span>
            <ChevronDown className="w-5 h-5 text-purple-600" />
          </button>
          
          {showFamilyDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, familyMemberId: member.id }));
                    setShowFamilyDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors text-base"
                >
                  {member.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search for Biller */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
          <input
            type="text"
            value={formData.provider}
            onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
            className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
            placeholder="Search for Biller"
            aria-label="Biller name"
          />
        </div>

        {/* Consumer/Account Number */}
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
          className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
          placeholder="Consumer/Account Number"
          aria-label="Account number"
        />

        {/* Fetch Bill Details Button */}
        <button
          type="button"
          onClick={handleFetchBillDetails}
          className="w-full py-4 bg-gray-100 text-gray-700 font-medium rounded-2xl transition-all duration-300 text-base"
        >
          Fetch Bill Details
        </button>

        {/* Amount */}
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
          placeholder="Amount"
          aria-label="Bill amount"
          inputMode="numeric"
        />

        {/* Due Date */}
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-base"
          placeholder="Due Date"
          aria-label="Due date"
        />

        {/* Family-Safe Payments */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Family-Safe Payments</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your payment goes directly to the utility company. We never store your money or your 
            parents' personal information.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.familyMemberId || !formData.provider || !formData.accountNumber}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
        >
          Add Bill to Hub
        </button>
      </form>
    </div>
  );
};

export default AddBillScreen;