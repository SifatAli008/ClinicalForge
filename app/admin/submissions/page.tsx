'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  FileText,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { EnhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminOnly from '@/components/admin/AdminOnly';

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

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhancedService = useMemo(() => new EnhancedClinicalDatabaseService(), []);

  const loadSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Loading all submissions for admin view...');
      const allSubmissions = await enhancedService.getAllSubmissions();
      
      // Transform submissions to include additional metadata
      const transformedSubmissions: Submission[] = allSubmissions.map(submission => ({
        submissionId: submission.submissionId || 'unknown',
        collaboratorId: submission.collaboratorId || 'unknown',
        formType: submission.formType || 'unknown',
        diseaseName: (submission.comprehensiveData?.diseaseOverview?.diseaseName?.clinical || 
                   (typeof submission.comprehensiveData?.diseaseOverview?.diseaseName === 'string' 
                    ? submission.comprehensiveData?.diseaseOverview?.diseaseName 
                    : submission.comprehensiveData?.diseaseOverview?.diseaseName?.clinical)) || 
                   'Unknown Disease',
        submittedAt: submission.submittedAt,
        status: submission.status || 'submitted',
        comprehensiveData: submission.comprehensiveData,
        advancedAnalyticsData: submission.advancedAnalyticsData,
        validation: submission.validation,
        metadata: submission.metadata
      }));

      setSubmissions(transformedSubmissions);
      console.log(`✅ Loaded ${transformedSubmissions.length} submissions`);
    } catch (err) {
      console.error('❌ Error loading submissions:', err);
      setError('Failed to load submissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [enhancedService]);

  const filterAndSortSubmissions = useCallback(() => {
    let filtered = [...submissions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.collaboratorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.submissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.formType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    // Apply form type filter
    if (formTypeFilter !== 'all') {
      filtered = filtered.filter(submission => submission.formType === formTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'submittedAt':
          aValue = a.submittedAt?.toDate?.() || new Date(a.submittedAt);
          bValue = b.submittedAt?.toDate?.() || new Date(b.submittedAt);
          break;
        case 'diseaseName':
          aValue = a.diseaseName || '';
          bValue = b.diseaseName || '';
          break;
        case 'collaboratorId':
          aValue = a.collaboratorId || '';
          bValue = b.collaboratorId || '';
          break;
        case 'formType':
          aValue = a.formType || '';
          bValue = b.formType || '';
          break;
        default:
          aValue = a.submittedAt?.toDate?.() || new Date(a.submittedAt);
          bValue = b.submittedAt?.toDate?.() || new Date(b.submittedAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, formTypeFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    filterAndSortSubmissions();
  }, [submissions, searchTerm, statusFilter, formTypeFilter, sortBy, sortOrder, filterAndSortSubmissions]);

  const handleViewSubmission = (submission: Submission) => {
    if (expandedSubmission === submission.submissionId) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(submission.submissionId);
    }
  };

  const handleDownloadSubmission = async (submission: Submission) => {
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

  const handleDownloadAll = async () => {
    try {
      const allData = {
        submissions: filteredSubmissions,
        exportDate: new Date().toISOString(),
        totalCount: filteredSubmissions.length,
        filters: {
          searchTerm,
          statusFilter,
          formTypeFilter,
          sortBy,
          sortOrder
        }
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-submissions-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading all submissions:', err);
      setError('Failed to download all submissions');
    }
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

  if (isLoading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Submission Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all clinical form submissions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={loadSubmissions}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button 
                onClick={handleDownloadAll}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download All</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                    <p className="text-2xl font-bold">{filteredSubmissions.length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => s.status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">
                      {submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={formTypeFilter}
                  onChange={(e) => setFormTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Form Types</option>
                  <option value="comprehensive-parameter-validation">Comprehensive Parameter Validation</option>
                  <option value="data-field-validation">Data Field Validation</option>
                  <option value="advanced-clinical-analytics">Advanced Clinical Analytics</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="submittedAt">Sort by Date</option>
                  <option value="diseaseName">Sort by Disease</option>
                  <option value="collaboratorId">Sort by User</option>
                  <option value="formType">Sort by Form Type</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-2"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || formTypeFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.' 
                    : 'No submissions have been made yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.submissionId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                  ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                  : submission.diseaseName || 'Unknown Disease'}
                        </h3>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <Badge variant="outline" className={getFormTypeColor(submission.formType)}>
                          {formatFormType(submission.formType)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>User: {submission.collaboratorId}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {submission.submittedAt?.toDate?.()?.toLocaleDateString() || 
                             new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>ID: {submission.submissionId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubmission(submission)}
                        className="flex items-center space-x-2"
                      >
                        {expandedSubmission === submission.submissionId ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSubmission(submission)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedSubmission === submission.submissionId && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div>
                          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                            Submission Details
                          </h4>
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

                        {/* Disease Information */}
                        <div>
                          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                            Disease Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Disease Name:</span>
                              <span>
                  {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                    ? submission.diseaseName.clinical || submission.diseaseName.common || 'Not specified'
                    : submission.diseaseName || 'Not specified'}
                </span>
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
                                <span className="text-right max-w-xs truncate">
                                  {submission.comprehensiveData.additionalNotes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Data Sections */}
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {submission.comprehensiveData && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              Comprehensive Data
                            </h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {Object.keys(submission.comprehensiveData).length} sections completed
                            </p>
                          </div>
                        )}
                        
                        {submission.advancedAnalyticsData && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                              Advanced Analytics
                            </h5>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              {Object.keys(submission.advancedAnalyticsData).length} analytics sections
                            </p>
                          </div>
                        )}
                        
                        {submission.validation && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                              Validation
                            </h5>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              Quality assessment completed
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadSubmission(submission)}
                            className="flex items-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download JSON</span>
                          </Button>
                                                     <Button
                             variant="outline"
                             size="sm"
                             onClick={() => router.push(`/admin/submissions/${submission.submissionId}`)}
                             className="flex items-center space-x-2"
                           >
                             <ExternalLink className="h-4 w-4" />
                             <span>View Full Data</span>
                           </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {submission.submittedAt?.toDate?.()?.toLocaleString() || 
                                        new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AuthGuard>
  );
} 