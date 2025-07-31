'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info, Save, Send, Database, Users, Activity, FileText, Shield, Clock, Heart, Stethoscope, MapPin, BookOpen, Settings, UserCheck, ChevronLeft, ChevronRight, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { enhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Comprehensive schema covering all 18 sections
const parameterSchema = z.object({
  // Section 1: Disease Overview
  diseaseName: z.object({
    clinical: z.string().min(1, 'Clinical name is required'),
    common: z.string().optional(),
    icd10Code: z.string().optional(),
    icd11Code: z.string().optional(),
  }),
  diseaseType: z.object({
    primary: z.enum(['acute', 'chronic', 'recurrent', 'congenital']),
    secondary: z.array(z.enum(['acute', 'chronic', 'recurrent', 'congenital'])).optional(),
    severity: z.enum(['moderate', 'severe']).optional(),
  }),
  demographics: z.object({
    typicalAgeOfOnset: z.object({
      min: z.number().min(0, 'Minimum age is required'),
      max: z.number().min(0, 'Maximum age is required'),
      unit: z.enum(['years', 'months', 'days']),
      notes: z.string().optional(),
    }),
    genderPrevalence: z.object({
      male: z.number().min(0, 'Male prevalence is required').max(100, 'Male prevalence must be between 0 and 100'),
      female: z.number().min(0, 'Female prevalence is required').max(100, 'Female prevalence must be between 0 and 100'),
      equal: z.boolean().optional(),
      contextDependent: z.boolean().optional(),
      notes: z.string().optional(),
    }),
  }),
  ruralUrbanDifferences: z.string().optional(),
  
  // Section 2: Disease Subtypes
  subtypes: z.array(z.object({
    name: z.string(),
    diagnosticCriteria: z.string(),
    distinctTreatment: z.boolean(),
    notes: z.string().optional(),
  })),

  // Section 3: Family History & Genetic Risk
  geneticRiskFactors: z.array(z.object({
    riskFactor: z.string(),
    inheritancePattern: z.string(),
    influenceOnOnset: z.string(),
    notes: z.string().optional(),
  })),

  // Section 4: Clinical Staging
  clinicalStages: z.array(z.object({
    stageName: z.string(),
    diagnosticCriteria: z.string(),
    duration: z.string(),
    transitionTriggers: z.string(),
    notes: z.string().optional(),
  })),

  // Section 5: Symptoms by Stage
  symptomsByStage: z.array(z.object({
    stage: z.string(),
    majorSymptoms: z.string(),
    earlySymptoms: z.string(),
    symptomPrevalence: z.string(),
    notes: z.string().optional(),
  })),
  
  // Section 6: Common Comorbidities
  comorbidities: z.array(z.object({
    comorbidity: z.string(),
    frequency: z.string(),
    onsetStage: z.string(),
    complicatesTreatment: z.boolean(),
    notes: z.string().optional(),
  })),

  // Section 7: Medication Protocol
  medications: z.array(z.object({
    stage: z.string(),
    lineOfTreatment: z.string(),
    drugClass: z.string(),
    standardDosage: z.string(),
    triggerToStart: z.string(),
    notes: z.string().optional(),
  })),

  // Section 8: Red Flags & Emergency
  redFlags: z.array(z.object({
    symptom: z.string(),
    stage: z.string(),
    hospitalizationRequired: z.boolean(),
    criticalAction: z.string(),
    notes: z.string().optional(),
  })),

  // Section 9: Disease Progression Timeline
  progressionTimeline: z.array(z.object({
    stage: z.string(),
    averageDuration: z.string(),
    triggersForProgression: z.string(),
    notes: z.string().optional(),
  })),

  // Section 10: Lifestyle Management
  lifestyleManagement: z.array(z.object({
    interventionType: z.string(),
    description: z.string(),
    recommendedStages: z.string(),
    notes: z.string().optional(),
  })),

  // Section 11: Pediatric vs Adult Presentation
  pediatricVsAdult: z.object({
    pediatricPresentation: z.string(),
    adultPresentation: z.string(),
  }),

  // Section 12: Lab Value Ranges
  labValues: z.array(z.object({
    stage: z.string(),
    labName: z.string(),
    expectedRange: z.string(),
    criticalValues: z.string(),
    units: z.string(),
    notes: z.string().optional(),
  })),

  // Section 13: Contraindications
  contraindications: z.array(z.object({
    drugProcedure: z.string(),
    contraindicatedIn: z.string(),
    notes: z.string().optional(),
  })),

  // Section 14: Monitoring & Follow-up
  monitoringRequirements: z.array(z.object({
    stage: z.string(),
    followUpFrequency: z.string(),
    keyMetrics: z.string(),
    notes: z.string().optional(),
  })),

  // Section 15: Common Misdiagnoses
  misdiagnoses: z.array(z.object({
    oftenMisdiagnosedAs: z.string(),
    keyDifferentiators: z.string(),
    notes: z.string().optional(),
  })),

  // Section 16: Regional Practices
  regionalPractices: z.object({
    urbanDiagnosisMethods: z.string(),
    ruralDiagnosisMethods: z.string(),
    urbanMedicationUse: z.string(),
    ruralMedicationUse: z.string(),
    urbanPatientBehavior: z.string(),
    ruralPatientBehavior: z.string(),
  }),

  // Section 17: Additional Notes
  additionalNotes: z.string().optional(),

  // Section 18: Physician Consent
  physicianConsent: z.object({
    physicianName: z.string().optional(),
    institution: z.string().optional(),
    consentForAcknowledgment: z.boolean(),
    consentForResearch: z.boolean(),
    submissionDate: z.string().optional(),
  }),
});

type ParameterFormData = z.infer<typeof parameterSchema>;

const sections = [
  { id: 1, title: 'Disease Overview', icon: Heart, description: 'Basic disease information and demographics' },
  { id: 2, title: 'Disease Subtypes', icon: FileText, description: 'Different subtypes and their characteristics' },
  { id: 3, title: 'Genetic Risk Factors', icon: Users, description: 'Family history and genetic influences' },
  { id: 4, title: 'Clinical Staging', icon: Activity, description: 'Disease progression stages' },
  { id: 5, title: 'Symptoms by Stage', icon: AlertCircle, description: 'Symptoms at different disease stages' },
  { id: 6, title: 'Comorbidities', icon: Shield, description: 'Common associated conditions' },
  { id: 7, title: 'Medication Protocol', icon: Stethoscope, description: 'Treatment medications and protocols' },
  { id: 8, title: 'Red Flags & Emergency', icon: AlertCircle, description: 'Critical symptoms and emergency actions' },
  { id: 9, title: 'Disease Progression', icon: Clock, description: 'Timeline of disease progression' },
  { id: 10, title: 'Lifestyle Management', icon: Settings, description: 'Lifestyle interventions and recommendations' },
  { id: 11, title: 'Pediatric vs Adult', icon: UserCheck, description: 'Age-specific presentations' },
  { id: 12, title: 'Lab Values', icon: Database, description: 'Laboratory value ranges and critical values' },
  { id: 13, title: 'Contraindications', icon: Shield, description: 'Drug and procedure contraindications' },
  { id: 14, title: 'Monitoring & Follow-up', icon: Eye, description: 'Monitoring requirements and follow-up schedules' },
  { id: 15, title: 'Misdiagnoses', icon: BookOpen, description: 'Common misdiagnoses and differentiators' },
  { id: 16, title: 'Regional Practices', icon: MapPin, description: 'Urban vs rural practice differences' },
  { id: 17, title: 'Additional Notes', icon: FileText, description: 'Additional clinical notes and observations' },
  { id: 18, title: 'Physician Consent', icon: UserCheck, description: 'Physician acknowledgment and consent' },
];

export default function ComprehensiveParameterValidationForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showPreviousData, setShowPreviousData] = useState(false);
  const [hasPreviousData, setHasPreviousData] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ParameterFormData>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      diseaseName: { clinical: '', common: '', icd10Code: '', icd11Code: '' },
      diseaseType: { primary: 'chronic', secondary: [], severity: 'moderate' },
      demographics: {
        typicalAgeOfOnset: { min: 0, max: 0, unit: 'years', notes: '' },
        genderPrevalence: { male: 50, female: 50, equal: true, contextDependent: false, notes: '' },
      },
      ruralUrbanDifferences: '',
      subtypes: [],
      geneticRiskFactors: [],
      clinicalStages: [],
      symptomsByStage: [],
      comorbidities: [],
      medications: [],
      redFlags: [],
      progressionTimeline: [],
      lifestyleManagement: [],
      pediatricVsAdult: { pediatricPresentation: '', adultPresentation: '' },
      labValues: [],
      contraindications: [],
      monitoringRequirements: [],
      misdiagnoses: [],
      regionalPractices: {
        urbanDiagnosisMethods: '',
        ruralDiagnosisMethods: '',
        urbanMedicationUse: '',
        ruralMedicationUse: '',
        urbanPatientBehavior: '',
        ruralPatientBehavior: '',
      },
      additionalNotes: '',
      physicianConsent: {
        physicianName: '',
        institution: '',
        consentForAcknowledgment: false,
        consentForResearch: false,
        submissionDate: '',
      },
    },
  });

  // Load previous submission data if available
  React.useEffect(() => {
    const editData = localStorage.getItem('editSubmissionData');
    const submissionId = localStorage.getItem('editSubmissionId');
    
    if (editData && submissionId) {
      try {
        const submission = JSON.parse(editData);
        setHasPreviousData(true);
        
        // Pre-populate form with existing data if comprehensiveData exists
        if (submission.comprehensiveData) {
          const data = submission.comprehensiveData;
          
          // Set disease overview
          if (data.diseaseOverview) {
            if (data.diseaseOverview.diseaseName) {
              form.setValue('diseaseName', data.diseaseOverview.diseaseName);
            }
            if (data.diseaseOverview.diseaseType) {
              form.setValue('diseaseType', data.diseaseOverview.diseaseType);
            }
            if (data.diseaseOverview.demographics) {
              form.setValue('demographics', data.diseaseOverview.demographics);
            }
            if (data.diseaseOverview.ruralUrbanDifferences) {
              form.setValue('ruralUrbanDifferences', data.diseaseOverview.ruralUrbanDifferences);
            }
          }
          
          // Set array fields
          if (data.diseaseSubtypes) {
            form.setValue('subtypes', data.diseaseSubtypes);
          }
          if (data.geneticRiskFactors) {
            form.setValue('geneticRiskFactors', data.geneticRiskFactors);
          }
          if (data.clinicalStages) {
            form.setValue('clinicalStages', data.clinicalStages);
          }
          if (data.symptomsByStage) {
            form.setValue('symptomsByStage', data.symptomsByStage);
          }
          if (data.comorbidities) {
            form.setValue('comorbidities', data.comorbidities);
          }
          if (data.medications) {
            form.setValue('medications', data.medications);
          }
          if (data.redFlags) {
            form.setValue('redFlags', data.redFlags);
          }
          if (data.progressionTimeline) {
            form.setValue('progressionTimeline', data.progressionTimeline);
          }
          if (data.lifestyleManagement) {
            form.setValue('lifestyleManagement', data.lifestyleManagement);
          }
          if (data.pediatricVsAdult) {
            form.setValue('pediatricVsAdult', data.pediatricVsAdult);
          }
          if (data.labValues) {
            form.setValue('labValues', data.labValues);
          }
          if (data.contraindications) {
            form.setValue('contraindications', data.contraindications);
          }
          if (data.monitoringRequirements) {
            form.setValue('monitoringRequirements', data.monitoringRequirements);
          }
          if (data.misdiagnoses) {
            form.setValue('misdiagnoses', data.misdiagnoses);
          }
          if (data.regionalPractices) {
            form.setValue('regionalPractices', data.regionalPractices);
          }
          if (data.additionalNotes) {
            form.setValue('additionalNotes', data.additionalNotes);
          }
          if (data.physicianConsent) {
            form.setValue('physicianConsent', data.physicianConsent);
          }
        }
      } catch (error) {
        console.error('Error loading previous submission data:', error);
      }
    }
  }, [form]);

  // Field arrays for dynamic sections
  const subtypesArray = useFieldArray({
    control: form.control,
    name: 'subtypes',
  });

  const geneticRiskFactorsArray = useFieldArray({
    control: form.control,
    name: 'geneticRiskFactors',
  });

  const clinicalStagesArray = useFieldArray({
    control: form.control,
    name: 'clinicalStages',
  });

  const symptomsByStageArray = useFieldArray({
    control: form.control,
    name: 'symptomsByStage',
  });

  const comorbiditiesArray = useFieldArray({
    control: form.control,
    name: 'comorbidities',
  });

  const medicationsArray = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const redFlagsArray = useFieldArray({
    control: form.control,
    name: 'redFlags',
  });

  const progressionTimelineArray = useFieldArray({
    control: form.control,
    name: 'progressionTimeline',
  });

  const lifestyleManagementArray = useFieldArray({
    control: form.control,
    name: 'lifestyleManagement',
  });

  const labValuesArray = useFieldArray({
    control: form.control,
    name: 'labValues',
  });

  const contraindicationsArray = useFieldArray({
    control: form.control,
    name: 'contraindications',
  });

  const monitoringRequirementsArray = useFieldArray({
    control: form.control,
    name: 'monitoringRequirements',
  });

  const misdiagnosesArray = useFieldArray({
    control: form.control,
    name: 'misdiagnoses',
  });

  const onSubmit = async (data: ParameterFormData) => {
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
      // Transform form data to match database schema
      const databaseData = {
        diseaseOverview: {
          diseaseName: data.diseaseName,
          diseaseType: data.diseaseType,
          demographics: data.demographics,
          ruralUrbanDifferences: data.ruralUrbanDifferences,
        },
        diseaseSubtypes: data.subtypes,
        geneticRiskFactors: data.geneticRiskFactors,
        clinicalStages: data.clinicalStages,
        symptomsByStage: data.symptomsByStage,
        comorbidities: data.comorbidities,
        medications: data.medications,
        redFlags: data.redFlags,
        progressionTimeline: data.progressionTimeline,
        lifestyleManagement: data.lifestyleManagement,
        pediatricVsAdult: data.pediatricVsAdult,
        labValues: data.labValues,
        contraindications: data.contraindications,
        monitoringRequirements: data.monitoringRequirements,
        misdiagnoses: data.misdiagnoses,
        regionalPractices: data.regionalPractices,
        additionalNotes: data.additionalNotes,
        physicianConsent: {
          ...data.physicianConsent,
          submissionDate: new Date().toISOString(),
        },
      };

      // Submit to enhanced clinical database
      const submissionId = await enhancedClinicalDatabaseService.submitComprehensiveParameterValidation(
        { comprehensiveData: databaseData },
        user.uid
      );

      toast({
        title: "Form Submitted Successfully!",
        description: `Submission ID: ${submissionId}. Your comprehensive parameter validation has been saved to the database.`,
        variant: "default",
      });

      // Reset form after successful submission
      form.reset();
      setCurrentSection(1);
      setShowValidation(false);

    } catch (error) {
      console.error('Error submitting form:', error);
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

    setIsSaving(true);
    try {
      const formData = form.getValues();
      
      // Transform form data to match database schema
      const databaseData = {
        diseaseOverview: {
          diseaseName: formData.diseaseName,
          diseaseType: formData.diseaseType,
          demographics: formData.demographics,
          ruralUrbanDifferences: formData.ruralUrbanDifferences,
        },
        diseaseSubtypes: formData.subtypes,
        geneticRiskFactors: formData.geneticRiskFactors,
        clinicalStages: formData.clinicalStages,
        symptomsByStage: formData.symptomsByStage,
        comorbidities: formData.comorbidities,
        medications: formData.medications,
        redFlags: formData.redFlags,
        progressionTimeline: formData.progressionTimeline,
        lifestyleManagement: formData.lifestyleManagement,
        pediatricVsAdult: formData.pediatricVsAdult,
        labValues: formData.labValues,
        contraindications: formData.contraindications,
        monitoringRequirements: formData.monitoringRequirements,
        misdiagnoses: formData.misdiagnoses,
        regionalPractices: formData.regionalPractices,
        additionalNotes: formData.additionalNotes,
        physicianConsent: {
          ...formData.physicianConsent,
          submissionDate: new Date().toISOString(),
        },
      };

      // Save as draft
      const submissionId = await enhancedClinicalDatabaseService.submitComprehensiveParameterValidation(
        { comprehensiveData: databaseData },
        user.uid
      );

      toast({
        title: "Form Saved as Draft",
        description: `Draft saved with ID: ${submissionId}. You can continue editing later.`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Save Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const addArrayItem = (fieldName: keyof ParameterFormData, item: any) => {
    const currentValue = form.getValues(fieldName) as any[];
    form.setValue(fieldName, [...currentValue, item]);
  };

  const removeArrayItem = (fieldName: keyof ParameterFormData, index: number) => {
    const currentValue = form.getValues(fieldName) as any[];
    form.setValue(fieldName, currentValue.filter((_, i) => i !== index));
  };

  const updateArrayItem = (fieldName: keyof ParameterFormData, index: number, item: any) => {
    const currentValue = form.getValues(fieldName) as any[];
    const newValue = [...currentValue];
    newValue[index] = item;
    form.setValue(fieldName, newValue);
  };

  const clearPreviousData = () => {
    // Clear localStorage
    localStorage.removeItem('editSubmissionData');
    localStorage.removeItem('editSubmissionId');
    
    // Reset form to default values
    form.reset();
    
    // Reset states
    setHasPreviousData(false);
    setShowPreviousData(false);
    
    toast({
      title: "Previous Data Cleared",
      description: "Form has been reset to default values.",
      variant: "default",
    });
  };

  const progress = (currentSection / sections.length) * 100;

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
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Comprehensive Parameter Validation Form
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete all 18 sections of the Clinical Logic Collection Template with integrated database storage.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Section {currentSection} of {sections.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Previous Data Toggle */}
        {hasPreviousData && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Previous Submission Data Available
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Your previous submission data has been loaded and preserved.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreviousData(!showPreviousData)}
                      className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      {showPreviousData ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span>Hide Previous Data</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Show Previous Data</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearPreviousData}
                      className="flex items-center space-x-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Clear Data</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={currentSection === section.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(section.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Disease Overview */}
          {currentSection === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Disease Overview</span>
                </CardTitle>
                <CardDescription>
                  Basic disease information and demographics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Disease Name */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Disease Name</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Clinical Name *</label>
                      <Input
                        {...form.register('diseaseName.clinical')}
                        placeholder="e.g., Type 2 Diabetes Mellitus"
                        className={hasPreviousData && form.watch('diseaseName.clinical') ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : ''}
                      />
                      {form.formState.errors.diseaseName?.clinical && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.diseaseName.clinical.message}
                        </p>
                      )}
                      {hasPreviousData && form.watch('diseaseName.clinical') && (
                        <p className="text-blue-600 text-xs mt-1 flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          Previous data loaded
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Common Name</label>
                      <Input
                        {...form.register('diseaseName.common')}
                        placeholder="e.g., Adult-onset diabetes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ICD-10 Code</label>
                      <Input
                        {...form.register('diseaseName.icd10Code')}
                        placeholder="e.g., E11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ICD-11 Code</label>
                      <Input
                        {...form.register('diseaseName.icd11Code')}
                        placeholder="e.g., 5A11"
                      />
                    </div>
                  </div>
                </div>

                {/* Disease Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Disease Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Type *</label>
                      <select
                        {...form.register('diseaseType.primary')}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="acute">Acute</option>
                        <option value="chronic">Chronic</option>
                        <option value="recurrent">Recurrent</option>
                        <option value="congenital">Congenital</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Severity</label>
                      <select
                        {...form.register('diseaseType.severity')}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Demographics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Typical Age of Onset</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500">Min Age</label>
                          <Input
                            type="number"
                            {...form.register('demographics.typicalAgeOfOnset.min', { valueAsNumber: true })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Max Age</label>
                          <Input
                            type="number"
                            {...form.register('demographics.typicalAgeOfOnset.max', { valueAsNumber: true })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Unit</label>
                          <select
                            {...form.register('demographics.typicalAgeOfOnset.unit')}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                          >
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Gender Prevalence (%)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500">Male</label>
                          <Input
                            type="number"
                            {...form.register('demographics.genderPrevalence.male', { valueAsNumber: true })}
                            placeholder="50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Female</label>
                          <Input
                            type="number"
                            {...form.register('demographics.genderPrevalence.female', { valueAsNumber: true })}
                            placeholder="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rural/Urban Differences */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rural vs Urban Differences</label>
                  <Textarea
                    {...form.register('ruralUrbanDifferences')}
                    placeholder="Describe any differences in disease presentation or management between rural and urban areas..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 2: Disease Subtypes */}
          {currentSection === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Disease Subtypes</span>
                </CardTitle>
                <CardDescription>
                  Different subtypes and their characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {subtypesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Subtype Name</label>
                          <Input
                            {...form.register(`subtypes.${index}.name`)}
                            placeholder="e.g., Type 2A - Insulin Resistant"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Distinct Treatment?</label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              {...form.register(`subtypes.${index}.distinctTreatment`)}
                            />
                            <Label>Yes</Label>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Diagnostic Criteria</label>
                        <Textarea
                          {...form.register(`subtypes.${index}.diagnosticCriteria`)}
                          placeholder="Describe the diagnostic criteria for this subtype..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`subtypes.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {subtypesArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => subtypesArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => subtypesArray.append({
                      name: '',
                      diagnosticCriteria: '',
                      distinctTreatment: false,
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subtype
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 3: Genetic Risk Factors */}
          {currentSection === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Genetic Risk Factors</span>
                </CardTitle>
                <CardDescription>
                  Family history and genetic influences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {geneticRiskFactorsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Risk Factor</label>
                          <Input
                            {...form.register(`geneticRiskFactors.${index}.riskFactor`)}
                            placeholder="e.g., Family history of diabetes"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Inheritance Pattern</label>
                          <Input
                            {...form.register(`geneticRiskFactors.${index}.inheritancePattern`)}
                            placeholder="e.g., Polygenic, Autosomal"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Influence on Onset</label>
                        <Textarea
                          {...form.register(`geneticRiskFactors.${index}.influenceOnOnset`)}
                          placeholder="Describe how this factor influences disease onset..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`geneticRiskFactors.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {geneticRiskFactorsArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => geneticRiskFactorsArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => geneticRiskFactorsArray.append({
                      riskFactor: '',
                      inheritancePattern: '',
                      influenceOnOnset: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Genetic Risk Factor
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 4: Clinical Staging */}
          {currentSection === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Clinical Staging</span>
                </CardTitle>
                <CardDescription>
                  Disease progression stages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {clinicalStagesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage Name</label>
                          <Input
                            {...form.register(`clinicalStages.${index}.stageName`)}
                            placeholder="e.g., Stage 1 (Early)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration</label>
                          <Input
                            {...form.register(`clinicalStages.${index}.duration`)}
                            placeholder="e.g., 2-5 years"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Diagnostic Criteria</label>
                        <Textarea
                          {...form.register(`clinicalStages.${index}.diagnosticCriteria`)}
                          placeholder="Describe diagnostic criteria for this stage..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Transition Triggers</label>
                        <Textarea
                          {...form.register(`clinicalStages.${index}.transitionTriggers`)}
                          placeholder="What triggers progression to next stage..."
                          rows={2}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`clinicalStages.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {clinicalStagesArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => clinicalStagesArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => clinicalStagesArray.append({
                      stageName: '',
                      diagnosticCriteria: '',
                      duration: '',
                      transitionTriggers: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Clinical Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 5: Symptoms by Stage */}
          {currentSection === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Symptoms by Stage</span>
                </CardTitle>
                <CardDescription>
                  Symptoms at different disease stages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {symptomsByStageArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage</label>
                          <Input
                            {...form.register(`symptomsByStage.${index}.stage`)}
                            placeholder="e.g., Early, Moderate, Advanced"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Symptom Prevalence (%)</label>
                          <Input
                            {...form.register(`symptomsByStage.${index}.symptomPrevalence`)}
                            placeholder="e.g., 80%"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Major Symptoms</label>
                        <Textarea
                          {...form.register(`symptomsByStage.${index}.majorSymptoms`)}
                          placeholder="Describe major symptoms for this stage..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Early/Hidden Symptoms</label>
                        <Textarea
                          {...form.register(`symptomsByStage.${index}.earlySymptoms`)}
                          placeholder="Describe early or hidden symptoms..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`symptomsByStage.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {symptomsByStageArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => symptomsByStageArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => symptomsByStageArray.append({
                      stage: '',
                      majorSymptoms: '',
                      earlySymptoms: '',
                      symptomPrevalence: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Symptoms by Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 6: Comorbidities */}
          {currentSection === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Comorbidities</span>
                </CardTitle>
                <CardDescription>
                  Common associated conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {comorbiditiesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Comorbidity</label>
                          <Input
                            {...form.register(`comorbidities.${index}.comorbidity`)}
                            placeholder="e.g., Hypertension"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Frequency (%)</label>
                          <Input
                            {...form.register(`comorbidities.${index}.frequency`)}
                            placeholder="e.g., 70%"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Onset Stage</label>
                          <Input
                            {...form.register(`comorbidities.${index}.onsetStage`)}
                            placeholder="e.g., Any stage"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Complicates Treatment?</label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            {...form.register(`comorbidities.${index}.complicatesTreatment`)}
                          />
                          <Label>Yes</Label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`comorbidities.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {comorbiditiesArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => comorbiditiesArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => comorbiditiesArray.append({
                      comorbidity: '',
                      frequency: '',
                      onsetStage: '',
                      complicatesTreatment: false,
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Comorbidity
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 7: Medication Protocol */}
          {currentSection === 7 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Medication Protocol</span>
                </CardTitle>
                <CardDescription>
                  Treatment medications and protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {medicationsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage</label>
                          <Input
                            {...form.register(`medications.${index}.stage`)}
                            placeholder="e.g., Early, Moderate, Advanced"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Line of Treatment</label>
                          <Input
                            {...form.register(`medications.${index}.lineOfTreatment`)}
                            placeholder="e.g., First line, Second line"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Drug Class</label>
                          <Input
                            {...form.register(`medications.${index}.drugClass`)}
                            placeholder="e.g., Biguanides, Sulfonylureas"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Standard Dosage</label>
                          <Input
                            {...form.register(`medications.${index}.standardDosage`)}
                            placeholder="e.g., 500-2000mg daily"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Trigger to Start</label>
                        <Textarea
                          {...form.register(`medications.${index}.triggerToStart`)}
                          placeholder="When to start this medication..."
                          rows={2}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`medications.${index}.notes`)}
                          placeholder="Side effects, cost, etc..."
                          rows={2}
                        />
                      </div>
                      {medicationsArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => medicationsArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => medicationsArray.append({
                      stage: '',
                      lineOfTreatment: '',
                      drugClass: '',
                      standardDosage: '',
                      triggerToStart: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 8: Red Flags & Emergency */}
          {currentSection === 8 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Red Flags & Emergency</span>
                </CardTitle>
                <CardDescription>
                  Critical symptoms and emergency actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {redFlagsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Symptom/Event</label>
                          <Input
                            {...form.register(`redFlags.${index}.symptom`)}
                            placeholder="e.g., Severe hyperglycemia"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage When Appears</label>
                          <Input
                            {...form.register(`redFlags.${index}.stage`)}
                            placeholder="e.g., Any stage"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Hospitalization Required?</label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            {...form.register(`redFlags.${index}.hospitalizationRequired`)}
                          />
                          <Label>Yes</Label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Critical Action Required</label>
                        <Textarea
                          {...form.register(`redFlags.${index}.criticalAction`)}
                          placeholder="What action should be taken..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`redFlags.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {redFlagsArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => redFlagsArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => redFlagsArray.append({
                      symptom: '',
                      stage: '',
                      hospitalizationRequired: false,
                      criticalAction: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Red Flag
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 9: Disease Progression Timeline */}
          {currentSection === 9 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Disease Progression Timeline</span>
                </CardTitle>
                <CardDescription>
                  Timeline of disease progression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {progressionTimelineArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage</label>
                          <Input
                            {...form.register(`progressionTimeline.${index}.stage`)}
                            placeholder="e.g., Early, Moderate, Advanced"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Average Duration</label>
                          <Input
                            {...form.register(`progressionTimeline.${index}.averageDuration`)}
                            placeholder="e.g., 2-5 years"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Triggers for Progression</label>
                        <Textarea
                          {...form.register(`progressionTimeline.${index}.triggersForProgression`)}
                          placeholder="What triggers progression to next stage..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`progressionTimeline.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {progressionTimelineArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => progressionTimelineArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => progressionTimelineArray.append({
                      stage: '',
                      averageDuration: '',
                      triggersForProgression: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Progression Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 10: Lifestyle Management */}
          {currentSection === 10 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Lifestyle Management</span>
                </CardTitle>
                <CardDescription>
                  Lifestyle interventions and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {lifestyleManagementArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Intervention Type</label>
                          <Input
                            {...form.register(`lifestyleManagement.${index}.interventionType`)}
                            placeholder="e.g., Diet, Exercise, Other"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Recommended Stage(s)</label>
                          <Input
                            {...form.register(`lifestyleManagement.${index}.recommendedStages`)}
                            placeholder="e.g., All stages"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          {...form.register(`lifestyleManagement.${index}.description`)}
                          placeholder="Describe the lifestyle intervention..."
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`lifestyleManagement.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {lifestyleManagementArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => lifestyleManagementArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => lifestyleManagementArray.append({
                      interventionType: '',
                      description: '',
                      recommendedStages: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lifestyle Intervention
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 11: Pediatric vs Adult Presentation */}
          {currentSection === 11 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Pediatric vs Adult Presentation</span>
                </CardTitle>
                <CardDescription>
                  Age-specific presentations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pediatric Presentation</label>
                    <Textarea
                      {...form.register('pediatricVsAdult.pediatricPresentation')}
                      placeholder="Describe unique features of pediatric presentation..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Adult Presentation</label>
                    <Textarea
                      {...form.register('pediatricVsAdult.adultPresentation')}
                      placeholder="Describe unique features of adult presentation..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 12: Lab Values */}
          {currentSection === 12 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Lab Values</span>
                </CardTitle>
                <CardDescription>
                  Laboratory value ranges and critical values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {labValuesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage</label>
                          <Input
                            {...form.register(`labValues.${index}.stage`)}
                            placeholder="e.g., All stages"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Lab Name</label>
                          <Input
                            {...form.register(`labValues.${index}.labName`)}
                            placeholder="e.g., HbA1c"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Units</label>
                          <Input
                            {...form.register(`labValues.${index}.units`)}
                            placeholder="e.g., %"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Expected Range</label>
                        <Textarea
                          {...form.register(`labValues.${index}.expectedRange`)}
                          placeholder="e.g., 5.7-6.4% (prediabetes), ≥6.5% (diabetes)"
                          rows={2}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Critical Values</label>
                        <Textarea
                          {...form.register(`labValues.${index}.criticalValues`)}
                          placeholder="e.g., >8%"
                          rows={2}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`labValues.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {labValuesArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => labValuesArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => labValuesArray.append({
                      stage: '',
                      labName: '',
                      expectedRange: '',
                      criticalValues: '',
                      units: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lab Value
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 13: Contraindications */}
          {currentSection === 13 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Contraindications</span>
                </CardTitle>
                <CardDescription>
                  Drug and procedure contraindications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {contraindicationsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Drug/Procedure</label>
                          <Input
                            {...form.register(`contraindications.${index}.drugProcedure`)}
                            placeholder="e.g., Metformin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Contraindicated In</label>
                          <Input
                            {...form.register(`contraindications.${index}.contraindicatedIn`)}
                            placeholder="e.g., Severe kidney disease"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`contraindications.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>
                      {contraindicationsArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => contraindicationsArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => contraindicationsArray.append({
                      drugProcedure: '',
                      contraindicatedIn: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contraindication
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 14: Monitoring & Follow-up */}
          {currentSection === 14 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Monitoring & Follow-up</span>
                </CardTitle>
                <CardDescription>
                  Monitoring requirements and follow-up schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {monitoringRequirementsArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Stage</label>
                          <Input
                            {...form.register(`monitoringRequirements.${index}.stage`)}
                            placeholder="e.g., All stages"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Follow-up Frequency</label>
                          <Input
                            {...form.register(`monitoringRequirements.${index}.followUpFrequency`)}
                            placeholder="e.g., Every 3-6 months"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Key Metrics to Monitor</label>
                        <Textarea
                          {...form.register(`monitoringRequirements.${index}.keyMetrics`)}
                          placeholder="e.g., HbA1c, blood pressure, lipids"
                          rows={3}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`monitoringRequirements.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={2}
                        />
                      </div>
                      {monitoringRequirementsArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => monitoringRequirementsArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => monitoringRequirementsArray.append({
                      stage: '',
                      followUpFrequency: '',
                      keyMetrics: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Monitoring Requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 15: Misdiagnoses */}
          {currentSection === 15 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Common Misdiagnoses</span>
                </CardTitle>
                <CardDescription>
                  Common misdiagnoses and differentiators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {misdiagnosesArray.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Often Misdiagnosed As</label>
                          <Input
                            {...form.register(`misdiagnoses.${index}.oftenMisdiagnosedAs`)}
                            placeholder="e.g., Type 1 Diabetes"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Key Differentiators</label>
                          <Input
                            {...form.register(`misdiagnoses.${index}.keyDifferentiators`)}
                            placeholder="e.g., Age, autoantibodies"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <Textarea
                          {...form.register(`misdiagnoses.${index}.notes`)}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>
                      {misdiagnosesArray.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => misdiagnosesArray.remove(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => misdiagnosesArray.append({
                      oftenMisdiagnosedAs: '',
                      keyDifferentiators: '',
                      notes: ''
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Misdiagnosis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 16: Regional Practices */}
          {currentSection === 16 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Regional Practices</span>
                </CardTitle>
                <CardDescription>
                  Urban vs rural practice differences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Urban Diagnosis Methods</label>
                      <Textarea
                        {...form.register('regionalPractices.urbanDiagnosisMethods')}
                        placeholder="Describe diagnosis methods in urban areas..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rural Diagnosis Methods</label>
                      <Textarea
                        {...form.register('regionalPractices.ruralDiagnosisMethods')}
                        placeholder="Describe diagnosis methods in rural areas..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Urban Medication Use</label>
                      <Textarea
                        {...form.register('regionalPractices.urbanMedicationUse')}
                        placeholder="Describe medication use in urban areas..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rural Medication Use</label>
                      <Textarea
                        {...form.register('regionalPractices.ruralMedicationUse')}
                        placeholder="Describe medication use in rural areas..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Urban Patient Behavior</label>
                      <Textarea
                        {...form.register('regionalPractices.urbanPatientBehavior')}
                        placeholder="Describe patient behavior in urban areas..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rural Patient Behavior</label>
                      <Textarea
                        {...form.register('regionalPractices.ruralPatientBehavior')}
                        placeholder="Describe patient behavior in rural areas..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 17: Additional Notes */}
          {currentSection === 17 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Additional Notes</span>
                </CardTitle>
                <CardDescription>
                  Additional clinical notes and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <Textarea
                      {...form.register('additionalNotes')}
                      placeholder="Cultural aspects, socioeconomic barriers, and other relevant observations..."
                      rows={8}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 18: Physician Consent */}
          {currentSection === 18 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Physician Consent</span>
                </CardTitle>
                <CardDescription>
                  Physician acknowledgment and consent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Physician Name</label>
                      <Input
                        {...form.register('physicianConsent.physicianName')}
                        placeholder="e.g., Dr. John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Institution</label>
                      <Input
                        {...form.register('physicianConsent.institution')}
                        placeholder="e.g., City General Hospital"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        {...form.register('physicianConsent.consentForAcknowledgment')}
                      />
                      <Label>Consent for Acknowledgment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        {...form.register('physicianConsent.consentForResearch')}
                      />
                      <Label>Consent to Use Data in Research</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </Button>

              {currentSection === sections.length ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Success Message */}
        {showValidation && (
          <Alert className="mt-8 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Form validation successful! All required fields are complete.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
} 