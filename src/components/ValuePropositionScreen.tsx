import React from 'react';
import { ArrowRight, HelpCircle, FileText, Users } from 'lucide-react';

interface ValuePropositionScreenProps {
  onNext: () => void;
}

const ValuePropositionScreen: React.FC<ValuePropositionScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-8 flex flex-col">
      <div className="flex-1">
        {/* Family Photo */}
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-xs h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl p-4 shadow-lg">
            <div className="w-full h-full bg-white rounded-xl p-6 flex flex-col items-center justify-center">
              {/* Simplified family illustration */}
              <div className="relative">
                {/* Parents */}
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 bg-orange-300 rounded-full"></div>
                  <div className="w-14 h-14 bg-orange-200 rounded-full"></div>
                </div>
                {/* Children */}
                <div className="flex gap-3 justify-center">
                  <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
                  <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 leading-tight">
            This isn't about death.<br />
            It's about showing up.
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            A will isn't a death document. It's a love letter to your family when they need you most. It says: "Even when I can't be there, I'm still taking care of you."
          </p>
        </div>

        {/* Three Step Process */}
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">Answer a few simple questions</h3>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">Get your digital will — legally sound, downloadable, shareable</h3>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">Add your emergency contacts & documents so your family's never left guessing</h3>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 font-medium text-base">
          Takes 10 minutes. Works in every state. Feels like a weight lifted.
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg mt-8"
      >
        Show Me
      </button>
    </div>
  );
};

export default ValuePropositionScreen;