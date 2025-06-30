"use strict";
// src/services/ModelMonitoringService.ts
// Service for monitoring model performance and detecting drift
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelMonitoringService = void 0;
/**
 * Service for monitoring model performance and detecting drift
 */
class ModelMonitoringService {
    constructor(riskManagementFramework) {
        this.monitoringPlans = new Map();
        this.monitoringResults = new Map();
        this.activeAlerts = new Map();
        this.alertHandlers = [];
        this.riskManagementFramework = riskManagementFramework;
    }
    /**
     * Set monitoring plan for a model
     * @param modelId The ID of the model
     * @param plan Monitoring plan
     */
    setMonitoringPlan(modelId, plan) {
        this.monitoringPlans.set(modelId, plan);
    }
    /**
     * Get monitoring plan for a model
     * @param modelId The ID of the model
     * @returns Monitoring plan
     */
    getMonitoringPlan(modelId) {
        return this.monitoringPlans.get(modelId);
    }
    /**
     * Monitor model performance
     * @param modelId The ID of the model
     * @param predictions Model predictions
     * @param actuals Actual values
     * @returns Monitoring result
     */
    monitorPerformance(modelId, predictions, actuals) {
        const plan = this.monitoringPlans.get(modelId);
        if (!plan) {
            throw new Error(`No monitoring plan found for model ${modelId}`);
        }
        // Calculate performance metrics
        const metrics = this.calculatePerformanceMetrics(predictions, actuals);
        // Check for alerts
        const alerts = this.checkAlerts(modelId, metrics, plan);
        // Determine overall status
        const status = this.determineStatus(alerts);
        // Create monitoring result
        const result = {
            modelId,
            timestamp: new Date(),
            metrics: {
                mae: metrics.mae,
                rmse: metrics.rmse,
                directionalAccuracy: metrics.directionalAccuracy,
                hitRate: metrics.hitRate
            },
            alerts,
            status
        };
        // Store monitoring result
        const results = this.monitoringResults.get(modelId) || [];
        results.push(result);
        this.monitoringResults.set(modelId, results);
        // Update active alerts
        this.updateActiveAlerts(modelId, alerts);
        // Trigger alert handlers
        alerts.forEach(alert => {
            this.alertHandlers.forEach(handler => handler(alert));
        });
        return result;
    }
    /**
     * Check for population drift
     * @param modelId The ID of the model
     * @param baselineData Baseline data
     * @param currentData Current data
     * @returns Population Stability Index (PSI)
     */
    checkPopulationDrift(modelId, baselineData, currentData) {
        // Calculate Population Stability Index (PSI)
        const psi = this.calculatePSI(baselineData, currentData);
        // Get monitoring plan
        const plan = this.monitoringPlans.get(modelId);
        if (!plan) {
            return psi;
        }
        // Check if PSI exceeds threshold
        const threshold = plan.alertThresholds['Population Stability Index'] || 0.25;
        if (psi > threshold) {
            const alert = {
                modelId,
                metricName: 'Population Stability Index',
                currentValue: psi,
                threshold,
                severity: psi > 0.5 ? 'CRITICAL' : psi > 0.3 ? 'HIGH' : 'MEDIUM',
                timestamp: new Date(),
                message: `Population drift detected (PSI: ${psi.toFixed(3)})`
            };
            // Trigger alert handlers
            this.alertHandlers.forEach(handler => handler(alert));
            // Update active alerts
            const alerts = this.activeAlerts.get(modelId) || [];
            alerts.push(alert);
            this.activeAlerts.set(modelId, alerts);
        }
        return psi;
    }
    /**
     * Get monitoring results for a model
     * @param modelId The ID of the model
     * @returns Monitoring results
     */
    getMonitoringResults(modelId) {
        return this.monitoringResults.get(modelId) || [];
    }
    /**
     * Get active alerts for a model
     * @param modelId The ID of the model
     * @returns Active alerts
     */
    getActiveAlerts(modelId) {
        return this.activeAlerts.get(modelId) || [];
    }
    /**
     * Add alert handler
     * @param handler Alert handler function
     */
    addAlertHandler(handler) {
        this.alertHandlers.push(handler);
    }
    /**
     * Calculate performance metrics
     * @param predictions Model predictions
     * @param actuals Actual values
     * @returns Performance metrics
     */
    calculatePerformanceMetrics(predictions, actuals) {
        const n = predictions.length;
        const errors = predictions.map((pred, i) => pred - actuals[i]);
        const absoluteErrors = errors.map(e => Math.abs(e));
        const squaredErrors = errors.map(e => e * e);
        const mae = absoluteErrors.reduce((sum, e) => sum + e, 0) / n;
        const mse = squaredErrors.reduce((sum, e) => sum + e, 0) / n;
        const rmse = Math.sqrt(mse);
        // Financial-specific metrics
        const directionalAccuracy = this.calculateDirectionalAccuracy(predictions, actuals);
        const hitRate = this.calculateHitRate(predictions, actuals);
        // Calculate additional metrics
        const informationRatio = this.calculateInformationRatio(errors);
        const maxDrawdown = this.calculateMaxDrawdown(actuals);
        return {
            mse,
            mae,
            rmse,
            directionalAccuracy,
            hitRate,
            informationRatio,
            maxDrawdown,
            sharpeRatio: 0, // Placeholder
            calmarRatio: 0 // Placeholder
        };
    }
    /**
     * Calculate directional accuracy
     * @param predictions Model predictions
     * @param actuals Actual values
     * @returns Directional accuracy
     */
    calculateDirectionalAccuracy(predictions, actuals) {
        let correct = 0;
        for (let i = 1; i < predictions.length; i++) {
            const predDirection = predictions[i] > predictions[i - 1];
            const actualDirection = actuals[i] > actuals[i - 1];
            if (predDirection === actualDirection)
                correct++;
        }
        return correct / (predictions.length - 1);
    }
    /**
     * Calculate hit rate
     * @param predictions Model predictions
     * @param actuals Actual values
     * @returns Hit rate
     */
    calculateHitRate(predictions, actuals) {
        const threshold = 0.05; // 5% tolerance
        let hits = 0;
        for (let i = 0; i < predictions.length; i++) {
            if (Math.abs(predictions[i] - actuals[i]) / Math.abs(actuals[i]) <= threshold)
                hits++;
        }
        return hits / predictions.length;
    }
    /**
     * Calculate information ratio
     * @param errors Prediction errors
     * @returns Information ratio
     */
    calculateInformationRatio(errors) {
        const mean = errors.reduce((sum, e) => sum + e, 0) / errors.length;
        const variance = errors.reduce((sum, e) => sum + (e - mean) ** 2, 0) / errors.length;
        const trackingError = Math.sqrt(variance);
        return mean / trackingError;
    }
    /**
     * Calculate maximum drawdown
     * @param returns Return series
     * @returns Maximum drawdown
     */
    calculateMaxDrawdown(returns) {
        let peak = returns[0];
        let maxDrawdown = 0;
        for (let i = 1; i < returns.length; i++) {
            if (returns[i] > peak) {
                peak = returns[i];
            }
            else {
                const drawdown = (peak - returns[i]) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }
        return maxDrawdown;
    }
    /**
     * Calculate Population Stability Index (PSI)
     * @param baseline Baseline distribution
     * @param current Current distribution
     * @returns PSI value
     */
    calculatePSI(baseline, current) {
        // Discretize into 10 bins
        const bins = 10;
        const min = Math.min(...baseline, ...current);
        const max = Math.max(...baseline, ...current);
        const binWidth = (max - min) / bins;
        let psi = 0;
        for (let i = 0; i < bins; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            const baselineCount = baseline.filter(val => val >= binStart && val < binEnd).length;
            const currentCount = current.filter(val => val >= binStart && val < binEnd).length;
            const baselineRate = Math.max(0.0001, baselineCount / baseline.length);
            const currentRate = Math.max(0.0001, currentCount / current.length);
            psi += (currentRate - baselineRate) * Math.log(currentRate / baselineRate);
        }
        return psi;
    }
    /**
     * Check for alerts based on performance metrics
     * @param modelId The ID of the model
     * @param metrics Performance metrics
     * @param plan Monitoring plan
     * @returns Alerts
     */
    checkAlerts(modelId, metrics, plan) {
        const alerts = [];
        // Check each metric against its threshold
        Object.entries(metrics).forEach(([metricName, value]) => {
            const threshold = plan.alertThresholds[metricName];
            if (threshold !== undefined) {
                let exceeded = false;
                // Different logic for different metrics
                switch (metricName) {
                    case 'directionalAccuracy':
                    case 'hitRate':
                        // Higher is better, alert if below threshold
                        exceeded = value < threshold;
                        break;
                    default:
                        // Lower is better, alert if above threshold
                        exceeded = value > threshold;
                        break;
                }
                if (exceeded) {
                    const severity = this.determineSeverity(metricName, value, threshold);
                    alerts.push({
                        modelId,
                        metricName,
                        currentValue: value,
                        threshold,
                        severity,
                        timestamp: new Date(),
                        message: `${metricName} threshold exceeded: ${value.toFixed(3)} vs ${threshold.toFixed(3)}`
                    });
                }
            }
        });
        return alerts;
    }
    /**
     * Determine alert severity
     * @param metricName Metric name
     * @param value Current value
     * @param threshold Threshold value
     * @returns Severity level
     */
    determineSeverity(metricName, value, threshold) {
        let deviation;
        // Different logic for different metrics
        switch (metricName) {
            case 'directionalAccuracy':
            case 'hitRate':
                // Higher is better
                deviation = (threshold - value) / threshold;
                break;
            default:
                // Lower is better
                deviation = (value - threshold) / threshold;
                break;
        }
        if (deviation > 0.5)
            return 'CRITICAL';
        if (deviation > 0.3)
            return 'HIGH';
        if (deviation > 0.1)
            return 'MEDIUM';
        return 'LOW';
    }
    /**
     * Determine overall status based on alerts
     * @param alerts Alerts
     * @returns Status
     */
    determineStatus(alerts) {
        if (alerts.some(alert => alert.severity === 'CRITICAL')) {
            return 'CRITICAL';
        }
        if (alerts.some(alert => alert.severity === 'HIGH')) {
            return 'WARNING';
        }
        if (alerts.length > 0) {
            return 'WARNING';
        }
        return 'HEALTHY';
    }
    /**
     * Update active alerts for a model
     * @param modelId The ID of the model
     * @param newAlerts New alerts
     */
    updateActiveAlerts(modelId, newAlerts) {
        const activeAlerts = this.activeAlerts.get(modelId) || [];
        // Add new alerts
        const updatedAlerts = [...activeAlerts];
        newAlerts.forEach(newAlert => {
            // Check if alert already exists
            const existingIndex = updatedAlerts.findIndex(a => a.metricName === newAlert.metricName);
            if (existingIndex >= 0) {
                // Update existing alert
                updatedAlerts[existingIndex] = newAlert;
            }
            else {
                // Add new alert
                updatedAlerts.push(newAlert);
            }
        });
        this.activeAlerts.set(modelId, updatedAlerts);
    }
}
exports.ModelMonitoringService = ModelMonitoringService;
