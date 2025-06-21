import React, { useState, useEffect } from 'react';
import { ArrowRight, Share2, Download, TrendingDown, AlertTriangle, Users, DollarSign } from 'lucide-react';
import InteractiveWealthTimeline from './InteractiveWealthTimeline';
import AnimatedResultsReveal from './AnimatedResultsReveal';
import SocialShareModal from './SocialShareModal';
import { analytics } from '../utils/analytics';

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
  const [showAnimatedReveal, setShowAnimatedReveal] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullResults, setShowFullResults] = useState(false);

  const { inputs, results } = calculatorData;
  const childrenNames = inputs.childrenNames.filter((name: string) => name.trim() !== '');

  useEffect(() => {
    // Track results view
    analytics.trackCalculatorComplete(inputs, results);
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimatedReveal(false);
    setShowFullResults(true);
  };

  const handleSkipAnimation = () => {
    setShowAnimatedReveal(false);
    setShowFullResults(true);
    analytics.track('animation_skipped', { scene: 'results_reveal' });
  };

  const handleShare = () => {
    setShowShareModal(true);
    analytics.track('share_modal_opened', { source: 'results_screen' });
  };

  const handleGetProtectionPlan = () => {
    analytics.track('protection_plan_requested', {
      extinction_year: results.extinctionYear,
      emotional_state: analytics.getEmotionalMetrics()
    });
    onGetProtectionPlan();
  };

  // Show animated reveal first
  if (showAnimatedReveal) {
    return (
      <AnimatedResultsReveal
        calculatorData={calculatorData}
        onComplete={handleAnimationComplete}
        onSkip={handleSkipAnimation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-red-50 border-b-2 border-red-200 px-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-red-600 font-bold">WEALTH EXTINCTION ALERT</span>
        </div>
        <p className="text-sm text-red-700">
          Your family wealth dies in {results.extinctionYear} • Children inherit ${results.childrenInheritance.toLocaleString()} each • Grandchildren inherit $0
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Interactive Timeline */}
        <div className="mb-8">
          <InteractiveWealthTimeline
            projections={results.projections}
            extinctionYear={results.extinctionYear}
            currentWealth={inputs.netWorth}
            protectedScenario={{
              extinctionYear: results.protectedScenario.extinctionYear,
              projections: results.projections.map(p => ({
                ...p,
                wealth: p.wealth * 1.3 // Simulate protected scenario
              }))
            }}
          />
        </div>

        {/* Top Wealth Destroyers */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What's Killing Your Wealth?</h3>
          <div className="space-y-4">
            {results.topWealthDestroyers.map((destroyer: any, index: number) => (
              <div key={destroyer.id} className="bg-red-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{destroyer.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{destroyer.title}</h4>
                      <div className="text-right">
                        <div className="font-bold text-red-600">${destroyer.amount.toLocaleString()}</div>
                        <div className="text-sm text-red-500">({destroyer.percentage}% of loss)</div>
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
                  <span>Net Worth: ${inputs.netWorth.toLocaleString()}</span>
                </p>
                <p className="text-green-700">Feeling secure</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-2xl p-6">
              <h4 className="font-bold text-red-800 mb-4">INHERITANCE ({results.extinctionYear})</h4>
              <div className="space-y-2">
                {childrenNames.map((name: string, index: number) => (
                  <p key={index} className="flex items-center gap-2">
                    <span className="text-2xl">{index === 0 ? '👧' : '👦'}</span>
                    <span>{name} receives: ${results.childrenInheritance.toLocaleString()}</span>
                  </p>
                ))}
                <p className="text-red-700">"Why so little, Dad?"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Comparison */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Protection Impact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <h4 className="font-bold text-red-800 mb-2">WITHOUT PROTECTION</h4>
              <p className="text-sm text-red-600">Extinction: {results.extinctionYear}</p>
              <p className="text-sm text-red-600">Grandchildren get: $0</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <h4 className="font-bold text-green-800 mb-2">WITH PROTECTION</h4>
              <p className="text-sm text-green-600">Wealth Extends: {results.protectedScenario.extinctionYear}+</p>
              <p className="text-sm text-green-600">Grandchildren get: ${results.protectedScenario.grandchildrenInheritance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGetProtectionPlan}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            Get My FREE Protection Plan
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
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

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        calculatorData={calculatorData}
      />
    </div>
  );
};

export default WealthResultsScreen;