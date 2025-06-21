// Analytics and Emotional Tracking System

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface EmotionalMetrics {
  shockIntensity: number; // 0-100 scale
  engagementDepth: number; // 0-100 scale
  conversionProbability: number; // 0-100 scale
  emotionalPeak: boolean;
}

class AnalyticsEngine {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private startTime: number;
  private emotionalMetrics: EmotionalMetrics;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.emotionalMetrics = {
      shockIntensity: 0,
      engagementDepth: 0,
      conversionProbability: 0,
      emotionalPeak: false
    };
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        hidden: document.hidden,
        timeOnPage: Date.now() - this.startTime
      });
    });

    // Track scroll behavior
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.updateEngagementDepth(scrollPercent);
      }
    });

    // Track mouse movement patterns
    let mouseMovements = 0;
    document.addEventListener('mousemove', () => {
      mouseMovements++;
      if (mouseMovements % 100 === 0) { // Sample every 100 movements
        this.updateEngagementDepth(Math.min(mouseMovements / 10, 100));
      }
    });
  }

  // Core tracking method
  track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timeOnPage: Date.now() - this.startTime,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    this.processEmotionalSignals(event, properties);
    this.sendToAnalytics(analyticsEvent);
  }

  // Emotional analytics processing
  private processEmotionalSignals(event: string, properties: Record<string, any>) {
    switch (event) {
      case 'extinction_year_revealed':
        this.emotionalMetrics.shockIntensity = Math.max(
          this.emotionalMetrics.shockIntensity,
          this.calculateShockIntensity(properties.extinctionYear, properties.currentAge)
        );
        break;

      case 'timeline_hover':
        this.emotionalMetrics.engagementDepth += 5;
        break;

      case 'animation_replay':
        this.emotionalMetrics.shockIntensity += 10;
        this.emotionalMetrics.engagementDepth += 15;
        break;

      case 'social_share_initiated':
        this.emotionalMetrics.emotionalPeak = true;
        this.emotionalMetrics.conversionProbability += 30;
        break;

      case 'email_input_focus':
        this.emotionalMetrics.conversionProbability += 20;
        break;

      case 'back_button_clicked':
        this.emotionalMetrics.shockIntensity -= 5;
        break;
    }

    // Cap metrics at 100
    Object.keys(this.emotionalMetrics).forEach(key => {
      if (typeof this.emotionalMetrics[key as keyof EmotionalMetrics] === 'number') {
        this.emotionalMetrics[key as keyof EmotionalMetrics] = Math.min(
          this.emotionalMetrics[key as keyof EmotionalMetrics] as number,
          100
        );
      }
    });
  }

  private calculateShockIntensity(extinctionYear: number, currentAge: number): number {
    const yearsRemaining = extinctionYear - 2025;
    const ageAtExtinction = currentAge + yearsRemaining;
    
    // Higher shock for earlier extinction and younger current age
    let intensity = 0;
    
    if (yearsRemaining < 20) intensity += 40;
    else if (yearsRemaining < 40) intensity += 25;
    else if (yearsRemaining < 60) intensity += 15;
    
    if (currentAge < 35) intensity += 20;
    else if (currentAge < 50) intensity += 15;
    
    if (ageAtExtinction < 70) intensity += 25;
    
    return Math.min(intensity, 100);
  }

  private updateEngagementDepth(value: number) {
    this.emotionalMetrics.engagementDepth = Math.max(
      this.emotionalMetrics.engagementDepth,
      value
    );
  }

  // Send to external analytics services
  private sendToAnalytics(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.event, {
        custom_parameter: JSON.stringify(event.properties),
        session_id: this.sessionId
      });
    }

    // Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event.event, {
        ...event.properties,
        emotional_metrics: this.emotionalMetrics
      });
    }

    // Custom analytics endpoint
    this.sendToCustomAnalytics(event);
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          emotionalMetrics: this.emotionalMetrics
        })
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Calculator-specific tracking methods
  trackCalculatorStart(inputs: any) {
    this.track('calculator_started', {
      age: inputs.age,
      marital_status: inputs.maritalStatus,
      children_count: inputs.children,
      net_worth_range: this.getWealthRange(inputs.netWorth),
      main_concern: inputs.mainConcern
    });
  }

  trackCalculatorComplete(inputs: any, results: any) {
    this.track('calculator_completed', {
      extinction_year: results.extinctionYear,
      years_remaining: results.yearsRemaining,
      children_inheritance: results.childrenInheritance,
      completion_time: Date.now() - this.startTime
    });

    this.track('extinction_year_revealed', {
      extinctionYear: results.extinctionYear,
      currentAge: inputs.age,
      shockLevel: this.emotionalMetrics.shockIntensity
    });
  }

  trackEmailCapture(email: string, source: string) {
    this.track('email_captured', {
      email_domain: email.split('@')[1],
      source,
      emotional_state: this.emotionalMetrics,
      time_to_conversion: Date.now() - this.startTime
    });
  }

  trackSocialShare(platform: string, calculatorData: any) {
    this.track('social_share_initiated', {
      platform,
      extinction_year: calculatorData.results.extinctionYear,
      emotional_peak: this.emotionalMetrics.emotionalPeak
    });
  }

  trackViralCoefficient(referrer: string) {
    this.track('viral_referral', {
      referrer,
      source: 'shared_link'
    });
  }

  // A/B Testing support
  trackExperiment(experimentName: string, variant: string) {
    this.track('experiment_exposure', {
      experiment: experimentName,
      variant,
      session_id: this.sessionId
    });
  }

  // Performance monitoring
  trackPerformance(metric: string, value: number, context?: any) {
    this.track('performance_metric', {
      metric,
      value,
      context,
      user_agent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType
    });
  }

  // Get current emotional state
  getEmotionalMetrics(): EmotionalMetrics {
    return { ...this.emotionalMetrics };
  }

  // Get conversion probability in real-time
  getConversionProbability(): number {
    return this.emotionalMetrics.conversionProbability;
  }

  private getWealthRange(netWorth: number): string {
    if (netWorth < 100000) return 'under_100k';
    if (netWorth < 250000) return '100k_250k';
    if (netWorth < 500000) return '250k_500k';
    if (netWorth < 1000000) return '500k_1m';
    if (netWorth < 2000000) return '1m_2m';
    return 'over_2m';
  }
}

// Global analytics instance
export const analytics = new AnalyticsEngine();

// Convenience functions for common tracking
export const trackCalculatorStart = (inputs: any) => analytics.trackCalculatorStart(inputs);
export const trackCalculatorComplete = (inputs: any, results: any) => analytics.trackCalculatorComplete(inputs, results);
export const trackEmailCapture = (email: string, source: string) => analytics.trackEmailCapture(email, source);
export const trackSocialShare = (platform: string, data: any) => analytics.trackSocialShare(platform, data);
export const trackPerformance = (metric: string, value: number, context?: any) => analytics.trackPerformance(metric, value, context);