import { db } from './firebase-config';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Types for Comprehensive Parameter Validation
export interface DiseaseOverview {
  diseaseName: {
    clinical: string;
    common?: string;
    icd10Code?: string;
    icd11Code?: string;
  };
  diseaseType: {
    primary: 'acute' | 'chronic' | 'recurrent' | 'congenital';
    secondary?: string[];
    severity?: 'moderate' | 'severe';
  };
  demographics: {
    typicalAgeOfOnset: {
      min: number;
      max: number;
      unit: 'years' | 'months' | 'days';
      notes?: string;
    };
    genderPrevalence: {
      male: number;
      female: number;
      equal?: boolean;
      contextDependent?: boolean;
      notes?: string;
    };
  };
  ruralUrbanDifferences?: string;
}

export interface DiseaseSubtype {
  name: string;
  diagnosticCriteria: string;
  distinctTreatment: boolean;
  notes?: string;
}

export interface GeneticRiskFactor {
  riskFactor: string;
  inheritancePattern: string;
  influenceOnOnset: string;
  notes?: string;
}

export interface ClinicalStage {
  stageName: string;
  diagnosticCriteria: string;
  duration: string;
  transitionTriggers: string;
  notes?: string;
}

export interface SymptomsByStage {
  stage: string;
  majorSymptoms: string;
  earlySymptoms: string;
  symptomPrevalence: string;
  notes?: string;
}

export interface Comorbidity {
  comorbidity: string;
  frequency: string;
  onsetStage: string;
  complicatesTreatment: boolean;
  notes?: string;
}

export interface Medication {
  stage: string;
  lineOfTreatment: string;
  drugClass: string;
  standardDosage: string;
  triggerToStart: string;
  notes?: string;
}

export interface RedFlag {
  symptom: string;
  stage: string;
  hospitalizationRequired: boolean;
  criticalAction: string;
  notes?: string;
}

export interface ProgressionTimeline {
  stage: string;
  averageDuration: string;
  triggersForProgression: string;
  notes?: string;
}

export interface LifestyleManagement {
  interventionType: string;
  description: string;
  recommendedStages: string;
  notes?: string;
}

export interface PediatricVsAdult {
  pediatricPresentation: string;
  adultPresentation: string;
}

export interface LabValue {
  stage: string;
  labName: string;
  expectedRange: string;
  criticalValues: string;
  units: string;
  notes?: string;
}

export interface Contraindication {
  drugProcedure: string;
  contraindicatedIn: string;
  notes?: string;
}

export interface MonitoringRequirement {
  stage: string;
  followUpFrequency: string;
  keyMetrics: string;
  notes?: string;
}

export interface Misdiagnosis {
  oftenMisdiagnosedAs: string;
  keyDifferentiators: string;
  notes?: string;
}

export interface RegionalPractices {
  urbanDiagnosisMethods: string;
  ruralDiagnosisMethods: string;
  urbanMedicationUse: string;
  ruralMedicationUse: string;
  urbanPatientBehavior: string;
  ruralPatientBehavior: string;
}

export interface PhysicianConsent {
  physicianName?: string;
  institution?: string;
  consentForAcknowledgment: boolean;
  consentForResearch: boolean;
  submissionDate?: string;
}

export interface ValidationScores {
  overallScore: number;
  completenessScore: number;
  dataQualityScore: number;
  clinicalRelevanceScore: number;
  missingSections: string[];
  validationWarnings: string[];
  validationErrors: string[];
}

export interface AdvancedAnalytics {
  decisionModels: {
    modelType: string;
    confidence: number;
    factors: string[];
    recommendations: string[];
  }[];
  criticalPoints: {
    pointType: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionRequired: string;
  }[];
  riskFactors: {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  treatmentComplexity: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
}

export interface SearchIndex {
  diseaseName: string;
  diseaseType: string;
  keywords: string[];
  tags: string[];
  categories: string[];
  regions: string[];
  specialties: string[];
}

export interface VersionHistory {
  version: string;
  timestamp: Timestamp;
  changes: string[];
  modifiedBy: string;
}

export interface AccessControl {
  readAccess: string[];
  writeAccess: string[];
  adminAccess: string[];
}

export interface Metadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastModifiedBy: string;
  accessControl: AccessControl;
  versionHistory: VersionHistory[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'in-review' | 'approved' | 'rejected';
}

export interface ComprehensiveParameterValidation {
  // Auto-generated fields
  submissionId: string;
  collaboratorId: string;
  submittedAt: Timestamp;
  version: string;
  
  // Form metadata
  formType: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  
  // All 18 sections
  diseaseOverview: DiseaseOverview;
  diseaseSubtypes: DiseaseSubtype[];
  geneticRiskFactors: GeneticRiskFactor[];
  clinicalStages: ClinicalStage[];
  symptomsByStage: SymptomsByStage[];
  comorbidities: Comorbidity[];
  medications: Medication[];
  redFlags: RedFlag[];
  progressionTimeline: ProgressionTimeline[];
  lifestyleManagement: LifestyleManagement[];
  pediatricVsAdult: PediatricVsAdult;
  labValues: LabValue[];
  contraindications: Contraindication[];
  monitoringRequirements: MonitoringRequirement[];
  misdiagnoses: Misdiagnosis[];
  regionalPractices: RegionalPractices;
  additionalNotes?: string;
  physicianConsent: PhysicianConsent;
  
  // Auto-generated analytics
  validation: ValidationScores;
  advancedAnalytics: AdvancedAnalytics;
  metadata: Metadata;
  searchIndex: SearchIndex;
}

// Service functions
export class ComprehensiveParameterValidationService {
  private collectionName = 'comprehensiveParameterValidation';

  // Submit a new comprehensive parameter validation
  async submitComprehensiveValidation(
    data: Partial<ComprehensiveParameterValidation>,
    userId: string
  ): Promise<string> {
    try {
      // Generate auto-fields
      const submissionId = uuidv4();
      const now = Timestamp.now();
      
      // Calculate validation scores
      const validation = this.calculateValidationScores(data);
      
      // Generate advanced analytics
      const advancedAnalytics = this.generateAdvancedAnalytics(data);
      
      // Create search index
      const searchIndex = this.createSearchIndex(data);
      
      // Prepare submission data
      const submissionData: ComprehensiveParameterValidation = {
        submissionId,
        collaboratorId: userId,
        submittedAt: now,
        version: '1.0',
        formType: 'comprehensive-parameter-validation',
        status: 'draft',
        
        // Form data
        diseaseOverview: data.diseaseOverview!,
        diseaseSubtypes: data.diseaseSubtypes || [],
        geneticRiskFactors: data.geneticRiskFactors || [],
        clinicalStages: data.clinicalStages || [],
        symptomsByStage: data.symptomsByStage || [],
        comorbidities: data.comorbidities || [],
        medications: data.medications || [],
        redFlags: data.redFlags || [],
        progressionTimeline: data.progressionTimeline || [],
        lifestyleManagement: data.lifestyleManagement || [],
        pediatricVsAdult: data.pediatricVsAdult!,
        labValues: data.labValues || [],
        contraindications: data.contraindications || [],
        monitoringRequirements: data.monitoringRequirements || [],
        misdiagnoses: data.misdiagnoses || [],
        regionalPractices: data.regionalPractices!,
        additionalNotes: data.additionalNotes,
        physicianConsent: data.physicianConsent!,
        
        // Auto-generated analytics
        validation,
        advancedAnalytics,
        metadata: {
          createdAt: now,
          updatedAt: now,
          createdBy: userId,
          lastModifiedBy: userId,
          accessControl: {
            readAccess: [userId],
            writeAccess: [userId],
            adminAccess: []
          },
          versionHistory: [],
          tags: this.extractTags(data),
          priority: 'medium',
          status: 'draft'
        },
        searchIndex
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), submissionData);
      
      return submissionId;
    } catch (error) {
      console.error('Error submitting comprehensive validation:', error);
      throw error;
    }
  }

  // Get a submission by ID
  async getSubmission(submissionId: string): Promise<ComprehensiveParameterValidation | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('submissionId', '==', submissionId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return querySnapshot.docs[0].data() as ComprehensiveParameterValidation;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw error;
    }
  }

  // Get all submissions by user
  async getUserSubmissions(userId: string): Promise<ComprehensiveParameterValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('collaboratorId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as ComprehensiveParameterValidation);
    } catch (error) {
      console.error('Error getting user submissions:', error);
      throw error;
    }
  }

  // Get approved submissions
  async getApprovedSubmissions(limitCount: number = 50): Promise<ComprehensiveParameterValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'approved'),
        orderBy('validation.overallScore', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as ComprehensiveParameterValidation);
    } catch (error) {
      console.error('Error getting approved submissions:', error);
      throw error;
    }
  }

  // Search by disease type
  async getSubmissionsByDiseaseType(diseaseType: string): Promise<ComprehensiveParameterValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('diseaseOverview.diseaseType.primary', '==', diseaseType),
        where('status', '==', 'approved')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as ComprehensiveParameterValidation);
    } catch (error) {
      console.error('Error getting submissions by disease type:', error);
      throw error;
    }
  }

  // Search by keywords
  async searchByKeywords(keyword: string): Promise<ComprehensiveParameterValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('searchIndex.keywords', 'array-contains', keyword),
        where('status', '==', 'approved')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as ComprehensiveParameterValidation);
    } catch (error) {
      console.error('Error searching by keywords:', error);
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(submissionId: string, status: 'draft' | 'submitted' | 'approved' | 'rejected', userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('submissionId', '==', submissionId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Submission not found');
      }
      
      const docRef = doc(db, this.collectionName, querySnapshot.docs[0].id);
      
      await updateDoc(docRef, {
        status,
        'metadata.updatedAt': Timestamp.now(),
        'metadata.lastModifiedBy': userId
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  // Calculate validation scores
  private calculateValidationScores(data: Partial<ComprehensiveParameterValidation>): ValidationScores {
    const sections = [
      'diseaseOverview',
      'diseaseSubtypes',
      'geneticRiskFactors',
      'clinicalStages',
      'symptomsByStage',
      'comorbidities',
      'medications',
      'redFlags',
      'progressionTimeline',
      'lifestyleManagement',
      'pediatricVsAdult',
      'labValues',
      'contraindications',
      'monitoringRequirements',
      'misdiagnoses',
      'regionalPractices',
      'additionalNotes',
      'physicianConsent'
    ];

    let completedSections = 0;
    const missingSections: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    sections.forEach(section => {
      if (this.isSectionCompleted(data[section as keyof ComprehensiveParameterValidation])) {
        completedSections++;
      } else {
        missingSections.push(section);
      }
    });

    const completenessScore = Math.round((completedSections / sections.length) * 100);
    
    // Calculate data quality score based on required fields
    const dataQualityScore = this.calculateDataQualityScore(data);
    
    // Calculate clinical relevance score
    const clinicalRelevanceScore = this.calculateClinicalRelevanceScore(data);
    
    // Overall score is average of all scores
    const overallScore = Math.round((completenessScore + dataQualityScore + clinicalRelevanceScore) / 3);

    return {
      overallScore,
      completenessScore,
      dataQualityScore,
      clinicalRelevanceScore,
      missingSections,
      validationWarnings: warnings,
      validationErrors: errors
    };
  }

  // Check if a section is completed
  private isSectionCompleted(sectionData: any): boolean {
    if (!sectionData) return false;
    
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0 && sectionData.some(item => 
        Object.values(item).some(value => value && value !== '')
      );
    }
    
    if (typeof sectionData === 'object') {
      return Object.values(sectionData).some(value => 
        value && (typeof value === 'string' ? value !== '' : true)
      );
    }
    
    return false;
  }

  // Calculate data quality score
  private calculateDataQualityScore(data: Partial<ComprehensiveParameterValidation>): number {
    let score = 0;
    let totalChecks = 0;

    // Check required fields in disease overview
    if (data.diseaseOverview) {
      totalChecks += 4;
      if (data.diseaseOverview.diseaseName?.clinical) score++;
      if (data.diseaseOverview.diseaseType?.primary) score++;
      if (data.diseaseOverview.demographics?.typicalAgeOfOnset?.min) score++;
      if (data.diseaseOverview.demographics?.genderPrevalence?.male) score++;
    }

    // Check other sections have meaningful data
    const sections = ['diseaseSubtypes', 'genorbidities', 'medications', 'redFlags'];
    sections.forEach(section => {
      if (data[section as keyof ComprehensiveParameterValidation]) {
        totalChecks++;
        if (this.isSectionCompleted(data[section as keyof ComprehensiveParameterValidation])) {
          score++;
        }
      }
    });

    return totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 0;
  }

  // Calculate clinical relevance score
  private calculateClinicalRelevanceScore(data: Partial<ComprehensiveParameterValidation>): number {
    let score = 0;
    let totalChecks = 0;

    // Check for clinical indicators
    if (data.diseaseOverview?.diseaseName?.clinical) {
      totalChecks++;
      score++;
    }

    if (data.clinicalStages && data.clinicalStages.length > 0) {
      totalChecks++;
      score++;
    }

    if (data.symptomsByStage && data.symptomsByStage.length > 0) {
      totalChecks++;
      score++;
    }

    if (data.medications && data.medications.length > 0) {
      totalChecks++;
      score++;
    }

    if (data.redFlags && data.redFlags.length > 0) {
      totalChecks++;
      score++;
    }

    return totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 0;
  }

  // Generate advanced analytics
  private generateAdvancedAnalytics(data: Partial<ComprehensiveParameterValidation>): AdvancedAnalytics {
    const decisionModels = [
      {
        modelType: 'treatment-complexity',
        confidence: 0.85,
        factors: ['disease-type', 'comorbidities', 'medications'],
        recommendations: ['Consider specialist referral', 'Monitor closely']
      }
    ];

    const criticalPoints = [
      {
        pointType: 'red-flag',
        description: 'Critical symptoms requiring immediate attention',
        severity: 'high' as const,
        actionRequired: 'Immediate medical intervention'
      }
    ];

    const riskFactors = [
      {
        factor: 'Age-related complications',
        impact: 'medium' as const,
        mitigation: 'Regular monitoring and early intervention'
      }
    ];

    const treatmentComplexity = {
      score: 7,
      factors: ['Multiple medications', 'Comorbidities present'],
      recommendations: ['Specialist consultation recommended']
    };

    return {
      decisionModels,
      criticalPoints,
      riskFactors,
      treatmentComplexity
    };
  }

  // Create search index
  private createSearchIndex(data: Partial<ComprehensiveParameterValidation>): SearchIndex {
    const keywords: string[] = [];
    const tags: string[] = [];
    const categories: string[] = [];
    const regions: string[] = [];
    const specialties: string[] = [];

    // Extract keywords from disease name
    if (data.diseaseOverview?.diseaseName?.clinical) {
      keywords.push(...data.diseaseOverview.diseaseName.clinical.toLowerCase().split(' '));
    }

    // Extract disease type
    if (data.diseaseOverview?.diseaseType?.primary) {
      tags.push(data.diseaseOverview.diseaseType.primary);
      categories.push(data.diseaseOverview.diseaseType.primary);
    }

    // Extract from comorbidities
    if (data.comorbidities) {
      data.comorbidities.forEach(comorbidity => {
        if (comorbidity.comorbidity) {
          keywords.push(comorbidity.comorbidity.toLowerCase());
        }
      });
    }

    // Extract from medications
    if (data.medications) {
      data.medications.forEach(medication => {
        if (medication.drugClass) {
          keywords.push(medication.drugClass.toLowerCase());
        }
      });
    }

    return {
      diseaseName: data.diseaseOverview?.diseaseName?.clinical || '',
      diseaseType: data.diseaseOverview?.diseaseType?.primary || '',
      keywords: Array.from(new Set(keywords)),
      tags: Array.from(new Set(tags)),
      categories: Array.from(new Set(categories)),
      regions: Array.from(new Set(regions)),
      specialties: Array.from(new Set(specialties))
    };
  }

  // Extract tags from data
  private extractTags(data: Partial<ComprehensiveParameterValidation>): string[] {
    const tags: string[] = [];

    if (data.diseaseOverview?.diseaseType?.primary) {
      tags.push(data.diseaseOverview.diseaseType.primary);
    }

    if (data.diseaseOverview?.diseaseType?.secondary) {
      tags.push(...data.diseaseOverview.diseaseType.secondary);
    }

    return Array.from(new Set(tags));
  }
}

// Export singleton instance
export const comprehensiveParameterValidationService = new ComprehensiveParameterValidationService(); 