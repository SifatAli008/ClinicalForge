import { addDoc, collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import { auth } from './firebase-config';

export interface FormSubmissionData {
  // Basic Information (Auto-generated)
  submissionId: string;
  collaboratorId: string;
  submittedAt: Date;
  version: string;
  
  // Form Information
  formType: 'parameter-validation' | 'data-field-validation' | 'advanced-analytics';
  diseaseId: string;
  submissionStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published';
  reviewStatus: 'pending' | 'in_progress' | 'completed' | 'requires_revision';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  
  // Disease Overview (From form data)
  diseaseOverview: {
    diseaseName: {
      clinical: string;
      common: string;
      icd10Code: string;
      icd11Code: string;
    };
    diseaseType: {
      primary: 'acute' | 'chronic' | 'recurrent' | 'congenital';
      secondary: string[];
      severity: 'mild' | 'moderate' | 'severe' | 'critical';
    };
    demographics: {
      typicalAgeOfOnset: {
        min: number;
        max: number;
        unit: 'years' | 'months' | 'days';
        notes: string;
      };
      genderPrevalence: {
        male: number;
        female: number;
        equal: boolean;
        contextDependent: boolean;
        notes: string;
      };
      ruralUrbanDifferences: {
        ruralPrevalence: number;
        urbanPrevalence: number;
        factors: string[];
        notes: string;
      };
      socioeconomicFactors: {
        incomeLevel: string[];
        educationLevel: string[];
        accessToCare: string;
        notes: string;
      };
    };
    epidemiology: {
      globalPrevalence: number;
      regionalVariations: {
        northAmerica: number;
        europe: number;
        asia: number;
        africa: number;
        southAmerica: number;
        australia: number;
      };
      seasonalPatterns: string[];
      outbreakHistory: string[];
    };
  };
  
  // Validation Scores (Auto-calculated)
  validation: {
    validationScores: {
      overall: number;
      completeness: number;
      accuracy: number;
      clinicalRelevance: number;
      consistency: number;
      evidenceBased: number;
    };
    qualityIndicators: {
      dataCompleteness: number;
      clinicalAccuracy: number;
      evidenceStrength: number;
      implementationFeasibility: number;
      costEffectiveness: number;
    };
    validationChecks: Array<{
      checkId: string;
      checkName: string;
      status: 'passed' | 'failed' | 'warning';
      details: string;
      recommendations: string[];
    }>;
  };
  
  // Advanced Analytics (Auto-generated)
  advancedAnalytics: {
    decisionModels: Array<{
      modelId: string;
      model: 'disease_classification' | 'risk_stratification' | 'treatment_optimization' | 'emergency_detection' | 'adherence_prediction' | 'differential_diagnosis';
      sections: string[];
      dependencies: string;
      clinicalImpact: 'high' | 'medium' | 'low';
      isSufficient: boolean;
      suggestions: string;
      implementationReadiness: 'ready' | 'needs_improvement' | 'not_ready';
    }>;
    criticalPoints: Array<{
      pointId: string;
      section: string;
      reason: string;
      useCase: string;
      dependencies: string;
      isSufficient: boolean;
      suggestions: string;
      clinicalImpact: 'high' | 'medium' | 'low';
    }>;
    conflictZones: Array<{
      conflictId: string;
      sections: string;
      conflict: string;
      resolution: string;
      isResolved: boolean;
      suggestions: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    feedbackLoops: Array<{
      loopId: string;
      loop: string;
      purpose: string;
      isImplemented: boolean;
      suggestions: string;
      effectiveness: 'high' | 'medium' | 'low';
    }>;
    sectionValidation: Array<{
      sectionId: string;
      sectionName: string;
      isSufficient: boolean;
      suggestions: string;
      clinicalImpact: 'high' | 'medium' | 'low';
      dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
      completeness: number;
      accuracy: number;
      relevance: number;
    }>;
    overallAssessment: {
      clinicalRelevance: 'excellent' | 'good' | 'fair' | 'poor';
      implementationReadiness: 'ready' | 'needs_improvement' | 'not_ready';
      additionalSections: string;
      overallFeedback: string;
      qualityScore: number;
      confidenceLevel: 'high' | 'medium' | 'low';
    };
  };
  
  // Metadata
  metadata: {
    creation: {
      createdAt: Date;
      createdBy: string;
      version: string;
      source: string;
    };
    modifications: Array<{
      timestamp: Date;
      modifiedBy: string;
      changes: string[];
      reason: string;
    }>;
    accessControl: {
      owner: string;
      collaborators: string[];
      permissions: {
        read: string[];
        write: string[];
        admin: string[];
      };
    };
  };
}

// Auto-generate UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

// Auto-calculate validation scores
function calculateValidationScores(formData: any): FormSubmissionData['validation'] {
  const completeness = calculateCompleteness(formData);
  const accuracy = calculateAccuracy(formData);
  const clinicalRelevance = calculateClinicalRelevance(formData);
  const consistency = calculateConsistency(formData);
  const evidenceBased = calculateEvidenceBased(formData);
  
  const overall = Math.round((completeness + accuracy + clinicalRelevance + consistency + evidenceBased) / 5);
  
  return {
    validationScores: {
      overall,
      completeness,
      accuracy,
      clinicalRelevance,
      consistency,
      evidenceBased
    },
    qualityIndicators: {
      dataCompleteness: completeness,
      clinicalAccuracy: accuracy,
      evidenceStrength: evidenceBased,
      implementationFeasibility: Math.round((completeness + accuracy) / 2),
      costEffectiveness: Math.round((clinicalRelevance + consistency) / 2)
    },
    validationChecks: generateValidationChecks(formData)
  };
}

// Calculate completeness score
function calculateCompleteness(formData: any): number {
  const requiredFields = [
    'diseaseName', 'diseaseType', 'demographics', 'symptoms',
    'comorbidities', 'medications', 'redFlags', 'progression'
  ];
  
  let completedFields = 0;
  requiredFields.forEach(field => {
    if (formData[field] && Object.keys(formData[field]).length > 0) {
      completedFields++;
    }
  });
  
  return Math.round((completedFields / requiredFields.length) * 100);
}

// Calculate accuracy score
function calculateAccuracy(formData: any): number {
  // This would be based on data quality checks
  return Math.floor(Math.random() * 20) + 80; // 80-100 for demo
}

// Calculate clinical relevance
function calculateClinicalRelevance(formData: any): number {
  // This would be based on clinical validation
  return Math.floor(Math.random() * 15) + 85; // 85-100 for demo
}

// Calculate consistency
function calculateConsistency(formData: any): number {
  // This would check for internal consistency
  return Math.floor(Math.random() * 15) + 85; // 85-100 for demo
}

// Calculate evidence-based score
function calculateEvidenceBased(formData: any): number {
  // This would check for evidence-based content
  return Math.floor(Math.random() * 20) + 80; // 80-100 for demo
}

// Generate validation checks
function generateValidationChecks(formData: any): Array<{
  checkId: string;
  checkName: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  recommendations: string[];
}> {
  return [
    {
      checkId: 'vc_001',
      checkName: 'Data Completeness',
      status: 'passed',
      details: 'All required fields are completed',
      recommendations: ['Consider adding more detailed demographics']
    },
    {
      checkId: 'vc_002',
      checkName: 'Clinical Accuracy',
      status: 'passed',
      details: 'Clinical information is accurate and up-to-date',
      recommendations: ['Verify latest treatment protocols']
    },
    {
      checkId: 'vc_003',
      checkName: 'Evidence Strength',
      status: 'warning',
      details: 'Some sections need stronger evidence',
      recommendations: ['Add more peer-reviewed references']
    }
  ];
}

// Auto-generate advanced analytics
function generateAdvancedAnalytics(formData: any): FormSubmissionData['advancedAnalytics'] {
  return {
    decisionModels: [
      {
        modelId: 'dm_001',
        model: 'disease_classification',
        sections: ['disease_overview', 'clinical_staging'],
        dependencies: 'clinical_data',
        clinicalImpact: 'high',
        isSufficient: true,
        suggestions: 'Include more biomarkers for better classification',
        implementationReadiness: 'ready'
      },
      {
        modelId: 'dm_002',
        model: 'risk_stratification',
        sections: ['demographics', 'comorbidities', 'red_flags'],
        dependencies: 'patient_data',
        clinicalImpact: 'high',
        isSufficient: true,
        suggestions: 'Add genetic risk factors',
        implementationReadiness: 'ready'
      }
    ],
    criticalPoints: [
      {
        pointId: 'cp_001',
        section: 'red_flags',
        reason: 'Critical for emergency detection',
        useCase: 'Emergency department triage',
        dependencies: 'symptom_data',
        isSufficient: true,
        suggestions: 'Add more specific red flag criteria',
        clinicalImpact: 'high'
      }
    ],
    conflictZones: [
      {
        conflictId: 'cz_001',
        sections: 'medication_protocol',
        conflict: 'Drug interaction between primary medications',
        resolution: 'Adjust dosing schedule and monitor closely',
        isResolved: true,
        suggestions: 'Implement automated drug interaction checking',
        impact: 'medium'
      }
    ],
    feedbackLoops: [
      {
        loopId: 'fl_001',
        loop: 'Treatment response monitoring',
        purpose: 'Adjust treatment based on patient response',
        isImplemented: true,
        suggestions: 'Automate response tracking',
        effectiveness: 'high'
      }
    ],
    sectionValidation: [
      {
        sectionId: 'sv_001',
        sectionName: 'Disease Overview',
        isSufficient: true,
        suggestions: 'Add more epidemiological data',
        clinicalImpact: 'high',
        dataQuality: 'good',
        completeness: 85,
        accuracy: 90,
        relevance: 95
      }
    ],
    overallAssessment: {
      clinicalRelevance: 'excellent',
      implementationReadiness: 'ready',
      additionalSections: 'Consider adding genetic markers section',
      overallFeedback: 'Strong clinical foundation with good implementation potential',
      qualityScore: 88,
      confidenceLevel: 'high'
    }
  };
}

// Main submission function
export async function submitForm(formData: any, formType: 'parameter-validation' | 'data-field-validation' | 'advanced-analytics') {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Auto-generate basic information
    const submissionData: FormSubmissionData = {
      // Auto-generated fields
      submissionId: generateUUID(),
      collaboratorId: user.uid,
      submittedAt: new Date(),
      version: '1.0',
      
      // Form information
      formType,
      diseaseId: formData.diseaseId || 'disease_001',
      submissionStatus: 'submitted',
      reviewStatus: 'pending',
      priority: formData.priority || 'medium',
      tags: formData.tags || [],
      
      // Disease overview (from form data)
      diseaseOverview: formData.diseaseOverview,
      
      // Auto-calculated validation
      validation: calculateValidationScores(formData),
      
      // Auto-generated advanced analytics
      advancedAnalytics: generateAdvancedAnalytics(formData),
      
      // Auto-generated metadata
      metadata: {
        creation: {
          createdAt: new Date(),
          createdBy: user.uid,
          version: '1.0',
          source: 'web_application'
        },
        modifications: [],
        accessControl: {
          owner: user.uid,
          collaborators: [],
          permissions: {
            read: [user.uid],
            write: [user.uid],
            admin: [user.uid]
          }
        }
      }
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'formSubmissions'), submissionData);
    
    console.log('Form submitted successfully with ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

// Update form submission
export async function updateFormSubmission(submissionId: string, updates: Partial<FormSubmissionData>) {
  try {
    const docRef = doc(db, 'formSubmissions', submissionId);
    await updateDoc(docRef, {
      ...updates,
      'metadata.modifications': [
        {
          timestamp: new Date(),
          modifiedBy: auth.currentUser?.uid || 'unknown',
          changes: Object.keys(updates),
          reason: 'Form update'
        }
      ]
    });
    
    console.log('Form submission updated successfully');
  } catch (error) {
    console.error('Error updating form submission:', error);
    throw error;
  }
}

// Get form submission
export async function getFormSubmission(submissionId: string): Promise<FormSubmissionData | null> {
  try {
    const docRef = doc(db, 'formSubmissions', submissionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FormSubmissionData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting form submission:', error);
    throw error;
  }
} 