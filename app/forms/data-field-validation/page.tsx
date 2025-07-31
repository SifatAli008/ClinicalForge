'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info, Save, Send, Brain, Target, Zap, Shield, Users, Activity, FileText, Heart, Clock, MapPin, Settings, TrendingUp, AlertTriangle, CheckSquare, XCircle, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { enhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

const validationSchema = z.object({
  // Decision Model Validation
  decisionModels: z.array(z.object({
    model: z.string(),
    sections: z.array(z.string()),
    dependencies: z.string(),
    clinicalImpact: z.string(),
    isSufficient: z.boolean(),
    suggestions: z.string().optional(),
  })),

  // Critical Decision Points
  criticalPoints: z.array(z.object({
    section: z.string(),
    reason: z.string(),
    useCase: z.string(),
    dependencies: z.string(),
    isSufficient: z.boolean(),
    suggestions: z.string().optional(),
  })),

  // Conflict Zones
  conflictZones: z.array(z.object({
    sections: z.string(),
    conflict: z.string(),
    resolution: z.string(),
    isResolved: z.boolean(),
    suggestions: z.string().optional(),
  })),

  // Feedback Loops
  feedbackLoops: z.array(z.object({
    loop: z.string(),
    purpose: z.string(),
    isImplemented: z.boolean(),
    suggestions: z.string().optional(),
  })),

  // Section-by-Section Validation
  sections: z.array(z.object({
    id: z.string(),
    name: z.string(),
    isSufficient: z.boolean(),
    suggestions: z.string().optional(),
    clinicalImpact: z.enum(['high', 'medium', 'low']),
    dataQuality: z.enum(['excellent', 'good', 'fair', 'poor']),
  })),

  // Overall Assessment
  additionalSections: z.string().optional(),
  overallFeedback: z.string().optional(),
  clinicalRelevance: z.enum(['excellent', 'good', 'fair', 'poor']),
  implementationReadiness: z.enum(['ready', 'needs-improvement', 'not-ready']),
  physicianConsent: z.object({
    physicianName: z.string().min(1, "Physician name is required"),
    credentials: z.string().min(1, "Credentials are required"),
    institution: z.string().min(1, "Institution is required"),
    specialty: z.string().min(1, "Specialty is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    consentGiven: z.boolean(),
    consentDate: z.string().optional(),
    additionalNotes: z.string().optional(),
  }),
});

type ValidationFormData = z.infer<typeof validationSchema>;

const decisionModels = [
  {
    model: 'Disease Classification',
    sections: ['Disease Overview', 'Disease Subtypes', 'Family History & Genetics', 'Clinical Staging'],
    dependencies: 'Patient demographics, genetics, and staging',
    clinicalImpact: 'Enhanced diagnostic precision through comprehensive disease profiling and genetic risk assessment',
  },
  {
    model: 'Risk Stratification',
    sections: ['Clinical Staging', 'Progression', 'Lab Ranges', 'Monitoring'],
    dependencies: 'Genetic markers, progression patterns',
    clinicalImpact: 'Proactive patient management through early risk identification and intervention protocols',
  },
  {
    model: 'Treatment Optimization',
    sections: ['Medication Protocol', 'Contraindications', 'Comorbidities', 'Pediatric vs. Adult'],
    dependencies: 'Drug interactions, age factors, and comorbidities',
    clinicalImpact: 'Evidence-based therapeutic decision-making with comprehensive safety monitoring',
  },
  {
    model: 'Emergency Detection',
    sections: ['Symptoms by Stage', 'Red Flags & Emergencies', 'Lab Ranges', 'Misdiagnoses'],
    dependencies: 'Symptom patterns, lab anomalies',
    clinicalImpact: 'Real-time critical care decision support and emergency response optimization',
  },
  {
    model: 'Adherence Prediction',
    sections: ['Lifestyle', 'Monitoring', 'Regional Practices', 'Notes'],
    dependencies: 'Lifestyle factors, regional/cultural differences',
    clinicalImpact: 'Patient-centered care optimization through predictive adherence modeling',
  },
  {
    model: 'Differential Diagnosis',
    sections: ['Misdiagnoses', 'Symptoms by Stage', 'Lab Ranges', 'Red Flags & Emergencies'],
    dependencies: 'Symptom overlap, distinguishing tests',
    clinicalImpact: 'Systematic diagnostic accuracy enhancement through comprehensive differential analysis',
  },
];

const criticalPoints = [
  {
    section: 'Clinical Staging',
    reason: 'Foundation for evidence-based diagnostic and therapeutic decision-making',
    useCase: 'Accurate stage classification enables precision medicine and outcome prediction',
    dependencies: 'DEPENDS ON: Disease Overview, Subtypes, Family History. RESULTS IN: Symptoms, Medication, Progression, Labs',
  },
  {
    section: 'Red Flags & Emergencies',
    reason: 'Critical patient safety and early intervention system',
    useCase: 'Automated emergency detection and rapid response protocols',
    dependencies: 'DEPENDS ON: Symptoms, Lab Ranges, Misdiagnoses. RESULTS IN: Emergency protocols',
  },
  {
    section: 'Pediatric vs. Adult',
    reason: 'Age-appropriate personalized medicine implementation',
    useCase: 'Developmental stage-specific treatment algorithms and safety protocols',
    dependencies: 'DEPENDS ON: Clinical Staging, Medication, Lab Ranges. RESULTS IN: Age-based care planning',
  },
];

const conflictZones = [
  {
    sections: 'Medication Protocol CONFLICTS WITH Contraindications',
    conflict: 'Therapeutic efficacy optimization versus risk of nephrotoxicity and adverse drug reactions',
    resolution: 'Comprehensive risk-benefit analysis with enhanced monitoring and dose titration protocols',
  },
  {
    sections: 'Comorbidities CONFLICTS WITH Medication Protocol',
    conflict: 'Complex drug-drug interactions in patients with multiple chronic conditions',
    resolution: 'Advanced pharmacogenomic screening and evidence-based dose optimization strategies',
  },
  {
    sections: 'Regional Practices CONFLICTS WITH Medication Protocol',
    conflict: 'Healthcare resource limitations and medication accessibility in underserved regions',
    resolution: 'Adaptive treatment protocols with cost-effective therapeutic alternatives and resource optimization',
  },
];

const feedbackLoops = [
  {
    loop: 'Monitoring leads to Progression, which leads to Clinical Staging',
    purpose: 'Continuous treatment effectiveness assessment and outcome optimization',
  },
  {
    loop: 'Misdiagnoses leads to Red Flags & Emergencies, which leads to Symptoms by Stage',
    purpose: 'Iterative diagnostic accuracy enhancement and clinical decision support',
  },
  {
    loop: 'Cultural/Regional Practices leads to Adherence Patterns, which leads to Treatment Outcomes',
    purpose: 'Health equity advancement through culturally responsive care delivery',
  },
];

const clinicalSections = [
  { id: 'disease-overview', name: 'Disease Overview', description: 'Comprehensive disease epidemiology and clinical characteristics' },
  { id: 'subtypes', name: 'Disease Subtypes/Classifications', description: 'Evidence-based disease classification and phenotypic variations' },
  { id: 'family-history', name: 'Family History & Genetic Risk', description: 'Hereditary factors and genetic predisposition assessment' },
  { id: 'clinical-staging', name: 'Clinical Staging', description: 'Evidence-based disease progression staging and prognostic indicators' },
  { id: 'symptoms', name: 'Symptoms by Stage', description: 'Stage-specific symptom presentation and clinical manifestations' },
  { id: 'comorbidities', name: 'Common Comorbidities', description: 'Frequently associated conditions and their clinical implications' },
  { id: 'medication', name: 'Medication Protocol', description: 'Evidence-based therapeutic protocols and pharmacotherapeutic strategies' },
  { id: 'red-flags', name: 'Red Flags & Emergency Conditions', description: 'Critical clinical indicators requiring immediate medical intervention' },
  { id: 'progression', name: 'Disease Progression Timeline', description: 'Evidence-based progression rates and clinical trigger identification' },
  { id: 'lifestyle', name: 'Lifestyle Management Guidance', description: 'Evidence-based lifestyle modification and behavioral interventions' },
  { id: 'pediatric-adult', name: 'Pediatric vs. Adult Presentation', description: 'Age-specific clinical presentations and therapeutic considerations' },
  { id: 'lab-values', name: 'Lab Value Ranges by Stage', description: 'Stage-specific laboratory parameters and critical value thresholds' },
  { id: 'contraindications', name: 'Contraindications & Treatment Conflicts', description: 'Drug interaction profiles and therapeutic safety considerations' },
  { id: 'monitoring', name: 'Monitoring & Follow-up Requirements', description: 'Comprehensive surveillance protocols and outcome monitoring' },
  { id: 'misdiagnoses', name: 'Common Misdiagnoses/Differential Diagnoses', description: 'Systematic differential diagnosis and diagnostic accuracy enhancement' },
  { id: 'regional-practices', name: 'Regional Practices & Variations', description: 'Geographic and cultural variations in clinical practice patterns' },
  { id: 'additional-notes', name: 'Additional Notes', description: 'Socioeconomic factors and healthcare access considerations' },
  { id: 'physician-consent', name: 'Physician Consent & Attribution', description: 'Professional validation and attribution documentation' },
];

export default function DataFieldValidationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('decision-models');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSubmissionId, setEditSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      decisionModels: decisionModels.map(model => ({
        ...model,
        isSufficient: false,
        suggestions: '',
      })),
      criticalPoints: criticalPoints.map(point => ({
        ...point,
        isSufficient: false,
        suggestions: '',
      })),
      conflictZones: conflictZones.map(conflict => ({
        ...conflict,
        isResolved: false,
        suggestions: '',
      })),
      feedbackLoops: feedbackLoops.map(loop => ({
        ...loop,
        isImplemented: false,
        suggestions: '',
      })),
      sections: clinicalSections.map(section => ({
        id: section.id,
        name: section.name,
        isSufficient: false,
        suggestions: '',
        clinicalImpact: 'medium' as const,
        dataQuality: 'good' as const,
      })),
      clinicalRelevance: 'good',
      implementationReadiness: 'needs-improvement',
      physicianConsent: {
        physicianName: '',
        credentials: '',
        institution: '',
        specialty: '',
        email: '',
        phone: '',
        consentGiven: false,
        consentDate: '',
        additionalNotes: '',
      },
    },
  });

  const watchedDecisionModels = watch('decisionModels');
  const watchedCriticalPoints = watch('criticalPoints');
  const watchedConflictZones = watch('conflictZones');
  const watchedFeedbackLoops = watch('feedbackLoops');
  const watchedSections = watch('sections');
  const watchedClinicalRelevance = watch('clinicalRelevance');
  const watchedImplementationReadiness = watch('implementationReadiness');
  const watchedPhysicianConsent = watch('physicianConsent');

  // Calculate completion status for each tab
  const calculateTabCompletion = () => {
    const tabCompletion = {
      'decision-models': watchedDecisionModels.some(model => model.isSufficient),
      'critical-points': watchedCriticalPoints.some(point => point.isSufficient),
      'conflict-zones': watchedConflictZones.some(conflict => conflict.isResolved),
      'feedback-loops': watchedFeedbackLoops.some(loop => loop.isImplemented),
      'sections': watchedSections.some(section => section.isSufficient),
      'overall': watchedClinicalRelevance && watchedImplementationReadiness && 
                 watchedPhysicianConsent.physicianName && watchedPhysicianConsent.credentials && 
                 watchedPhysicianConsent.institution && watchedPhysicianConsent.specialty && 
                 watchedPhysicianConsent.email && watchedPhysicianConsent.consentGiven
    };

    const completedTabs = Object.values(tabCompletion).filter(Boolean).length;
    const totalTabs = Object.keys(tabCompletion).length;
    const completionPercentage = Math.round((completedTabs / totalTabs) * 100);

    return {
      tabCompletion,
      completedTabs,
      totalTabs,
      completionPercentage
    };
  };

  const { tabCompletion, completedTabs, totalTabs, completionPercentage } = calculateTabCompletion();

  // Load edit data from localStorage if available
  React.useEffect(() => {
    const editData = localStorage.getItem('editSubmissionData');
    const submissionId = localStorage.getItem('editSubmissionId');
    
    if (editData && submissionId) {
      try {
        const submission = JSON.parse(editData);
        setIsEditMode(true);
        setEditSubmissionId(submissionId);
        
        // Pre-populate form with existing data
        if (submission.advancedAnalyticsData) {
          const data = submission.advancedAnalyticsData;
          
          // Set decision models
          if (data.decisionModels) {
            data.decisionModels.forEach((model: any, index: number) => {
              setValue(`decisionModels.${index}`, model);
            });
          }
          
          // Set critical points
          if (data.criticalPoints) {
            data.criticalPoints.forEach((point: any, index: number) => {
              setValue(`criticalPoints.${index}`, point);
            });
          }
          
          // Set conflict zones
          if (data.conflictZones) {
            data.conflictZones.forEach((zone: any, index: number) => {
              setValue(`conflictZones.${index}`, zone);
            });
          }
          
          // Set feedback loops
          if (data.feedbackLoops) {
            data.feedbackLoops.forEach((loop: any, index: number) => {
              setValue(`feedbackLoops.${index}`, loop);
            });
          }
          
          // Set sections
          if (data.sections) {
            data.sections.forEach((section: any, index: number) => {
              setValue(`sections.${index}`, section);
            });
          }
          
          // Set overall assessment
          if (data.overallAssessment) {
            setValue('additionalSections', data.overallAssessment.additionalSections || '');
            setValue('overallFeedback', data.overallAssessment.overallFeedback || '');
            setValue('clinicalRelevance', data.overallAssessment.clinicalRelevance || 'good');
            setValue('implementationReadiness', data.overallAssessment.implementationReadiness || 'ready');
            
            // Set physician consent
            if (data.overallAssessment.physicianConsent) {
              setValue('physicianConsent.physicianName', data.overallAssessment.physicianConsent.physicianName || '');
              setValue('physicianConsent.credentials', data.overallAssessment.physicianConsent.credentials || '');
              setValue('physicianConsent.institution', data.overallAssessment.physicianConsent.institution || '');
              setValue('physicianConsent.specialty', data.overallAssessment.physicianConsent.specialty || '');
              setValue('physicianConsent.email', data.overallAssessment.physicianConsent.email || '');
              setValue('physicianConsent.phone', data.overallAssessment.physicianConsent.phone || '');
              setValue('physicianConsent.consentGiven', data.overallAssessment.physicianConsent.consentGiven || false);
              setValue('physicianConsent.consentDate', data.overallAssessment.physicianConsent.consentDate || '');
              setValue('physicianConsent.additionalNotes', data.overallAssessment.physicianConsent.additionalNotes || '');
            }
          }
          
          toast({
            title: "Edit Mode Enabled",
            description: `Loading submission data for editing.`,
            variant: "default",
          });
        } else {
          // Handle mock data structure from profile page
          toast({
            title: "Edit Mode Enabled",
            description: `Starting fresh edit session.`,
            variant: "default",
          });
        }
        
        // Log the loaded data for debugging
        console.log('Loaded submission data for editing:', submission);
        console.log('Submission ID:', submission.submissionId);
        console.log('Form Type:', submission.formType);
        console.log('Has Advanced Analytics Data:', !!submission.advancedAnalyticsData);
        if (submission.advancedAnalyticsData) {
          console.log('Decision Models:', submission.advancedAnalyticsData.decisionModels?.length || 0);
          console.log('Critical Points:', submission.advancedAnalyticsData.criticalPoints?.length || 0);
          console.log('Conflict Zones:', submission.advancedAnalyticsData.conflictZones?.length || 0);
          console.log('Feedback Loops:', submission.advancedAnalyticsData.feedbackLoops?.length || 0);
          console.log('Sections:', submission.advancedAnalyticsData.sections?.length || 0);
        }
        
        // Clear localStorage after loading
        localStorage.removeItem('editSubmissionData');
        localStorage.removeItem('editSubmissionId');
      } catch (error) {
        console.error('Error loading edit data:', error);
        toast({
          title: "Error Loading Data",
          description: "Could not load submission data for editing.",
          variant: "destructive",
        });
      }
    }
  }, [setValue, toast]);

  const onSubmit = async (data: ValidationFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform form data to match enhanced database schema
      const transformedData = {
        decisionModels: data.decisionModels || [],
        criticalPoints: data.criticalPoints || [],
        conflictZones: data.conflictZones || [],
        feedbackLoops: data.feedbackLoops || [],
        sections: data.sections || [],
        overallAssessment: {
          additionalSections: data.additionalSections || '',
          overallFeedback: data.overallFeedback || '',
          clinicalRelevance: data.clinicalRelevance || 'good',
          implementationReadiness: data.implementationReadiness || 'ready',
          physicianConsent: data.physicianConsent || {
            physicianName: '',
            credentials: '',
            institution: '',
            specialty: '',
            email: '',
            phone: '',
            consentGiven: false,
            consentDate: new Date().toISOString(),
            additionalNotes: '',
          },
        },
      };

      const submissionId = await enhancedClinicalDatabaseService.submitAdvancedClinicalAnalytics(
        { advancedAnalyticsData: transformedData },
        user.uid
      );
      
      toast({
        title: "Form Submitted Successfully!",
        description: `Submission ID: ${submissionId}. Your advanced analytics validation has been saved to the database.`,
        variant: "default",
      });
      
      console.log('Advanced validation form submitted:', data);
      setIsSaved(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save the form.",
        variant: "destructive",
      });
      return;
    }

    const formData = watch();
    try {
      // Transform form data to match enhanced database schema
      const transformedData = {
        decisionModels: formData.decisionModels || [],
        criticalPoints: formData.criticalPoints || [],
        conflictZones: formData.conflictZones || [],
        feedbackLoops: formData.feedbackLoops || [],
        sections: formData.sections || [],
        overallAssessment: {
          additionalSections: formData.additionalSections || '',
          overallFeedback: formData.overallFeedback || '',
          clinicalRelevance: formData.clinicalRelevance || 'good',
          implementationReadiness: formData.implementationReadiness || 'ready',
          physicianConsent: formData.physicianConsent || {
            physicianName: '',
            credentials: '',
            institution: '',
            specialty: '',
            email: '',
            phone: '',
            consentGiven: false,
            consentDate: new Date().toISOString(),
            additionalNotes: '',
          },
        },
      };

      const submissionId = await enhancedClinicalDatabaseService.submitAdvancedClinicalAnalytics(
        { advancedAnalyticsData: transformedData },
        user.uid
      );
      
      toast({
        title: "Form Saved as Draft",
        description: `Draft saved with ID: ${submissionId}. You can continue editing later.`,
        variant: "default",
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'decision-models', name: 'Decision Models', icon: Brain, color: 'bg-blue-500' },
    { id: 'critical-points', name: 'Critical Points', icon: Target, color: 'bg-red-500' },
    { id: 'conflict-zones', name: 'Conflict Zones', icon: AlertTriangle, color: 'bg-orange-500' },
    { id: 'feedback-loops', name: 'Feedback Loops', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'sections', name: 'Section Validation', icon: CheckSquare, color: 'bg-purple-500' },
    { id: 'overall', name: 'Overall Assessment', icon: Star, color: 'bg-indigo-500' },
  ];

  // Get current tab index
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  // Navigation functions
  const goToNextTab = () => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      setActiveTab(nextTab.id);
    }
  };

  const goToPreviousTab = () => {
    if (!isFirstTab) {
      const previousTab = tabs[currentTabIndex - 1];
      setActiveTab(previousTab.id);
    }
  };

  // Check if current tab is completed
  const isCurrentTabCompleted = tabCompletion[activeTab as keyof typeof tabCompletion];

  // Check if all previous tabs are completed
  const arePreviousTabsCompleted = () => {
    for (let i = 0; i < currentTabIndex; i++) {
      if (!tabCompletion[tabs[i].id as keyof typeof tabCompletion]) {
        return false;
      }
    }
    return true;
  };

  // Check if user can proceed to next tab
  const canProceedToNext = isCurrentTabCompleted && arePreviousTabsCompleted();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/forms" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Forms</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Advanced Clinical Analytics Validation
        </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Comprehensive validation of clinical data fields based on Advanced Clinical Analytics Matrix and decision models.
        </p>
          
          {/* Completion Progress */}
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Form Completion
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">
                    {completedTabs}/{totalTabs}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">tabs</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {completionPercentage}% Complete • {completedTabs === totalTabs ? 'All tabs completed!' : `${totalTabs - completedTabs} tabs remaining`}
              </p>
            </div>
          </div>
      </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Instructions:</strong> This advanced validation form evaluates clinical data fields based on decision models, 
            critical conflict zones, feedback loops, and clinical impact assessment. Validate each component for clinical relevance and implementation readiness.
        </AlertDescription>
      </Alert>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isCompleted = tabCompletion[tab.id as keyof typeof tabCompletion];
              const isActive = activeTab === tab.id;
              const isAccessible = index <= currentTabIndex || isCompleted;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  disabled={!isAccessible}
                  className={`flex items-center space-x-2 relative ${
                    isCompleted ? 'border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-400' : ''
                  } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {isCompleted && (
                    <CheckCircle className="h-3 w-3 text-green-600 ml-1" />
                  )}
                  {!isAccessible && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentTabIndex + 1} of {tabs.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tabs[currentTabIndex]?.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {completedTabs}/{totalTabs} completed
              </span>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Decision Models Tab */}
          {activeTab === 'decision-models' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <span>Clinical Decision Models</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Do these clinical decision models provide sufficient information for healthcare professionals to make accurate diagnostic and treatment decisions?<br/>
                  <strong>Context:</strong> Each model represents a key clinical decision point that guides patient care. Evaluate whether the included sections, dependencies, and clinical impact descriptions provide comprehensive guidance for clinical practice.
                </p>
              </div>

              {watchedDecisionModels.map((model, index) => (
                <Card key={index} className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                          {model.model}
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300 mt-2">
                          <strong>Sections:</strong> {model.sections.join(' leads to ')}
                        </CardDescription>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Dependencies:</strong> {model.dependencies}
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Clinical Impact:</strong> {model.clinicalImpact}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={model.isSufficient}
                          onCheckedChange={(checked: boolean | 'indeterminate') => {
                            const newModels = [...watchedDecisionModels];
                            newModels[index] = { ...newModels[index], isSufficient: checked === true };
                            setValue('decisionModels', newModels);
                          }}
                        />
                        <label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          ✓ Sufficient for Clinical Use
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!model.isSufficient && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Suggestions for improvement:
                        </label>
                        <Textarea
                          placeholder="What additional clinical fields, parameters, or sections would make this decision model more comprehensive and useful for healthcare professionals? Consider: missing data points, unclear guidance, or insufficient clinical context..."
                          className="min-h-[100px] focus:border-blue-500"
                          {...register(`decisionModels.${index}.suggestions`)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Critical Points Tab */}
          {activeTab === 'critical-points' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-red-600" />
                  <span>Critical Clinical Decision Points</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Are these critical clinical decision points adequately defined to support safe and effective patient care?<br/>
                  <strong>Context:</strong> Critical points are the most important decision-making moments in patient care. Evaluate whether each point provides clear guidance for healthcare professionals to make informed clinical decisions.
                </p>
              </div>

              {watchedCriticalPoints.map((point, index) => (
                <Card key={index} className="border-2 border-red-200 dark:border-red-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-red-900 dark:text-red-100">
                          {point.section}
                        </CardTitle>
                        <CardDescription className="text-red-700 dark:text-red-300 mt-2">
                          <strong>Why Critical:</strong> {point.reason}
                        </CardDescription>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Use Case:</strong> {point.useCase}
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Dependencies:</strong> {point.dependencies}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={point.isSufficient}
                          onCheckedChange={(checked: boolean | 'indeterminate') => {
                            const newPoints = [...watchedCriticalPoints];
                            newPoints[index] = { ...newPoints[index], isSufficient: checked === true };
                            setValue('criticalPoints', newPoints);
                          }}
                        />
                        <label className="text-sm font-medium text-red-900 dark:text-red-100">
                          ✓ Adequately Defined
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!point.isSufficient && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Suggestions for improvement:
                        </label>
                        <Textarea
                          placeholder="What additional information or guidance would make this critical decision point clearer and safer for healthcare professionals? Consider: missing clinical criteria, unclear decision thresholds, or insufficient safety protocols..."
                          className="min-h-[100px] focus:border-red-500"
                          {...register(`criticalPoints.${index}.suggestions`)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Conflict Zones Tab */}
          {activeTab === 'conflict-zones' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <span>Critical Conflict Zones</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Are the conflicts between different clinical sections properly identified and resolved to ensure patient safety?<br/>
                  <strong>Context:</strong> Clinical conflicts can arise when different treatment approaches or data requirements contradict each other. Evaluate whether these conflicts are clearly identified and whether the proposed resolutions are practical and safe for patient care.
                </p>
              </div>

              {watchedConflictZones.map((conflict, index) => (
                <Card key={index} className="border-2 border-orange-200 dark:border-orange-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-orange-900 dark:text-orange-100">
                          {conflict.sections}
                        </CardTitle>
                        <CardDescription className="text-orange-700 dark:text-orange-300 mt-2">
                          <strong>Conflict:</strong> {conflict.conflict}
                        </CardDescription>
                        <div className="mt-2">
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            <strong>Resolution:</strong> {conflict.resolution}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={conflict.isResolved}
                          onCheckedChange={(checked: boolean | 'indeterminate') => {
                            const newConflicts = [...watchedConflictZones];
                            newConflicts[index] = { ...newConflicts[index], isResolved: checked === true };
                            setValue('conflictZones', newConflicts);
                          }}
                        />
                        <label className="text-sm font-medium text-orange-900 dark:text-orange-100">
                          ✓ Conflict Resolved
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!conflict.isResolved && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Resolution suggestions:
                        </label>
                        <Textarea
                          placeholder="How can this clinical conflict be resolved to ensure patient safety? What additional protocols, monitoring, or decision criteria would help healthcare professionals manage this conflict effectively? Consider: safety protocols, monitoring requirements, or alternative approaches..."
                          className="min-h-[100px] focus:border-orange-500"
                          {...register(`conflictZones.${index}.suggestions`)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Feedback Loops Tab */}
          {activeTab === 'feedback-loops' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <span>Feedback Loops for Continuous Learning</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Do these feedback loops provide effective mechanisms for continuous learning and improvement in clinical practice?<br/>
                  <strong>Context:</strong> Feedback loops enable healthcare systems to learn from outcomes and improve future care. Evaluate whether these loops are practical, measurable, and will lead to meaningful improvements in patient care.
                </p>
              </div>

              {watchedFeedbackLoops.map((loop, index) => (
                <Card key={index} className="border-2 border-green-200 dark:border-green-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-green-900 dark:text-green-100">
                          {loop.loop}
                        </CardTitle>
                        <CardDescription className="text-green-700 dark:text-green-300 mt-2">
                          <strong>Purpose:</strong> {loop.purpose}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={loop.isImplemented}
                          onCheckedChange={(checked: boolean | 'indeterminate') => {
                            const newLoops = [...watchedFeedbackLoops];
                            newLoops[index] = { ...newLoops[index], isImplemented: checked === true };
                            setValue('feedbackLoops', newLoops);
                          }}
                        />
                        <label className="text-sm font-medium text-green-900 dark:text-green-100">
                          ✓ Loop Implemented
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!loop.isImplemented && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Implementation suggestions:
                        </label>
                        <Textarea
                          placeholder="How can this feedback loop be implemented to improve clinical outcomes? What specific mechanisms, data collection methods, or evaluation criteria would make this loop effective for continuous learning? Consider: outcome measures, data collection protocols, or improvement mechanisms..."
                          className="min-h-[100px] focus:border-green-500"
                          {...register(`feedbackLoops.${index}.suggestions`)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Section Validation Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <CheckSquare className="h-6 w-6 text-purple-600" />
                  <span>Section-by-Section Validation</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Does each clinical section provide sufficient, high-quality data to support evidence-based patient care?<br/>
                  <strong>Context:</strong> Each section represents a specific aspect of patient care. Evaluate whether the data fields, clinical impact, and data quality are appropriate for healthcare professionals to make informed clinical decisions.
                </p>
              </div>

              {watchedSections.map((section, index) => (
                <Card key={section.id} className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                        <CardTitle className="text-xl text-purple-900 dark:text-purple-100">
                          {section.name}
                  </CardTitle>
                        <CardDescription className="text-purple-700 dark:text-purple-300 mt-2">
                          {clinicalSections[index]?.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                          checked={section.isSufficient}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      const newSections = [...watchedSections];
                      newSections[index] = { ...newSections[index], isSufficient: checked === true };
                      setValue('sections', newSections);
                    }}
                  />
                        <label className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    ✓ Section Complete
                  </label>
                </div>
              </div>
            </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Clinical Impact on Patient Care
                        </label>
                        <select
                          {...register(`sections.${index}.clinicalImpact`)}
                          className="w-full h-10 text-base border rounded-lg px-3 focus:border-purple-500"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Data Quality & Reliability
                        </label>
                        <select
                          {...register(`sections.${index}.dataQuality`)}
                          className="w-full h-10 text-base border rounded-lg px-3 focus:border-purple-500"
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>
                    {!section.isSufficient && (
                <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Suggestions for improvement:
                  </label>
                  <Textarea
                          placeholder="What additional clinical data fields, parameters, or guidance would improve this section for healthcare professionals? Consider: missing clinical information, unclear data requirements, or insufficient clinical context for decision-making..."
                          className="min-h-[100px] focus:border-purple-500"
                    {...register(`sections.${index}.suggestions`)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
            </div>
          )}

          {/* Overall Assessment Tab */}
          {activeTab === 'overall' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Star className="h-6 w-6 text-indigo-600" />
                  <span>Overall Assessment</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  <strong>Question:</strong> Is this clinical validation system ready for implementation in real healthcare settings?<br/>
                  <strong>Context:</strong> This final assessment evaluates whether the entire system is clinically relevant and ready for use by healthcare professionals. Consider the overall quality, safety, and practical implementation of the validation system.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                    <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
                      Clinical Relevance & Impact
                    </CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      How relevant and impactful is this validation system for clinical practice?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <select
                      {...register('clinicalRelevance')}
                      className="w-full h-12 text-base border rounded-lg px-3 focus:border-indigo-500"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                    <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
                      Implementation Readiness & Safety
                    </CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      Is this system ready and safe for implementation in healthcare settings?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <select
                      {...register('implementationReadiness')}
                      className="w-full h-12 text-base border rounded-lg px-3 focus:border-indigo-500"
                    >
                      <option value="ready">Ready for Implementation</option>
                      <option value="needs-improvement">Needs Improvement</option>
                      <option value="not-ready">Not Ready</option>
                    </select>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                    Additional Clinical Sections
            </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
              Suggest completely new clinical sections that would enhance patient care and clinical decision-making
            </CardDescription>
          </CardHeader>
                <CardContent className="p-6">
            <Textarea
              placeholder="Describe any additional sections that would be valuable for clinical data collection..."
                    className="min-h-[120px] focus:border-blue-500"
              {...register('additionalSections')}
            />
          </CardContent>
        </Card>

                             <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
                 <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                                     <CardTitle className="text-xl text-green-900 dark:text-green-100">
                    Overall Clinical Feedback
            </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
              Comprehensive feedback on clinical relevance, safety, usability, and areas for improvement
            </CardDescription>
           </CardHeader>
                 <CardContent className="p-6">
             <Textarea
                     placeholder="Provide comprehensive feedback on the clinical validation system. Consider: clinical relevance, patient safety, ease of use for healthcare professionals, areas for improvement, and overall readiness for clinical implementation..."
                     className="min-h-[120px] focus:border-green-500"
               {...register('overallFeedback')}
             />
           </CardContent>
         </Card>

               {/* Physician Consent Section */}
               <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
                 <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                   <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100 flex items-center space-x-2">
                     <Users className="h-5 w-5" />
                     <span>Physician Consent & Attribution</span>
                   </CardTitle>
                   <CardDescription className="text-indigo-700 dark:text-indigo-300">
                     Provide your professional information and consent for this validation submission
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Physician Name *
                       </label>
                       <input
                         type="text"
                         {...register('physicianConsent.physicianName')}
                         placeholder="Enter your full name"
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                       {errors.physicianConsent?.physicianName && (
                         <p className="text-red-500 text-xs mt-1">{errors.physicianConsent.physicianName.message}</p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Credentials *
                       </label>
                       <input
                         type="text"
                         {...register('physicianConsent.credentials')}
                         placeholder="MD, PhD, etc."
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                       {errors.physicianConsent?.credentials && (
                         <p className="text-red-500 text-xs mt-1">{errors.physicianConsent.credentials.message}</p>
                       )}
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Institution *
                       </label>
                       <input
                         type="text"
                         {...register('physicianConsent.institution')}
                         placeholder="Hospital, University, Clinic"
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                       {errors.physicianConsent?.institution && (
                         <p className="text-red-500 text-xs mt-1">{errors.physicianConsent.institution.message}</p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Specialty *
                       </label>
                       <input
                         type="text"
                         {...register('physicianConsent.specialty')}
                         placeholder="Cardiology, Neurology, etc."
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                       {errors.physicianConsent?.specialty && (
                         <p className="text-red-500 text-xs mt-1">{errors.physicianConsent.specialty.message}</p>
                       )}
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Email Address *
                       </label>
                       <input
                         type="email"
                         {...register('physicianConsent.email')}
                         placeholder="your.email@institution.com"
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                       {errors.physicianConsent?.email && (
                         <p className="text-red-500 text-xs mt-1">{errors.physicianConsent.email.message}</p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         Phone Number
                       </label>
                       <input
                         type="tel"
                         {...register('physicianConsent.phone')}
                         placeholder="+1 (555) 123-4567"
                         className="w-full h-10 text-base border rounded-lg px-3 focus:border-indigo-500"
                       />
                     </div>
                   </div>

                   <div className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                     <Checkbox
                       checked={watchedPhysicianConsent.consentGiven}
                       onCheckedChange={(checked: boolean | 'indeterminate') => {
                         setValue('physicianConsent.consentGiven', checked === true);
                       }}
                     />
                     <div className="flex-1">
                       <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                         I consent to this validation submission *
                       </label>
                       <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                         By checking this box, I confirm that I have reviewed and validated the clinical data fields 
                         and consent to the submission of this Advanced Clinical Analytics Validation.
                       </p>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                       Additional Notes
                     </label>
                     <Textarea
                       {...register('physicianConsent.additionalNotes')}
                       placeholder="Any additional comments or notes about your validation..."
                       className="min-h-[80px] focus:border-indigo-500"
                     />
                   </div>
                 </CardContent>
               </Card>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onSave}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
              {isSaved && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Saved!</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousTab}
                  disabled={isFirstTab}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                {!isLastTab ? (
                  <Button
                    type="button"
                    variant="default"
                    onClick={goToNextTab}
                    disabled={!canProceedToNext}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || completedTabs !== totalTabs}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Validation</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Completion Status */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {completedTabs}/{totalTabs} tabs completed
                  </span>
                </div>
                {completedTabs === totalTabs && (
                  <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    Ready to Submit
                  </Badge>
                )}
              </div>
            </div>
          </div>
      </form>

      {errors.root && (
          <Alert className="mt-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.root.message}
          </AlertDescription>
        </Alert>
      )}
      </div>
    </div>
  );
} 