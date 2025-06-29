// src/services/ExtremeValueTheoryService.ts
// Implementation of Extreme Value Theory for tail risk analysis

import { EVTModel, EVTResults, GPDParameters } from '../types/evt';

/**
 * Extreme Value Theory Service
 * 
 * This service implements Extreme Value Theory (EVT) for analyzing tail risks
 * in wealth projections. It uses the Generalized Pareto Distribution (GPD) to
 * model extreme events that could significantly impact wealth.
 */
export class ExtremeValueTheoryService {
  /**
   * Fit a Generalized Pareto Distribution (GPD) to the data
   * 
   * @param data Array of values (typically losses or negative returns)
   * @param thresholdPercentile Percentile to use for threshold selection (default: 0.95)
   * @returns Fitted EVT model
   */
  static fitGeneralizedParetoDistribution(
    data: number[],
    thresholdPercentile: number = 0.95
  ): EVTModel {
    console.log(`🔍 Fitting GPD with threshold percentile: ${thresholdPercentile}`);
    
    // Sort data to find threshold
    const sortedData = [...data].sort((a, b) => a - b);
    const thresholdIndex = Math.floor((1 - thresholdPercentile) * sortedData.length);
    const threshold = sortedData[thresholdIndex];
    
    console.log(`📊 Threshold value: ${threshold} (index: ${thresholdIndex}/${sortedData.length})`);
    
    // Extract exceedances (values beyond threshold)
    const exceedances = data
      .filter(x => x > threshold)
      .map(x => x - threshold); // Convert to excesses over threshold
    
    console.log(`📊 Number of exceedances: ${exceedances.length}`);
    
    if (exceedances.length < 10) {
      console.warn('⚠️ Insufficient exceedances for reliable EVT estimation');
      // Fall back to a conservative estimate
      return this.getFallbackModel(data, threshold, thresholdPercentile);
    }
    
    // Fit GPD using method of moments (MOM)
    const parameters = this.fitGPDByMethodOfMoments(exceedances);
    
    console.log(`📊 Fitted GPD parameters: shape=${parameters.shape.toFixed(4)}, scale=${parameters.scale.toFixed(4)}`);
    
    // Calculate goodness of fit
    const goodnessOfFit = this.calculateGoodnessOfFit(exceedances, parameters);
    
    // Create and return the model
    const model: EVTModel = {
      type: 'GPD',
      parameters: {
        ...parameters,
        threshold
      },
      thresholdPercentile,
      exceedanceCount: exceedances.length,
      totalObservations: data.length,
      fitMethod: 'MOM',
      goodnessOfFit
    };
    
    return model;
  }
  
  /**
   * Calculate Value at Risk (VaR) for a given confidence level
   * 
   * @param model Fitted EVT model
   * @param confidenceLevel Confidence level (e.g., 0.99 for 99%)
   * @returns Value at Risk
   */
  static calculateExtremeVaR(model: EVTModel, confidenceLevel: number): number {
    const { shape, scale, threshold } = model.parameters;
    const p = (1 - confidenceLevel) * model.totalObservations / model.exceedanceCount;
    
    // Calculate VaR using the GPD formula
    let var_evt: number;
    if (Math.abs(shape) < 1e-10) { // shape ≈ 0
      var_evt = threshold + scale * Math.log(1 / p);
    } else {
      var_evt = threshold + (scale / shape) * (Math.pow(p, -shape) - 1);
    }
    
    return var_evt;
  }
  
  /**
   * Calculate Expected Shortfall (ES) for a given confidence level
   * 
   * @param model Fitted EVT model
   * @param confidenceLevel Confidence level (e.g., 0.99 for 99%)
   * @returns Expected Shortfall
   */
  static calculateExpectedShortfall(model: EVTModel, confidenceLevel: number): number {
    const { shape, scale } = model.parameters;
    const var_evt = this.calculateExtremeVaR(model, confidenceLevel);
    
    // Check if ES is defined (shape < 1)
    if (shape >= 1) {
      console.warn('⚠️ Expected Shortfall is undefined for shape >= 1');
      return Infinity;
    }
    
    // Calculate ES using the GPD formula
    const es = var_evt / (1 - shape) + (scale - shape * model.parameters.threshold) / (1 - shape);
    
    return es;
  }
  
  /**
   * Perform comprehensive Extreme Value Theory analysis
   * 
   * @param data Array of values (typically losses or negative returns)
   * @returns Complete EVT analysis results
   */
  static performEVTAnalysis(data: number[]): EVTResults {
    console.log('🔍 Performing comprehensive EVT analysis');
    
    // Fit the GPD model
    const model = this.fitGeneralizedParetoDistribution(data);
    
    // Calculate risk metrics
    const var99 = this.calculateExtremeVaR(model, 0.99);
    const var995 = this.calculateExtremeVaR(model, 0.995);
    const var999 = this.calculateExtremeVaR(model, 0.999);
    const es99 = this.calculateExpectedShortfall(model, 0.99);
    
    console.log(`📊 Risk metrics: VaR99=${var99.toFixed(2)}, VaR99.5=${var995.toFixed(2)}, VaR99.9=${var999.toFixed(2)}, ES99=${es99.toFixed(2)}`);
    
    // Assess tail risk
    const tailRiskAssessment = this.assessTailRisk(var99, es99, model);
    
    // Generate potential tail events
    const tailEvents = this.generateTailEvents(model, var99, var995, var999);
    
    return {
      model,
      var99,
      var995,
      var999,
      es99,
      tailRiskAssessment,
      tailEvents
    };
  }
  
  /**
   * Extract data for EVT analysis from wealth projections
   * 
   * @param projections Array of wealth projections
   * @param initialWealth Initial wealth value
   * @returns Array of data points for EVT analysis
   */
  static extractDataForEVTAnalysis(projections: any[], initialWealth: number): number[] {
    // Extract annual returns from projections
    const returns: number[] = [];
    
    for (let i = 1; i < projections.length; i++) {
      const prevWealth = projections[i-1].wealth;
      const currWealth = projections[i].wealth;
      
      // Calculate return (negative returns are losses)
      if (prevWealth > 0) {
        const returnRate = (currWealth - prevWealth) / prevWealth;
        returns.push(returnRate);
      }
    }
    
    // Focus on negative returns (losses) for tail risk analysis
    const losses = returns.filter(r => r < 0).map(r => -r); // Convert to positive values
    
    console.log(`📊 Extracted ${losses.length} loss events from ${returns.length} returns`);
    
    // If insufficient loss data, generate synthetic data
    if (losses.length < 20) {
      console.warn('⚠️ Insufficient loss data, generating synthetic data');
      return this.generateSyntheticLossData(returns);
    }
    
    return losses;
  }
  
  /**
   * Fit GPD using Method of Moments
   * 
   * @param exceedances Array of exceedances over threshold
   * @returns GPD parameters (shape and scale)
   */
  private static fitGPDByMethodOfMoments(exceedances: number[]): Omit<GPDParameters, 'threshold'> {
    // Calculate mean and variance of exceedances
    const mean = exceedances.reduce((sum, x) => sum + x, 0) / exceedances.length;
    const variance = exceedances.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / exceedances.length;
    
    // Method of moments estimators
    let shape: number;
    let scale: number;
    
    if (mean * mean / variance < 0.5) {
      // Valid shape parameter
      shape = 0.5 * (1 - (mean * mean) / variance);
      scale = mean * (1 - shape);
    } else {
      // Fallback to exponential distribution (shape = 0)
      shape = 0;
      scale = mean;
    }
    
    // Ensure shape is within reasonable bounds
    shape = Math.max(-0.5, Math.min(0.5, shape));
    
    return { shape, scale };
  }
  
  /**
   * Calculate goodness of fit for GPD
   * 
   * @param exceedances Array of exceedances over threshold
   * @param parameters GPD parameters
   * @returns Goodness of fit statistics
   */
  private static calculateGoodnessOfFit(
    exceedances: number[],
    parameters: Omit<GPDParameters, 'threshold'>
  ): { statistic: number; pValue: number; passed: boolean } {
    // Simplified goodness of fit test
    // In a production environment, use proper statistical tests like Anderson-Darling
    
    const { shape, scale } = parameters;
    
    // Calculate empirical CDF
    const sortedExceedances = [...exceedances].sort((a, b) => a - b);
    const n = sortedExceedances.length;
    
    let sumSquaredDiff = 0;
    
    for (let i = 0; i < n; i++) {
      const empiricalCDF = (i + 1) / n;
      const theoreticalCDF = this.calculateGPDCDF(sortedExceedances[i], shape, scale);
      
      sumSquaredDiff += Math.pow(empiricalCDF - theoreticalCDF, 2);
    }
    
    // Calculate test statistic (simplified Cramer-von Mises)
    const statistic = sumSquaredDiff / n;
    
    // Simplified p-value calculation
    const pValue = Math.exp(-statistic * 10);
    
    // Pass if p-value > 0.05
    const passed = pValue > 0.05;
    
    return { statistic, pValue, passed };
  }
  
  /**
   * Calculate CDF of Generalized Pareto Distribution
   * 
   * @param x Value
   * @param shape Shape parameter
   * @param scale Scale parameter
   * @returns CDF value
   */
  private static calculateGPDCDF(x: number, shape: number, scale: number): number {
    if (x < 0) return 0;
    
    if (Math.abs(shape) < 1e-10) { // shape ≈ 0
      return 1 - Math.exp(-x / scale);
    } else {
      return 1 - Math.pow(1 + shape * x / scale, -1 / shape);
    }
  }
  
  /**
   * Generate synthetic loss data when insufficient real data is available
   * 
   * @param returns Array of returns
   * @returns Synthetic loss data
   */
  private static generateSyntheticLossData(returns: number[]): number[] {
    // Calculate mean and standard deviation of returns
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length);
    
    // Generate synthetic loss data using normal distribution
    const syntheticLosses: number[] = [];
    
    for (let i = 0; i < 100; i++) {
      // Generate random normal using Box-Muller transform
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      
      // Generate loss (negative return) and convert to positive
      const syntheticReturn = mean + z * stdDev;
      if (syntheticReturn < 0) {
        syntheticLosses.push(-syntheticReturn);
      }
    }
    
    // Ensure we have enough loss data
    while (syntheticLosses.length < 50) {
      syntheticLosses.push(stdDev * Math.random() * 2); // Add some random losses
    }
    
    return syntheticLosses;
  }
  
  /**
   * Get fallback model when insufficient data is available
   * 
   * @param data Original data
   * @param threshold Threshold value
   * @param thresholdPercentile Threshold percentile
   * @returns Fallback EVT model
   */
  private static getFallbackModel(
    data: number[],
    threshold: number,
    thresholdPercentile: number
  ): EVTModel {
    // Calculate mean and standard deviation
    const mean = data.reduce((sum, x) => sum + x, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length);
    
    // Conservative fallback parameters
    const shape = 0.2; // Slightly heavy-tailed
    const scale = stdDev * 0.5;
    
    return {
      type: 'GPD',
      parameters: {
        shape,
        scale,
        threshold
      },
      thresholdPercentile,
      exceedanceCount: Math.max(5, Math.floor(data.length * (1 - thresholdPercentile))),
      totalObservations: data.length,
      fitMethod: 'MOM',
      goodnessOfFit: {
        statistic: 0.5,
        pValue: 0.1,
        passed: false
      }
    };
  }
  
  /**
   * Assess tail risk based on VaR and ES
   * 
   * @param var99 Value at Risk at 99%
   * @param es99 Expected Shortfall at 99%
   * @param model EVT model
   * @returns Tail risk assessment
   */
  private static assessTailRisk(
    var99: number,
    es99: number,
    model: EVTModel
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' {
    // Assess based on shape parameter (heavier tails = higher risk)
    const { shape } = model.parameters;
    
    if (shape > 0.3) return 'EXTREME'; // Very heavy tails
    if (shape > 0.1) return 'HIGH';    // Heavy tails
    if (shape > -0.1) return 'MEDIUM'; // Moderate tails
    return 'LOW';                      // Light tails
  }
  
  /**
   * Generate potential tail events based on the model
   * 
   * @param model EVT model
   * @param var99 Value at Risk at 99%
   * @param var995 Value at Risk at 99.5%
   * @param var999 Value at Risk at 99.9%
   * @returns Array of potential tail events
   */
  private static generateTailEvents(
    model: EVTModel,
    var99: number,
    var995: number,
    var999: number
  ): Array<{
    description: string;
    probability: number;
    impact: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  }> {
    return [
      {
        description: 'Major market correction (-20%)',
        probability: 0.05, // 5% annual probability
        impact: var99,
        severity: 'MEDIUM'
      },
      {
        description: 'Severe market crash (-35%)',
        probability: 0.01, // 1% annual probability
        impact: var995,
        severity: 'HIGH'
      },
      {
        description: 'Financial crisis (-50%+)',
        probability: 0.001, // 0.1% annual probability
        impact: var999,
        severity: 'EXTREME'
      },
      {
        description: 'Simultaneous health emergency and market downturn',
        probability: 0.02, // 2% annual probability
        impact: var995 * 1.2, // 20% worse than severe market crash
        severity: 'HIGH'
      },
      {
        description: 'Prolonged economic recession (2+ years)',
        probability: 0.03, // 3% annual probability
        impact: var99 * 1.5, // 50% worse than major correction
        severity: 'HIGH'
      }
    ];
  }
}