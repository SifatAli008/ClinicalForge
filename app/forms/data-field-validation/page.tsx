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
import { CheckCircle, AlertCircle, Info, Save, Send, Brain, Target, Zap, Shield, Users, Activity, FileText, Heart, Clock, MapPin, Settings, TrendingUp, AlertTriangle, CheckSquare, XCircle, Star, ArrowLeft } from 'lucide-react';
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
});

type ValidationFormData = z.infer<typeof validationSchema>;

const decisionModels = [
  {
    model: 'Disease Classification',
    sections: ['Disease Overview', 'Disease Subtypes', 'Family History & Genetics', 'Clinical Staging'],
    dependencies: 'Patient demographics, genetics, and staging',
    clinicalImpact: 'Personalized diagnosis accuracy',
  },
  {
    model: 'Risk Stratification',
    sections: ['Clinical Staging', 'Progression', 'Lab Ranges', 'Monitoring'],
    dependencies: 'Genetic markers, progression patterns',
    clinicalImpact: 'Early intervention triggers',
  },
  {
    model: 'Treatment Optimization',
    sections: ['Medication Protocol', 'Contraindications', 'Comorbidities', 'Pediatric vs. Adult'],
    dependencies: 'Drug interactions, age factors, and comorbidities',
    clinicalImpact: 'Medication safety & efficacy',
  },
  {
    model: 'Emergency Detection',
    sections: ['Symptoms by Stage', 'Red Flags & Emergencies', 'Lab Ranges', 'Misdiagnoses'],
    dependencies: 'Symptom patterns, lab anomalies',
    clinicalImpact: 'Critical care automation',
  },
  {
    model: 'Adherence Prediction',
    sections: ['Lifestyle', 'Monitoring', 'Regional Practices', 'Notes'],
    dependencies: 'Lifestyle factors, regional/cultural differences',
    clinicalImpact: 'Treatment success optimization',
  },
  {
    model: 'Differential Diagnosis',
    sections: ['Misdiagnoses', 'Symptoms by Stage', 'Lab Ranges', 'Red Flags & Emergencies'],
    dependencies: 'Symptom overlap, distinguishing tests',
    clinicalImpact: 'Diagnostic accuracy improvement',
  },
];

const criticalPoints = [
  {
    section: 'Clinical Staging',
    reason: 'Central hub for diagnostic & treatment decisions',
    useCase: 'Stage classification accuracy drives downstream decisions',
    dependencies: '← Disease Overview, Subtypes, Family History → Symptoms, Medication, Progression, Labs',
  },
  {
    section: 'Red Flags & Emergencies',
    reason: 'Life-saving early detection system',
    useCase: 'Emergency prediction models, triage automation',
    dependencies: '← Symptoms, Lab Ranges, Misdiagnoses → Emergency protocols',
  },
  {
    section: 'Pediatric vs. Adult',
    reason: 'Personalized medicine by age group',
    useCase: 'Age-specific treatment algorithms',
    dependencies: '← Clinical Staging, Medication, Lab Ranges → Age-based care planning',
  },
];

const conflictZones = [
  {
    sections: 'Medication Protocol ⊗ Contraindications',
    conflict: 'Drug efficacy vs. risk of nephrotoxicity or adverse effects',
    resolution: 'Requires careful risk-benefit analysis and monitoring protocols',
  },
  {
    sections: 'Comorbidities ⊗ Medication Protocol',
    conflict: 'Drug interactions due to diabetes, hypertension, anemia',
    resolution: 'Multi-drug interaction screening and dose adjustments',
  },
  {
    sections: 'Regional Practices ⊗ Medication Protocol',
    conflict: 'Limited drug access or affordability in rural areas',
    resolution: 'Alternative treatment protocols and resource optimization',
  },
];

const feedbackLoops = [
  {
    loop: 'Monitoring → Progression → Clinical Staging',
    purpose: 'Treatment effectiveness validation',
  },
  {
    loop: 'Misdiagnoses → Red Flags & Emergencies → Symptoms by Stage',
    purpose: 'Diagnostic accuracy improvement',
  },
  {
    loop: 'Cultural/Regional Practices → Adherence Patterns → Treatment Outcomes',
    purpose: 'Health equity optimization',
  },
];

const clinicalSections = [
  { id: 'disease-overview', name: 'Disease Overview', description: 'Basic disease information and demographics' },
  { id: 'subtypes', name: 'Disease Subtypes/Classifications', description: 'Different classifications and subtypes' },
  { id: 'family-history', name: 'Family History & Genetic Risk', description: 'Genetic factors and inheritance patterns' },
  { id: 'clinical-staging', name: 'Clinical Staging', description: 'Disease progression stages and criteria' },
  { id: 'symptoms', name: 'Symptoms by Stage', description: 'Symptom presentation across different stages' },
  { id: 'comorbidities', name: 'Common Comorbidities', description: 'Frequently associated conditions' },
  { id: 'medication', name: 'Medication Protocol', description: 'Treatment protocols and drug information' },
  { id: 'red-flags', name: 'Red Flags & Emergency Conditions', description: 'Critical symptoms requiring immediate attention' },
  { id: 'progression', name: 'Disease Progression Timeline', description: 'Expected progression rates and triggers' },
  { id: 'lifestyle', name: 'Lifestyle Management Guidance', description: 'Diet, exercise, and lifestyle recommendations' },
  { id: 'pediatric-adult', name: 'Pediatric vs. Adult Presentation', description: 'Age-specific differences' },
  { id: 'lab-values', name: 'Lab Value Ranges by Stage', description: 'Laboratory parameters and critical values' },
  { id: 'contraindications', name: 'Contraindications & Treatment Conflicts', description: 'Drug interactions and safety concerns' },
  { id: 'monitoring', name: 'Monitoring & Follow-up Requirements', description: 'Ongoing care and surveillance needs' },
  { id: 'misdiagnoses', name: 'Common Misdiagnoses/Differential Diagnoses', description: 'Conditions that mimic the disease' },
  { id: 'regional-practices', name: 'Regional Practices & Variations', description: 'Geographic and cultural variations' },
  { id: 'additional-notes', name: 'Additional Notes', description: 'Cultural aspects and socioeconomic barriers' },
  { id: 'physician-consent', name: 'Physician Consent & Attribution', description: 'Physician information and consent' },
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
    },
  });

  const watchedDecisionModels = watch('decisionModels');
  const watchedCriticalPoints = watch('criticalPoints');
  const watchedConflictZones = watch('conflictZones');
  const watchedFeedbackLoops = watch('feedbackLoops');
  const watchedSections = watch('sections');

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
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive validation of clinical data fields based on Advanced Clinical Analytics Matrix and decision models.
        </p>
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
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </Button>
              );
            })}
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
                  Evaluate the sufficiency of data fields for each clinical decision model and their clinical impact.
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
                          <strong>Sections:</strong> {model.sections.join(' → ')}
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
                          Sufficient
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
                          placeholder="Describe additional fields, parameters, or sections that would improve this decision model..."
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
                  Evaluate the critical decision points that drive diagnostic and treatment decisions.
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
                          Sufficient
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
                          placeholder="Describe additional fields or parameters needed for this critical decision point..."
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
                  Identify and resolve conflicts between different clinical sections and decision points.
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
                          Resolved
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
                          placeholder="Describe how to resolve this conflict or additional fields needed..."
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
                  Evaluate feedback loops that enable continuous learning and improvement in clinical decision-making.
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
                          Implemented
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
                          placeholder="Describe how to implement this feedback loop or additional fields needed..."
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
                  Evaluate each section for data sufficiency, clinical impact, and data quality.
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
                    Sufficient
                  </label>
                </div>
              </div>
            </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Clinical Impact
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
                          Data Quality
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
                          placeholder="Describe additional fields or parameters that would improve this section..."
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
                  Provide overall feedback on clinical relevance and implementation readiness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                    <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
                      Clinical Relevance
                    </CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      Overall assessment of clinical relevance
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
                      Implementation Readiness
                    </CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      Assessment of implementation readiness
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
                    Additional Sections
            </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
              Suggest completely new sections that should be added to the template
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
                    Overall Feedback
            </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
              General comments about the template structure, usability, or clinical relevance
            </CardDescription>
          </CardHeader>
                <CardContent className="p-6">
            <Textarea
                    placeholder="Share your overall thoughts about the Clinical Logic Collection Template and Advanced Clinical Analytics Matrix..."
                    className="min-h-[120px] focus:border-green-500"
              {...register('overallFeedback')}
            />
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
          
          <Button
            type="submit"
            disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
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