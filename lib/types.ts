import { z } from 'zod';

// Clinical Logic Collection Schema - Comprehensive Template
export const ClinicalLogicSchema = z.object({
  // Section 1: Disease Overview
  diseaseName: z.string().min(1, "Disease name is required"),
  commonName: z.string().optional(),
  diseaseType: z.enum(["Acute", "Chronic", "Recurrent", "Congenital"]),
  typicalOnsetAge: z.number().min(0).max(120),
  genderBias: z.enum(["Equal", "Male", "Female", "Context-dependent"]),
  urbanRuralBias: z.string().optional(),
  
  // Section 2: Disease Subtypes & Family History
  subtypes: z.array(z.string()).optional(),
  subtypeCriteria: z.array(z.string()).optional(),
  subtypeTreatment: z.array(z.string()).optional(),
  subtypeNotes: z.array(z.string()).optional(),
  geneticRiskFactors: z.array(z.string()).optional(),
  inheritancePatterns: z.array(z.string()).optional(),
  geneticInfluence: z.array(z.string()).optional(),
  familyHistoryRelevance: z.boolean(),
  
  // Section 3: Clinical Staging & Symptoms
  stages: z.array(z.object({
    description: z.string(),
    duration: z.string().optional(),
    triggers: z.string().optional(),
  })).min(1, "At least one stage is required"),
  
  stageSymptoms: z.array(z.object({
    major: z.string().optional(),
    hidden: z.string().optional(),
    prevalence: z.string().optional(),
  })).optional(),
  
  // Section 4: Comorbidities
  commonComorbidities: z.array(z.string()).optional(),
  comorbidityFrequency: z.array(z.string()).optional(),
  comorbidityOnset: z.array(z.string()).optional(),
  comorbidityComplicates: z.array(z.string()).optional(),
  
  // Section 5: Medication Protocol
  medicationProtocol: z.array(z.object({
    line: z.string().optional(),
    drug: z.string().optional(),
    dosage: z.string().optional(),
    trigger: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  
  // Section 6: Lifestyle Management
  lifestyleRecommendations: z.array(z.string()).optional(),
  lifestyleStages: z.array(z.string()).optional(),
  lifestyleNotes: z.array(z.string()).optional(),
  
  // Section 7: Pediatric vs Adult
  pediatricPresentation: z.string().optional(),
  adultPresentation: z.string().optional(),
  
  // Section 8: Emergency Conditions
  emergencyTriggers: z.array(z.string()).optional(),
  emergencyStages: z.array(z.string()).optional(),
  emergencyHospitalization: z.array(z.string()).optional(),
  emergencyActions: z.array(z.string()).optional(),
  
  // Section 9: Disease Progression
  progressionTimeline: z.array(z.object({
    duration: z.string().optional(),
    triggers: z.string().optional(),
  })).optional(),
  
  // Section 10: Lab Values
  labValues: z.array(z.object({
    name: z.string().optional(),
    range: z.string().optional(),
    critical: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  
  // Section 11: Monitoring
  monitoringProtocol: z.array(z.object({
    frequency: z.string().optional(),
    metrics: z.string().optional(),
  })).optional(),
  
  // Section 12: Regional Variations
  regionalVariations: z.object({
    urban: z.array(z.string()).optional(),
    rural: z.array(z.string()).optional(),
  }).optional(),
  
  // Section 13: Contraindications
  contraindications: z.array(z.string()).optional(),
  contraindicationConditions: z.array(z.string()).optional(),
  contraindicationNotes: z.array(z.string()).optional(),
  
  // Section 14: Misdiagnoses
  commonMisdiagnoses: z.array(z.string()).optional(),
  misdiagnosisDifferentiators: z.array(z.string()).optional(),
  misdiagnosisNotes: z.array(z.string()).optional(),
  
  // Section 15: Cultural & Additional Notes
  culturalAspects: z.string().optional(),
  socioeconomicBarriers: z.string().optional(),
  additionalObservations: z.string().optional(),
  
  // Section 16: Physician Information
  physicianName: z.string().min(1, "Physician name is required"),
  institution: z.string().min(1, "Institution is required"),
  specialty: z.string().min(1, "Specialty is required"),
  location: z.string().optional(),
  
  // Section 17: Consent
  consentGiven: z.boolean().refine(val => val === true, "Consent is required"),
  attributionConsent: z.boolean(),
  
  // Section 18: Metadata
  submissionDate: z.date(),
});

export type ClinicalLogic = z.infer<typeof ClinicalLogicSchema>;

// Dashboard Analytics Types
export interface DashboardAnalytics {
  totalSubmissions: number;
  averageOnsetAge: number;
  mostCommonComorbidities: Array<{ name: string; count: number }>;
  submissionLocations: {
    urban: number;
    rural: number;
  };
  diseaseTypeDistribution: Array<{ type: string; count: number }>;
}

// Contributor Type
export interface Contributor {
  id: string;
  name: string;
  institution: string;
  specialty: string;
  submissionCount: number;
  lastSubmission: Date;
  attributionConsent: boolean;
}

// AI Insights Type
export interface AIInsights {
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: string[];
  syntheticPatientProfile: {
    age: number;
    gender: string;
    symptoms: string[];
    comorbidities: string[];
    medications: string[];
  };
}

// Form Field Types for Dynamic Forms
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
}

// Stage Configuration
export interface DiseaseStage {
  name: string;
  description: string;
  duration: string;
  symptoms: string[];
  medications: string[];
  labValues: string[];
  monitoring: string[];
}

// Medication Protocol
export interface MedicationProtocol {
  stage: string;
  line: string;
  drug: string;
  dosage: string;
  trigger: string;
  notes: string;
}

// Emergency Condition
export interface EmergencyCondition {
  symptom: string;
  stage: string;
  hospitalization: boolean;
  action: string;
}

// Lab Value
export interface LabValue {
  name: string;
  range: string;
  critical: string;
  notes: string;
}

// Regional Variation
export interface RegionalVariation {
  factor: string;
  urban: string;
  rural: string;
} 