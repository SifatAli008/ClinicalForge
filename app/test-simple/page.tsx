'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitForm } from '@/lib/form-submission-service';

export default function SimpleTest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTest = async () => {
    setIsSubmitting(true);
    try {
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
        }
      };

      const submissionId = await submitForm(formData, 'parameter-validation');
      setResult(`Success! Submission ID: ${submissionId}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🧪 Simple Test</CardTitle>
          <CardDescription>
            Test automatic form submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTest} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Test Auto-Submission'}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-sm">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 