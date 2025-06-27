import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, AlertTriangle, TrendingUp, Users, Heart, Brain, Calculator, Clock, Shield } from 'lucide-react';

// Enhanced interfaces based on wireframes
interface CoreIdentityMatrix {
  age: number;
  gender: 'male' | 'female' | 'prefer_not_to_say';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  location: {
    state: string;
    city: string;
    zipCode: string;
    cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
  };
  education: {
    level: 'high_school' | 'bachelors' | 'masters' | 'professional' | 'phd';
    institution: 'tier1' | 'tier2' | 'tier3';
  };
  employment: {
    status: 'corporate' | 'business_owner' | 'self_employed';
    industry: string;
    roleLevel: 'junior' | 'mid' | 'senior' | 'leadership';
  };
  financialSophistication: 'expert' | 'good' | 'moderate' | 'beginner';
}

interface FinancialFoundation {
  currentNetWorth: number;
  annualIncome: number;
  primaryIncomeSource: 'salary' | 'business' | 'mixed';
  investmentAllocation: {
    stocks: number;
    bonds: number;
    realEstate: number;
    alternatives: number;
  };
}

interface ChildrenEducationContext {
  children: Array<{
    name: string;
    age: number;
    academicPerformance: 'struggling' | 'average' | 'above_average' | 'exceptional';
    interests: string[];
    educationAspirations: 'public_state' | 'public_premium' | 'private_state' | 'private_premium' | 'international';
    currentSchoolType: 'government' | 'private_vernacular' | 'private_english' | 'international';
  }>;
}

interface FamilyCareContext {
  parents: Array<{
    name: string;
    age: number;
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    financialIndependence: 'independent' | 'occasional_support' | 'regular_support' | 'full_dependency';
    currentMonthlyCost: number;
    livingArrangement: 'independent' | 'assisted' | 'with_family';
    location: 'same_city' | 'different_city' | 'different_state';
  }>;
  spouseParents: Array<{
    age: number;
    supportNeeded: boolean;
    location: string;
  }>;
  siblings: Array<{
    relationshipQuality: 'close' | 'good' | 'strained' | 'non_communicative';
    financialCapacity: 'strong' | 'moderate' | 'limited';
    careInvolvement: 'high' | 'moderate' | 'low';
  }>;
  familyCoordination: 'excellent' | 'good' | 'chaotic' | 'poor';
}

interface BehavioralFinanceProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  marketCrashResponse: 'panic_sell' | 'worry_hold' | 'buying_opportunity' | 'ignore_it';
  biggestFear: 'retirement_insufficient' | 'burden_children' | 'wrong_decisions' | 'parent_care_costs';
  planningApproach: 'detailed_research' | 'important_overwhelming' | 'delegate_experts' | 'avoid_thinking';
  reviewFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'rarely';
}

interface ComplexityRevealation {
  complexityScore: number;
  majorDecisions: Array<{
    year: number;
    decision: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  interconnections: string[];
  sandwichGenerationOverload: boolean;
}

interface CalculatorData {
  coreIdentity: CoreIdentityMatrix;
  financialFoundation: FinancialFoundation;
  childrenContext: ChildrenEducationContext;
  familyCareContext: FamilyCareContext;
  behavioralProfile: BehavioralFinanceProfile;
  complexityAnalysis: ComplexityRevealation;
  currentStep: number;
  email: string;
  phoneNumber: string;
}

interface QuestionConfig {
  id: string;
  phase: 'foundation' | 'personal_investment' | 'complexity_revelation' | 'email_capture';
  title: string;
  subtitle?: string;
  subtitleFn?: (data: CalculatorData) => string;
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text_input' | 'dual_slider' | 'family_builder' | 'complexity_reveal';
  condition?: (data: CalculatorData) => boolean;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
    complexityImpact?: number;
    emoji?: string;
  }>;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
    formatter?: (value: number) => string;
  };
  insight?: (data: CalculatorData) => string;
  complexityThreshold?: number;
  smartDefaults?: (data: CalculatorData) => any;
}

const WealthCalculatorFlow: React.FC<{
  onComplete: (data: any) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [data, setData] = useState<CalculatorData>({
    coreIdentity: {
      age: 42,
      gender: 'prefer_not_to_say',
      maritalStatus: 'married',
      location: { state: '', city: '', zipCode: '', cityType: 'metro' },
      education: { level: 'masters', institution: 'tier2' },
      employment: { status: 'corporate', industry: 'technology', roleLevel: 'mid' },
      financialSophistication: 'moderate'
    },
    financialFoundation: {
      currentNetWorth: 750000,
      annualIncome: 180000,
      primaryIncomeSource: 'salary',
      investmentAllocation: { stocks: 60, bonds: 30, realEstate: 10, alternatives: 0 }
    },
    childrenContext: { children: [] },
    familyCareContext: {
      parents: [],
      spouseParents: [],
      siblings: [],
      familyCoordination: 'good'
    },
    behavioralProfile: {
      riskTolerance: 'moderate',
      marketCrashResponse: 'worry_hold',
      biggestFear: 'burden_children',
      planningApproach: 'important_overwhelming',
      reviewFrequency: 'monthly'
    },
    complexityAnalysis: {
      complexityScore: 1.2,
      majorDecisions: [],
      interconnections: [],
      sandwichGenerationOverload: false
    },
    currentStep: 1,
    email: '',
    phoneNumber: ''
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Progressive question flow based on wireframes
  const questionFlow: QuestionConfig[] = [
    // Phase 1: Foundation Building - Confidence Creator (Q1-7)
    {
      id: 'age_basic',
      phase: 'foundation',
      title: "Let's start with the basics - what's your current age?",
      subtitle: "This helps us project your family's wealth timeline",
      type: 'slider',
      sliderConfig: { min: 25, max: 75, step: 1, unit: 'years', formatter: (v) => `${v} years old` },
      insight: (data) => `You have ${65 - data.coreIdentity.age} productive years to build generational wealth for your family`
    },
    {
      id: 'marital_status',
      phase: 'foundation',
      title: "What's your current marital status?",
      subtitle: "Family structure dramatically affects wealth preservation strategy",
      type: 'single_choice',
      options: [
        { value: 'single', label: 'Single', description: 'Full control, solo responsibility', complexityImpact: 0.5, emoji: '👤' },
        { value: 'married', label: 'Married', description: 'Building together, shared decisions', complexityImpact: 1.0, emoji: '💕' },
        { value: 'divorced', label: 'Divorced', description: 'Rebuilding carefully', complexityImpact: 1.5, emoji: '💔' },
        { value: 'widowed', label: 'Widowed', description: 'Managing legacy alone', complexityImpact: 1.8, emoji: '🖤' }
      ]
    },
    {
      id: 'employment_context',
      phase: 'foundation',
      title: "What's your current employment situation?",
      subtitle: "Career context affects income stability and wealth building potential",
      type: 'single_choice',
      options: [
        { value: 'corporate', label: '🏢 Corporate Employee', description: 'Stable income, limited time', complexityImpact: 0.3 },
        { value: 'business_owner', label: '🚀 Business Owner', description: 'Higher risk, higher reward potential', complexityImpact: 1.2 },
        { value: 'self_employed', label: '👩‍💻 Self-Employed', description: 'Freedom but uncertainty', complexityImpact: 0.8 }
      ]
    },
    {
      id: 'education_sophistication',
      phase: 'foundation',
      title: "What's your educational background?",
      subtitle: "Education level helps us tailor complexity and expectations",
      type: 'single_choice',
      options: [
        { value: 'high_school', label: '🎓 High School/12th Standard', complexityImpact: 0.2 },
        { value: 'bachelors', label: '🎓 Bachelor\'s Degree', complexityImpact: 0.4 },
        { value: 'masters', label: '🎓 Master\'s Degree (MBA/MTech)', complexityImpact: 0.6 },
        { value: 'professional', label: '🎓 Professional Degree (CA/CS/Medical/Law)', complexityImpact: 0.8 },
        { value: 'phd', label: '🎓 PhD/Doctoral', complexityImpact: 1.0 }
      ],
      insight: (data) => data.coreIdentity.education.level === 'masters' ? 
        "Your education suggests good analytical ability, but family wealth planning has unique complexities..." : ""
    },
    {
      id: 'net_worth_income',
      phase: 'foundation',
      title: "What's your current household net worth and income?",
      subtitle: "Include home equity, investments, savings, and annual household income",
      type: 'dual_slider',
      sliderConfig: { min: 0, max: 50000000, step: 50000, unit: '₹', formatter: (v) => `₹${(v/100000).toFixed(1)}L` },
      insight: (data) => {
        const percentile = calculateWealthPercentile(data.financialFoundation.currentNetWorth, data.coreIdentity.age);
        return `You're in the top ${100 - percentile}% of Indian households by wealth`;
      }
    },
    {
      id: 'children_count',
      phase: 'foundation',
      title: "How many children do you have?",
      subtitle: "This is where it gets personal... Each child's education could cost ₹50L-2Cr by graduation",
      subtitleFn: (data: CalculatorData) => {
        if (data.coreIdentity.maritalStatus === 'single') {
          return "If you plan to have children in the future, let us know. Otherwise, you can skip this.";
        }
        return "This is where it gets personal... Each child's education could cost ₹50L-2Cr by graduation";
      },
      type: 'single_choice',
      condition: (data: CalculatorData) => ['married', 'divorced', 'widowed'].includes(data.coreIdentity.maritalStatus) || (data.coreIdentity.maritalStatus === 'single' && data.childrenContext.children.length > 0),
      options: [
        { value: '0', label: '0', description: 'Planning children or child-free', complexityImpact: 0, emoji: '🤔' },
        { value: '1', label: '1', description: 'Focused investment in one future', complexityImpact: 1.2, emoji: '👶' },
        { value: '2', label: '2', description: 'Balancing multiple dreams', complexityImpact: 2.1, emoji: '👧👦' },
        { value: '3', label: '3', description: 'Complex coordination required', complexityImpact: 3.2, emoji: '👨‍👩‍👧‍👦' },
        { value: '4+', label: '4+', description: 'Large family dynamics', complexityImpact: 4.5, emoji: '👨‍👩‍👧‍👦👶' }
      ]
    },
    {
      id: 'location_context',
      phase: 'foundation',
      title: "Where is your family based?",
      subtitle: "Location affects education costs, parent care options, and lifestyle expenses",
      type: 'single_choice',
      options: [
        { value: 'metro', label: '🌆 Metro (Mumbai/Delhi/Bangalore)', description: 'High costs, excellent opportunities', complexityImpact: 1.2 },
        { value: 'tier2', label: '🏙️ Tier 2 (Pune/Ahmedabad/Kochi)', description: 'Balanced costs and opportunities', complexityImpact: 0.8 },
        { value: 'tier3', label: '🏘️ Tier 3 (Smaller cities)', description: 'Lower costs, limited options', complexityImpact: 0.5 },
        { value: 'rural', label: '🌾 Rural/Semi-urban', description: 'Very low costs, basic facilities', complexityImpact: 0.3 }
      ]
    },

    // Phase 2: Personal Investment - Stakes Get Real (Q8-15)
    {
      id: 'children_details',
      phase: 'personal_investment',
      title: "Tell us about your children - this gets personal",
      subtitle: "Each child's individual dreams require individual strategies",
      subtitleFn: (data: CalculatorData) => `You mentioned having ${data.childrenContext.children.length} child${data.childrenContext.children.length === 1 ? '' : 'ren'}. Each child's individual dreams require individual strategies`,
      type: 'family_builder',
      condition: (data: CalculatorData) => data.childrenContext.children.length > 0,
      complexityThreshold: 3.0
    },
    {
      id: 'parents_father',
      phase: 'personal_investment',
      title: "The tough questions - Your father's situation",
      subtitle: "Parent care affects your timeline more than market crashes",
      type: 'single_choice',
      options: [
        { value: 'excellent_independent', label: '👴 Excellent health, completely independent', complexityImpact: 0.3 },
        { value: 'good_some_support', label: '👴 Good health, needs some monthly support', complexityImpact: 1.5 },
        { value: 'fair_regular_support', label: '👴 Fair health, regular financial support needed', complexityImpact: 2.3 },
        { value: 'declining_significant', label: '👴 Declining health, significant care responsibilities', complexityImpact: 3.8 }
      ],
      complexityThreshold: 5.0
    },
    {
      id: 'parents_mother',
      phase: 'personal_investment',
      title: "Your mother's situation",
      subtitle: "Dependent spouses create 2.3x higher care complexity when primary earner needs care",
      type: 'single_choice',
      options: [
        { value: 'excellent_independent', label: '👵 Excellent health, financially independent', complexityImpact: 0.3 },
        { value: 'good_dependent', label: '👵 Good health, financially dependent on father', complexityImpact: 1.5 },
        { value: 'health_challenges', label: '👵 Health challenges, needs coordinated care', complexityImpact: 2.8 },
        { value: 'cascade_risk', label: '👵 High care needs if father\'s health declines', complexityImpact: 4.2 }
      ]
    },
    {
      id: 'sibling_coordination',
      phase: 'personal_investment',
      title: "Family coordination dynamics - How many siblings share parent care?",
      subtitle: "Geographic spread and mixed financial capacities create coordination complexity",
      type: 'single_choice',
      condition: (data: CalculatorData) => data.complexityAnalysis.complexityScore > 5.0,
      options: [
        { value: 'no_siblings', label: '0 - Only child (all responsibility on you)', complexityImpact: 2.0 },
        { value: 'one_sibling', label: '1 sibling - Shared responsibility', complexityImpact: 1.0 },
        { value: 'two_siblings', label: '2 siblings - Coordination needed', complexityImpact: 1.5 },
        { value: 'multiple_siblings', label: '3+ siblings - Complex coordination', complexityImpact: 2.5 }
      ]
    },
    {
      id: 'marriage_dynamics',
      phase: 'personal_investment',
      title: "Marriage & spouse's family situation",
      subtitle: "You might be managing 4 aging parents across multiple cities",
      subtitleFn: (data: CalculatorData) => data.coreIdentity.maritalStatus === 'married' ? "You might be managing 4 aging parents across multiple cities" : "(Skipped: Not married)",
      type: 'single_choice',
      condition: (data: CalculatorData) => data.coreIdentity.maritalStatus === 'married',
      options: [
        { value: 'spouse_independent', label: '💑 Spouse\'s parents are independent', complexityImpact: 0.2 },
        { value: 'spouse_some_support', label: '💑 Spouse\'s parents need occasional support', complexityImpact: 1.2 },
        { value: 'sandwich_overload', label: '💑 Both sets of aging parents need support', complexityImpact: 3.5 },
        { value: 'four_parents_crisis', label: '💑 Managing 4 aging parents across cities', complexityImpact: 5.0 }
      ]
    },
    {
      id: 'career_trajectory',
      phase: 'personal_investment',
      title: "Your career & income trajectory",
      subtitle: "Technology sector creates unique wealth risks - age bias, skill obsolescence",
      type: 'single_choice',
      options: [
        { value: 'stable_growth', label: '📈 Stable growth (5-8% annually)', complexityImpact: 0.3 },
        { value: 'rapid_growth', label: '🚀 Rapid growth (15%+ annually)', complexityImpact: 0.8 },
        { value: 'uncertain_plateau', label: '📊 Uncertain/plateau phase', complexityImpact: 1.5 },
        { value: 'high_risk', label: '⚡ High risk/startup environment', complexityImpact: 2.2 }
      ]
    },
    {
      id: 'investment_behavior',
      phase: 'personal_investment',
      title: "How you actually handle money & risk",
      subtitle: "Your behavioral gaps could cost your family ₹67L over 25 years",
      type: 'single_choice',
      options: [
        { value: 'panic_sell', label: '😰 Panic and sell during crashes', complexityImpact: 2.5 },
        { value: 'worry_hold', label: '😟 Worry but try to hold steady', complexityImpact: 1.2 },
        { value: 'buying_opportunity', label: '😎 See crashes as buying opportunities', complexityImpact: -0.5 },
        { value: 'ignore_balance', label: '🙈 Don\'t check balances during volatility', complexityImpact: 0.8 }
      ]
    },

    // Phase 3: Complexity Revelation (Q16-18)
    {
      id: 'complexity_revelation',
      phase: 'complexity_revelation',
      title: "Your Wealth Web: 247 Interconnected Variables Revealed",
      subtitle: "Based on your answers, you have multiple major financial decisions coming",
      type: 'complexity_reveal',
      condition: (data: CalculatorData) => data.complexityAnalysis.complexityScore > 7.0,
      complexityThreshold: 8.0
    },
    {
      id: 'stress_test_scenario',
      phase: 'complexity_revelation',
      title: "STRESS TEST: The 2027 Perfect Storm",
      subtitle: "How would your current plan handle this reality?",
      type: 'single_choice',
      condition: (data: CalculatorData) => data.complexityAnalysis.complexityScore > 8.0,
      options: [
        { value: 'emergency_fund', label: 'Use emergency fund for everything', description: 'Fund depleted in 11 months, Timeline: -8.2 years' },
        { value: 'liquidate_investments', label: 'Liquidate investments at loss', description: '₹52L permanent loss, Timeline: -6.8 years' },
        { value: 'delay_education', label: 'Delay children\'s college', description: 'Emotional stress + opportunity cost, Timeline: -4.1 years' },
        { value: 'coordinate_family', label: 'Coordinate with siblings + education loan', description: 'Requires family skills, Timeline: -1.8 years' }
      ]
    },

    // Phase 4: Email Capture
    {
      id: 'email_capture',
      phase: 'email_capture',
      title: "Get your personalized family protection strategy",
      subtitle: "Your situation (complexity score 9.9/10) requires ongoing professional coordination",
      type: 'text_input'
    }
  ];

  const currentQuestion = questionFlow[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionFlow.length) * 100;

  // Helper function for complexity scoring
  const updateComplexityScore = (impact: number) => {
    setData(prev => ({
      ...prev,
      complexityAnalysis: {
        ...prev.complexityAnalysis,
        complexityScore: Math.min(10, prev.complexityAnalysis.complexityScore + impact)
      }
    }));
  };

  // Helper function for adding insights
  const addInsight = (insight: string) => {
    setInsights(prev => [...prev, insight]);
  };

  // Calculate wealth percentile helper
  const calculateWealthPercentile = (netWorth: number, age: number): number => {
    const ageAdjustedWealth = netWorth / (age / 35);
    if (ageAdjustedWealth > 5000000) return 5;
    if (ageAdjustedWealth > 2500000) return 10;
    if (ageAdjustedWealth > 1000000) return 25;
    if (ageAdjustedWealth > 500000) return 50;
    return 75;
  };

  // Smart defaults function
  const applySmartDefaults = (questionId: string, data: CalculatorData) => {
    if (questionId === 'net_worth_income') {
      const cityMultiplier = data.coreIdentity.location.cityType === 'metro' ? 1.4 : 1.0;
      const educationMultiplier = data.coreIdentity.education.level === 'masters' ? 1.2 : 1.0;
      
      return {
        suggestedIncome: Math.floor(150000 * cityMultiplier * educationMultiplier),
        suggestedNetWorth: Math.floor(500000 * cityMultiplier * educationMultiplier)
      };
    }
    return {};
  };

  // Handle answer function
  const handleAnswer = (questionId: string, value: any) => {
    console.log(`Answering ${questionId} with value:`, value);
    
    switch (questionId) {
      case 'age_basic':
        setData(prev => ({
          ...prev,
          coreIdentity: { ...prev.coreIdentity, age: parseInt(value) }
        }));
        break;
        
      case 'marital_status':
        const maritalOption = currentQuestion.options?.find(opt => opt.value === value);
        setData(prev => ({
          ...prev,
          coreIdentity: { ...prev.coreIdentity, maritalStatus: value as any }
        }));
        updateComplexityScore(maritalOption?.complexityImpact || 0);
        break;
        
      case 'employment_context':
        const empOption = currentQuestion.options?.find(opt => opt.value === value);
        setData(prev => ({
          ...prev,
          coreIdentity: { ...prev.coreIdentity, employment: { ...prev.coreIdentity.employment, status: value as any } }
        }));
        updateComplexityScore(empOption?.complexityImpact || 0);
        break;
        
      case 'children_count':
        const childCount = parseInt(value.replace('+', ''));
        const children = Array.from({ length: Math.min(childCount, 4) }, (_, i) => ({
          name: `Child ${i + 1}`,
          age: 12 - i * 3, // Spread ages
          academicPerformance: 'above_average' as const,
          interests: [],
          educationAspirations: 'private_state' as const,
          currentSchoolType: 'private_english' as const
        }));
        const childOption = currentQuestion.options?.find(opt => opt.value === value);
        setData(prev => ({
          ...prev,
          childrenContext: { children }
        }));
        updateComplexityScore(childOption?.complexityImpact || 0);
        break;
        
      case 'net_worth_income':
        if (typeof value === 'object') {
          setData(prev => ({
            ...prev,
            financialFoundation: {
              ...prev.financialFoundation,
              currentNetWorth: value.netWorth,
              annualIncome: value.income
            }
          }));
        }
        break;
        
      case 'email_capture':
        setData(prev => ({ ...prev, email: value }));
        break;
        
      default:
        // Handle other question types
        const option = currentQuestion.options?.find(opt => opt.value === value);
        if (option?.complexityImpact) {
          updateComplexityScore(option.complexityImpact);
        }
        break;
    }

    // Add insight if available
    if (currentQuestion.insight) {
      const insight = currentQuestion.insight(data);
      if (insight) addInsight(insight);
    }
  };

  // Navigation functions
  const handleNext = () => {
    if (currentQuestionIndex < questionFlow.length - 1) {
      let nextIndex = currentQuestionIndex + 1;
      
      // Find next valid question based on conditions
      while (nextIndex < questionFlow.length) {
        const nextQuestion = questionFlow[nextIndex];
        if (!nextQuestion.condition || nextQuestion.condition(data)) {
          break;
        }
        nextIndex++;
      }
      
      setCurrentQuestionIndex(nextIndex);
    } else {
      startCalculation();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      let prevIndex = currentQuestionIndex - 1;
      
      // Find previous valid question
      while (prevIndex >= 0) {
        const prevQuestion = questionFlow[prevIndex];
        if (!prevQuestion.condition || prevQuestion.condition(data)) {
          break;
        }
        prevIndex--;
      }
      
      setCurrentQuestionIndex(Math.max(0, prevIndex));
    } else {
      onBack();
    }
  };

  const startCalculation = async () => {
    setIsLoading(true);
    setError(null);
    const calculationPayload = {
      ...data,
      timestamp: new Date().toISOString(),
      calculationVersion: '2.0'
    };
    try {
      const response = await fetch('/api/calculate-wealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculationPayload)
      });
      const result = await response.json();
      if (result.success && result.data) {
        onComplete({ inputs: calculationPayload, results: result.data });
      } else {
        setError(result.error || 'Calculation failed. Please try again.');
        setIsLoading(false);
      }
    } catch (e) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  // Loading state
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
              Processing complexity score {data.complexityAnalysis.complexityScore.toFixed(1)}/10 across 247 variables
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
              💡 Families with your complexity score who use systematic planning extend their wealth timeline by an average of {Math.floor(data.complexityAnalysis.complexityScore * 1.2)} years
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p>{error}</p>
              <button onClick={startCalculation} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Question rendering function
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'slider':
        return (
          <div className="space-y-6">
            <div>
              <input
                type="range"
                min={currentQuestion.sliderConfig?.min || 25}
                max={currentQuestion.sliderConfig?.max || 75}
                step={currentQuestion.sliderConfig?.step || 1}
                value={currentQuestion.id === 'age_basic' ? data.coreIdentity.age : 750000}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{currentQuestion.sliderConfig?.min || 25}</span>
                <span className="font-bold text-purple-600 text-xl">
                  {currentQuestion.sliderConfig?.formatter ? 
                    currentQuestion.sliderConfig.formatter(currentQuestion.id === 'age_basic' ? data.coreIdentity.age : 750000) :
                    `${currentQuestion.id === 'age_basic' ? data.coreIdentity.age : 750000} ${currentQuestion.sliderConfig?.unit || ''}`
                  }
                </span>
                <span>{currentQuestion.sliderConfig?.max || 75}</span>
              </div>
            </div>
          </div>
        );

      case 'dual_slider':
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Household Income</label>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="50000"
                value={data.financialFoundation.annualIncome}
                onChange={(e) => handleAnswer(currentQuestion.id, { 
                  income: parseInt(e.target.value), 
                  netWorth: data.financialFoundation.currentNetWorth 
                })}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹5L</span>
                <span className="font-bold text-blue-600 text-lg">
                  ₹{(data.financialFoundation.annualIncome/100000).toFixed(1)}L annually
                </span>
                <span>₹1Cr+</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Net Worth</label>
              <input
                type="range"
                min="0"
                max="50000000"
                step="50000"
                value={data.financialFoundation.currentNetWorth}
                onChange={(e) => handleAnswer(currentQuestion.id, { 
                  netWorth: parseInt(e.target.value), 
                  income: data.financialFoundation.annualIncome 
                })}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹0</span>
                <span className="font-bold text-green-600 text-lg">
                  ₹{(data.financialFoundation.currentNetWorth/100000).toFixed(1)}L net worth
                </span>
                <span>₹5Cr+</span>
              </div>
            </div>
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
                  <div className="flex items-start gap-3">
                    {option.emoji && (
                      <span className="text-2xl">{option.emoji}</span>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                        {option.label}
                      </h3>
                      {option.description && (
                        <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                      )}
                    </div>
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

      case 'complexity_reveal':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-3">
                    Complex Situation Detected (Score: {data.complexityAnalysis.complexityScore.toFixed(1)}/10)
                  </h3>
                  <p className="text-orange-800 leading-relaxed mb-4">
                    Based on your answers, you have <strong>{Math.floor(data.complexityAnalysis.complexityScore * 3)} major financial decisions</strong> in the next 5 years:
                  </p>
                  <ul className="space-y-2 text-orange-800">
                    {data.childrenContext.children.length > 0 && (
                      <li>📅 Children's education path choices & funding (2027-2029)</li>
                    )}
                    {data.complexityAnalysis.complexityScore > 5 && (
                      <li>📅 Parent care escalation planning (2025-2028)</li>
                    )}
                    <li>📅 Investment rebalancing for life stage (2026)</li>
                    <li>📅 Estate planning updates required (2025, 2030)</li>
                    {data.complexityAnalysis.complexityScore > 7 && (
                      <li>📅 Family coordination optimization (ongoing)</li>
                    )}
                    {data.coreIdentity.maritalStatus === 'married' && (
                      <li>📅 Spouse's parents care coordination (2026+)</li>
                    )}
                  </ul>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">💔 Current Path Risk</h4>
                      <p className="text-sm text-orange-800">
                        Each missed optimization reduces timeline by 2-5 years. 
                        Families like yours lose average ₹{Math.floor(data.complexityAnalysis.complexityScore * 40)}L 
                        due to poor coordination.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Protected Path Potential</h4>
                      <p className="text-sm text-green-800">
                        With systematic coordination, extend timeline by 
                        {Math.floor(data.complexityAnalysis.complexityScore * 1.5)} years and 
                        save ₹{Math.floor(data.complexityAnalysis.complexityScore * 60)}L.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'family_builder':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Your Children's Individual Paths
              </h3>
              {data.childrenContext.children.map((child, index) => (
                <div key={index} className="bg-white rounded-xl p-4 mb-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{child.name}</h4>
                    <span className="text-sm text-gray-600">{child.age} years old</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Academic Performance:</span>
                      <span className="ml-2 text-gray-600">{child.academicPerformance.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Education Path:</span>
                      <span className="ml-2 text-gray-600">{child.educationAspirations.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Projected Timeline:</strong> 10th completion (2029), 
                      College graduation (2035), 
                      Estimated cost: ₹{Math.floor(25 + index * 10)}L - ₹{Math.floor(180 + index * 20)}L
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 font-medium text-sm">
                  ⚠️ Two children with different timelines create cash flow complexity that 67% of families mismanage
                </p>
              </div>
            </div>
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
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Your Personalized Protection Plan Includes:</h4>
                  <ul className="text-green-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Custom {Math.floor(data.complexityAnalysis.complexityScore * 5)}-step action plan for your family
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Family coordination templates and conversation scripts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Investment optimization for your children's timelines
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Parent care cost mitigation strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Crisis scenario preparation checklist
                    </li>
                  </ul>
                  
                  <div className="mt-4 p-3 bg-white rounded-xl border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      🎯 Value: Custom analysis worth ₹50,000 • 100% Confidential • No spam guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Question type not implemented</div>;
    }
  };

  // Get phase color and icon
  const getPhaseStyle = (phase: string) => {
    switch (phase) {
      case 'foundation':
        return { color: 'blue', icon: '🏗️', name: 'Foundation Building' };
      case 'personal_investment':
        return { color: 'purple', icon: '❤️', name: 'Personal Investment' };
      case 'complexity_revelation':
        return { color: 'orange', icon: '🕸️', name: 'Complexity Revelation' };
      case 'email_capture':
        return { color: 'green', icon: '🛡️', name: 'Protection Strategy' };
      default:
        return { color: 'gray', icon: '📊', name: 'Assessment' };
    }
  };

  const phaseStyle = getPhaseStyle(currentQuestion.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {phaseStyle.icon} {phaseStyle.name} • Step {currentQuestionIndex + 1} of {questionFlow.length}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-purple-600">Complexity Score:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < data.complexityAnalysis.complexityScore ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-purple-600 ml-1">
                  {data.complexityAnalysis.complexityScore.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div 
            className={`bg-gradient-to-r from-${phaseStyle.color}-600 to-${phaseStyle.color}-700 h-3 rounded-full transition-all duration-500 shadow-sm`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className={`text-sm text-${phaseStyle.color}-600`}>{Math.round(progress)}% complete</p>
          {data.complexityAnalysis.complexityScore > 5 && (
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
            {currentQuestion.subtitleFn ? currentQuestion.subtitleFn(data) : currentQuestion.subtitle}
          </div>

          {renderQuestion()}

          {/* Recent Insights */}
          {insights.length > 0 && (
            <div className="mt-8 space-y-3">
              {insights.slice(-2).map((insight, index) => (
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
            className={`w-full bg-gradient-to-r from-${phaseStyle.color}-600 to-${phaseStyle.color}-700 hover:from-${phaseStyle.color}-700 hover:to-${phaseStyle.color}-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
          >
            {currentQuestionIndex === questionFlow.length - 1 ? (
              <>
                <Calculator className="w-5 h-5" />
                <span>Calculate My Family's Timeline</span>
                <Clock className="w-5 h-5 animate-pulse" />
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
                ✨ Delivered in 2 minutes • Custom analysis worth ₹50,000 • Zero spam guarantee
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WealthCalculatorFlow;