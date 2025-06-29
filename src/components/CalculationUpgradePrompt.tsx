import React from 'react';
import { ArrowRight, Zap, Shield, Brain, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CalculationUpgradePromptProps {
  calculationId: string;
  upgradeIncentives: {
    comprehensiveAnalysisValue: string;
    additionalInsights: string[];
  };
  onUpgrade: () => void;
  onSignIn: () => void;
}

const CalculationUpgradePrompt: React.FC<CalculationUpgradePromptProps> = ({
  calculationId,
  upgradeIncentives,
  onUpgrade,
  onSignIn
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Upgrade Your Analysis</h3>
          <p className="text-purple-700">{upgradeIncentives.comprehensiveAnalysisValue}</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Advanced Monte Carlo Simulation</h4>
            <p className="text-sm text-gray-600">5,000+ scenarios for more accurate projections</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tail Risk Analysis</h4>
            <p className="text-sm text-gray-600">Understand and protect against extreme events</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Family Coordination Strategies</h4>
            <p className="text-sm text-gray-600">Personalized recommendations for your family</p>
          </div>
        </div>
      </div>
      
      {user ? (
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          Get Comprehensive Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-gray-700 font-medium">
            Sign in to access comprehensive analysis
          </p>
          <button
            onClick={onSignIn}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Sign In or Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <p className="text-center text-xs text-gray-500 mt-4">
        Comprehensive analysis is available for registered users only.
        Your basic results will be preserved and enhanced.
      </p>
    </div>
  );
};

export default CalculationUpgradePrompt;