// src/services/AdvancedWealthCalculatorExpenses.ts
// Implementation of expense progression calculations for the advanced wealth calculation engine
/**
 * Advanced Wealth Calculator Expenses Service
 * Implements sophisticated expense modeling with Indian market context
 */
export class AdvancedWealthCalculatorExpenses {
    /**
     * Calculate Indian expense progression based on detailed inputs
     */
    static calculateIndianExpenseProgression(year, currentAge, inputs) {
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
    static calculateLivingExpenses(baseExpenses, year) {
        // Expense categories with their proportions
        const categoryProportions = {
            'housing': 0.35, // Increased from 0.3
            'food': 0.25, // Increased from 0.2
            'transportation': 0.12, // Increased from 0.1
            'utilities': 0.12, // Increased from 0.1
            'leisure': 0.08, // Decreased from 0.1
            'default': 0.08 // Decreased from 0.2
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
    static calculateEducationExpenses(year, currentAge, inputs) {
        const currentYear = 2025 + year;
        let totalEducationExpenses = 0;
        // Calculate for each child
        for (const child of inputs.childrenContext.children) {
            const childAge = child.age + year;
            // Skip if child is too young or too old for education expenses
            if (childAge < 3 || childAge > 25)
                continue;
            // Determine education phase and base cost
            let baseEducationCost = 0;
            if (childAge >= 3 && childAge < 6) {
                // Preschool
                baseEducationCost = 120000; // Increased from 100000
            }
            else if (childAge >= 6 && childAge < 18) {
                // School education
                baseEducationCost = 180000; // Increased from 150000
                // Adjust based on current school type
                switch (child.currentSchoolType) {
                    case 'international':
                        baseEducationCost = 600000; // Increased from 500000
                        break;
                    case 'private_english':
                        baseEducationCost = 350000; // Increased from 300000
                        break;
                    case 'private_vernacular':
                        baseEducationCost = 180000; // Increased from 150000
                        break;
                    case 'government':
                        baseEducationCost = 60000; // Increased from 50000
                        break;
                }
            }
            else if (childAge >= 18 && childAge <= 25) {
                // Higher education
                baseEducationCost = 350000; // Increased from 300000
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
                    baseEducationCost *= 1.3; // 30% more for extra tutoring (increased from 20%)
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
    static calculateHealthcareExpenses(year, currentAge, inputs) {
        // Base healthcare cost increases with age
        let baseHealthcareCost = 60000; // Increased from 50000
        // Increase healthcare costs with age
        if (currentAge > 40) {
            const yearsOver40 = currentAge - 40;
            baseHealthcareCost *= (1 + (yearsOver40 * 0.04)); // Increased from 0.03
        }
        // Adjust for health status if married (consider both self and spouse)
        if (inputs.coreIdentity.maritalStatus === 'married') {
            // Assuming average health status for self
            baseHealthcareCost *= 1.9; // Increased from 1.8
        }
        // Apply healthcare inflation (compounded)
        const healthcareInflation = this.CATEGORY_INFLATION_RATES.healthcare;
        const inflatedHealthcareCost = baseHealthcareCost * Math.pow(1 + healthcareInflation, year);
        // Add age-related healthcare spike events
        if (currentAge > 60 && Math.random() < 0.15) { // 15% chance of health event after 60
            const healthEventCost = 100000 + (Math.random() * 400000); // 1L to 5L additional cost
            return inflatedHealthcareCost + healthEventCost;
        }
        return inflatedHealthcareCost;
    }
    /**
     * Calculate parent care expenses
     */
    static calculateParentCareExpenses(year, currentAge, inputs) {
        let totalParentCareExpenses = 0;
        // Calculate for each parent
        for (const parent of inputs.familyCareContext.parents) {
            const parentAge = parent.age + year;
            // Skip if parent is no longer alive (rough estimate)
            if (parentAge > 95)
                continue;
            // Base monthly expense based on dependency level
            let monthlyExpense = this.PARENT_CARE_BASE_EXPENSE[parent.financialIndependence] || 0;
            // Adjust for health status
            const healthMultiplier = this.HEALTHCARE_EXPENSE_MULTIPLIERS[parent.healthStatus] ||
                this.HEALTHCARE_EXPENSE_MULTIPLIERS.default;
            monthlyExpense *= healthMultiplier;
            // Adjust for living arrangement
            switch (parent.livingArrangement) {
                case 'with_family':
                    monthlyExpense *= 0.85; // 15% less expensive when living with family (reduced from 20%)
                    break;
                case 'assisted':
                    monthlyExpense *= 1.7; // 70% more expensive in assisted living (increased from 50%)
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
                    monthlyExpense *= 1.15; // 15% more expensive for travel (increased from 10%)
                    break;
                case 'different_state':
                    monthlyExpense *= 1.25; // 25% more expensive for travel (increased from 20%)
                    break;
            }
            // Increase care needs with age
            if (parentAge > 75) {
                const yearsOver75 = parentAge - 75;
                monthlyExpense *= (1 + (yearsOver75 * 0.05)); // 5% increase per year over 75
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
                    let baseExpense = 300000; // Increased from 240000
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
    static calculateLifecycleExpenses(year, currentAge, inputs) {
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
                const baseMarriageExpense = 2500000; // Increased from 2000000
                // Apply inflation
                const inflatedMarriageExpense = baseMarriageExpense * Math.pow(1 + 0.06, year); // 6% inflation
                lifecycleExpenses += inflatedMarriageExpense;
            }
        }
        // Home renovation/purchase (every 15 years)
        if (year % 15 === 5) { // In years 5, 20, 35, etc.
            const baseRenovationCost = inputs.financialFoundation.currentNetWorth * 0.06; // Increased from 0.05
            const inflatedRenovationCost = baseRenovationCost * Math.pow(1 + this.CATEGORY_INFLATION_RATES.housing, year);
            lifecycleExpenses += inflatedRenovationCost;
        }
        // Major health event probability increases with age
        if (currentAge > 60) {
            const healthEventProbability = (currentAge - 60) * 0.015; // Increased from 0.01
            if (Math.random() < healthEventProbability) {
                const baseMajorHealthCost = 1500000; // Increased from 1000000
                const inflatedHealthCost = baseMajorHealthCost * Math.pow(1 + this.CATEGORY_INFLATION_RATES.healthcare, year);
                lifecycleExpenses += inflatedHealthCost;
            }
        }
        // Family emergency expenses (random events)
        if (Math.random() < 0.08) { // 8% chance each year
            const emergencyCost = 100000 + (Math.random() * 300000); // 1L to 4L
            lifecycleExpenses += emergencyCost;
        }
        // Vehicle replacement (every 8 years)
        if (year % 8 === 4) {
            const vehicleCost = 800000 * Math.pow(1 + 0.05, year); // 8L with 5% inflation
            lifecycleExpenses += vehicleCost;
        }
        return lifecycleExpenses;
    }
}
// Indian inflation rates by category (annual)
AdvancedWealthCalculatorExpenses.CATEGORY_INFLATION_RATES = {
    'housing': 0.07, // Increased from 0.06
    'education': 0.09, // Increased from 0.08
    'healthcare': 0.085, // Increased from 0.07
    'food': 0.06, // Increased from 0.05
    'transportation': 0.055, // Increased from 0.045
    'utilities': 0.06, // Increased from 0.05
    'leisure': 0.05, // Increased from 0.04
    'default': 0.055 // Increased from 0.045
};
// Base expense ratios by city type (% of income)
AdvancedWealthCalculatorExpenses.CITY_EXPENSE_RATIOS = {
    'metro': 0.70, // Increased from 0.65
    'tier2': 0.65, // Increased from 0.6
    'tier3': 0.60, // Increased from 0.55
    'rural': 0.55, // Increased from 0.5
    'default': 0.65 // Increased from 0.6
};
// Education expense multipliers by aspiration level
AdvancedWealthCalculatorExpenses.EDUCATION_EXPENSE_MULTIPLIERS = {
    'public_state': 1.0,
    'public_premium': 1.5,
    'private_state': 2.0,
    'private_premium': 3.5, // Increased from 3.0
    'international': 6.0, // Increased from 5.0
    'default': 1.5
};
// Healthcare expense multipliers by health status
AdvancedWealthCalculatorExpenses.HEALTHCARE_EXPENSE_MULTIPLIERS = {
    'excellent': 1.0,
    'good': 1.3, // Increased from 1.2
    'fair': 2.0, // Increased from 1.8
    'poor': 3.5, // Increased from 3.0
    'default': 1.5
};
// Parent care expense base (monthly in INR)
AdvancedWealthCalculatorExpenses.PARENT_CARE_BASE_EXPENSE = {
    'independent': 12000, // Increased from 10000
    'occasional_support': 30000, // Increased from 25000
    'regular_support': 50000, // Increased from 40000
    'full_dependency': 75000 // Increased from 60000
};
