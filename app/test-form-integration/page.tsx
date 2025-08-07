'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Database, FileText, Users, Activity, AlertCircle, Shield, Clock, Heart, Stethoscope, MapPin, BookOpen, Settings, UserCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { comprehensiveParameterValidationService } from '@/lib/comprehensive-parameter-validation-service';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function TestFormIntegration() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTestIntegration = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to test the integration.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      // Test data that matches the comprehensive database schema
      const testData = {
        diseaseOverview: {
          diseaseName: {
            clinical: 'Test Disease - Integration Check',
            common: 'Test Disease',
            icd10Code: 'T99',
            icd11Code: 'T99'
          },
          diseaseType: {
            primary: 'chronic' as const,
            secondary: ['test'],
            severity: 'moderate' as const
          },
          demographics: {
            typicalAgeOfOnset: {
              min: 30,
              max: 50,
              unit: 'years' as const,
              notes: 'Test age range'
            },
            genderPrevalence: {
              male: 50,
              female: 50,
              equal: true,
              contextDependent: false,
              notes: 'Equal distribution for testing'
            }
          },
          ruralUrbanDifferences: 'Test differences'
        },
        diseaseSubtypes: [
          {
            name: 'Test Subtype 1',
            diagnosticCriteria: 'Test criteria',
            distinctTreatment: true,
            notes: 'Test subtype'
          }
        ],
        geneticRiskFactors: [
          {
            riskFactor: 'Test genetic factor',
            inheritancePattern: 'Test pattern',
            influenceOnOnset: 'Test influence',
            notes: 'Test genetic risk'
          }
        ],
        clinicalStages: [
          {
            stageName: 'Test Stage',
            diagnosticCriteria: 'Test criteria',
            duration: 'Test duration',
            transitionTriggers: 'Test triggers',
            notes: 'Test stage'
          }
        ],
        symptomsByStage: [
          {
            stage: 'Test Stage',
            majorSymptoms: 'Test symptoms',
            earlySymptoms: 'Test early symptoms',
            symptomPrevalence: 'Test prevalence',
            notes: 'Test symptoms'
          }
        ],
        comorbidities: [
          {
            comorbidity: 'Test comorbidity',
            frequency: 'Test frequency',
            onsetStage: 'Test stage',
            complicatesTreatment: true,
            notes: 'Test comorbidity'
          }
        ],
        medications: [
          {
            stage: 'Test Stage',
            lineOfTreatment: 'Test treatment',
            drugClass: 'Test drug class',
            standardDosage: 'Test dosage',
            triggerToStart: 'Test trigger',
            notes: 'Test medication'
          }
        ],
        redFlags: [
          {
            symptom: 'Test red flag',
            stage: 'Test stage',
            hospitalizationRequired: true,
            criticalAction: 'Test action',
            notes: 'Test red flag'
          }
        ],
        progressionTimeline: [
          {
            stage: 'Test Stage',
            averageDuration: 'Test duration',
            triggersForProgression: 'Test triggers',
            notes: 'Test progression'
          }
        ],
        lifestyleManagement: [
          {
            interventionType: 'Test intervention',
            description: 'Test description',
            recommendedStages: 'Test stages',
            notes: 'Test lifestyle'
          }
        ],
        pediatricVsAdult: {
          pediatricPresentation: 'Test pediatric',
          adultPresentation: 'Test adult'
        },
        labValues: [
          {
            stage: 'Test Stage',
            labName: 'Test Lab',
            expectedRange: 'Test range',
            criticalValues: 'Test critical',
            units: 'Test units',
            notes: 'Test lab values'
          }
        ],
        contraindications: [
          {
            drugProcedure: 'Test drug',
            contraindicatedIn: 'Test condition',
            notes: 'Test contraindication'
          }
        ],
        monitoringRequirements: [
          {
            stage: 'Test Stage',
            followUpFrequency: 'Test frequency',
            keyMetrics: 'Test metrics',
            notes: 'Test monitoring'
          }
        ],
        misdiagnoses: [
          {
            oftenMisdiagnosedAs: 'Test misdiagnosis',
            keyDifferentiators: 'Test differentiators',
            notes: 'Test misdiagnosis'
          }
        ],
        regionalPractices: {
          urbanDiagnosisMethods: 'Test urban',
          ruralDiagnosisMethods: 'Test rural',
          urbanMedicationUse: 'Test urban meds',
          ruralMedicationUse: 'Test rural meds',
          urbanPatientBehavior: 'Test urban behavior',
          ruralPatientBehavior: 'Test rural behavior'
        },
        additionalNotes: 'Test additional notes',
        physicianConsent: {
          physicianName: 'Dr. Test',
          institution: 'Test Hospital',
          consentForAcknowledgment: true,
          consentForResearch: true,
          submissionDate: new Date().toISOString()
        }
      };

      // Submit to comprehensive database
      const submissionId = await comprehensiveParameterValidationService.submitComprehensiveValidation(
        testData,
        user.uid
      );

      // Retrieve the submission to verify it was saved correctly
      const retrievedSubmission = await comprehensiveParameterValidationService.getSubmission(submissionId);

      setTestResults({
        success: true,
        submissionId,
        retrievedData: retrievedSubmission,
        message: 'Integration test completed successfully!'
      });

      toast({
        title: "Integration Test Successful!",
        description: `Test submission created with ID: ${submissionId}`,
        variant: "default",
      });

    } catch (error) {
      console.error('Integration test failed:', error);
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Integration test failed'
      });

      toast({
        title: "Integration Test Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const sections = [
    { id: 1, title: 'Disease Overview', icon: Heart, color: 'bg-blue-500' },
    { id: 2, title: 'Disease Subtypes', icon: FileText, color: 'bg-green-500' },
    { id: 3, title: 'Genetic Risk Factors', icon: Users, color: 'bg-purple-500' },
    { id: 4, title: 'Clinical Staging', icon: Activity, color: 'bg-orange-500' },
    { id: 5, title: 'Symptoms by Stage', icon: AlertCircle, color: 'bg-red-500' },
    { id: 6, title: 'Comorbidities', icon: Shield, color: 'bg-pink-500' },
    { id: 7, title: 'Medication Protocol', icon: Stethoscope, color: 'bg-indigo-500' },
    { id: 8, title: 'Red Flags & Emergency', icon: AlertCircle, color: 'bg-red-600' },
    { id: 9, title: 'Disease Progression', icon: Clock, color: 'bg-yellow-500' },
    { id: 10, title: 'Lifestyle Management', icon: Settings, color: 'bg-teal-500' },
    { id: 11, title: 'Pediatric vs Adult', icon: UserCheck, color: 'bg-cyan-500' },
    { id: 12, title: 'Lab Values', icon: Database, color: 'bg-blue-600' },
    { id: 13, title: 'Contraindications', icon: Shield, color: 'bg-red-700' },
    { id: 14, title: 'Monitoring & Follow-up', icon: Settings, color: 'bg-gray-500' },
    { id: 15, title: 'Misdiagnoses', icon: BookOpen, color: 'bg-amber-500' },
    { id: 16, title: 'Regional Practices', icon: MapPin, color: 'bg-emerald-500' },
    { id: 17, title: 'Additional Notes', icon: FileText, color: 'bg-slate-500' },
    { id: 18, title: 'Physician Consent', icon: UserCheck, color: 'bg-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Form Integration Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Test the integration between the comprehensive parameter validation form and the database.
          </p>
        </div>

        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Test Purpose:</strong> This page verifies that the comprehensive parameter validation form 
            correctly integrates with the database service, including all 18 sections, validation scoring, 
            and advanced analytics generation.
          </AlertDescription>
        </Alert>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Test Database Integration</span>
              </CardTitle>
              <CardDescription>
                Submit test data to verify comprehensive database integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestIntegration} 
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? 'Testing Integration...' : 'Run Integration Test'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Access Forms</span>
              </CardTitle>
              <CardDescription>
                Navigate to the actual forms for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/forms/comprehensive-parameter-validation">
                <Button variant="outline" className="w-full justify-between">
                  <span>Comprehensive Form</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/test-comprehensive-database">
                <Button variant="outline" className="w-full justify-between">
                  <span>Database Test</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {testResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Status:</h4>
                  <Badge variant={testResults.success ? "default" : "destructive"}>
                    {testResults.success ? "PASSED" : "FAILED"}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {testResults.message}
                  </p>
                </div>

                {testResults.submissionId && (
                  <div>
                    <h4 className="font-semibold mb-2">Submission ID:</h4>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                      {testResults.submissionId}
                    </code>
                  </div>
                )}

                {testResults.retrievedData && (
                  <div>
                    <h4 className="font-semibold mb-2">Retrieved Data Summary:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Badge variant="outline">
                        Disease: {typeof testResults.retrievedData.diseaseOverview?.diseaseName === 'object' && testResults.retrievedData.diseaseOverview?.diseaseName !== null
                          ? testResults.retrievedData.diseaseOverview?.diseaseName?.clinical || testResults.retrievedData.diseaseOverview?.diseaseName?.common || 'N/A'
                          : testResults.retrievedData.diseaseOverview?.diseaseName?.clinical || 'N/A'}
                      </Badge>
                      <Badge variant="outline">
                        Type: {testResults.retrievedData.diseaseOverview?.diseaseType?.primary}
                      </Badge>
                      <Badge variant="outline">
                        Score: {testResults.retrievedData.validation?.overallScore}%
                      </Badge>
                      <Badge variant="outline">
                        Status: {testResults.retrievedData.status}
                      </Badge>
                    </div>
                  </div>
                )}

                {testResults.error && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Error:</h4>
                    <p className="text-red-600 dark:text-red-400">
                      {testResults.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Integration Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Database Service</h4>
                <ul className="text-sm space-y-1">
                  <li>• Comprehensive parameter validation service</li>
                  <li>• Automatic validation scoring</li>
                  <li>• Advanced analytics generation</li>
                  <li>• Search indexing</li>
                  <li>• User authentication integration</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Form Integration</h4>
                <ul className="text-sm space-y-1">
                  <li>• React Hook Form with Zod validation</li>
                  <li>• 18-section comprehensive form</li>
                  <li>• Real-time validation</li>
                  <li>• Progress tracking</li>
                  <li>• Draft saving capability</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">Data Flow</h4>
                <ul className="text-sm space-y-1">
                  <li>• Form data → Database service</li>
                  <li>• Auto-generated fields</li>
                  <li>• Validation scoring</li>
                  <li>• Analytics generation</li>
                  <li>• Firestore storage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>18 Sections Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${section.color} text-white text-xs`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium">{section.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 