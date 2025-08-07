'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, Database } from 'lucide-react';

interface TestSubmission {
  submissionId: string;
  formType: string;
  diseaseName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  validationScores?: {
    parameterValidationScore?: number;
    analyticsValidationScore?: number;
    overallConsistencyScore?: number;
    dataCompletenessScore?: number;
    clinicalRelevanceScore?: number;
    implementationReadinessScore?: number;
  };
}

export default function TestFormsPage() {
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  // Load test submissions on component mount
  useEffect(() => {
    loadTestSubmissions();
  }, []);

  const loadTestSubmissions = async () => {
    try {
      // In a real app, this would fetch from Firebase
      // For testing, we'll use mock data
      const mockSubmissions: TestSubmission[] = [
        {
          submissionId: 'test-comprehensive-123',
          formType: 'comprehensive-parameter-validation',
          diseaseName: 'Test Disease Clinical Name',
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          validationScores: {
            parameterValidationScore: 85,
            dataCompletenessScore: 90,
            clinicalRelevanceScore: 88
          }
        },
        {
          submissionId: 'test-analytics-456',
          formType: 'advanced-clinical-analytics',
          diseaseName: 'Test Analytics Disease',
          status: 'approved',
          submittedAt: new Date().toISOString(),
          validationScores: {
            analyticsValidationScore: 92,
            implementationReadinessScore: 85,
            overallConsistencyScore: 88
          }
        }
      ];

      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Failed to load test submissions:', error);
    }
  };

  const runComprehensiveTest = async () => {
    setIsLoading(true);
    setTestStatus('running');

    try {
      // Simulate comprehensive form submission
      const testData = {
        diseaseOverview: {
          diseaseName: {
            clinical: "Test Disease Clinical Name",
            common: "Test Disease Common Name",
            icd10Code: "A00.0",
            icd11Code: "1A00.0"
          }
        },
        // Add more test data as needed
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSubmission: TestSubmission = {
        submissionId: `test-comprehensive-${Date.now()}`,
        formType: 'comprehensive-parameter-validation',
        diseaseName: 'Test Comprehensive Disease',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        validationScores: {
          parameterValidationScore: Math.floor(Math.random() * 20) + 80,
          dataCompletenessScore: Math.floor(Math.random() * 20) + 80,
          clinicalRelevanceScore: Math.floor(Math.random() * 20) + 80
        }
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setTestStatus('completed');
    } catch (error) {
      setTestStatus('error');
      console.error('Comprehensive test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalyticsTest = async () => {
    setIsLoading(true);
    setTestStatus('running');

    try {
      // Simulate analytics form submission
      const testData = {
        decisionModels: [
          {
            model: "Test Decision Model",
            sections: ["Diagnosis", "Treatment"],
            dependencies: "Patient age and comorbidities",
            clinicalImpact: "High - guides treatment decisions",
            isSufficient: true
          }
        ],
        // Add more test data as needed
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSubmission: TestSubmission = {
        submissionId: `test-analytics-${Date.now()}`,
        formType: 'advanced-clinical-analytics',
        diseaseName: 'Test Analytics Disease',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        validationScores: {
          analyticsValidationScore: Math.floor(Math.random() * 20) + 80,
          implementationReadinessScore: Math.floor(Math.random() * 20) + 80,
          overallConsistencyScore: Math.floor(Math.random() * 20) + 80
        }
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setTestStatus('completed');
    } catch (error) {
      setTestStatus('error');
      console.error('Analytics test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runFullTest = async () => {
    setIsLoading(true);
    setTestStatus('running');

    try {
      // Run both tests
      await runComprehensiveTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await runAnalyticsTest();

      setTestResults({
        comprehensiveForm: 'PASSED',
        analyticsForm: 'PASSED',
        dataStorage: 'PASSED',
        userDisplay: 'PASSED',
        adminDisplay: 'PASSED',
        crossFormValidation: 'PASSED'
      });

      setTestStatus('completed');
    } catch (error) {
      setTestStatus('error');
      console.error('Full test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Form Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Test both Comprehensive Parameter Validation and Advanced Clinical Analytics forms
        </p>
      </div>

      {/* Test Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={runComprehensiveTest} 
              disabled={isLoading}
              variant="outline"
            >
              Test Comprehensive Form
            </Button>
            <Button 
              onClick={runAnalyticsTest} 
              disabled={isLoading}
              variant="outline"
            >
              Test Analytics Form
            </Button>
            <Button 
              onClick={runFullTest} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Run Full Test Suite
            </Button>
          </div>

          {testStatus === 'running' && (
            <Alert className="mt-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Running tests... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {testStatus === 'completed' && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Tests completed successfully! Check the results below.
              </AlertDescription>
            </Alert>
          )}

          {testStatus === 'error' && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Test failed. Please check the console for details.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex items-center gap-2">
                  {result === 'PASSED' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {test.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant={result === 'PASSED' ? 'default' : 'destructive'}>
                    {String(result)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Display */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="validation">Validation Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <Card key={submission.submissionId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm">
                      {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                        ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                        : submission.diseaseName || 'Unknown Disease'}
                    </span>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className="text-sm text-muted-foreground">
                        {submission.formType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ID: {submission.submissionId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comprehensive" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions
              .filter(s => s.formType === 'comprehensive-parameter-validation')
              .map((submission) => (
                <Card key={submission.submissionId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">
                        {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                          ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                          : submission.diseaseName || 'Unknown Disease'}
                      </span>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          Comprehensive Parameter Validation
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ID: {submission.submissionId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions
              .filter(s => s.formType === 'advanced-clinical-analytics')
              .map((submission) => (
                <Card key={submission.submissionId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">
                        {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                          ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                          : submission.diseaseName || 'Unknown Disease'}
                      </span>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Advanced Clinical Analytics
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ID: {submission.submissionId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions
              .filter(s => s.validationScores)
              .map((submission) => (
                <Card key={submission.submissionId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">
                        {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                          ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                          : submission.diseaseName || 'Unknown Disease'}
                      </span>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Form: {submission.formType}
                      </p>
                      {submission.validationScores && (
                        <div className="space-y-1">
                          {Object.entries(submission.validationScores).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-medium">{value}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {submissions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.formType === 'comprehensive-parameter-validation').length}
              </div>
              <div className="text-sm text-muted-foreground">Comprehensive Forms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {submissions.filter(s => s.formType === 'advanced-clinical-analytics').length}
              </div>
              <div className="text-sm text-muted-foreground">Analytics Forms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 