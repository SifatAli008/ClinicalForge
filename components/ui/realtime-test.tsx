'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Zap,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export function RealtimeTest() {
  const { user, userProfile, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [testData, setTestData] = useState({
    displayName: 'Real-time Test',
    institution: 'Test Hospital',
    specialty: 'Test Specialty',
  });

  const [updateHistory, setUpdateHistory] = useState<Array<{
    timestamp: Date;
    field: string;
    value: string;
  }>>([]);

  // Track profile changes
  useEffect(() => {
    if (userProfile) {
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      
      // Add to update history
      setUpdateHistory(prev => [
        {
          timestamp: new Date(),
          field: 'Profile Updated',
          value: `${userProfile.displayName} - ${userProfile.institution || 'No institution'}`
        },
        ...prev.slice(0, 9) // Keep only last 10 updates
      ]);
    }
  }, [userProfile]);

  const testRealtimeUpdate = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      console.log('Realtime Test: Starting update...');
      
      // Update with timestamp to ensure unique data
      const timestamp = new Date().toISOString();
      await updateProfile({
        displayName: `${testData.displayName} - ${timestamp}`,
        institution: `${testData.institution} - ${timestamp}`,
        specialty: `${testData.specialty} - ${timestamp}`,
      });

      console.log('Realtime Test: Update sent to Firebase');
    } catch (error) {
      console.error('Realtime Test: Error during update:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetTest = () => {
    setUpdateCount(0);
    setUpdateHistory([]);
    setLastUpdate(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Real-time Firebase Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Updates Received</span>
            </div>
            <Badge variant="default">{updateCount}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last Update</span>
            </div>
            <span className="text-sm">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {userProfile ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Connection</span>
            </div>
            <Badge variant={userProfile ? 'default' : 'destructive'}>
              {userProfile ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={testRealtimeUpdate} 
            disabled={isUpdating || !user}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Test Real-time Update
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetTest}
            disabled={isUpdating}
          >
            Reset Test
          </Button>
        </div>

        {/* Current Profile Data */}
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
                <span>Last Updated:</span>
                <span className="font-medium">
                  {userProfile.updatedAt ? userProfile.updatedAt.toLocaleString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Update History */}
        {updateHistory.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Update History:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {updateHistory.map((update, index) => (
                <div key={index} className="flex justify-between text-xs text-blue-800 dark:text-blue-200">
                  <span>{update.timestamp.toLocaleTimeString()}</span>
                  <span>{update.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">How to Test:</h4>
          <ol className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                            <li>1. Click &quot;Test Real-time Update&quot;</li>
                            <li>2. Watch the &quot;Updates Received&quot; counter increase</li>
                            <li>3. Check that &quot;Current Profile Data&quot; updates immediately</li>
                            <li>4. Verify &quot;Last Update&quot; timestamp changes</li>
            <li>5. Check browser console for real-time logs</li>
          </ol>
        </div>

        {/* Expected Behavior */}
        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Expected Behavior:</h4>
          <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
            <li>✅ Profile data should update immediately after save</li>
            <li>✅ No page refresh should be needed</li>
                            <li>✅ Console should show &quot;Real-time profile update received&quot;</li>
            <li>✅ Update counter should increment with each change</li>
            <li>✅ All form fields should reflect the latest data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 