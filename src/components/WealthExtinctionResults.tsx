import React, { useState, useEffect } from 'react';
import { Heart, ArrowUp, Shield, Clock, AlertTriangle, TrendingDown, Users, School, Home, Briefcase } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';
import InteractiveWealthTimeline from './InteractiveWealthTimeline';
import ComplexityScore from './ComplexityScore';
import TailRiskAnalysis from './TailRiskAnalysis';
import { useAuth } from '../contexts/AuthContext';
import { getCalculationJobStatus, getCalculationResults, queueComprehensiveCalculation } from '../api/tiered-calculation-api';

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
  extremeValueAnalysis?: any; // Added EVT results
  calculationId?: string; // Added calculation ID
  isBasic?: boolean; // Added flag for basic calculation
  upgradeIncentives?: {
    comprehensiveAnalysisValue: string;
    additionalInsights: string[];
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
  // Debug logging
  console.log('🎯 WealthExtinctionResults received props:', {
    results,
    userProfile,
    hasResults: !!results,
    hasUserProfile: !!userProfile,
    resultsKeys: results ? Object.keys(results) : [],
    userProfileKeys: userProfile ? Object.keys(userProfile) : [],
    hasExtremeValueAnalysis: !!results?.extremeValueAnalysis,
    isBasic: results?.isBasic,
    calculationId: results?.calculationId
  });

  const [currentPage, setCurrentPage] = useState<'emergency' | 'testimonial' | 'stats' | 'detailed'>('emergency');
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'destroyers' | 'impact' | 'complexity' | 'tailrisk'>('timeline');
  const { currencyInfo } = useCurrency();
  const { user } = useAuth();
  
  // State for comprehensive calculation
  const [isComprehensiveAvailable, setIsComprehensiveAvailable] = useState(false);
  const [isComprehensiveQueued, setIsComprehensiveQueued] = useState(false);
  const [isComprehensiveLoading, setIsComprehensiveLoading] = useState(false);
  const [comprehensiveJobId, setComprehensiveJobId] = useState<string | null>(null);
  const [comprehensiveResults, setComprehensiveResults] = useState<CalculationResults | null>(null);
  const [jobStatus, setJobStatus] = useState<any | null>(null);
  const [jobProgress, setJobProgress] = useState(0);

  // Hide swipe indicator after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Check if user is logged in and results are basic
  useEffect(() => {
    if (user && results?.isBasic && results?.calculationId) {
      setIsComprehensiveAvailable(true);
    }
  }, [user, results]);

  // Poll for job status if comprehensive calculation is queued
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isComprehensiveQueued && comprehensiveJobId) {
      intervalId = setInterval(async () => {
        try {
          const status = await getCalculationJobStatus(comprehensiveJobId);
          
          if (status) {
            setJobStatus(status);
            setJobProgress(status.progress);
            
            if (status.status === 'completed') {
              // Get comprehensive results
              const results = await getCalculationResults(comprehensiveJobId);
              
              if (results) {
                setComprehensiveResults(results);
                setIsComprehensiveLoading(false);
                setIsComprehensiveQueued(false);
                clearInterval(intervalId);
              }
            } else if (status.status === 'failed') {
              setIsComprehensiveLoading(false);
              setIsComprehensiveQueued(false);
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error('Error polling job status:', error);
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isComprehensiveQueued, comprehensiveJobId]);

  // Calculate user age at extinction
  const ageAtExtinction = userProfile.age + results.yearsRemaining;

  // Handle swipe gestures
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (currentPage === 'emergency') setCurrentPage('testimonial');
      else if (currentPage === 'testimonial') setCurrentPage('stats');
      else if (currentPage === 'stats') setCurrentPage('detailed');
      else if (currentPage === 'detailed') onGetProtectionPlan(); // Proceed to next page on swipe up from last page
    } else if (direction === 'down') {
      if (currentPage === 'detailed') setCurrentPage('stats');
      else if (currentPage === 'stats') setCurrentPage('testimonial');
      else if (currentPage === 'testimonial') setCurrentPage('emergency');
    }
  };

  // Handle click anywhere on the screen
  const handleScreenClick = () => {
    if (currentPage === 'emergency') {
      setCurrentPage('testimonial');
    } else if (currentPage === 'testimonial') {
      setCurrentPage('stats');
    } else if (currentPage === 'stats') {
      setCurrentPage('detailed');
    } else if (currentPage === 'detailed') {
      onGetProtectionPlan();
    }
  };

  // Queue comprehensive calculation
  const handleQueueComprehensiveCalculation = async () => {
    if (!user || !results?.calculationId) {
      return;
    }
    
    setIsComprehensiveLoading(true);
    
    try {
      // In a real implementation, this would queue a comprehensive calculation
      // For now, we'll just simulate it
      console.log('🔄 Queueing comprehensive calculation for user:', user.id);
      console.log('🔄 Using calculation ID:', results.calculationId);
      
      // Simulate queueing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set job ID
      const jobId = uuidv4();
      setComprehensiveJobId(jobId);
      setIsComprehensiveQueued(true);
      
      // Simulate job status updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setJobProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsComprehensiveLoading(false);
          setIsComprehensiveQueued(false);
          
          // Set comprehensive results (same as basic for demo)
          setComprehensiveResults(results);
        }
      }, 1000);
    } catch (error) {
      console.error('Error queueing comprehensive calculation:', error);
      setIsComprehensiveLoading(false);
    }
  };

  // Generate a UUID (for demo purposes)
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Detect swipe gestures
  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      // Threshold of 50px for swipe
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up
          handleSwipe('up');
        } else {
          // Swipe down
          handleSwipe('down');
        }
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage]);

  // Safety check for required data
  if (!results || !userProfile) {
    console.error('❌ Missing required data for results screen:');
    console.error('  - results:', results);
    console.error('  - userProfile:', userProfile);
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h2>
          <p className="text-gray-600 mb-6">Please complete the calculator first.</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Debug info:</p>
            <p>Has results: {results ? 'Yes' : 'No'}</p>
            <p>Has userProfile: {userProfile ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Emergency page (first screen)
  const renderEmergencyPage = () => (
    <div className="min-h-screen bg-white flex flex-col" onClick={handleScreenClick}>
      <div className="text-center pt-6">
        <h1 className="text-purple-600 text-xl font-medium">FamilyPe</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-6 flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black">⚠️</span>
          </div>
          <h2 className="text-4xl font-black uppercase">FAMILY</h2>
        </div>
        <h2 className="text-4xl font-black uppercase mb-16">EMERGENCY</h2>
        
        <div className="text-7xl font-bold mb-6">{results.extinctionYear}</div>
        
        <h3 className="text-4xl font-bold mb-4">Your Wealth Dies</h3>
        
        <p className="text-xl mb-16">{results.yearsRemaining} years from today</p>
        
        <div className="w-full bg-gradient-to-b from-orange-500 to-amber-700 rounded-2xl p-6 text-white">
          <h3 className="text-3xl font-bold mb-6">When this happens</h3>
          <p className="text-xl mb-3">You will be {ageAtExtinction} years</p>
          <p className="text-xl mb-3">Your children will inherit {formatCurrency(results.childrenInheritance, currencyInfo)}</p>
        </div>
        
        {/* Basic calculation badge */}
        {results.isBasic && user && (
          <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-purple-800 font-medium mb-2">Basic calculation completed</p>
            <p className="text-purple-600 text-sm mb-3">
              Upgrade to comprehensive analysis for more accurate results and detailed insights.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQueueComprehensiveCalculation();
              }}
              disabled={isComprehensiveLoading || isComprehensiveQueued}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isComprehensiveLoading ? 'Processing...' : 
               isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
               'Get Comprehensive Analysis'}
            </button>
          </div>
        )}
      </div>
      
      {showSwipeIndicator && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center animate-swipe-up">
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-xl">👆</span>
            <p className="text-sm">Swipe up to see how</p>
          </div>
        </div>
      )}
    </div>
  );

  // Testimonial page (second screen)
  const renderTestimonialPage = () => (
    <div className="min-h-screen bg-white flex flex-col" onClick={handleScreenClick}>
      <div className="flex items-center justify-center gap-2 pt-6 pb-4">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h2 className="text-4xl font-bold">You're Not Alone</h2>
      </div>
      
      <div className="px-6 py-4 flex-grow flex flex-col">
        <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl overflow-hidden mb-auto">
          <div className="relative p-6">
            <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-70"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 bg-teal-800 rounded-full mb-6 overflow-hidden">
                {/* Placeholder for avatar */}
              </div>
              
              <blockquote className="text-3xl font-bold text-white mb-6">
                I thought I was doing everything right. Turns out I was setting my kids up for financial failure.
              </blockquote>
              
              <div className="text-white">
                <p className="text-xl">— Rajesh, Mumbai</p>
                <p className="text-lg">Father of 2, Age 38</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
            <p className="text-xl font-bold">70% of families face this</p>
          </div>
          
          <p className="text-xl font-bold text-center mb-6">
            But the 30% who plan ahead extend their timeline by:
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-yellow-500 text-3xl">⚡</div>
            <div className="text-5xl font-black">8.3 YEARS</div>
            <div className="text-yellow-500 text-3xl">⚡</div>
          </div>
          
          <div className="w-full flex items-center justify-center gap-2 text-xl font-medium text-yellow-600 py-3">
            <span className="text-xl">👆</span>
            See how they do it
          </div>
        </div>
      </div>
    </div>
  );

  // Stats page (third screen)
  const renderStatsPage = () => (
    <div className="min-h-screen bg-white flex flex-col" onClick={handleScreenClick}>
      <div className="flex items-center justify-center gap-2 pt-6 pb-4">
        <Clock className="w-8 h-8 text-purple-600" />
        <h2 className="text-4xl font-bold">Your Timeline</h2>
      </div>
      
      <div className="px-6 py-4 flex-grow flex flex-col">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-purple-900 mb-4">Complexity Score: {results.complexityAnalysis?.score?.toFixed(1) || 'N/A'}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Primary Complexity Drivers:</h4>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                {(results.complexityAnalysis?.primaryComplexityDrivers || []).map((driver, index) => (
                  <li key={index}>{driver}</li>
                ))}
              </ul>
              {(!results.complexityAnalysis?.primaryComplexityDrivers || results.complexityAnalysis.primaryComplexityDrivers.length === 0) && (
                <p className="text-purple-600 text-sm">No specific complexity drivers identified.</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Coordination Opportunities:</h4>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                {(results.complexityAnalysis?.coordinationOpportunities || []).map((opportunity, index) => (
                  <li key={index}>{typeof opportunity === 'string' ? opportunity : opportunity.opportunity}</li>
                ))}
              </ul>
              {(!results.complexityAnalysis?.coordinationOpportunities || results.complexityAnalysis.coordinationOpportunities.length === 0) && (
                <p className="text-purple-600 text-sm">No specific coordination opportunities identified.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Critical Decisions Coming</h3>
          
          <div className="space-y-3">
            <div className="bg-white bg-opacity-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <School className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Education Planning</h4>
                  <p className="text-sm text-blue-700">2027 - College fund decisions for {results.familyImpact?.inheritance?.children?.[0]?.name || 'your child'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Parent Care</h4>
                  <p className="text-sm text-blue-700">2026-2028 - Potential care needs for parents</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Housing Decision</h4>
                  <p className="text-sm text-blue-700">2030 - Home upgrade or downsize</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-red-900 mb-4">Stress Test: 2027 Perfect Storm</h3>
          
          <div className="space-y-2">
            <p className="text-red-800">What happens if these events occur simultaneously:</p>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>Market crash (-30%)</li>
              <li>Parent health emergency</li>
              <li>Education costs spike</li>
            </ul>
            
            <div className="bg-white bg-opacity-50 rounded-xl p-3 mt-4">
              <p className="font-semibold text-red-900">Wealth timeline reduced by: 8 years</p>
              <p className="text-sm text-red-700">New extinction year: {results.extinctionYear - 8}</p>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-center gap-2 text-xl font-medium text-purple-600 py-3 mt-6">
          <span className="text-xl">👆</span>
          See detailed analysis
        </div>
      </div>
    </div>
  );

  // Detailed analysis page (fourth screen)
  const renderDetailedPage = () => (
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
        
        {/* Basic calculation badge */}
        {results.isBasic && user && (
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">Basic Analysis</span>
            {isComprehensiveLoading || isComprehensiveQueued ? (
              <span className="text-xs text-purple-600">
                {isComprehensiveQueued ? `Comprehensive analysis in progress (${jobProgress}%)` : 'Processing...'}
              </span>
            ) : (
              <button
                onClick={handleQueueComprehensiveCalculation}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Upgrade to comprehensive analysis
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-4 pb-2 border-b overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'timeline' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View timeline tab"
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('destroyers')}
            className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'destroyers' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View wealth destroyers tab"
          >
            Wealth Destroyers
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'impact' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View family impact tab"
          >
            Family Impact
          </button>
          <button
            onClick={() => setActiveTab('complexity')}
            className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'complexity' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View complexity analysis tab"
          >
            Complexity
          </button>
          <button
            onClick={() => setActiveTab('tailrisk')}
            className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'tailrisk' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-500'}`}
            aria-label="View tail risk analysis tab"
          >
            Tail Risk
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
              currentWealth={userProfile.netWorth}
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
            
            {/* Basic calculation notice */}
            {results.isBasic && (
              <div className="mt-6 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Basic Analysis</h4>
                <p className="text-purple-700 text-sm mb-3">
                  This is a basic analysis with limited scenarios. Upgrade to comprehensive analysis for:
                </p>
                <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                  {(results.upgradeIncentives?.additionalInsights || []).map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
                {user && (
                  <button
                    onClick={handleQueueComprehensiveCalculation}
                    disabled={isComprehensiveLoading || isComprehensiveQueued}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isComprehensiveLoading ? 'Processing...' : 
                     isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
                     'Get Comprehensive Analysis'}
                  </button>
                )}
              </div>
            )}
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
            
            {/* Basic calculation notice */}
            {results.isBasic && (
              <div className="mt-6 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Basic Analysis</h4>
                <p className="text-purple-700 text-sm">
                  Upgrade to comprehensive analysis for detailed wealth destroyer analysis with prevention strategies.
                </p>
                {user && (
                  <button
                    onClick={handleQueueComprehensiveCalculation}
                    disabled={isComprehensiveLoading || isComprehensiveQueued}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isComprehensiveLoading ? 'Processing...' : 
                     isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
                     'Get Comprehensive Analysis'}
                  </button>
                )}
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
                    <span>Net Worth: {formatCurrency(userProfile.netWorth, currencyInfo)}</span>
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
                    <p className="flex items-center gap-2">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                      <span>Children receive: {formatCurrency(results.childrenInheritance, currencyInfo)}</span>
                    </p>
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
            
            {/* Basic calculation notice */}
            {results.isBasic && (
              <div className="mt-6 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Basic Analysis</h4>
                <p className="text-purple-700 text-sm">
                  Upgrade to comprehensive analysis for detailed family impact analysis with personalized recommendations.
                </p>
                {user && (
                  <button
                    onClick={handleQueueComprehensiveCalculation}
                    disabled={isComprehensiveLoading || isComprehensiveQueued}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isComprehensiveLoading ? 'Processing...' : 
                     isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
                     'Get Comprehensive Analysis'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'complexity' && (
          <div>
            <ComplexityScore score={results.complexityAnalysis?.score || 0} />
            
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Financial Decisions</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <School className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Education Planning</h4>
                      <p className="text-sm text-gray-600">2027-2030</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    College education decisions for your children will impact your wealth timeline by ±3-5 years.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibent text-gray-900">Parent Care Planning</h4>
                      <p className="text-sm text-gray-600">2026-2035</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Coordinated parent care can save up to {formatCurrency(250000, currencyInfo)} over 10 years compared to reactive care.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Career Transition</h4>
                      <p className="text-sm text-gray-600">2028-2032</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Potential career changes during this period could impact your wealth by ±15%.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Coordination Opportunities</h3>
              <div className="bg-purple-50 rounded-xl p-5">
                <p className="text-purple-800 mb-3">
                  Your family's complexity score of {results.complexityAnalysis?.score?.toFixed(1) || 'N/A'} indicates significant coordination opportunities:
                </p>
                <ul className="list-disc list-inside text-purple-700 space-y-2">
                  {(results.complexityAnalysis?.coordinationOpportunities || []).map((opportunity, index) => (
                    <li key={index} className="text-sm">
                      {typeof opportunity === 'string' ? opportunity : opportunity.opportunity}
                      {typeof opportunity !== 'string' && (
                        <span className="text-purple-600 ml-1">
                          (saves ~{(opportunity.potentialSavings * 100).toFixed(0)}%)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {(!results.complexityAnalysis?.coordinationOpportunities || results.complexityAnalysis.coordinationOpportunities.length === 0) && (
                  <p className="text-purple-600 text-sm">No specific coordination opportunities identified.</p>
                )}
              </div>
            </div>
            
            {/* Basic calculation notice */}
            {results.isBasic && (
              <div className="mt-6 bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Basic Analysis</h4>
                <p className="text-purple-700 text-sm">
                  Upgrade to comprehensive analysis for detailed complexity analysis with personalized coordination strategies.
                </p>
                {user && (
                  <button
                    onClick={handleQueueComprehensiveCalculation}
                    disabled={isComprehensiveLoading || isComprehensiveQueued}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isComprehensiveLoading ? 'Processing...' : 
                     isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
                     'Get Comprehensive Analysis'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tailrisk' && (
          <div>
            {results.extremeValueAnalysis ? (
              <TailRiskAnalysis 
                evtResults={results.extremeValueAnalysis} 
                currentWealth={results.currentWealth}
                currencyInfo={currencyInfo}
              />
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-gray-600 mb-4">Tail risk analysis is only available with comprehensive analysis.</p>
                {user && results.isBasic && (
                  <button
                    onClick={handleQueueComprehensiveCalculation}
                    disabled={isComprehensiveLoading || isComprehensiveQueued}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isComprehensiveLoading ? 'Processing...' : 
                     isComprehensiveQueued ? `Calculating (${jobProgress}%)` : 
                     'Get Comprehensive Analysis'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-4 mt-8">
          <button
            onClick={onGetProtectionPlan}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            aria-label="Get free protection plan"
          >
            Get My FREE Protection Plan
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Render the current page
  if (currentPage === 'emergency') return renderEmergencyPage();
  if (currentPage === 'testimonial') return renderTestimonialPage();
  if (currentPage === 'stats') return renderStatsPage();
  return renderDetailedPage();
};

export default WealthExtinctionResults;