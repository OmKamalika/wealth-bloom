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
  // Debug logging
  console.log('🎯 WealthExtinctionResults received props:', {
    results,
    userProfile,
    hasResults: !!results,
    hasUserProfile: !!userProfile,
    resultsKeys: results ? Object.keys(results) : [],
    userProfileKeys: userProfile ? Object.keys(userProfile) : []
  });

  // Safety check for required data
  if (!results || !userProfile) {
    console.error('❌ WealthExtinctionResults: Missing required props');
    console.error('  - results:', results);
    console.error('  - userProfile:', userProfile);
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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

  const [currentPage, setCurrentPage] = useState<'emergency' | 'testimonial' | 'stats'>('emergency');
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);

  // Hide swipe indicator after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate user age at extinction
  const ageAtExtinction = userProfile.age + results.yearsRemaining;

  // Format currency in lakhs (Indian format)
  const formatLakhs = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  // Handle swipe gestures
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      if (currentPage === 'emergency') setCurrentPage('testimonial');
      else if (currentPage === 'testimonial') setCurrentPage('stats');
      else if (currentPage === 'stats') onGetProtectionPlan(); // Proceed to next page on swipe up from last page
    } else if (direction === 'down') {
      if (currentPage === 'stats') setCurrentPage('testimonial');
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
      onGetProtectionPlan();
    }
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
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage]);

  // Emergency page (first screen)
  const renderEmergencyPage = () => (
    <div className="min-h-screen bg-white flex flex-col" onClick={handleScreenClick}>
      <div className="text-center pt-6">
        <h1 className="text-purple-600 text-xl font-medium">FamilyPe</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-6 flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-black" />
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
          <p className="text-xl mb-3">Your children will inherit {formatLakhs(results.childrenInheritance)}</p>
        </div>
      </div>
      
      {showSwipeIndicator && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center animate-bounce">
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

  // Render the current page
  return (
    <div className="relative">
      {currentPage === 'emergency' && renderEmergencyPage()}
      {currentPage === 'testimonial' && renderTestimonialPage()}
      {currentPage === 'stats' && renderStatsPage()}
    </div>
  );
};

export default WealthExtinctionResults;