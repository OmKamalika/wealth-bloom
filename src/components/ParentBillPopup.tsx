import React from 'react';

interface ParentBillPopupProps {
  onContinue: () => void;
  onMaybeLater: () => void;
}

const ParentBillPopup: React.FC<ParentBillPopupProps> = ({ onContinue, onMaybeLater }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
          Let's Do more for those who brought us up!
        </h2>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
          You're Protected. But What About Mom & Dad?
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          As our parents age, the risk of missed or forgotten bills increases. Late payments can 
          lead to fees, credit score damage, and even utility shutoffs. Monitoring their bills can 
          prevent these issues and ensure their financial
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform active:scale-95"
          >
            Continue Protecting My Family
          </button>
          
          <button
            onClick={onMaybeLater}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentBillPopup;