'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Database, FileText, Users, Activity, Stethoscope, Heart, Shield, AlertCircle, Clock, BookOpen, UserCheck, Settings, MapPin, Info, Send } from 'lucide-react';
import { comprehensiveParameterValidationService } from '@/lib/comprehensive-parameter-validation-service';
import { useToast } from '@/components/ui/use-toast';

export default function TestComprehensiveDatabase() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleTestSubmission = async () => {
    setIsSubmitting(true);
    try {
      const sampleData = {
        diseaseOverview: {
          diseaseName: {
            clinical: 'Type 2 Diabetes Mellitus',
            common: 'Adult-onset diabetes',
            icd10Code: 'E11',
            icd11Code: '5A11'
          },
          diseaseType: {
            primary: 'chronic' as const,
            secondary: ['metabolic'],
            severity: 'moderate' as const
          },
          demographics: {
            typicalAgeOfOnset: {
              min: 40,
              max: 60,
              unit: 'years' as const,
              notes: 'Most common in middle-aged adults'
            },
            genderPrevalence: {
              male: 55,
              female: 45,
              equal: false,
              contextDependent: false,
              notes: 'Slightly higher in males'
            }
          },
          ruralUrbanDifferences: 'Higher prevalence in urban areas due to lifestyle factors'
        },
        diseaseSubtypes: [
          {
            name: 'Type 2A - Insulin Resistant',
            diagnosticCriteria: 'High insulin resistance, normal insulin secretion',
            distinctTreatment: true,
            notes: 'Requires insulin sensitizers'
          },
          {
            name: 'Type 2B - Insulin Deficient',
            diagnosticCriteria: 'Low insulin secretion, moderate insulin resistance',
            distinctTreatment: true,
            notes: 'Requires insulin replacement therapy'
          }
        ],
        geneticRiskFactors: [
          {
            riskFactor: 'Family history of diabetes',
            inheritancePattern: 'Polygenic',
            influenceOnOnset: 'Increases risk by 2-3 fold',
            notes: 'Strongest genetic risk factor'
          }
        ],
        clinicalStages: [
          {
            stageName: 'Prediabetes',
            diagnosticCriteria: 'HbA1c 5.7-6.4%, FPG 100-125 mg/dL',
            duration: '2-5 years',
            transitionTriggers: 'Weight gain, sedentary lifestyle',
            notes: 'Reversible with lifestyle changes'
          },
          {
            stageName: 'Early Diabetes',
            diagnosticCriteria: 'HbA1c ≥6.5%, FPG ≥126 mg/dL',
            duration: '5-10 years',
            transitionTriggers: 'Poor glycemic control',
            notes: 'May be asymptomatic'
          },
          {
            stageName: 'Advanced Diabetes',
            diagnosticCriteria: 'HbA1c >8%, complications present',
            duration: '10+ years',
            transitionTriggers: 'Poor control, comorbidities',
            notes: 'High risk of complications'
          }
        ],
        symptomsByStage: [
          {
            stage: 'Prediabetes',
            majorSymptoms: 'Usually asymptomatic',
            earlySymptoms: 'Fatigue, increased thirst',
            symptomPrevalence: '20%',
            notes: 'Most patients unaware'
          },
          {
            stage: 'Early Diabetes',
            majorSymptoms: 'Polyuria, polydipsia, polyphagia',
            earlySymptoms: 'Fatigue, blurred vision',
            symptomPrevalence: '80%',
            notes: 'Classic triad'
          },
          {
            stage: 'Advanced Diabetes',
            majorSymptoms: 'Complications: neuropathy, nephropathy',
            earlySymptoms: 'Wound healing issues',
            symptomPrevalence: '60%',
            notes: 'Complication-driven symptoms'
          }
        ],
        comorbidities: [
          {
            comorbidity: 'Hypertension',
            frequency: '70%',
            onsetStage: 'Any stage',
            complicatesTreatment: true,
            notes: 'Requires blood pressure control'
          },
          {
            comorbidity: 'Dyslipidemia',
            frequency: '60%',
            onsetStage: 'Early stage',
            complicatesTreatment: true,
            notes: 'Requires statin therapy'
          }
        ],
        medications: [
          {
            stage: 'Early Diabetes',
            lineOfTreatment: 'First line',
            drugClass: 'Biguanides',
            standardDosage: '500-2000mg daily',
            triggerToStart: 'HbA1c >7.0%',
            notes: 'Metformin is first choice'
          },
          {
            stage: 'Advanced Diabetes',
            lineOfTreatment: 'Second line',
            drugClass: 'Sulfonylureas',
            standardDosage: 'Varies by agent',
            triggerToStart: 'Metformin failure',
            notes: 'Risk of hypoglycemia'
          }
        ],
        redFlags: [
          {
            symptom: 'Severe hyperglycemia',
            stage: 'Any stage',
            hospitalizationRequired: true,
            criticalAction: 'Immediate insulin therapy',
            notes: 'Blood glucose >400 mg/dL'
          },
          {
            symptom: 'Diabetic ketoacidosis',
            stage: 'Any stage',
            hospitalizationRequired: true,
            criticalAction: 'Emergency department',
            notes: 'Life-threatening complication'
          }
        ],
        progressionTimeline: [
          {
            stage: 'Prediabetes',
            averageDuration: '2-5 years',
            triggersForProgression: 'Weight gain, poor diet',
            notes: 'Reversible with intervention'
          },
          {
            stage: 'Early Diabetes',
            averageDuration: '5-10 years',
            triggersForProgression: 'Poor glycemic control',
            notes: 'Progressive beta cell failure'
          },
          {
            stage: 'Advanced Diabetes',
            averageDuration: '10+ years',
            triggersForProgression: 'Complications, poor control',
            notes: 'Irreversible damage'
          }
        ],
        lifestyleManagement: [
          {
            interventionType: 'Diet',
            description: 'Low-carbohydrate, Mediterranean diet',
            recommendedStages: 'All stages',
            notes: 'Foundation of treatment'
          },
          {
            interventionType: 'Exercise',
            description: '150 minutes/week moderate activity',
            recommendedStages: 'All stages',
            notes: 'Improves insulin sensitivity'
          }
        ],
        pediatricVsAdult: {
          pediatricPresentation: 'Rapid onset, severe symptoms, DKA common',
          adultPresentation: 'Gradual onset, mild symptoms, often asymptomatic'
        },
        labValues: [
          {
            stage: 'All stages',
            labName: 'HbA1c',
            expectedRange: '5.7-6.4% (prediabetes), ≥6.5% (diabetes)',
            criticalValues: '>8%',
            units: '%',
            notes: 'Primary diagnostic and monitoring tool'
          },
          {
            stage: 'All stages',
            labName: 'Fasting Glucose',
            expectedRange: '100-125 mg/dL (prediabetes), ≥126 mg/dL (diabetes)',
            criticalValues: '>400 mg/dL',
            units: 'mg/dL',
            notes: 'Secondary diagnostic tool'
          }
        ],
        contraindications: [
          {
            drugProcedure: 'Metformin',
            contraindicatedIn: 'Severe kidney disease, heart failure',
            notes: 'Risk of lactic acidosis'
          }
        ],
        monitoringRequirements: [
          {
            stage: 'All stages',
            followUpFrequency: 'Every 3-6 months',
            keyMetrics: 'HbA1c, blood pressure, lipids',
            notes: 'Regular monitoring essential'
          }
        ],
        misdiagnoses: [
          {
            oftenMisdiagnosedAs: 'Type 1 Diabetes',
            keyDifferentiators: 'Age, autoantibodies, insulin dependence',
            notes: 'Important to distinguish for treatment'
          }
        ],
        regionalPractices: {
          urbanDiagnosisMethods: 'Advanced testing, specialist referral',
          ruralDiagnosisMethods: 'Basic screening, primary care',
          urbanMedicationUse: 'Latest medications, specialist care',
          ruralMedicationUse: 'Basic medications, primary care',
          urbanPatientBehavior: 'Regular follow-up, education programs',
          ruralPatientBehavior: 'Limited access, self-management'
        },
        additionalNotes: 'Type 2 diabetes is a major public health concern with increasing prevalence globally.',
        physicianConsent: {
          physicianName: 'Dr. John Smith',
          institution: 'City General Hospital',
          consentForAcknowledgment: true,
          consentForResearch: true,
          submissionDate: new Date().toISOString()
        }
      };

      const submissionId = await comprehensiveParameterValidationService.submitComprehensiveValidation(
        sampleData,
        'test-user-id'
      );
      
      setResult({
        submissionId,
        message: 'Comprehensive validation submitted successfully!',
        data: sampleData
      });
      
      toast({
        title: "Database Test Successful!",
        description: `Submission ID: ${submissionId}`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error testing comprehensive database:', error);
      setResult({
        error: true,
        message: `Error: ${error}`,
      });
      
      toast({
        title: "Database Test Failed",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetSubmissions = async () => {
    try {
      const userSubmissions = await comprehensiveParameterValidationService.getUserSubmissions('test-user-id');
      setSubmissions(userSubmissions);
      
      toast({
        title: "Submissions Retrieved",
        description: `Found ${userSubmissions.length} submissions`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error getting submissions:', error);
      toast({
        title: "Error Getting Submissions",
        description: `Error: ${error}`,
        variant: "destructive",
      });
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
            Comprehensive Parameter Validation Database Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Test the comprehensive database with all 18 sections of the Clinical Logic Collection Template.
          </p>
        </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Database Features:</strong> This test demonstrates the complete database schema with all 18 sections, 
            automatic validation scoring, advanced analytics, search indexing, and comprehensive metadata tracking.
          </AlertDescription>
        </Alert>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Submit Test Data</span>
              </CardTitle>
              <CardDescription>
                Submit comprehensive parameter validation with all 18 sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestSubmission} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Test Comprehensive Submission'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Retrieve Submissions</span>
              </CardTitle>
              <CardDescription>
                Get all submissions for test user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGetSubmissions}
                className="w-full"
              >
                Get User Submissions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Submission ID:</h4>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {result.submissionId}
                  </code>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {result.message}
                  </p>
                </div>

                {result.data && (
                  <div>
                    <h4 className="font-semibold mb-2">Data Summary:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Badge variant="outline">Disease: {result.data.diseaseOverview.diseaseName.clinical}</Badge>
                      <Badge variant="outline">Type: {result.data.diseaseOverview.diseaseType.primary}</Badge>
                      <Badge variant="outline">Subtypes: {result.data.diseaseSubtypes.length}</Badge>
                      <Badge variant="outline">Stages: {result.data.clinicalStages.length}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submissions List */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>User Submissions ({submissions.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {submission.diseaseOverview.diseaseName.clinical}
                      </h4>
                      <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Score:</span> {submission.validation.overallScore}%
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Type:</span> {submission.diseaseOverview.diseaseType.primary}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Sections:</span> {18 - submission.validation.missingSections.length}/18
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Submitted:</span> {new Date(submission.submittedAt.toDate()).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Progress value={submission.validation.overallScore} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Database Schema Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Schema Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Auto-Generated Fields</h4>
                <ul className="text-sm space-y-1">
                  <li>• submissionId (UUID)</li>
                  <li>• collaboratorId (User UID)</li>
                  <li>• submittedAt (Timestamp)</li>
                  <li>• validation scores</li>
                  <li>• advanced analytics</li>
                  <li>• search index</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">18 Clinical Sections</h4>
                <ul className="text-sm space-y-1">
                  <li>• Disease Overview</li>
                  <li>• Disease Subtypes</li>
                  <li>• Genetic Risk Factors</li>
                  <li>• Clinical Staging</li>
                  <li>• Symptoms by Stage</li>
                  <li>• Comorbidities</li>
                  <li>• Medications</li>
                  <li>• Red Flags</li>
                  <li>• Progression Timeline</li>
                  <li>• Lifestyle Management</li>
                  <li>• Pediatric vs Adult</li>
                  <li>• Lab Values</li>
                  <li>• Contraindications</li>
                  <li>• Monitoring Requirements</li>
                  <li>• Misdiagnoses</li>
                  <li>• Regional Practices</li>
                  <li>• Additional Notes</li>
                  <li>• Physician Consent</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Advanced Features</h4>
                <ul className="text-sm space-y-1">
                  <li>• Validation scoring (0-100)</li>
                  <li>• Completeness tracking</li>
                  <li>• Data quality assessment</li>
                  <li>• Clinical relevance scoring</li>
                  <li>• Decision models</li>
                  <li>• Risk factor analysis</li>
                  <li>• Treatment complexity</li>
                  <li>• Search indexing</li>
                  <li>• Access control</li>
                  <li>• Version history</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 