'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitForm } from '@/lib/form-submission-service';
import { useToast } from '@/components/ui/use-toast';

export default function TestFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sample form data - this would come from your actual form
      const formData = {
        diseaseId: 'test_disease_001',
        priority: 'medium',
        tags: ['cardiology', 'acute'],
        diseaseOverview: {
          diseaseName: {
            clinical: 'Myocardial Infarction',
            common: 'Heart Attack',
            icd10Code: 'I21',
            icd11Code: 'BA41'
          },
          diseaseType: {
            primary: 'acute',
            secondary: ['ischemic'],
            severity: 'severe'
          },
          demographics: {
            typicalAgeOfOnset: {
              min: 45,
              max: 75,
              unit: 'years',
              notes: 'Most common in middle-aged to elderly'
            },
            genderPrevalence: {
              male: 65,
              female: 35,
              equal: false,
              contextDependent: false,
              notes: 'Higher prevalence in males'
            }
          }
        },
        symptoms: [
          {
            stage: 'acute',
            majorSymptoms: 'Chest pain, shortness of breath',
            earlySymptoms: 'Fatigue, mild chest discomfort',
            symptomPrevalence: 'High',
            notes: 'Classic presentation'
          }
        ],
        comorbidities: [
          {
            comorbidity: 'Hypertension',
            frequency: '60%',
            onsetStage: 'pre-existing',
            complicatesTreatment: true,
            notes: 'Common comorbidity'
          }
        ],
        medications: [
          {
            stage: 'acute',
            lineOfTreatment: 'First line',
            drugClass: 'Antiplatelet',
            standardDosage: 'Aspirin 325mg',
            triggerToStart: 'Immediate',
            notes: 'Standard protocol'
          }
        ]
      };

      // Submit using automatic service
      const id = await submitForm(formData, 'parameter-validation');
      setSubmissionId(id);
      
      toast({
        title: "✅ Form submitted successfully!",
        description: `Submission ID: ${id}`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "❌ Error submitting form",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🧪 Test Automatic Form Submission
          </CardTitle>
          <CardDescription className="text-center">
            This page demonstrates automatic data generation for form submissions.
            Click the button below to submit a test form with auto-generated fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 What Gets Auto-Generated:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>submissionId</strong> - Auto-generated UUID</li>
              <li>• <strong>collaboratorId</strong> - Current user's UID</li>
              <li>• <strong>submittedAt</strong> - Current timestamp</li>
              <li>• <strong>version</strong> - "1.0"</li>
              <li>• <strong>validation scores</strong> - Auto-calculated (0-100)</li>
              <li>• <strong>advanced analytics</strong> - Decision models, critical points</li>
              <li>• <strong>metadata</strong> - Creation info, access control</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              📊 Sample Data Structure:
            </h3>
            <div className="text-sm text-green-800 dark:text-green-200">
              <p>The form will submit with a complete structure including:</p>
              <ul className="mt-2 space-y-1">
                <li>• Disease overview with demographics</li>
                <li>• Symptoms by stage</li>
                <li>• Comorbidities and medications</li>
                <li>• Auto-generated validation scores</li>
                <li>• Advanced clinical analytics</li>
              </ul>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full h-12 text-lg font-semibold"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              '🚀 Submit Test Form (Auto-Generate All Fields)'
            )}
          </Button>

          {submissionId && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Success! Form Submitted
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Submission ID:</strong> {submissionId}
              </p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Check your Firebase console to see the complete auto-generated structure!
              </p>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              📋 Next Steps:
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>1. Check Firebase console for the new document</li>
              <li>2. Verify all auto-generated fields are present</li>
              <li>3. Test with your actual form components</li>
              <li>4. Customize validation algorithms as needed</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
} 