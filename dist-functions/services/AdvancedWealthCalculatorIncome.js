// src/services/AdvancedWealthCalculatorIncome.ts
// Implementation of income progression calculations for the advanced wealth calculation engine
/**
 * Advanced Wealth Calculator Income Progression Service
 * Implements sophisticated income modeling with Indian market context
 */
export class AdvancedWealthCalculatorIncome {
    /**
     * Calculate Indian income progression based on detailed inputs
     */
    static calculateIndianIncomeProgression(year, currentAge, inputs) {
        const baseIncome = inputs.financialFoundation.annualIncome;
        // Different calculation methods based on income source
        switch (inputs.financialFoundation.primaryIncomeSource) {
            case 'salary':
                return this.calculateSalaryProgression(year, currentAge, baseIncome, inputs);
            case 'business':
                return this.calculateBusinessIncomeProgression(year, currentAge, baseIncome, inputs);
            case 'mixed':
                return this.calculateMixedIncomeProgression(year, currentAge, baseIncome, inputs);
            default:
                return this.calculateDefaultIncomeProgression(year, currentAge, baseIncome);
        }
    }
    /**
     * Calculate salary progression with Indian corporate context
     */
    static calculateSalaryProgression(year, currentAge, baseIncome, inputs) {
        // Get industry growth rate with fallback
        const industry = inputs.coreIdentity.employment?.industry?.toLowerCase() || 'default';
        const industryGrowthRate = this.INDUSTRY_GROWTH_RATES[industry] || this.INDUSTRY_GROWTH_RATES.default;
        // Get role progression factor with fallback
        const roleLevel = inputs.coreIdentity.employment?.roleLevel || 'mid';
        const roleProgressionFactor = this.ROLE_PROGRESSION_FACTORS[roleLevel] || this.ROLE_PROGRESSION_FACTORS.mid;
        // Calculate base growth rate (decreases with age)
        let baseGrowthRate = roleProgressionFactor;
        // Adjust for age - growth slows down after 45 and becomes negative after 60
        if (currentAge > 45 && currentAge <= 60) {
            baseGrowthRate *= Math.pow(0.92, currentAge - 45); // 8% reduction per year after 45
        }
        else if (currentAge > 60) {
            // After retirement age, income decreases more rapidly
            baseGrowthRate = -0.05 - (0.01 * (currentAge - 60)); // Starting at -5% and decreasing by 1% each year
        }
        // Adjust for education level
        const educationMultiplier = this.getEducationMultiplier(inputs.coreIdentity.education?.level || 'bachelors');
        // Adjust for city tier
        const locationMultiplier = this.getLocationMultiplier(inputs.coreIdentity.location?.cityType || 'tier2');
        // Calculate income for this year
        let yearlyIncome = baseIncome;
        // Apply compounding growth for each year
        for (let i = 0; i < year; i++) {
            const yearGrowthRate = baseGrowthRate + (industryGrowthRate * 0.3); // Reduced industry impact from 0.5 to 0.3
            yearlyIncome *= (1 + yearGrowthRate * educationMultiplier * locationMultiplier);
            // Adjust growth rate for next year (more significant decrease over time)
            baseGrowthRate *= 0.96; // Increased from 0.98 to accelerate decline
        }
        // Handle retirement
        if (currentAge >= 60) {
            const yearsIntoRetirement = currentAge - 60;
            const retirementFactor = Math.max(0.05, 1 - (yearsIntoRetirement * 0.20)); // 20% reduction per year, min 5%
            yearlyIncome *= retirementFactor;
        }
        return yearlyIncome;
    }
    /**
     * Calculate business income progression with Indian entrepreneurial context
     */
    static calculateBusinessIncomeProgression(year, currentAge, baseIncome, inputs) {
        // Determine business age category (assuming business started at age 30 if no data)
        const businessStartAge = 30; // Default assumption
        const businessAge = Math.max(0, currentAge - businessStartAge);
        let businessGrowthRate;
        // Determine business growth rate based on age
        if (businessAge < 3) {
            businessGrowthRate = this.BUSINESS_GROWTH_RATES.startup;
        }
        else if (businessAge < 7) {
            businessGrowthRate = this.BUSINESS_GROWTH_RATES.growth;
        }
        else if (businessAge < 15) {
            businessGrowthRate = this.BUSINESS_GROWTH_RATES.established;
        }
        else {
            businessGrowthRate = this.BUSINESS_GROWTH_RATES.mature;
        }
        // Adjust for financial sophistication
        const sophisticationMultiplier = this.getFinancialSophisticationMultiplier(inputs.coreIdentity.financialSophistication || 'moderate');
        // Adjust for location
        const locationMultiplier = this.getLocationMultiplier(inputs.coreIdentity.location?.cityType || 'tier2');
        // Calculate income for this year
        let yearlyIncome = baseIncome;
        // Apply compounding growth for each year
        for (let i = 0; i < year; i++) {
            // Business income has higher volatility
            const volatilityFactor = 0.7 + (Math.random() * 0.5); // 70-120% of expected growth, increased volatility
            yearlyIncome *= (1 + (businessGrowthRate * sophisticationMultiplier * locationMultiplier * volatilityFactor));
            // Business growth rate decreases more rapidly over time
            businessGrowthRate *= 0.94; // Increased from 0.96 to accelerate decline
        }
        // Handle retirement/business exit
        if (currentAge >= 65) {
            const yearsIntoRetirement = currentAge - 65;
            const retirementFactor = Math.max(0.15, 1 - (yearsIntoRetirement * 0.15)); // 15% reduction per year, min 15%
            yearlyIncome *= retirementFactor;
        }
        // Add market cycle effects - some years can have negative growth
        if (year % 7 === 3 || year % 11 === 5) { // Economic downturns
            yearlyIncome *= 0.85; // 15% reduction in downturn years
        }
        return yearlyIncome;
    }
    /**
     * Calculate mixed income progression (salary + business/investments)
     */
    static calculateMixedIncomeProgression(year, currentAge, baseIncome, inputs) {
        // Assume 60% salary, 40% business/investment income for mixed
        const salaryPortion = baseIncome * 0.6;
        const businessPortion = baseIncome * 0.4;
        const salaryIncome = this.calculateSalaryProgression(year, currentAge, salaryPortion, inputs);
        const businessIncome = this.calculateBusinessIncomeProgression(year, currentAge, businessPortion, inputs);
        return salaryIncome + businessIncome;
    }
    /**
     * Default income progression when specific data is unavailable
     */
    static calculateDefaultIncomeProgression(year, currentAge, baseIncome) {
        // Simple model with age-based growth
        let growthRate = 0.04; // Reduced from 0.05
        // Adjust for age
        if (currentAge > 45 && currentAge <= 60) {
            growthRate *= Math.pow(0.92, currentAge - 45); // Increased from 0.95 to accelerate decline
        }
        else if (currentAge > 60) {
            // After retirement age, income decreases
            growthRate = -0.05 - (0.01 * (currentAge - 60));
        }
        // Apply inflation
        const inflationRate = this.getInflationRate(2025 + year);
        // Calculate income with compounding
        let yearlyIncome = baseIncome;
        for (let i = 0; i < year; i++) {
            yearlyIncome *= (1 + growthRate);
            growthRate *= 0.96; // Increased from 0.98 to accelerate decline
        }
        // Handle retirement
        if (currentAge >= 60) {
            const yearsIntoRetirement = currentAge - 60;
            const retirementFactor = Math.max(0.10, 1 - (yearsIntoRetirement * 0.15)); // Increased from 0.12 to accelerate decline
            yearlyIncome *= retirementFactor;
        }
        // Add market cycle effects
        if (year % 7 === 3 || year % 11 === 5) { // Economic downturns
            yearlyIncome *= 0.9; // 10% reduction in downturn years
        }
        return yearlyIncome;
    }
    /**
     * Get education level multiplier
     */
    static getEducationMultiplier(educationLevel) {
        switch (educationLevel) {
            case 'phd': return 1.15;
            case 'professional': return 1.12;
            case 'masters': return 1.08;
            case 'bachelors': return 1.0;
            case 'high_school': return 0.92;
            default: return 1.0;
        }
    }
    /**
     * Get location multiplier based on city tier
     */
    static getLocationMultiplier(cityType) {
        switch (cityType) {
            case 'metro': return 1.1;
            case 'tier2': return 1.0;
            case 'tier3': return 0.9;
            case 'rural': return 0.8;
            default: return 1.0;
        }
    }
    /**
     * Get financial sophistication multiplier
     */
    static getFinancialSophisticationMultiplier(sophistication) {
        switch (sophistication) {
            case 'expert': return 1.15;
            case 'good': return 1.08;
            case 'moderate': return 1.0;
            case 'beginner': return 0.92;
            default: return 1.0;
        }
    }
    /**
     * Get inflation rate for a specific year
     */
    static getInflationRate(year) {
        return this.INDIAN_INFLATION_RATES[year.toString()] || this.INDIAN_INFLATION_RATES.default;
    }
}
// Indian inflation rates by year (historical and projected)
AdvancedWealthCalculatorIncome.INDIAN_INFLATION_RATES = {
    '2025': 0.045, // 4.5%
    '2026': 0.043, // 4.3%
    '2027': 0.042, // 4.2%
    '2028': 0.040, // 4.0%
    '2029': 0.039, // 3.9%
    '2030': 0.038, // 3.8%
    // Default for future years
    'default': 0.037 // 3.7%
};
// Industry growth rates in India
AdvancedWealthCalculatorIncome.INDUSTRY_GROWTH_RATES = {
    'technology': 0.10, // Reduced from 0.12
    'healthcare': 0.08, // Reduced from 0.09
    'finance': 0.07, // Reduced from 0.08
    'manufacturing': 0.05, // Reduced from 0.06
    'retail': 0.04, // Reduced from 0.05
    'education': 0.035, // Reduced from 0.045
    'government': 0.03, // Reduced from 0.04
    'agriculture': 0.025, // Reduced from 0.035
    'construction': 0.045, // Reduced from 0.055
    'hospitality': 0.04, // Reduced from 0.05
    'transportation': 0.035, // Reduced from 0.045
    'energy': 0.06, // Reduced from 0.07
    'telecommunications': 0.07, // Reduced from 0.08
    'media': 0.05, // Reduced from 0.06
    'pharmaceutical': 0.085, // Reduced from 0.095
    'consulting': 0.065, // Reduced from 0.075
    'real_estate': 0.055, // Reduced from 0.065
    // Default for unlisted industries
    'default': 0.045 // Reduced from 0.055
};
// Career progression factors by role level
AdvancedWealthCalculatorIncome.ROLE_PROGRESSION_FACTORS = {
    'junior': 0.07, // Reduced from 0.08
    'mid': 0.05, // Reduced from 0.06
    'senior': 0.035, // Reduced from 0.045
    'leadership': 0.025 // Reduced from 0.035
};
// Business income growth rates by business age
AdvancedWealthCalculatorIncome.BUSINESS_GROWTH_RATES = {
    'startup': 0.20, // Reduced from 0.25
    'growth': 0.12, // Reduced from 0.15
    'established': 0.06, // Reduced from 0.08
    'mature': 0.03 // Reduced from 0.04
};
