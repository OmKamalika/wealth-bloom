import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalDecisionsScreenProps {
  onNext: () => void;
}

const FinalDecisionsScreen: React.FC<FinalDecisionsScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Digital Will</h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">Step 5 of 5</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full w-full transition-all duration-300"></div>
          </div>
          <div className="text-sm text-purple-600 mt-2">One more step!</div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Three decisions, and you're done.
          </h2>
          <p className="text-gray-600 mb-8">
            These are the only decisions that really matter.
          </p>

          {/* Decision Cards */}
          <div className="space-y-4 mb-8">
            {/* Decision 1 */}
            <div className="bg-yellow-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg"></div>
              </div>
              <div>
                <div className="text-sm text-purple-600 font-medium mb-1">Decision 1</div>
                <h3 className="font-bold text-gray-900 mb-1">Distributing assets</h3>
                <p className="text-sm text-gray-600">How should your assets be distributed?</p>
              </div>
            </div>

            {/* Decision 2 */}
            <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 bg-orange-200 rounded-lg"></div>
              </div>
              <div>
                <div className="text-sm text-purple-600 font-medium mb-1">Decision 2</div>
                <h3 className="font-bold text-gray-900 mb-1">Handling affairs</h3>
                <p className="text-sm text-gray-600">Who should handle your affairs?</p>
              </div>
            </div>

            {/* Decision 3 */}
            <div className="bg-teal-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 bg-teal-200 rounded-lg"></div>
              </div>
              <div>
                <div className="text-sm text-purple-600 font-medium mb-1">Decision 3</div>
                <h3 className="font-bold text-gray-900 mb-1">Medical decisions</h3>
                <p className="text-sm text-gray-600">Who should make medical decisions for you?</p>
              </div>
            </div>
          </div>

          {/* Completion Message */}
          <div className="bg-green-50 rounded-2xl p-4 mb-8 text-center">
            <p className="text-green-800 mb-2">
              Perfect choices. These decisions protect your family from confusion and conflict.
            </p>
            <p className="text-green-700 font-medium">Achievement unlocked!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Create My Will Now
            <ArrowRight className="w-5 h-5" />
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300">
            Let's make your will bulletproof
          </button>

          <button className="w-full text-gray-600 hover:text-gray-800 font-medium py-4 transition-colors">
            Maybe Later
          </button>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            You can update this anytime. Perfect is the enemy of done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalDecisionsScreen;