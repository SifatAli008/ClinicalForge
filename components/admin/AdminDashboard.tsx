'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  Clock, 
  LogOut, 
  Settings, 
  Database,
  Activity,
  Key
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';

export default function AdminDashboard() {
  const { adminUser, logout, isAuthenticated } = useAdmin();

  if (!isAuthenticated || !adminUser) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Admin Status Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Admin Session</span>
            <Badge variant="default" className="ml-auto">
              ACTIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Admin User:</span>
              </div>
              <p className="text-lg font-semibold">{adminUser.name}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Role:</span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {adminUser.role.replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Login:</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatTime(adminUser.lastLogin)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Permissions:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {adminUser.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-green-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Database className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Database Management</div>
                <div className="text-xs text-muted-foreground">
                  Manage articles and data
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Activity className="h-5 w-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium">System Analytics</div>
                <div className="text-xs text-muted-foreground">
                  View system statistics
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <span>Session Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Session Duration</p>
                  <p className="text-xs text-muted-foreground">
                    Active for 8 hours from login
                  </p>
                </div>
              </div>
              <Badge variant="secondary">8h Remaining</Badge>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout Admin Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 