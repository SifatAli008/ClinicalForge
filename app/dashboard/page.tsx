'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
  Zap,
  Target,
  Download,
  RefreshCw,
  Wifi,
  Shield,
  Inbox,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useScrollAnimation, useScrollProgress } from '@/lib/scroll-animations';
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
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const scrollProgress = useScrollProgress();
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation();

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
    } catch (error: unknown) {
      console.error('❌ Error loading dashboard data:', error);
      setError((error as Error)?.message || 'Failed to load dashboard data');
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
    } catch (error: unknown) {
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

        <div className="container mx-auto px-4 py-2">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div 
              ref={heroRef}
              className={`mb-1 transition-all duration-1000 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-0">
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
              <Alert className="mb-1 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* System Status - Compact */}
            <div className="mb-1">
              <Card className={`border ${
                dashboardStats?.systemHealth.isConnected 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-200 bg-red-50 dark:bg-red-900/20'
              }`}>
                <CardContent className="p-2">
                  <div className="flex items-center space-x-2">
                    <Wifi className={`h-4 w-4 ${
                      dashboardStats?.systemHealth.isConnected ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      dashboardStats?.systemHealth.isConnected 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      System Status: {dashboardStats?.systemHealth.isConnected ? 'Connected' : 'Disconnected'} • 
                      Last Update: {dashboardStats?.systemHealth.lastUpdate?.toLocaleTimeString() || 'Unknown'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid - Always show */}
            <div 
              ref={statsRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 transition-all duration-1000 delay-300 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Total Forms */}
              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardStats?.totalForms || 0}</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    +{dashboardStats?.recentSubmissions || 0} this week
                  </div>
                </CardContent>
              </Card>

              {/* Total Users */}
              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardStats?.totalUsers || 0}</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Activity className="h-3 w-3 mr-1 text-blue-600" />
                    {dashboardStats?.userActivity.length || 0} contributors
                  </div>
                </CardContent>
              </Card>

              {/* Data Points */}
              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Points</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardStats?.totalDataPoints.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <BarChart3 className="h-3 w-3 mr-1 text-purple-600" />
                    From {dashboardStats?.totalForms || 0} submissions
                  </div>
                </CardContent>
              </Card>

              {/* Completion Rate */}
              <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold text-orange-600">{dashboardStats?.completionRate || 0}%</p>
                    </div>
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1 text-orange-600" />
                    Last 7 days
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-1">
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
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-start space-x-3 p-2">
                            <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {recentActivity.map((activity) => (
                          <div 
                            key={activity.id}
                            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
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
                      <div className="text-center py-6">
                        <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-1">No recent activity</p>
                        <p className="text-sm text-muted-foreground">
                          Activity will appear here once forms are submitted
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-2">
                {/* Charts - Always show, even when empty */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-1">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Top Diseases</span>
                    </CardTitle>
                    <CardDescription>
                      Most frequently studied conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats && dashboardStats.topDiseases.length > 0 ? (
                      <DiseaseChart data={dashboardStats.topDiseases} />
                    ) : (
                      <div className="text-center py-6">
                        <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No disease data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Disease analytics will appear once forms are submitted
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Monthly Contributions</span>
                    </CardTitle>
                    <CardDescription>
                      Form submissions over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats && dashboardStats.monthlyContributions.length > 0 ? (
                      <MonthlyChart data={dashboardStats.monthlyContributions} />
                    ) : (
                      <div className="text-center py-6">
                        <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No monthly data available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Monthly trends will appear once forms are submitted
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Activity - Always show */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Top Contributors</span>
                    </CardTitle>
                    <CardDescription>
                      Most active users and their contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats && dashboardStats.userActivity.length > 0 ? (
                      <div className="space-y-2">
                        {dashboardStats.userActivity.slice(0, 5).map((user, index) => (
                          <div key={user.userId} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {user.displayName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{user.displayName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Last active: {user.lastActive.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-purple-600">{user.submissions}</p>
                              <p className="text-xs text-muted-foreground">submissions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No user activity available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          User contributions will appear once forms are submitted
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* System Metrics - Always show */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>System Metrics</span>
                    </CardTitle>
                    <CardDescription>
                      Platform performance and health indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Total Submissions</span>
                      <span className="font-semibold text-orange-600">{systemMetrics?.totalSubmissions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Unique Users</span>
                      <span className="font-semibold text-orange-600">{systemMetrics?.uniqueUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Avg Completion Rate</span>
                      <span className="font-semibold text-orange-600">{systemMetrics?.averageCompletionRate || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">System Status</span>
                      <Badge variant={systemMetrics?.systemStatus === 'healthy' ? 'default' : 'destructive'}>
                        {systemMetrics?.systemStatus || 'unknown'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription>
                      Common tasks and navigation shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/forms">
                      <Button variant="outline" className="w-full justify-start group hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        View Forms
                      </Button>
                    </Link>
                    <Link href="/collaborate">
                      <Button variant="outline" className="w-full justify-start group hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Users className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/findings">
                      <Button variant="outline" className="w-full justify-start group hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <BarChart3 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        View Reports
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start group hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      onClick={handleExportData}
                      disabled={isExporting}
                    >
                      <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Data Summary - Always show */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Data Summary</span>
                    </CardTitle>
                    <CardDescription>
                      Overview of collected data and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Total Data Points</span>
                      <span className="font-semibold text-purple-600">{dashboardStats?.totalDataPoints.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Active Collaborations</span>
                      <span className="font-semibold text-purple-600">{dashboardStats?.activeCollaborations || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Recent Submissions</span>
                      <span className="font-semibold text-purple-600">{dashboardStats?.recentSubmissions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-semibold text-purple-600">{dashboardStats?.completionRate || 0}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 