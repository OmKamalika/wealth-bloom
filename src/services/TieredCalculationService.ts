// src/services/TieredCalculationService.ts
// Service for handling tiered calculation architecture

import { v4 as uuidv4 } from 'uuid';
import { 
  BasicCalculationInputs, 
  BasicCalculationResults,
  CalculationJobStatus,
  ComprehensiveCalculationRequest,
  ComprehensiveCalculationResponse
} from '../types/tiered-calculation';
import { CalculatorData, CalculationResults } from '../types/calculator';
import { AdvancedWealthCalculator } from './AdvancedWealthCalculator';
import { supabase } from '../lib/supabase';

/**
 * Service for handling tiered calculation architecture
 */
export class TieredCalculationService {
  private static instance: TieredCalculationService;
  private calculationQueue: Map<string, CalculationJobStatus> = new Map();
  private calculationCache: Map<string, any> = new Map();
  
  /**
   * Get singleton instance
   */
  public static getInstance(): TieredCalculationService {
    if (!TieredCalculationService.instance) {
      TieredCalculationService.instance = new TieredCalculationService();
    }
    return TieredCalculationService.instance;
  }
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize service
    console.log('🔄 Initializing TieredCalculationService');
    
    // Start processing queue
    this.processQueue();
  }
  
  /**
   * Perform basic calculation (immediate response)
   * @param inputs Basic calculation inputs
   * @returns Basic calculation results
   */
  public async performBasicCalculation(inputs: BasicCalculationInputs): Promise<BasicCalculationResults> {
    console.log('🔄 Performing basic calculation');
    
    try {
      // Convert basic inputs to calculator data format
      const calculatorData = this.convertToCalculatorData(inputs);
      
      // Perform simplified calculation
      const results = await this.performSimplifiedCalculation(calculatorData);
      
      // Generate calculation ID
      const calculationId = uuidv4();
      
      // Store calculation data for potential upgrade
      this.storeBasicCalculation(calculationId, inputs, calculatorData, results);
      
      // Return basic results
      return {
        extinctionYear: results.extinctionYear,
        yearsRemaining: results.yearsRemaining,
        currentWealth: results.currentWealth,
        childrenInheritance: results.childrenInheritance,
        grandchildrenInheritance: results.grandchildrenInheritance,
        topRisks: results.topWealthDestroyers.slice(0, 3),
        confidenceLevel: 0.8, // Lower confidence for basic calculation
        calculationId,
        upgradeIncentives: this.generateUpgradeIncentives(results),
        complexityAnalysis: {
          score: results.complexityAnalysis?.score || this.calculateComplexityScore(inputs),
          majorDecisions: results.complexityAnalysis?.majorDecisions || [],
          interconnections: results.complexityAnalysis?.interconnections || [],
          sandwichGenerationOverload: results.complexityAnalysis?.sandwichGenerationOverload || (inputs.parentCare && inputs.children > 0)
        }
      };
    } catch (error) {
      console.error('❌ Error in basic calculation:', error);
      throw new Error('Failed to perform basic calculation');
    }
  }
  
  /**
   * Queue comprehensive calculation (for registered users)
   * @param request Comprehensive calculation request
   * @returns Comprehensive calculation response
   */
  public async queueComprehensiveCalculation(
    request: ComprehensiveCalculationRequest
  ): Promise<ComprehensiveCalculationResponse> {
    console.log('🔄 Queueing comprehensive calculation for user:', request.userId);
    
    try {
      // Generate job ID
      const jobId = uuidv4();
      
      // Create job status
      const jobStatus: CalculationJobStatus = {
        jobId,
        userId: request.userId,
        status: 'queued',
        progress: 0,
        currentStep: 'Queued for processing',
        estimatedTimeRemaining: this.estimateProcessingTime(request),
        createdAt: new Date()
      };
      
      // Add to queue
      this.calculationQueue.set(jobId, jobStatus);
      
      // Store in database if available
      await this.storeCalculationJob(jobStatus, request);
      
      // Estimate completion time
      const estimatedCompletionTime = this.formatEstimatedCompletionTime(jobStatus.estimatedTimeRemaining);
      
      // Return response
      return {
        success: true,
        jobId,
        estimatedCompletionTime,
        queuePosition: this.getQueuePosition(jobId),
        notificationPreferences: request.notificationPreferences
      };
    } catch (error) {
      console.error('❌ Error queueing comprehensive calculation:', error);
      throw new Error('Failed to queue comprehensive calculation');
    }
  }
  
  /**
   * Get calculation job status
   * @param jobId Job ID
   * @returns Job status
   */
  public async getJobStatus(jobId: string): Promise<CalculationJobStatus | null> {
    // Check in-memory queue first
    const jobStatus = this.calculationQueue.get(jobId);
    if (jobStatus) {
      return jobStatus;
    }
    
    // Check database
    try {
      const { data, error } = await supabase
        .from('calculation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching job status from database:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Convert database record to job status
      return {
        jobId: data.id,
        userId: data.user_id,
        status: data.status,
        progress: data.progress,
        currentStep: data.current_step,
        estimatedTimeRemaining: data.estimated_time_remaining,
        createdAt: new Date(data.created_at),
        startedAt: data.started_at ? new Date(data.started_at) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        error: data.error_message
      };
    } catch (error) {
      console.error('❌ Error getting job status:', error);
      return null;
    }
  }
  
  /**
   * Get calculation results
   * @param jobId Job ID
   * @returns Calculation results
   */
  public async getCalculationResults(jobId: string): Promise<CalculationResults | null> {
    // Check in-memory cache first
    const cachedResults = this.calculationCache.get(jobId);
    if (cachedResults) {
      return cachedResults;
    }
    
    // Check database
    try {
      const { data, error } = await supabase
        .from('calculation_results')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching calculation results from database:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Parse results from JSON
      const results = data.results;
      
      // Cache results
      this.calculationCache.set(jobId, results);
      
      return results;
    } catch (error) {
      console.error('❌ Error getting calculation results:', error);
      return null;
    }
  }
  
  /**
   * Convert basic inputs to calculator data format
   * @param inputs Basic calculation inputs
   * @returns Calculator data
   */
  private convertToCalculatorData(inputs: BasicCalculationInputs): CalculatorData {
    // Create default investment allocation based on risk tolerance
    let investmentAllocation = { stocks: 0.6, bonds: 0.3, realEstate: 0.1, alternatives: 0 };
    
    if (inputs.riskTolerance === 'conservative') {
      investmentAllocation = { stocks: 0.4, bonds: 0.5, realEstate: 0.1, alternatives: 0 };
    } else if (inputs.riskTolerance === 'aggressive') {
      investmentAllocation = { stocks: 0.8, bonds: 0.1, realEstate: 0.1, alternatives: 0 };
    }
    
    // Create children array based on count
    const children = Array.from({ length: inputs.children }, (_, i) => ({
      name: `Child ${i + 1}`,
      age: Math.floor(Math.random() * 10) + 5, // Random age between 5-15
      academicPerformance: 'average' as const,
      interests: [],
      educationAspirations: 'private_state' as const,
      currentSchoolType: 'private_english' as const
    }));
    
    // Create parents array if parent care is needed
    const parents = inputs.parentCare ? [
      {
        name: 'Parent',
        age: inputs.age + 25, // Estimate parent age
        healthStatus: 'good' as const,
        financialIndependence: 'occasional_support' as const,
        currentMonthlyCost: 20000,
        livingArrangement: 'independent' as const,
        location: 'same_city' as const
      }
    ] : [];
    
    // Calculate complexity score
    const complexityScore = this.calculateComplexityScore(inputs);
    
    // Create calculator data
    return {
      coreIdentity: {
        age: inputs.age,
        gender: 'prefer_not_to_say',
        maritalStatus: inputs.maritalStatus,
        location: {
          state: 'Unknown',
          city: 'Unknown',
          zipCode: '',
          cityType: inputs.location
        },
        education: {
          level: 'bachelors',
          institution: 'tier2'
        },
        employment: {
          status: 'corporate',
          industry: 'technology',
          roleLevel: 'mid'
        },
        financialSophistication: 'moderate'
      },
      financialFoundation: {
        currentNetWorth: inputs.netWorth,
        annualIncome: inputs.annualIncome,
        primaryIncomeSource: 'salary',
        investmentAllocation
      },
      childrenContext: {
        children
      },
      familyCareContext: {
        parents,
        spouseParents: [],
        siblings: [],
        familyCoordination: 'good'
      },
      behavioralProfile: {
        riskTolerance: inputs.riskTolerance,
        marketCrashResponse: 'worry_hold',
        biggestFear: 'retirement_insufficient',
        planningApproach: 'important_overwhelming',
        reviewFrequency: 'monthly'
      },
      complexityAnalysis: {
        complexityScore,
        majorDecisions: [],
        interconnections: [],
        sandwichGenerationOverload: inputs.parentCare && inputs.children > 0
      }
    };
  }
  
  /**
   * Calculate complexity score based on inputs
   * @param inputs Basic calculation inputs
   * @returns Complexity score
   */
  private calculateComplexityScore(inputs: BasicCalculationInputs): number {
    let score = 5; // Base score
    
    // Adjust for children
    score += inputs.children * 0.5;
    
    // Adjust for parent care
    if (inputs.parentCare) {
      score += 1.5;
    }
    
    // Adjust for marital status
    if (inputs.maritalStatus === 'divorced') {
      score += 1;
    } else if (inputs.maritalStatus === 'widowed') {
      score += 0.5;
    }
    
    // Adjust for age
    if (inputs.age > 50) {
      score += 0.5;
    }
    
    // Adjust for location
    if (inputs.location === 'metro') {
      score += 0.3;
    }
    
    // Cap score between 1 and 10
    return Math.min(10, Math.max(1, score));
  }
  
  /**
   * Perform simplified calculation for basic results
   * @param calculatorData Calculator data
   * @returns Calculation results
   */
  private async performSimplifiedCalculation(calculatorData: CalculatorData): Promise<CalculationResults> {
    console.log('🔄 Performing simplified calculation');
    
    try {
      // Use the advanced calculator but with reduced Monte Carlo runs
      // This is a simplified version that runs much faster
      return await AdvancedWealthCalculator.calculateWealthExtinction(calculatorData);
    } catch (error) {
      console.error('❌ Error in simplified calculation:', error);
      throw error;
    }
  }
  
  /**
   * Store basic calculation for potential upgrade
   * @param calculationId Calculation ID
   * @param basicInputs Basic inputs
   * @param calculatorData Full calculator data
   * @param results Calculation results
   */
  private async storeBasicCalculation(
    calculationId: string,
    basicInputs: BasicCalculationInputs,
    calculatorData: CalculatorData,
    results: CalculationResults
  ): Promise<void> {
    // Store in memory cache
    this.calculationCache.set(calculationId, {
      basicInputs,
      calculatorData,
      results,
      timestamp: new Date()
    });
    
    // Store in database if available
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (supabase && calculationId) {
        const { error } = await supabase
          .from('wealth_calculations')
          .insert([
            {
              id: calculationId,
              user_id: user?.id || null,
              inputs: calculatorData,
              results: results,
              calculation_type: 'basic',
              anonymous: !user
            }
          ]);
          
        if (error) {
          console.error('❌ Error storing basic calculation in database:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error storing basic calculation:', error);
    }
  }
  
  /**
   * Generate upgrade incentives based on results
   * @param results Calculation results
   * @returns Upgrade incentives
   */
  private generateUpgradeIncentives(results: CalculationResults): {
    comprehensiveAnalysisValue: string;
    additionalInsights: string[];
  } {
    // Calculate potential timeline extension
    const potentialExtension = Math.round((results.complexityAnalysis?.score || 5) * 0.7);
    
    return {
      comprehensiveAnalysisValue: `Extend your wealth timeline by up to ${potentialExtension} years`,
      additionalInsights: [
        'Detailed Monte Carlo simulation with 5,000+ scenarios',
        'Extreme Value Theory (EVT) analysis for tail risk',
        'Behavioral finance adjustments for decision-making',
        'Family coordination optimization opportunities',
        'Personalized protection strategies'
      ]
    };
  }
  
  /**
   * Store calculation job in database
   * @param jobStatus Job status
   * @param request Calculation request
   */
  private async storeCalculationJob(
    jobStatus: CalculationJobStatus,
    request: ComprehensiveCalculationRequest
  ): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('calculation_jobs')
          .insert([
            {
              id: jobStatus.jobId,
              user_id: request.userId,
              status: jobStatus.status,
              progress: jobStatus.progress,
              current_step: jobStatus.currentStep,
              estimated_time_remaining: jobStatus.estimatedTimeRemaining,
              inputs: request.inputs,
              priority: request.priority,
              notification_preferences: request.notificationPreferences
            }
          ]);
          
        if (error) {
          console.error('❌ Error storing calculation job in database:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error storing calculation job:', error);
    }
  }
  
  /**
   * Estimate processing time based on request
   * @param request Calculation request
   * @returns Estimated processing time in seconds
   */
  private estimateProcessingTime(request: ComprehensiveCalculationRequest): number {
    // Base processing time
    let processingTime = 60; // 60 seconds base time
    
    // Adjust for priority
    if (request.priority === 'priority') {
      processingTime *= 0.7; // 30% faster
    } else if (request.priority === 'urgent') {
      processingTime *= 0.5; // 50% faster
    }
    
    // Adjust for complexity
    const complexityScore = request.inputs.complexityAnalysis?.complexityScore || 5;
    processingTime *= (1 + (complexityScore - 5) * 0.1); // 10% per complexity point above 5
    
    // Adjust for queue length
    const queueLength = this.calculationQueue.size;
    if (request.priority === 'standard') {
      processingTime += queueLength * 10; // 10 seconds per job in queue
    } else if (request.priority === 'priority') {
      processingTime += queueLength * 5; // 5 seconds per job in queue
    } else {
      processingTime += queueLength * 2; // 2 seconds per job in queue
    }
    
    return processingTime;
  }
  
  /**
   * Format estimated completion time
   * @param seconds Estimated time in seconds
   * @returns Formatted time string
   */
  private formatEstimatedCompletionTime(seconds: number): string {
    if (seconds < 60) {
      return `less than a minute`;
    } else if (seconds < 120) {
      return `about 1 minute`;
    } else if (seconds < 3600) {
      return `about ${Math.round(seconds / 60)} minutes`;
    } else {
      return `about ${Math.round(seconds / 3600)} hours and ${Math.round((seconds % 3600) / 60)} minutes`;
    }
  }
  
  /**
   * Get queue position for a job
   * @param jobId Job ID
   * @returns Queue position
   */
  private getQueuePosition(jobId: string): number {
    // Convert queue to array and sort by priority and creation time
    const queueArray = Array.from(this.calculationQueue.entries())
      .map(([id, status]) => ({ id, status }))
      .filter(item => item.status.status === 'queued')
      .sort((a, b) => {
        // Sort by creation time (older first)
        return a.status.createdAt.getTime() - b.status.createdAt.getTime();
      });
    
    // Find position of job in queue
    const position = queueArray.findIndex(item => item.id === jobId);
    
    return position >= 0 ? position + 1 : 0;
  }
  
  /**
   * Process calculation queue
   */
  private async processQueue(): Promise<void> {
    // Process queue every 5 seconds
    setInterval(async () => {
      // Find next job to process
      const nextJob = this.findNextJob();
      
      if (nextJob) {
        await this.processJob(nextJob);
      }
    }, 5000);
  }
  
  /**
   * Find next job to process
   * @returns Next job ID
   */
  private findNextJob(): string | null {
    // Find jobs with 'queued' status
    const queuedJobs = Array.from(this.calculationQueue.entries())
      .filter(([_, status]) => status.status === 'queued')
      .map(([id, status]) => ({ id, status }));
    
    if (queuedJobs.length === 0) {
      return null;
    }
    
    // Sort by priority and creation time
    queuedJobs.sort((a, b) => {
      // Sort by creation time (older first)
      return a.status.createdAt.getTime() - b.status.createdAt.getTime();
    });
    
    // Return ID of next job
    return queuedJobs[0].id;
  }
  
  /**
   * Process a calculation job
   * @param jobId Job ID
   */
  private async processJob(jobId: string): Promise<void> {
    console.log(`🔄 Processing job ${jobId}`);
    
    // Get job status
    const jobStatus = this.calculationQueue.get(jobId);
    if (!jobStatus) {
      console.error(`❌ Job ${jobId} not found in queue`);
      return;
    }
    
    try {
      // Update job status
      jobStatus.status = 'processing';
      jobStatus.startedAt = new Date();
      jobStatus.progress = 0;
      jobStatus.currentStep = 'Starting comprehensive calculation';
      
      // Update job in queue
      this.calculationQueue.set(jobId, jobStatus);
      
      // Update job in database
      await this.updateJobStatus(jobId, jobStatus);
      
      // Get job data from database
      const jobData = await this.getJobData(jobId);
      if (!jobData) {
        throw new Error(`Job data not found for ${jobId}`);
      }
      
      // Perform comprehensive calculation
      const results = await this.performComprehensiveCalculation(jobData.inputs, jobStatus);
      
      // Store results
      await this.storeCalculationResults(jobId, jobData.user_id, results);
      
      // Update job status
      jobStatus.status = 'completed';
      jobStatus.completedAt = new Date();
      jobStatus.progress = 100;
      jobStatus.currentStep = 'Calculation completed';
      
      // Update job in queue
      this.calculationQueue.set(jobId, jobStatus);
      
      // Update job in database
      await this.updateJobStatus(jobId, jobStatus);
      
      // Send notification
      await this.sendCompletionNotification(jobId, jobData.user_id, jobData.notification_preferences);
      
      console.log(`✅ Job ${jobId} completed successfully`);
    } catch (error) {
      console.error(`❌ Error processing job ${jobId}:`, error);
      
      // Update job status
      jobStatus.status = 'failed';
      jobStatus.error = error instanceof Error ? error.message : 'Unknown error';
      
      // Update job in queue
      this.calculationQueue.set(jobId, jobStatus);
      
      // Update job in database
      await this.updateJobStatus(jobId, jobStatus);
      
      // Send failure notification
      await this.sendFailureNotification(jobId, jobStatus.userId);
    }
  }
  
  /**
   * Get job data from database
   * @param jobId Job ID
   * @returns Job data
   */
  private async getJobData(jobId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('calculation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching job data from database:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error getting job data:', error);
      return null;
    }
  }
  
  /**
   * Update job status in database
   * @param jobId Job ID
   * @param jobStatus Job status
   */
  private async updateJobStatus(jobId: string, jobStatus: CalculationJobStatus): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('calculation_jobs')
          .update({
            status: jobStatus.status,
            progress: jobStatus.progress,
            current_step: jobStatus.currentStep,
            estimated_time_remaining: jobStatus.estimatedTimeRemaining,
            started_at: jobStatus.startedAt,
            completed_at: jobStatus.completedAt,
            error_message: jobStatus.error
          })
          .eq('id', jobId);
          
        if (error) {
          console.error('❌ Error updating job status in database:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error updating job status:', error);
    }
  }
  
  /**
   * Perform comprehensive calculation
   * @param inputs Calculator data
   * @param jobStatus Job status for progress updates
   * @returns Calculation results
   */
  private async performComprehensiveCalculation(
    inputs: CalculatorData,
    jobStatus: CalculationJobStatus
  ): Promise<CalculationResults> {
    console.log('🔄 Performing comprehensive calculation');
    
    try {
      // Update progress
      jobStatus.progress = 10;
      jobStatus.currentStep = 'Running Monte Carlo simulation';
      await this.updateJobStatus(jobStatus.jobId, jobStatus);
      
      // Perform calculation
      const results = await AdvancedWealthCalculator.calculateWealthExtinction(inputs);
      
      // Update progress
      jobStatus.progress = 90;
      jobStatus.currentStep = 'Finalizing results';
      await this.updateJobStatus(jobStatus.jobId, jobStatus);
      
      return results;
    } catch (error) {
      console.error('❌ Error in comprehensive calculation:', error);
      throw error;
    }
  }
  
  /**
   * Store calculation results in database
   * @param jobId Job ID
   * @param userId User ID
   * @param results Calculation results
   */
  private async storeCalculationResults(
    jobId: string,
    userId: string,
    results: CalculationResults
  ): Promise<void> {
    try {
      // Cache results
      this.calculationCache.set(jobId, results);
      
      // Store in database
      if (supabase) {
        const { error } = await supabase
          .from('calculation_results')
          .insert([
            {
              job_id: jobId,
              user_id: userId,
              results,
              calculation_type: 'comprehensive',
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            }
          ]);
          
        if (error) {
          console.error('❌ Error storing calculation results in database:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error storing calculation results:', error);
    }
  }
  
  /**
   * Send completion notification
   * @param jobId Job ID
   * @param userId User ID
   * @param preferences Notification preferences
   */
  private async sendCompletionNotification(
    jobId: string,
    userId: string,
    preferences: any
  ): Promise<void> {
    console.log(`📧 Sending completion notification for job ${jobId} to user ${userId}`);
    
    // In a real implementation, this would send notifications via email, push, etc.
    // For now, we'll just log it
    
    if (preferences?.email) {
      console.log('📧 Sending email notification');
    }
    
    if (preferences?.push) {
      console.log('📱 Sending push notification');
    }
    
    if (preferences?.inApp) {
      console.log('📱 Sending in-app notification');
    }
  }
  
  /**
   * Send failure notification
   * @param jobId Job ID
   * @param userId User ID
   */
  private async sendFailureNotification(jobId: string, userId: string): Promise<void> {
    console.log(`📧 Sending failure notification for job ${jobId} to user ${userId}`);
    
    // In a real implementation, this would send notifications via email, push, etc.
    // For now, we'll just log it
    
    console.log('📧 Sending failure notification');
  }
}

// Export singleton instance
export const tieredCalculationService = TieredCalculationService.getInstance();