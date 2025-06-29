import React, { useState, useEffect } from 'react';
import { ArrowRight, Share2, Download, TrendingDown, AlertTriangle, Users, DollarSign } from 'lucide-react';
import InteractiveWealthTimeline from './InteractiveWealthTimeline';
import AnimatedResultsReveal from './AnimatedResultsReveal';
import SocialShareModal from './SocialShareModal';
import { analytics } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';

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
  const [activeTab, setActiveTab] = useState<'timeline' | 'destroyers' | 'impact'>('timeline');
  const { currencyInfo } = useCurrency();

  // Debug logging
  console.log('🎯 WealthResultsScreen received calculatorData:', calculatorData);

  // Safely extract data with fallbacks
  const { inputs, results } = calculatorData || {};
  
  console.log('📊 Extracted inputs:', inputs);
  console.log('📊 Extracted results:', results);
  
  // Get children names from the correct data structure
  const childrenNames = inputs?.childrenContext?.children?.map((child: any) => child.name) || 
                       inputs?.childrenNames || 
                       ['Child 1', 'Child 2']; // Fallback names
  
  // Get net worth from the correct field
  const netWorth = inputs?.financialFoundation?.currentNetWorth || 
                   inputs?.netWorth || 
                   results?.currentWealth || 
                   0;

  console.log('👶 Children names:', childrenNames);
  console.log('💰 Net worth:', netWorth);

  useEffect(() => {
    // Track results view
    if (inputs && results) {
      analytics.trackCalculatorComplete(inputs, results);
    }
  }, [inputs, results]);

  const handleAnimationComplete = () => {
    setShowAnimatedReveal(false);
    setShowFullResults(true);
    analytics.track('animation_completed', { 
      scene: 'results_reveal',
      emotional_state: analytics.getEmotionalMetrics()
    });
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
      extinction_year: results?.extinctionYear,
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

  // Safety check for required data
  if (!results || !inputs) {
    console.error('❌ Missing required data for results screen:');
    console.error('  - results:', results);
    console.error('  - inputs:', inputs);
    console.error('  - calculatorData:', calculatorData);
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h2>
          <p className="text-gray-600 mb-6">Please complete the calculator first.</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Debug info:</p>
            <p>Has calculatorData: {calculatorData ? 'Yes' : 'No'}</p>
            <p>Has inputs: {inputs ? 'Yes' : 'No'}</p>
            <p>Has results: {results ? 'Yes' : 'No'}</p>
          </div>
          <button
            onClick={onStartOver}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Start Calculator
          </button>
        </div>
      </div>
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
          Your family wealth dies in {results.extinctionYear} • Children inherit {formatCurrency(results.childrenInheritance, currencyInfo)} • Grandchildren inherit {formatCurrency(results.grandchildrenInheritance, currencyInfo)}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-4 pb-2 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2 px-1 ${activeTab === 'timeline' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View timeline tab"
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('destroyers')}
            className={`pb-2 px-1 ${activeTab === 'destroyers' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View wealth destroyers tab"
          >
            Wealth Destroyers
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`pb-2 px-1 ${activeTab === 'impact' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View family impact tab"
          >
            Family Impact
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {activeTab === 'timeline' && (
          <div>
            {/* Interactive Timeline */}
            <InteractiveWealthTimeline
              projections={results.projections || []}
              extinctionYear={results.extinctionYear}
              currentWealth={netWorth}
              protectedScenario={{
                extinctionYear: results.protectedScenario?.extinctionYear || results.extinctionYear + 5,
                projections: (results.projections || []).map((p: any) => ({
                  ...p,
                  wealth: p.wealth * 1.3 // Simulate protected scenario
                }))
              }}
            />
            
            {/* Scenario Analysis */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Scenario Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-green-800 mb-2">Best Case</h4>
                  <p className="text-sm text-green-600">Year: {results.scenarioAnalysis?.bestCase?.extinctionYear || (results.extinctionYear + 10)}</p>
                  <p className="text-sm text-green-600">Probability: {((results.scenarioAnalysis?.bestCase?.probability || 0.1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-yellow-800 mb-2">Most Likely</h4>
                  <p className="text-sm text-yellow-600">Year: {results.scenarioAnalysis?.mostLikely?.extinctionYear || results.extinctionYear}</p>
                  <p className="text-sm text-yellow-600">Probability: {((results.scenarioAnalysis?.mostLikely?.probability || 0.6) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-red-800 mb-2">Worst Case</h4>
                  <p className="text-sm text-red-600">Year: {results.scenarioAnalysis?.worstCase?.extinctionYear || (results.extinctionYear - 5)}</p>
                  <p className="text-sm text-red-600">Probability: {((results.scenarioAnalysis?.worstCase?.probability || 0.1) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destroyers' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Killing Your Wealth?</h3>
            <div className="space-y-4">
              {(results.topWealthDestroyers || []).map((destroyer: any, index: number) => (
                <div key={index} className="bg-red-50 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{destroyer.factor}</h4>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{formatCurrency(destroyer.impact, currencyInfo)}</div>
                          <div className="text-sm text-red-500">({(destroyer.impact / results.currentWealth * 100).toFixed(1)}% impact)</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{destroyer.description}</p>
                      {destroyer.preventionStrategy && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700"><strong>Prevention:</strong> {destroyer.preventionStrategy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!results.topWealthDestroyers || results.topWealthDestroyers.length === 0) && (
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-gray-600">No specific wealth destroyers identified.</p>
                </div>
              )}
            </div>
            
            {/* Complexity Analysis */}
            {results.complexityAnalysis && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Complexity Analysis</h3>
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-purple-900">Complexity Score</h4>
                    <div className="text-2xl font-bold text-purple-700">{results.complexityAnalysis.score.toFixed(1)}/10</div>
                  </div>
                  
                  {results.complexityAnalysis.primaryComplexityDrivers && results.complexityAnalysis.primaryComplexityDrivers.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-purple-800 mb-2">Primary Complexity Drivers:</h5>
                      <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                        {results.complexityAnalysis.primaryComplexityDrivers.map((driver: string, index: number) => (
                          <li key={index}>{driver}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.complexityAnalysis.coordinationOpportunities && results.complexityAnalysis.coordinationOpportunities.length > 0 && (
                    <div>
                      <h5 className="font-medium text-purple-800 mb-2">Coordination Opportunities:</h5>
                      <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                        {results.complexityAnalysis.coordinationOpportunities.map((opportunity: string, index: number) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'impact' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Family's Future</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-bold text-green-800 mb-4">TODAY (2025)</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    <span>Net Worth: {formatCurrency(netWorth, currencyInfo)}</span>
                  </p>
                  <p className="text-green-700">{results.familyImpact?.today?.status || "Feeling secure"}</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6">
                <h4 className="font-bold text-red-800 mb-4">INHERITANCE ({results.familyImpact?.inheritance?.year || results.extinctionYear})</h4>
                <div className="space-y-2">
                  {results.familyImpact?.inheritance?.children ? 
                    results.familyImpact.inheritance.children.map((child: any, index: number) => (
                      <p key={index} className="flex items-center gap-2">
                        <span className="text-2xl">{index === 0 ? '👧' : '👦'}</span>
                        <span>{child.name} receives: {formatCurrency(child.inheritance, currencyInfo)}</span>
                      </p>
                    )) : 
                    childrenNames.map((name: string, index: number) => (
                      <p key={index} className="flex items-center gap-2">
                        <span className="text-2xl">{index === 0 ? '👧' : '👦'}</span>
                        <span>{name} receives: {formatCurrency(results.childrenInheritance / childrenNames.length, currencyInfo)}</span>
                      </p>
                    ))
                  }
                  <p className="text-red-700">"Why so little, Dad?"</p>
                </div>
              </div>
            </div>
            
            {/* Grandchildren Impact */}
            <div className="mt-6">
              <div className="bg-orange-50 rounded-2xl p-6">
                <h4 className="font-bold text-orange-800 mb-4">GRANDCHILDREN ({results.familyImpact?.grandchildren?.year || (results.extinctionYear + 30)})</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-2xl">👶</span>
                    <span>Inheritance: {formatCurrency(results.grandchildrenInheritance, currencyInfo)}</span>
                  </p>
                  {results.familyImpact?.grandchildren?.collegeShortfall && (
                    <p className="flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      <span>College Shortfall: {formatCurrency(results.familyImpact.grandchildren.collegeShortfall, currencyInfo)}</span>
                    </p>
                  )}
                  <p className="text-orange-700">"What happened to our family's wealth?"</p>
                </div>
              </div>
            </div>
            
            {/* Protection Comparison */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Protection Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-red-800 mb-2">WITHOUT PROTECTION</h4>
                  <p className="text-sm text-red-600">Extinction: {results.extinctionYear}</p>
                  <p className="text-sm text-red-600">Grandchildren get: {formatCurrency(results.grandchildrenInheritance, currencyInfo)}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <h4 className="font-bold text-green-800 mb-2">WITH PROTECTION</h4>
                  <p className="text-sm text-green-600">Wealth Extends: {results.protectedScenario?.extinctionYear || (results.extinctionYear + 5)}+</p>
                  <p className="text-sm text-green-600">Grandchildren get: {formatCurrency(results.protectedScenario?.grandchildrenInheritance || (results.grandchildrenInheritance * 3), currencyInfo)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-4 mt-8">
          <button
            onClick={handleGetProtectionPlan}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            aria-label="Get free protection plan"
          >
            Get My FREE Protection Plan
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
              aria-label="Share results"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
            <button 
              onClick={() => {
                analytics.track('download_pdf_clicked', { source: 'results_screen' });
                // In a real implementation, this would call the PDF generation API
                alert('PDF download would be implemented in production');
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
              aria-label="Download PDF report"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <button
            onClick={onStartOver}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
            aria-label="Calculate again"
          >
            Calculate Again
          </button>
        </div>
      </div>    

      {/* Social Share Modal */}
      {showShareModal && (
        <SocialShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculatorData={calculatorData}
        />
      )}
    </div>
  );
};

export default WealthResultsScreen;