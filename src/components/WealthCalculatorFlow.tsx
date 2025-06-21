import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';

interface CalculatorData {
  age: number;
  zipCode: string;
  maritalStatus: 'single' | 'married' | 'divorced';
  children: number;
  childrenNames: string[];
  netWorth: number;
  income: string;
  mainConcern: string;
  parentsSituation: string;
  email: string;
}

interface WealthCalculatorFlowProps {
  onComplete: (data: CalculatorData) => void;
  onBack: () => void;
}

const WealthCalculatorFlow: React.FC<WealthCalculatorFlowProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CalculatorData>({
    age: 42,
    zipCode: '',
    maritalStatus: 'married',
    children: 2,
    childrenNames: ['Emma', 'Jake'],
    netWorth: 750000,
    income: '$100K-$150K',
    mainConcern: 'parent-care',
    parentsSituation: 'may-need-support',
    email: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start loading sequence
      setIsLoading(true);
      setTimeout(() => {
        onComplete(data);
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateData = (field: keyof CalculatorData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔮 Analyzing Your Family's Future
            </h2>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full transition-all duration-1000 w-4/5"></div>
          </div>

          <div className="space-y-4 text-gray-600">
            <p>⚡ Calculating 75-year wealth projection...</p>
            <p>💡 Did you know: The average family loses $340,000 in preventable wealth destruction?</p>
            <p>🔍 Almost done... Preparing your results</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's start with the basics</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-4">How old are you?</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="25"
                      max="65"
                      value={data.age}
                      onChange={(e) => updateData('age', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>25</span>
                      <span className="font-bold text-purple-600">{data.age} years old</span>
                      <span>65</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Where do you live?</label>
                  <input
                    type="text"
                    value={data.zipCode}
                    onChange={(e) => updateData('zipCode', e.target.value)}
                    placeholder="Zip Code"
                    className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who are you protecting?</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-4">Marital Status:</label>
                  <div className="flex gap-4">
                    {['single', 'married', 'divorced'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateData('maritalStatus', status)}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                          data.maritalStatus === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-4">How many children do you have?</label>
                  <div className="flex gap-3">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateData('children', num)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          data.children === num
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num === 4 ? '4+' : num}
                      </button>
                    ))}
                  </div>
                </div>

                {data.children > 0 && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Children's names (optional):</label>
                    <div className="flex gap-3">
                      {Array.from({ length: Math.min(data.children, 3) }).map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          value={data.childrenNames[index] || ''}
                          onChange={(e) => {
                            const newNames = [...data.childrenNames];
                            newNames[index] = e.target.value;
                            updateData('childrenNames', newNames);
                          }}
                          placeholder={`Child ${index + 1}`}
                          className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's your rough net worth today?</h2>
              <p className="text-gray-600 mb-6">(Include home equity, savings, investments)</p>
              
              <div className="space-y-6">
                <div>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={data.netWorth}
                    onChange={(e) => updateData('netWorth', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>$0</span>
                    <span className="font-bold text-purple-600 text-lg">
                      ${data.netWorth.toLocaleString()}
                    </span>
                    <span>$5M+</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-blue-800 text-sm">
                    💡 Based on your zip code, this seems reasonable
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-4">Annual household income:</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['$50K-$75K', '$75K-$100K', '$100K-$150K', '$150K-$200K', '$200K+'].map((income) => (
                      <button
                        key={income}
                        onClick={() => updateData('income', income)}
                        className={`px-4 py-3 rounded-2xl font-medium transition-all text-left ${
                          data.income === income
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {income}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Family Reality Check</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-4">What's your biggest family financial worry?</label>
                  <div className="space-y-3">
                    {[
                      { id: 'parent-care', label: 'Parent care costs as they age' },
                      { id: 'college', label: "Kids' college expenses" },
                      { id: 'retirement', label: 'Not having enough for retirement' },
                      { id: 'medical', label: 'Unexpected medical emergencies' },
                      { id: 'economic', label: 'Economic uncertainty/job loss' }
                    ].map((concern) => (
                      <button
                        key={concern.id}
                        onClick={() => updateData('mainConcern', concern.id)}
                        className={`w-full px-4 py-3 rounded-2xl font-medium transition-all text-left ${
                          data.mainConcern === concern.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {concern.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-4">Your parents' situation:</label>
                  <div className="space-y-3">
                    {[
                      { id: 'independent', label: 'Financially independent' },
                      { id: 'may-need-support', label: 'May need some support' },
                      { id: 'already-helping', label: 'Already helping with costs' }
                    ].map((situation) => (
                      <button
                        key={situation.id}
                        onClick={() => updateData('parentsSituation', situation.id)}
                        className={`w-full px-4 py-3 rounded-2xl font-medium transition-all text-left ${
                          data.parentsSituation === situation.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {situation.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick summary - look right?</h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <span>You: {data.age} years old, {data.maritalStatus}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <span>Family: {data.children} children {data.childrenNames.length > 0 && `(${data.childrenNames.join(', ')})`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <span>Net Worth: ~${data.netWorth.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span>Location: {data.zipCode}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span>Main Concern: {data.mainConcern.replace('-', ' ')}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Get your personalized results:</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={handlePrevious} className="p-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps} • Lightning Round ⚡</p>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-purple-600 mt-2">{Math.round(progress)}% done already!</p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={currentStep === 5 && !data.email}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentStep === totalSteps ? (
            <>
              <span>Calculate My Timeline</span>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WealthCalculatorFlow;