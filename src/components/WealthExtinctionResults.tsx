import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Users, Heart, Brain, Shield, Clock, ArrowDown, ArrowUp, Target, Zap } from 'lucide-react';

interface WealthProjection {
  year: number;
  age: number;
  wealth: number;
  income: number;
  expenses: number;
  netCashFlow: number;
  majorEvents: string[];
  confidenceLevel: number;
}

interface CalculationResults {
  extinctionYear: number;
  yearsRemaining: number;
  currentWealth: number;
  childrenInheritance: number;
  grandchildrenInheritance: number;
  projections: WealthProjection[];
  topWealthDestroyers: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  familyImpact: {
    today: { netWorth: number; status: string };
    inheritance: {
      year: number;
      children: Array<{ name: string; inheritance: number }>;
    };
    grandchildren: { year: number; inheritance: number; collegeShortfall: number };
  };
  protectedScenario: {
    extinctionYear: number;
    additionalYears: number;
    grandchildrenInheritance: number;
    improvements: string[];
  };
  complexityAnalysis: {
    score: number;
    primaryComplexityDrivers: string[];
    coordinationOpportunities: string[];
    optimizationPotential: number;
  };
  scenarioAnalysis: {
    bestCase: { extinctionYear: number; probability: number };
    mostLikely: { extinctionYear: number; probability: number };
    worstCase: { extinctionYear: number; probability: number };
  };
}

interface UserProfile {
  age: number;
  netWorth: number;
  income: number;
  location: string;
  children: number;
  maritalStatus: string;
}

const WealthExtinctionResults: React.FC<{
  results: CalculationResults;
  userProfile: UserProfile;
  onGetProtectionPlan: () => void;
}> = ({ results, userProfile, onGetProtectionPlan }) => {
  const [currentView, setCurrentView] = useState<'shock' | 'timeline' | 'family' | 'complexity' | 'protection'>('shock');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [countdownValue, setCountdownValue] = useState(results.extinctionYear);

  useEffect(() => {
    // Animated countdown effect
    let startValue = 2100;
    const targetValue = results.extinctionYear;
    const duration = 3000; // 3 seconds
    const increment = (startValue - targetValue) / (duration / 50);

    const timer = setInterval(() => {
      startValue -= increment;
      if (startValue <= targetValue) {
        setCountdownValue(targetValue);
        clearInterval(timer);
        setAnimationPhase(1);
      } else {
        setCountdownValue(Math.round(startValue));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [results.extinctionYear]);

  const renderShockRevelation = () => (
    <div className="space-y-8">
      {/* Main Extinction Display */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 border-2 border-red-200 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <span className="text-red-800 font-semibold">WEALTH EXTINCTION ANALYSIS COMPLETE</span>
        </div>

        <div className="relative">
          <div className="text-6xl md:text-8xl font-bold text-red-600 mb-4 animate-pulse">
            {countdownValue}
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Your Family Wealth Dies
          </div>
          <div className="text-lg text-gray-600">
            {results.yearsRemaining} years from today
          </div>
        </div>

        {animationPhase >= 1 && (
          <div className="animate-fade-in bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200 max-w-2xl mx-auto">
            <div className="text-orange-800 space-y-2">
              <p className="font-semibold">When wealth extinction occurs:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">You'll be:</span> {userProfile.age + results.yearsRemaining} years old
                </div>
                <div>
                  <span className="font-medium">Your children inherit:</span> ₹{(results.childrenInheritance / 100000).toFixed(1)}L each
                </div>
                <div>
                  <span className="font-medium">Your grandchildren inherit:</span> ₹{(results.grandchildrenInheritance / 100000).toFixed(1)}L
                </div>
                <div>
                  <span className="font-medium">Family legacy:</span> Extinct
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monte Carlo Results */}
      {animationPhase >= 1 && (
        <div className="animate-slide-in bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Monte Carlo Analysis (10,000 Simulations)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600">{results.scenarioAnalysis.bestCase.extinctionYear}</div>
              <div className="text-sm text-green-700">Best Case (5%)</div>
              <div className="text-xs text-green-600 mt-1">Everything goes perfectly</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{results.scenarioAnalysis.mostLikely.extinctionYear}</div>
              <div className="text-sm text-blue-700">Most Likely (50%)</div>
              <div className="text-xs text-blue-600 mt-1">Normal life events</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600">{results.scenarioAnalysis.worstCase.extinctionYear}</div>
              <div className="text-sm text-red-700">Crisis (5%)</div>
              <div className="text-xs text-red-600 mt-1">Multiple major events</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-yellow-800 font-medium text-center">
              ⚠️ Your timeline varies by {results.scenarioAnalysis.bestCase.extinctionYear - results.scenarioAnalysis.worstCase.extinctionYear} years depending on life events and decisions
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderTimelineVisualization = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wealth Timeline</h2>
        <p className="text-lg text-gray-600">How your family's wealth evolves over time</p>
      </div>

      {/* Interactive Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <div className="space-y-4">
          {results.topWealthDestroyers.map((destroyer, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">{destroyer.factor}</h4>
                <p className="text-red-700 text-sm mt-1">{destroyer.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-red-600">-₹{(destroyer.impact / 100000).toFixed(1)}L</div>
                <div className="text-xs text-red-700">Lifetime Impact</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Drivers */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-500" />
          Primary Complexity Drivers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.complexityAnalysis.primaryComplexityDrivers.map((driver, index) => (
            <div key={index} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-orange-800 font-medium">{driver}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coordination Opportunities */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          Coordination Opportunities
        </h3>
        
        <div className="space-y-3">
          {results.complexityAnalysis.coordinationOpportunities.map((opportunity, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-green-800 font-medium">{opportunity}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-100 rounded-xl border border-green-300">
          <p className="text-green-800 font-bold text-center">
            💰 Total Optimization Potential: ₹{(results.complexityAnalysis.optimizationPotential / 100000).toFixed(1)}L
          </p>
        </div>
      </div>
    </div>
  );

  const renderProtectionStrategy = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Protected vs Unprotected Timeline</h2>
        <p className="text-lg text-gray-600">What systematic protection could achieve for your family</p>
      </div>

      {/* Before vs After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Path */}
        <div className="bg-gradient-to-b from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="text-center space-y-4">
            <div className="text-4xl">😰</div>
            <h3 className="font-bold text-red-800">Current Path</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-red-600">{results.extinctionYear}</div>
              <p className="text-red-700">Wealth extinction year</p>
              <div className="space-y-2 text-sm text-red-700">
                <div>• Children inherit ₹{(results.childrenInheritance / 100000).toFixed(1)}L each</div>
                <div>• Grandchildren inherit ₹0</div>
                <div>• Family legacy ends</div>
                <div>• Coordination failures likely</div>
              </div>
            </div>
          </div>
        </div>

        {/* Protected Path */}
        <div className="bg-gradient-to-b from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="text-center space-y-4">
            <div className="text-4xl">🛡️</div>
            <h3 className="font-bold text-green-800">Protected Path</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-green-600">{results.protectedScenario.extinctionYear}</div>
              <p className="text-green-700">Extended timeline</p>
              <div className="space-y-2 text-sm text-green-700">
                <div>• +{results.protectedScenario.additionalYears} years extension</div>
                <div>• Grandchildren inherit ₹{(results.protectedScenario.grandchildrenInheritance / 100000).toFixed(1)}L</div>
                <div>• Multi-generational wealth</div>
                <div>• Systematic optimization</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protection Improvements */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          How Protection Extends Your Timeline
        </h3>
        
        <div className="space-y-4">
          {results.protectedScenario.improvements.map((improvement, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-blue-800 font-medium">{improvement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Overwhelming Action Plan */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Your DIY Action Plan (47 Steps)
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Immediate Actions (Next 30 Days):</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Update will to reflect current family situation</li>
              <li>• Coordinate parent care assessment with siblings</li>
              <li>• Research children's education financial aid options</li>
              <li>• Review and update all insurance policies</li>
              <li>• Rebalance portfolio for changing risk profile</li>
              <li>• Set up sibling coordination system</li>
              <li>• Create parent care emergency fund</li>
              <li>• ... and 40 more critical actions</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Ongoing Monitoring (Next 15 Years):</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• 47 quarterly investment rebalancing decisions</li>
              <li>• 23 family coordination checkpoints</li>
              <li>• 18 parent care transition management points</li>
              <li>• 31 education funding optimization windows</li>
              <li>• 52 career decision optimization moments</li>
              <li>• 156 market timing and emotional decision points</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ DIY Attempt Warning:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-red-700">
              <div>❌ 78% miss critical optimization opportunities</div>
              <div>❌ 71% experience coordination failures</div>
              <div>❌ 83% underestimate emotional decision impact</div>
              <div>❌ Average timeline reduction: 8.7 years</div>
              <div>❌ Average preventable wealth loss: ₹2.8 Cr</div>
              <div>❌ Family stress and conflict increase</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Value Proposition */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 shadow-lg">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Platform-Managed Families Outperform by 8.3 Years</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">₹12,000</div>
              <div className="text-sm text-green-700">Monthly Investment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+8.3 years</div>
              <div className="text-sm text-blue-700">Average Timeline Extension</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4,200%</div>
              <div className="text-sm text-purple-700">ROI</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">What our platform monitors that you can't:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                247 interconnected variables affecting your timeline
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time optimization opportunities
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Family coordination facilitation
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Professional network activation
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Continuous plan adjustment as life changes
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Crisis scenario management
              </div>
            </div>
          </div>

          <button
            onClick={onGetProtectionPlan}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get My Family Protection Strategy →
          </button>
        </div>
      </div>
    </div>
  );

  const viewTabs = [
    { id: 'shock', label: 'Shock Revelation', icon: AlertTriangle },
    { id: 'timeline', label: 'Wealth Timeline', icon: Clock },
    { id: 'family', label: 'Family Impact', icon: Users },
    { id: 'complexity', label: 'Complexity Web', icon: Brain },
    { id: 'protection', label: 'Protection Strategy', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Family Wealth Extinction Analysis</h1>
              <p className="text-gray-600">Complexity Score: {results.complexityAnalysis.score.toFixed(1)}/10</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Analysis Date</div>
              <div className="font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {viewTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentView === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'shock' && renderShockRevelation()}
          {currentView === 'timeline' && renderTimelineVisualization()}
          {currentView === 'family' && renderFamilyImpact()}
          {currentView === 'complexity' && renderComplexityAnalysis()}
          {currentView === 'protection' && renderProtectionStrategy()}
        </div>
      </div>
    </div>
  );
};

export default WealthExtinctionResults;6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div>
              <h3 className="font-semibold text-green-800">Today (2025)</h3>
              <p className="text-green-700">Building wealth actively</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{(userProfile.netWorth / 100000).toFixed(1)}L</div>
              <div className="text-sm text-green-700">Net Worth</div>
            </div>
          </div>

          {/* Peak Wealth */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">Peak Wealth (~{results.extinctionYear - 15})</h3>
              <p className="text-blue-700">Maximum family wealth achieved</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">₹{((userProfile.netWorth * 2.8) / 100000).toFixed(1)}L</div>
              <div className="text-sm text-blue-700">Estimated Peak</div>
            </div>
          </div>

          {/* Inheritance */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div>
              <h3 className="font-semibold text-orange-800">Your Passing (~{results.familyImpact.inheritance.year})</h3>
              <p className="text-orange-700">Children inherit reduced wealth</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">₹{(results.childrenInheritance / 100000).toFixed(1)}L</div>
              <div className="text-sm text-orange-700">Per Child</div>
            </div>
          </div>

          {/* Extinction */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div>
              <h3 className="font-semibold text-red-800">Wealth Extinction ({results.extinctionYear})</h3>
              <p className="text-red-700">Grandchildren inherit nothing</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">₹0</div>
              <div className="text-sm text-red-700">Family Legacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyImpact = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generational Impact Analysis</h2>
        <p className="text-lg text-gray-600">How wealth extinction affects each generation</p>
      </div>

      {/* Generation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Generation 1 - You */}
        <div className="bg-gradient-to-b from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="text-center space-y-4">
            <div className="text-4xl">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-green-800">Generation 1 (You)</h3>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">₹{(userProfile.netWorth / 100000).toFixed(1)}L</div>
              <p className="text-green-700 text-sm">Built from scratch</p>
              <div className="bg-green-200 rounded-full px-3 py-1 text-xs font-medium text-green-800">
                Wealth Builder
              </div>
            </div>
          </div>
        </div>

        {/* Generation 2 - Children */}
        <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
          <div className="text-center space-y-4">
            <div className="text-4xl">👧👦</div>
            <h3 className="font-bold text-yellow-800">Generation 2 (Children)</h3>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">₹{(results.childrenInheritance / 100000).toFixed(1)}L</div>
              <p className="text-yellow-700 text-sm">Each child inherits</p>
              <div className="bg-yellow-200 rounded-full px-3 py-1 text-xs font-medium text-yellow-800">
                {Math.round((results.childrenInheritance / userProfile.netWorth) * 100)}% of your wealth
              </div>
            </div>
          </div>
        </div>

        {/* Generation 3 - Grandchildren */}
        <div className="bg-gradient-to-b from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="text-center space-y-4">
            <div className="text-4xl">👶👶</div>
            <h3 className="font-bold text-red-800">Generation 3 (Grandchildren)</h3>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">₹0</div>
              <p className="text-red-700 text-sm">Complete extinction</p>
              <div className="bg-red-200 rounded-full px-3 py-1 text-xs font-medium text-red-800">
                Start from zero
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Crisis Scenarios */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Real Family Impact
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Your Children's Reality</h4>
            <p className="text-blue-700 text-sm">
              "Dad, why can't you help with our children's education like grandpa helped us?"
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Your Grandchildren's Question</h4>
            <p className="text-orange-700 text-sm">
              "Why doesn't our family have money for college like other families?"
            </p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">The Legacy You Leave</h4>
            <p className="text-red-700 text-sm">
              Your life's work supporting exactly 2 generations before complete extinction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplexityAnalysis = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Complexity Web</h2>
        <p className="text-lg text-gray-600">247 interconnected variables affecting your wealth timeline</p>
      </div>

      {/* Complexity Score */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-purple-600">
            {results.complexityAnalysis.score.toFixed(1)}/10
          </div>
          <h3 className="text-xl font-semibold text-purple-800">Family Wealth Complexity Score</h3>
          <p className="text-purple-700">
            {results.complexityAnalysis.score < 3 ? 'Low complexity - manageable with basic planning' :
             results.complexityAnalysis.score < 6 ? 'Moderate complexity - requires systematic approach' :
             results.complexityAnalysis.score < 8 ? 'High complexity - professional coordination recommended' :
             'Maximum complexity - platform-level management essential'}
          </p>
        </div>
      </div>

      {/* Top Wealth Destroyers */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-red-500" />
          Top Wealth Destroyers for Your Family
        </h3>
        
        <div className="space-y-4"> </div>
    </div>