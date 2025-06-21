import React, { useState, useEffect } from 'react';
import { ArrowRight, Share2, Download, TrendingDown, AlertTriangle, Users, DollarSign } from 'lucide-react';

interface WealthResultsScreenProps {
  calculatorData: any;
  onGetProtectionPlan: () => void;
  onStartOver: () => void;
}

const WealthResultsScreen: React.FC<WealthResultsScreenProps> = ({ 
  calculatorData, 
  onGetProtectionPlan, 
  onStartOver 
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [showFullResults, setShowFullResults] = useState(false);

  const scenes = [
    {
      title: `The ${calculatorData.childrenNames[0] || 'Johnson'} Family Today`,
      content: (
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-4xl">👨‍👩‍👧‍👦</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Net Worth: ${calculatorData.netWorth.toLocaleString()}
          </h3>
          <p className="text-gray-600 italic">"We're doing pretty well..."</p>
        </div>
      )
    },
    {
      title: "But your wealth has a countdown...",
      content: (
        <div className="text-center">
          <div className="flex justify-center items-end space-x-4 mb-8">
            <div className="text-center">
              <div className="w-16 h-32 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg mb-2"></div>
              <p className="text-sm">2025<br/>$750K</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-24 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg mb-2"></div>
              <p className="text-sm">2035<br/>$650K</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg mb-2"></div>
              <p className="text-sm">2045<br/>$480K</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-8 bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg mb-2"></div>
              <p className="text-sm">2055<br/>$250K</p>
            </div>
          </div>
          <p className="text-gray-600">The silent extinction begins</p>
        </div>
      )
    },
    {
      title: "When you pass away...",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-red-50 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              👧 {calculatorData.childrenNames[0] || 'Emma'} (age 47) inherits:
            </h4>
            <div className="text-3xl font-bold text-red-600">$47,000</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              👦 {calculatorData.childrenNames[1] || 'Jake'} (age 43) inherits:
            </h4>
            <div className="text-3xl font-bold text-red-600">$47,000</div>
          </div>
          <p className="text-gray-600">Down from the ${calculatorData.netWorth.toLocaleString()} you have today</p>
        </div>
      )
    },
    {
      title: "💀 WEALTH EXTINCTION DATE:",
      content: (
        <div className="text-center">
          <div className="text-6xl font-bold text-red-600 mb-6 animate-pulse">
            2067
          </div>
          <div className="bg-red-100 rounded-2xl p-6 mb-6">
            <div className="text-2xl font-bold text-red-800 mb-2">42 years remaining</div>
            <div className="text-red-600">Your grandchildren will inherit: $0</div>
          </div>
          <p className="text-gray-600">
            Your family's 3-generation wealth journey ends with {calculatorData.childrenNames[0] || 'Emma'} and {calculatorData.childrenNames[1] || 'Jake'}
          </p>
        </div>
      )
    },
    {
      title: "But this doesn't have to happen...",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <h4 className="font-bold text-red-800 mb-2">WITHOUT PROTECTION</h4>
              <p className="text-sm text-red-600">Extinction: 2067</p>
              <p className="text-sm text-red-600">Grandchildren get: $0</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <h4 className="font-bold text-green-800 mb-2">WITH PROTECTION</h4>
              <p className="text-sm text-green-600">Wealth Extends: 2089+</p>
              <p className="text-sm text-green-600">Grandchildren get: $340K</p>
            </div>
          </div>
          <p className="text-center text-gray-600">
            Small changes today = Massive family impact
          </p>
          <button
            onClick={() => setShowFullResults(true)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl"
          >
            Show Me How to Stop This
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!showFullResults && currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(currentScene + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, showFullResults]);

  if (showFullResults) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-red-50 border-b-2 border-red-200 px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-bold">WEALTH EXTINCTION ALERT</span>
          </div>
          <p className="text-sm text-red-700">
            Your family wealth dies in 2067 • Children inherit $47K each • Grandchildren inherit $0
          </p>
        </div>

        {/* Interactive Timeline */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Interactive Wealth Timeline</h2>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="relative">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Timeline line */}
                <path
                  d="M 50 150 Q 150 100 250 120 Q 300 130 350 180"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Data points */}
                <circle cx="50" cy="150" r="6" fill="#10b981" />
                <circle cx="150" cy="100" r="6" fill="#f59e0b" />
                <circle cx="250" cy="120" r="6" fill="#f97316" />
                <circle cx="350" cy="180" r="6" fill="#ef4444" />
                
                {/* Labels */}
                <text x="50" y="170" textAnchor="middle" className="text-xs fill-gray-600">2025</text>
                <text x="150" y="90" textAnchor="middle" className="text-xs fill-gray-600">2045</text>
                <text x="250" y="110" textAnchor="middle" className="text-xs fill-gray-600">2055</text>
                <text x="350" y="200" textAnchor="middle" className="text-xs fill-gray-600">2067</text>
              </svg>
            </div>
          </div>

          {/* Top Wealth Destroyers */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Killing Your Wealth?</h3>
            <div className="space-y-4">
              {[
                { icon: '🏥', title: 'Unplanned Parent Care', amount: '$127,000', percentage: '35%', description: 'Without coordination, parent emergencies drain wealth' },
                { icon: '🎓', title: 'Education Cost Inflation', amount: '$89,000', percentage: '24%', description: `${calculatorData.childrenNames[0] || 'Emma'} & ${calculatorData.childrenNames[1] || 'Jake'}'s college will cost 60% more than today` },
                { icon: '⚖️', title: 'Estate Planning Gaps', amount: '$67,000', percentage: '18%', description: 'Legal fees and taxes without proper planning' },
                { icon: '💸', title: 'Lifestyle Inflation', amount: '$54,000', percentage: '15%', description: 'Spending growth outpacing wealth growth' },
                { icon: '📈', title: 'Investment Fees', amount: '$31,000', percentage: '8%', description: 'High fees compounding over decades' }
              ].map((destroyer, index) => (
                <div key={index} className="bg-red-50 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{destroyer.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{destroyer.title}</h4>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{destroyer.amount}</div>
                          <div className="text-sm text-red-500">({destroyer.percentage} of loss)</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{destroyer.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Impact */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Family's Future</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-bold text-green-800 mb-4">TODAY (2025)</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    <span>Net Worth: ${calculatorData.netWorth.toLocaleString()}</span>
                  </p>
                  <p className="text-green-700">Feeling secure</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6">
                <h4 className="font-bold text-red-800 mb-4">INHERITANCE (2067)</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-2xl">👧</span>
                    <span>{calculatorData.childrenNames[0] || 'Emma'} receives: $47,000</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-2xl">👦</span>
                    <span>{calculatorData.childrenNames[1] || 'Jake'} receives: $47,000</span>
                  </p>
                  <p className="text-red-700">"Why so little, Dad?"</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <button
              onClick={onGetProtectionPlan}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Get My FREE Protection Plan
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex gap-3">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <button
              onClick={onStartOver}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
            >
              Calculate Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">{scenes[currentScene].title}</h2>
          <div className="min-h-[300px] flex items-center justify-center">
            {scenes[currentScene].content}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentScene ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {currentScene === scenes.length - 1 && !showFullResults && (
          <p className="text-gray-300 text-sm">
            Click "Show Me How to Stop This" to see your detailed analysis
          </p>
        )}
      </div>
    </div>
  );
};

export default WealthResultsScreen;