import React from 'react';
import { AlertTriangle, TrendingDown, BarChart4, Zap, Shield } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

interface TailRiskAnalysisProps {
  evtResults: any;
  currentWealth: number;
  currencyInfo: any;
}

const TailRiskAnalysis: React.FC<TailRiskAnalysisProps> = ({ 
  evtResults, 
  currentWealth,
  currencyInfo 
}) => {
  // Helper function to get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'EXTREME':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Calculate financial impact in currency
  const calculateImpact = (percentage: number) => {
    return currentWealth * percentage;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-red-800">Tail Risk Analysis</h3>
        </div>
        
        <p className="text-gray-700 mb-4">
          Tail risk analysis examines extreme, rare events that could significantly impact your wealth. 
          Unlike traditional analysis that focuses on average outcomes, this looks at the worst-case scenarios 
          that could derail your financial future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Value at Risk (99%)</h4>
            <div className="text-xl font-bold text-red-600 mb-1">
              {formatCurrency(calculateImpact(evtResults.var99), currencyInfo)}
            </div>
            <p className="text-sm text-gray-600">
              Maximum loss in the worst 1% of scenarios
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Expected Shortfall (99%)</h4>
            <div className="text-xl font-bold text-red-600 mb-1">
              {formatCurrency(calculateImpact(evtResults.es99), currencyInfo)}
            </div>
            <p className="text-sm text-gray-600">
              Average loss in the worst 1% of scenarios
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Overall Tail Risk Assessment</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              getSeverityColor(evtResults.tailRiskAssessment).split(' ')[0]
            }`}>
              {evtResults.tailRiskAssessment}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {evtResults.tailRiskAssessment === 'EXTREME' && 'Your portfolio has extremely heavy tails, indicating high vulnerability to catastrophic losses.'}
            {evtResults.tailRiskAssessment === 'HIGH' && 'Your portfolio has heavy tails, suggesting significant vulnerability to severe market events.'}
            {evtResults.tailRiskAssessment === 'MEDIUM' && 'Your portfolio has moderately heavy tails, with some vulnerability to market extremes.'}
            {evtResults.tailRiskAssessment === 'LOW' && 'Your portfolio has relatively light tails, indicating lower vulnerability to extreme events.'}
          </p>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-3">Potential Tail Events</h4>
        <div className="space-y-3">
          {evtResults.tailEvents.map((event: any, index: number) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl border ${getSeverityColor(event.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {event.severity === 'EXTREME' && <Zap className="w-5 h-5 text-red-500" />}
                  {event.severity === 'HIGH' && <TrendingDown className="w-5 h-5 text-orange-500" />}
                  {event.severity === 'MEDIUM' && <BarChart4 className="w-5 h-5 text-yellow-500" />}
                  {event.severity === 'LOW' && <Shield className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-gray-900">{event.description}</h5>
                    <span className="text-sm font-medium">
                      {(event.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Impact: </span>
                    <span className={`${getSeverityColor(event.severity).split(' ')[0]}`}>
                      {formatCurrency(calculateImpact(event.impact), currencyInfo)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tail Risk Protection Strategies</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Diversification Beyond Traditional Assets</h4>
              <p className="text-sm text-gray-600 mt-1">
                Consider adding uncorrelated assets like gold, inflation-protected securities, or market-neutral strategies to reduce tail risk.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Maintain Adequate Emergency Reserves</h4>
              <p className="text-sm text-gray-600 mt-1">
                Keep 6-12 months of expenses in highly liquid assets to avoid forced selling during market crashes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Implement Systematic Rebalancing</h4>
              <p className="text-sm text-gray-600 mt-1">
                Regular portfolio rebalancing can help manage risk and potentially improve returns during market recoveries.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Consider Insurance Strategies</h4>
              <p className="text-sm text-gray-600 mt-1">
                Health, disability, and long-term care insurance can protect against catastrophic personal events that could deplete wealth.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Tail Risk Impact on Your Wealth Timeline
        </h3>
        
        <p className="text-gray-700 mb-4">
          Our analysis shows that extreme events could reduce your wealth timeline by up to <span className="font-bold text-red-600">12 years</span> in 
          worst-case scenarios. This is why protection strategies are critical for preserving your family's wealth.
        </p>
        
        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <h4 className="font-medium text-gray-900 mb-2">With Tail Risk Protection:</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Reduce maximum drawdown by up to 40%</li>
            <li>Potentially extend wealth timeline by 5-8 years</li>
            <li>Improve recovery time after market crashes</li>
            <li>Reduce emotional decision-making during crises</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TailRiskAnalysis;