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
  Microscope
} from 'lucide-react';
import { useClinicalLogicSubmissions, useContributors } from '@/lib/mock-data';
import { ClinicalLogic, Contributor, DashboardAnalytics } from '@/lib/types';

export function CompactMedicalParams() {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Medical Parameters
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Medical Parameters
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Submissions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
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

      {/* Contributors */}
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

      {/* Average Onset Age */}
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

      {/* Location Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Urban</span>
              <span className="font-medium">{analytics.submissionLocations.urban}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Rural</span>
              <span className="font-medium">{analytics.submissionLocations.rural}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Types */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Disease Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.diseaseTypeDistribution.slice(0, 3).map((item) => (
              <div key={item.type} className="flex items-center justify-between text-sm">
                <span>{item.type}</span>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {submissions.slice(0, 3).map((submission, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="truncate">
                  {typeof submission.diseaseName === 'object' && submission.diseaseName !== null
                    ? submission.diseaseName.clinical || submission.diseaseName.common || 'Unknown Disease'
                    : submission.diseaseName || 'Unknown Disease'}
                </span>
                <span className="text-muted-foreground text-xs">
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