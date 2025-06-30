"use strict";
// src/utils/models/stochasticProcesses.ts
// Advanced Stochastic Models for Sophisticated Wealth Timeline Projections
Object.defineProperty(exports, "__esModule", { value: true });
exports.StochasticProcessIntegrator = exports.CompoundGrowthWithShocks = exports.ActuarialTables = exports.MeanRevertingProcess = exports.GeometricBrownianMotion = void 0;
/**
 * Geometric Brownian Motion for modeling wealth growth with drift and volatility
 * Used for: Investment returns, business income, property values
 */
class GeometricBrownianMotion {
    constructor(mu, sigma, dt = 1, initialValue = 1) {
        this.mu = mu;
        this.sigma = sigma;
        this.dt = dt;
        this.S0 = initialValue;
    }
    /**
     * Generate a single path of GBM over specified time periods
     */
    generatePath(periods, seed) {
        if (seed) {
            Math.random = this.seededRandom(seed);
        }
        const path = [this.S0];
        let currentValue = this.S0;
        for (let i = 1; i <= periods; i++) {
            // Generate random normal variable using Box-Muller transform
            const epsilon = this.generateNormalRandom();
            // GBM formula: dS = μS*dt + σS*√dt*ε
            const drift = this.mu * currentValue * this.dt;
            const diffusion = this.sigma * currentValue * Math.sqrt(this.dt) * epsilon;
            currentValue = Math.max(0, currentValue + drift + diffusion);
            path.push(currentValue);
        }
        return path;
    }
    /**
     * Generate multiple Monte Carlo paths
     */
    generateMonteCarloPaths(periods, numPaths, confidenceLevel = 0.95) {
        const paths = [];
        for (let i = 0; i < numPaths; i++) {
            paths.push(this.generatePath(periods, i));
        }
        // Calculate percentiles and statistics at each time point
        const percentiles = {
            p5: new Array(periods + 1),
            p25: new Array(periods + 1),
            p50: new Array(periods + 1),
            p75: new Array(periods + 1),
            p95: new Array(periods + 1)
        };
        const meanPath = new Array(periods + 1);
        const volatilityPath = new Array(periods + 1);
        for (let t = 0; t <= periods; t++) {
            const valuesAtTime = paths.map(path => path[t]).sort((a, b) => a - b);
            percentiles.p5[t] = valuesAtTime[Math.floor(0.05 * numPaths)];
            percentiles.p25[t] = valuesAtTime[Math.floor(0.25 * numPaths)];
            percentiles.p50[t] = valuesAtTime[Math.floor(0.50 * numPaths)];
            percentiles.p75[t] = valuesAtTime[Math.floor(0.75 * numPaths)];
            percentiles.p95[t] = valuesAtTime[Math.floor(0.95 * numPaths)];
            meanPath[t] = valuesAtTime.reduce((sum, val) => sum + val, 0) / numPaths;
            // Calculate standard deviation at this time point
            const variance = valuesAtTime.reduce((sum, val) => sum + Math.pow(val - meanPath[t], 2), 0) / numPaths;
            volatilityPath[t] = Math.sqrt(variance);
        }
        return {
            paths,
            percentiles,
            meanPath,
            volatilityPath
        };
    }
    /**
     * Calculate Value at Risk (VaR) for a given confidence level
     */
    calculateVaR(periods, numPaths, confidenceLevel) {
        const finalValues = [];
        for (let i = 0; i < numPaths; i++) {
            const path = this.generatePath(periods, i);
            finalValues.push(path[path.length - 1]);
        }
        finalValues.sort((a, b) => a - b);
        const varIndex = Math.floor((1 - confidenceLevel) * numPaths);
        return finalValues[varIndex];
    }
    generateNormalRandom() {
        // Box-Muller transformation for normal distribution
        let u = 0, v = 0;
        while (u === 0)
            u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    seededRandom(seed) {
        return function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
}
exports.GeometricBrownianMotion = GeometricBrownianMotion;
/**
 * Mean Reverting Process (Ornstein-Uhlenbeck) for modeling inflation and interest rates
 * Used for: Inflation rates, interest rates, economic indicators
 */
class MeanRevertingProcess {
    constructor(theta, mu, sigma, dt = 1, initialValue = 0) {
        this.theta = theta;
        this.mu = mu;
        this.sigma = sigma;
        this.dt = dt;
        this.X0 = initialValue;
    }
    /**
     * Generate a path using Ornstein-Uhlenbeck process
     * dX = θ(μ - X)dt + σdW
     */
    generatePath(periods, seed) {
        if (seed) {
            Math.random = this.seededRandom(seed);
        }
        const path = [this.X0];
        let currentValue = this.X0;
        for (let i = 1; i <= periods; i++) {
            const epsilon = this.generateNormalRandom();
            // Mean reversion component
            const meanReversion = this.theta * (this.mu - currentValue) * this.dt;
            // Volatility component
            const volatility = this.sigma * Math.sqrt(this.dt) * epsilon;
            currentValue = currentValue + meanReversion + volatility;
            path.push(Math.max(0, currentValue)); // Ensure non-negative for inflation
        }
        return path;
    }
    /**
     * Generate inflation scenarios with economic cycle awareness
     */
    generateInflationScenarios(periods, numScenarios) {
        const scenarios = [];
        const economicCycles = [];
        for (let i = 0; i < numScenarios; i++) {
            const scenario = this.generatePath(periods, i);
            scenarios.push(scenario);
        }
        // Analyze economic cycles
        for (let t = 0; t < periods; t++) {
            const inflationAtTime = scenarios.map(s => s[t]);
            const avgInflation = inflationAtTime.reduce((sum, val) => sum + val, 0) / numScenarios;
            let regime;
            let probability;
            if (avgInflation < 0.02) {
                regime = 'low_inflation';
                probability = inflationAtTime.filter(inf => inf < 0.02).length / numScenarios;
            }
            else if (avgInflation > 0.06) {
                regime = 'high_inflation';
                probability = inflationAtTime.filter(inf => inf > 0.06).length / numScenarios;
            }
            else {
                regime = 'normal_inflation';
                probability = inflationAtTime.filter(inf => inf >= 0.02 && inf <= 0.06).length / numScenarios;
            }
            economicCycles.push({
                period: t,
                regime,
                probability
            });
        }
        return { scenarios, economicCycles };
    }
    generateNormalRandom() {
        let u = 0, v = 0;
        while (u === 0)
            u = Math.random();
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    seededRandom(seed) {
        return function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
}
exports.MeanRevertingProcess = MeanRevertingProcess;
/**
 * Actuarial Tables Integration for life expectancy and mortality modeling
 * Based on Indian life expectancy data with health and socioeconomic adjustments
 */
class ActuarialTables {
    /**
     * Calculate adjusted life expectancy based on individual factors
     */
    static calculateLifeExpectancy(age, gender, healthStatus, incomeLevel, educationLevel) {
        // Get base life expectancy
        const baseTable = this.INDIAN_LIFE_EXPECTANCY_2023[gender];
        const ages = Object.keys(baseTable).map(Number).sort((a, b) => a - b);
        // Find closest age in table
        let baseLifeExpectancy;
        if (age <= ages[0]) {
            baseLifeExpectancy = baseTable[ages[0]];
        }
        else if (age >= ages[ages.length - 1]) {
            baseLifeExpectancy = baseTable[ages[ages.length - 1]];
        }
        else {
            // Linear interpolation
            const lowerAge = ages.filter(a => a <= age).pop();
            const upperAge = ages.filter(a => a > age)[0];
            const lowerLE = baseTable[lowerAge];
            const upperLE = baseTable[upperAge];
            const ratio = (age - lowerAge) / (upperAge - lowerAge);
            baseLifeExpectancy = lowerLE + ratio * (upperLE - lowerLE);
        }
        // Apply adjustments
        const healthAdjustment = this.HEALTH_ADJUSTMENTS[healthStatus];
        const socioeconomicAdjustment = this.SOCIOECONOMIC_ADJUSTMENTS[incomeLevel];
        const educationAdjustment = this.EDUCATION_ADJUSTMENTS[educationLevel];
        const adjustedLifeExpectancy = baseLifeExpectancy + healthAdjustment + socioeconomicAdjustment + educationAdjustment;
        return Math.max(age + 5, adjustedLifeExpectancy); // Minimum 5 more years
    }
    /**
     * Generate mortality probability curve
     */
    static generateMortalityProbabilities(currentAge, lifeExpectancy, yearsToProject) {
        const probabilities = [];
        for (let year = 0; year < yearsToProject; year++) {
            const age = currentAge + year;
            // Gompertz-Makeham mortality model adjusted for Indian population
            const lambda = 0.0001; // Background mortality
            const alpha = 0.00005; // Age-independent mortality coefficient
            const beta = 0.085; // Age-dependent growth rate
            // Adjust for life expectancy
            const lifeExpectancyFactor = lifeExpectancy / 72; // 72 is average Indian life expectancy
            const mortalityRate = (lambda + alpha * Math.exp(beta * (age - 25))) / lifeExpectancyFactor;
            const mortalityProbability = 1 - Math.exp(-mortalityRate);
            // Calculate cumulative survival probability
            let survivalProbability = 1;
            for (let i = 0; i <= year; i++) {
                const ageAtYear = currentAge + i;
                const yearlyMortalityRate = (lambda + alpha * Math.exp(beta * (ageAtYear - 25))) / lifeExpectancyFactor;
                const yearlyMortalityProb = 1 - Math.exp(-yearlyMortalityRate);
                survivalProbability *= (1 - yearlyMortalityProb);
            }
            probabilities.push({
                age,
                mortalityProbability: Math.min(0.5, mortalityProbability), // Cap at 50% annual probability
                survivalProbability: Math.max(0, survivalProbability)
            });
        }
        return probabilities;
    }
    /**
     * Generate life expectancy scenarios with uncertainty
     */
    static generateLifeExpectancyScenarios(currentAge, gender, healthStatus, incomeLevel, educationLevel, numScenarios = 1000) {
        const baseLifeExpectancy = this.calculateLifeExpectancy(currentAge, gender, healthStatus, incomeLevel, educationLevel);
        const scenarios = [];
        // Generate scenarios with uncertainty (±5 years standard deviation)
        for (let i = 0; i < numScenarios; i++) {
            const randomFactor = this.generateNormalRandom() * 5; // 5 years standard deviation
            const scenarioLifeExpectancy = Math.max(currentAge + 5, baseLifeExpectancy + randomFactor);
            scenarios.push(scenarioLifeExpectancy);
        }
        scenarios.sort((a, b) => a - b);
        return {
            baseLifeExpectancy,
            scenarios,
            percentiles: {
                p10: scenarios[Math.floor(0.10 * numScenarios)],
                p25: scenarios[Math.floor(0.25 * numScenarios)],
                p50: scenarios[Math.floor(0.50 * numScenarios)],
                p75: scenarios[Math.floor(0.75 * numScenarios)],
                p90: scenarios[Math.floor(0.90 * numScenarios)]
            }
        };
    }
    static generateNormalRandom() {
        let u = 0, v = 0;
        while (u === 0)
            u = Math.random();
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}
exports.ActuarialTables = ActuarialTables;
ActuarialTables.INDIAN_LIFE_EXPECTANCY_2023 = {
    male: {
        25: 75.2, 30: 70.4, 35: 65.6, 40: 60.8, 45: 56.1, 50: 51.5, 55: 47.0, 60: 42.6, 65: 38.4, 70: 34.4, 75: 30.7
    },
    female: {
        25: 77.8, 30: 72.9, 35: 68.0, 40: 63.2, 45: 58.4, 50: 53.7, 55: 49.1, 60: 44.6, 65: 40.3, 70: 36.1, 75: 32.2
    }
};
ActuarialTables.HEALTH_ADJUSTMENTS = {
    'excellent': 3.5,
    'good': 0,
    'fair': -2.8,
    'poor': -6.2
};
ActuarialTables.SOCIOECONOMIC_ADJUSTMENTS = {
    'high_income': 2.1, // Top 10% income
    'upper_middle': 1.2, // Top 25% income
    'middle': 0, // Median income
    'lower_middle': -1.5, // Bottom 25% income
    'low': -3.2 // Bottom 10% income
};
ActuarialTables.EDUCATION_ADJUSTMENTS = {
    'phd': 2.8,
    'professional': 2.5,
    'masters': 1.8,
    'bachelors': 1.2,
    'high_school': 0
};
/**
 * Compound Growth with Shocks for modeling healthcare costs with sudden increases
 * Models both gradual inflation and sudden cost shocks (new treatments, policy changes)
 */
class CompoundGrowthWithShocks {
    constructor(baseGrowthRate, volatility, shockProbability, shockMagnitude, initialValue) {
        this.baseGrowthRate = baseGrowthRate;
        this.volatility = volatility;
        this.shockProbability = shockProbability;
        this.shockMagnitude = shockMagnitude;
        this.initialValue = initialValue;
    }
    /**
     * Generate healthcare cost projection with policy shocks and medical breakthroughs
     */
    generateHealthcareCostPath(periods, ageProgression, healthStatusProgression) {
        const costs = [this.initialValue];
        const shockEvents = [];
        let currentValue = this.initialValue;
        for (let period = 1; period <= periods; period++) {
            // Base compound growth with volatility
            const growthRate = this.baseGrowthRate + (Math.random() - 0.5) * this.volatility * 2;
            currentValue *= (1 + growthRate);
            // Age-related cost increases
            const currentAge = ageProgression[period - 1] || ageProgression[ageProgression.length - 1];
            const ageMultiplier = this.calculateAgeCostMultiplier(currentAge);
            currentValue *= ageMultiplier;
            // Health status impact
            const healthStatus = healthStatusProgression[period - 1] || healthStatusProgression[healthStatusProgression.length - 1];
            const healthMultiplier = this.calculateHealthCostMultiplier(healthStatus);
            currentValue *= healthMultiplier;
            // Random shocks
            if (Math.random() < this.shockProbability) {
                const shockType = this.determineShockType();
                const shockMagnitude = this.shockMagnitude.min +
                    Math.random() * (this.shockMagnitude.max - this.shockMagnitude.min);
                const shockMultiplier = 1 + shockMagnitude;
                currentValue *= shockMultiplier;
                shockEvents.push({
                    period,
                    type: shockType,
                    impact: shockMagnitude,
                    description: this.getShockDescription(shockType, shockMagnitude)
                });
            }
            costs.push(Math.max(0, currentValue));
        }
        const totalCost = costs.reduce((sum, cost) => sum + cost, 0);
        const averageAnnualGrowth = Math.pow(costs[costs.length - 1] / costs[0], 1 / periods) - 1;
        return {
            costs,
            shockEvents,
            totalCost,
            averageAnnualGrowth
        };
    }
    /**
     * Generate multiple healthcare cost scenarios
     */
    generateHealthcareCostScenarios(periods, ageProgression, healthStatusProgression, numScenarios) {
        const scenarios = [];
        let totalShockEvents = 0;
        const totalCosts = [];
        for (let i = 0; i < numScenarios; i++) {
            const scenario = this.generateHealthcareCostPath(periods, ageProgression, healthStatusProgression);
            scenarios.push(scenario.costs);
            totalShockEvents += scenario.shockEvents.length;
            totalCosts.push(scenario.totalCost);
        }
        // Calculate percentiles for each time period
        const percentiles = {
            p10: new Array(periods + 1),
            p25: new Array(periods + 1),
            p50: new Array(periods + 1),
            p75: new Array(periods + 1),
            p90: new Array(periods + 1)
        };
        for (let t = 0; t <= periods; t++) {
            const valuesAtTime = scenarios.map(scenario => scenario[t]).sort((a, b) => a - b);
            percentiles.p10[t] = valuesAtTime[Math.floor(0.10 * numScenarios)];
            percentiles.p25[t] = valuesAtTime[Math.floor(0.25 * numScenarios)];
            percentiles.p50[t] = valuesAtTime[Math.floor(0.50 * numScenarios)];
            percentiles.p75[t] = valuesAtTime[Math.floor(0.75 * numScenarios)];
            percentiles.p90[t] = valuesAtTime[Math.floor(0.90 * numScenarios)];
        }
        totalCosts.sort((a, b) => a - b);
        return {
            scenarios,
            percentiles,
            averageShockEvents: totalShockEvents / numScenarios,
            totalCostDistribution: {
                mean: totalCosts.reduce((sum, cost) => sum + cost, 0) / numScenarios,
                median: totalCosts[Math.floor(0.50 * numScenarios)],
                p90: totalCosts[Math.floor(0.90 * numScenarios)],
                p95: totalCosts[Math.floor(0.95 * numScenarios)]
            }
        };
    }
    calculateAgeCostMultiplier(age) {
        // Healthcare costs increase exponentially with age
        if (age < 40)
            return 1.0;
        if (age < 50)
            return 1.02;
        if (age < 60)
            return 1.05;
        if (age < 70)
            return 1.08;
        if (age < 80)
            return 1.12;
        return 1.15;
    }
    calculateHealthCostMultiplier(healthStatus) {
        const multipliers = {
            'excellent': 0.98,
            'good': 1.0,
            'fair': 1.15,
            'poor': 1.35
        };
        return multipliers[healthStatus];
    }
    determineShockType() {
        const rand = Math.random();
        if (rand < 0.3)
            return 'policy_change';
        if (rand < 0.5)
            return 'medical_breakthrough';
        if (rand < 0.7)
            return 'epidemic';
        return 'age_related';
    }
    getShockDescription(type, magnitude) {
        const impact = magnitude > 0.5 ? 'major' : magnitude > 0.2 ? 'moderate' : 'minor';
        const descriptions = {
            'policy_change': `${impact} healthcare policy change affecting costs`,
            'medical_breakthrough': `${impact} impact from new medical technology/treatment`,
            'epidemic': `${impact} healthcare cost increase due to health crisis`,
            'age_related': `${impact} age-related health condition requiring ongoing care`
        };
        return descriptions[type] || 'Unexpected healthcare cost increase';
    }
}
exports.CompoundGrowthWithShocks = CompoundGrowthWithShocks;
/**
 * Integration utilities for combining all stochastic processes
 */
class StochasticProcessIntegrator {
    /**
     * Generate comprehensive wealth projection using all stochastic models
     */
    static generateComprehensiveProjection(initialWealth, investmentParams, inflationParams, lifeExpectancyParams, healthcareCostParams, projectionYears) {
        // Initialize processes
        const wealthGBM = new GeometricBrownianMotion(investmentParams.mu, investmentParams.sigma, 1, initialWealth);
        const inflationMRP = new MeanRevertingProcess(inflationParams.theta, inflationParams.mu, inflationParams.sigma, 1, inflationParams.mu);
        const lifeExpectancy = ActuarialTables.calculateLifeExpectancy(lifeExpectancyParams.age, lifeExpectancyParams.gender, lifeExpectancyParams.healthStatus, lifeExpectancyParams.incomeLevel, lifeExpectancyParams.educationLevel);
        const healthcareCosts = new CompoundGrowthWithShocks(healthcareCostParams.baseGrowthRate, healthcareCostParams.volatility, healthcareCostParams.shockProbability, healthcareCostParams.shockMagnitude, healthcareCostParams.initialCost);
        // Generate projections
        const wealthProjection = wealthGBM.generateMonteCarloPaths(projectionYears, 1000);
        const inflationProjection = inflationMRP.generateInflationScenarios(projectionYears, 1000);
        const mortalityProjection = ActuarialTables.generateMortalityProbabilities(lifeExpectancyParams.age, lifeExpectancy, projectionYears);
        const ageProgression = Array.from({ length: projectionYears }, (_, i) => lifeExpectancyParams.age + i);
        const healthProgression = Array.from({ length: projectionYears }, () => lifeExpectancyParams.healthStatus);
        const healthcareCostProjection = healthcareCosts.generateHealthcareCostScenarios(projectionYears, ageProgression, healthProgression, 1000);
        return {
            wealthProjection,
            inflationProjection,
            mortalityProjection,
            healthcareCostProjection,
            lifeExpectancy,
            projectionMetadata: {
                years: projectionYears,
                scenarios: 1000,
                confidence: 0.95,
                generatedAt: new Date().toISOString()
            }
        };
    }
}
exports.StochasticProcessIntegrator = StochasticProcessIntegrator;
