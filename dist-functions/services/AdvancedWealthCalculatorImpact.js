// src/services/AdvancedWealthCalculatorImpact.ts
// Implementation of family impact analysis for the advanced wealth calculation engine
/**
 * Advanced Wealth Calculator Impact Service
 * Analyzes the impact of wealth trajectory on family members across generations
 */
export class AdvancedWealthCalculatorImpact {
    /**
     * Calculate comprehensive family impact analysis
     */
    static calculateFamilyImpact(inputs, projections, extinctionYear) {
        // Calculate user death year (assuming life expectancy of 85)
        const userDeathYear = 2025 + (85 - inputs.coreIdentity.age);
        // Find wealth at death
        const wealthAtDeath = this.findWealthAtYear(projections, userDeathYear);
        // Calculate inheritance impact
        const inheritanceImpact = this.calculateInheritanceImpact(inputs, wealthAtDeath, userDeathYear);
        // Calculate grandchildren impact
        const grandchildrenImpact = this.calculateGrandchildrenImpact(inputs, inheritanceImpact, userDeathYear);
        // Calculate current impact
        const currentImpact = {
            netWorth: inputs.financialFoundation.currentNetWorth,
            status: this.determineFinancialStatus(inputs.financialFoundation.currentNetWorth)
        };
        return {
            today: currentImpact,
            inheritance: inheritanceImpact,
            grandchildren: grandchildrenImpact
        };
    }
    /**
     * Calculate inheritance impact for children
     */
    static calculateInheritanceImpact(inputs, wealthAtDeath, deathYear) {
        // Calculate estate taxes (if applicable)
        const estateTax = this.calculateEstateTax(wealthAtDeath);
        // Calculate transfer costs
        const transferCosts = wealthAtDeath * this.TRANSFER_COST_PERCENTAGE;
        // Calculate net transfer amount
        const netTransfer = Math.max(0, wealthAtDeath - estateTax - transferCosts);
        // Calculate planning efficiency
        const planningEfficiency = this.calculatePlanningEfficiency(inputs);
        // Apply planning efficiency to net transfer
        const effectiveTransfer = netTransfer * planningEfficiency;
        // Calculate per-child inheritance
        const childrenCount = inputs.childrenContext.children.length || 1;
        const inheritancePerChild = effectiveTransfer / childrenCount;
        // Create children inheritance details
        const children = inputs.childrenContext.children.map(child => {
            const childAgeAtDeath = child.age + (deathYear - 2025);
            return {
                name: child.name,
                age: childAgeAtDeath,
                inheritance: inheritancePerChild
            };
        });
        return {
            year: deathYear,
            estateTax,
            transferCosts,
            netTransfer,
            planningEfficiency,
            effectiveTransfer,
            children
        };
    }
    /**
     * Calculate grandchildren impact
     */
    static calculateGrandchildrenImpact(inputs, inheritanceImpact, deathYear) {
        // Estimate number of grandchildren (simplified)
        const estimatedGrandchildren = Math.max(1, inputs.childrenContext.children.length * 1.5);
        // Estimate grandchildren inheritance (typically 30% of what children received)
        const totalChildrenInheritance = inheritanceImpact.effectiveTransfer;
        const grandchildrenInheritanceRate = 0.3; // 30% of parents' inheritance
        const grandchildrenInheritance = totalChildrenInheritance * grandchildrenInheritanceRate;
        // Calculate per-grandchild inheritance
        const inheritancePerGrandchild = grandchildrenInheritance / estimatedGrandchildren;
        // Estimate college costs for grandchildren
        // Assume college is ~30 years after death
        const collegeYear = deathYear + 30;
        const yearsFromNow = collegeYear - 2025;
        // Calculate future education costs with inflation
        const avgEducationPath = this.getAverageEducationPath(inputs);
        const currentEducationCost = this.EDUCATION_COSTS[avgEducationPath];
        const futureEducationCost = currentEducationCost * Math.pow(1 + this.EDUCATION_INFLATION, yearsFromNow);
        // Calculate college shortfall
        const collegeShortfall = Math.max(0, futureEducationCost - inheritancePerGrandchild);
        return {
            year: deathYear + 30, // Approximate time when grandchildren would need inheritance
            estimatedGrandchildren,
            inheritance: grandchildrenInheritance,
            inheritancePerGrandchild,
            futureEducationCost,
            collegeShortfall
        };
    }
    /**
     * Calculate estate tax (hypothetical for India)
     */
    static calculateEstateTax(wealth) {
        if (wealth <= this.ESTATE_TAX_EXEMPTION) {
            return 0;
        }
        return (wealth - this.ESTATE_TAX_EXEMPTION) * this.ESTATE_TAX_RATE;
    }
    /**
     * Calculate planning efficiency based on user inputs
     */
    static calculatePlanningEfficiency(inputs) {
        // Base efficiency based on financial sophistication
        let baseEfficiency = 0.7; // Default
        switch (inputs.coreIdentity.financialSophistication) {
            case 'expert':
                baseEfficiency = 0.9;
                break;
            case 'good':
                baseEfficiency = 0.8;
                break;
            case 'moderate':
                baseEfficiency = 0.7;
                break;
            case 'beginner':
                baseEfficiency = 0.6;
                break;
        }
        // Adjust for planning approach
        switch (inputs.behavioralProfile.planningApproach) {
            case 'detailed_research':
                baseEfficiency += 0.05;
                break;
            case 'important_overwhelming':
                baseEfficiency -= 0.05;
                break;
            case 'delegate_experts':
                baseEfficiency += 0.03;
                break;
            case 'avoid_thinking':
                baseEfficiency -= 0.1;
                break;
        }
        // Adjust for family coordination
        if (inputs.familyCareContext.familyCoordination === 'excellent') {
            baseEfficiency += 0.05;
        }
        else if (inputs.familyCareContext.familyCoordination === 'poor') {
            baseEfficiency -= 0.1;
        }
        // Ensure efficiency is between 0.5 and 0.95
        return Math.min(0.95, Math.max(0.5, baseEfficiency));
    }
    /**
     * Find wealth at a specific year in projections
     */
    static findWealthAtYear(projections, year) {
        // Find the projection for the specified year
        const projection = projections.find(p => p.year >= year);
        // If no projection found, return the last projection's wealth
        if (!projection && projections.length > 0) {
            return projections[projections.length - 1].wealth;
        }
        // If projection found, return its wealth
        return projection ? projection.wealth : 0;
    }
    /**
     * Determine financial status based on net worth
     */
    static determineFinancialStatus(netWorth) {
        if (netWorth >= 100000000)
            return 'Ultra High Net Worth'; // ₹10Cr+
        if (netWorth >= 10000000)
            return 'High Net Worth'; // ₹1Cr+
        if (netWorth >= 5000000)
            return 'Affluent'; // ₹50L+
        if (netWorth >= 2000000)
            return 'Upper Middle Class'; // ₹20L+
        if (netWorth >= 500000)
            return 'Middle Class'; // ₹5L+
        return 'Building Wealth'; // Below ₹5L
    }
    /**
     * Get average education path for children
     */
    static getAverageEducationPath(inputs) {
        if (inputs.childrenContext.children.length === 0) {
            return 'private_state'; // Default
        }
        // Count occurrences of each education path
        const pathCounts = {};
        inputs.childrenContext.children.forEach(child => {
            const path = child.educationAspirations;
            pathCounts[path] = (pathCounts[path] || 0) + 1;
        });
        // Find the most common path
        let mostCommonPath = 'private_state';
        let maxCount = 0;
        Object.entries(pathCounts).forEach(([path, count]) => {
            if (count > maxCount) {
                mostCommonPath = path;
                maxCount = count;
            }
        });
        return mostCommonPath;
    }
    /**
     * Calculate the impact of various life events on wealth
     */
    static calculateLifeEventImpacts(inputs) {
        const impacts = [];
        // Children's education
        inputs.childrenContext.children.forEach(child => {
            const educationCost = this.EDUCATION_COSTS[child.educationAspirations] || this.EDUCATION_COSTS.private_state;
            const timing = `Ages ${18 + (child.age - inputs.coreIdentity.age)} to ${22 + (child.age - inputs.coreIdentity.age)}`;
            impacts.push({
                event: `${child.name}'s Education`,
                timing,
                financialImpact: -educationCost,
                description: `College education costs based on ${child.educationAspirations.replace('_', ' ')} path`
            });
        });
        // Parent care
        inputs.familyCareContext.parents.forEach(parent => {
            let annualCost = 0;
            switch (parent.financialIndependence) {
                case 'occasional_support':
                    annualCost = 120000; // ₹10k per month
                    break;
                case 'regular_support':
                    annualCost = 300000; // ₹25k per month
                    break;
                case 'full_dependency':
                    annualCost = 600000; // ₹50k per month
                    break;
            }
            if (annualCost > 0) {
                const parentRemainingYears = Math.max(5, 90 - parent.age);
                const timing = `Next ${parentRemainingYears} years`;
                impacts.push({
                    event: `${parent.name}'s Care`,
                    timing,
                    financialImpact: -annualCost * parentRemainingYears,
                    description: `Ongoing care costs based on ${parent.financialIndependence.replace('_', ' ')} status`
                });
            }
        });
        // Children's weddings
        inputs.childrenContext.children.forEach(child => {
            const weddingAge = 28; // Average wedding age
            const yearsUntilWedding = Math.max(0, weddingAge - child.age);
            const timing = `In ${yearsUntilWedding} years`;
            const cityType = inputs.coreIdentity.location.cityType;
            const costRange = this.WEDDING_COSTS[cityType] || this.WEDDING_COSTS.tier2;
            const avgWeddingCost = (costRange.min + costRange.max) / 2;
            impacts.push({
                event: `${child.name}'s Wedding`,
                timing,
                financialImpact: -avgWeddingCost,
                description: `Estimated wedding costs based on ${cityType} location`
            });
        });
        // Retirement
        const yearsToRetirement = Math.max(0, 60 - inputs.coreIdentity.age);
        if (yearsToRetirement <= 30) {
            const annualRetirementIncome = inputs.financialFoundation.annualIncome * 0.7; // 70% income replacement
            const retirementYears = 25; // Expected retirement duration
            const totalRetirementNeeds = annualRetirementIncome * retirementYears;
            impacts.push({
                event: 'Retirement',
                timing: `In ${yearsToRetirement} years`,
                financialImpact: -totalRetirementNeeds,
                description: `Estimated retirement needs for ${retirementYears} years at 70% income replacement`
            });
        }
        return impacts.sort((a, b) => Math.abs(b.financialImpact) - Math.abs(a.financialImpact));
    }
}
// Estate tax exemption thresholds (in INR)
AdvancedWealthCalculatorImpact.ESTATE_TAX_EXEMPTION = 10000000; // ₹1 Crore (hypothetical for India)
// Estate tax rates (hypothetical for India)
AdvancedWealthCalculatorImpact.ESTATE_TAX_RATE = 0.10; // 10% flat rate
// Legal and transfer costs as percentage of estate
AdvancedWealthCalculatorImpact.TRANSFER_COST_PERCENTAGE = 0.05; // 5%
// Education cost projections by type (current costs, will be inflated)
AdvancedWealthCalculatorImpact.EDUCATION_COSTS = {
    'public_state': 800000, // ₹8L for public state university
    'public_premium': 1500000, // ₹15L for premium public university
    'private_state': 2500000, // ₹25L for private state university
    'private_premium': 4000000, // ₹40L for premium private university
    'international': 8000000 // ₹80L for international education
};
// Education inflation rate (annual)
AdvancedWealthCalculatorImpact.EDUCATION_INFLATION = 0.08; // 8% annually
// Generational wealth transfer efficiency
AdvancedWealthCalculatorImpact.GENERATIONAL_TRANSFER_EFFICIENCY = {
    'poor_planning': 0.5, // 50% efficiency with poor planning
    'basic_planning': 0.7, // 70% efficiency with basic planning
    'good_planning': 0.85, // 85% efficiency with good planning
    'optimal_planning': 0.95 // 95% efficiency with optimal planning
};
// Wedding cost ranges by city type (in INR)
AdvancedWealthCalculatorImpact.WEDDING_COSTS = {
    'metro': { min: 1500000, max: 5000000 }, // ₹15L to ₹50L
    'tier2': { min: 800000, max: 2500000 }, // ₹8L to ₹25L
    'tier3': { min: 500000, max: 1500000 }, // ₹5L to ₹15L
    'rural': { min: 300000, max: 1000000 } // ₹3L to ₹10L
};
