"use strict";
// wealthCalculations.ts - Advanced Wealth Extinction Calculation Engine
// Implementation of the sophisticated financial modeling described in specifications
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartDefaults = getSmartDefaults;
exports.calculateWealthExtinction = calculateWealthExtinction;
/**
 * Smart Defaults Engine - Provides intelligent defaults based on demographics
 */
function getSmartDefaults(age, zipCode) {
    // Regional cost of living adjustments
    const regionalMultipliers = getRegionalMultipliers(zipCode);
    // Age-based financial profile defaults
    const baseIncome = getTypicalIncomeByAge(age) * regionalMultipliers.income;
    const baseExpenses = baseIncome * 0.75 * regionalMultipliers.col; // 75% of income for expenses
    const typicalNetWorth = getTypicalNetWorthByAge(age) * regionalMultipliers.wealth;
    return {
        financialProfile: {
            income: baseIncome,
            expenses: baseExpenses,
            netWorth: typicalNetWorth,
            riskTolerance: age < 40 ? 'moderate' : age < 55 ? 'moderate' : 'conservative'
        }
    };
}
/**
 * Core Wealth Extinction Calculator with Monte Carlo Simulation
 */
function calculateWealthExtinction(inputs) {
    console.log('Starting wealth extinction calculation with inputs:', inputs);
    // Run multiple scenarios for Monte Carlo analysis
    const scenarios = runMonteCarloSimulation(inputs, 1000);
    // Calculate primary timeline
    const baseProjection = calculateBaseWealthTrajectory(inputs);
    const extinctionYear = findWealthExtinctionYear(baseProjection);
    // Analyze complexity factors
    const complexityAnalysis = analyzeComplexityFactors(inputs);
    // Calculate generational impact
    const familyImpact = calculateGenerationalImpact(inputs, baseProjection, extinctionYear);
    // Generate optimization scenarios
    const protectedScenario = calculateProtectedScenario(inputs, baseProjection);
    // Identify top wealth destroyers
    const topWealthDestroyers = identifyWealthDestroyers(inputs, scenarios);
    // Scenario analysis from Monte Carlo
    const scenarioAnalysis = analyzeScenarios(scenarios);
    return {
        extinctionYear,
        yearsRemaining: extinctionYear - 2025,
        currentWealth: inputs.financialProfile.netWorth,
        childrenInheritance: familyImpact.inheritance.children.reduce((sum, child) => sum + child.inheritance, 0),
        grandchildrenInheritance: familyImpact.grandchildren.inheritance,
        projections: baseProjection,
        topWealthDestroyers,
        familyImpact,
        protectedScenario,
        complexityAnalysis,
        scenarioAnalysis
    };
}
/**
 * Base Wealth Trajectory Calculation
 */
function calculateBaseWealthTrajectory(inputs) {
    const projections = [];
    let currentWealth = inputs.financialProfile.netWorth;
    let currentAge = inputs.userProfile.age;
    for (let year = 0; year < 75; year++) {
        const currentYear = 2025 + year;
        currentAge = inputs.userProfile.age + year;
        // Calculate income for this year
        const yearlyIncome = calculateIncomeProgression(year, currentAge, inputs);
        // Calculate expenses for this year
        const yearlyExpenses = calculateExpenseProgression(year, currentAge, inputs);
        // Calculate investment returns
        const investmentReturns = calculateInvestmentReturns(currentWealth, year, inputs);
        // Apply lifecycle events
        const lifecycleImpacts = calculateLifecycleEvents(year, currentAge, inputs);
        // Update wealth
        const netCashFlow = yearlyIncome - yearlyExpenses + investmentReturns + lifecycleImpacts.netImpact;
        currentWealth = Math.max(0, currentWealth + netCashFlow);
        projections.push({
            year: currentYear,
            age: currentAge,
            wealth: currentWealth,
            income: yearlyIncome,
            expenses: yearlyExpenses,
            netCashFlow,
            majorEvents: lifecycleImpacts.events,
            confidenceLevel: calculateConfidenceLevel(year, inputs.complexityScore)
        });
        // Stop if wealth is extinct
        if (currentWealth <= 0)
            break;
    }
    return projections;
}
/**
 * Income Progression Model with Career Lifecycle
 */
function calculateIncomeProgression(year, currentAge, inputs) {
    let baseIncome = inputs.financialProfile.income;
    // Career stage adjustments
    let growthRate = 0.03; // Base 3% annual growth
    if (currentAge < 35) {
        growthRate = 0.05; // Early career boost
    }
    else if (currentAge < 50) {
        growthRate = 0.03; // Mid-career stability
    }
    else if (currentAge < 65) {
        growthRate = 0.01; // Late career slowdown
    }
    else {
        growthRate = -0.8; // Retirement income drop
    }
    // Economic cycle adjustments
    const recessionYears = [2030, 2038, 2047]; // Projected recession years
    let economicMultiplier = 1.0;
    if (recessionYears.includes(2025 + year)) {
        economicMultiplier = 0.85; // 15% income reduction during recession
    }
    const projectedIncome = baseIncome * Math.pow(1 + growthRate, year) * economicMultiplier;
    return Math.max(0, projectedIncome);
}
/**
 * Expense Progression Model with Lifecycle Changes
 */
function calculateExpenseProgression(year, currentAge, inputs) {
    let baseExpenses = inputs.financialProfile.expenses;
    // General inflation
    const inflationRate = 0.035;
    let inflatedExpenses = baseExpenses * Math.pow(1 + inflationRate, year);
    // Lifecycle adjustments
    let lifecycleMultiplier = 1.0;
    // Children education costs
    const educationCosts = calculateEducationCosts(year, inputs);
    // Parent care costs
    const parentCareCosts = calculateParentCareCosts(year, currentAge, inputs);
    // Healthcare cost escalation
    const healthcareInflation = 0.055; // Healthcare inflates faster
    const additionalHealthcareCosts = 5000 * Math.pow(1 + healthcareInflation, year) *
        (currentAge > 50 ? Math.pow(1.05, currentAge - 50) : 1);
    // Lifestyle inflation (behavioral factor)
    const lifestyleInflation = Math.min(0.02, 0.005 * year); // Cap at 2%
    lifecycleMultiplier += lifestyleInflation;
    const totalExpenses = inflatedExpenses * lifecycleMultiplier + educationCosts +
        parentCareCosts + additionalHealthcareCosts;
    return totalExpenses;
}
/**
 * Education Cost Calculation Based on Child Details
 */
function calculateEducationCosts(year, inputs) {
    let totalEducationCosts = 0;
    const currentYear = 2025 + year;
    inputs.familyStructure.children.forEach(child => {
        const childAgeInYear = child.age + year;
        // College years (18-22)
        if (childAgeInYear >= 18 && childAgeInYear <= 22) {
            let annualCost = 25000; // Base state school cost
            switch (child.educationPath) {
                case 'private_state':
                    annualCost = 45000;
                    break;
                case 'elite_private':
                    annualCost = 75000;
                    break;
                case 'international':
                    annualCost = 95000;
                    break;
                default:
                    annualCost = 25000;
            }
            // Education inflation (6% annually)
            let inflatedCost = annualCost * Math.pow(1.06, year);
            // Performance-based adjustments
            if (child.academicPerformance === 'exceptional') {
                inflatedCost *= 0.7; // Merit scholarships
            }
            else if (child.academicPerformance === 'struggling') {
                inflatedCost *= 1.3; // Additional support needed
            }
            totalEducationCosts += inflatedCost;
        }
    });
    return totalEducationCosts;
}
/**
 * Parent Care Cost Modeling
 */
function calculateParentCareCosts(year, currentAge, inputs) {
    let totalParentCareCosts = 0;
    inputs.familyStructure.parents.forEach(parent => {
        const parentAgeInYear = parent.age + year;
        // Care needs increase with age
        let careProbability = 0;
        if (parentAgeInYear > 75) {
            careProbability = Math.min(0.9, (parentAgeInYear - 75) * 0.1);
        }
        if (careProbability > 0) {
            let monthlyCost = 0;
            switch (parent.healthStatus) {
                case 'excellent':
                    monthlyCost = 2000;
                    break;
                case 'good':
                    monthlyCost = 3500;
                    break;
                case 'fair':
                    monthlyCost = 6000;
                    break;
                case 'declining':
                    monthlyCost = 8500;
                    break;
                case 'serious':
                    monthlyCost = 12000;
                    break;
            }
            // Geographic adjustments
            if (parent.location === 'different_state') {
                monthlyCost *= 1.4; // Coordination costs
            }
            else if (parent.location === 'different_city') {
                monthlyCost *= 1.2;
            }
            // Sibling coordination benefits
            const siblingCount = inputs.familyStructure.siblings.length;
            const coordinationEfficiency = calculateCoordinationEfficiency(inputs.familyStructure.siblings);
            const costSharing = Math.max(0.3, coordinationEfficiency / siblingCount);
            totalParentCareCosts += (monthlyCost * 12 * careProbability * costSharing);
        }
    });
    return totalParentCareCosts;
}
/**
 * Investment Returns with Market Volatility
 */
function calculateInvestmentReturns(wealth, year, inputs) {
    // Base portfolio allocation
    const stockAllocation = 0.6; // Simplified - in real version, this would be dynamic
    const bondAllocation = 0.3;
    const cashAllocation = 0.1;
    // Market returns with volatility
    const stockReturn = getMarketReturn('stocks', year);
    const bondReturn = getMarketReturn('bonds', year);
    const cashReturn = 0.02; // 2% for cash
    // Portfolio return
    const portfolioReturn = (stockAllocation * stockReturn) +
        (bondAllocation * bondReturn) +
        (cashAllocation * cashReturn);
    // Risk tolerance adjustments
    let riskAdjustment = 1.0;
    switch (inputs.financialProfile.riskTolerance) {
        case 'conservative':
            riskAdjustment = 0.7;
            break;
        case 'aggressive':
            riskAdjustment = 1.3;
            break;
        default:
            riskAdjustment = 1.0;
    }
    // Fees and taxes
    const feeDrag = 0.01; // 1% annual fees
    const taxDrag = 0.015; // 1.5% tax drag
    const netReturn = (portfolioReturn * riskAdjustment) - feeDrag - taxDrag;
    return wealth * netReturn;
}
/**
 * Market Return Simulation with Cycles
 */
function getMarketReturn(assetClass, year) {
    // Simplified market cycle simulation
    const cycleYear = year % 10; // 10-year market cycles
    if (assetClass === 'stocks') {
        const baseReturns = [0.12, 0.08, -0.05, 0.15, 0.06, -0.12, 0.18, 0.03, -0.08, 0.11];
        return baseReturns[cycleYear] + (Math.random() - 0.5) * 0.1; // Add volatility
    }
    else if (assetClass === 'bonds') {
        const baseReturns = [0.04, 0.03, 0.06, 0.02, 0.05, 0.08, 0.01, 0.04, 0.07, 0.03];
        return baseReturns[cycleYear] + (Math.random() - 0.5) * 0.02;
    }
    return 0.02; // Default return
}
/**
 * Lifecycle Events Simulation
 */
function calculateLifecycleEvents(year, currentAge, inputs) {
    const events = [];
    let netImpact = 0;
    // Health emergencies (probability increases with age)
    const healthEmergencyProb = Math.min(0.1, (currentAge - 40) * 0.005);
    if (Math.random() < healthEmergencyProb) {
        const emergencyCost = 15000 + Math.random() * 35000;
        netImpact -= emergencyCost;
        events.push(`Health emergency: $${emergencyCost.toLocaleString()} cost`);
    }
    // Family emergencies
    if (Math.random() < 0.03) { // 3% annual probability
        const familyEmergencyCost = 5000 + Math.random() * 20000;
        netImpact -= familyEmergencyCost;
        events.push(`Family emergency: $${familyEmergencyCost.toLocaleString()} support needed`);
    }
    // Inheritance (late in life)
    if (currentAge > 55 && Math.random() < 0.02) { // 2% chance after 55
        const inheritanceAmount = 50000 + Math.random() * 200000;
        netImpact += inheritanceAmount;
        events.push(`Inheritance received: $${inheritanceAmount.toLocaleString()}`);
    }
    // Job loss during recessions
    const recessionYears = [5, 13, 22]; // Years 2030, 2038, 2047
    if (recessionYears.includes(year) && Math.random() < 0.15) {
        const jobLossCost = inputs.financialProfile.income * 0.3; // 30% income loss
        netImpact -= jobLossCost;
        events.push(`Job transition: $${jobLossCost.toLocaleString()} income impact`);
    }
    return { netImpact, events };
}
/**
 * Find Wealth Extinction Year
 */
function findWealthExtinctionYear(projections) {
    for (const projection of projections) {
        if (projection.wealth <= 0) {
            return projection.year;
        }
    }
    // If wealth never goes to zero in projection period, return far future
    return 2100;
}
/**
 * Calculate Generational Impact
 */
function calculateGenerationalImpact(inputs, projections, extinctionYear) {
    const userDeathYear = 2025 + (85 - inputs.userProfile.age); // Assume death at 85
    const wealthAtDeath = projections.find(p => p.year >= userDeathYear)?.wealth || 0;
    // Estate taxes and transfer costs
    const estateTax = calculateEstateTax(wealthAtDeath);
    const transferCosts = wealthAtDeath * 0.05; // 5% for legal and transfer costs
    const netTransfer = wealthAtDeath - estateTax - transferCosts;
    // Children inheritance
    const childrenCount = inputs.familyStructure.children.length || 1;
    const inheritancePerChild = netTransfer / childrenCount;
    const children = inputs.familyStructure.children.map(child => ({
        name: child.name,
        inheritance: inheritancePerChild
    }));
    // Grandchildren projection (wealth typically 70% depleted by second generation)
    const grandchildrenInheritance = netTransfer * 0.3;
    const collegeShortfall = Math.max(0, 400000 - grandchildrenInheritance); // Assuming $400K future college costs
    return {
        today: {
            netWorth: inputs.financialProfile.netWorth,
            status: 'Building wealth actively'
        },
        inheritance: {
            year: userDeathYear,
            children
        },
        grandchildren: {
            year: userDeathYear + 30,
            inheritance: grandchildrenInheritance,
            collegeShortfall
        }
    };
}
/**
 * Calculate Protected Scenario with Optimization
 */
function calculateProtectedScenario(inputs, baseProjection) {
    // Simulate improvements from systematic planning
    const improvements = [
        'Family coordination optimization (+$150K savings)',
        'Education funding strategy (+2.3 years timeline)',
        'Parent care planning (+1.8 years timeline)',
        'Investment optimization (+$89K growth)',
        'Estate planning efficiency (+$67K transfer savings)'
    ];
    const timelineExtension = Math.floor(inputs.complexityScore * 2.5); // Higher complexity = more optimization potential
    const baseExtinctionYear = findWealthExtinctionYear(baseProjection);
    return {
        extinctionYear: baseExtinctionYear + timelineExtension,
        additionalYears: timelineExtension,
        grandchildrenInheritance: 340000, // Improved outcome
        improvements
    };
}
/**
 * Complexity Analysis
 */
function analyzeComplexityFactors(inputs) {
    const complexityDrivers = [];
    const coordinationOpportunities = [];
    if (inputs.familyStructure.children.length > 2) {
        complexityDrivers.push('Multiple children with different education paths');
    }
    if (inputs.familyStructure.parents.some(p => p.financialStatus !== 'independent')) {
        complexityDrivers.push('Parent care coordination required');
        coordinationOpportunities.push('Sibling care cost sharing optimization');
    }
    if (inputs.complexityScore > 7) {
        complexityDrivers.push('High-complexity family financial coordination');
        coordinationOpportunities.push('Professional family wealth management');
    }
    const optimizationPotential = Math.floor(inputs.complexityScore * 50000);
    return {
        score: inputs.complexityScore,
        primaryComplexityDrivers: complexityDrivers,
        coordinationOpportunities,
        optimizationPotential
    };
}
/**
 * Helper Functions
 */
function getRegionalMultipliers(zipCode) {
    // Simplified regional adjustments - in real app, this would use actual data
    const highCostAreas = ['94000', '10000', '02100']; // SF, NY, Boston area codes
    const isHighCost = highCostAreas.some(area => zipCode.startsWith(area.substring(0, 3)));
    return {
        income: isHighCost ? 1.4 : 1.0,
        col: isHighCost ? 1.6 : 1.0, // Cost of living
        wealth: isHighCost ? 1.3 : 1.0
    };
}
function getTypicalIncomeByAge(age) {
    if (age < 30)
        return 65000;
    if (age < 40)
        return 85000;
    if (age < 50)
        return 110000;
    if (age < 60)
        return 125000;
    return 95000; // Pre-retirement
}
function getTypicalNetWorthByAge(age) {
    if (age < 30)
        return 50000;
    if (age < 40)
        return 200000;
    if (age < 50)
        return 500000;
    if (age < 60)
        return 750000;
    return 900000;
}
function calculateEstateTax(wealth) {
    // Simplified federal estate tax (2025 exemption ~$13.6M)
    const exemption = 13600000;
    if (wealth > exemption) {
        return (wealth - exemption) * 0.40; // 40% tax rate
    }
    return 0;
}
function calculateCoordinationEfficiency(siblings) {
    if (siblings.length === 0)
        return 1.0;
    const avgQuality = siblings.reduce((sum, sib) => {
        const quality = sib.relationshipQuality === 'close' ? 1.0 :
            sib.relationshipQuality === 'good' ? 0.8 : 0.5;
        return sum + quality;
    }, 0) / siblings.length;
    return avgQuality;
}
function calculateConfidenceLevel(year, complexityScore) {
    // Confidence decreases over time and with complexity
    const baseConfidence = 0.9;
    const timeDecay = year * 0.01; // 1% per year
    const complexityImpact = (complexityScore - 5) * 0.05; // Complexity above 5 reduces confidence
    return Math.max(0.3, baseConfidence - timeDecay - complexityImpact);
}
/**
 * Monte Carlo Simulation Framework
 */
function runMonteCarloSimulation(inputs, numSimulations) {
    const scenarios = [];
    for (let i = 0; i < numSimulations; i++) {
        // Create variation in inputs for this scenario
        const scenarioInputs = {
            ...inputs,
            // Add random variations to key parameters
            financialProfile: {
                ...inputs.financialProfile,
                income: inputs.financialProfile.income * (0.8 + Math.random() * 0.4), // ±20% variation
            }
        };
        const projection = calculateBaseWealthTrajectory(scenarioInputs);
        const extinctionYear = findWealthExtinctionYear(projection);
        scenarios.push({
            extinctionYear,
            finalWealth: projection[projection.length - 1]?.wealth || 0
        });
    }
    return scenarios;
}
function analyzeScenarios(scenarios) {
    const extinctionYears = scenarios.map(s => s.extinctionYear).sort((a, b) => a - b);
    return {
        bestCase: {
            extinctionYear: extinctionYears[Math.floor(extinctionYears.length * 0.9)],
            probability: 0.1
        },
        mostLikely: {
            extinctionYear: extinctionYears[Math.floor(extinctionYears.length * 0.5)],
            probability: 0.5
        },
        worstCase: {
            extinctionYear: extinctionYears[Math.floor(extinctionYears.length * 0.1)],
            probability: 0.1
        }
    };
}
function identifyWealthDestroyers(inputs, scenarios) {
    const destroyers = [];
    if (inputs.familyStructure.children.length > 0) {
        destroyers.push({
            factor: 'Education Cost Inflation',
            impact: inputs.familyStructure.children.length * 150000,
            description: 'College costs rising faster than inflation'
        });
    }
    if (inputs.familyStructure.parents.some(p => p.financialStatus !== 'independent')) {
        destroyers.push({
            factor: 'Parent Care Coordination',
            impact: 230000,
            description: 'Uncoordinated care costs 40% more than planned care'
        });
    }
    destroyers.push({
        factor: 'Behavioral Investment Decisions',
        impact: 180000,
        description: 'Poor timing and emotional decisions reduce returns'
    });
    if (inputs.complexityScore > 7) {
        destroyers.push({
            factor: 'Family Decision Complexity',
            impact: Math.floor(inputs.complexityScore * 25000),
            description: 'Coordination failures and missed optimization opportunities'
        });
    }
    return destroyers.sort((a, b) => b.impact - a.impact).slice(0, 5);
}
