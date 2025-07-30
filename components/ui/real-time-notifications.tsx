'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Activity,
  Users,
  FileText,
  Database,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface RealTimeNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  maxNotifications?: number;
}

export function RealTimeNotifications({
  notifications,
  onMarkAsRead,
  onDismiss,
  maxNotifications = 5
}: RealTimeNotificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = notifications.slice(0, maxNotifications);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'info':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Real-time Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Live updates and system alerts</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length > 0 ? (
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => {
                                onMarkAsRead(notification.id);
                                window.open(notification.action!.href, '_blank');
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 text-muted-foreground hover:text-foreground"
                              onClick={() => onMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                    onClick={() => onDismiss(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No notifications</p>
            <p className="text-sm text-muted-foreground">
              Notifications will appear here when there are updates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock notifications for demonstration
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'New Form Submission',
    message: 'A new clinical data form has been submitted successfully.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    action: {
      label: 'View',
      href: '/forms'
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'System Update',
    message: 'Dashboard data has been refreshed with latest information.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    read: true
  },
  {
    id: '3',
    type: 'warning',
    title: 'Data Export',
    message: 'Large data export is in progress. This may take a few minutes.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false
  }
]; 