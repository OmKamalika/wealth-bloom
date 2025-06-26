import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, AlertTriangle, TrendingUp, Users, Heart, Brain } from 'lucide-react';

// Enhanced interfaces for complex data structure
interface UserProfile {
  age: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  location: {
    zipCode: string;
    state: string;
  };
  healthStatus: 'excellent' | 'good' | 'fair' | 'concerning';
}

interface FamilyStructure {
  children: Array<{
    name: string;
    age: number;
    academicPerformance: 'struggling' | 'average' | 'above_average' | 'exceptional';
    interests: string[];
    educationPath: 'public_state' | 'private_state' | 'elite_private' | 'international';
  }>;
  spouse?: {
    age: number;
    employmentStatus: 'full_time' | 'part_time' | 'homemaker' | 'career_break';
    income: number;
  };
  parents: Array<{
    age: number;
    healthStatus: 'excellent' | 'good' | 'fair' | 'declining' | 'serious';
    livingArrangement: 'independent' | 'assisted' | 'with_family' | 'care_facility';
    financialStatus: 'independent' | 'some_support' | 'significant_support' | 'full_dependency';
    location: 'same_city' | 'different_city' | 'different_state';
  }>;
  siblings: Array<{
    relationshipQuality: 'close' | 'good' | 'strained' | 'non_communicative';
    financialCapacity: 'strong' | 'moderate' | 'limited';
    careWillingness: 'high' | 'moderate' | 'reluctant';
  }>;
}

interface FinancialProfile {
  netWorth: number;
  income: number;
  expenses: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentAllocation: {
    stocks: number;
    bonds: number;
    realEstate: number;
    cash: number;
  };
}

interface CalculatorData {
  userProfile: UserProfile;
  familyStructure: FamilyStructure;
  financialProfile: FinancialProfile;
  complexityScore: number;
  currentStep: number;
  insights: string[];
  email: string;
}

interface QuestionConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text_input' | 'family_details';
  condition?: (data: CalculatorData) => boolean;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
    complexityImpact?: number;
  }>;
  insight?: (data: CalculatorData) => string;
  complexityRevealThreshold?: number;
}

const WealthCalculatorFlow: React.FC<{
  onComplete: (data: any) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [data, setData] = useState<CalculatorData>({
    userProfile: {
      age: 42,
      maritalStatus: 'married',
      location: { zipCode: '', state: '' },
      healthStatus: 'good'
    },
    familyStructure: {
      children: [],
      parents: [],
      siblings: []
    },
    financialProfile: {
      netWorth: 750000,
      income: 125000,
      expenses: 85000,
      riskTolerance: 'moderate',
      investmentAllocation: { stocks: 60, bonds: 30, realEstate: 10, cash: 0 }
    },
    complexityScore: 1.2,
    currentStep: 1,
    insights: [],
    email: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Progressive question configuration
  const questionFlow: QuestionConfig[] = [
    {
      id: 'age_basic',
      title: "Let's start simple - what's your current age?",
      subtitle: "This helps us project your family's timeline",
      type: 'slider',
      insight: (data) => `You have ${65 - data.userProfile.age} productive years to build generational wealth`
    },
    {
      id: 'marital_status',
      title: "What's your current marital status?",
      subtitle: "Family structure dramatically affects wealth preservation",
      type: 'single_choice',
      options: [
        { value: 'single', label: 'Single', description: 'Full control, solo responsibility', complexityImpact: 0.5 },
        { value: 'married', label: 'Married', description: 'Building together, shared decisions', complexityImpact: 1.0 },
        { value: 'divorced', label: 'Divorced', description: 'Rebuilding carefully', complexityImpact: 1.5 },
        { value: 'widowed', label: 'Widowed', description: 'Managing alone', complexityImpact: 1.8 }
      ]
    },
    {
      id: 'children_count',
      title: "How many children do you have?",
      subtitle: "Each child represents both joy and financial complexity",
      type: 'single_choice',
      condition: (data) => data.userProfile.maritalStatus !== 'single' || data.complexityScore > 2.0,
      options: [
        { value: '0', label: '0', description: 'Planning for future or child-free', complexityImpact: 0 },
        { value: '1', label: '1', description: 'Focused investment in one future', complexityImpact: 1.2 },
        { value: '2', label: '2', description: 'Balancing multiple dreams', complexityImpact: 2.1 },
        { value: '3', label: '3', description: 'Complex coordination required', complexityImpact: 3.2 },
        { value: '4+', label: '4+', description: 'Large family dynamics', complexityImpact: 4.5 }
      ]
    },
    {
      id: 'children_details',
      title: "Tell us about your children - this gets personal",
      subtitle: "Individual dreams require individual strategies",
      type: 'family_details',
      condition: (data) => data.familyStructure.children.length > 0,
      complexityRevealThreshold: 3.0
    },
    {
      id: 'net_worth',
      title: "What's your rough household net worth today?",
      subtitle: "Include home equity, investments, savings - everything",
      type: 'slider',
      insight: (data) => {
        const percentile = calculateWealthPercentile(data.financialProfile.netWorth, data.userProfile.age);
        return `You're in the top ${100 - percentile}% for your age group`;
      }
    },
    {
      id: 'parents_situation',
      title: "Now the tough one - your parents' situation",
      subtitle: "Parent care affects your timeline more than market crashes",
      type: 'single_choice',
      options: [
        { value: 'independent', label: 'Completely independent', complexityImpact: 0.3 },
        { value: 'may_need', label: 'May need support soon', complexityImpact: 1.5 },
        { value: 'some_support', label: 'Already providing some support', complexityImpact: 2.3 },
        { value: 'significant', label: 'Significant care responsibilities', complexityImpact: 3.8 }
      ],
      complexityRevealThreshold: 5.0
    },
    {
      id: 'sibling_coordination',
      title: "Family coordination complexity",
      subtitle: "How well do you coordinate family decisions?",
      type: 'single_choice',
      condition: (data) => data.complexityScore > 5.0,
      options: [
        { value: 'excellent', label: 'We plan and coordinate very well', complexityImpact: -0.5 },
        { value: 'good', label: 'Someone usually takes the lead (me)', complexityImpact: 0.8 },
        { value: 'chaotic', label: 'Decisions are often delayed', complexityImpact: 2.1 },
        { value: 'poor', label: 'It creates family stress', complexityImpact: 3.2 }
      ]
    },
    {
      id: 'complexity_revelation',
      title: "Your Wealth Web: Interconnected Decisions Ahead",
      subtitle: "Based on your answers, you have multiple major financial decisions coming",
      type: 'multiple_choice',
      condition: (data) => data.complexityScore > 7.0,
      complexityRevealThreshold: 8.0
    },
    {
      id: 'email_capture',
      title: "Get your personalized protection strategy",
      subtitle: "Your situation is too complex for generic advice",
      type: 'text_input'
    }
  ];

  const currentQuestion = questionFlow[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionFlow.length) * 100;

  const calculateWealthPercentile = (netWorth: number, age: number): number => {
    // Simplified percentile calculation - in real app, this would use actual data
    const ageAdjustedWealth = netWorth / (age / 35);
    if (ageAdjustedWealth > 500000) return 10;
    if (ageAdjustedWealth > 250000) return 25;
    if (ageAdjustedWealth > 100000) return 50;
    if (ageAdjustedWealth > 50000) return 75;
    return 90;
  };

  const updateComplexityScore = (impact: number) => {
    setData(prev => ({
      ...prev,
      complexityScore: Math.min(10, prev.complexityScore + impact)
    }));
  };

  const addInsight = (insight: string) => {
    setData(prev => ({
      ...prev,
      insights: [...prev.insights, insight]
    }));
  };

  const handleAnswer = (questionId: string, value: any) => {
    // Update data based on question type
    switch (questionId) {
      case 'age_basic':
        setData(prev => ({
          ...prev,
          userProfile: { ...prev.userProfile, age: parseInt(value) }
        }));
        break;
      case 'marital_status':
        const option = currentQuestion.options?.find(opt => opt.value === value);
        setData(prev => ({
          ...prev,
          userProfile: { ...prev.userProfile, maritalStatus: value as any },
          complexityScore: prev.complexityScore + (option?.complexityImpact || 0)
        }));
        break;
      case 'children_count':
        const childCount = parseInt(value.replace('+', ''));
        const children = Array.from({ length: Math.min(childCount, 4) }, (_, i) => ({
          name: `Child ${i + 1}`,
          age: 8 + i * 3,
          academicPerformance: 'average' as const,
          interests: [],
          educationPath: 'public_state' as const
        }));
        const childOption = currentQuestion.options?.find(opt => opt.value === value);
        setData(prev => ({
          ...prev,
          familyStructure: { ...prev.familyStructure, children },
          complexityScore: prev.complexityScore + (childOption?.complexityImpact || 0)
        }));
        break;
      case 'net_worth':
        setData(prev => ({
          ...prev,
          financialProfile: { ...prev.financialProfile, netWorth: parseInt(value) }
        }));
        break;
      case 'email_capture':
        setData(prev => ({ ...prev, email: value }));
        break;
      default:
        // Handle other question types
        break;
    }

    // Add insight if available
    if (currentQuestion.insight) {
      const insight = currentQuestion.insight(data);
      addInsight(insight);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionFlow.length - 1) {
      // Find next valid question based on conditions
      let nextIndex = currentQuestionIndex + 1;
      while (nextIndex < questionFlow.length) {
        const nextQuestion = questionFlow[nextIndex];
        if (!nextQuestion.condition || nextQuestion.condition(data)) {
          break;
        }
        nextIndex++;
      }
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Start calculation
      startCalculation();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const startCalculation = () => {
    setIsLoading(true);
    // Simulate complex calculation
    setTimeout(() => {
      onComplete({
        inputs: data,
        results: generateMockResults(data)
      });
    }, 4000);
  };

  const generateMockResults = (data: CalculatorData) => {
    const baseExtinction = 2067;
    const complexityImpact = Math.floor(data.complexityScore * 2);
    const extinctionYear = baseExtinction - complexityImpact;
    
    return {
      extinctionYear,
      yearsRemaining: extinctionYear - 2025,
      complexityScore: data.complexityScore,
      primaryRiskFactors: [
        'Multi-generational care coordination',
        'Education funding optimization',
        'Family decision-making complexity'
      ],
      projectedSavings: Math.floor(data.complexityScore * 50000),
      timelineExtensionPotential: Math.floor(data.complexityScore * 1.5)
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔮 Analyzing Your Family's Future
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Processing {data.complexityScore.toFixed(1)}/10 complexity score across 247 variables
            </p>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-4 mb-6 shadow-inner">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full transition-all duration-1000 w-4/5 shadow-sm"></div>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center justify-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Calculating 75-year wealth projection...
            </p>
            <p className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Modeling family coordination scenarios...
            </p>
            <p className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Identifying optimization opportunities...
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-blue-800 text-sm font-medium">
              💡 Did you know: Families with your complexity score who use systematic planning extend their wealth timeline by an average of {Math.floor(data.complexityScore * 1.2)} years
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'slider':
        return (
          <div className="space-y-6">
            {currentQuestion.id === 'age_basic' && (
              <div>
                <input
                  type="range"
                  min="25"
                  max="75"
                  value={data.userProfile.age}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>25</span>
                  <span className="font-bold text-purple-600 text-xl">{data.userProfile.age} years old</span>
                  <span>75</span>
                </div>
              </div>
            )}
            {currentQuestion.id === 'net_worth' && (
              <div>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={data.financialProfile.netWorth}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span className="font-bold text-purple-600 text-xl">
                    ${data.financialProfile.netWorth.toLocaleString()}
                  </span>
                  <span>$5M+</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'single_choice':
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                    )}
                  </div>
                  {option.complexityImpact && option.complexityImpact > 0 && (
                    <div className="ml-4 flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">+{option.complexityImpact}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'text_input':
        return (
          <div className="space-y-6">
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Enter your email for instant access"
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-lg"
            />
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800">Your Personalized Protection Plan includes:</h4>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• Custom {Math.floor(data.complexityScore * 5)}-step action plan for your family</li>
                    <li>• Family coordination templates and scripts</li>
                    <li>• Investment optimization for your specific timeline</li>
                    <li>• Crisis scenario preparation checklist</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'multiple_choice':
        if (currentQuestion.id === 'complexity_revelation') {
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-orange-900 mb-3">
                      Complex Situation Detected
                    </h3>
                    <p className="text-orange-800 leading-relaxed">
                      Based on your answers, you have <strong>{Math.floor(data.complexityScore * 3)} major financial decisions</strong> in the next 5 years:
                    </p>
                    <ul className="mt-4 space-y-2 text-orange-800">
                      {data.familyStructure.children.length > 0 && (
                        <li>📅 Children's education path choices (2027-2029)</li>
                      )}
                      {data.complexityScore > 5 && (
                        <li>📅 Parent care escalation planning (2025-2028)</li>
                      )}
                      <li>📅 Investment rebalancing for life stage (2026)</li>
                      <li>📅 Estate planning updates required (2025, 2030)</li>
                      {data.complexityScore > 7 && (
                        <li>📅 Family coordination optimization (ongoing)</li>
                      )}
                    </ul>
                    <div className="mt-4 p-3 bg-white rounded-xl border border-orange-200">
                      <p className="text-orange-900 font-semibold text-sm">
                        ⚠️ Each decision affects all others. Miss one optimization point, and your timeline shifts by 2-5 years.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        break;

      default:
        return <div>Question type not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {currentQuestionIndex + 1} of {questionFlow.length} • Intelligence Assessment ⚡
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-purple-600">Complexity Score:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < data.complexityScore ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-purple-600 ml-1">
                  {data.complexityScore.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-purple-600">{Math.round(progress)}% complete</p>
          {data.complexityScore > 5 && (
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              High complexity detected
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {currentQuestion.title}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          {renderQuestion()}

          {/* Recent Insights */}
          {data.insights.length > 0 && (
            <div className="mt-8 space-y-3">
              {data.insights.slice(-2).map((insight, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-800 font-medium">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={currentQuestion.id === 'email_capture' && !data.email}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {currentQuestionIndex === questionFlow.length - 1 ? (
              <>
                <span>Calculate My Family's Timeline</span>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                Continue Deep Dive
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          {currentQuestion.id === 'email_capture' && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ✨ Delivered in 2 minutes • Completely confidential • Custom analysis worth $50,000
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WealthCalculatorFlow;