import React from 'react';
import { X, Check } from 'lucide-react';

interface PaymentSuccessScreenProps {
  onClose: () => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* Success Animation */}
        <div className="w-full h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          You have showed your parents you are there for them.
        </p>

        {/* Transaction Details */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Transaction Details</h3>
              <p className="text-purple-600">Power Co.</p>
            </div>
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
              <div className="text-white font-bold text-xs">ELECTRICITY</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-purple-600 text-sm">Recipient</p>
                <p className="font-medium text-gray-900">Power Co.</p>
              </div>
              <div className="text-right">
                <p className="text-purple-600 text-sm">Sender</p>
                <p className="font-medium text-gray-900">My Account</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-purple-600 text-sm">Transaction ID</p>
                <p className="font-medium text-gray-900">TXN123456789</p>
              </div>
              <div className="text-right">
                <p className="text-purple-600 text-sm">Timestamp</p>
                <p className="font-medium text-gray-900">July 26, 2024, 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="w-full space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Want to share the good news?</h3>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg"
          >
            Just For Me
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all duration-300">
            Text Parents
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all duration-300">
            Update Siblings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;