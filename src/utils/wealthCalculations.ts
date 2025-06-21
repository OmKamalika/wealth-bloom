// Wealth Extinction Calculator - Core Calculation Engine
// Based on comprehensive algorithm specification

export interface CalculatorInputs {
  age: number;
  zipCode: string;
  maritalStatus: 'single' | 'married' | 'divorced';
  children: number;
  childrenNames: string[];
  netWorth: number;
  income: string;
  mainConcern: string;
  parentsSituation: string;
}

export interface WealthProjection {
  year: number;
  age: number;
  wealth: number;
  income: number;
  expenses: number;
  events: string[];
}

export interface WealthResults {
  extinctionYear: number;
  yearsRemaining: number;
  currentWealth: number;
  childrenInheritance: number;
  grandchildrenInheritance: number;
  projections: WealthProjection[];
  topWealthDestroyers: WealthDestroyer[];
  familyImpact: FamilyImpact;
  protectedScenario: ProtectedScenario;
}

export interface WealthDestroyer {
  id: string;
  title: string;
  icon: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface FamilyImpact {
  today: {
    netWorth: number;
    status: string;
  };
  inheritance: {
    year: number;
    children: Array<{
      name: string;
      age: number;
      inheritance: number;
    }>;
  };
  grandchildren: {
    year: number;
    inheritance: number;
    collegeShortfall: number;
  };
}

export interface ProtectedScenario {
  extinctionYear: number;
  additionalYears: number;
  grandchildrenInheritance: number;
  improvements: string[];
}

// Income progression model
function calculateIncomeProgression(baseIncome: number, currentAge: number, targetYear: number): number {
  const yearsFromNow = targetYear - 2025;
  const ageAtTarget = currentAge + yearsFromNow;
  
  let careerGrowthRate = 0.03; // Base 3% growth
  
  // Career stage adjustments
  if (ageAtTarget >= 25 && ageAtTarget <= 35) {
    careerGrowthRate += 0.02; // Early career acceleration
  } else if (ageAtTarget >= 50 && ageAtTarget <= 65) {
    careerGrowthRate *= 0.5; // Late career slowdown
  } else if (ageAtTarget > 65) {
    return baseIncome * 0.4; // Retirement income (Social Security + pension)
  }
  
  // Economic cycle adjustments (simplified)
  const economicCycleFactor = 1.0; // Could be enhanced with recession modeling
  
  return baseIncome * Math.pow(1 + careerGrowthRate * economicCycleFactor, yearsFromNow);
}

// Expense progression model
function calculateExpenseProgression(
  baseExpenses: number, 
  currentAge: number, 
  targetYear: number,
  familySize: number,
  mainConcern: string
): number {
  const yearsFromNow = targetYear - 2025;
  const ageAtTarget = currentAge + yearsFromNow;
  
  // Base inflation rate
  let inflationRate = 0.035; // 3.5% general inflation
  
  // Lifestyle inflation (30% of income growth becomes expense growth)
  const lifestyleInflation = 0.01; // 1% additional annually
  
  // Life stage adjustments
  let lifestageMultiplier = 1.0;
  if (ageAtTarget >= 45 && ageAtTarget <= 65) {
    lifestageMultiplier = 1.2; // Peak spending years
  } else if (ageAtTarget > 65) {
    lifestageMultiplier = 0.8; // Retirement expense reduction
  }
  
  // Special expenses based on main concern
  let specialExpenses = 0;
  if (mainConcern === 'parent-care' && ageAtTarget >= 50) {
    specialExpenses = 24000 * Math.pow(1.055, yearsFromNow); // Healthcare inflation
  }
  
  const baseWithInflation = baseExpenses * Math.pow(1 + inflationRate + lifestyleInflation, yearsFromNow);
  return (baseWithInflation * lifestageMultiplier) + specialExpenses;
}

// Investment return model (simplified Monte Carlo)
function calculateInvestmentReturns(wealth: number, year: number): number {
  // Simplified portfolio return model
  const baseReturn = 0.07; // 7% average return
  const volatility = 0.16; // 16% standard deviation
  
  // Market cycle simulation (simplified)
  const cyclePosition = (year - 2025) % 8; // 8-year average cycle
  let cycleFactor = 1.0;
  
  if (cyclePosition === 6 || cyclePosition === 7) {
    cycleFactor = 0.85; // Recession years
  } else if (cyclePosition === 0 || cyclePosition === 1) {
    cycleFactor = 1.15; // Recovery years
  }
  
  // Add some randomness (simplified)
  const randomFactor = 0.9 + (Math.random() * 0.2); // ±10% random variation
  
  return wealth * (baseReturn * cycleFactor * randomFactor);
}

// Lifecycle events modeling
function calculateLifecycleEvents(age: number, year: number, familySize: number): { cost: number; events: string[] } {
  const events: string[] = [];
  let totalCost = 0;
  
  // Health events (increase with age)
  if (age > 50) {
    const healthEventProbability = (age - 50) * 0.01; // 1% per year after 50
    if (Math.random() < healthEventProbability) {
      const healthCost = 25000 + (Math.random() * 50000); // $25K-$75K
      totalCost += healthCost;
      events.push('Health emergency');
    }
  }
  
  // Family emergencies
  if (familySize > 2) {
    const familyEmergencyProbability = 0.08 * (familySize / 4); // 8% base, scaled by family size
    if (Math.random() < familyEmergencyProbability) {
      const emergencyCost = 15000 + (Math.random() * 25000); // $15K-$40K
      totalCost += emergencyCost;
      events.push('Family emergency');
    }
  }
  
  return { cost: totalCost, events };
}

// Education cost projection
function calculateEducationCosts(
  children: number, 
  childrenNames: string[], 
  currentAge: number, 
  year: number
): number {
  if (children === 0) return 0;
  
  let totalEducationCosts = 0;
  const educationInflationRate = 0.055; // 5.5% annually
  
  // Assume children are currently 8-16 years old
  for (let i = 0; i < children; i++) {
    const childAge = 8 + (i * 2); // Spread children ages
    const collegeStartYear = 2025 + (18 - childAge);
    
    if (year >= collegeStartYear && year < collegeStartYear + 4) {
      // Child is in college during this year
      const yearsToCollege = collegeStartYear - 2025;
      const currentCollegeCost = 75000; // Private college baseline
      const inflatedCost = currentCollegeCost * Math.pow(1 + educationInflationRate, yearsToCollege);
      totalEducationCosts += inflatedCost;
    }
  }
  
  return totalEducationCosts;
}

// Parent care cost model
function calculateParentCareCosts(
  parentsSituation: string, 
  currentAge: number, 
  year: number
): number {
  if (currentAge < 45) return 0; // Too young for parent care
  
  const yearsFromNow = year - 2025;
  const parentAge = 65 + yearsFromNow; // Assume parents are currently 65
  
  if (parentAge < 70) return 0; // Parents still independent
  
  let baseCost = 0;
  switch (parentsSituation) {
    case 'independent':
      baseCost = 0;
      break;
    case 'may-need-support':
      baseCost = 12000; // Occasional support
      break;
    case 'already-helping':
      baseCost = 24000; // Regular support
      break;
  }
  
  // Increase costs with parent age
  const ageFactor = Math.pow(1.1, Math.max(0, parentAge - 75));
  const healthcareInflation = Math.pow(1.055, yearsFromNow);
  
  return baseCost * ageFactor * healthcareInflation;
}

// Main wealth evolution calculation
function calculateWealthEvolution(inputs: CalculatorInputs): WealthProjection[] {
  const projections: WealthProjection[] = [];
  const startYear = 2025;
  const endYear = 2100; // Project 75 years
  
  // Parse income from string
  const incomeMap: { [key: string]: number } = {
    '$50K-$75K': 62500,
    '$75K-$100K': 87500,
    '$100K-$150K': 125000,
    '$150K-$200K': 175000,
    '$200K+': 250000
  };
  
  const baseIncome = incomeMap[inputs.income] || 125000;
  const baseExpenses = baseIncome * 0.7; // Assume 70% of income as expenses
  
  let currentWealth = inputs.netWorth;
  
  for (let year = startYear; year <= endYear; year++) {
    const ageAtYear = inputs.age + (year - startYear);
    
    // Calculate income for this year
    const yearlyIncome = calculateIncomeProgression(baseIncome, inputs.age, year);
    
    // Calculate expenses for this year
    const yearlyExpenses = calculateExpenseProgression(
      baseExpenses, 
      inputs.age, 
      year, 
      inputs.children + 2, // Family size
      inputs.mainConcern
    );
    
    // Calculate investment returns
    const investmentReturns = calculateInvestmentReturns(currentWealth, year);
    
    // Calculate lifecycle events
    const lifecycleEvents = calculateLifecycleEvents(ageAtYear, year, inputs.children + 2);
    
    // Calculate education costs
    const educationCosts = calculateEducationCosts(inputs.children, inputs.childrenNames, inputs.age, year);
    
    // Calculate parent care costs
    const parentCareCosts = calculateParentCareCosts(inputs.parentsSituation, inputs.age, year);
    
    // Update wealth
    const netIncome = yearlyIncome - yearlyExpenses;
    const totalSpecialCosts = lifecycleEvents.cost + educationCosts + parentCareCosts;
    
    currentWealth = Math.max(0, currentWealth + investmentReturns + netIncome - totalSpecialCosts);
    
    projections.push({
      year,
      age: ageAtYear,
      wealth: currentWealth,
      income: yearlyIncome,
      expenses: yearlyExpenses + totalSpecialCosts,
      events: lifecycleEvents.events
    });
    
    // Stop if wealth hits zero
    if (currentWealth === 0) break;
  }
  
  return projections;
}

// Calculate top wealth destroyers
function calculateWealthDestroyers(inputs: CalculatorInputs, projections: WealthProjection[]): WealthDestroyer[] {
  const destroyers: WealthDestroyer[] = [];
  
  // Parent care costs
  const totalParentCare = projections.reduce((sum, p) => {
    return sum + calculateParentCareCosts(inputs.parentsSituation, inputs.age, p.year);
  }, 0);
  
  if (totalParentCare > 0) {
    destroyers.push({
      id: 'parent-care',
      title: 'Unplanned Parent Care',
      icon: '🏥',
      amount: totalParentCare,
      percentage: 35,
      description: 'Without coordination, parent emergencies drain wealth'
    });
  }
  
  // Education costs
  const totalEducation = projections.reduce((sum, p) => {
    return sum + calculateEducationCosts(inputs.children, inputs.childrenNames, inputs.age, p.year);
  }, 0);
  
  if (totalEducation > 0) {
    destroyers.push({
      id: 'education',
      title: 'Education Cost Inflation',
      icon: '🎓',
      amount: totalEducation,
      percentage: 24,
      description: `${inputs.childrenNames.join(' & ')}'s college will cost 60% more than today`
    });
  }
  
  // Estate planning gaps
  destroyers.push({
    id: 'estate-planning',
    title: 'Estate Planning Gaps',
    icon: '⚖️',
    amount: inputs.netWorth * 0.15, // 15% loss due to poor planning
    percentage: 18,
    description: 'Legal fees and taxes without proper planning'
  });
  
  // Lifestyle inflation
  destroyers.push({
    id: 'lifestyle-inflation',
    title: 'Lifestyle Inflation',
    icon: '💸',
    amount: inputs.netWorth * 0.12,
    percentage: 15,
    description: 'Spending growth outpacing wealth growth'
  });
  
  // Investment fees
  destroyers.push({
    id: 'investment-fees',
    title: 'Investment Fees',
    icon: '📈',
    amount: inputs.netWorth * 0.08,
    percentage: 8,
    description: 'High fees compounding over decades'
  });
  
  return destroyers.sort((a, b) => b.amount - a.amount);
}

// Main calculation function
export function calculateWealthExtinction(inputs: CalculatorInputs): WealthResults {
  const projections = calculateWealthEvolution(inputs);
  
  // Find extinction year
  const extinctionProjection = projections.find(p => p.wealth === 0);
  const extinctionYear = extinctionProjection?.year || 2100;
  const yearsRemaining = extinctionYear - 2025;
  
  // Calculate children's inheritance
  const inheritanceYear = 2025 + (65 - inputs.age); // When user turns 65
  const inheritanceProjection = projections.find(p => p.year === inheritanceYear);
  const totalInheritance = inheritanceProjection?.wealth || 0;
  const childrenInheritance = inputs.children > 0 ? totalInheritance / inputs.children : totalInheritance;
  
  // Calculate family impact
  const familyImpact: FamilyImpact = {
    today: {
      netWorth: inputs.netWorth,
      status: 'Feeling secure'
    },
    inheritance: {
      year: inheritanceYear,
      children: inputs.childrenNames.map((name, index) => ({
        name,
        age: 47 - (index * 2), // Estimate ages
        inheritance: childrenInheritance
      }))
    },
    grandchildren: {
      year: extinctionYear,
      inheritance: 0,
      collegeShortfall: 400000 // Estimated future college costs
    }
  };
  
  // Calculate protected scenario
  const protectedScenario: ProtectedScenario = {
    extinctionYear: extinctionYear + 22, // 22 additional years with protection
    additionalYears: 22,
    grandchildrenInheritance: 340000,
    improvements: [
      'Coordinated parent care planning',
      'Education cost optimization',
      'Estate planning implementation',
      'Investment fee reduction',
      'Lifestyle inflation control'
    ]
  };
  
  return {
    extinctionYear,
    yearsRemaining,
    currentWealth: inputs.netWorth,
    childrenInheritance,
    grandchildrenInheritance: 0,
    projections,
    topWealthDestroyers: calculateWealthDestroyers(inputs, projections),
    familyImpact,
    protectedScenario
  };
}

// Smart defaults based on demographics
export function getSmartDefaults(age: number, zipCode: string): Partial<CalculatorInputs> {
  // This would integrate with Census API in production
  // For now, providing reasonable defaults based on age and location
  
  const defaults: Partial<CalculatorInputs> = {};
  
  // Income defaults based on age
  if (age >= 25 && age <= 35) {
    defaults.income = '$75K-$100K';
  } else if (age >= 35 && age <= 50) {
    defaults.income = '$100K-$150K';
  } else if (age >= 50) {
    defaults.income = '$150K-$200K';
  }
  
  // Net worth defaults based on age and income
  const incomeMultiplier = age < 35 ? 2 : age < 50 ? 5 : 8;
  const baseIncome = 125000; // Assume middle income
  defaults.netWorth = Math.round((baseIncome * incomeMultiplier) / 10000) * 10000;
  
  // Family defaults based on age
  if (age >= 30 && age <= 45) {
    defaults.children = 2;
    defaults.childrenNames = ['Emma', 'Jake'];
    defaults.maritalStatus = 'married';
  } else if (age < 30) {
    defaults.children = 0;
    defaults.childrenNames = [];
    defaults.maritalStatus = 'single';
  }
  
  // Main concern defaults based on age
  if (age >= 45) {
    defaults.mainConcern = 'parent-care';
    defaults.parentsSituation = 'may-need-support';
  } else if (age >= 35) {
    defaults.mainConcern = 'college';
    defaults.parentsSituation = 'independent';
  } else {
    defaults.mainConcern = 'retirement';
    defaults.parentsSituation = 'independent';
  }
  
  return defaults;
}