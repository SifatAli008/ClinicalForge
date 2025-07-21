# Enhanced Form Submissions Collection Design

## 📋 **Form Submissions Collection - Complete Structure**

**Collection ID**: `formSubmissions`

### **Document ID**: Use **Auto-ID**

### **Comprehensive Field Structure**

## **1. BASIC SUBMISSION INFORMATION**

```
Field: submissionId
Type: string
Value: [auto-generated UUID]

Field: collaboratorId
Type: string
Value: [collaborator's UID]

Field: formType
Type: string
Value: "parameter-validation" | "data-field-validation" | "advanced-analytics"

Field: diseaseId
Type: string
Value: [unique disease identifier]

Field: version
Type: string
Value: "1.0"

Field: submissionStatus
Type: string
Value: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published"

Field: reviewStatus
Type: string
Value: "pending" | "in_progress" | "completed" | "requires_revision"

Field: priority
Type: string
Value: "low" | "medium" | "high" | "critical"

Field: tags
Type: array
Value: ["cardiology", "acute", "pediatric", "rural"]
```

## **2. DISEASE OVERVIEW SECTION**

```
Field: diseaseOverview
Type: map
Value: {
  // Basic Disease Information
  diseaseName: {
    clinical: "string",
    common: "string",
    icd10Code: "string",
    icd11Code: "string"
  },
  
  // Classification
  diseaseType: {
    primary: "acute" | "chronic" | "recurrent" | "congenital",
    secondary: ["string"],
    severity: "mild" | "moderate" | "severe" | "critical"
  },
  
  // Demographics
  demographics: {
    typicalAgeOfOnset: {
      min: "number",
      max: "number",
      unit: "years" | "months" | "days",
      notes: "string"
    },
    genderPrevalence: {
      male: "number", // percentage
      female: "number", // percentage
      equal: "boolean",
      contextDependent: "boolean",
      notes: "string"
    },
    ruralUrbanDifferences: {
      ruralPrevalence: "number",
      urbanPrevalence: "number",
      factors: ["string"],
      notes: "string"
    },
    socioeconomicFactors: {
      incomeLevel: ["string"],
      educationLevel: ["string"],
      accessToCare: "string",
      notes: "string"
    }
  },
  
  // Epidemiology
  epidemiology: {
    globalPrevalence: "number",
    regionalVariations: {
      northAmerica: "number",
      europe: "number",
      asia: "number",
      africa: "number",
      southAmerica: "number",
      australia: "number"
    },
    seasonalPatterns: ["string"],
    outbreakHistory: ["string"]
  }
}
```

## **3. DISEASE SUBTYPES & CLASSIFICATIONS**

```
Field: diseaseSubtypes
Type: array
Value: [
  {
    subtypeId: "string",
    subtypeName: "string",
    icdCode: "string",
    
    // Diagnostic Criteria
    diagnosticCriteria: {
      clinicalSigns: ["string"],
      laboratoryTests: ["string"],
      imagingStudies: ["string"],
      geneticTests: ["string"],
      scoringSystems: ["string"]
    },
    
    // Distinct Features
    distinctFeatures: {
      uniqueSymptoms: ["string"],
      characteristicFindings: ["string"],
      differentialDiagnosis: ["string"]
    },
    
    // Treatment Differences
    treatmentDifferences: {
      distinctTreatment: "boolean",
      specificProtocols: ["string"],
      contraindications: ["string"],
      notes: "string"
    },
    
    // Prognosis
    prognosis: {
      survivalRate: "number",
      complicationRate: "number",
      recoveryTime: "string",
      notes: "string"
    }
  }
]
```

## **4. FAMILY HISTORY & GENETIC RISK**

```
Field: familyHistory
Type: map
Value: {
  // Genetic Risk Factors
  geneticRiskFactors: [
    {
      riskFactor: "string",
      inheritancePattern: "autosomal_dominant" | "autosomal_recessive" | "x_linked" | "polygenic" | "mitochondrial",
      penetrance: "number", // percentage
      influenceOnOnset: "early" | "delayed" | "moderate" | "severe",
      geneticTesting: {
        available: "boolean",
        testType: "string",
        accuracy: "number",
        cost: "number"
      },
      notes: "string"
    }
  ],
  
  // Family History Patterns
  familyHistoryPatterns: [
    {
      relationship: "string",
      condition: "string",
      ageOfOnset: "number",
      severity: "string",
      treatmentResponse: "string"
    }
  ],
  
  // Environmental Interactions
  environmentalInteractions: [
    {
      environmentalFactor: "string",
      geneticSusceptibility: "string",
      interactionType: "additive" | "multiplicative" | "protective",
      evidenceLevel: "strong" | "moderate" | "weak"
    }
  ]
}
```

## **5. CLINICAL STAGING**

```
Field: clinicalStaging
Type: map
Value: {
  // Staging System
  stagingSystem: {
    name: "string", // e.g., "TNM", "AJCC", "Custom"
    version: "string",
    description: "string"
  },
  
  // Stages
  stages: [
    {
      stageId: "string",
      stageName: "string", // e.g., "Stage 1", "Early", "Moderate"
      stageNumber: "number",
      
      // Diagnostic Criteria
      diagnosticCriteria: {
        clinicalSigns: ["string"],
        laboratoryValues: [
          {
            testName: "string",
            normalRange: "string",
            criticalValues: "string",
            units: "string"
          }
        ],
        imagingFindings: ["string"],
        functionalTests: ["string"],
        scoringCriteria: "string"
      },
      
      // Duration & Progression
      duration: {
        averageDuration: "string",
        range: {
          min: "string",
          max: "string"
        },
        unit: "weeks" | "months" | "years"
      },
      
      // Transition Triggers
      transitionTriggers: {
        clinicalTriggers: ["string"],
        laboratoryTriggers: ["string"],
        timeBasedTriggers: ["string"],
        treatmentTriggers: ["string"]
      },
      
      // Treatment Implications
      treatmentImplications: {
        recommendedInterventions: ["string"],
        contraindications: ["string"],
        monitoringRequirements: ["string"]
      },
      
      // Prognosis
      prognosis: {
        survivalRate: "number",
        qualityOfLife: "string",
        complicationRisk: "number",
        notes: "string"
      }
    }
  ]
}
```

## **6. SYMPTOMS BY STAGE**

```
Field: symptomsByStage
Type: map
Value: {
  // Symptom Classification
  symptomClassification: {
    primarySymptoms: ["string"],
    secondarySymptoms: ["string"],
    constitutionalSymptoms: ["string"],
    localSymptoms: ["string"]
  },
  
  // Symptoms by Stage
  stageSymptoms: [
    {
      stageId: "string",
      stageName: "string",
      
      // Major Symptoms
      majorSymptoms: [
        {
          symptom: "string",
          prevalence: "number", // percentage
          severity: "mild" | "moderate" | "severe",
          duration: "string",
          frequency: "constant" | "intermittent" | "episodic",
          triggers: ["string"],
          alleviatingFactors: ["string"]
        }
      ],
      
      // Early/Hidden Symptoms
      earlySymptoms: [
        {
          symptom: "string",
          subtlety: "very_subtle" | "subtle" | "moderate" | "obvious",
          detectionMethod: "clinical_exam" | "laboratory" | "imaging" | "patient_report",
          importance: "critical" | "important" | "minor",
          notes: "string"
        }
      ],
      
      // Symptom Patterns
      symptomPatterns: {
        temporalPattern: "string",
        seasonalVariation: "boolean",
        circadianRhythm: "string",
        stressResponse: "string"
      },
      
      // Quality of Life Impact
      qualityOfLifeImpact: {
        physicalFunction: "string",
        emotionalWellbeing: "string",
        socialFunction: "string",
        workProductivity: "string"
      }
    }
  ]
}
```

## **7. COMMON COMORBIDITIES**

```
Field: comorbidities
Type: map
Value: {
  // Comorbidity Classification
  comorbidityTypes: [
    {
      comorbidityId: "string",
      comorbidityName: "string",
      icdCode: "string",
      
      // Frequency & Timing
      frequency: {
        percentage: "number",
        confidenceInterval: {
          lower: "number",
          upper: "number"
        },
        studyReference: "string"
      },
      
      // Onset Patterns
      onsetPattern: {
        commonOnsetStage: "string",
        timing: "before" | "concurrent" | "after",
        triggerFactors: ["string"]
      },
      
      // Treatment Complications
      treatmentComplications: {
        complicatesTreatment: "boolean",
        specificComplications: ["string"],
        drugInteractions: ["string"],
        monitoringRequirements: ["string"]
      },
      
      // Management
      management: {
        screeningRecommendations: ["string"],
        preventiveMeasures: ["string"],
        treatmentModifications: ["string"],
        notes: "string"
      }
    }
  ],
  
  // Interaction Patterns
  interactionPatterns: [
    {
      comorbidityPair: "string",
      interactionType: "additive" | "synergistic" | "antagonistic",
      clinicalImplications: "string",
      managementStrategy: "string"
    }
  ]
}
```

## **8. MEDICATION PROTOCOL**

```
Field: medicationProtocol
Type: map
Value: {
  // Protocol Overview
  protocolOverview: {
    evidenceLevel: "A" | "B" | "C" | "D",
    guidelineSource: "string",
    lastUpdated: "timestamp",
    nextReviewDate: "timestamp"
  },
  
  // Treatment Lines
  treatmentLines: [
    {
      lineId: "string",
      lineNumber: "number", // 1st, 2nd, 3rd line
      stage: "string",
      
      // Medications
      medications: [
        {
          medicationId: "string",
          genericName: "string",
          brandName: "string",
          drugClass: "string",
          mechanismOfAction: "string",
          
          // Dosing
          dosing: {
            standardDosage: "string",
            dosageRange: {
              min: "string",
              max: "string"
            },
            frequency: "string",
            duration: "string",
            route: "oral" | "intravenous" | "intramuscular" | "subcutaneous" | "topical",
            adjustments: [
              {
                condition: "string",
                adjustment: "string",
                rationale: "string"
              }
            ]
          },
          
          // Indications & Contraindications
          indications: ["string"],
          contraindications: ["string"],
          warnings: ["string"],
          
          // Monitoring
          monitoring: {
            laboratoryTests: ["string"],
            frequency: "string",
            criticalValues: ["string"]
          },
          
          // Side Effects
          sideEffects: [
            {
              effect: "string",
              frequency: "number",
              severity: "mild" | "moderate" | "severe",
              management: "string"
            }
          ],
          
          // Cost & Availability
          cost: {
            averageCost: "number",
            currency: "string",
            insuranceCoverage: "string",
            availability: "string"
          }
        }
      ],
      
      // Combination Therapy
      combinationTherapy: {
        recommended: "boolean",
        combinations: ["string"],
        interactions: ["string"]
      },
      
      // Success Criteria
      successCriteria: {
        clinicalEndpoints: ["string"],
        surrogateMarkers: ["string"],
        timeToResponse: "string",
        responseRate: "number"
      }
    }
  ],
  
  // Treatment Triggers
  treatmentTriggers: [
    {
      trigger: "string",
      action: "start" | "stop" | "modify",
      criteria: "string",
      urgency: "immediate" | "urgent" | "routine"
    }
  ]
}
```

## **9. RED FLAGS & EMERGENCY CONDITIONS**

```
Field: redFlags
Type: map
Value: {
  // Emergency Classification
  emergencyLevels: [
    {
      level: "immediate" | "urgent" | "emergent",
      responseTime: "string",
      escalationPath: "string"
    }
  ],
  
  // Red Flag Symptoms
  redFlagSymptoms: [
    {
      symptomId: "string",
      symptom: "string",
      stageWhenAppears: "string",
      
      // Severity Assessment
      severity: {
        level: "mild" | "moderate" | "severe" | "critical",
        scoringSystem: "string",
        thresholdValues: ["string"]
      },
      
      // Hospitalization Requirements
      hospitalization: {
        required: "boolean",
        criteria: ["string"],
        urgency: "immediate" | "within_hours" | "within_days",
        facilityType: "emergency_room" | "icu" | "specialized_unit"
      },
      
      // Critical Actions
      criticalActions: [
        {
          action: "string",
          priority: "immediate" | "urgent" | "routine",
          responsibleParty: "string",
          timeFrame: "string"
        }
      ],
      
      // Differential Diagnosis
      differentialDiagnosis: ["string"],
      
      // Monitoring Requirements
      monitoring: {
        frequency: "string",
        parameters: ["string"],
        duration: "string"
      }
    }
  ],
  
  // Emergency Protocols
  emergencyProtocols: [
    {
      protocolId: "string",
      protocolName: "string",
      activationCriteria: ["string"],
      steps: ["string"],
      contactInformation: ["string"]
    }
  ]
}
```

## **10. DISEASE PROGRESSION TIMELINE**

```
Field: progressionTimeline
Type: map
Value: {
  // Timeline Overview
  timelineOverview: {
    totalDuration: "string",
    progressionPattern: "linear" | "exponential" | "plateau" | "variable",
    prognosticFactors: ["string"]
  },
  
  // Stage Progression
  stageProgression: [
    {
      fromStage: "string",
      toStage: "string",
      
      // Duration
      duration: {
        average: "string",
        range: {
          min: "string",
          max: "string"
        },
        unit: "weeks" | "months" | "years",
        variability: "low" | "moderate" | "high"
      },
      
      // Progression Triggers
      triggers: {
        clinicalTriggers: ["string"],
        laboratoryTriggers: ["string"],
        treatmentTriggers: ["string"],
        environmentalTriggers: ["string"]
      },
      
      // Risk Factors
      riskFactors: [
        {
          factor: "string",
          impact: "increases" | "decreases" | "no_effect",
          strength: "strong" | "moderate" | "weak",
          evidence: "string"
        }
      ],
      
      // Prevention Strategies
      preventionStrategies: ["string"],
      
      // Monitoring
      monitoring: {
        frequency: "string",
        parameters: ["string"],
        warningSigns: ["string"]
      }
    }
  ],
  
  // Prognostic Models
  prognosticModels: [
    {
      modelName: "string",
      variables: ["string"],
      accuracy: "number",
      validation: "string",
      clinicalUtility: "string"
    }
  ]
}
```

## **11. LIFESTYLE MANAGEMENT GUIDANCE**

```
Field: lifestyleManagement
Type: map
Value: {
  // Lifestyle Categories
  lifestyleCategories: [
    {
      category: "diet" | "exercise" | "stress_management" | "sleep" | "social_support" | "environmental",
      
      // Interventions
      interventions: [
        {
          interventionId: "string",
          interventionName: "string",
          description: "string",
          
          // Recommendations
          recommendations: [
            {
              stage: "string",
              recommendation: "string",
              frequency: "string",
              duration: "string",
              intensity: "string"
            }
          ],
          
          // Evidence
          evidence: {
            level: "A" | "B" | "C" | "D",
            studies: ["string"],
            clinicalTrials: ["string"]
          },
          
          // Implementation
          implementation: {
            difficulty: "easy" | "moderate" | "difficult",
            resources: ["string"],
            barriers: ["string"],
            facilitators: ["string"]
          },
          
          // Monitoring
          monitoring: {
            parameters: ["string"],
            frequency: "string",
            successIndicators: ["string"]
          },
          
          // Contraindications
          contraindications: ["string"],
          
          // Notes
          notes: "string"
        }
      ]
    }
  ],
  
  // Patient Education
  patientEducation: {
    materials: ["string"],
    deliveryMethods: ["string"],
    culturalConsiderations: ["string"],
    literacyLevel: "basic" | "intermediate" | "advanced"
  },
  
  // Support Systems
  supportSystems: [
    {
      type: "family" | "peer" | "professional" | "community",
      description: "string",
      availability: "string",
      effectiveness: "string"
    }
  ]
}
```

## **12. PEDIATRIC VS. ADULT PRESENTATION**

```
Field: pediatricVsAdult
Type: map
Value: {
  // Age Group Classifications
  ageGroups: [
    {
      ageGroup: "neonatal" | "infant" | "toddler" | "preschool" | "school_age" | "adolescent" | "young_adult" | "adult" | "elderly",
      ageRange: {
        min: "number",
        max: "number",
        unit: "years"
      },
      
      // Unique Features
      uniqueFeatures: {
        presentation: "string",
        symptoms: ["string"],
        physicalFindings: ["string"],
        laboratoryPatterns: ["string"]
      },
      
      // Developmental Considerations
      developmentalConsiderations: {
        cognitiveDevelopment: "string",
        emotionalDevelopment: "string",
        physicalDevelopment: "string",
        socialDevelopment: "string"
      },
      
      // Treatment Modifications
      treatmentModifications: {
        dosingAdjustments: ["string"],
        routeModifications: ["string"],
        monitoringChanges: ["string"],
        safetyConsiderations: ["string"]
      },
      
      // Communication
      communication: {
        approach: "string",
        languageLevel: "string",
        familyInvolvement: "string",
        culturalFactors: ["string"]
      }
    }
  ],
  
  // Transition Considerations
  transitionConsiderations: {
    pediatricToAdult: {
      age: "number",
      criteria: ["string"],
      process: "string",
      challenges: ["string"]
    }
  }
}
```

## **13. LAB VALUE RANGES BY STAGE**

```
Field: labValueRanges
Type: map
Value: {
  // Laboratory Tests
  laboratoryTests: [
    {
      testId: "string",
      testName: "string",
      category: "hematology" | "biochemistry" | "immunology" | "microbiology" | "molecular" | "imaging",
      
      // Normal Ranges by Stage
      stageRanges: [
        {
          stage: "string",
          normalRange: {
            min: "number",
            max: "number",
            unit: "string"
          },
          criticalValues: {
            low: "number",
            high: "number",
            unit: "string"
          },
          interpretation: "string",
          clinicalSignificance: "string"
        }
      ],
      
      // Testing Frequency
      testingFrequency: {
        baseline: "string",
        monitoring: "string",
        followUp: "string"
      },
      
      // Sample Requirements
      sampleRequirements: {
        type: "blood" | "urine" | "tissue" | "other",
        volume: "string",
        preparation: "string",
        stability: "string"
      },
      
      // Quality Control
      qualityControl: {
        accuracy: "number",
        precision: "number",
        referenceLaboratory: "string"
      }
    }
  ],
  
  // Biomarkers
  biomarkers: [
    {
      biomarkerId: "string",
      biomarkerName: "string",
      type: "diagnostic" | "prognostic" | "predictive" | "monitoring",
      
      // Performance
      performance: {
        sensitivity: "number",
        specificity: "number",
        positivePredictiveValue: "number",
        negativePredictiveValue: "number"
      },
      
      // Clinical Utility
      clinicalUtility: {
        diagnosticValue: "string",
        prognosticValue: "string",
        monitoringValue: "string"
      }
    }
  ]
}
```

## **14. CONTRAINDICATIONS & TREATMENT CONFLICTS**

```
Field: contraindications
Type: map
Value: {
  // Absolute Contraindications
  absoluteContraindications: [
    {
      contraindicationId: "string",
      drugProcedure: "string",
      contraindicatedIn: "string",
      
      // Risk Assessment
      riskAssessment: {
        severity: "critical" | "severe" | "moderate" | "mild",
        probability: "number",
        consequences: ["string"]
      },
      
      // Alternative Options
      alternatives: [
        {
          option: "string",
          efficacy: "string",
          safety: "string",
          availability: "string"
        }
      ],
      
      // Monitoring Requirements
      monitoring: {
        parameters: ["string"],
        frequency: "string",
        duration: "string"
      },
      
      // Documentation
      documentation: {
        evidence: "string",
        guidelines: ["string"],
        notes: "string"
      }
    }
  ],
  
  // Relative Contraindications
  relativeContraindications: [
    {
      contraindicationId: "string",
      drugProcedure: "string",
      contraindicatedIn: "string",
      
      // Risk-Benefit Analysis
      riskBenefitAnalysis: {
        risks: ["string"],
        benefits: ["string"],
        riskLevel: "low" | "moderate" | "high",
        recommendation: "avoid" | "use_with_caution" | "monitor_closely"
      },
      
      // Mitigation Strategies
      mitigationStrategies: ["string"],
      
      // Monitoring
      monitoring: {
        parameters: ["string"],
        frequency: "string",
        warningSigns: ["string"]
      }
    }
  ],
  
  // Drug Interactions
  drugInteractions: [
    {
      interactionId: "string",
      primaryDrug: "string",
      interactingDrug: "string",
      
      // Interaction Details
      interaction: {
        type: "pharmacokinetic" | "pharmacodynamic" | "both",
        mechanism: "string",
        severity: "major" | "moderate" | "minor",
        onset: "immediate" | "delayed",
        duration: "string"
      },
      
      // Clinical Effects
      clinicalEffects: {
        effects: ["string"],
        monitoring: ["string"],
        management: "string"
      },
      
      // Management
      management: {
        recommendation: "avoid" | "monitor" | "adjust_dose" | "separate_timing",
        alternative: "string",
        monitoring: ["string"]
      }
    }
  ]
}
```

## **15. MONITORING & FOLLOW-UP REQUIREMENTS**

```
Field: monitoringRequirements
Type: map
Value: {
  // Monitoring Framework
  monitoringFramework: {
    approach: "standardized" | "individualized" | "risk_based",
    frequency: "continuous" | "daily" | "weekly" | "monthly" | "quarterly" | "annually",
    duration: "string"
  },
  
  // Stage-Specific Monitoring
  stageMonitoring: [
    {
      stage: "string",
      
      // Clinical Monitoring
      clinicalMonitoring: {
        physicalExamination: {
          frequency: "string",
          components: ["string"],
          documentation: "string"
        },
        symptomAssessment: {
          tools: ["string"],
          frequency: "string",
          thresholds: ["string"]
        },
        functionalAssessment: {
          measures: ["string"],
          frequency: "string",
          interpretation: "string"
        }
      },
      
      // Laboratory Monitoring
      laboratoryMonitoring: {
        tests: [
          {
            testName: "string",
            frequency: "string",
            criticalValues: ["string"],
            interpretation: "string"
          }
        ],
        imaging: [
          {
            modality: "string",
            frequency: "string",
            indications: ["string"]
          }
        ]
      },
      
      // Treatment Monitoring
      treatmentMonitoring: {
        efficacy: {
          parameters: ["string"],
          frequency: "string",
          successCriteria: ["string"]
        },
        safety: {
          parameters: ["string"],
          frequency: "string",
          adverseEvents: ["string"]
        },
        adherence: {
          measures: ["string"],
          frequency: "string",
          interventions: ["string"]
        }
      }
    }
  ],
  
  // Follow-up Schedule
  followUpSchedule: [
    {
      visitNumber: "number",
      timing: "string",
      purpose: "string",
      components: ["string"],
      outcomes: ["string"]
    }
  ],
  
  // Quality Metrics
  qualityMetrics: {
    complianceRate: "number",
    outcomeMeasures: ["string"],
    patientSatisfaction: "string"
  }
}
```

## **16. COMMON MISDIAGNOSES / DIFFERENTIAL DIAGNOSES**

```
Field: misdiagnoses
Type: map
Value: {
  // Misdiagnosis Patterns
  misdiagnosisPatterns: [
    {
      misdiagnosisId: "string",
      oftenMisdiagnosedAs: "string",
      icdCode: "string",
      
      // Frequency
      frequency: {
        percentage: "number",
        studyReference: "string",
        confidenceInterval: {
          lower: "number",
          upper: "number"
        }
      },
      
      // Key Differentiators
      keyDifferentiators: [
        {
          feature: "string",
          primaryDisease: "string",
          misdiagnosis: "string",
          sensitivity: "number",
          specificity: "number"
        }
      ],
      
      // Diagnostic Tests
      diagnosticTests: [
        {
          testName: "string",
          purpose: "differentiation" | "confirmation" | "exclusion",
          accuracy: "number",
          availability: "string",
          cost: "number"
        }
      ],
      
      // Clinical Consequences
      clinicalConsequences: {
        treatmentDelay: "string",
        inappropriateTreatment: ["string"],
        patientHarm: "string",
        costImplications: "string"
      },
      
      // Prevention Strategies
      preventionStrategies: ["string"],
      
      // Notes
      notes: "string"
    }
  ],
  
  // Differential Diagnosis
  differentialDiagnosis: [
    {
      condition: "string",
      probability: "number",
      distinguishingFeatures: ["string"],
      confirmatoryTests: ["string"]
    }
  ]
}
```

## **17. REGIONAL PRACTICES & VARIATIONS**

```
Field: regionalPractices
Type: map
Value: {
  // Geographic Regions
  geographicRegions: [
    {
      region: "string",
      country: "string",
      
      // Diagnosis Methods
      diagnosisMethods: {
        urban: {
          approaches: ["string"],
          technologies: ["string"],
          protocols: ["string"],
          accessibility: "string"
        },
        rural: {
          approaches: ["string"],
          technologies: ["string"],
          protocols: ["string"],
          accessibility: "string"
        }
      },
      
      // Medication Use
      medicationUse: {
        urban: {
          availability: "string",
          affordability: "string",
          prescribingPatterns: ["string"],
          adherence: "string"
        },
        rural: {
          availability: "string",
          affordability: "string",
          prescribingPatterns: ["string"],
          adherence: "string"
        }
      },
      
      // Patient Behavior
      patientBehavior: {
        urban: {
          healthSeeking: "string",
          compliance: "string",
          culturalFactors: ["string"],
          socioeconomicFactors: ["string"]
        },
        rural: {
          healthSeeking: "string",
          compliance: "string",
          culturalFactors: ["string"],
          socioeconomicFactors: ["string"]
        }
      },
      
      // Healthcare Infrastructure
      healthcareInfrastructure: {
        facilities: ["string"],
        personnel: ["string"],
        equipment: ["string"],
        funding: "string"
      }
    }
  ],
  
  // Cultural Variations
  culturalVariations: [
    {
      culturalGroup: "string",
      beliefs: ["string"],
      practices: ["string"],
      communication: "string",
      decisionMaking: "string"
    }
  ],
  
  // Socioeconomic Factors
  socioeconomicFactors: [
    {
      factor: "string",
      impact: "positive" | "negative" | "neutral",
      interventions: ["string"],
      outcomes: ["string"]
    }
  ]
}
```

## **18. ADVANCED CLINICAL ANALYTICS**

```
Field: advancedAnalytics
Type: map
Value: {
  // Decision Models
  decisionModels: [
    {
      modelId: "string",
      model: "disease_classification" | "risk_stratification" | "treatment_optimization" | "emergency_detection" | "adherence_prediction" | "differential_diagnosis",
      sections: ["string"],
      dependencies: "string",
      clinicalImpact: "high" | "medium" | "low",
      isSufficient: "boolean",
      suggestions: "string",
      implementationReadiness: "ready" | "needs_improvement" | "not_ready"
    }
  ],
  
  // Critical Points
  criticalPoints: [
    {
      pointId: "string",
      section: "string",
      reason: "string",
      useCase: "string",
      dependencies: "string",
      isSufficient: "boolean",
      suggestions: "string",
      clinicalImpact: "high" | "medium" | "low"
    }
  ],
  
  // Conflict Zones
  conflictZones: [
    {
      conflictId: "string",
      sections: "string",
      conflict: "string",
      resolution: "string",
      isResolved: "boolean",
      suggestions: "string",
      impact: "high" | "medium" | "low"
    }
  ],
  
  // Feedback Loops
  feedbackLoops: [
    {
      loopId: "string",
      loop: "string",
      purpose: "string",
      isImplemented: "boolean",
      suggestions: "string",
      effectiveness: "high" | "medium" | "low"
    }
  ],
  
  // Section Validation
  sectionValidation: [
    {
      sectionId: "string",
      sectionName: "string",
      isSufficient: "boolean",
      suggestions: "string",
      clinicalImpact: "high" | "medium" | "low",
      dataQuality: "excellent" | "good" | "fair" | "poor",
      completeness: "number", // 0-100
      accuracy: "number", // 0-100
      relevance: "number" // 0-100
    }
  ],
  
  // Overall Assessment
  overallAssessment: {
    clinicalRelevance: "excellent" | "good" | "fair" | "poor",
    implementationReadiness: "ready" | "needs_improvement" | "not_ready",
    additionalSections: "string",
    overallFeedback: "string",
    qualityScore: "number", // 0-100
    confidenceLevel: "high" | "medium" | "low"
  }
}
```

## **19. VALIDATION & QUALITY ASSURANCE**

```
Field: validation
Type: map
Value: {
  // Validation Scores
  validationScores: {
    overall: "number", // 0-100
    completeness: "number", // 0-100
    accuracy: "number", // 0-100
    clinicalRelevance: "number", // 0-100
    consistency: "number", // 0-100
    evidenceBased: "number" // 0-100
  },
  
  // Quality Indicators
  qualityIndicators: {
    dataCompleteness: "number", // 0-100
    clinicalAccuracy: "number", // 0-100
    evidenceStrength: "number", // 0-100
    implementationFeasibility: "number", // 0-100
    costEffectiveness: "number" // 0-100
  },
  
  // Validation Checks
  validationChecks: [
    {
      checkId: "string",
      checkName: "string",
      status: "passed" | "failed" | "warning",
      details: "string",
      recommendations: ["string"]
    }
  ],
  
  // Peer Review
  peerReview: {
    reviewers: ["string"],
    reviewDate: "timestamp",
    comments: ["string"],
    approvalStatus: "approved" | "pending" | "rejected",
    revisionRequired: "boolean"
  }
}
```

## **20. METADATA & TRACKING**

```
Field: metadata
Type: map
Value: {
  // Creation Information
  creation: {
    createdAt: "timestamp",
    createdBy: "string",
    version: "string",
    source: "string"
  },
  
  // Modification History
  modifications: [
    {
      timestamp: "timestamp",
      modifiedBy: "string",
      changes: ["string"],
      reason: "string"
    }
  ],
  
  // Access Control
  accessControl: {
    owner: "string",
    collaborators: ["string"],
    permissions: {
      read: ["string"],
      write: ["string"],
      admin: ["string"]
    }
  },
  
  // Audit Trail
  auditTrail: [
    {
      timestamp: "timestamp",
      action: "string",
      user: "string",
      details: "string"
    }
  ],
  
  // Tags & Categories
  tags: ["string"],
  categories: ["string"],
  keywords: ["string"]
}
```

## **21. DATASET GENERATION FIELDS**

```
Field: datasetGeneration
Type: map
Value: {
  // Generation Status
  status: "pending" | "processing" | "completed" | "failed",
  
  // Inclusion Criteria
  inclusionCriteria: {
    validationScore: "number", // minimum score
    completeness: "number", // minimum completeness
    approvalStatus: "approved",
    dataQuality: "good" | "excellent"
  },
  
  // Processing Information
  processing: {
    processedAt: "timestamp",
    processingVersion: "string",
    algorithms: ["string"],
    transformations: ["string"]
  },
  
  // Output Configuration
  output: {
    format: "json" | "csv" | "excel" | "xml",
    structure: "string",
    fields: ["string"],
    aggregations: ["string"]
  },
  
  // Quality Metrics
  qualityMetrics: {
    dataQualityScore: "number",
    completenessScore: "number",
    consistencyScore: "number",
    accuracyScore: "number"
  }
}
```

## **22. TIMESTAMPS & STATUS TRACKING**

```
Field: timestamps
Type: map
Value: {
  createdAt: "timestamp",
  updatedAt: "timestamp",
  submittedAt: "timestamp",
  reviewedAt: "timestamp",
  approvedAt: "timestamp",
  publishedAt: "timestamp",
  lastModified: "timestamp"
}

Field: statusHistory
Type: array
Value: [
  {
    status: "string",
    timestamp: "timestamp",
    changedBy: "string",
    reason: "string",
    notes: "string"
  }
]
```

## **📊 INDEXES FOR FORM SUBMISSIONS**

### **Primary Indexes**
```javascript
// Query by collaborator and form type
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "collaboratorId", order: "ASCENDING" },
    { fieldPath: "formType", order: "ASCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" }
  ]
}

// Query by submission status and date
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "submissionStatus", order: "ASCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}

// Query by validation score
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "validation.validationScores.overall", order: "DESCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}

// Query by disease type and submission date
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "diseaseOverview.diseaseType.primary", order: "ASCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}

// Query by priority and status
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "priority", order: "ASCENDING" },
    { fieldPath: "submissionStatus", order: "ASCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" }
  ]
}
```

### **Advanced Analytics Indexes**
```javascript
// Query by clinical relevance
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "advancedAnalytics.overallAssessment.clinicalRelevance", order: "DESCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}

// Query by implementation readiness
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "advancedAnalytics.overallAssessment.implementationReadiness", order: "ASCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}

// Query by data quality score
{
  collectionId: "formSubmissions",
  fields: [
    { fieldPath: "validation.qualityIndicators.dataCompleteness", order: "DESCENDING" },
    { fieldPath: "submittedAt", order: "DESCENDING" },
    { fieldPath: "_name_", order: "DESCENDING" }
  ]
}
```

This comprehensive structure supports:
- **Multiple diseases per doctor**
- **Advanced clinical analytics**
- **Automatic dataset generation**
- **Quality assurance**
- **Peer review process**
- **Regional variations**
- **Evidence-based medicine**
- **Research publication readiness**

The structure is designed to capture all aspects of clinical knowledge while maintaining data integrity and supporting automated dataset compilation for research purposes. 