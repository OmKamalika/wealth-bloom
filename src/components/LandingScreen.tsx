import React from 'react';
import { ArrowRight } from 'lucide-react';
import WealthDeathClock from './WealthDeathClock';

interface LandingScreenProps {
  onNext: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        {/* Phone Mockup */}
        <div className="relative mb-12 flex justify-center">
          <div className="w-48 h-96 bg-gray-900 rounded-[2rem] p-1 shadow-2xl">
            <div className="w-full h-full bg-gray-800 rounded-[1.75rem] relative overflow-hidden">
              {/* Status Bar */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-900 rounded-full"></div>
              
              {/* Screen Content */}
              <div className="flex flex-col items-center justify-center h-full text-white px-4">
                <div className="text-sm font-medium mb-16">Mom at 2:17 AM</div>
                
                {/* Contact Info */}
                <div className="flex items-center gap-2 mb-20">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm">Connaun</span>
                  <div className="w-4 h-4 bg-gray-600 rounded-full ml-auto"></div>
                </div>
                
                {/* Call Buttons */}
                <div className="flex gap-12">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl font-bold text-center mb-6 leading-tight text-gray-900">
          The hardest call to get is the one you're not ready for.
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-center mb-4 leading-relaxed px-2">
          It's 2:47 AM. Your phone is ringing. When crisis hits your family, everyone looks for answers. 
          <span className="text-gray-900 font-semibold"> Most families don't have them.</span>
        </p>

        {/* Empowering Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            You're about to be different.<br />
            You're about to be prepared.
          </h2>
        </div>

        <WealthDeathClock />
      </div>

      {/* CTA Button */}
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg mt-6"
      >
        I'm Ready
      </button>
    </div>
  );
};

export default LandingScreen;