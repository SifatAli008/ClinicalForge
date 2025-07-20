'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock,
  MapPin,
  Microscope,
  Database,
  Heart,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useClinicalLogicSubmissions, useContributors } from '@/lib/mock-data';
import { ClinicalLogic, Contributor, DashboardAnalytics } from '@/lib/types';

interface RealTimeMedicalParamsProps {
  className?: string;
  showCharts?: boolean;
}

export function RealTimeMedicalParams({ className, showCharts = true }: RealTimeMedicalParamsProps) {
  const { submissions, isLoading: submissionsLoading, isError: submissionsError } = useClinicalLogicSubmissions();
  const { contributors, isLoading: contributorsLoading, isError: contributorsError } = useContributors();
  
  const [analytics, setAnalytics] = useState<DashboardAnalytics>({
    totalSubmissions: 0,
    averageOnsetAge: 0,
    mostCommonComorbidities: [],
    submissionLocations: { urban: 0, rural: 0 },
    diseaseTypeDistribution: []
  });

  useEffect(() => {
    // Calculate analytics from submissions data
    if (submissions.length > 0) {
      const totalSubmissions = submissions.length;
      const averageOnsetAge = submissions.reduce((sum, sub) => sum + (sub.typicalOnsetAge || 0), 0) / totalSubmissions;
      
      // Calculate disease type distribution
      const typeCount: { [key: string]: number } = {};
      submissions.forEach(sub => {
        const type = sub.diseaseType || 'Unknown';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      const diseaseTypeDistribution = Object.entries(typeCount).map(([type, count]) => ({
        type,
        count
      }));

      // Calculate location distribution
      const urbanCount = submissions.filter(sub => 
        sub.urbanRuralBias?.toLowerCase().includes('urban')
      ).length;
      const ruralCount = totalSubmissions - urbanCount;

      setAnalytics({
        totalSubmissions,
        averageOnsetAge: Math.round(averageOnsetAge),
        mostCommonComorbidities: [],
        submissionLocations: { urban: urbanCount, rural: ruralCount },
        diseaseTypeDistribution
      });
    }
  }, [submissions]);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (submissionsLoading || contributorsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Medical Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissionsError || contributorsError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Medical Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Error loading data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Clinical data entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contributors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active physicians
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              Avg Onset Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageOnsetAge}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Location Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Distribution
          </CardTitle>
          <CardDescription>
            Submissions by urban vs rural areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Urban</span>
                <span className="font-medium">{analytics.submissionLocations.urban}</span>
              </div>
              <Progress value={(analytics.submissionLocations.urban / analytics.totalSubmissions) * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rural</span>
                <span className="font-medium">{analytics.submissionLocations.rural}</span>
              </div>
              <Progress value={(analytics.submissionLocations.rural / analytics.totalSubmissions) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Disease Type Distribution
          </CardTitle>
          <CardDescription>
            Breakdown by disease categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.diseaseTypeDistribution.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm">{item.type}</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(item.count / analytics.totalSubmissions) * 100} 
                    className="w-20"
                  />
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest clinical submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.slice(0, 5).map((submission, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{submission.diseaseName}</span>
                    <Badge variant="outline" className="text-xs">
                      {submission.diseaseType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {submission.physicianName} • {submission.institution}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(submission.submissionDate)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 