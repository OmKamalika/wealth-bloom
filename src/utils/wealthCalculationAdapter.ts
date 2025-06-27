// src/utils/wealthCalculationAdapter.ts
// Adapter to bridge between existing calculation inputs and the advanced wealth calculation engine

import { CalculationInputs } from './wealthCalculations';
import { CalculatorData } from '../types/calculator';

/**
 * Converts the existing CalculationInputs format to the new CalculatorData format
 * required by the advanced wealth calculation engine
 */
export function adaptToAdvancedEngine(inputs: CalculationInputs): CalculatorData {
  return {
    coreIdentity: {
      age: inputs.userProfile.age,
      gender: 'prefer_not_to_say', // Default as this isn't in old model
      maritalStatus: inputs.userProfile.maritalStatus,
      location: {
        state: inputs.userProfile.location.state,
        city: '', // Not available in old model
        zipCode: inputs.userProfile.location.zipCode,
        cityType: determineCityType(inputs.userProfile.location.zipCode)
      },
      education: {
        level: 'masters', // Default value
        institution: 'tier2' // Default value
      },
      employment: {
        status: 'corporate', // Default value
        industry: 'technology', // Default value
        roleLevel: 'mid' // Default value
      },
      financialSophistication: 'moderate' // Default value
    },
    financialFoundation: {
      currentNetWorth: inputs.financialProfile.netWorth,
      annualIncome: inputs.financialProfile.income,
      primaryIncomeSource: 'salary', // Default value
      investmentAllocation: {
        stocks: 60, // Default values based on risk tolerance
        bonds: 30,
        realEstate: 10,
        alternatives: 0
      }
    },
    childrenContext: {
      children: inputs.familyStructure.children.map(child => ({
        name: child.name,
        age: child.age,
        academicPerformance: mapAcademicPerformance(child.academicPerformance),
        interests: [], // Not available in old model
        educationAspirations: mapEducationPath(child.educationPath),
        currentSchoolType: 'private_english' // Default value
      }))
    },
    familyCareContext: {
      parents: inputs.familyStructure.parents.map(parent => ({
        name: parent.financialStatus, // Using this field as name isn't available
        age: parent.age,
        healthStatus: mapHealthStatus(parent.healthStatus),
        financialIndependence: mapFinancialStatus(parent.financialStatus),
        currentMonthlyCost: estimateParentCareCost(parent),
        livingArrangement: 'independent', // Default value
        location: parent.location
      })),
      spouseParents: [], // Not available in old model
      siblings: inputs.familyStructure.siblings.map(sibling => ({
        relationshipQuality: mapRelationshipQuality(sibling.relationshipQuality),
        financialCapacity: mapFinancialCapacity(sibling.financialCapacity),
        careInvolvement: mapCareWillingness(sibling.careWillingness)
      })),
      familyCoordination: 'good' // Default value
    },
    behavioralProfile: {
      riskTolerance: inputs.financialProfile.riskTolerance,
      marketCrashResponse: 'worry_hold', // Default value
      biggestFear: 'burden_children', // Default value
      planningApproach: 'important_overwhelming', // Default value
      reviewFrequency: 'monthly' // Default value
    },
    complexityAnalysis: {
      complexityScore: inputs.complexityScore,
      majorDecisions: [], // Not available in old model
      interconnections: [], // Not available in old model
      sandwichGenerationOverload: isSandwichGeneration(inputs)
    },
    currentStep: 1,
    email: '',
    phoneNumber: ''
  };
}

/**
 * Converts the results from the advanced engine back to the format
 * expected by the existing application
 */
export function adaptAdvancedResults(advancedResults: any): any {
  return {
    extinctionYear: advancedResults.extinctionYear,
    yearsRemaining: advancedResults.yearsRemaining,
    currentWealth: advancedResults.currentWealth,
    childrenInheritance: advancedResults.childrenInheritance,
    grandchildrenInheritance: advancedResults.grandchildrenInheritance,
    projections: advancedResults.projections,
    topWealthDestroyers: advancedResults.topWealthDestroyers.map(destroyer => ({
      factor: destroyer.factor,
      impact: destroyer.impact,
      description: destroyer.description
    })),
    familyImpact: {
      today: advancedResults.familyImpact.today,
      inheritance: {
        year: advancedResults.familyImpact.inheritance.year,
        children: advancedResults.familyImpact.inheritance.children.map(child => ({
          name: child.name,
          inheritance: child.inheritance
        }))
      },
      grandchildren: advancedResults.familyImpact.grandchildren
    },
    protectedScenario: {
      extinctionYear: advancedResults.protectedScenario.extinctionYear,
      additionalYears: advancedResults.protectedScenario.additionalYears,
      grandchildrenInheritance: advancedResults.protectedScenario.grandchildrenInheritance,
      improvements: advancedResults.protectedScenario.improvements.map(improvement => improvement.action)
    },
    complexityAnalysis: {
      score: advancedResults.complexityAnalysis.score,
      primaryComplexityDrivers: advancedResults.complexityAnalysis.primaryComplexityDrivers,
      coordinationOpportunities: advancedResults.complexityAnalysis.coordinationOpportunities.map(
        opportunity => opportunity.opportunity
      ),
      optimizationPotential: advancedResults.complexityAnalysis.optimizationPotential
    },
    scenarioAnalysis: {
      bestCase: {
        extinctionYear: advancedResults.scenarioAnalysis.bestCase.extinctionYear,
        probability: advancedResults.scenarioAnalysis.bestCase.probability
      },
      mostLikely: {
        extinctionYear: advancedResults.scenarioAnalysis.mostLikely.extinctionYear,
        probability: advancedResults.scenarioAnalysis.mostLikely.probability
      },
      worstCase: {
        extinctionYear: advancedResults.scenarioAnalysis.worstCase.extinctionYear,
        probability: advancedResults.scenarioAnalysis.worstCase.probability
      }
    }
  };
}

// Helper functions for mapping between data formats
function determineCityType(zipCode: string): 'metro' | 'tier2' | 'tier3' | 'rural' {
  // Logic to determine city type based on zip code
  // This is a simplified implementation
  const firstDigit = parseInt(zipCode.charAt(0));
  
  if (firstDigit >= 1 && firstDigit <= 2) return 'metro';
  if (firstDigit >= 3 && firstDigit <= 5) return 'tier2';
  if (firstDigit >= 6 && firstDigit <= 8) return 'tier3';
  return 'rural';
}

function mapAcademicPerformance(performance: string): 'struggling' | 'average' | 'above_average' | 'exceptional' {
  switch (performance) {
    case 'exceptional': return 'exceptional';
    case 'struggling': return 'struggling';
    default: return 'average';
  }
}

function mapEducationPath(path: string): 'public_state' | 'public_premium' | 'private_state' | 'private_premium' | 'international' {
  switch (path) {
    case 'private_state': return 'private_state';
    case 'elite_private': return 'private_premium';
    case 'international': return 'international';
    default: return 'public_state';
  }
}

function mapHealthStatus(status: string): 'excellent' | 'good' | 'fair' | 'poor' {
  switch (status) {
    case 'excellent': return 'excellent';
    case 'good': return 'good';
    case 'fair': return 'fair';
    case 'declining': return 'poor';
    case 'serious': return 'poor';
    default: return 'good';
  }
}

function mapFinancialStatus(status: string): 'independent' | 'occasional_support' | 'regular_support' | 'full_dependency' {
  switch (status) {
    case 'independent': return 'independent';
    case 'some_support': return 'occasional_support';
    case 'regular_support': return 'regular_support';
    case 'dependent': return 'full_dependency';
    default: return 'independent';
  }
}

function mapRelationshipQuality(quality: string): 'close' | 'good' | 'strained' | 'non_communicative' {
  return quality as 'close' | 'good' | 'strained' | 'non_communicative';
}

function mapFinancialCapacity(capacity: string): 'strong' | 'moderate' | 'limited' {
  return capacity as 'strong' | 'moderate' | 'limited';
}

function mapCareWillingness(willingness: string): 'high' | 'moderate' | 'low' {
  switch (willingness) {
    case 'high': return 'high';
    case 'moderate': return 'moderate';
    case 'low': return 'low';
    default: return 'moderate';
  }
}

function estimateParentCareCost(parent: any): number {
  // Simplified estimation based on health status
  switch (parent.healthStatus) {
    case 'excellent': return 5000;
    case 'good': return 15000;
    case 'fair': return 30000;
    case 'declining': return 50000;
    case 'serious': return 80000;
    default: return 20000;
  }
}

function isSandwichGeneration(inputs: CalculationInputs): boolean {
  // Check if person has both children and parents to care for
  return inputs.familyStructure.children.length > 0 && 
         inputs.familyStructure.parents.some(p => p.healthStatus !== 'excellent');
}
