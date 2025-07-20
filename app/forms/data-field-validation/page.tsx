'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, Save, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const validationSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    name: z.string(),
    isSufficient: z.boolean(),
    suggestions: z.string().optional(),
  })),
  additionalSections: z.string().optional(),
  overallFeedback: z.string().optional(),
});

type ValidationFormData = z.infer<typeof validationSchema>;

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
];

export default function DataFieldValidationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      sections: clinicalSections.map(section => ({
        id: section.id,
        name: section.name,
        isSufficient: false,
        suggestions: '',
      })),
    },
  });

  const watchedSections = watch('sections');

  const onSubmit = async (data: ValidationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
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
      // Save to localStorage or API
      localStorage.setItem('field-validation-draft', JSON.stringify(formData));
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
          Data Field Validation Form
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and validate the Clinical Logic Collection Template fields. Check each section for sufficiency and suggest improvements.
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong> For each section, indicate whether the current fields are sufficient for clinical data collection. 
          If not, provide specific suggestions for additional fields or parameters that would improve the template.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {clinicalSections.map((section, index) => (
          <Card key={section.id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{section.name}</span>
                    <Badge variant="outline" className="text-xs">
                      Section {index + 1}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {section.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`sufficient-${section.id}`}
                    checked={watchedSections[index]?.isSufficient || false}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      const newSections = [...watchedSections];
                      newSections[index] = { ...newSections[index], isSufficient: checked === true };
                      setValue('sections', newSections);
                    }}
                  />
                  <label htmlFor={`sufficient-${section.id}`} className="text-sm font-medium">
                    Sufficient
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!watchedSections[index]?.isSufficient && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Suggestions for improvement:
                  </label>
                  <Textarea
                    placeholder="Describe additional fields, parameters, or sections that would improve this template..."
                    className="min-h-[100px]"
                    {...register(`sections.${index}.suggestions`)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Additional Sections</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Optional
              </Badge>
            </CardTitle>
            <CardDescription>
              Suggest completely new sections that should be added to the template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe any additional sections that would be valuable for clinical data collection..."
              className="min-h-[120px]"
              {...register('additionalSections')}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Overall Feedback</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Optional
              </Badge>
            </CardTitle>
            <CardDescription>
              General comments about the template structure, usability, or clinical relevance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your overall thoughts about the Clinical Logic Collection Template..."
              className="min-h-[120px]"
              {...register('overallFeedback')}
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