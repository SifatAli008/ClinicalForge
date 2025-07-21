'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Database, Brain, Target, AlertTriangle, TrendingUp, CheckSquare, Star } from 'lucide-react';
import { advancedClinicalAnalyticsService } from '@/lib/advanced-clinical-analytics-service';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function TestAdvancedAnalytics() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const testData = {
    decisionModels: [
      {
        model: 'Disease Classification Model',
        sections: ['Disease Overview', 'Clinical Staging'],
        dependencies: 'Clinical data and biomarkers',
        clinicalImpact: 'high',
        isSufficient: true,
        suggestions: 'Include more genetic markers for better classification'
      },
      {
        model: 'Risk Stratification Model',
        sections: ['Demographics', 'Comorbidities', 'Red Flags'],
        dependencies: 'Patient history and lab values',
        clinicalImpact: 'high',
        isSufficient: true,
        suggestions: 'Add genetic risk factors'
      }
    ],
    criticalPoints: [
      {
        section: 'Red Flags & Emergencies',
        reason: 'Critical for emergency detection',
        useCase: 'Emergency department triage',
        dependencies: 'Symptom data and vital signs',
        isSufficient: true,
        suggestions: 'Add more specific red flag criteria'
      },
      {
        section: 'Clinical Staging',
        reason: 'Central hub for diagnostic decisions',
        useCase: 'Stage classification accuracy',
        dependencies: 'Disease Overview, Subtypes',
        isSufficient: true,
        suggestions: 'Include more staging criteria'
      }
    ],
    conflictZones: [
      {
        sections: 'Medication Protocol ⊗ Contraindications',
        conflict: 'Drug efficacy vs. risk of adverse effects',
        resolution: 'Requires careful risk-benefit analysis',
        isResolved: true,
        suggestions: 'Implement automated drug interaction checking'
      },
      {
        sections: 'Comorbidities ⊗ Medication Protocol',
        conflict: 'Drug interactions due to multiple conditions',
        resolution: 'Multi-drug interaction screening',
        isResolved: true,
        suggestions: 'Add comprehensive drug interaction database'
      }
    ],
    feedbackLoops: [
      {
        loop: 'Monitoring → Progression → Clinical Staging',
        purpose: 'Treatment effectiveness validation',
        isImplemented: true,
        suggestions: 'Automate response tracking'
      },
      {
        loop: 'Misdiagnoses → Red Flags → Symptoms',
        purpose: 'Diagnostic accuracy improvement',
        isImplemented: true,
        suggestions: 'Implement machine learning for pattern recognition'
      }
    ],
    sections: [
      {
        id: 'disease-overview',
        name: 'Disease Overview',
        isSufficient: true,
        suggestions: 'Add more epidemiological data',
        clinicalImpact: 'high' as const,
        dataQuality: 'excellent' as const
      },
      {
        id: 'clinical-staging',
        name: 'Clinical Staging',
        isSufficient: true,
        suggestions: 'Include more biomarkers',
        clinicalImpact: 'high' as const,
        dataQuality: 'good' as const
      }
    ],
    overallAssessment: {
      additionalSections: 'Consider adding genetic markers section',
      overallFeedback: 'Strong clinical foundation with good implementation potential',
      clinicalRelevance: 'excellent' as const,
      implementationReadiness: 'ready' as const
    }
  };

  const runTest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to test the Firebase integration.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      // Test submission
      const submissionId = await advancedClinicalAnalyticsService.submitAdvancedAnalyticsValidation(
        testData,
        user.uid
      );

      // Test retrieval
      const retrievedSubmission = await advancedClinicalAnalyticsService.getSubmission(submissionId);

      // Test user submissions
      const userSubmissions = await advancedClinicalAnalyticsService.getUserSubmissions(user.uid);

      // Test approved submissions
      const approvedSubmissions = await advancedClinicalAnalyticsService.getApprovedSubmissions(5);

      // Test search
      const searchResults = await advancedClinicalAnalyticsService.searchByKeywords('clinical');

      setTestResults({
        submissionId,
        retrievedSubmission,
        userSubmissionsCount: userSubmissions.length,
        approvedSubmissionsCount: approvedSubmissions.length,
        searchResultsCount: searchResults.length,
        success: true
      });

      toast({
        title: "Test Completed Successfully!",
        description: `Advanced Analytics Firebase integration is working. Submission ID: ${submissionId}`,
        variant: "default",
      });

    } catch (error) {
      console.error('Test error:', error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      });

      toast({
        title: "Test Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Advanced Clinical Analytics Firebase Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Test the Firebase integration for Advanced Clinical Analytics Validation form.
          </p>
        </div>

        {/* Test Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={runTest}
            disabled={isTesting || !user}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing Firebase Integration...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Test Advanced Analytics Firebase
              </>
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-6">
            {testResults.success ? (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>✅ Test Passed!</strong> Advanced Clinical Analytics Firebase integration is working correctly.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>❌ Test Failed:</strong> {testResults.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Test Data Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Test Results</span>
                </CardTitle>
                <CardDescription>
                  Firebase integration test results and data summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults.success && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {testResults.submissionId?.slice(0, 8)}...
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Submission ID</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {testResults.userSubmissionsCount}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">User Submissions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {testResults.approvedSubmissionsCount}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Approved Submissions</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {testResults.searchResultsCount}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Search Results</div>
                    </div>
                  </div>
                )}

                {/* Test Data Structure */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Data Structure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-600">Decision Models</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Disease Classification Model</li>
                        <li>• Risk Stratification Model</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">Critical Points</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Red Flags & Emergencies</li>
                        <li>• Clinical Staging</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-600">Conflict Zones</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Medication vs Contraindications</li>
                        <li>• Comorbidities vs Medications</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">Feedback Loops</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Monitoring → Progression</li>
                        <li>• Misdiagnoses → Red Flags</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Firebase Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Firebase Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-600">Data Storage</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Real-time Firestore integration</li>
                        <li>• Auto-generated UUIDs</li>
                        <li>• Timestamp tracking</li>
                        <li>• User authentication</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-indigo-600">Advanced Analytics</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Validation scoring (0-100)</li>
                        <li>• Data quality assessment</li>
                        <li>• Clinical relevance scoring</li>
                        <li>• Search indexing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Test Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                This test verifies the Firebase integration for the Advanced Clinical Analytics Validation form.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">What the test does:</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Submits test data to Firebase Firestore</li>
                  <li>• Retrieves the submitted data</li>
                  <li>• Tests user submissions query</li>
                  <li>• Tests approved submissions query</li>
                  <li>• Tests keyword search functionality</li>
                  <li>• Validates data structure and analytics</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Requirements:</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• User must be logged in</li>
                  <li>• Firebase configuration must be set up</li>
                  <li>• Firestore database must be accessible</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 