'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Activity, 
  Users, 
  FileText, 
  Clock,
  User
} from 'lucide-react';
import { useClinicalLogicSubmissions, useContributors } from '@/lib/mock-data';

export function RealTimeNotifications() {
  const { submissions, isLoading: submissionsLoading, isError: submissionsError } = useClinicalLogicSubmissions();
  const { contributors, isLoading: contributorsLoading, isError: contributorsError } = useContributors();
  
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'submission' | 'contributor' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high';
  }>>([]);

  useEffect(() => {
    // Generate notifications based on data changes
    const newNotifications: Array<{
      id: string;
      type: 'submission' | 'contributor' | 'system';
      title: string;
      message: string;
      timestamp: Date;
      priority: 'low' | 'medium' | 'high';
    }> = [];
    
    if (submissions.length > 0) {
      const latestSubmission = submissions[0];
      newNotifications.push({
        id: `submission-${Date.now()}`,
        type: 'submission' as const,
        title: 'New Clinical Submission',
        message: `${latestSubmission.diseaseName} submitted by ${latestSubmission.physicianName}`,
        timestamp: new Date(),
        priority: 'medium' as const,
      });
    }
    
    if (contributors.length > 0) {
      const latestContributor = contributors[0];
      newNotifications.push({
        id: `contributor-${Date.now()}`,
        type: 'contributor' as const,
        title: 'New Contributor',
        message: `${latestContributor.name} joined from ${latestContributor.institution}`,
        timestamp: new Date(),
        priority: 'low' as const,
      });
    }
    
    setNotifications(prev => [...newNotifications, ...prev.slice(0, 9)]);
  }, [submissions, contributors]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText className="h-4 w-4" />;
      case 'contributor': return <User className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (submissionsLoading || contributorsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Real-Time Notifications
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
            <Bell className="h-5 w-5" />
            Real-Time Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Error loading notifications
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-Time Notifications
        </CardTitle>
        <CardDescription>
          Live updates from clinical submissions and contributors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">Activity will appear here in real-time</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(notification.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>{submissions.length} submissions</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>{contributors.length} contributors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 