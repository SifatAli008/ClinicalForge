'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  FileText, 
  Database, 
  BarChart3,
  CheckCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Printer
} from 'lucide-react';
import { EnhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';
import AuthGuard from '@/components/auth/AuthGuard';

interface Submission {
  submissionId: string;
  collaboratorId: string;
  formType: string;
  diseaseName?: string;
  submittedAt: any;
  status: string;
  comprehensiveData?: any;
  advancedAnalyticsData?: any;
  validation?: any;
  metadata?: any;
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const enhancedService = useMemo(() => new EnhancedClinicalDatabaseService(), []);

  const loadSubmission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Loading submission details:', submissionId);
      const allSubmissions = await enhancedService.getAllSubmissions();
      
      const foundSubmission = allSubmissions.find(s => 
        s.submissionId === submissionId
      );

      if (foundSubmission) {
        const transformedSubmission: Submission = {
          submissionId: foundSubmission.submissionId || 'unknown',
          collaboratorId: foundSubmission.collaboratorId || 'unknown',
          formType: foundSubmission.formType || 'unknown',
          diseaseName: (foundSubmission.comprehensiveData?.diseaseOverview?.diseaseName?.clinical || 
                     (typeof foundSubmission.comprehensiveData?.diseaseOverview?.diseaseName === 'string' 
                      ? foundSubmission.comprehensiveData?.diseaseOverview?.diseaseName 
                      : foundSubmission.comprehensiveData?.diseaseOverview?.diseaseName?.clinical)) || 
                     'Unknown Disease',
          submittedAt: foundSubmission.submittedAt,
          status: foundSubmission.status || 'submitted',
          comprehensiveData: foundSubmission.comprehensiveData,
          advancedAnalyticsData: foundSubmission.advancedAnalyticsData,
          validation: foundSubmission.validation,
          metadata: foundSubmission.metadata
        };

        setSubmission(transformedSubmission);
        console.log('✅ Submission loaded successfully');
      } else {
        setError('Submission not found');
      }
    } catch (err) {
      console.error('❌ Error loading submission:', err);
      setError('Failed to load submission details');
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, enhancedService]);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId, loadSubmission]);

  const handleDownload = async () => {
    if (!submission) return;

    try {
      const submissionData = {
        submissionId: submission.submissionId,
        collaboratorId: submission.collaboratorId,
        formType: submission.formType,
        diseaseName: submission.diseaseName,
        submittedAt: submission.submittedAt?.toDate?.() || new Date(submission.submittedAt),
        status: submission.status,
        comprehensiveData: submission.comprehensiveData,
        advancedAnalyticsData: submission.advancedAnalyticsData,
        validation: submission.validation,
        metadata: submission.metadata,
        exportDate: new Date().toISOString(),
        exportedBy: 'admin'
      };

      const blob = new Blob([JSON.stringify(submissionData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submission-${submission.submissionId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading submission:', err);
      setError('Failed to download submission');
    }
  };

  const handleCopyId = () => {
    if (submission) {
      navigator.clipboard.writeText(submission.submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getFormTypeColor = (formType: string) => {
    switch (formType) {
      case 'comprehensive-parameter-validation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'data-field-validation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'advanced-clinical-analytics':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatFormType = (formType: string) => {
    return formType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderDataSection = (title: string, data: any, color: string) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${color}`}>
              <Database className="h-4 w-4" />
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="border rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {typeof value === 'object' ? (
                    <pre className="whitespace-pre-wrap text-xs bg-muted p-2 rounded">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <span>{String(value)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !submission) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Submission</h2>
            <p className="text-muted-foreground mb-4">{error || 'Submission not found'}</p>
            <div className="flex items-center justify-center space-x-3">
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button variant="outline" onClick={loadSubmission}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Submission Details
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive view of submission data
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
                className="flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          {/* Submission Overview */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Disease</p>
                  <p className="text-lg font-semibold">{submission.diseaseName || 'Unknown Disease'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Form Type</p>
                  <Badge variant="outline" className={getFormTypeColor(submission.formType)}>
                    {formatFormType(submission.formType)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-sm">
                    {submission.submittedAt?.toDate?.()?.toLocaleString() || 
                     new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Collaborator</p>
                    <p className="text-sm text-muted-foreground">{submission.collaboratorId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Submission ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{submission.submissionId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {submission.submittedAt?.toDate?.()?.toLocaleDateString() || 
                       new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comprehensive">Comprehensive Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Submission Overview</span>
                </CardTitle>
                <CardDescription>
                  Basic information and metadata about this submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Submission Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submission ID:</span>
                        <span className="font-mono">{submission.submissionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Form Type:</span>
                        <span>{formatFormType(submission.formType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submitted:</span>
                        <span>
                          {submission.submittedAt?.toDate?.()?.toLocaleString() || 
                           new Date(submission.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Disease Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disease Name:</span>
                        <span>{submission.diseaseName || 'Not specified'}</span>
                      </div>
                      {submission.comprehensiveData?.diseaseOverview?.diseaseType && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disease Type:</span>
                          <span>{submission.comprehensiveData.diseaseOverview.diseaseType.primary || 'Not specified'}</span>
                        </div>
                      )}
                      {submission.comprehensiveData?.additionalNotes && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Notes:</span>
                          <span className="text-right max-w-xs">
                            {submission.comprehensiveData.additionalNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data Sections Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {submission.comprehensiveData && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <h5 className="font-semibold text-blue-900 dark:text-blue-100">
                          Comprehensive Data
                        </h5>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {Object.keys(submission.comprehensiveData).length} sections completed
                      </p>
                    </div>
                  )}
                  
                  {submission.advancedAnalyticsData && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                        <h5 className="font-semibold text-green-900 dark:text-green-100">
                          Advanced Analytics
                        </h5>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {Object.keys(submission.advancedAnalyticsData).length} analytics sections
                      </p>
                    </div>
                  )}
                  
                  {submission.validation && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <h5 className="font-semibold text-purple-900 dark:text-purple-100">
                          Validation
                        </h5>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Quality assessment completed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comprehensive" className="space-y-6">
            {submission.comprehensiveData ? (
              renderDataSection(
                'Comprehensive Clinical Data',
                submission.comprehensiveData,
                'bg-blue-100 dark:bg-blue-900/20'
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Comprehensive Data</h3>
                  <p className="text-muted-foreground">
                    This submission does not contain comprehensive clinical data.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {submission.advancedAnalyticsData ? (
              renderDataSection(
                'Advanced Analytics Data',
                submission.advancedAnalyticsData,
                'bg-green-100 dark:bg-green-900/20'
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground">
                    This submission does not contain advanced analytics data.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            {submission.validation ? (
              renderDataSection(
                'Validation Results',
                submission.validation,
                'bg-purple-100 dark:bg-purple-900/20'
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Validation Data</h3>
                  <p className="text-muted-foreground">
                    This submission does not contain validation data.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
} 