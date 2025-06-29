/**
 * Types for Extreme Value Theory (EVT) implementation
 */

/**
 * Parameters for the Generalized Pareto Distribution (GPD)
 */
export interface GPDParameters {
  shape: number;      // ξ (xi) - shape parameter
  scale: number;      // β (beta) - scale parameter
  threshold: number;  // u - threshold parameter
}

/**
 * Extreme Value Theory model
 */
export interface EVTModel {
  type: 'GPD';                  // Model type (Generalized Pareto Distribution)
  parameters: GPDParameters;    // Model parameters
  thresholdPercentile: number;  // Percentile used for threshold selection
  exceedanceCount: number;      // Number of exceedances above threshold
  totalObservations: number;    // Total number of observations
  fitMethod: 'MLE' | 'MOM';     // Fitting method (Maximum Likelihood or Method of Moments)
  goodnessOfFit: {              // Goodness of fit statistics
    statistic: number;          // Test statistic
    pValue: number;             // p-value
    passed: boolean;            // Whether the test passed
  };
}

/**
 * Results of Extreme Value Theory analysis
 */
export interface EVTResults {
  model: EVTModel;                // Fitted EVT model
  var99: number;                  // Value at Risk at 99% confidence level
  var995: number;                 // Value at Risk at 99.5% confidence level
  var999: number;                 // Value at Risk at 99.9% confidence level
  es99: number;                   // Expected Shortfall at 99% confidence level
  tailRiskAssessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'; // Overall tail risk assessment
  tailEvents: Array<{            // Potential tail events
    description: string;         // Description of the event
    probability: number;         // Probability of occurrence
    impact: number;              // Financial impact
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'; // Severity level
  }>;
}

/**
 * Extended calculation results with EVT analysis
 */
export interface ExtendedCalculationResults {
  extremeValueAnalysis: EVTResults;
}