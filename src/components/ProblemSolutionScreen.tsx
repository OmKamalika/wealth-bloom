import React from 'react';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';

interface ProblemSolutionScreenProps {
  onNext: () => void;
}

const ProblemSolutionScreen: React.FC<ProblemSolutionScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Stop the Wealth Death clock</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 leading-tight">
            7 minutes now prevents 7 months of family chaos later.
          </h1>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6 mb-10">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-900 font-medium">Family knows your wishes</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-900 font-medium">Assets go where you want</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-900 font-medium">Kids get the right guardian</p>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-900 font-medium">Everything settles quickly</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600">Family fights over decisions</p>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600">State decides who gets what</p>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600">Court picks their guardian</p>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600">Probate drags on for months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <p className="text-gray-900 text-center leading-relaxed">
            Without this, your family faces 7 months of confusion, court battles, and heartbreak. With this, they get clarity, closure, and can focus on healing.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg"
      >
        Start My 7-Minute Will
      </button>
    </div>
  );
};

export default ProblemSolutionScreen;