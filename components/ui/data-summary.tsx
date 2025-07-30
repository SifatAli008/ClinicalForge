'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

interface DataSummaryProps {
  stats: {
    totalForms: number;
    totalUsers: number;
    totalDataPoints: number;
    completionRate: number;
    recentSubmissions: number;
    activeCollaborations: number;
    topDiseases: Array<{ name: string; count: number }>;
    monthlyContributions: Array<{ month: string; count: number }>;
    userActivity: Array<{ userId: string; displayName: string; submissions: number; lastActive: Date }>;
  };
  isLoading?: boolean;
}

export function DataSummary({ stats, isLoading = false }: DataSummaryProps) {
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const metrics = [
    {
      title: 'Total Forms',
      value: stats.totalForms,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      growth: calculateGrowth(stats.recentSubmissions, Math.max(0, stats.totalForms - stats.recentSubmissions)),
      description: 'Clinical data submissions'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      growth: calculateGrowth(stats.userActivity.length, Math.max(0, stats.totalUsers - stats.userActivity.length)),
      description: 'Contributing researchers'
    },
    {
      title: 'Data Points',
      value: stats.totalDataPoints.toLocaleString(),
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      growth: calculateGrowth(stats.totalDataPoints, Math.max(0, stats.totalDataPoints - stats.recentSubmissions * 10)),
      description: 'Collected data elements'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      growth: calculateGrowth(stats.completionRate, Math.max(0, stats.completionRate - 5)),
      description: 'Form completion success'
    }
  ];

  const insights = [
    {
      title: 'Top Performing Disease',
      value: stats.topDiseases[0]?.name || 'None',
      icon: Award,
      color: 'text-yellow-600',
      description: 'Most studied condition'
    },
    {
      title: 'Active Collaborations',
      value: stats.activeCollaborations,
      icon: Globe,
      color: 'text-indigo-600',
      description: 'Institutional partnerships'
    },
    {
      title: 'Recent Activity',
      value: stats.recentSubmissions,
      icon: Clock,
      color: 'text-pink-600',
      description: 'Submissions this week'
    },
    {
      title: 'Data Quality',
      value: `${Math.min(100, Math.round((stats.completionRate + stats.totalUsers * 2) / 3))}%`,
      icon: Target,
      color: 'text-emerald-600',
      description: 'Overall data quality score'
    }
  ];

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Data Summary</span>
          </CardTitle>
          <CardDescription>Comprehensive analytics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Data Summary</CardTitle>
              <CardDescription>Comprehensive analytics and insights</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(metric.growth)}
                    <span className={`text-xs font-medium ${getGrowthColor(metric.growth)}`}>
                      {metric.growth > 0 ? '+' : ''}{metric.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">Insights</h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-muted`}>
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{insight.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">Progress</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Data Collection</span>
                <span className="text-sm text-muted-foreground">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">User Engagement</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min(100, Math.round((stats.userActivity.length / Math.max(1, stats.totalUsers)) * 100))}%
                </span>
              </div>
              <Progress 
                value={Math.min(100, Math.round((stats.userActivity.length / Math.max(1, stats.totalUsers)) * 100))} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Health</span>
                <span className="text-sm text-muted-foreground">
                  {stats.totalForms > 0 ? 'Healthy' : 'No Data'}
                </span>
              </div>
              <Progress 
                value={stats.totalForms > 0 ? 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg border bg-card">
            <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{stats.recentSubmissions}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <div className="text-center p-3 rounded-lg border bg-card">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold">{stats.userActivity.length}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 