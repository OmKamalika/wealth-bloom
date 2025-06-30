// src/services/AdvancedWealthCalculatorDestroyers.ts
// Implementation of wealth destroyer analysis for the advanced wealth calculation engine
/**
 * Advanced Wealth Calculator Destroyers Service
 * Identifies and quantifies the factors that most significantly deplete wealth
 */
export class AdvancedWealthCalculatorDestroyers {
    /**
     * Identify top wealth destroyers based on user inputs
     */
    static identifyWealthDestroyers(inputs) {
        const destroyers = [];
        // Education costs
        if (inputs.childrenContext.children.length > 0) {
            const educationImpact = this.calculateEducationImpact(inputs);
            destroyers.push({
                factor: 'Education Costs',
                impact: educationImpact,
                description: 'High education aspirations for children can significantly impact wealth',
                preventionStrategy: this.PREVENTION_STRATEGIES.education_costs
            });
        }
        // Healthcare expenses
        const healthcareImpact = this.calculateHealthcareImpact(inputs);
        destroyers.push({
            factor: 'Healthcare Expenses',
            impact: healthcareImpact,
            description: 'Unexpected health emergencies can rapidly deplete wealth',
            preventionStrategy: this.PREVENTION_STRATEGIES.healthcare_expenses
        });
        // Parent care costs
        if (inputs.familyCareContext.parents.length > 0) {
            const parentCareImpact = this.calculateParentCareImpact(inputs);
            destroyers.push({
                factor: 'Parent Care Costs',
                impact: parentCareImpact,
                description: 'Caring for aging parents can strain family finances',
                preventionStrategy: this.PREVENTION_STRATEGIES.parent_care_costs
            });
        }
        // Market volatility
        const marketVolatilityImpact = this.calculateMarketVolatilityImpact(inputs);
        destroyers.push({
            factor: 'Market Volatility',
            impact: marketVolatilityImpact,
            description: 'Poor investment decisions during market downturns',
            preventionStrategy: this.PREVENTION_STRATEGIES.market_volatility
        });
        // Lifestyle inflation
        const lifestyleInflationImpact = this.calculateLifestyleInflationImpact(inputs);
        destroyers.push({
            factor: 'Lifestyle Inflation',
            impact: lifestyleInflationImpact,
            description: 'Increasing expenses outpacing income growth',
            preventionStrategy: this.PREVENTION_STRATEGIES.lifestyle_inflation
        });
        // Tax inefficiency
        const taxInefficiencyImpact = this.calculateTaxInefficiencyImpact(inputs);
        destroyers.push({
            factor: 'Tax Inefficiency',
            impact: taxInefficiencyImpact,
            description: 'Suboptimal tax planning reducing investment returns',
            preventionStrategy: this.PREVENTION_STRATEGIES.tax_inefficiency
        });
        // Investment fees
        const investmentFeesImpact = this.calculateInvestmentFeesImpact(inputs);
        destroyers.push({
            factor: 'Investment Fees',
            impact: investmentFeesImpact,
            description: 'High fees eroding long-term investment returns',
            preventionStrategy: this.PREVENTION_STRATEGIES.investment_fees
        });
        // Emergency expenses
        const emergencyExpensesImpact = this.calculateEmergencyExpensesImpact(inputs);
        destroyers.push({
            factor: 'Emergency Expenses',
            impact: emergencyExpensesImpact,
            description: 'Unexpected expenses without adequate emergency fund',
            preventionStrategy: this.PREVENTION_STRATEGIES.emergency_expenses
        });
        // Family disputes
        if (inputs.familyCareContext.siblings.length > 0) {
            const familyDisputesImpact = this.calculateFamilyDisputesImpact(inputs);
            destroyers.push({
                factor: 'Family Disputes',
                impact: familyDisputesImpact,
                description: 'Financial conflicts and coordination failures among family members',
                preventionStrategy: this.PREVENTION_STRATEGIES.family_disputes
            });
        }
        // Estate planning gaps
        const estatePlanningImpact = this.calculateEstatePlanningImpact(inputs);
        destroyers.push({
            factor: 'Estate Planning Gaps',
            impact: estatePlanningImpact,
            description: 'Inefficient wealth transfer due to inadequate estate planning',
            preventionStrategy: this.PREVENTION_STRATEGIES.estate_planning_gaps
        });
        // Sort by impact (highest first) and return top 5
        return destroyers.sort((a, b) => b.impact - a.impact).slice(0, 5);
    }
    /**
     * Calculate education impact
     */
    static calculateEducationImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.education_costs;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'education_costs');
        const childrenCount = inputs.childrenContext.children.length;
        // Calculate average education cost multiplier
        let educationCostMultiplier = 1.0;
        inputs.childrenContext.children.forEach(child => {
            switch (child.educationAspirations) {
                case 'international':
                    educationCostMultiplier += 2.0;
                    break;
                case 'private_premium':
                    educationCostMultiplier += 1.5;
                    break;
                case 'private_state':
                    educationCostMultiplier += 1.0;
                    break;
                case 'public_premium':
                    educationCostMultiplier += 0.7;
                    break;
                case 'public_state':
                    educationCostMultiplier += 0.5;
                    break;
            }
        });
        educationCostMultiplier /= childrenCount;
        return baseImpact * complexityMultiplier * childrenCount * educationCostMultiplier;
    }
    /**
     * Calculate healthcare impact
     */
    static calculateHealthcareImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.healthcare_expenses;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'healthcare_expenses');
        // Age factor (higher impact for older individuals)
        const ageFactor = inputs.coreIdentity.age < 40 ? 0.8 :
            inputs.coreIdentity.age < 50 ? 1.0 :
                inputs.coreIdentity.age < 60 ? 1.3 : 1.6;
        // Family health history factor
        let familyHealthFactor = 1.0;
        inputs.familyCareContext.parents.forEach(parent => {
            if (parent.healthStatus === 'poor' || parent.healthStatus === 'fair') {
                familyHealthFactor += 0.2; // 20% increase for each parent with health issues
            }
        });
        return baseImpact * complexityMultiplier * ageFactor * familyHealthFactor;
    }
    /**
     * Calculate parent care impact
     */
    static calculateParentCareImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.parent_care_costs;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'parent_care_costs');
        // Calculate parent care factor
        let parentCareFactor = 0;
        inputs.familyCareContext.parents.forEach(parent => {
            switch (parent.financialIndependence) {
                case 'independent':
                    parentCareFactor += 0.2;
                    break;
                case 'occasional_support':
                    parentCareFactor += 0.6;
                    break;
                case 'regular_support':
                    parentCareFactor += 1.0;
                    break;
                case 'full_dependency':
                    parentCareFactor += 1.5;
                    break;
            }
            // Adjust for health status
            if (parent.healthStatus === 'poor') {
                parentCareFactor += 0.5;
            }
            else if (parent.healthStatus === 'fair') {
                parentCareFactor += 0.3;
            }
            // Adjust for location
            if (parent.location === 'different_state') {
                parentCareFactor += 0.3;
            }
            else if (parent.location === 'different_city') {
                parentCareFactor += 0.1;
            }
        });
        // Sibling coordination factor (reduces impact)
        let siblingFactor = 1.0;
        if (inputs.familyCareContext.siblings.length > 0) {
            // Better coordination reduces impact
            if (inputs.familyCareContext.familyCoordination === 'excellent') {
                siblingFactor = 0.6;
            }
            else if (inputs.familyCareContext.familyCoordination === 'good') {
                siblingFactor = 0.8;
            }
            else if (inputs.familyCareContext.familyCoordination === 'poor') {
                siblingFactor = 1.2;
            }
        }
        return baseImpact * complexityMultiplier * parentCareFactor * siblingFactor;
    }
    /**
     * Calculate market volatility impact
     */
    static calculateMarketVolatilityImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.market_volatility;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'market_volatility');
        // Risk tolerance factor
        const riskFactor = inputs.behavioralProfile.riskTolerance === 'aggressive' ? 1.5 :
            inputs.behavioralProfile.riskTolerance === 'moderate' ? 1.0 : 0.7;
        // Market crash response factor
        let behaviorFactor = 1.0;
        switch (inputs.behavioralProfile.marketCrashResponse) {
            case 'panic_sell':
                behaviorFactor = 2.0;
                break;
            case 'worry_hold':
                behaviorFactor = 1.2;
                break;
            case 'buying_opportunity':
                behaviorFactor = 0.5;
                break;
            case 'ignore_it':
                behaviorFactor = 0.8;
                break;
        }
        // Financial sophistication factor
        const sophisticationFactor = inputs.coreIdentity.financialSophistication === 'expert' ? 0.6 :
            inputs.coreIdentity.financialSophistication === 'good' ? 0.8 :
                inputs.coreIdentity.financialSophistication === 'moderate' ? 1.0 : 1.3;
        return baseImpact * complexityMultiplier * riskFactor * behaviorFactor * sophisticationFactor;
    }
    /**
     * Calculate lifestyle inflation impact
     */
    static calculateLifestyleInflationImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.lifestyle_inflation;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'lifestyle_inflation');
        // Income factor (higher income = higher potential for lifestyle inflation)
        const incomeFactor = inputs.financialFoundation.annualIncome > 2000000 ? 1.5 :
            inputs.financialFoundation.annualIncome > 1000000 ? 1.2 :
                inputs.financialFoundation.annualIncome > 500000 ? 1.0 : 0.8;
        // City type factor (metro cities have higher lifestyle inflation)
        const cityFactor = inputs.coreIdentity.location.cityType === 'metro' ? 1.4 :
            inputs.coreIdentity.location.cityType === 'tier2' ? 1.2 :
                inputs.coreIdentity.location.cityType === 'tier3' ? 1.0 : 0.8;
        return baseImpact * complexityMultiplier * incomeFactor * cityFactor;
    }
    /**
     * Calculate tax inefficiency impact
     */
    static calculateTaxInefficiencyImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.tax_inefficiency;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'tax_inefficiency');
        // Financial sophistication factor (lower sophistication = higher tax inefficiency)
        const sophisticationFactor = inputs.coreIdentity.financialSophistication === 'expert' ? 0.5 :
            inputs.coreIdentity.financialSophistication === 'good' ? 0.7 :
                inputs.coreIdentity.financialSophistication === 'moderate' ? 1.0 : 1.3;
        // Income factor (higher income = higher tax complexity)
        const incomeFactor = inputs.financialFoundation.annualIncome > 2000000 ? 1.5 :
            inputs.financialFoundation.annualIncome > 1000000 ? 1.2 :
                inputs.financialFoundation.annualIncome > 500000 ? 1.0 : 0.8;
        return baseImpact * complexityMultiplier * sophisticationFactor * incomeFactor;
    }
    /**
     * Calculate investment fees impact
     */
    static calculateInvestmentFeesImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.investment_fees;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'investment_fees');
        // Financial sophistication factor (lower sophistication = higher fees)
        const sophisticationFactor = inputs.coreIdentity.financialSophistication === 'expert' ? 0.6 :
            inputs.coreIdentity.financialSophistication === 'good' ? 0.8 :
                inputs.coreIdentity.financialSophistication === 'moderate' ? 1.0 : 1.2;
        // Net worth factor (higher net worth = higher absolute fee impact)
        const netWorthFactor = inputs.financialFoundation.currentNetWorth > 10000000 ? 1.5 :
            inputs.financialFoundation.currentNetWorth > 5000000 ? 1.2 :
                inputs.financialFoundation.currentNetWorth > 1000000 ? 1.0 : 0.8;
        return baseImpact * complexityMultiplier * sophisticationFactor * netWorthFactor;
    }
    /**
     * Calculate emergency expenses impact
     */
    static calculateEmergencyExpensesImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.emergency_expenses;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'emergency_expenses');
        // Family size factor (larger families = more potential emergencies)
        const familySizeFactor = 1.0 + (inputs.childrenContext.children.length * 0.2);
        // Age factor (higher age = more health emergencies)
        const ageFactor = inputs.coreIdentity.age < 40 ? 0.8 :
            inputs.coreIdentity.age < 50 ? 1.0 :
                inputs.coreIdentity.age < 60 ? 1.2 : 1.4;
        return baseImpact * complexityMultiplier * familySizeFactor * ageFactor;
    }
    /**
     * Calculate family disputes impact
     */
    static calculateFamilyDisputesImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.family_disputes;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'family_disputes');
        // Sibling relationship factor
        let siblingFactor = 1.0;
        inputs.familyCareContext.siblings.forEach(sibling => {
            if (sibling.relationshipQuality === 'strained') {
                siblingFactor += 0.3;
            }
            else if (sibling.relationshipQuality === 'non_communicative') {
                siblingFactor += 0.5;
            }
        });
        // Family coordination factor
        const coordinationFactor = inputs.familyCareContext.familyCoordination === 'excellent' ? 0.5 :
            inputs.familyCareContext.familyCoordination === 'good' ? 0.8 :
                inputs.familyCareContext.familyCoordination === 'chaotic' ? 1.5 : 2.0;
        return baseImpact * complexityMultiplier * siblingFactor * coordinationFactor;
    }
    /**
     * Calculate estate planning impact
     */
    static calculateEstatePlanningImpact(inputs) {
        const baseImpact = this.BASE_IMPACT_FACTORS.estate_planning_gaps;
        const complexityMultiplier = this.getComplexityMultiplier(inputs, 'estate_planning_gaps');
        // Net worth factor (higher net worth = higher impact of poor estate planning)
        const netWorthFactor = inputs.financialFoundation.currentNetWorth > 10000000 ? 1.8 :
            inputs.financialFoundation.currentNetWorth > 5000000 ? 1.4 :
                inputs.financialFoundation.currentNetWorth > 1000000 ? 1.0 : 0.7;
        // Family complexity factor
        const familyComplexityFactor = 1.0 + (inputs.childrenContext.children.length * 0.2) +
            (inputs.familyCareContext.siblings.length * 0.1);
        return baseImpact * complexityMultiplier * netWorthFactor * familyComplexityFactor;
    }
    /**
     * Get complexity multiplier for a specific destroyer
     */
    static getComplexityMultiplier(inputs, destroyerType) {
        const complexityScore = inputs.complexityAnalysis.complexityScore;
        const baseMultiplier = 1.0;
        // If complexity score is 5 or less, no additional multiplier
        if (complexityScore <= 5) {
            return baseMultiplier;
        }
        // Calculate additional multiplier based on complexity above 5
        const additionalComplexity = complexityScore - 5;
        const complexityImpact = additionalComplexity * this.COMPLEXITY_MULTIPLIERS[destroyerType];
        return baseMultiplier + complexityImpact;
    }
    /**
     * Calculate the total wealth destruction impact
     */
    static calculateTotalWealthDestruction(inputs) {
        const destroyers = this.identifyWealthDestroyers(inputs);
        return destroyers.reduce((total, destroyer) => total + destroyer.impact, 0);
    }
    /**
     * Calculate the wealth destruction as a percentage of current net worth
     */
    static calculateWealthDestructionPercentage(inputs) {
        const totalDestruction = this.calculateTotalWealthDestruction(inputs);
        return totalDestruction / inputs.financialFoundation.currentNetWorth;
    }
    /**
     * Generate personalized prevention strategies
     */
    static generatePreventionStrategies(inputs) {
        const destroyers = this.identifyWealthDestroyers(inputs);
        const strategies = [];
        destroyers.forEach(destroyer => {
            const difficulty = this.getStrategyDifficulty(destroyer.factor);
            const impact = this.getStrategyImpact(destroyer.factor, destroyer.impact);
            const timeframe = this.getStrategyTimeframe(destroyer.factor);
            strategies.push({
                destroyer: destroyer.factor,
                strategy: destroyer.preventionStrategy,
                difficulty,
                impact,
                timeframe
            });
        });
        return strategies;
    }
    /**
     * Get strategy difficulty
     */
    static getStrategyDifficulty(destroyerType) {
        switch (destroyerType) {
            case 'Investment Fees':
            case 'Tax Inefficiency':
            case 'Emergency Expenses':
                return 'easy';
            case 'Lifestyle Inflation':
            case 'Market Volatility':
            case 'Estate Planning Gaps':
                return 'medium';
            case 'Parent Care Costs':
            case 'Family Disputes':
            case 'Education Costs':
            case 'Healthcare Expenses':
                return 'hard';
            default:
                return 'medium';
        }
    }
    /**
     * Get strategy impact
     */
    static getStrategyImpact(destroyerType, impact) {
        // High impact if over 2 million
        if (impact > 2000000)
            return 'high';
        // Medium impact if over 1 million
        if (impact > 1000000)
            return 'medium';
        // Otherwise low impact
        return 'low';
    }
    /**
     * Get strategy timeframe
     */
    static getStrategyTimeframe(destroyerType) {
        switch (destroyerType) {
            case 'Investment Fees':
            case 'Emergency Expenses':
                return '1-3 months';
            case 'Tax Inefficiency':
            case 'Market Volatility':
            case 'Lifestyle Inflation':
                return '3-6 months';
            case 'Estate Planning Gaps':
            case 'Family Disputes':
                return '6-12 months';
            case 'Parent Care Costs':
            case 'Education Costs':
            case 'Healthcare Expenses':
                return '1-2 years';
            default:
                return '6-12 months';
        }
    }
}
// Base impact factors for different wealth destroyers (in INR)
AdvancedWealthCalculatorDestroyers.BASE_IMPACT_FACTORS = {
    'education_costs': 2500000, // ₹25L base impact
    'healthcare_expenses': 1800000, // ₹18L base impact
    'parent_care_costs': 1500000, // ₹15L base impact
    'market_volatility': 1200000, // ₹12L base impact
    'lifestyle_inflation': 800000, // ₹8L base impact
    'tax_inefficiency': 700000, // ₹7L base impact
    'investment_fees': 600000, // ₹6L base impact
    'emergency_expenses': 500000, // ₹5L base impact
    'family_disputes': 1000000, // ₹10L base impact
    'estate_planning_gaps': 900000 // ₹9L base impact
};
// Multipliers based on family complexity
AdvancedWealthCalculatorDestroyers.COMPLEXITY_MULTIPLIERS = {
    'education_costs': 0.2, // +20% per complexity point above 5
    'healthcare_expenses': 0.15, // +15% per complexity point above 5
    'parent_care_costs': 0.25, // +25% per complexity point above 5
    'market_volatility': 0.1, // +10% per complexity point above 5
    'lifestyle_inflation': 0.15, // +15% per complexity point above 5
    'tax_inefficiency': 0.1, // +10% per complexity point above 5
    'investment_fees': 0.05, // +5% per complexity point above 5
    'emergency_expenses': 0.1, // +10% per complexity point above 5
    'family_disputes': 0.3, // +30% per complexity point above 5
    'estate_planning_gaps': 0.2 // +20% per complexity point above 5
};
// Prevention strategies for each destroyer
AdvancedWealthCalculatorDestroyers.PREVENTION_STRATEGIES = {
    'education_costs': 'Start education planning early, explore scholarships and loans',
    'healthcare_expenses': 'Maintain comprehensive health insurance and emergency fund',
    'parent_care_costs': 'Coordinate with siblings and plan for care costs early',
    'market_volatility': 'Maintain diversified portfolio and avoid panic selling',
    'lifestyle_inflation': 'Monitor expenses and maintain disciplined spending',
    'tax_inefficiency': 'Optimize investment accounts and tax planning',
    'investment_fees': 'Use low-cost investment vehicles and negotiate fees',
    'emergency_expenses': 'Build and maintain adequate emergency fund',
    'family_disputes': 'Establish clear communication and decision-making processes',
    'estate_planning_gaps': 'Create comprehensive estate plan with professional guidance'
};
