'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Wifi,
  Zap,
  Bell,
  Database,
  Shield,
  Eye,
  Plus,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { EnhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';

interface DashboardStats {
  totalForms: number;
  totalUsers: number;
  totalDataPoints: number;
  completionRate: number;
  recentSubmissions: number;
  topDiseases: Array<{ name: string; count: number }>;
  monthlyContributions: Array<{ month: string; count: number }>;
  userActivity: Array<{ 
    userId: string; 
    displayName: string; 
    submissions: number; 
    lastActive: Date;
    institution: string;
    specialty: string;
    email: string;
  }>;
  systemHealth: {
    isConnected: boolean;
    cacheSize: number;
    lastUpdate: Date;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Real data service
  const enhancedService = new EnhancedClinicalDatabaseService();

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching real dashboard data from enhanced clinical database...');
      
      // Get all submissions from the real database
      const allSubmissions = await enhancedService.getAllSubmissions();
      
      // Calculate total forms
      const totalForms = allSubmissions.length;
      
      // Get recent submissions (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentSubmissions = allSubmissions.filter(submission => {
        const submissionDate = submission.submittedAt?.toDate?.() || new Date(submission.submittedAt as any);
        return submissionDate >= sevenDaysAgo;
      });

      // Get top diseases
      const diseaseCounts = new Map<string, number>();
      allSubmissions.forEach(submission => {
        const diseaseName = submission.diseaseName || 'Unknown Disease';
        diseaseCounts.set(diseaseName, (diseaseCounts.get(diseaseName) || 0) + 1);
      });
      
      const topDiseases = Array.from(diseaseCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get monthly contributions
      const monthlyCounts = new Map<string, number>();
      allSubmissions.forEach(submission => {
        const date = submission.submittedAt?.toDate?.() || new Date(submission.submittedAt as any);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
      });
      
      const monthlyContributions = Array.from(monthlyCounts.entries())
        .map(([month, count]) => ({ 
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }), 
          count 
        }))
        .sort((a, b) => new Date(a.month + ' 1').getTime() - new Date(b.month + ' 1').getTime())
        .slice(-6);

      // Get user activity
      const userActivity: Array<{ 
        userId: string; 
        displayName: string; 
        submissions: number; 
        lastActive: Date;
        institution: string;
        specialty: string;
        email: string;
      }> = [];
      if (allSubmissions.length > 0) {
        const userSubmissions = new Map<string, { 
          submissions: number; 
          lastActive: Date; 
          displayName: string;
          institution: string;
          specialty: string;
          email: string;
        }>();
        
        allSubmissions.forEach(submission => {
          const userId = submission.collaboratorId || 'unknown';
          
          // Extract detailed user information from submission data
          let displayName = 'Unknown User';
          let userInstitution = 'Unknown Institution';
          let userSpecialty = 'General Medicine';
          let userEmail = '';
          
          // Try to get user info from multiple sources
          if (submission.comprehensiveData?.physicianConsent?.physicianName) {
            displayName = submission.comprehensiveData.physicianConsent.physicianName;
          } else if ((submission as any).metadata?.creation?.createdBy) {
            displayName = (submission as any).metadata.creation.createdBy;
          } else if ((submission as any).metadata?.lastModifiedBy) {
            displayName = (submission as any).metadata.lastModifiedBy;
          } else if (submission.collaboratorId && submission.collaboratorId !== 'unknown') {
            // Use collaborator ID as fallback if it looks like a name
            const collaboratorId = submission.collaboratorId;
            if (collaboratorId.includes(' ') || collaboratorId.includes('@')) {
              displayName = collaboratorId;
            } else {
              displayName = `User ${collaboratorId}`;
            }
          }
          
          // Get institution from various sources
          if (submission.comprehensiveData?.physicianConsent?.institution) {
            userInstitution = submission.comprehensiveData.physicianConsent.institution;
          } else if ((submission as any).metadata?.accessControl?.owner) {
            // Try to extract institution from owner field if it contains institution info
            const owner = (submission as any).metadata.accessControl.owner;
            if (owner.includes('@') && owner.includes('.')) {
              const domain = owner.split('@')[1];
              userInstitution = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) + ' Institution';
            }
          }
          
          // Get specialty information (default to General Medicine)
          userSpecialty = 'General Medicine';
          
          // Get email if available (not available in current schema)
          userEmail = '';
          
          const submissionDate = submission.submittedAt?.toDate?.() || new Date(submission.submittedAt as any);
          
          if (userSubmissions.has(userId)) {
            const existing = userSubmissions.get(userId)!;
            existing.submissions += 1;
            if (submissionDate > existing.lastActive) {
              existing.lastActive = submissionDate;
              // Update with latest user info
              existing.displayName = displayName;
              existing.institution = userInstitution;
              existing.specialty = userSpecialty;
              existing.email = userEmail;
            }
          } else {
            userSubmissions.set(userId, {
              submissions: 1,
              lastActive: submissionDate,
              displayName,
              institution: userInstitution,
              specialty: userSpecialty,
              email: userEmail
            });
          }
        });
        
        userActivity.push(...Array.from(userSubmissions.entries()).map(([userId, userData]) => ({
          userId: userId,
          displayName: userData.displayName,
          submissions: userData.submissions,
          lastActive: userData.lastActive,
          institution: userData.institution,
          specialty: userData.specialty,
          email: userData.email
        })));
      }

      // Calculate total data points
      let totalDataPoints = 0;
      allSubmissions.forEach(submission => {
        if (submission.comprehensiveData) {
          totalDataPoints += Object.keys(submission.comprehensiveData).length;
        }
        if (submission.advancedAnalyticsData) {
          totalDataPoints += Object.keys(submission.advancedAnalyticsData).length;
        }
      });

      // Calculate completion rate
      const completionRate = totalForms > 0 ? Math.round((recentSubmissions.length / totalForms) * 100) : 0;

      // Calculate unique users
      const uniqueUsers = new Set(allSubmissions.map(s => s.collaboratorId)).size;

      // Create real dashboard stats
      const realStats: DashboardStats = {
        totalForms,
        totalUsers: uniqueUsers,
        totalDataPoints,
        completionRate,
        recentSubmissions: recentSubmissions.length,
        topDiseases,
        monthlyContributions,
        userActivity: userActivity.sort((a, b) => b.submissions - a.submissions).slice(0, 5),
        systemHealth: {
          isConnected: true,
          cacheSize: Math.round(allSubmissions.length * 0.1), // Estimate cache size
          lastUpdate: new Date()
        }
      };

      setDashboardStats(realStats);
      
      // Generate real notifications based on data
      const realNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Data Loaded Successfully',
          message: `Successfully loaded ${totalForms} clinical forms from database.`,
          timestamp: new Date(),
          isRead: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Recent Activity',
          message: `${recentSubmissions.length} new submissions in the last 7 days.`,
          timestamp: new Date(Date.now() - 300000),
          isRead: false
        },
        {
          id: '3',
          type: 'warning',
          title: 'Data Quality',
          message: `${topDiseases.length} different diseases documented in the system.`,
          timestamp: new Date(Date.now() - 600000),
          isRead: true
        }
      ];
      
      setNotifications(realNotifications);
      setLastRefresh(new Date());
      
      console.log('✅ Real dashboard data loaded successfully:', realStats);
    } catch (err) {
      console.error('❌ Error loading real dashboard data:', err);
      
      // Check if it's a Firebase permission error
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('Missing or insufficient permissions')) {
        setError('Database access restricted. Using demo data for preview.');
        
        // Provide demo data for better user experience
        const demoStats: DashboardStats = {
          totalForms: 156,
          totalUsers: 24,
          totalDataPoints: 2847,
          completionRate: 87,
          recentSubmissions: 12,
          topDiseases: [
            { name: 'Diabetes Type 2', count: 45 },
            { name: 'Hypertension', count: 38 },
            { name: 'Asthma', count: 32 },
            { name: 'Cardiovascular Disease', count: 28 },
            { name: 'Obesity', count: 23 }
          ],
          monthlyContributions: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 18 },
            { month: 'Mar', count: 15 },
            { month: 'Apr', count: 22 },
            { month: 'May', count: 28 },
            { month: 'Jun', count: 35 }
          ],
          userActivity: [
            { 
              userId: '1', 
              displayName: 'Dr. Sarah Johnson', 
              submissions: 23, 
              lastActive: new Date(),
              institution: 'City General Hospital',
              specialty: 'Cardiology',
              email: 'sarah.johnson@cityhospital.com'
            },
            { 
              userId: '2', 
              displayName: 'Dr. Michael Chen', 
              submissions: 18, 
              lastActive: new Date(),
              institution: 'University Medical Center',
              specialty: 'Neurology',
              email: 'michael.chen@umc.edu'
            },
            { 
              userId: '3', 
              displayName: 'Dr. Emily Rodriguez', 
              submissions: 15, 
              lastActive: new Date(),
              institution: 'Regional Health Clinic',
              specialty: 'Pediatrics',
              email: 'emily.rodriguez@rhc.org'
            },
            { 
              userId: '4', 
              displayName: 'Dr. David Kim', 
              submissions: 12, 
              lastActive: new Date(),
              institution: 'Metropolitan Hospital',
              specialty: 'Oncology',
              email: 'david.kim@metrohospital.com'
            },
            { 
              userId: '5', 
              displayName: 'Dr. Lisa Thompson', 
              submissions: 10, 
              lastActive: new Date(),
              institution: 'Community Health Center',
              specialty: 'Family Medicine',
              email: 'lisa.thompson@chc.org'
            }
          ],
          systemHealth: {
            isConnected: false,
            cacheSize: 0,
            lastUpdate: new Date()
          }
        };
        
        console.log('🔄 Switching to demo mode due to Firebase permissions');
        setDashboardStats(demoStats);
        
        const demoNotifications: Notification[] = [
          {
            id: '1',
            type: 'warning',
            title: 'Demo Mode Active',
            message: 'Showing demo data due to database access restrictions.',
            timestamp: new Date(),
            isRead: false
          },
          {
            id: '2',
            type: 'info',
            title: 'Database Status',
            message: 'Firebase permissions need to be configured for real data access.',
            timestamp: new Date(Date.now() - 300000),
            isRead: false
          },
          {
            id: '3',
            type: 'info',
            title: 'Demo Data',
            message: 'This dashboard shows sample clinical research data for demonstration.',
            timestamp: new Date(Date.now() - 600000),
            isRead: true
          }
        ];
        
        setNotifications(demoNotifications);
      } else {
        setError('Failed to load dashboard data. Please try again later.');
        
        // Fallback to empty stats
        const emptyStats: DashboardStats = {
          totalForms: 0,
          totalUsers: 0,
          totalDataPoints: 0,
          completionRate: 0,
          recentSubmissions: 0,
          topDiseases: [],
          monthlyContributions: [],
          userActivity: [],
          systemHealth: {
            isConnected: false,
            cacheSize: 0,
            lastUpdate: new Date()
          }
        };
        
        setDashboardStats(emptyStats);
        setNotifications([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExportData = async () => {
    try {
      const data = {
        stats: dashboardStats,
        exportDate: new Date().toISOString(),
        metadata: {
          version: '1.0.0',
          source: 'ClinicalForge Dashboard - Real Data'
        }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-64"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded w-24"></div>
                </div>
              </div>
              
              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              
              {/* Content Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg"></div>
                  ))}
                </div>
                <div className="lg:col-span-2 space-y-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-80 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        ClinicalForge Dashboard
                      </h1>
                      <Badge variant="default" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Real-time insights and analytics
                    </p>
                  </div>
                </div>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-green-600" />
                      <span>Status: Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
                    </div>
                  </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Forms */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                    <p className="text-3xl font-bold text-blue-600">{dashboardStats?.totalForms || 0}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      +{dashboardStats?.recentSubmissions || 0} this week
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold text-green-600">{dashboardStats?.totalUsers || 0}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1 text-blue-600" />
                      {dashboardStats?.userActivity.length || 0} contributors
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Points */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:border-l-purple-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Data Points</p>
                    <p className="text-3xl font-bold text-purple-600">{dashboardStats?.totalDataPoints.toLocaleString() || 0}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Database className="h-3 w-3 mr-1 text-purple-600" />
                      From {dashboardStats?.totalForms || 0} submissions
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:border-l-orange-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold text-orange-600">{dashboardStats?.completionRate || 0}%</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 mr-1 text-orange-600" />
                      Last 7 days
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Navigate to key sections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/forms">
                    <Button variant="outline" className="w-full justify-start group hover:bg-accent transition-all duration-200">
                      <div className="p-2 rounded-lg mr-3 bg-blue-100 dark:bg-blue-900/20">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">View Forms</div>
                        <div className="text-xs text-muted-foreground">Access and manage clinical data</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/findings">
                    <Button variant="outline" className="w-full justify-start group hover:bg-accent transition-all duration-200">
                      <div className="p-2 rounded-lg mr-3 bg-green-100 dark:bg-green-900/20">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Research Findings</div>
                        <div className="text-xs text-muted-foreground">Explore analytics and insights</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start group hover:bg-accent transition-all duration-200">
                      <div className="p-2 rounded-lg mr-3 bg-purple-100 dark:bg-purple-900/20">
                        <Settings className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Profile Settings</div>
                        <div className="text-xs text-muted-foreground">Manage your account</div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {notifications.filter(n => !n.isRead).length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Recent updates and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkNotificationAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismissNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <AlertCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                  <CardDescription>Platform health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Connection</span>
                    <Badge variant={dashboardStats?.systemHealth.isConnected ? 'default' : 'destructive'}>
                      {dashboardStats?.systemHealth.isConnected ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Cache Size</span>
                    <span className="font-semibold text-green-600">{dashboardStats?.systemHealth.cacheSize || 0} MB</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Last Update</span>
                    <span className="text-xs text-muted-foreground">
                      {dashboardStats?.systemHealth.lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Diseases Chart */}
              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold">Top Diseases</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      {dashboardStats?.topDiseases.length || 0} conditions
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">Most frequently studied conditions with detailed analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardStats && dashboardStats.topDiseases.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardStats.topDiseases.map((disease, index) => {
                        const maxCount = Math.max(...dashboardStats.topDiseases.map(d => d.count));
                        const percentage = maxCount > 0 ? (disease.count / maxCount) * 100 : 0;
                        
                        return (
                          <div key={disease.name} className="group p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                  index === 1 ? 'bg-gray-100 dark:bg-gray-900/20' :
                                  index === 2 ? 'bg-orange-100 dark:bg-orange-900/20' :
                                  'bg-blue-100 dark:bg-blue-900/20'
                                }`}>
                                  <span className={`text-sm font-bold ${
                                    index === 0 ? 'text-yellow-600' :
                                    index === 1 ? 'text-gray-600' :
                                    index === 2 ? 'text-orange-600' :
                                    'text-blue-600'
                                  }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{disease.name}</p>
                                  <p className="text-xs text-muted-foreground">{disease.count} submissions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-blue-600">{disease.count}</p>
                                <p className="text-xs text-muted-foreground">cases</p>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{percentage.toFixed(1)}% of max</span>
                              <span>{disease.count} total cases</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">No disease data available</p>
                      <p className="text-sm text-muted-foreground">
                        Disease analytics will appear once forms are submitted
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Contributions */}
              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-semibold">Monthly Contributions</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      {dashboardStats?.monthlyContributions.length || 0} months
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">Form submissions trend over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardStats && dashboardStats.monthlyContributions.length > 0 ? (
                    <div className="space-y-4">
                      {/* Chart Header */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">Submission Trend</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-bold text-green-600">
                            {dashboardStats.monthlyContributions.reduce((sum, month) => sum + month.count, 0)} forms
                          </p>
                        </div>
                      </div>
                      
                      {dashboardStats.monthlyContributions.map((month, index) => {
                        const maxCount = Math.max(...dashboardStats.monthlyContributions.map(m => m.count));
                        const percentage = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                        const isCurrentMonth = month.month === new Date().toLocaleDateString('en-US', { month: 'short' });
                        
                        return (
                          <div key={month.month} className={`group p-4 rounded-xl border transition-all duration-300 ${
                            isCurrentMonth 
                              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                              : 'bg-muted/30 border-muted hover:bg-muted/50'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isCurrentMonth ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-900/20'
                                }`}>
                                  <Calendar className={`h-4 w-4 ${isCurrentMonth ? 'text-green-600' : 'text-gray-600'}`} />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{month.month}</p>
                                    {isCurrentMonth && (
                                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                        Current
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{month.count} submissions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${isCurrentMonth ? 'text-green-600' : 'text-gray-600'}`}>
                                  {month.count}
                                </p>
                                <p className="text-xs text-muted-foreground">forms</p>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isCurrentMonth 
                                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{percentage.toFixed(1)}% of peak</span>
                              <span>{month.count} submissions</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">No monthly data available</p>
                      <p className="text-sm text-muted-foreground">
                        Monthly trends will appear once forms are submitted
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="text-lg font-semibold">Top Contributors</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                      {dashboardStats?.userActivity.length || 0} users
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">Most active users and their contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardStats && dashboardStats.userActivity.length > 0 ? (
                    <div className="space-y-4">
                      {/* Leaderboard Header */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Contributor Leaderboard</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total Submissions</p>
                          <p className="font-bold text-purple-600">
                            {dashboardStats.userActivity.reduce((sum, user) => sum + user.submissions, 0)} forms
                          </p>
                        </div>
                      </div>
                      
                      {dashboardStats.userActivity.slice(0, 5).map((user, index) => {
                        const maxSubmissions = Math.max(...dashboardStats.userActivity.map(u => u.submissions));
                        const percentage = maxSubmissions > 0 ? (user.submissions / maxSubmissions) * 100 : 0;
                        const isRecent = new Date().getTime() - user.lastActive.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days
                        
                        return (
                          <div key={user.userId} className={`group p-4 rounded-xl border transition-all duration-300 ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800' :
                            index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10 border-gray-200 dark:border-gray-800' :
                            index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-200 dark:border-orange-800' :
                            'bg-muted/30 border-muted hover:bg-muted/50'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                  index === 1 ? 'bg-gray-100 dark:bg-gray-900/20' :
                                  index === 2 ? 'bg-orange-100 dark:bg-orange-900/20' :
                                  'bg-purple-100 dark:bg-purple-900/20'
                                }`}>
                                  <span className={`text-lg font-bold ${
                                    index === 0 ? 'text-yellow-600' :
                                    index === 1 ? 'text-gray-600' :
                                    index === 2 ? 'text-orange-600' :
                                    'text-purple-600'
                                  }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : user.displayName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.displayName}</p>
                                    {isRecent && (
                                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                        Active
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                      {user.institution}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                      {user.specialty}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Last active: {user.lastActive.toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${
                                  index === 0 ? 'text-yellow-600' :
                                  index === 1 ? 'text-gray-600' :
                                  index === 2 ? 'text-orange-600' :
                                  'text-purple-600'
                                }`}>
                                  {user.submissions}
                                </p>
                                <p className="text-xs text-muted-foreground">submissions</p>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                                  index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                  'bg-gradient-to-r from-purple-500 to-purple-600'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{percentage.toFixed(1)}% of leader</span>
                              <span>{user.submissions} submissions</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">No user activity available</p>
                      <p className="text-sm text-muted-foreground">
                        User contributions will appear once forms are submitted
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 