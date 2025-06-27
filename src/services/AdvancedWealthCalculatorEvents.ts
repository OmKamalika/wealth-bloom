// src/services/AdvancedWealthCalculatorEvents.ts
// Implementation of lifecycle events calculations for the advanced wealth calculation engine

import { CalculatorData } from '../types/calculator';

/**
 * Advanced Wealth Calculator Events Service
 * Implements sophisticated lifecycle event modeling with Indian family context
 */
export class AdvancedWealthCalculatorEvents {
  // Wedding cost ranges by city type (in INR)
  private static readonly WEDDING_COSTS: Record<string, { min: number; max: number }> = {
    'metro': { min: 1500000, max: 5000000 }, // ₹15L to ₹50L
    'tier2': { min: 800000, max: 2500000 }, // ₹8L to ₹25L
    'tier3': { min: 500000, max: 1500000 }, // ₹5L to ₹15L
    'rural': { min: 300000, max: 1000000 } // ₹3L to ₹10L
  };

  // Health emergency cost ranges by severity
  private static readonly HEALTH_EMERGENCY_COSTS: Record<string, { min: number; max: number }> = {
    'minor': { min: 50000, max: 200000 }, // ₹50k to ₹2L
    'moderate': { min: 200000, max: 800000 }, // ₹2L to ₹8L
    'major': { min: 800000, max: 3000000 }, // ₹8L to ₹30L
    'critical': { min: 3000000, max: 10000000 } // ₹30L to ₹1Cr
  };

  // Property inheritance ranges
  private static readonly INHERITANCE_RANGES: Record<string, { min: number; max: number }> = {
    'metro': { min: 2000000, max: 10000000 }, // ₹20L to ₹1Cr
    'tier2': { min: 1000000, max: 5000000 }, // ₹10L to ₹50L
    'tier3': { min: 500000, max: 2500000 }, // ₹5L to ₹25L
    'rural': { min: 200000, max: 1000000 } // ₹2L to ₹10L
  };

  // Career event probability and impact ranges
  private static readonly CAREER_EVENTS = {
    'promotion': { probability: 0.08, impactRange: { min: 0.1, max: 0.3 } },
    'job_change': { probability: 0.06, impactRange: { min: -0.2, max: 0.4 } },
    'layoff': { probability: 0.02, impactRange: { min: -0.5, max: -0.2 } },
    'business_expansion': { probability: 0.04, impactRange: { min: 0.2, max: 0.6 } }
  };

  /**
   * Calculate Indian lifecycle events with comprehensive modeling
   */
  static calculateIndianLifecycleEvents(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    // Calculate wedding expenses for children
    const weddingImpact = this.calculateWeddingExpenses(year, currentAge, inputs);
    netImpact += weddingImpact.netImpact;
    events.push(...weddingImpact.events);
    
    // Calculate health emergencies
    const healthImpact = this.calculateHealthEmergencies(year, currentAge, inputs);
    netImpact += healthImpact.netImpact;
    events.push(...healthImpact.events);
    
    // Calculate property inheritance
    const inheritanceImpact = this.calculatePropertyInheritance(year, currentAge, inputs);
    netImpact += inheritanceImpact.netImpact;
    events.push(...inheritanceImpact.events);
    
    // Calculate career events
    const careerImpact = this.calculateCareerEvents(year, currentAge, inputs);
    netImpact += careerImpact.netImpact;
    events.push(...careerImpact.events);
    
    // Calculate social and festival expenses
    const socialImpact = this.calculateSocialExpenses(year, currentAge, inputs);
    netImpact += socialImpact.netImpact;
    events.push(...socialImpact.events);
    
    // Calculate education milestones
    const educationImpact = this.calculateEducationMilestones(year, currentAge, inputs);
    netImpact += educationImpact.netImpact;
    events.push(...educationImpact.events);
    
    return { netImpact, events };
  }

  /**
   * Calculate wedding expenses for children
   */
  private static calculateWeddingExpenses(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    inputs.childrenContext.children.forEach(child => {
      const childAgeInYear = child.age + year;
      
      // Wedding probability increases from age 23 to 30, then decreases
      let weddingProbability = 0;
      if (childAgeInYear >= 23 && childAgeInYear <= 30) {
        weddingProbability = 0.15; // 15% annual probability during peak years
      } else if (childAgeInYear >= 31 && childAgeInYear <= 35) {
        weddingProbability = 0.08; // 8% probability in late 20s/early 30s
      }
      
      if (Math.random() < weddingProbability) {
        const cityType = inputs.coreIdentity.location.cityType;
        const costRange = this.WEDDING_COSTS[cityType] || this.WEDDING_COSTS.tier2;
        
        // Add some randomness to the cost
        const weddingCost = costRange.min + Math.random() * (costRange.max - costRange.min);
        
        netImpact -= weddingCost;
        events.push(`${child.name}'s wedding: ₹${(weddingCost/100000).toFixed(1)}L expense`);
      }
    });
    
    return { netImpact, events };
  }

  /**
   * Calculate health emergencies
   */
  private static calculateHealthEmergencies(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    // Health emergency probability increases with age
    const baseHealthEmergencyProb = Math.min(0.12, (currentAge - 35) * 0.008);
    
    // Adjust for family health history (simplified)
    let familyHealthMultiplier = 1.0;
    inputs.familyCareContext.parents.forEach(parent => {
      if (parent.healthStatus === 'poor') {
        familyHealthMultiplier *= 1.2; // 20% higher probability if parents have poor health
      }
    });
    
    const adjustedProbability = baseHealthEmergencyProb * familyHealthMultiplier;
    
    if (Math.random() < adjustedProbability) {
      // Determine severity based on age
      let severity: string;
      if (currentAge < 50) {
        severity = Math.random() < 0.7 ? 'minor' : 'moderate';
      } else if (currentAge < 65) {
        severity = Math.random() < 0.5 ? 'minor' : Math.random() < 0.8 ? 'moderate' : 'major';
      } else {
        severity = Math.random() < 0.3 ? 'minor' : Math.random() < 0.6 ? 'moderate' : Math.random() < 0.8 ? 'major' : 'critical';
      }
      
      const costRange = this.HEALTH_EMERGENCY_COSTS[severity];
      const emergencyCost = costRange.min + Math.random() * (costRange.max - costRange.min);
      
      netImpact -= emergencyCost;
      events.push(`${severity.charAt(0).toUpperCase() + severity.slice(1)} health emergency: ₹${(emergencyCost/100000).toFixed(1)}L cost`);
    }
    
    return { netImpact, events };
  }

  /**
   * Calculate property inheritance
   */
  private static calculatePropertyInheritance(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    // Inheritance probability increases with age and parent age
    inputs.familyCareContext.parents.forEach(parent => {
      const parentAgeInYear = parent.age + year;
      
      // Inheritance probability increases significantly after parent age 75
      let inheritanceProbability = 0;
      if (parentAgeInYear > 75) {
        inheritanceProbability = Math.min(0.08, (parentAgeInYear - 75) * 0.02);
      }
      
      if (Math.random() < inheritanceProbability) {
        const cityType = inputs.coreIdentity.location.cityType;
        const inheritanceRange = this.INHERITANCE_RANGES[cityType] || this.INHERITANCE_RANGES.tier2;
        
        const inheritanceValue = inheritanceRange.min + Math.random() * (inheritanceRange.max - inheritanceRange.min);
        
        netImpact += inheritanceValue;
        events.push(`Property inheritance from ${parent.name}: ₹${(inheritanceValue/100000).toFixed(1)}L received`);
      }
    });
    
    return { netImpact, events };
  }

  /**
   * Calculate career events
   */
  private static calculateCareerEvents(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    // Career events are more likely in early to mid-career
    if (currentAge < 55) {
      const baseIncome = inputs.financialFoundation.annualIncome;
      
      // Check for each career event type
      Object.entries(this.CAREER_EVENTS).forEach(([eventType, eventData]) => {
        if (Math.random() < eventData.probability) {
          const impactRange = eventData.impactRange;
          const impactFactor = impactRange.min + Math.random() * (impactRange.max - impactRange.min);
          const incomeImpact = baseIncome * impactFactor;
          
          netImpact += incomeImpact;
          
          const eventDescription = this.getCareerEventDescription(eventType, incomeImpact);
          events.push(eventDescription);
        }
      });
    }
    
    return { netImpact, events };
  }

  /**
   * Calculate social and festival expenses
   */
  private static calculateSocialExpenses(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    // Annual social expenses (festivals, ceremonies, gifts)
    const baseIncome = inputs.financialFoundation.annualIncome;
    const annualSocialCosts = baseIncome * 0.05; // 5% of income for social expenses
    
    // Adjust for city type (higher in metros due to higher expectations)
    const cityMultiplier = this.getCitySocialMultiplier(inputs.coreIdentity.location.cityType);
    const adjustedSocialCosts = annualSocialCosts * cityMultiplier;
    
    netImpact -= adjustedSocialCosts;
    events.push(`Annual social expenses: ₹${(adjustedSocialCosts/100000).toFixed(1)}L`);
    
    return { netImpact, events };
  }

  /**
   * Calculate education milestones
   */
  private static calculateEducationMilestones(
    year: number, 
    currentAge: number, 
    inputs: CalculatorData
  ): { netImpact: number; events: string[] } {
    const events: string[] = [];
    let netImpact = 0;
    
    inputs.childrenContext.children.forEach(child => {
      const childAgeInYear = child.age + year;
      
      // Special education milestones
      if (childAgeInYear === 18) {
        // College admission costs
        const admissionCost = 50000 + Math.random() * 100000; // ₹50k to ₹1.5L
        netImpact -= admissionCost;
        events.push(`${child.name}'s college admission: ₹${(admissionCost/100000).toFixed(1)}L`);
      }
      
      if (childAgeInYear === 22) {
        // Post-graduation or job search costs
        const postGradCost = 100000 + Math.random() * 200000; // ₹1L to ₹3L
        netImpact -= postGradCost;
        events.push(`${child.name}'s post-graduation: ₹${(postGradCost/100000).toFixed(1)}L`);
      }
    });
    
    return { netImpact, events };
  }

  /**
   * Get career event description
   */
  private static getCareerEventDescription(eventType: string, incomeImpact: number): string {
    const impactInLakhs = Math.abs(incomeImpact) / 100000;
    
    switch (eventType) {
      case 'promotion':
        return `Career promotion: ₹${impactInLakhs.toFixed(1)}L income boost`;
      case 'job_change':
        return incomeImpact > 0 ? 
          `Job change: ₹${impactInLakhs.toFixed(1)}L income increase` :
          `Job change: ₹${impactInLakhs.toFixed(1)}L income decrease`;
      case 'layoff':
        return `Job loss: ₹${impactInLakhs.toFixed(1)}L income loss`;
      case 'business_expansion':
        return `Business expansion: ₹${impactInLakhs.toFixed(1)}L income boost`;
      default:
        return `Career event: ₹${impactInLakhs.toFixed(1)}L impact`;
    }
  }

  /**
   * Get city social expense multiplier
   */
  private static getCitySocialMultiplier(cityType: string): number {
    switch (cityType) {
      case 'metro': return 1.4; // 40% higher in metros
      case 'tier2': return 1.1; // 10% higher in tier 2
      case 'tier3': return 0.9; // 10% lower in tier 3
      case 'rural': return 0.7; // 30% lower in rural
      default: return 1.0;
    }
  }

  /**
   * Calculate family coordination efficiency
   */
  static calculateIndianFamilyCoordination(siblings: any[]): number {
    if (siblings.length === 0) return 1.0;
    
    const avgQuality = siblings.reduce((sum, sib) => {
      const quality = sib.relationshipQuality === 'close' ? 1.0 : 
                     sib.relationshipQuality === 'good' ? 0.8 : 
                     sib.relationshipQuality === 'strained' ? 0.4 : 0.2;
      return sum + quality;
    }, 0) / siblings.length;
    
    return Math.max(0.3, avgQuality); // Minimum 30% coordination efficiency
  }

  /**
   * Calculate major life event probability based on age
   */
  static calculateMajorEventProbability(currentAge: number): number {
    // Major events are more likely in certain age ranges
    if (currentAge >= 25 && currentAge <= 35) {
      return 0.15; // High probability in early adulthood
    } else if (currentAge >= 45 && currentAge <= 55) {
      return 0.12; // High probability in mid-life
    } else if (currentAge >= 65 && currentAge <= 75) {
      return 0.10; // Moderate probability in retirement age
    } else {
      return 0.05; // Lower probability in other age ranges
    }
  }
} 