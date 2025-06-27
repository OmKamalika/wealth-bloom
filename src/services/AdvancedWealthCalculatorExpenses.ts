// src/services/AdvancedWealthCalculatorExpenses.ts
// Implementation of expense progression calculations for the advanced wealth calculation engine

import { CalculatorData } from '../types/calculator';

/**
 * Advanced Wealth Calculator Expenses Service
 * Implements sophisticated expense modeling with Indian market context
 */
export class AdvancedWealthCalculatorExpenses {
  // Indian inflation rates by category (annual)
  private static readonly CATEGORY_INFLATION_RATES: Record<string, number> = {
    'housing': 0.06, // 6% for housing
    'education': 0.08, // 8% for education (higher in India)
    'healthcare': 0.07, // 7% for healthcare
    'food': 0.05, // 5% for food
    'transportation': 0.045, // 4.5% for transportation
    'utilities': 0.05, // 5% for utilities
    'leisure': 0.04, // 4% for leisure
    'default': 0.045 // 4.5% default inflation
  };

  // Base expense ratios by city type (% of income)
  private static readonly CITY_EXPENSE_RATIOS: Record<string, number> = {
    'metro': 0.65, // 65% of income in metro cities
    'tier2': 0.6, // 60% in tier 2 cities
    'tier3': 0.55, // 55% in tier 3 cities
    'rural': 0.5, // 50% in rural areas
    'default': 0.6 // 60% default
  };

  // Education expense multipliers by aspiration level
  private static readonly EDUCATION_EXPENSE_MULTIPLIERS: Record<string, number> = {
    'public_state': 1.0,
    'public_premium': 1.5,
    'private_state': 2.0,
    'private_premium': 3.0,
    'international': 5.0,
    'default': 1.5
  };

  // Healthcare expense multipliers by health status
  private static readonly HEALTHCARE_EXPENSE_MULTIPLIERS: Record<string, number> = {
    'excellent': 1.0,
    'good': 1.2,
    'fair': 1.8,
    'poor': 3.0,
    'default': 1.5
  };

  // Parent care expense base (monthly in INR)
  private static readonly PARENT_CARE_BASE_EXPENSE: Record<string, number> = {
    'independent': 10000,
    'occasional_support': 25000,
    'regular_support': 40000,
    'full_dependency': 60000
  };

  /**
   * Calculate Indian expense progression based on detailed inputs
   */
  static calculateIndianExpenseProgression(year: number, currentAge: number, inputs: CalculatorData): number {
    // Base expenses as percentage of income
    const baseIncome = inputs.financialFoundation.annualIncome;
    const cityType = inputs.coreIdentity.location.cityType;
    const baseExpenseRatio = this.CITY_EXPENSE_RATIOS[cityType] || this.CITY_EXPENSE_RATIOS.default;
    let baseExpenses = baseIncome * baseExpenseRatio;
    
    // Calculate living expenses with inflation
    const livingExpenses = this.calculateLivingExpenses(baseExpenses, year);
    
    // Calculate education expenses for children
    const educationExpenses = this.calculateEducationExpenses(year, currentAge, inputs);
    
    // Calculate healthcare expenses
    const healthcareExpenses = this.calculateHealthcareExpenses(year, currentAge, inputs);
    
    // Calculate parent care expenses
    const parentCareExpenses = this.calculateParentCareExpenses(year, currentAge, inputs);
    
    // Calculate lifecycle event expenses
    const lifecycleExpenses = this.calculateLifecycleExpenses(year, currentAge, inputs);
    
    // Sum all expenses
    const totalExpenses = livingExpenses + educationExpenses + healthcareExpenses + 
                          parentCareExpenses + lifecycleExpenses;
    
    return totalExpenses;
  }

  /**
   * Calculate living expenses with Indian inflation patterns
   */
  private static calculateLivingExpenses(baseExpenses: number, year: number): number {
    // Expense categories with their proportions
    const categoryProportions = {
      'housing': 0.3,
      'food': 0.2,
      'transportation': 0.1,
      'utilities': 0.1,
      'leisure': 0.1,
      'default': 0.2
    };
    
    // Calculate inflation impact for each category
    let inflatedExpenses = 0;
    for (const [category, proportion] of Object.entries(categoryProportions)) {
      const categoryExpense = baseExpenses * proportion;
      const categoryInflation = this.CATEGORY_INFLATION_RATES[category] || this.CATEGORY_INFLATION_RATES.default;
      
      // Compound inflation for the number of years
      inflatedExpenses += categoryExpense * Math.pow(1 + categoryInflation, year);
    }
    
    return inflatedExpenses;
  }

  /**
   * Calculate education expenses for children
   */
  private static calculateEducationExpenses(year: number, currentAge: number, inputs: CalculatorData): number {
    const currentYear = 2025 + year;
    let totalEducationExpenses = 0;
    
    // Calculate for each child
    for (const child of inputs.childrenContext.children) {
      const childAge = child.age + year;
      
      // Skip if child is too young or too old for education expenses
      if (childAge < 3 || childAge > 25) continue;
      
      // Determine education phase and base cost
      let baseEducationCost = 0;
      
      if (childAge >= 3 && childAge < 6) {
        // Preschool
        baseEducationCost = 100000; // ₹1 lakh per year
      } else if (childAge >= 6 && childAge < 18) {
        // School education
        baseEducationCost = 150000; // ₹1.5 lakh per year
        
        // Adjust based on current school type
        switch (child.currentSchoolType) {
          case 'international':
            baseEducationCost = 500000; // ₹5 lakh for international schools
            break;
          case 'private_english':
            baseEducationCost = 300000; // ₹3 lakh for private English medium
            break;
          case 'private_vernacular':
            baseEducationCost = 150000; // ₹1.5 lakh for private vernacular
            break;
          case 'government':
            baseEducationCost = 50000; // ₹50k for government schools
            break;
        }
      } else if (childAge >= 18 && childAge <= 25) {
        // Higher education
        baseEducationCost = 300000; // ₹3 lakh per year
        
        // Adjust based on education aspirations
        const aspirationMultiplier = this.EDUCATION_EXPENSE_MULTIPLIERS[child.educationAspirations] || 
                                    this.EDUCATION_EXPENSE_MULTIPLIERS.default;
        baseEducationCost *= aspirationMultiplier;
      }
      
      // Adjust for academic performance (scholarships for high performers)
      switch (child.academicPerformance) {
        case 'exceptional':
          baseEducationCost *= 0.7; // 30% scholarship
          break;
        case 'above_average':
          baseEducationCost *= 0.85; // 15% scholarship
          break;
        case 'average':
          // No adjustment
          break;
        case 'struggling':
          baseEducationCost *= 1.2; // 20% more for extra tutoring
          break;
      }
      
      // Apply education inflation (compounded)
      const educationInflation = this.CATEGORY_INFLATION_RATES.education;
      const inflatedEducationCost = baseEducationCost * Math.pow(1 + educationInflation, year);
      
      totalEducationExpenses += inflatedEducationCost;
    }
    
    return totalEducationExpenses;
  }

  /**
   * Calculate healthcare expenses with age and health status factors
   */
  private static calculateHealthcareExpenses(year: number, currentAge: number, inputs: CalculatorData): number {
    // Base healthcare cost increases with age
    let baseHealthcareCost = 50000; // ₹50k base annual healthcare cost
    
    // Increase healthcare costs with age
    if (currentAge > 40) {
      const yearsOver40 = currentAge - 40;
      baseHealthcareCost *= (1 + (yearsOver40 * 0.03)); // 3% increase per year over 40
    }
    
    // Adjust for health status if married (consider both self and spouse)
    if (inputs.coreIdentity.maritalStatus === 'married') {
      // Assuming average health status for self
      baseHealthcareCost *= 1.8; // Adjustment for couple
    }
    
    // Apply healthcare inflation (compounded)
    const healthcareInflation = this.CATEGORY_INFLATION_RATES.healthcare;
    const inflatedHealthcareCost = baseHealthcareCost * Math.pow(1 + healthcareInflation, year);
    
    return inflatedHealthcareCost;
  }

  /**
   * Calculate parent care expenses
   */
  private static calculateParentCareExpenses(year: number, currentAge: number, inputs: CalculatorData): number {
    let totalParentCareExpenses = 0;
    
    // Calculate for each parent
    for (const parent of inputs.familyCareContext.parents) {
      const parentAge = parent.age + year;
      
      // Skip if parent is no longer alive (rough estimate)
      if (parentAge > 95) continue;
      
      // Base monthly expense based on dependency level
      let monthlyExpense = this.PARENT_CARE_BASE_EXPENSE[parent.financialIndependence] || 0;
      
      // Adjust for health status
      const healthMultiplier = this.HEALTHCARE_EXPENSE_MULTIPLIERS[parent.healthStatus] || 
                              this.HEALTHCARE_EXPENSE_MULTIPLIERS.default;
      monthlyExpense *= healthMultiplier;
      
      // Adjust for living arrangement
      switch (parent.livingArrangement) {
        case 'with_family':
          monthlyExpense *= 0.8; // 20% less expensive when living with family
          break;
        case 'assisted':
          monthlyExpense *= 1.5; // 50% more expensive in assisted living
          break;
        case 'independent':
          // No adjustment
          break;
      }
      
      // Adjust for location
      switch (parent.location) {
        case 'same_city':
          // No adjustment
          break;
        case 'different_city':
          monthlyExpense *= 1.1; // 10% more expensive for travel
          break;
        case 'different_state':
          monthlyExpense *= 1.2; // 20% more expensive for travel
          break;
      }
      
      // Apply healthcare inflation (compounded)
      const healthcareInflation = this.CATEGORY_INFLATION_RATES.healthcare;
      const inflatedMonthlyExpense = monthlyExpense * Math.pow(1 + healthcareInflation, year);
      
      // Convert to annual expense
      const annualExpense = inflatedMonthlyExpense * 12;
      
      totalParentCareExpenses += annualExpense;
    }
    
    // Add spouse's parents if applicable
    if (inputs.coreIdentity.maritalStatus === 'married') {
      for (const parent of inputs.familyCareContext.spouseParents) {
        if (parent.supportNeeded) {
          // Simplified calculation for spouse parents
          let baseExpense = 240000; // ₹20k per month
          
          // Apply healthcare inflation (compounded)
          const healthcareInflation = this.CATEGORY_INFLATION_RATES.healthcare;
          const inflatedExpense = baseExpense * Math.pow(1 + healthcareInflation, year);
          
          totalParentCareExpenses += inflatedExpense;
        }
      }
    }
    
    return totalParentCareExpenses;
  }

  /**
   * Calculate lifecycle event expenses
   */
  private static calculateLifecycleExpenses(year: number, currentAge: number, inputs: CalculatorData): number {
    const currentYear = 2025 + year;
    let lifecycleExpenses = 0;
    
    // Children's marriage expenses
    for (const child of inputs.childrenContext.children) {
      const childAge = child.age + year;
      
      // Typical marriage age in India
      const marriageAge = child.gender === 'female' ? 27 : 30;
      
      // If child is getting married this year
      if (childAge === marriageAge) {
        // Base marriage expense (significant in Indian context)
        const baseMarriageExpense = 2000000; // ₹20 lakhs
        
        // Apply inflation
        const inflatedMarriageExpense = baseMarriageExpense * Math.pow(1 + 0.05, year);
        
        lifecycleExpenses += inflatedMarriageExpense;
      }
    }
    
    // Home renovation/purchase (every 15 years)
    if (year % 15 === 5) { // In years 5, 20, 35, etc.
      const baseRenovationCost = inputs.financialFoundation.currentNetWorth * 0.05; // 5% of net worth
      const inflatedRenovationCost = baseRenovationCost * Math.pow(1 + this.CATEGORY_INFLATION_RATES.housing, year);
      lifecycleExpenses += inflatedRenovationCost;
    }
    
    // Major health event probability increases with age
    if (currentAge > 60) {
      const healthEventProbability = (currentAge - 60) * 0.01; // 1% increase per year after 60
      if (Math.random() < healthEventProbability) {
        const baseMajorHealthCost = 1000000; // ₹10 lakhs
        const inflatedHealthCost = baseMajorHealthCost * Math.pow(1 + this.CATEGORY_INFLATION_RATES.healthcare, year);
        lifecycleExpenses += inflatedHealthCost;
      }
    }
    
    return lifecycleExpenses;
  }
}