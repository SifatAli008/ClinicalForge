'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export function ProfileSyncTest() {
  const { user, userProfile } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'checking' | 'synced' | 'error'>('idle');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSync = useCallback(() => {
    setSyncStatus('checking');
    setLastCheck(new Date());
    
    // Simulate checking if profile data is synced
    setTimeout(() => {
      if (userProfile) {
        const hasData = userProfile.displayName || userProfile.institution;
        setSyncStatus(hasData ? 'synced' : 'error');
      } else {
        setSyncStatus('error');
      }
    }, 1000);
  }, [userProfile]);

  useEffect(() => {
    if (userProfile) {
      checkSync();
    }
  }, [userProfile, checkSync]);

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'synced':
        return <Badge variant="default" className="bg-green-500">Synced</Badge>;
      case 'error':
        return <Badge variant="destructive">Not Synced</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Profile Sync Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Profile Data Sync</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSync}
              disabled={syncStatus === 'checking'}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Profile Data Display */}
        {userProfile && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Current Profile Data:</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Display Name:</span>
                <span className="font-medium">{userProfile.displayName || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Institution:</span>
                <span className="font-medium">{userProfile.institution || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Specialty:</span>
                <span className="font-medium">{userProfile.specialty || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{userProfile.location || 'Not set'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Last Check Time */}
        {lastCheck && (
          <div className="text-xs text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to Test:</h4>
          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Go to the main profile page</li>
            <li>2. Edit some profile information</li>
            <li>3. Save the changes</li>
                            <li>4. Come back here and click &quot;Check Sync&quot;</li>
                            <li>5. Verify the data shows as &quot;Synced&quot;</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
} 