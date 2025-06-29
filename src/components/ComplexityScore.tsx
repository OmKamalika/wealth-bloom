import React from 'react';
import { motion } from 'framer-motion';

interface ComplexityScoreProps {
  score: number;
}

const ComplexityScore: React.FC<ComplexityScoreProps> = ({ score }) => {
  // Determine color based on score
  const getColor = (score: number) => {
    if (score < 3) return { bg: 'from-green-400 to-green-500', text: 'text-green-800' };
    if (score < 5) return { bg: 'from-green-500 to-yellow-500', text: 'text-yellow-800' };
    if (score < 7) return { bg: 'from-yellow-400 to-orange-500', text: 'text-orange-800' };
    return { bg: 'from-orange-500 to-red-500', text: 'text-red-800' };
  };

  const colors = getColor(score);
  
  // Calculate percentage for the gauge
  const percentage = (score / 10) * 100;
  
  // Get complexity level description
  const getComplexityLevel = (score: number) => {
    if (score < 3) return 'Low Complexity';
    if (score < 5) return 'Moderate Complexity';
    if (score < 7) return 'High Complexity';
    if (score < 9) return 'Very High Complexity';
    return 'Extreme Complexity';
  };
  
  // Get complexity factors
  const getComplexityFactors = (score: number) => {
    const factors = [];
    
    if (score >= 3) factors.push('Multiple financial decisions');
    if (score >= 5) factors.push('Family coordination challenges');
    if (score >= 6) factors.push('Sandwich generation pressures');
    if (score >= 7) factors.push('Complex care responsibilities');
    if (score >= 8) factors.push('High wealth transfer risks');
    
    return factors;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Family Complexity Score</h3>
      
      {/* Score Gauge */}
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
        <motion.div 
          className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm drop-shadow-md">{score.toFixed(1)} / 10</span>
        </div>
      </div>
      
      {/* Complexity Level */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`font-bold text-lg ${colors.text}`}
        >
          {getComplexityLevel(score)}
        </motion.div>
      </div>
      
      {/* Complexity Factors */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700 text-sm">Key Complexity Factors:</h4>
        <ul className="space-y-1">
          {getComplexityFactors(score).map((factor, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {factor}
            </motion.li>
          ))}
        </ul>
      </div>
      
      {/* Impact Description */}
      <motion.div 
        className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <p>
          {score < 5 
            ? "Your family situation is relatively straightforward. With basic planning, you can effectively manage your wealth trajectory."
            : score < 7
            ? "Your family situation has moderate complexity. Coordinated planning will help you navigate upcoming financial decisions."
            : "Your family situation has significant complexity. Professional coordination may be needed to optimize your wealth trajectory."}
        </p>
      </motion.div>
    </div>
  );
};

export default ComplexityScore;