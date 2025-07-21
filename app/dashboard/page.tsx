'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Database,
  Zap,
  Target,
  Award,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  Eye,
  EyeOff,
  Settings,
  Shield,
  Heart,
  Stethoscope,
  MapPin,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useScrollAnimation, useScrollProgress, useScrollTrigger } from '@/lib/scroll-animations';
import AuthGuard from '@/components/auth/AuthGuard';
import { 
  getDashboardStats, 
  getRecentActivity, 
  getSystemMetrics, 
  exportDashboardData,
  subscribeToDashboardUpdates,
  DashboardStats,
  RecentActivity,
  SystemMetrics
} from '@/lib/dashboard-service';
import { useToast } from '@/components/ui/use-toast';
import { MonthlyChart, DiseaseChart } from '@/components/ui/dashboard-chart';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const scrollProgress = useScrollProgress();
  const hasScrolled = useScrollTrigger(50);
  
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { elementRef: recentRef, isVisible: recentVisible } = useScrollAnimation();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading dashboard data...');
      
      const [stats, activity, metrics] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10),
        getSystemMetrics()
      ]);
      
      setDashboardStats(stats);
      setRecentActivity(activity);
      setSystemMetrics(metrics);
      
      console.log('✅ Dashboard data loaded successfully');
      toast({
        title: "Dashboard Updated",
        description: "Real-time data has been refreshed.",
      });
    } catch (error: any) {
      console.error('❌ Error loading dashboard data:', error);
      setError(error?.message || 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export dashboard data
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const exportData = await exportDashboardData();
      
      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clinicalforge-dashboard-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported.",
      });
    } catch (error: any) {
      console.error('❌ Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.uid) return;
    
    console.log('📡 Setting up real-time dashboard subscription...');
    const unsubscribe = subscribeToDashboardUpdates(
      (stats) => {
        console.log('📊 Real-time dashboard update received');
        setDashboardStats(stats);
      },
      (error) => {
        console.error('❌ Real-time dashboard error:', error);
        setError('Real-time updates failed');
      }
    );
    
    return () => {
      console.log('🔌 Unsubscribing from dashboard updates');
      unsubscribe();
    };
  }, [user?.uid]);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      loadDashboardData();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <Database className="h-12 w-12 text-primary animate-pulse mx-auto" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div 
              ref={heroRef}
              className={`mb-8 transition-all duration-1000 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Real-time insights into ClinicalForge platform activity
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={loadDashboardData}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    disabled={isExporting}
                  >
                    <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* System Status */}
            {dashboardStats && (
              <div className="mb-6">
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        System Status: Connected • Last Update: {dashboardStats.systemHealth.lastUpdate.toLocaleTimeString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Stats Grid */}
            {dashboardStats && (
              <div 
                ref={statsRef}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-300 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Forms
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalForms}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      +{dashboardStats.recentSubmissions} this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1 text-blue-600" />
                      {dashboardStats.activeCollaborations} collaborations
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Data Points
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalDataPoints.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Database className="h-3 w-3 mr-1 text-purple-600" />
                      Collected across all forms
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completion Rate
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.completionRate}%</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Average form completion
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>
                      Latest platform activities and submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-start space-x-3 p-3">
                            <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div 
                            key={activity.id}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className="p-2 rounded-full bg-muted group-hover:scale-110 transition-transform duration-300">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Charts */}
                {dashboardStats && (
                  <>
                    <DiseaseChart data={dashboardStats.topDiseases} />
                    <MonthlyChart data={dashboardStats.monthlyContributions} />
                  </>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/forms">
                      <Button variant="outline" className="w-full justify-start group">
                        <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        View Forms
                      </Button>
                    </Link>
                    <Link href="/collaborate">
                      <Button variant="outline" className="w-full justify-start group">
                        <Users className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/findings">
                      <Button variant="outline" className="w-full justify-start group">
                        <BarChart3 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        View Reports
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* System Health */}
                {systemMetrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>System Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>System Status</span>
                          <Badge variant={systemMetrics.systemStatus === 'healthy' ? 'default' : 'destructive'}>
                            {systemMetrics.systemStatus}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Unique Users</span>
                          <span>{systemMetrics.uniqueUsers}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Avg Completion</span>
                          <span>{systemMetrics.averageCompletionRate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 