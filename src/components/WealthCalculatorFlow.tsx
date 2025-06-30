import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, TrendingUp, Users, Heart, Brain, Clock, Shield, Calculator } from 'lucide-react';
import { calculateWealthExtinction } from '../api/calculate-wealth-api';
import { performBasicCalculation } from '../api/tiered-calculation-api';
import { AgeSlider } from './AgeSlider';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';
import { BasicCalculationInputs } from '../types/tiered-calculation';
import { useAuth } from '../contexts/AuthContext';
import { getOptimizedLocation } from '../utils/geolocation';
import { CalculatorData } from '../types/calculator';

// Type for form section names
const WealthCalculatorFlow: React.FC<{
  onComplete: (data: any) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const { currencyInfo } = useCurrency();
  const { user } = useAuth();
  
  // Form data state
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    coreIdentity: {
      age: 35,
      gender: 'prefer_not_to_say',
      maritalStatus: 'married',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '',
        cityType: 'metro'
      },
      education: {
        level: 'bachelors',
        institution: 'tier2'
      },
      financialSophistication: 'moderate',
      employment: {
        status: 'corporate',
        industry: 'technology',
        roleLevel: 'mid'
      }
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
          educationAspirations: 'private_premium',
          currentSchoolType: 'private_english'
        },
        {
          name: 'Meera',
          age: 5,
          academicPerformance: 'exceptional',
          educationAspirations: 'international',
          currentSchoolType: 'international'
        }
      ]
    },
    familyCareContext: {
      parents: [
        {
          name: 'Father',
          age: 65,
          healthStatus: 'good',
          financialIndependence: 'independent',
          currentMonthlyCost: 0,
          livingArrangement: 'independent',
          location: 'same_city'
        },
        {
          name: 'Mother',
          age: 62,
          healthStatus: 'fair',
          financialIndependence: 'occasional_support',
          currentMonthlyCost: 15000,
          livingArrangement: 'independent',
          location: 'same_city'
        }
      ],
      siblings: [],
      spouseParents: [],
      familyCoordination: 'good'
    },
    behavioralProfile: {
      riskTolerance: 'moderate',
      marketCrashResponse: 'worry_hold',
      biggestFear: 'retirement_insufficient',
      planningApproach: 'important_overwhelming',
      reviewFrequency: 'monthly'
    },
    complexityAnalysis: {
      complexityScore: 6.8,
      majorDecisions: [],
      interconnections: [],
      sandwichGenerationOverload: true
    }
  });

  // Handle form field changes with proper typing
  const handleInputChange = (section: string, field: string, value: any) => {
    setCalculatorData(prevData => ({
      ...prevData,
      [section]: {
        ...(prevData[section as keyof CalculatorData] as Record<string, any>),
        [field]: value
      }
    }));
  };

  // Handle nested field changes with proper typing
  const handleNestedInputChange = (section: string, parentField: string, field: string, value: any) => {
    setCalculatorData(prevData => ({
      ...prevData,
      [section]: {
        ...(prevData[section as keyof CalculatorData] as Record<string, any>),
        [parentField]: {
          ...((prevData[section as keyof CalculatorData] as Record<string, any>)[parentField] as Record<string, any>),
          [field]: value
        }
      }
    }));
  };

  // Calculate wealth extinction
  const handleCalculate = async () => {
    setIsCalculating(true);
    setCalculationError(null);
    
    try {
      // Detect user's location for more accurate results
      try {
        const location = await getOptimizedLocation();
        console.log('📍 Detected location:', location);
        
        // Update location in calculator data
        setCalculatorData(prevData => ({
          ...prevData,
          coreIdentity: {
            ...prevData.coreIdentity,
            location: {
              ...prevData.coreIdentity.location,
              city: location.city,
              state: location.state,
              cityType: location.cityType
            }
          }
        }));
      } catch (locationError) {
        console.warn('⚠️ Could not detect location:', locationError);
        // Continue with existing location data
      }
      
      // Prepare basic inputs for tiered calculation
      const basicInputs: BasicCalculationInputs = {
        age: calculatorData.coreIdentity.age,
        netWorth: calculatorData.financialFoundation.currentNetWorth,
        annualIncome: calculatorData.financialFoundation.annualIncome,
        children: calculatorData.childrenContext.children.length,
        riskTolerance: calculatorData.behavioralProfile.riskTolerance as any,
        location: calculatorData.coreIdentity.location.cityType as any,
        maritalStatus: calculatorData.coreIdentity.maritalStatus as any,
        parentCare: calculatorData.familyCareContext.parents.length > 0
      };
      
      console.log('🔄 Using tiered calculation approach');
      console.log('👤 User authenticated:', !!user);
      
      // For all users, first get immediate basic results
      const basicResults = await performBasicCalculation(basicInputs);
      
      // If user is authenticated, queue comprehensive calculation in background
      if (user) {
        console.log('🔄 User is authenticated, queueing comprehensive calculation');
        // In a real implementation, we would queue a comprehensive calculation here
        // For now, we'll just use the basic results
      }
      
      // Complete the calculation flow with basic results
      onComplete({
        inputs: calculatorData,
        results: basicResults,
        calculationId: basicResults.calculationId,
        isBasic: true
      });
    } catch (error) {
      console.error('Calculation error:', error);
      // Set error state to display to user
      setCalculationError(error instanceof Error ? error.message : 'An error occurred during calculation');
      // Don't call onComplete if there's an error
    } finally {
      setIsCalculating(false);
    }
  };

  // Go to next step
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCalculate();
    }
  };

  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  // Render error state if calculation failed
  if (calculationError) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Calculation Error</h1>
          <p className="text-gray-600 mb-6">{calculationError}</p>
          <button
            onClick={() => {
              setCalculationError(null);
              handleCalculate();
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="block w-full mt-4 text-gray-600 hover:text-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render loading state during calculation
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Wealth Extinction Calculator</h1>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Calculating your family's wealth timeline...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Running Monte Carlo simulations</p>
                  <p className="text-xs text-gray-500">Analyzing multiple scenarios</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Projecting financial trajectory</p>
                  <p className="text-xs text-gray-500">Modeling long-term wealth timeline</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Analyzing family impact</p>
                  <p className="text-xs text-gray-500">Calculating generational wealth transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your age</label>
                <AgeSlider 
                  value={calculatorData.coreIdentity.age}
                  min={18}
                  max={90}
                  onChange={(value) => handleInputChange('coreIdentity', 'age', value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Marital status</label>
                <div className="grid grid-cols-2 gap-4">
                  {['single', 'married', 'divorced', 'widowed'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleInputChange('coreIdentity', 'maritalStatus', status)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.coreIdentity.maritalStatus === status
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Employment status</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'corporate', label: 'Corporate' },
                    { value: 'business_owner', label: 'Business Owner' },
                    { value: 'self_employed', label: 'Self-employed' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleNestedInputChange('coreIdentity', 'employment', 'status', option.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.coreIdentity.employment.status === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Industry</label>
                <select
                  value={calculatorData.coreIdentity.employment.industry}
                  onChange={(e) => handleNestedInputChange('coreIdentity', 'employment', 'industry', e.target.value)}
                  className="w-full p-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Role level</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'junior', label: 'Junior' },
                    { value: 'mid', label: 'Mid-level' },
                    { value: 'senior', label: 'Senior' },
                    { value: 'leadership', label: 'Leadership' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleNestedInputChange('coreIdentity', 'employment', 'roleLevel', option.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.coreIdentity.employment.roleLevel === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={calculatorData.coreIdentity.location.city}
                      onChange={(e) => handleNestedInputChange('coreIdentity', 'location', 'city', e.target.value)}
                      placeholder="Enter your city"
                      className="w-full p-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      value={calculatorData.coreIdentity.location.state}
                      onChange={(e) => handleNestedInputChange('coreIdentity', 'location', 'state', e.target.value)}
                      placeholder="Enter your state"
                      className="w-full p-3 bg-gray-100 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'metro', label: 'Metro City' },
                        { value: 'tier2', label: 'Tier 2 City' },
                        { value: 'tier3', label: 'Tier 3 City' },
                        { value: 'rural', label: 'Rural Area' }
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleNestedInputChange('coreIdentity', 'location', 'cityType', option.value)}
                          className={`p-3 rounded-xl border-2 transition-colors ${
                            calculatorData.coreIdentity.location.cityType === option.value
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Your financial foundation</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Current net worth</label>
                <div className="mb-2">
                  <input
                    type="range"
                    min="100000"
                    max="50000000"
                    step="100000"
                    value={calculatorData.financialFoundation.currentNetWorth}
                    onChange={(e) => handleInputChange('financialFoundation', 'currentNetWorth', parseInt(e.target.value))}
                    className="custom-slider w-full"
                  />
                </div>
                <div className="text-center text-xl font-bold text-purple-600">
                  {formatCurrency(calculatorData.financialFoundation.currentNetWorth, currencyInfo)}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Annual household income</label>
                <div className="mb-2">
                  <input
                    type="range"
                    min="300000"
                    max="10000000"
                    step="100000"
                    value={calculatorData.financialFoundation.annualIncome}
                    onChange={(e) => handleInputChange('financialFoundation', 'annualIncome', parseInt(e.target.value))}
                    className="custom-slider w-full"
                  />
                </div>
                <div className="text-center text-xl font-bold text-purple-600">
                  {formatCurrency(calculatorData.financialFoundation.annualIncome, currencyInfo)}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Primary income source</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'salary', label: 'Salary' },
                    { value: 'business', label: 'Business' },
                    { value: 'mixed', label: 'Mixed' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('financialFoundation', 'primaryIncomeSource', option.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.financialFoundation.primaryIncomeSource === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Your family structure</h2>
            
            <div className="space-y-8">
              {/* Children Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-4">Children</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  {calculatorData.childrenContext.children.length > 0 ? (
                    <div className="space-y-4">
                      {calculatorData.childrenContext.children.map((child, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={child.name}
                                onChange={(e) => {
                                  const newChildren = [...calculatorData.childrenContext.children];
                                  newChildren[index] = { ...newChildren[index], name: e.target.value };
                                  handleInputChange('childrenContext', 'children', newChildren);
                                }}
                                placeholder="Child's name"
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newChildren = [...calculatorData.childrenContext.children];
                                newChildren.splice(index, 1);
                                handleInputChange('childrenContext', 'children', newChildren);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 p-2"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Age</label>
                              <input
                                type="number"
                                min="0"
                                max="25"
                                value={child.age}
                                onChange={(e) => {
                                  const newChildren = [...calculatorData.childrenContext.children];
                                  newChildren[index] = { ...newChildren[index], age: parseInt(e.target.value) };
                                  handleInputChange('childrenContext', 'children', newChildren);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Academic Performance</label>
                              <select
                                value={child.academicPerformance}
                                onChange={(e) => {
                                  const newChildren = [...calculatorData.childrenContext.children];
                                  newChildren[index] = { ...newChildren[index], academicPerformance: e.target.value as any };
                                  handleInputChange('childrenContext', 'children', newChildren);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="struggling">Struggling</option>
                                <option value="average">Average</option>
                                <option value="above_average">Above Average</option>
                                <option value="exceptional">Exceptional</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Education Aspirations</label>
                              <select
                                value={child.educationAspirations}
                                onChange={(e) => {
                                  const newChildren = [...calculatorData.childrenContext.children];
                                  newChildren[index] = { ...newChildren[index], educationAspirations: e.target.value as any };
                                  handleInputChange('childrenContext', 'children', newChildren);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="public_state">Public State College</option>
                                <option value="public_premium">Public Premium College</option>
                                <option value="private_state">Private State College</option>
                                <option value="private_premium">Private Premium College</option>
                                <option value="international">International University</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Current School Type</label>
                              <select
                                value={child.currentSchoolType}
                                onChange={(e) => {
                                  const newChildren = [...calculatorData.childrenContext.children];
                                  newChildren[index] = { ...newChildren[index], currentSchoolType: e.target.value as any };
                                  handleInputChange('childrenContext', 'children', newChildren);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="government">Government School</option>
                                <option value="private_vernacular">Private Vernacular</option>
                                <option value="private_english">Private English</option>
                                <option value="international">International School</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No children added yet</p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newChildren = [...calculatorData.childrenContext.children];
                      newChildren.push({
                        name: `Child ${newChildren.length + 1}`,
                        age: 5,
                        academicPerformance: 'average',
                        educationAspirations: 'private_state',
                        currentSchoolType: 'private_english'
                      });
                      handleInputChange('childrenContext', 'children', newChildren);
                    }}
                    className="w-full mt-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    + Add Child
                  </button>
                </div>
              </div>
              
              {/* Parents Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-4">Parents requiring care</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  {calculatorData.familyCareContext.parents.length > 0 ? (
                    <div className="space-y-4">
                      {calculatorData.familyCareContext.parents.map((parent, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={parent.name}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], name: e.target.value };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                placeholder="Parent's name"
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newParents = [...calculatorData.familyCareContext.parents];
                                newParents.splice(index, 1);
                                handleInputChange('familyCareContext', 'parents', newParents);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 p-2"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Age</label>
                              <input
                                type="number"
                                min="50"
                                max="100"
                                value={parent.age}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], age: parseInt(e.target.value) };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Health Status</label>
                              <select
                                value={parent.healthStatus}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], healthStatus: e.target.value as any };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Financial Independence</label>
                              <select
                                value={parent.financialIndependence}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], financialIndependence: e.target.value as any };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="independent">Independent</option>
                                <option value="occasional_support">Occasional Support</option>
                                <option value="regular_support">Regular Support</option>
                                <option value="full_dependency">Full Dependency</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Living Arrangement</label>
                              <select
                                value={parent.livingArrangement}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], livingArrangement: e.target.value as any };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="independent">Independent</option>
                                <option value="assisted">Assisted Living</option>
                                <option value="with_family">Living with Family</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Location</label>
                              <select
                                value={parent.location}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], location: e.target.value as any };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="same_city">Same City</option>
                                <option value="different_city">Different City</option>
                                <option value="different_state">Different State</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Monthly Care Cost (₹)</label>
                              <input
                                type="number"
                                min="0"
                                value={parent.currentMonthlyCost}
                                onChange={(e) => {
                                  const newParents = [...calculatorData.familyCareContext.parents];
                                  newParents[index] = { ...newParents[index], currentMonthlyCost: parseInt(e.target.value) };
                                  handleInputChange('familyCareContext', 'parents', newParents);
                                }}
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No parents added yet</p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newParents = [...calculatorData.familyCareContext.parents];
                      newParents.push({
                        name: `Parent ${newParents.length + 1}`,
                        age: 65,
                        healthStatus: 'good',
                        financialIndependence: 'independent',
                        currentMonthlyCost: 0,
                        livingArrangement: 'independent',
                        location: 'same_city'
                      });
                      handleInputChange('familyCareContext', 'parents', newParents);
                    }}
                    className="w-full mt-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    + Add Parent
                  </button>
                </div>
              </div>
              
              {/* In-laws Section - Only show for married/widowed users */}
              {(calculatorData.coreIdentity.maritalStatus === 'married' || calculatorData.coreIdentity.maritalStatus === 'widowed') && (
                <div>
                  <label className="block text-gray-700 font-medium mb-4">Spouse's Parents (In-laws)</label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    {calculatorData.familyCareContext.spouseParents.length > 0 ? (
                      <div className="space-y-4">
                        {calculatorData.familyCareContext.spouseParents.map((spouseParent, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={spouseParent.name || ''}
                                  onChange={(e) => {
                                    const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                                    newSpouseParents[index] = { ...newSpouseParents[index], name: e.target.value };
                                    handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                                  }}
                                  placeholder="In-law's name"
                                  className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                                  newSpouseParents.splice(index, 1);
                                  handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                                }}
                                className="ml-2 text-red-500 hover:text-red-700 p-2"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Age</label>
                                <input
                                  type="number"
                                  min="50"
                                  max="100"
                                  value={spouseParent.age}
                                  onChange={(e) => {
                                    const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                                    newSpouseParents[index] = { ...newSpouseParents[index], age: parseInt(e.target.value) };
                                    handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                                  }}
                                  className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">Support Needed</label>
                                <select
                                  value={spouseParent.supportNeeded ? 'yes' : 'no'}
                                  onChange={(e) => {
                                    const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                                    newSpouseParents[index] = { ...newSpouseParents[index], supportNeeded: e.target.value === 'yes' };
                                    handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                                  }}
                                  className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="no">No Support Needed</option>
                                  <option value="yes">Support Needed</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Location</label>
                              <input
                                type="text"
                                value={spouseParent.location}
                                onChange={(e) => {
                                  const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                                  newSpouseParents[index] = { ...newSpouseParents[index], location: e.target.value };
                                  handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                                }}
                                placeholder="City, State"
                                className="w-full p-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No in-laws added yet</p>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newSpouseParents = [...calculatorData.familyCareContext.spouseParents];
                        newSpouseParents.push({
                          name: `In-law ${newSpouseParents.length + 1}`,
                          age: 65,
                          supportNeeded: false,
                          location: ''
                        });
                        handleInputChange('familyCareContext', 'spouseParents', newSpouseParents);
                      }}
                      className="w-full mt-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      + Add In-law
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Your investment profile</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Risk tolerance</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'conservative', label: 'Conservative' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'aggressive', label: 'Aggressive' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('behavioralProfile', 'riskTolerance', option.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.behavioralProfile.riskTolerance === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">How do you respond to market crashes?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'panic_sell', label: 'Panic and sell' },
                    { value: 'worry_hold', label: 'Worry but hold' },
                    { value: 'buying_opportunity', label: 'See buying opportunity' },
                    { value: 'ignore_it', label: 'Ignore it' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('behavioralProfile', 'marketCrashResponse', option.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        calculatorData.behavioralProfile.marketCrashResponse === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Investment allocation</label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Stocks: {Math.round(calculatorData.financialFoundation.investmentAllocation.stocks * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={calculatorData.financialFoundation.investmentAllocation.stocks}
                      onChange={(e) => {
                        const newStocks = parseFloat(e.target.value);
                        const remaining = 1 - newStocks;
                        const newBonds = calculatorData.financialFoundation.investmentAllocation.bonds / 
                          (calculatorData.financialFoundation.investmentAllocation.bonds + 
                           calculatorData.financialFoundation.investmentAllocation.realEstate) * remaining;
                        const newRealEstate = remaining - newBonds;
                        
                        setCalculatorData(prevData => ({
                          ...prevData,
                          financialFoundation: {
                            ...prevData.financialFoundation,
                            investmentAllocation: {
                              stocks: newStocks,
                              bonds: newBonds,
                              realEstate: newRealEstate,
                              alternatives: 0
                            }
                          }
                        }));
                      }}
                      className="custom-slider w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Bonds: {Math.round(calculatorData.financialFoundation.investmentAllocation.bonds * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={calculatorData.financialFoundation.investmentAllocation.bonds}
                      onChange={(e) => {
                        const newBonds = parseFloat(e.target.value);
                        const stocks = calculatorData.financialFoundation.investmentAllocation.stocks;
                        const remaining = 1 - stocks - newBonds;
                        
                        setCalculatorData(prevData => ({
                          ...prevData,
                          financialFoundation: {
                            ...prevData.financialFoundation,
                            investmentAllocation: {
                              stocks: stocks,
                              bonds: newBonds,
                              realEstate: Math.max(0, remaining),
                              alternatives: 0
                            }
                          }
                        }));
                      }}
                      className="custom-slider w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Real Estate: {Math.round(calculatorData.financialFoundation.investmentAllocation.realEstate * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={calculatorData.financialFoundation.investmentAllocation.realEstate}
                      onChange={(e) => {
                        const newRealEstate = parseFloat(e.target.value);
                        const stocks = calculatorData.financialFoundation.investmentAllocation.stocks;
                        const remaining = 1 - stocks - newRealEstate;
                        
                        setCalculatorData(prevData => ({
                          ...prevData,
                          financialFoundation: {
                            ...prevData.financialFoundation,
                            investmentAllocation: {
                              stocks: stocks,
                              bonds: Math.max(0, remaining),
                              realEstate: newRealEstate,
                              alternatives: 0
                            }
                          }
                        }));
                      }}
                      className="custom-slider w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900">Review & Calculate</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-700">Age: {calculatorData.coreIdentity.age}</p>
                <p className="text-gray-700">Marital Status: {calculatorData.coreIdentity.maritalStatus}</p>
                <p className="text-gray-700">
                  Employment: {calculatorData.coreIdentity.employment.status} ({calculatorData.coreIdentity.employment.industry}, {calculatorData.coreIdentity.employment.roleLevel})
                </p>
                <p className="text-gray-700">
                  Location: {calculatorData.coreIdentity.location.city}, {calculatorData.coreIdentity.location.state} ({calculatorData.coreIdentity.location.cityType.replace('tier2', 'Tier 2').replace('tier3', 'Tier 3')})
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Financial Information</h3>
                <p className="text-gray-700">Net Worth: {formatCurrency(calculatorData.financialFoundation.currentNetWorth, currencyInfo)}</p>
                <p className="text-gray-700">Annual Income: {formatCurrency(calculatorData.financialFoundation.annualIncome, currencyInfo)}</p>
                <p className="text-gray-700">Income Source: {calculatorData.financialFoundation.primaryIncomeSource}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Family Structure</h3>
                <p className="text-gray-700">Children: {calculatorData.childrenContext.children.length}</p>
                {calculatorData.childrenContext.children.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {calculatorData.childrenContext.children.map((child, index) => (
                      <p key={index} className="text-sm text-gray-600 ml-4">
                        • {child.name} (Age: {child.age}, {child.academicPerformance.replace('_', ' ')}, {child.educationAspirations.replace('_', ' ')})
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-gray-700 mt-2">Parents Requiring Care: {calculatorData.familyCareContext.parents.length}</p>
                {calculatorData.familyCareContext.parents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {calculatorData.familyCareContext.parents.map((parent, index) => (
                      <p key={index} className="text-sm text-gray-600 ml-4">
                        • {parent.name} (Age: {parent.age}, {parent.healthStatus}, {parent.financialIndependence.replace('_', ' ')}, ₹{parent.currentMonthlyCost.toLocaleString()}/month)
                      </p>
                    ))}
                  </div>
                )}
                {(calculatorData.coreIdentity.maritalStatus === 'married' || calculatorData.coreIdentity.maritalStatus === 'widowed') && (
                  <>
                    <p className="text-gray-700 mt-2">In-laws: {calculatorData.familyCareContext.spouseParents.length}</p>
                    {calculatorData.familyCareContext.spouseParents.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {calculatorData.familyCareContext.spouseParents.map((spouseParent, index) => (
                          <p key={index} className="text-sm text-gray-600 ml-4">
                            • {spouseParent.name} (Age: {spouseParent.age}, {spouseParent.supportNeeded ? 'Support Needed' : 'Independent'})
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Investment Profile</h3>
                <p className="text-gray-700">Risk Tolerance: {calculatorData.behavioralProfile.riskTolerance}</p>
                <p className="text-gray-700">Market Crash Response: {calculatorData.behavioralProfile.marketCrashResponse.replace('_', ' ')}</p>
                <p className="text-gray-700">
                  Allocation: {Math.round(calculatorData.financialFoundation.investmentAllocation.stocks * 100)}% stocks, 
                  {Math.round(calculatorData.financialFoundation.investmentAllocation.bonds * 100)}% bonds, 
                  {Math.round(calculatorData.financialFoundation.investmentAllocation.realEstate * 100)}% real estate
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-purple-700 font-medium">
                  Ready to calculate your family's wealth timeline?
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Wealth Extinction Calculator</h1>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of 5</span>
            <span>{currentStep * 20}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full transition-all duration-300"
              style={{ width: `${currentStep * 20}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevStep}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>
          
          <button
            onClick={handleNextStep}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {currentStep === 5 ? 'Calculate' : 'Next'}
            {currentStep === 5 ? <Calculator className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WealthCalculatorFlow;