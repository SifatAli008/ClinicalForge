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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Comprehensive schema covering all 18 sections
const parameterSchema = z.object({
  // Section 1: Disease Overview
  diseaseName: z.string().min(1, 'Disease name is required'),
  commonTerm: z.string().optional(),
  diseaseType: z.enum(['acute', 'chronic', 'recurrent', 'congenital']),
  ageOfOnset: z.string().min(1, 'Age of onset is required'),
  genderPrevalence: z.enum(['male', 'female', 'equal', 'context-dependent']),
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
  
  // Section 8: Red Flags
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
  pediatricPresentation: z.string(),
  adultPresentation: z.string(),

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
  physicianName: z.string().optional(),
  institution: z.string().optional(),
  consentForAcknowledgment: z.boolean(),
  consentForResearch: z.boolean(),
  submissionDate: z.string().optional(),
});

type ParameterFormData = z.infer<typeof parameterSchema>;

// Initial data for all sections
const initialSubtypes = [
  { name: '', diagnosticCriteria: '', distinctTreatment: false, notes: '' },
  { name: '', diagnosticCriteria: '', distinctTreatment: false, notes: '' },
];

const initialGeneticRiskFactors = [
  { riskFactor: '', inheritancePattern: '', influenceOnOnset: '', notes: '' },
  { riskFactor: '', inheritancePattern: '', influenceOnOnset: '', notes: '' },
];

const initialClinicalStages = [
  { stageName: 'Stage 1 (Early)', diagnosticCriteria: '', duration: '', transitionTriggers: '', notes: '' },
  { stageName: 'Stage 2 (Moderate)', diagnosticCriteria: '', duration: '', transitionTriggers: '', notes: '' },
  { stageName: 'Stage 3 (Severe)', diagnosticCriteria: '', duration: '', transitionTriggers: '', notes: '' },
];

const initialSymptomsByStage = [
  { stage: 'Early', majorSymptoms: '', earlySymptoms: '', symptomPrevalence: '', notes: '' },
  { stage: 'Moderate', majorSymptoms: '', earlySymptoms: '', symptomPrevalence: '', notes: '' },
  { stage: 'Advanced', majorSymptoms: '', earlySymptoms: '', symptomPrevalence: '', notes: '' },
];

const initialComorbidities = [
  { comorbidity: '', frequency: '', onsetStage: '', complicatesTreatment: false, notes: '' },
  { comorbidity: '', frequency: '', onsetStage: '', complicatesTreatment: false, notes: '' },
];

const initialMedications = [
  { stage: 'Early', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
  { stage: 'Moderate', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
  { stage: 'Advanced', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
];

const initialRedFlags = [
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '', notes: '' },
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '', notes: '' },
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '', notes: '' },
];

const initialProgressionTimeline = [
  { stage: 'Early', averageDuration: '', triggersForProgression: '', notes: '' },
  { stage: 'Moderate', averageDuration: '', triggersForProgression: '', notes: '' },
  { stage: 'Advanced', averageDuration: '', triggersForProgression: '', notes: '' },
];

const initialLifestyleManagement = [
  { interventionType: 'Diet', description: '', recommendedStages: '', notes: '' },
  { interventionType: 'Exercise', description: '', recommendedStages: '', notes: '' },
  { interventionType: 'Other', description: '', recommendedStages: '', notes: '' },
];

const initialLabValues = [
  { stage: 'Early', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
  { stage: 'Moderate', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
  { stage: 'Advanced', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
];

const initialContraindications = [
  { drugProcedure: '', contraindicatedIn: '', notes: '' },
  { drugProcedure: '', contraindicatedIn: '', notes: '' },
];

const initialMonitoringRequirements = [
  { stage: 'Early', followUpFrequency: '', keyMetrics: '', notes: '' },
  { stage: 'Moderate', followUpFrequency: '', keyMetrics: '', notes: '' },
  { stage: 'Advanced', followUpFrequency: '', keyMetrics: '', notes: '' },
];

const initialMisdiagnoses = [
  { oftenMisdiagnosedAs: '', keyDifferentiators: '', notes: '' },
  { oftenMisdiagnosedAs: '', keyDifferentiators: '', notes: '' },
];

export default function ParameterValidationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [showProgress, setShowProgress] = useState(true);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ParameterFormData>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      subtypes: initialSubtypes,
      geneticRiskFactors: initialGeneticRiskFactors,
      clinicalStages: initialClinicalStages,
      symptomsByStage: initialSymptomsByStage,
      comorbidities: initialComorbidities,
      medications: initialMedications,
      redFlags: initialRedFlags,
      progressionTimeline: initialProgressionTimeline,
      lifestyleManagement: initialLifestyleManagement,
      labValues: initialLabValues,
      contraindications: initialContraindications,
      monitoringRequirements: initialMonitoringRequirements,
      misdiagnoses: initialMisdiagnoses,
      regionalPractices: {
        urbanDiagnosisMethods: '',
        ruralDiagnosisMethods: '',
        urbanMedicationUse: '',
        ruralMedicationUse: '',
        urbanPatientBehavior: '',
        ruralPatientBehavior: '',
      },
      consentForAcknowledgment: false,
      consentForResearch: false,
    },
  });

  const watchedSubtypes = watch('subtypes');
  const watchedGeneticRiskFactors = watch('geneticRiskFactors');
  const watchedClinicalStages = watch('clinicalStages');
  const watchedSymptomsByStage = watch('symptomsByStage');
  const watchedComorbidities = watch('comorbidities');
  const watchedMedications = watch('medications');
  const watchedRedFlags = watch('redFlags');
  const watchedProgressionTimeline = watch('progressionTimeline');
  const watchedLifestyleManagement = watch('lifestyleManagement');
  const watchedLabValues = watch('labValues');
  const watchedContraindications = watch('contraindications');
  const watchedMonitoringRequirements = watch('monitoringRequirements');
  const watchedMisdiagnoses = watch('misdiagnoses');

  const onSubmit = async (data: ParameterFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Comprehensive parameter validation submitted:', data);
      setIsSaved(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSave = async () => {
    const formData = watch();
    try {
      localStorage.setItem('comprehensive-parameter-validation-draft', JSON.stringify(formData));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const sections = [
    { id: 1, title: 'Disease Overview', icon: Database, color: 'bg-blue-500', description: 'Basic disease parameters and demographics' },
    { id: 2, title: 'Disease Subtypes', icon: FileText, color: 'bg-green-500', description: 'Different subtypes and their characteristics' },
    { id: 3, title: 'Family History & Genetic Risk', icon: Users, color: 'bg-purple-500', description: 'Genetic risk factors and inheritance patterns' },
    { id: 4, title: 'Clinical Staging', icon: Activity, color: 'bg-orange-500', description: 'Disease stages and progression criteria' },
    { id: 5, title: 'Symptoms by Stage', icon: Stethoscope, color: 'bg-red-500', description: 'Symptoms for each disease stage' },
    { id: 6, title: 'Common Comorbidities', icon: Heart, color: 'bg-pink-500', description: 'Conditions that commonly occur with the primary disease' },
    { id: 7, title: 'Medication Protocol', icon: Shield, color: 'bg-indigo-500', description: 'Treatment protocols for each disease stage' },
    { id: 8, title: 'Red Flags & Emergency', icon: AlertCircle, color: 'bg-red-600', description: 'Critical symptoms requiring immediate attention' },
    { id: 9, title: 'Disease Progression', icon: Clock, color: 'bg-yellow-500', description: 'Timeline and triggers for disease progression' },
    { id: 10, title: 'Lifestyle Management', icon: BookOpen, color: 'bg-teal-500', description: 'Lifestyle interventions for disease management' },
    { id: 11, title: 'Pediatric vs Adult', icon: UserCheck, color: 'bg-cyan-500', description: 'Differences between age groups' },
    { id: 12, title: 'Lab Value Ranges', icon: Database, color: 'bg-blue-600', description: 'Expected laboratory parameters for each stage' },
    { id: 13, title: 'Contraindications', icon: AlertCircle, color: 'bg-red-700', description: 'Drugs or procedures that are contraindicated' },
    { id: 14, title: 'Monitoring & Follow-up', icon: Settings, color: 'bg-gray-500', description: 'Monitoring requirements for each stage' },
    { id: 15, title: 'Common Misdiagnoses', icon: FileText, color: 'bg-amber-500', description: 'Conditions commonly confused with the primary disease' },
    { id: 16, title: 'Regional Practices', icon: MapPin, color: 'bg-emerald-500', description: 'Differences between urban and rural practice patterns' },
    { id: 17, title: 'Additional Notes', icon: Info, color: 'bg-slate-500', description: 'Cultural aspects, socioeconomic barriers, and other observations' },
    { id: 18, title: 'Physician Consent', icon: UserCheck, color: 'bg-green-600', description: 'Physician information and consent for data use' },
  ];

  const progressPercentage = (activeSection / sections.length) * 100;

  const nextSection = () => {
    if (activeSection < sections.length) {
      setActiveSection(activeSection + 1);
    }
  };

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Comprehensive Parameter Validation Form
        </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete clinical logic collection template with all 18 sections for comprehensive parameter validation.
        </p>
      </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress: {activeSection} of {sections.length} sections
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        )}

        {/* Enhanced Section Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Section Navigation</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProgress(!showProgress)}
              className="flex items-center space-x-2"
            >
              {showProgress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showProgress ? 'Hide' : 'Show'} Progress</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isCompleted = activeSection > section.id;
              
              return (
                <Button
                  key={section.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center space-y-1 h-auto py-3 px-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                      : isCompleted 
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${section.color} text-white text-xs font-bold`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {section.title}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Current Section Header */}
        <div className="mb-6">
          {sections.map((section) => {
            if (section.id === activeSection) {
              const Icon = section.icon;
              return (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${section.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Section {section.id}: {section.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{section.description}</p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Instructions:</strong> This comprehensive form covers all 18 sections of the Clinical Logic Collection Template. 
            Fill in each section to create a complete parameter validation framework for your disease.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Disease Overview */}
          {activeSection === 1 && (
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-blue-900 dark:text-blue-100">
                  <Database className="h-6 w-6" />
                  <span>Section 1: Disease Overview</span>
            </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
              Core disease parameters and demographics
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Disease Name (Clinical) *
                </label>
                <Input
                  placeholder="e.g., Type 2 Diabetes Mellitus"
                  {...register('diseaseName')}
                      className={`h-12 text-base ${errors.diseaseName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                />
                {errors.diseaseName && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.diseaseName.message}</span>
                      </p>
                )}
              </div>
              
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Common/Layman Term
                </label>
                <Input
                  placeholder="e.g., Adult-onset diabetes"
                  {...register('commonTerm')}
                      className="h-12 text-base focus:border-blue-500"
                />
              </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Disease Type *
                </label>
                <select
                  {...register('diseaseType')}
                      className="w-full h-12 text-base border rounded-lg px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                      <option value="">Select disease type</option>
                  <option value="acute">Acute</option>
                  <option value="chronic">Chronic</option>
                  <option value="recurrent">Recurrent</option>
                  <option value="congenital">Congenital</option>
                </select>
                {errors.diseaseType && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.diseaseType.message}</span>
                      </p>
                )}
              </div>
              
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Typical Age of Onset *
                </label>
                <Input
                  placeholder="e.g., 40-60 years"
                  {...register('ageOfOnset')}
                      className={`h-12 text-base ${errors.ageOfOnset ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                />
                {errors.ageOfOnset && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.ageOfOnset.message}</span>
                      </p>
                )}
              </div>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Gender Prevalence *
                </label>
                <select
                  {...register('genderPrevalence')}
                      className="w-full h-12 text-base border rounded-lg px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                      <option value="">Select gender prevalence</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="equal">Equal</option>
                  <option value="context-dependent">Context-dependent</option>
                </select>
                {errors.genderPrevalence && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.genderPrevalence.message}</span>
                      </p>
                )}
              </div>
              
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Rural/Urban Differences
                </label>
                <Input
                  placeholder="e.g., Higher prevalence in urban areas"
                  {...register('ruralUrbanDifferences')}
                      className="h-12 text-base focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
          )}

          {/* Section 2: Disease Subtypes */}
          {activeSection === 2 && (
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-green-900 dark:text-green-100">
                  <FileText className="h-6 w-6" />
                  <span>Section 2: Disease Subtypes / Classifications</span>
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Define different subtypes and their characteristics
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedSubtypes.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-green-200 dark:border-green-800">
                      <h4 className="font-medium mb-3 text-green-900 dark:text-green-100">Subtype {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">Subtype Name</label>
                      <Input
                            placeholder="e.g., Type 2A, Type 2B"
                            {...register(`subtypes.${index}.name`)}
                            className="h-10 text-base focus:border-green-500"
                      />
                    </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register(`subtypes.${index}.distinctTreatment`)}
                            className="rounded text-green-600 dark:text-green-400 focus:ring-green-500"
                          />
                          <label className="text-sm font-medium text-green-700 dark:text-green-300">Distinct Treatment (Y/N)</label>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">Diagnostic Criteria / Features</label>
                          <Textarea
                            placeholder="Describe the specific diagnostic criteria and features..."
                            {...register(`subtypes.${index}.diagnosticCriteria`)}
                            className="h-24 text-base focus:border-green-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`subtypes.${index}.notes`)}
                            className="h-24 text-base focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 3: Family History & Genetic Risk */}
          {activeSection === 3 && (
            <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-purple-900 dark:text-purple-100">
                  <Users className="h-6 w-6" />
                  <span>Section 3: Family History & Genetic Risk</span>
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Document family history and genetic risk factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedGeneticRiskFactors.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium mb-3 text-purple-900 dark:text-purple-100">Risk Factor {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">Risk Factor</label>
                      <Input
                            placeholder="e.g., Genetic mutation, Family history"
                            {...register(`geneticRiskFactors.${index}.riskFactor`)}
                            className="h-10 text-base focus:border-purple-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">Inheritance Pattern</label>
                      <Input
                            placeholder="e.g., Autosomal dominant, Autosomal recessive"
                            {...register(`geneticRiskFactors.${index}.inheritancePattern`)}
                            className="h-10 text-base focus:border-purple-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">Influence on Onset</label>
                      <Input
                            placeholder="e.g., Early onset, Late onset"
                            {...register(`geneticRiskFactors.${index}.influenceOnOnset`)}
                            className="h-10 text-base focus:border-purple-500"
                      />
                    </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">Notes</label>
                      <Textarea
                            placeholder="Additional notes..."
                            {...register(`geneticRiskFactors.${index}.notes`)}
                            className="h-24 text-base focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          )}

          {/* Section 4: Clinical Staging */}
          {activeSection === 4 && (
            <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-orange-900 dark:text-orange-100">
                  <Activity className="h-6 w-6" />
                  <span>Section 4: Clinical Staging</span>
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Define clinical staging criteria and progression
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedClinicalStages.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800">
                      <h4 className="font-medium mb-3 text-orange-900 dark:text-orange-100">Stage {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-orange-700 dark:text-orange-300">Stage Name</label>
                          <Input
                            placeholder="e.g., Stage 1, Stage 2"
                            {...register(`clinicalStages.${index}.stageName`)}
                            className="h-10 text-base focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-orange-700 dark:text-orange-300">Diagnostic Criteria</label>
                          <Textarea
                            placeholder="Describe the diagnostic criteria for this stage..."
                            {...register(`clinicalStages.${index}.diagnosticCriteria`)}
                            className="h-24 text-base focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-orange-700 dark:text-orange-300">Duration</label>
                          <Input
                            placeholder="e.g., Months, Years"
                            {...register(`clinicalStages.${index}.duration`)}
                            className="h-10 text-base focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-orange-700 dark:text-orange-300">Transition Triggers</label>
                          <Input
                            placeholder="e.g., Medication change, Symptom worsening"
                            {...register(`clinicalStages.${index}.transitionTriggers`)}
                            className="h-10 text-base focus:border-orange-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-orange-700 dark:text-orange-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`clinicalStages.${index}.notes`)}
                            className="h-24 text-base focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 5: Symptoms by Stage */}
          {activeSection === 5 && (
            <Card className="border-2 border-red-200 dark:border-red-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-red-900 dark:text-red-100">
                  <Stethoscope className="h-6 w-6" />
                  <span>Section 5: Symptoms by Stage</span>
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300">
                  Define major and early symptoms for each clinical stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedSymptomsByStage.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
                      <h4 className="font-medium mb-3 text-red-900 dark:text-red-100">Stage {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Major Symptoms</label>
                          <Textarea
                            placeholder="Describe the major symptoms of this stage..."
                            {...register(`symptomsByStage.${index}.majorSymptoms`)}
                            className="h-24 text-base focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Early Symptoms</label>
                          <Textarea
                            placeholder="Describe the early symptoms of this stage..."
                            {...register(`symptomsByStage.${index}.earlySymptoms`)}
                            className="h-24 text-base focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Symptom Prevalence</label>
                          <Input
                            placeholder="e.g., 80%, 20%"
                            {...register(`symptomsByStage.${index}.symptomPrevalence`)}
                            className="h-10 text-base focus:border-red-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`symptomsByStage.${index}.notes`)}
                            className="h-24 text-base focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 6: Common Comorbidities */}
          {activeSection === 6 && (
            <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-pink-900 dark:text-pink-100">
                  <Heart className="h-6 w-6" />
                  <span>Section 6: Common Comorbidities</span>
                </CardTitle>
                <CardDescription className="text-pink-700 dark:text-pink-300">
                  List common comorbidities and their frequency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedComorbidities.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-pink-200 dark:border-pink-800">
                      <h4 className="font-medium mb-3 text-pink-900 dark:text-pink-100">Comorbidity {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-pink-700 dark:text-pink-300">Comorbidity</label>
                          <Input
                            placeholder="e.g., Hypertension, Depression"
                            {...register(`comorbidities.${index}.comorbidity`)}
                            className="h-10 text-base focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-pink-700 dark:text-pink-300">Frequency</label>
                          <Input
                            placeholder="e.g., 50%, 10%"
                            {...register(`comorbidities.${index}.frequency`)}
                            className="h-10 text-base focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-pink-700 dark:text-pink-300">Onset Stage</label>
                          <Input
                            placeholder="e.g., Any stage, Early stage"
                            {...register(`comorbidities.${index}.onsetStage`)}
                            className="h-10 text-base focus:border-pink-500"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register(`comorbidities.${index}.complicatesTreatment`)}
                            className="rounded text-pink-600 dark:text-pink-400 focus:ring-pink-500"
                          />
                          <label className="text-sm font-medium text-pink-700 dark:text-pink-300">Complicates Treatment</label>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-pink-700 dark:text-pink-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`comorbidities.${index}.notes`)}
                            className="h-24 text-base focus:border-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 7: Medication Protocol */}
          {activeSection === 7 && (
            <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-indigo-900 dark:text-indigo-100">
                  <Shield className="h-6 w-6" />
                  <span>Section 7: Medication Protocol</span>
                </CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300">
                  Define treatment protocols for each clinical stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
              {watchedMedications.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800">
                      <h4 className="font-medium mb-3 text-indigo-900 dark:text-indigo-100">Stage {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300">Line of Treatment</label>
                      <Input
                            placeholder="e.g., First line, Second line"
                        {...register(`medications.${index}.lineOfTreatment`)}
                            className="h-10 text-base focus:border-indigo-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300">Drug Class</label>
                      <Input
                            placeholder="e.g., Biguanides, Sulfonylureas"
                        {...register(`medications.${index}.drugClass`)}
                            className="h-10 text-base focus:border-indigo-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300">Standard Dosage</label>
                      <Input
                            placeholder="e.g., 500mg twice daily, 1000mg once daily"
                        {...register(`medications.${index}.standardDosage`)}
                            className="h-10 text-base focus:border-indigo-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300">Trigger to Start</label>
                      <Input
                            placeholder="e.g., HbA1c >7.0%, Weight loss >5%"
                        {...register(`medications.${index}.triggerToStart`)}
                            className="h-10 text-base focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300">Notes</label>
                      <Textarea
                        placeholder="Side effects, cost considerations, etc."
                        {...register(`medications.${index}.notes`)}
                            className="h-24 text-base focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          )}

          {/* Section 8: Red Flags */}
          {activeSection === 8 && (
            <Card className="border-2 border-red-200 dark:border-red-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-red-900 dark:text-red-100">
                  <AlertCircle className="h-6 w-6" />
                  <span>Section 8: Red Flags & Emergency Conditions</span>
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300">
              Critical symptoms requiring immediate attention
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
              {watchedRedFlags.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
                      <h4 className="font-medium mb-3 text-red-900 dark:text-red-100">Red Flag {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Symptom/Event</label>
                      <Input
                            placeholder="e.g., Severe hypoglycemia, Acute kidney injury"
                        {...register(`redFlags.${index}.symptom`)}
                            className="h-10 text-base focus:border-red-500"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Stage When Appears</label>
                      <Input
                            placeholder="e.g., Any stage, Early stage"
                        {...register(`redFlags.${index}.stage`)}
                            className="h-10 text-base focus:border-red-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`redFlags.${index}.hospitalizationRequired`)}
                            className="rounded text-red-600 dark:text-red-400 focus:ring-red-500"
                      />
                          <label className="text-sm font-medium text-red-700 dark:text-red-300">Hospitalization Required</label>
                    </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Critical Action Required</label>
                      <Input
                            placeholder="e.g., Immediate glucose administration, Emergency dialysis"
                        {...register(`redFlags.${index}.criticalAction`)}
                            className="h-10 text-base focus:border-red-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`redFlags.${index}.notes`)}
                            className="h-24 text-base focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          )}

          {/* Section 9: Disease Progression Timeline */}
          {activeSection === 9 && (
            <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-yellow-900 dark:text-yellow-100">
                  <Clock className="h-6 w-6" />
                  <span>Section 9: Disease Progression Timeline</span>
            </CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  Define average duration and progression triggers for each stage
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedProgressionTimeline.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium mb-3 text-yellow-900 dark:text-yellow-100">Stage {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-yellow-700 dark:text-yellow-300">Average Duration</label>
                          <Input
                            placeholder="e.g., Months, Years"
                            {...register(`progressionTimeline.${index}.averageDuration`)}
                            className="h-10 text-base focus:border-yellow-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-yellow-700 dark:text-yellow-300">Triggers for Progression</label>
                          <Input
                            placeholder="e.g., Medication change, Symptom worsening"
                            {...register(`progressionTimeline.${index}.triggersForProgression`)}
                            className="h-10 text-base focus:border-yellow-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-yellow-700 dark:text-yellow-300">Notes</label>
            <Textarea
                            placeholder="Additional notes..."
                            {...register(`progressionTimeline.${index}.notes`)}
                            className="h-24 text-base focus:border-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          </CardContent>
        </Card>
          )}

          {/* Section 10: Lifestyle Management */}
          {activeSection === 10 && (
            <Card className="border-2 border-teal-200 dark:border-teal-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-teal-900 dark:text-teal-100">
                  <BookOpen className="h-6 w-6" />
                  <span>Section 10: Lifestyle Management</span>
            </CardTitle>
                <CardDescription className="text-teal-700 dark:text-teal-300">
                  Define interventions and recommendations for each stage
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedLifestyleManagement.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-800">
                      <h4 className="font-medium mb-3 text-teal-900 dark:text-teal-100">Intervention {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-teal-700 dark:text-teal-300">Intervention Type</label>
                          <Input
                            placeholder="e.g., Diet, Exercise, Medication"
                            {...register(`lifestyleManagement.${index}.interventionType`)}
                            className="h-10 text-base focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-teal-700 dark:text-teal-300">Description</label>
            <Textarea
                            placeholder="Describe the intervention..."
                            {...register(`lifestyleManagement.${index}.description`)}
                            className="h-24 text-base focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-teal-700 dark:text-teal-300">Recommended Stages</label>
                          <Input
                            placeholder="e.g., Any stage, Early stage"
                            {...register(`lifestyleManagement.${index}.recommendedStages`)}
                            className="h-10 text-base focus:border-teal-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-teal-700 dark:text-teal-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`lifestyleManagement.${index}.notes`)}
                            className="h-24 text-base focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          </CardContent>
        </Card>
          )}

          {/* Section 11: Pediatric vs Adult Presentation */}
          {activeSection === 11 && (
            <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-cyan-900 dark:text-cyan-100">
                  <UserCheck className="h-6 w-6" />
                  <span>Section 11: Pediatric vs Adult Presentation</span>
                </CardTitle>
                <CardDescription className="text-cyan-700 dark:text-cyan-300">
                  Describe how the disease presents in children versus adults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                      Pediatric Presentation
                    </label>
                    <Textarea
                      placeholder="Describe how the disease presents in children..."
                      {...register('pediatricPresentation')}
                      className="h-24 text-base focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                      Adult Presentation
                    </label>
                    <Textarea
                      placeholder="Describe how the disease presents in adults..."
                      {...register('adultPresentation')}
                      className="h-24 text-base focus:border-cyan-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 12: Lab Value Ranges */}
          {activeSection === 12 && (
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-blue-900 dark:text-blue-100">
                  <Database className="h-6 w-6" />
                  <span>Section 12: Lab Value Ranges</span>
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Define expected laboratory parameters for each clinical stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedLabValues.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium mb-3 text-blue-900 dark:text-blue-100">Stage {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Lab Name</label>
                          <Input
                            placeholder="e.g., HbA1c, Glucose"
                            {...register(`labValues.${index}.labName`)}
                            className="h-10 text-base focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Expected Range</label>
                          <Input
                            placeholder="e.g., 6.5-8.0%, 70-110 mg/dL"
                            {...register(`labValues.${index}.expectedRange`)}
                            className="h-10 text-base focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Critical Values</label>
                          <Input
                            placeholder="e.g., >9.0%, >200 mg/dL"
                            {...register(`labValues.${index}.criticalValues`)}
                            className="h-10 text-base focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Units</label>
                          <Input
                            placeholder="e.g., %, mg/dL"
                            {...register(`labValues.${index}.units`)}
                            className="h-10 text-base focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`labValues.${index}.notes`)}
                            className="h-24 text-base focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 13: Contraindications */}
          {activeSection === 13 && (
            <Card className="border-2 border-red-200 dark:border-red-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-red-900 dark:text-red-100">
                  <AlertCircle className="h-6 w-6" />
                  <span>Section 13: Contraindications</span>
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300">
                  List medications, procedures, or conditions that contraindicate treatment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedContraindications.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
                      <h4 className="font-medium mb-3 text-red-900 dark:text-red-100">Contraindication {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Drug/Procedure</label>
                          <Input
                            placeholder="e.g., ACE inhibitors, NSAIDs"
                            {...register(`contraindications.${index}.drugProcedure`)}
                            className="h-10 text-base focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Contraindicated In</label>
                          <Input
                            placeholder="e.g., Pregnancy, Lactation, Renal failure"
                            {...register(`contraindications.${index}.contraindicatedIn`)}
                            className="h-10 text-base focus:border-red-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-red-700 dark:text-red-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`contraindications.${index}.notes`)}
                            className="h-24 text-base focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 14: Monitoring & Follow-up */}
          {activeSection === 14 && (
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <Settings className="h-6 w-6" />
                  <span>Section 14: Monitoring & Follow-up</span>
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Define follow-up frequency and key metrics for each stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedMonitoringRequirements.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800">
                      <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Stage {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Follow-up Frequency</label>
                          <Input
                            placeholder="e.g., Monthly, Quarterly, Annually"
                            {...register(`monitoringRequirements.${index}.followUpFrequency`)}
                            className="h-10 text-base focus:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Key Metrics</label>
                          <Input
                            placeholder="e.g., HbA1c, Glucose, A1C, Weight"
                            {...register(`monitoringRequirements.${index}.keyMetrics`)}
                            className="h-10 text-base focus:border-gray-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`monitoringRequirements.${index}.notes`)}
                            className="h-24 text-base focus:border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 15: Common Misdiagnoses */}
          {activeSection === 15 && (
            <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-amber-900 dark:text-amber-100">
                  <FileText className="h-6 w-6" />
                  <span>Section 15: Common Misdiagnoses</span>
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  List conditions often misdiagnosed as the disease
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  {watchedMisdiagnoses.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium mb-3 text-amber-900 dark:text-amber-100">Misdiagnosis {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-amber-700 dark:text-amber-300">Often Misdiagnosed As</label>
                          <Input
                            placeholder="e.g., Type 1 Diabetes, Gestational Diabetes"
                            {...register(`misdiagnoses.${index}.oftenMisdiagnosedAs`)}
                            className="h-10 text-base focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-amber-700 dark:text-amber-300">Key Differentiators</label>
                          <Input
                            placeholder="e.g., Age, Symptoms, Lab values"
                            {...register(`misdiagnoses.${index}.keyDifferentiators`)}
                            className="h-10 text-base focus:border-amber-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-amber-700 dark:text-amber-300">Notes</label>
                          <Textarea
                            placeholder="Additional notes..."
                            {...register(`misdiagnoses.${index}.notes`)}
                            className="h-24 text-base focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 16: Regional Practices */}
          {activeSection === 16 && (
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-emerald-900 dark:text-emerald-100">
                  <MapPin className="h-6 w-6" />
                  <span>Section 16: Regional Practices</span>
                </CardTitle>
                <CardDescription className="text-emerald-700 dark:text-emerald-300">
                  Describe diagnostic and treatment practices in urban vs rural settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Urban Diagnosis Methods
                    </label>
                    <Textarea
                      placeholder="Describe diagnostic methods in urban areas..."
                      {...register('regionalPractices.urbanDiagnosisMethods')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Rural Diagnosis Methods
                    </label>
                    <Textarea
                      placeholder="Describe diagnostic methods in rural areas..."
                      {...register('regionalPractices.ruralDiagnosisMethods')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Urban Medication Use
                    </label>
                    <Textarea
                      placeholder="Describe medication use in urban areas..."
                      {...register('regionalPractices.urbanMedicationUse')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Rural Medication Use
                    </label>
                    <Textarea
                      placeholder="Describe medication use in rural areas..."
                      {...register('regionalPractices.ruralMedicationUse')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Urban Patient Behavior
                    </label>
                    <Textarea
                      placeholder="Describe patient behavior in urban areas..."
                      {...register('regionalPractices.urbanPatientBehavior')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Rural Patient Behavior
                    </label>
                    <Textarea
                      placeholder="Describe patient behavior in rural areas..."
                      {...register('regionalPractices.ruralPatientBehavior')}
                      className="h-24 text-base focus:border-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 17: Additional Notes */}
          {activeSection === 17 && (
            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                  <Info className="h-6 w-6" />
                  <span>Section 17: Additional Notes</span>
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300">
                  Any other general notes or comments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <Textarea
                  placeholder="Share any additional notes or comments..."
                  className="h-24 text-base focus:border-slate-500"
                  {...register('additionalNotes')}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 18: Physician Consent */}
          {activeSection === 18 && (
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                <CardTitle className="text-xl flex items-center space-x-2 text-green-900 dark:text-green-100">
                  <UserCheck className="h-6 w-6" />
                  <span>Section 18: Physician Consent</span>
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Document patient consent for acknowledgment and research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-700 dark:text-green-300">
                      Physician Name
                    </label>
                    <Input
                      placeholder="e.g., Dr. Smith"
                      {...register('physicianName')}
                      className="h-10 text-base focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-700 dark:text-green-300">
                      Institution
                    </label>
                    <Input
                      placeholder="e.g., Hospital A, Clinic B"
                      {...register('institution')}
                      className="h-10 text-base focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('consentForAcknowledgment')}
                      className="rounded text-green-600 dark:text-green-400 focus:ring-green-500"
                    />
                    <label className="text-sm font-medium text-green-700 dark:text-green-300">Patient Consent for Acknowledgment</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('consentForResearch')}
                      className="rounded text-green-600 dark:text-green-400 focus:ring-green-500"
                    />
                    <label className="text-sm font-medium text-green-700 dark:text-green-300">Patient Consent for Research</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-green-700 dark:text-green-300">
                    Submission Date
                  </label>
                  <Input
                    type="date"
                    {...register('submissionDate')}
                    className="h-10 text-base focus:border-green-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevSection}
                disabled={activeSection === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={nextSection}
                disabled={activeSection === sections.length}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

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