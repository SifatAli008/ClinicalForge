'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Calendar,
  Activity,
  PieChart,
  Download as DownloadIcon
} from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  user: string;
  date: string;
  status: 'draft' | 'incomplete' | 'complete' | 'submitted';
  category: string;
  progress: number;
}

interface UserStats {
  id: string;
  name: string;
  email: string;
  formsSubmitted: number;
  lastSubmission: string;
  role: string;
}

interface AnalyticsData {
  totalSubmissions: number;
  completedSubmissions: number;
  incompleteSubmissions: number;
  totalUsers: number;
  submissionsThisMonth: number;
  submissionsLastMonth: number;
  categoryDistribution: { [key: string]: number };
  statusDistribution: { [key: string]: number };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAuthenticated, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Sample submissions data
  const [submissions, setSubmissions] = React.useState<Submission[]>([
    {
      id: '1',
      title: 'Diabetes Clinical Data Collection',
      user: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      status: 'submitted',
      category: 'Endocrinology',
      progress: 100
    },
    {
      id: '2',
      title: 'Hypertension Research Study',
      user: 'Dr. Michael Chen',
      date: '2024-01-14',
      status: 'complete',
      category: 'Cardiology',
      progress: 100
    },
    {
      id: '3',
      title: 'Asthma Control Protocol',
      user: 'Dr. Emily Rodriguez',
      date: '2024-01-13',
      status: 'incomplete',
      category: 'Pulmonology',
      progress: 75
    },
    {
      id: '4',
      title: 'Breast Cancer Screening',
      user: 'Dr. David Kim',
      date: '2024-01-12',
      status: 'submitted',
      category: 'Oncology',
      progress: 100
    },
    {
      id: '5',
      title: 'Multiple Sclerosis Management',
      user: 'Dr. Lisa Thompson',
      date: '2024-01-11',
      status: 'draft',
      category: 'Neurology',
      progress: 25
    },
    {
      id: '6',
      title: 'Cardiovascular Disease Analysis',
      user: 'Dr. James Wilson',
      date: '2024-01-10',
      status: 'submitted',
      category: 'Cardiology',
      progress: 100
    },
    {
      id: '7',
      title: 'Respiratory Conditions Study',
      user: 'Dr. Maria Garcia',
      date: '2024-01-09',
      status: 'complete',
      category: 'Pulmonology',
      progress: 100
    },
    {
      id: '8',
      title: 'Neurological Disorders Research',
      user: 'Dr. Robert Brown',
      date: '2024-01-08',
      status: 'incomplete',
      category: 'Neurology',
      progress: 60
    }
  ]);

  // Sample user statistics
  const [userStats, setUserStats] = React.useState<UserStats[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      formsSubmitted: 3,
      lastSubmission: '2024-01-15',
      role: 'Physician'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@clinic.com',
      formsSubmitted: 2,
      lastSubmission: '2024-01-14',
      role: 'Researcher'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@medical.com',
      formsSubmitted: 1,
      lastSubmission: '2024-01-13',
      role: 'Physician'
    },
    {
      id: '4',
      name: 'Dr. David Kim',
      email: 'david.kim@research.com',
      formsSubmitted: 2,
      lastSubmission: '2024-01-12',
      role: 'Researcher'
    }
  ]);

  // Analytics data
  const [analytics, setAnalytics] = React.useState<AnalyticsData>({
    totalSubmissions: 8,
    completedSubmissions: 5,
    incompleteSubmissions: 3,
    totalUsers: 4,
    submissionsThisMonth: 8,
    submissionsLastMonth: 12,
    categoryDistribution: {
      'Endocrinology': 1,
      'Cardiology': 2,
      'Pulmonology': 2,
      'Oncology': 1,
      'Neurology': 2
    },
    statusDistribution: {
      'submitted': 3,
      'complete': 2,
      'incomplete': 2,
      'draft': 1
    }
  });

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || submission.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle bulk download
  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      // In a real app, this would fetch actual data from the backend
      const completedSubmissions = submissions.filter(s => s.status === 'complete' || s.status === 'submitted');
      
      const downloadData = completedSubmissions.map(submission => ({
        id: submission.id,
        title: submission.title,
        user: submission.user,
        date: submission.date,
        status: submission.status,
        category: submission.category,
        progress: submission.progress,
        // In a real app, this would include the actual form data
        formData: {
          diseaseName: "Sample Disease",
          diseaseType: "Chronic",
          typicalOnsetAge: 45,
          // ... other form fields
        }
      }));

      const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clinical_data_submissions_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download submissions:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle individual download
  const handleDownloadSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      const submissionData = {
        id: submission.id,
        title: submission.title,
        user: submission.user,
        date: submission.date,
        status: submission.status,
        category: submission.category,
        progress: submission.progress,
        // In a real app, this would include the actual form data
        formData: {
          diseaseName: "Sample Disease",
          diseaseType: "Chronic",
          typicalOnsetAge: 45,
          // ... other form fields
        }
      };
      
      const blob = new Blob([JSON.stringify(submissionData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${submission.title.replace(/\s+/g, '_')}_${submissionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'incomplete':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4" />;
      case 'incomplete':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
            <p className="text-muted-foreground">Please sign in to access the dashboard.</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push('/')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Clinical Data Collection Analytics & Management
              </p>
            </div>
              <Button 
                onClick={handleBulkDownload}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                {isDownloading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <DownloadIcon className="h-4 w-4" />
                )}
                {isDownloading ? 'Downloading...' : 'Download All JSON'}
              </Button>
          </div>
        </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.submissionsThisMonth - analytics.submissionsLastMonth} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.completedSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((analytics.completedSubmissions / analytics.totalSubmissions) * 100)}% completion rate
                      </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Contributing to research
                </p>
                </CardContent>
              </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.submissionsThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  New submissions
                </p>
              </CardContent>
            </Card>
        </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'submitted' || status === 'complete' 
                                ? 'bg-green-500' 
                                : status === 'incomplete' 
                                ? 'bg-orange-500' 
                                : 'bg-gray-500'
                            }`}
                            style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                          ></div>
                      </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  All Submissions
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Form Title</th>
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{submission.title}</p>
                            <p className="text-sm text-muted-foreground">ID: {submission.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{submission.user}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{submission.category}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${getStatusColor(submission.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(submission.status)}
                              {submission.status}
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{submission.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadSubmission(submission.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              JSON
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/dashboard?formId=${submission.id}&mode=view`)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </div>
            </CardContent>
          </Card>

          {/* User Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Forms Submitted</th>
                      <th className="text-left py-3 px-4 font-medium">Last Submission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userStats.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{user.name}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{user.formsSubmitted}</span>
                    </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.lastSubmission}</span>
                    </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 