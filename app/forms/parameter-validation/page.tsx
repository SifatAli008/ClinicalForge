'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, Save, Send, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const parameterSchema = z.object({
  diseaseName: z.string().min(1, 'Disease name is required'),
  commonTerm: z.string().optional(),
  diseaseType: z.enum(['acute', 'chronic', 'recurrent', 'congenital']),
  ageOfOnset: z.string().min(1, 'Age of onset is required'),
  genderPrevalence: z.enum(['male', 'female', 'equal', 'context-dependent']),
  ruralUrbanDifferences: z.string().optional(),
  
  // Lab values
  labValues: z.array(z.object({
    stage: z.string(),
    labName: z.string(),
    expectedRange: z.string(),
    criticalValues: z.string(),
    units: z.string(),
    notes: z.string().optional(),
  })),
  
  // Medication protocols
  medications: z.array(z.object({
    stage: z.string(),
    lineOfTreatment: z.string(),
    drugClass: z.string(),
    standardDosage: z.string(),
    triggerToStart: z.string(),
    notes: z.string().optional(),
  })),
  
  // Red flags
  redFlags: z.array(z.object({
    symptom: z.string(),
    stage: z.string(),
    hospitalizationRequired: z.boolean(),
    criticalAction: z.string(),
  })),
  
  // Additional parameters
  additionalParameters: z.string().optional(),
  validationNotes: z.string().optional(),
});

type ParameterFormData = z.infer<typeof parameterSchema>;

const initialLabValues = [
  { stage: 'Early', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
  { stage: 'Moderate', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
  { stage: 'Advanced', labName: '', expectedRange: '', criticalValues: '', units: '', notes: '' },
];

const initialMedications = [
  { stage: 'Early', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
  { stage: 'Moderate', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
  { stage: 'Advanced', lineOfTreatment: '', drugClass: '', standardDosage: '', triggerToStart: '', notes: '' },
];

const initialRedFlags = [
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '' },
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '' },
  { symptom: '', stage: '', hospitalizationRequired: false, criticalAction: '' },
];

export default function ParameterValidationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ParameterFormData>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      labValues: initialLabValues,
      medications: initialMedications,
      redFlags: initialRedFlags,
    },
  });

  const watchedLabValues = watch('labValues');
  const watchedMedications = watch('medications');
  const watchedRedFlags = watch('redFlags');

  const onSubmit = async (data: ParameterFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Parameter validation submitted:', data);
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
      localStorage.setItem('parameter-validation-draft', JSON.stringify(formData));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Parameter Validation Form
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Validate actual data entry for each defined parameter with enforced data type checks.
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong> Fill in the required values for each parameter. 
          The form enforces data type checks and validates the clinical relevance of the entered data.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Disease Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Basic Disease Information</span>
            </CardTitle>
            <CardDescription>
              Core disease parameters and demographics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Disease Name (Clinical) *
                </label>
                <Input
                  placeholder="e.g., Type 2 Diabetes Mellitus"
                  {...register('diseaseName')}
                  className={errors.diseaseName ? 'border-red-500' : ''}
                />
                {errors.diseaseName && (
                  <p className="text-red-500 text-sm mt-1">{errors.diseaseName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Common/Layman Term
                </label>
                <Input
                  placeholder="e.g., Adult-onset diabetes"
                  {...register('commonTerm')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Disease Type *
                </label>
                <select
                  {...register('diseaseType')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select type</option>
                  <option value="acute">Acute</option>
                  <option value="chronic">Chronic</option>
                  <option value="recurrent">Recurrent</option>
                  <option value="congenital">Congenital</option>
                </select>
                {errors.diseaseType && (
                  <p className="text-red-500 text-sm mt-1">{errors.diseaseType.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Typical Age of Onset *
                </label>
                <Input
                  placeholder="e.g., 40-60 years"
                  {...register('ageOfOnset')}
                  className={errors.ageOfOnset ? 'border-red-500' : ''}
                />
                {errors.ageOfOnset && (
                  <p className="text-red-500 text-sm mt-1">{errors.ageOfOnset.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender Prevalence *
                </label>
                <select
                  {...register('genderPrevalence')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select prevalence</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="equal">Equal</option>
                  <option value="context-dependent">Context-dependent</option>
                </select>
                {errors.genderPrevalence && (
                  <p className="text-red-500 text-sm mt-1">{errors.genderPrevalence.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rural/Urban Differences
                </label>
                <Input
                  placeholder="e.g., Higher prevalence in urban areas"
                  {...register('ruralUrbanDifferences')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lab Values */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Lab Value Ranges by Stage</CardTitle>
            <CardDescription>
              Define expected laboratory parameters for each disease stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchedLabValues.map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Stage: {watchedLabValues[index]?.stage}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Lab Name</label>
                      <Input
                        placeholder="e.g., HbA1c"
                        {...register(`labValues.${index}.labName`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Range</label>
                      <Input
                        placeholder="e.g., 6.5-8.0%"
                        {...register(`labValues.${index}.expectedRange`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Critical Values</label>
                      <Input
                        placeholder="e.g., >9.0%"
                        {...register(`labValues.${index}.criticalValues`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Units</label>
                      <Input
                        placeholder="e.g., %"
                        {...register(`labValues.${index}.units`)}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        placeholder="Additional clinical notes..."
                        {...register(`labValues.${index}.notes`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication Protocols */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Medication Protocols</CardTitle>
            <CardDescription>
              Define treatment protocols for each disease stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchedMedications.map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Stage: {watchedMedications[index]?.stage}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Line of Treatment</label>
                      <Input
                        placeholder="e.g., First line"
                        {...register(`medications.${index}.lineOfTreatment`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Drug Class</label>
                      <Input
                        placeholder="e.g., Biguanides"
                        {...register(`medications.${index}.drugClass`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Standard Dosage</label>
                      <Input
                        placeholder="e.g., 500mg twice daily"
                        {...register(`medications.${index}.standardDosage`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Trigger to Start</label>
                      <Input
                        placeholder="e.g., HbA1c >7.0%"
                        {...register(`medications.${index}.triggerToStart`)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        placeholder="Side effects, cost considerations, etc."
                        {...register(`medications.${index}.notes`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Red Flags */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Red Flags & Emergency Conditions</CardTitle>
            <CardDescription>
              Critical symptoms requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchedRedFlags.map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Symptom/Event</label>
                      <Input
                        placeholder="e.g., Severe hypoglycemia"
                        {...register(`redFlags.${index}.symptom`)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stage When Appears</label>
                      <Input
                        placeholder="e.g., Any stage"
                        {...register(`redFlags.${index}.stage`)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`redFlags.${index}.hospitalizationRequired`)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">Hospitalization Required</label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Critical Action Required</label>
                      <Input
                        placeholder="e.g., Immediate glucose administration"
                        {...register(`redFlags.${index}.criticalAction`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Parameters */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Additional Parameters</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Optional
              </Badge>
            </CardTitle>
            <CardDescription>
              Any other parameters that should be included in the data model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe additional parameters, measurements, or clinical indicators that would be valuable for this disease..."
              className="min-h-[120px]"
              {...register('additionalParameters')}
            />
          </CardContent>
        </Card>

        {/* Validation Notes */}
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Validation Notes</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Optional
              </Badge>
            </CardTitle>
            <CardDescription>
              Comments about data validation, clinical relevance, or parameter accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts on the clinical relevance and accuracy of these parameters..."
              className="min-h-[120px]"
              {...register('validationNotes')}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSave}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </Button>
            {isSaved && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Saved!</span>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
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
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.root.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 