import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ConfirmPaymentScreenProps {
  onBack: () => void;
  onConfirmPayment: () => void;
}

const ConfirmPaymentScreen: React.FC<ConfirmPaymentScreenProps> = ({ onBack, onConfirmPayment }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Confirm Payment</h1>
      </div>

      <div className="px-6 py-6">
        {/* Biller Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-600 text-sm font-medium">Electricity</p>
              <h2 className="text-xl font-bold text-gray-900">Power Grid Inc.</h2>
              <p className="text-purple-600 text-sm">Account Number: 1234567890</p>
            </div>
            <div className="w-20 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2" 
                alt="Power lines" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Pay with UPI</h4>
              <p className="text-purple-600 text-sm">UPI</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Bill Amount</span>
              <span className="font-semibold text-gray-900">₹120.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Convenience Fee</span>
              <span className="font-semibold text-gray-900">₹2.00</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-medium">Total Payable</span>
                <span className="text-xl font-bold text-gray-900">₹122.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Message */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-center">
          <p className="text-gray-600 text-sm">
            Your payment is secured by our advanced encryption technology.
          </p>
        </div>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={onConfirmPayment}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg"
        >
          Pay ₹122.00
        </button>
      </div>
    </div>
  );
};

export default ConfirmPaymentScreen;