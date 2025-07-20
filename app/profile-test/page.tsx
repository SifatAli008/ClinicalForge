'use client';

import React from 'react';
import { ProfileTest } from '@/components/ui/profile-test';
import { ProfileSaveTest } from '@/components/ui/profile-save-test';
import { ProfileSyncTest } from '@/components/ui/profile-sync-test';
import { RealtimeTest } from '@/components/ui/realtime-test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { 
  User, 
  Shield, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';

export default function ProfileTestPage() {
  const { user, userProfile, loading: authLoading, profileLoading } = useAuth();
  const { isAuthenticated, loading: adminLoading } = useAdmin();

  const getAuthStatus = () => {
    if (authLoading) return { status: 'loading', message: 'Authentication loading...', icon: Loader2 };
    if (user) return { status: 'authenticated', message: 'Doctor authenticated', icon: User };
    if (isAuthenticated) return { status: 'admin', message: 'Admin authenticated', icon: Shield };
    return { status: 'unauthenticated', message: 'Not authenticated', icon: XCircle };
  };

  const getProfileStatus = () => {
    if (profileLoading) return { status: 'loading', message: 'Profile loading...', icon: Loader2 };
    if (userProfile || isAuthenticated) return { status: 'loaded', message: 'Profile loaded', icon: CheckCircle };
    return { status: 'not-loaded', message: 'Profile not loaded', icon: XCircle };
  };

  const authStatus = getAuthStatus();
  const profileStatus = getProfileStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            🧪 Profile Page Function Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive testing of all profile page functions and Firebase integration
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <authStatus.icon className="h-5 w-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={
                      authStatus.status === 'authenticated' || authStatus.status === 'admin' 
                        ? 'default' 
                        : authStatus.status === 'loading' 
                        ? 'secondary' 
                        : 'destructive'
                    }
                  >
                    {authStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Message:</span>
                  <span className="text-sm text-muted-foreground">{authStatus.message}</span>
                </div>
                {user && (
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <profileStatus.icon className="h-5 w-5" />
                Profile Data Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={
                      profileStatus.status === 'loaded' 
                        ? 'default' 
                        : profileStatus.status === 'loading' 
                        ? 'secondary' 
                        : 'destructive'
                    }
                  >
                    {profileStatus.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Message:</span>
                  <span className="text-sm text-muted-foreground">{profileStatus.message}</span>
                </div>
                {userProfile && (
                  <div className="flex items-center justify-between">
                    <span>Profile Fields:</span>
                    <span className="text-sm text-muted-foreground">{Object.keys(userProfile).length}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Test Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Before Running Tests:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Make sure you're signed in (either as a doctor or admin)</li>
                  <li>Ensure Firebase connection is working</li>
                  <li>Check that profile data is loaded</li>
                  <li>Have the browser console open to see detailed logs</li>
                </ol>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">What Tests Cover:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>Firebase Authentication</li>
                  <li>User Profile Loading</li>
                  <li>Profile Data Structure</li>
                  <li>Profile Update Function</li>
                  <li>Logout Function</li>
                  <li>Form Data Handling</li>
                  <li>Error Handling</li>
                  <li>Loading States</li>
                  <li>User Type Detection</li>
                  <li>Profile Data Persistence</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Expected Results:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>All tests should pass if Firebase is properly configured</li>
                  <li>Profile updates should save to Firestore</li>
                  <li>Authentication should work with Google Sign-In</li>
                  <li>Loading states should display properly</li>
                  <li>Error handling should catch and display errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Components */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ProfileTest />
          </div>
          <div>
            {/* FirebaseTest component was removed, so this div is now empty */}
          </div>
        </div>

        {/* Profile Save Test */}
        <div className="mt-8">
          <ProfileSaveTest />
        </div>

        {/* Profile Sync Test */}
        <div className="mt-8">
          <ProfileSyncTest />
        </div>

        {/* Real-time Test */}
        <div className="mt-8">
          <RealtimeTest />
        </div>

        {/* Troubleshooting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Common Issues:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>If authentication fails, check Firebase configuration in .env.local</li>
                  <li>If profile loading fails, check Firestore security rules</li>
                  <li>If tests timeout, check internet connection</li>
                  <li>If updates don't save, check Firebase console for errors</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Debug Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Open browser console (F12) to see detailed error messages</li>
                  <li>Check Firebase console for authentication and database logs</li>
                  <li>Verify environment variables are loaded correctly</li>
                  <li>Test Firebase connection separately</li>
                  <li>Clear browser cache and try again</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 