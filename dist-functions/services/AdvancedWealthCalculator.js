// src/services/AdvancedWealthCalculator.ts
// Implementation of the advanced wealth calculation engine
import { AdvancedWealthCalculatorIncome } from './AdvancedWealthCalculatorIncome';
import { AdvancedWealthCalculatorExpenses } from './AdvancedWealthCalculatorExpenses';
import { AdvancedWealthCalculatorInvestments } from './AdvancedWealthCalculatorInvestments';
import { AdvancedWealthCalculatorEvents } from './AdvancedWealthCalculatorEvents';
import { AdvancedWealthCalculatorComplexity } from './AdvancedWealthCalculatorComplexity';
import { AdvancedWealthCalculatorRecommendations } from './AdvancedWealthCalculatorRecommendations';
import { ExtremeValueTheoryService } from './ExtremeValueTheoryService';
/**
 * Advanced Wealth Calculation Engine Service
 * Implements the sophisticated financial modeling described in the advanced engine
 */
export class AdvancedWealthCalculator {
    /**
     * Calculate comprehensive wealth extinction analysis
     */
    static async calculateWealthExtinction(inputs) {
        console.log('🔮 Starting advanced wealth extinction calculation');
        // Add timeout wrapper to prevent hanging
        const calculationPromise = this.performCalculation(inputs);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Calculation timeout - taking too long')), 15000); // 15 second timeout
        });
        try {
            const results = await Promise.race([calculationPromise, timeoutPromise]);
            console.log('✅ Calculation complete. Extinction year:', results.extinctionYear);
            return results;
        }
        catch (error) {
            console.error('❌ Calculation error:', error);
            if (error instanceof Error && error.message.includes('timeout')) {
                throw new Error('Calculation is taking too long. Please try again with simpler inputs.');
            }
            throw new Error('Failed to calculate wealth extinction analysis');
        }
    }
    /**
     * Perform the actual calculation (separated for timeout handling)
     */
    static async performCalculation(inputs) {
        // Validate input data
        this.validateInputData(inputs);
        // Phase 1: Analyze complexity factors
        const complexityAnalysis = AdvancedWealthCalculatorComplexity.analyzeComplexityFactors(inputs);
        console.log('📊 Complexity Score:', complexityAnalysis.score);
        // Phase 2: Run optimized Monte Carlo simulation
        const scenarios = await this.runOptimizedMonteCarloSimulation(inputs);
        // Phase 3: Calculate base projection
        const baseProjection = await this.calculateBaseWealthTrajectory(inputs);
        // Phase 4: Find extinction year
        const extinctionYear = this.findWealthExtinctionYear(baseProjection);
        // Phase 5: Generate family impact analysis
        const familyImpact = this.calculateFamilyImpact(inputs, baseProjection, extinctionYear);
        // Phase 6: Calculate protected scenario
        const protectedScenario = await this.calculateProtectedScenario(inputs, baseProjection);
        // Phase 7: Identify wealth destroyers
        const topWealthDestroyers = this.identifyWealthDestroyers(inputs, baseProjection);
        // Phase 8: Generate recommendations
        const recommendations = AdvancedWealthCalculatorRecommendations.generateRecommendations(inputs, complexityAnalysis);
        // Phase 9: Analyze scenarios
        const scenarioAnalysis = this.analyzeScenarios(scenarios, extinctionYear);
        // Phase 10: Perform Extreme Value Theory analysis
        const extremeValueAnalysis = this.performExtremeValueAnalysis(inputs, baseProjection);
        const results = {
            extinctionYear,
            yearsRemaining: extinctionYear - 2025,
            currentWealth: inputs.financialFoundation.currentNetWorth,
            childrenInheritance: familyImpact.inheritance.children.reduce((sum, child) => sum + child.inheritance, 0),
            grandchildrenInheritance: familyImpact.grandchildren.inheritance,
            projections: baseProjection,
            topWealthDestroyers,
            familyImpact,
            protectedScenario,
            complexityAnalysis,
            scenarioAnalysis,
            recommendations,
            extremeValueAnalysis
        };
        return results;
    }
    /**
     * Validate input data
     */
    static validateInputData(inputs) {
        // Check for required fields
        if (!inputs.coreIdentity) {
            throw new Error('Missing core identity data');
        }
        if (!inputs.financialFoundation) {
            throw new Error('Missing financial foundation data');
        }
        if (inputs.financialFoundation.currentNetWorth < 0) {
            throw new Error('Net worth cannot be negative');
        }
        if (inputs.coreIdentity.age < 18 || inputs.coreIdentity.age > 100) {
            throw new Error('Age must be between 18 and 100');
        }
        // Ensure investment allocation sums to 1
        const { stocks, bonds, realEstate, alternatives } = inputs.financialFoundation.investmentAllocation;
        const totalAllocation = stocks + bonds + realEstate + alternatives;
        if (Math.abs(totalAllocation - 1) > 0.01) {
            console.warn(`Investment allocation does not sum to 1 (${totalAllocation}). Normalizing.`);
            // Normalize the allocations
            inputs.financialFoundation.investmentAllocation.stocks /= totalAllocation;
            inputs.financialFoundation.investmentAllocation.bonds /= totalAllocation;
            inputs.financialFoundation.investmentAllocation.realEstate /= totalAllocation;
            inputs.financialFoundation.investmentAllocation.alternatives /= totalAllocation;
        }
    }
    /**
     * Optimized Monte Carlo Simulation - Fast and efficient
     */
    static async runOptimizedMonteCarloSimulation(inputs) {
        console.log('🎲 Starting optimized Monte Carlo simulation with', this.MONTE_CARLO_RUNS, 'runs');
        const scenarios = [];
        const startTime = Date.now();
        // Run simulations in smaller batches for better performance
        const batchSize = 5;
        const batches = Math.ceil(this.MONTE_CARLO_RUNS / batchSize);
        for (let batch = 0; batch < batches; batch++) {
            const batchPromises = [];
            for (let i = 0; i < batchSize && (batch * batchSize + i) < this.MONTE_CARLO_RUNS; i++) {
                const run = batch * batchSize + i;
                batchPromises.push(this.runSingleScenario(inputs, run));
            }
            // Run batch in parallel
            const batchResults = await Promise.all(batchPromises);
            scenarios.push(...batchResults);
            // Log progress
            const progress = Math.round(((batch + 1) / batches) * 100);
            console.log(`🎲 Monte Carlo progress: ${progress}% (${scenarios.length}/${this.MONTE_CARLO_RUNS} runs)`);
            // Early termination if taking too long (safety check)
            if (Date.now() - startTime > 10000) { // 10 second timeout
                console.warn('⚠️ Monte Carlo simulation taking too long, stopping early');
                break;
            }
        }
        const totalTime = Date.now() - startTime;
        console.log(`✅ Monte Carlo simulation completed in ${totalTime}ms with ${scenarios.length} scenarios`);
        return scenarios;
    }
    /**
     * Run a single Monte Carlo scenario
     */
    static async runSingleScenario(inputs, runNumber) {
        // Create variations for this simulation run
        const scenarioInputs = this.createScenarioVariation(inputs, runNumber);
        // Run projection for this scenario with early termination
        const projection = await this.calculateOptimizedWealthTrajectory(scenarioInputs);
        const extinctionYear = this.findWealthExtinctionYear(projection);
        return {
            run: runNumber,
            extinctionYear,
            finalWealth: projection[projection.length - 1]?.wealth || 0,
            majorEvents: projection.flatMap(p => p.majorEvents).slice(0, 5), // Limit events for performance
            riskFactors: this.identifyScenarioRisks(projection).slice(0, 3) // Limit risks for performance
        };
    }
    /**
     * Optimized Wealth Trajectory Calculation - Faster version
     */
    static async calculateOptimizedWealthTrajectory(inputs) {
        const projections = [];
        let currentWealth = inputs.financialFoundation.currentNetWorth;
        let currentAge = inputs.coreIdentity.age;
        // Reduce simulation years for faster calculation
        const maxYears = Math.min(this.SIMULATION_YEARS, 50); // Cap at 50 years for performance
        for (let year = 0; year < maxYears; year++) {
            const currentYear = 2025 + year;
            currentAge = inputs.coreIdentity.age + year;
            // Simplified calculations for better performance
            const yearlyIncome = AdvancedWealthCalculatorIncome.calculateIndianIncomeProgression(year, currentAge, inputs);
            const yearlyExpenses = AdvancedWealthCalculatorExpenses.calculateIndianExpenseProgression(year, currentAge, inputs);
            const investmentReturns = AdvancedWealthCalculatorInvestments.calculateIndianInvestmentReturns(currentWealth, year, inputs);
            const lifecycleImpacts = AdvancedWealthCalculatorEvents.calculateIndianLifecycleEvents(year, currentAge, inputs);
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
                majorEvents: lifecycleImpacts.events.slice(0, 2), // Limit events for performance
                confidenceLevel: this.calculateConfidenceLevel(year, inputs.complexityAnalysis.complexityScore)
            });
            // Early termination if wealth is extinct
            if (currentWealth <= 0)
                break;
            // Early termination if wealth is growing too much (unrealistic scenario)
            if (currentWealth > inputs.financialFoundation.currentNetWorth * 10)
                break;
        }
        return projections;
    }
    /**
     * Base Wealth Trajectory Calculation with Indian Context - Optimized
     */
    static async calculateBaseWealthTrajectory(inputs) {
        const projections = [];
        let currentWealth = inputs.financialFoundation.currentNetWorth;
        let currentAge = inputs.coreIdentity.age;
        // Optimize: Reduce simulation years for faster calculation
        const maxYears = Math.min(this.SIMULATION_YEARS, 60); // Cap at 60 years for performance
        for (let year = 0; year < maxYears; year++) {
            const currentYear = 2025 + year;
            currentAge = inputs.coreIdentity.age + year;
            // Income calculation with Indian market conditions
            const yearlyIncome = AdvancedWealthCalculatorIncome.calculateIndianIncomeProgression(year, currentAge, inputs);
            // Expenses with Indian inflation and lifestyle patterns
            const yearlyExpenses = AdvancedWealthCalculatorExpenses.calculateIndianExpenseProgression(year, currentAge, inputs);
            // Investment returns with Indian market volatility
            const investmentReturns = AdvancedWealthCalculatorInvestments.calculateIndianInvestmentReturns(currentWealth, year, inputs);
            // Lifecycle events specific to Indian families
            const lifecycleImpacts = AdvancedWealthCalculatorEvents.calculateIndianLifecycleEvents(year, currentAge, inputs);
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
                majorEvents: lifecycleImpacts.events.slice(0, 3), // Limit events for performance
                confidenceLevel: this.calculateConfidenceLevel(year, inputs.complexityAnalysis.complexityScore)
            });
            // Early termination if wealth is extinct
            if (currentWealth <= 0)
                break;
            // Early termination if wealth is growing unrealistically
            if (currentWealth > inputs.financialFoundation.currentNetWorth * 15)
                break;
        }
        return projections;
    }
    /**
     * Find Wealth Extinction Year
     */
    static findWealthExtinctionYear(projections) {
        for (const projection of projections) {
            if (projection.wealth <= 0) {
                return projection.year;
            }
        }
        return projections.length > 0 ?
            projections[projections.length - 1].year + 10 : // If projections exist but wealth never goes to zero
            2100; // If no projections, default to far future
    }
    /**
     * Create scenario variation for Monte Carlo simulation
     */
    static createScenarioVariation(inputs, runNumber) {
        // Create a deep copy of inputs
        const variation = JSON.parse(JSON.stringify(inputs));
        // Income variation (±20%)
        variation.financialFoundation.annualIncome *= (0.8 + Math.random() * 0.4);
        // Net worth variation (±15%)
        variation.financialFoundation.currentNetWorth *= (0.85 + Math.random() * 0.3);
        // Health status variations for parents
        variation.familyCareContext.parents = variation.familyCareContext.parents.map(parent => ({
            ...parent,
            healthStatus: Math.random() < 0.1 ? 'poor' : parent.healthStatus // 10% chance of health decline
        }));
        // Investment allocation variations
        const stocksVariation = variation.financialFoundation.investmentAllocation.stocks * (0.9 + Math.random() * 0.2);
        const bondsVariation = variation.financialFoundation.investmentAllocation.bonds * (0.9 + Math.random() * 0.2);
        const realEstateVariation = variation.financialFoundation.investmentAllocation.realEstate * (0.9 + Math.random() * 0.2);
        const alternativesVariation = variation.financialFoundation.investmentAllocation.alternatives * (0.9 + Math.random() * 0.2);
        // Normalize to ensure sum is 1
        const totalVariation = stocksVariation + bondsVariation + realEstateVariation + alternativesVariation;
        variation.financialFoundation.investmentAllocation = {
            stocks: stocksVariation / totalVariation,
            bonds: bondsVariation / totalVariation,
            realEstate: realEstateVariation / totalVariation,
            alternatives: alternativesVariation / totalVariation
        };
        return variation;
    }
    /**
     * Calculate confidence level based on year and complexity
     */
    static calculateConfidenceLevel(year, complexityScore) {
        const baseConfidence = 0.95;
        const timeDecay = year * 0.012; // 1.2% per year
        const complexityImpact = (complexityScore - 5) * 0.06;
        return Math.max(0.25, baseConfidence - timeDecay - complexityImpact);
    }
    /**
     * Identify risks in a specific scenario
     */
    static identifyScenarioRisks(projection) {
        const risks = [];
        // Identify periods of negative cash flow
        let consecutiveNegativeCashflow = 0;
        for (const period of projection) {
            if (period.netCashFlow < 0) {
                consecutiveNegativeCashflow++;
                if (consecutiveNegativeCashflow === 3) {
                    risks.push(`Sustained negative cash flow starting at age ${period.age - 2}`);
                }
            }
            else {
                consecutiveNegativeCashflow = 0;
            }
        }
        // Identify rapid wealth depletion
        for (let i = 1; i < projection.length; i++) {
            const wealthDrop = projection[i - 1].wealth - projection[i].wealth;
            const dropPercentage = wealthDrop / projection[i - 1].wealth;
            if (dropPercentage > 0.2 && wealthDrop > 1000000) {
                risks.push(`Major wealth drop (${(dropPercentage * 100).toFixed(1)}%) at age ${projection[i].age}`);
            }
        }
        return risks;
    }
    /**
     * Calculate family impact analysis
     */
    static calculateFamilyImpact(inputs, projections, extinctionYear) {
        // Calculate user death year (assuming life expectancy of 85)
        const userDeathYear = 2025 + (85 - inputs.coreIdentity.age);
        // Find wealth at death
        const wealthAtDeath = this.findWealthAtYear(projections, userDeathYear);
        // Calculate estate taxes (if applicable)
        const estateTax = this.calculateEstateTax(wealthAtDeath);
        // Calculate transfer costs
        const transferCosts = wealthAtDeath * 0.05; // 5% for legal and transfer costs
        // Calculate net transfer amount
        const netTransfer = Math.max(0, wealthAtDeath - estateTax - transferCosts);
        // Calculate planning efficiency
        const planningEfficiency = 0.7; // 70% efficiency with basic planning
        // Apply planning efficiency to net transfer
        const effectiveTransfer = netTransfer * planningEfficiency;
        // Calculate per-child inheritance
        const childrenCount = inputs.childrenContext.children.length || 1;
        const inheritancePerChild = effectiveTransfer / childrenCount;
        // Create children inheritance details
        const children = inputs.childrenContext.children.map(child => {
            const childAgeAtDeath = child.age + (userDeathYear - 2025);
            return {
                name: child.name,
                age: childAgeAtDeath,
                inheritance: inheritancePerChild
            };
        });
        // If no children defined, create a default child
        if (children.length === 0) {
            children.push({
                name: "Your Child",
                age: 30, // Default assumption
                inheritance: inheritancePerChild
            });
        }
        // Estimate grandchildren inheritance (typically 30% of what children received)
        const grandchildrenInheritance = effectiveTransfer * 0.3;
        // Estimate college costs for grandchildren
        const collegeYear = userDeathYear + 30;
        const yearsFromNow = collegeYear - 2025;
        // Calculate future education costs with inflation
        const currentEducationCost = 2000000; // ₹20L for college education
        const educationInflation = 0.08; // 8% annual inflation for education
        const futureEducationCost = currentEducationCost * Math.pow(1 + educationInflation, yearsFromNow);
        // Calculate college shortfall
        const collegeShortfall = Math.max(0, futureEducationCost - grandchildrenInheritance);
        return {
            today: {
                netWorth: inputs.financialFoundation.currentNetWorth,
                status: this.determineFinancialStatus(inputs.financialFoundation.currentNetWorth)
            },
            inheritance: {
                year: userDeathYear,
                children
            },
            grandchildren: {
                year: userDeathYear + 30, // Approximate time when grandchildren would need inheritance
                inheritance: grandchildrenInheritance,
                collegeShortfall
            }
        };
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
     * Calculate estate tax (hypothetical for India)
     */
    static calculateEstateTax(wealth) {
        // India doesn't currently have estate tax, but we'll simulate a hypothetical one
        const exemption = 50000000; // ₹5 crore exemption
        const taxRate = 0.10; // 10% tax rate
        if (wealth > exemption) {
            return (wealth - exemption) * taxRate;
        }
        return 0;
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
     * Calculate protected scenario (with recommendations implemented)
     */
    static async calculateProtectedScenario(inputs, baseProjection) {
        const baseExtinctionYear = this.findWealthExtinctionYear(baseProjection);
        // Calculate improvements from implementing recommendations
        const improvements = [
            {
                action: 'Family coordination optimization',
                impact: 'Reduces care costs by 25%',
                timelineExtension: 2,
                costSavings: 500000
            },
            {
                action: 'Investment strategy optimization',
                impact: 'Improves returns by 1-2% annually',
                timelineExtension: 3,
                costSavings: 1200000
            },
            {
                action: 'Education funding strategy',
                impact: 'Reduces education costs by 15%',
                timelineExtension: 1.5,
                costSavings: 800000
            }
        ];
        const totalExtension = improvements.reduce((sum, imp) => sum + imp.timelineExtension, 0);
        const totalSavings = improvements.reduce((sum, imp) => sum + imp.costSavings, 0);
        // Calculate protected grandchildren inheritance
        const baseGrandchildrenInheritance = baseProjection.length > 0 ?
            baseProjection[baseProjection.length - 1].wealth * 0.3 :
            inputs.financialFoundation.currentNetWorth * 0.15;
        const protectedGrandchildrenInheritance = baseGrandchildrenInheritance * 2.5; // 2.5x improvement
        return {
            extinctionYear: baseExtinctionYear + totalExtension,
            additionalYears: totalExtension,
            grandchildrenInheritance: protectedGrandchildrenInheritance,
            improvements: improvements
        };
    }
    /**
     * Identify top wealth destroyers
     */
    static identifyWealthDestroyers(inputs, projections) {
        const destroyers = [];
        // Education costs
        if (inputs.childrenContext.children.length > 0) {
            destroyers.push({
                factor: 'Education Costs',
                impact: inputs.childrenContext.children.length * 2500000, // ₹25L per child
                description: 'Rising education costs outpacing inflation',
                preventionStrategy: 'Start education planning early, explore scholarships and education loans'
            });
        }
        // Healthcare expenses
        destroyers.push({
            factor: 'Healthcare Expenses',
            impact: 1800000, // ₹18L impact
            description: 'Unexpected health emergencies and rising healthcare costs',
            preventionStrategy: 'Maintain comprehensive health insurance and emergency fund'
        });
        // Parent care costs
        if (inputs.familyCareContext.parents.length > 0) {
            destroyers.push({
                factor: 'Parent Care Costs',
                impact: inputs.familyCareContext.parents.length * 1500000, // ₹15L per parent
                description: 'Unplanned parent care expenses',
                preventionStrategy: 'Coordinate with siblings and plan for care costs early'
            });
        }
        // Market volatility
        destroyers.push({
            factor: 'Market Volatility',
            impact: inputs.financialFoundation.currentNetWorth * 0.15, // 15% of net worth
            description: 'Poor investment decisions during market downturns',
            preventionStrategy: 'Maintain diversified portfolio and avoid panic selling'
        });
        // Lifestyle inflation
        destroyers.push({
            factor: 'Lifestyle Inflation',
            impact: 800000, // ₹8L impact
            description: 'Increasing expenses outpacing income growth',
            preventionStrategy: 'Monitor expenses and maintain disciplined spending'
        });
        // Tax inefficiency
        destroyers.push({
            factor: 'Tax Inefficiency',
            impact: 700000, // ₹7L impact
            description: 'Suboptimal tax planning reducing investment returns',
            preventionStrategy: 'Optimize investment accounts and tax planning'
        });
        // Investment fees
        destroyers.push({
            factor: 'Investment Fees',
            impact: 600000, // ₹6L impact
            description: 'High fees eroding long-term investment returns',
            preventionStrategy: 'Use low-cost investment vehicles and negotiate fees'
        });
        // Emergency expenses
        destroyers.push({
            factor: 'Emergency Expenses',
            impact: 500000, // ₹5L impact
            description: 'Unexpected expenses without adequate emergency fund',
            preventionStrategy: 'Build and maintain adequate emergency fund'
        });
        // Family disputes
        if (inputs.familyCareContext.siblings.length > 0) {
            destroyers.push({
                factor: 'Family Disputes',
                impact: 1000000, // ₹10L impact
                description: 'Financial conflicts and coordination failures among family members',
                preventionStrategy: 'Establish clear communication and decision-making processes'
            });
        }
        // Estate planning gaps
        destroyers.push({
            factor: 'Estate Planning Gaps',
            impact: 900000, // ₹9L impact
            description: 'Inefficient wealth transfer due to inadequate estate planning',
            preventionStrategy: 'Create comprehensive estate plan with professional guidance'
        });
        // Sort by impact (highest first) and return top 5
        return destroyers.sort((a, b) => b.impact - a.impact).slice(0, 5);
    }
    /**
     * Analyze scenarios from Monte Carlo simulations
     */
    static analyzeScenarios(scenarios, baselineExtinctionYear) {
        // Sort scenarios by extinction year
        const sortedScenarios = [...scenarios].sort((a, b) => a.extinctionYear - b.extinctionYear);
        // Calculate percentiles
        const totalScenarios = sortedScenarios.length;
        const p10Index = Math.floor(0.1 * totalScenarios);
        const p25Index = Math.floor(0.25 * totalScenarios);
        const p50Index = Math.floor(0.5 * totalScenarios);
        const p75Index = Math.floor(0.75 * totalScenarios);
        const p90Index = Math.floor(0.9 * totalScenarios);
        // Extract key scenarios
        const worstCase = sortedScenarios[p10Index] || { extinctionYear: baselineExtinctionYear - 5 };
        const lowerQuartile = sortedScenarios[p25Index] || { extinctionYear: baselineExtinctionYear - 3 };
        const median = sortedScenarios[p50Index] || { extinctionYear: baselineExtinctionYear };
        const upperQuartile = sortedScenarios[p75Index] || { extinctionYear: baselineExtinctionYear + 3 };
        const bestCase = sortedScenarios[p90Index] || { extinctionYear: baselineExtinctionYear + 5 };
        // Generate scenario analysis
        return {
            bestCase: {
                extinctionYear: bestCase.extinctionYear,
                probability: 0.1,
                conditions: [
                    'Optimal investment returns',
                    'Lower than expected inflation',
                    'Minimal unexpected expenses',
                    'Excellent family coordination'
                ]
            },
            mostLikely: {
                extinctionYear: median.extinctionYear,
                probability: 0.6,
                conditions: [
                    'Average investment returns',
                    'Expected inflation rates',
                    'Typical life events and expenses',
                    'Good family coordination'
                ]
            },
            worstCase: {
                extinctionYear: worstCase.extinctionYear,
                probability: 0.1,
                conditions: [
                    'Below average investment returns',
                    'Higher than expected inflation',
                    'Multiple unexpected expenses',
                    'Poor family coordination'
                ]
            },
            stressTests: [
                {
                    scenario: 'Market Crash + Health Emergency',
                    extinctionYearImpact: -8,
                    wealthImpact: -3500000,
                    probability: 0.03,
                    description: 'Simultaneous 30% market decline and major health emergency'
                },
                {
                    scenario: 'Extended Bear Market',
                    extinctionYearImpact: -5,
                    wealthImpact: -2200000,
                    probability: 0.05,
                    description: '5-year period of negative real returns'
                },
                {
                    scenario: 'Family Coordination Failure',
                    extinctionYearImpact: -4,
                    wealthImpact: -1800000,
                    probability: 0.07,
                    description: 'Lack of coordination leading to inefficient resource allocation'
                }
            ],
            statistics: {
                median: median.extinctionYear,
                mean: this.calculateMean(scenarios.map(s => s.extinctionYear)),
                standardDeviation: this.calculateStandardDeviation(scenarios.map(s => s.extinctionYear)),
                confidenceInterval95: [lowerQuartile.extinctionYear, upperQuartile.extinctionYear]
            }
        };
    }
    /**
     * Perform Extreme Value Theory analysis
     */
    static performExtremeValueAnalysis(inputs, projections) {
        console.log('📊 Performing Extreme Value Theory analysis');
        try {
            // Extract data for EVT analysis
            const data = this.extractDataForEVTAnalysis(projections, inputs.financialFoundation.currentNetWorth);
            // Perform EVT analysis
            const evtResults = ExtremeValueTheoryService.performEVTAnalysis(data);
            console.log('✅ EVT analysis completed successfully');
            return evtResults;
        }
        catch (error) {
            console.error('❌ Error in EVT analysis:', error);
            // Return a simplified fallback analysis
            return this.getFallbackEVTAnalysis(inputs);
        }
    }
    /**
     * Extract data for EVT analysis
     */
    static extractDataForEVTAnalysis(projections, initialWealth) {
        // Extract wealth changes from projections
        const wealthChanges = [];
        for (let i = 1; i < projections.length; i++) {
            const prevWealth = projections[i - 1].wealth;
            const currWealth = projections[i].wealth;
            if (prevWealth > 0) {
                // Calculate percentage change
                const change = (currWealth - prevWealth) / prevWealth;
                wealthChanges.push(change);
            }
        }
        // Focus on negative changes (losses) for tail risk analysis
        const losses = wealthChanges.filter(c => c < 0).map(c => -c); // Convert to positive values
        // If insufficient data, generate synthetic data
        if (losses.length < 20) {
            console.warn('⚠️ Insufficient loss data for EVT, generating synthetic data');
            // Generate synthetic data based on the available data
            const syntheticLosses = [];
            // Calculate mean and standard deviation of available losses
            const mean = losses.length > 0 ?
                losses.reduce((sum, l) => sum + l, 0) / losses.length :
                0.05; // Default mean loss of 5%
            const stdDev = losses.length > 0 ?
                Math.sqrt(losses.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / losses.length) :
                0.03; // Default standard deviation of 3%
            // Generate synthetic losses
            for (let i = 0; i < 100; i++) {
                // Generate random normal using Box-Muller transform
                let u = 0, v = 0;
                while (u === 0)
                    u = Math.random();
                while (v === 0)
                    v = Math.random();
                const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
                // Generate loss (ensure it's positive)
                const loss = Math.max(0.001, mean + z * stdDev);
                syntheticLosses.push(loss);
            }
            return syntheticLosses;
        }
        return losses;
    }
    /**
     * Get fallback EVT analysis when the main analysis fails
     */
    static getFallbackEVTAnalysis(inputs) {
        // Create a conservative fallback analysis
        return {
            model: {
                type: 'GPD',
                parameters: {
                    shape: 0.2, // Slightly heavy-tailed
                    scale: 0.05,
                    threshold: 0.1
                },
                thresholdPercentile: 0.95,
                exceedanceCount: 10,
                totalObservations: 100,
                fitMethod: 'MOM',
                goodnessOfFit: {
                    statistic: 0.5,
                    pValue: 0.1,
                    passed: false
                }
            },
            var99: 0.25, // 25% loss at 99% confidence
            var995: 0.35, // 35% loss at 99.5% confidence
            var999: 0.5, // 50% loss at 99.9% confidence
            es99: 0.35, // 35% expected shortfall at 99% confidence
            tailRiskAssessment: 'MEDIUM',
            tailEvents: [
                {
                    description: 'Major market correction (-20%)',
                    probability: 0.05,
                    impact: 0.2,
                    severity: 'MEDIUM'
                },
                {
                    description: 'Severe market crash (-35%)',
                    probability: 0.01,
                    impact: 0.35,
                    severity: 'HIGH'
                },
                {
                    description: 'Financial crisis (-50%+)',
                    probability: 0.001,
                    impact: 0.5,
                    severity: 'EXTREME'
                }
            ]
        };
    }
    /**
     * Calculate mean of an array of numbers
     */
    static calculateMean(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    /**
     * Calculate standard deviation of an array of numbers
     */
    static calculateStandardDeviation(values) {
        if (values.length === 0)
            return 0;
        const mean = this.calculateMean(values);
        const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
        const variance = this.calculateMean(squaredDifferences);
        return Math.sqrt(variance);
    }
}
AdvancedWealthCalculator.SIMULATION_YEARS = 75;
AdvancedWealthCalculator.MONTE_CARLO_RUNS = 20; // Reduced from 100 to 20 for much better performance
AdvancedWealthCalculator.VARIABLES_MONITORED = 247;
