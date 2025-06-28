import React, { useState, useEffect } from 'react';
import { calculateWealthExtinction } from '../api/calculate-wealth-api';

// This is a simplified version of the component for demonstration purposes
// In a real implementation, this would include all the input forms and validation

const WealthCalculatorFlow: React.FC<{
  onComplete: (data: any) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    inputs: {
      coreIdentity: {
        age: 35,
        maritalStatus: 'married',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          cityType: 'metro'
        },
        financialSophistication: 'moderate'
      },
      financialFoundation: {
        currentNetWorth: 5000000, // ₹50L
        annualIncome: 1200000, // ₹12L
        primaryIncomeSource: 'salary',
        investmentAllocation: {
          stocks: 0.6,
          bonds: 0.3,
          realEstate: 0.1,
          alternatives: 0
        }
      },
      childrenContext: {
        children: [
          {
            name: 'Arjun',
            age: 8,
            academicPerformance: 'above_average',
            educationAspirations: 'private_premium'
          },
          {
            name: 'Meera',
            age: 5,
            academicPerformance: 'exceptional',
            educationAspirations: 'international'
          }
        ]
      },
      familyCareContext: {
        parents: [
          {
            name: 'Father',
            age: 65,
            healthStatus: 'good',
            financialIndependence: 'independent'
          },
          {
            name: 'Mother',
            age: 62,
            healthStatus: 'fair',
            financialIndependence: 'occasional_support'
          }
        ],
        siblings: [],
        spouseParents: []
      },
      behavioralProfile: {
        riskTolerance: 'moderate',
        marketCrashResponse: 'worry_hold',
        planningApproach: 'important_overwhelming'
      },
      complexityAnalysis: {
        complexityScore: 6.8,
        sandwichGenerationOverload: true
      }
    }
  });

  // Simulate form completion and calculation
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Call the API to calculate wealth extinction
      const results = await calculateWealthExtinction(calculatorData.inputs);
      
      // Complete the calculation flow
      onComplete({
        inputs: calculatorData.inputs,
        results
      });
    } catch (error) {
      console.error('Calculation error:', error);
      // Handle error state
    } finally {
      setIsCalculating(false);
    }
  };

  // For demo purposes, automatically calculate after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Wealth Extinction Calculator</h1>
        
        {isCalculating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Calculating your family's wealth timeline...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-700">Preparing your calculation...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WealthCalculatorFlow;