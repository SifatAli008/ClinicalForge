import { db } from './firebase-config';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Types for Advanced Clinical Analytics Validation
export interface DecisionModel {
  model: string;
  sections: string[];
  dependencies: string;
  clinicalImpact: string;
  isSufficient: boolean;
  suggestions?: string;
}

export interface CriticalPoint {
  section: string;
  reason: string;
  useCase: string;
  dependencies: string;
  isSufficient: boolean;
  suggestions?: string;
}

export interface ConflictZone {
  sections: string;
  conflict: string;
  resolution: string;
  isResolved: boolean;
  suggestions?: string;
}

export interface FeedbackLoop {
  loop: string;
  purpose: string;
  isImplemented: boolean;
  suggestions?: string;
}

export interface SectionValidation {
  id: string;
  name: string;
  isSufficient: boolean;
  suggestions?: string;
  clinicalImpact: 'high' | 'medium' | 'low';
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface OverallAssessment {
  additionalSections?: string;
  overallFeedback?: string;
  clinicalRelevance: 'excellent' | 'good' | 'fair' | 'poor';
  implementationReadiness: 'ready' | 'needs-improvement' | 'not-ready';
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
  decisionModels: DecisionModel[];
  criticalPoints: CriticalPoint[];
  conflictZones: ConflictZone[];
  feedbackLoops: FeedbackLoop[];
  sections: SectionValidation[];
  overallAssessment: OverallAssessment;
}

export interface Metadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastModifiedBy: string;
  accessControl: {
    readAccess: string[];
    writeAccess: string[];
    adminAccess: string[];
  };
  versionHistory: {
    version: string;
    timestamp: Timestamp;
    changes: string[];
    modifiedBy: string;
  }[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'in-review' | 'approved' | 'rejected';
}

export interface SearchIndex {
  keywords: string[];
  tags: string[];
  categories: string[];
  clinicalAreas: string[];
  implementationStatus: string;
}

export interface AdvancedClinicalAnalyticsValidation {
  // Auto-generated fields
  submissionId: string;
  collaboratorId: string;
  submittedAt: Timestamp;
  version: string;
  
  // Form metadata
  formType: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  
  // Form data
  decisionModels: DecisionModel[];
  criticalPoints: CriticalPoint[];
  conflictZones: ConflictZone[];
  feedbackLoops: FeedbackLoop[];
  sections: SectionValidation[];
  overallAssessment: OverallAssessment;
  
  // Auto-generated analytics
  validation: ValidationScores;
  advancedAnalytics: AdvancedAnalytics;
  metadata: Metadata;
  searchIndex: SearchIndex;
}

export class AdvancedClinicalAnalyticsService {
  private collectionName = 'advancedClinicalAnalytics';

  // Submit a new advanced clinical analytics validation
  async submitAdvancedAnalyticsValidation(
    data: Partial<AdvancedClinicalAnalyticsValidation>,
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
      const submissionData: AdvancedClinicalAnalyticsValidation = {
        submissionId,
        collaboratorId: userId,
        submittedAt: now,
        version: '1.0',
        formType: 'advanced-clinical-analytics',
        status: 'draft',
        
        // Form data
        decisionModels: data.decisionModels || [],
        criticalPoints: data.criticalPoints || [],
        conflictZones: data.conflictZones || [],
        feedbackLoops: data.feedbackLoops || [],
        sections: data.sections || [],
        overallAssessment: data.overallAssessment!,
        
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
      console.error('Error submitting advanced analytics validation:', error);
      throw error;
    }
  }

  // Get a specific submission
  async getSubmission(submissionId: string): Promise<AdvancedClinicalAnalyticsValidation | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('submissionId', '==', submissionId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as AdvancedClinicalAnalyticsValidation;
      }
      return null;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw error;
    }
  }

  // Get user's submissions
  async getUserSubmissions(userId: string): Promise<AdvancedClinicalAnalyticsValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('collaboratorId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as AdvancedClinicalAnalyticsValidation);
    } catch (error) {
      console.error('Error getting user submissions:', error);
      throw error;
    }
  }

  // Get approved submissions
  async getApprovedSubmissions(limitCount: number = 50): Promise<AdvancedClinicalAnalyticsValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'approved'),
        orderBy('submittedAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as AdvancedClinicalAnalyticsValidation);
    } catch (error) {
      console.error('Error getting approved submissions:', error);
      throw error;
    }
  }

  // Search by keywords
  async searchByKeywords(keyword: string): Promise<AdvancedClinicalAnalyticsValidation[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('searchIndex.keywords', 'array-contains', keyword.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as AdvancedClinicalAnalyticsValidation);
    } catch (error) {
      console.error('Error searching by keywords:', error);
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(
    submissionId: string, 
    status: 'draft' | 'submitted' | 'approved' | 'rejected', 
    userId: string
  ): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('submissionId', '==', submissionId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          status,
          'metadata.updatedAt': Timestamp.now(),
          'metadata.lastModifiedBy': userId
        });
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  // Calculate validation scores
  private calculateValidationScores(data: Partial<AdvancedClinicalAnalyticsValidation>): ValidationScores {
    const sections = [
      'decisionModels',
      'criticalPoints', 
      'conflictZones',
      'feedbackLoops',
      'sections',
      'overallAssessment'
    ];

    let completedSections = 0;
    const missingSections: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    sections.forEach(section => {
      if (this.isSectionCompleted(data[section as keyof AdvancedClinicalAnalyticsValidation])) {
        completedSections++;
      } else {
        missingSections.push(section);
      }
    });

    const completenessScore = Math.round((completedSections / sections.length) * 100);
    
    // Calculate data quality score
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

  // Check if section is completed
  private isSectionCompleted(sectionData: any): boolean {
    if (!sectionData) return false;
    
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    
    if (typeof sectionData === 'object') {
      return Object.keys(sectionData).length > 0;
    }
    
    return false;
  }

  // Calculate data quality score
  private calculateDataQualityScore(data: Partial<AdvancedClinicalAnalyticsValidation>): number {
    let score = 0;
    let totalChecks = 0;

    // Check decision models
    if (data.decisionModels && data.decisionModels.length > 0) {
      score += data.decisionModels.filter(model => model.isSufficient).length;
      totalChecks += data.decisionModels.length;
    }

    // Check critical points
    if (data.criticalPoints && data.criticalPoints.length > 0) {
      score += data.criticalPoints.filter(point => point.isSufficient).length;
      totalChecks += data.criticalPoints.length;
    }

    // Check conflict zones
    if (data.conflictZones && data.conflictZones.length > 0) {
      score += data.conflictZones.filter(conflict => conflict.isResolved).length;
      totalChecks += data.conflictZones.length;
    }

    // Check feedback loops
    if (data.feedbackLoops && data.feedbackLoops.length > 0) {
      score += data.feedbackLoops.filter(loop => loop.isImplemented).length;
      totalChecks += data.feedbackLoops.length;
    }

    // Check sections
    if (data.sections && data.sections.length > 0) {
      score += data.sections.filter(section => section.isSufficient).length;
      totalChecks += data.sections.length;
    }

    return totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 0;
  }

  // Calculate clinical relevance score
  private calculateClinicalRelevanceScore(data: Partial<AdvancedClinicalAnalyticsValidation>): number {
    let score = 0;
    let totalChecks = 0;

    // Check decision models clinical impact
    if (data.decisionModels) {
      data.decisionModels.forEach(model => {
        if (model.clinicalImpact === 'high') score += 100;
        else if (model.clinicalImpact === 'medium') score += 70;
        else if (model.clinicalImpact === 'low') score += 40;
        totalChecks++;
      });
    }

    // Check critical points clinical impact
    if (data.criticalPoints) {
      data.criticalPoints.forEach(point => {
        if (point.isSufficient) score += 100;
        totalChecks++;
      });
    }

    // Check overall assessment
    if (data.overallAssessment) {
      if (data.overallAssessment.clinicalRelevance === 'excellent') score += 100;
      else if (data.overallAssessment.clinicalRelevance === 'good') score += 80;
      else if (data.overallAssessment.clinicalRelevance === 'fair') score += 60;
      else if (data.overallAssessment.clinicalRelevance === 'poor') score += 40;
      totalChecks++;
    }

    return totalChecks > 0 ? Math.round(score / totalChecks) : 0;
  }

  // Generate advanced analytics
  private generateAdvancedAnalytics(data: Partial<AdvancedClinicalAnalyticsValidation>): AdvancedAnalytics {
    return {
      decisionModels: data.decisionModels || [],
      criticalPoints: data.criticalPoints || [],
      conflictZones: data.conflictZones || [],
      feedbackLoops: data.feedbackLoops || [],
      sections: data.sections || [],
      overallAssessment: data.overallAssessment || {
        clinicalRelevance: 'good',
        implementationReadiness: 'needs-improvement'
      }
    };
  }

  // Create search index
  private createSearchIndex(data: Partial<AdvancedClinicalAnalyticsValidation>): SearchIndex {
    const keywords: string[] = [];
    const tags: string[] = [];
    const categories: string[] = [];
    const clinicalAreas: string[] = [];

    // Extract keywords from decision models
    if (data.decisionModels) {
      data.decisionModels.forEach(model => {
        keywords.push(...model.model.toLowerCase().split(' '));
        keywords.push(...model.sections.map(s => s.toLowerCase()));
        if (model.clinicalImpact) keywords.push(model.clinicalImpact);
      });
    }

    // Extract from critical points
    if (data.criticalPoints) {
      data.criticalPoints.forEach(point => {
        keywords.push(...point.section.toLowerCase().split(' '));
        keywords.push(...point.reason.toLowerCase().split(' '));
      });
    }

    // Extract from conflict zones
    if (data.conflictZones) {
      data.conflictZones.forEach(conflict => {
        keywords.push(...conflict.sections.toLowerCase().split(' '));
        keywords.push(...conflict.conflict.toLowerCase().split(' '));
      });
    }

    // Extract from sections
    if (data.sections) {
      data.sections.forEach(section => {
        keywords.push(...section.name.toLowerCase().split(' '));
        keywords.push(section.clinicalImpact);
        keywords.push(section.dataQuality);
      });
    }

    // Extract from overall assessment
    if (data.overallAssessment) {
      keywords.push(data.overallAssessment.clinicalRelevance);
      keywords.push(data.overallAssessment.implementationReadiness);
    }

    return {
      keywords: Array.from(new Set(keywords)),
      tags: Array.from(new Set(tags)),
      categories: Array.from(new Set(categories)),
      clinicalAreas: Array.from(new Set(clinicalAreas)),
      implementationStatus: data.overallAssessment?.implementationReadiness || 'needs-improvement'
    };
  }

  // Extract tags from data
  private extractTags(data: Partial<AdvancedClinicalAnalyticsValidation>): string[] {
    const tags: string[] = [];

    if (data.overallAssessment?.clinicalRelevance) {
      tags.push(data.overallAssessment.clinicalRelevance);
    }

    if (data.overallAssessment?.implementationReadiness) {
      tags.push(data.overallAssessment.implementationReadiness);
    }

    if (data.decisionModels) {
      data.decisionModels.forEach(model => {
        if (model.clinicalImpact) tags.push(model.clinicalImpact);
      });
    }

    if (data.sections) {
      data.sections.forEach(section => {
        tags.push(section.clinicalImpact);
        tags.push(section.dataQuality);
      });
    }

    return Array.from(new Set(tags));
  }
}

// Export singleton instance
export const advancedClinicalAnalyticsService = new AdvancedClinicalAnalyticsService(); 