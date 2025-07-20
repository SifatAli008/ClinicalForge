'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Eye,
  Database,
  Settings,
  Shield,
  CheckCircle,
  Clock,
  Award,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalSubmissions: number;
  newSubmissions: number;
  incompleteForms: number;
  formsNeedingReview: number;
  activeUsers: number;
  topContributors: number;
  profileCompletionRate: number;
}

const mockDashboardStats: DashboardStats = {
  totalSubmissions: 156,
  newSubmissions: 23,
  incompleteForms: 8,
  formsNeedingReview: 12,
  activeUsers: 45,
  topContributors: 15,
  profileCompletionRate: 78,
};

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>(mockDashboardStats);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async (type: 'all' | 'submissions' | 'users' | 'analytics') => {
    setIsExporting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let data: any = {};
      let filename = '';
      
      switch (type) {
        case 'all':
          data = { stats };
          filename = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'submissions':
          data = { submissions: [] };
          filename = `submissions-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'users':
          data = { users: [] };
          filename = `users-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'analytics':
          data = { stats };
          filename = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
          break;
      }

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor clinical data collection, user activity, and system analytics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Admin Access</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newSubmissions} from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.topContributors} top contributors
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplete Forms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incompleteForms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.formsNeedingReview} need review
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Submission Activity</span>
            </CardTitle>
            <CardDescription>
              Form submissions over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chart visualization would go here</p>
                <p className="text-xs text-gray-400">Integration with charting library</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Current system performance and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">System Status</p>
                  <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">Database</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Connected and healthy</p>
                </div>
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-300">API Response</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Average 200ms</p>
                </div>
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Controls */}
      <Card className="border-2 mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Export</span>
          </CardTitle>
          <CardDescription>
            Export dashboard data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleExportData('all')}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Export All</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExportData('submissions')}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Submissions</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExportData('users')}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExportData('analytics')}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          </div>
          {isExporting && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Exporting data...
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Recommendations */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>System Recommendations</span>
          </CardTitle>
          <CardDescription>
            AI-generated insights for improving data collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>High Priority:</strong> Consider adding more fields to the "Regional Practices" section 
                as it has the lowest completion rate (23%).
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>User Engagement:</strong> 15 users haven't completed their profiles. 
                Consider sending reminder notifications.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Data Quality:</strong> "Lab Value Ranges" field is frequently flagged as insufficient. 
                Consider adding more specific parameter options.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 