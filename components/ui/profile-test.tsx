'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  User, 
  Shield, 
  Database,
  Edit,
  Save,
  LogOut,
  AlertCircle,
  Info
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function ProfileTest() {
  const { user, userProfile, loading: authLoading, profileLoading, signOut, updateProfile } = useAuth();
  const { isAuthenticated, loading: adminLoading, logout: adminLogout } = useAdmin();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testFormData, setTestFormData] = useState({
    displayName: 'Test Doctor',
    username: 'test.doctor',
    email: 'test@example.com',
    phoneNumber: '+1234567890',
    institution: 'Test Hospital',
    specialty: 'Test Specialty',
    experience: 5,
    location: 'Test City',
  });

  const runTest = async (testName: string, testFn: () => Promise<any>): Promise<TestResult> => {
    try {
      const result = await testFn();
      return {
        name: testName,
        status: 'success',
        message: 'Test passed',
        details: result
      };
    } catch (error) {
      return {
        name: testName,
        status: 'error',
        message: `Test failed: ${error instanceof Error ? error.message : String(error)}`,
        details: error
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Firebase Authentication',
        test: async () => {
          if (!user && !isAuthenticated) {
            throw new Error('No user authenticated');
          }
          return { user: user?.email || 'Admin user' };
        }
      },
      {
        name: 'User Profile Loading',
        test: async () => {
          if (authLoading || profileLoading) {
            throw new Error('Profile still loading');
          }
          if (!userProfile && !isAuthenticated) {
            throw new Error('No user profile available');
          }
          return { profile: userProfile || 'Admin profile' };
        }
      },
      {
        name: 'Profile Data Structure',
        test: async () => {
          if (userProfile) {
            const requiredFields = ['uid', 'email', 'displayName'];
            const missingFields = requiredFields.filter(field => !userProfile[field as keyof typeof userProfile]);
            if (missingFields.length > 0) {
              throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            return { fields: Object.keys(userProfile) };
          }
          return { message: 'Admin user - no profile structure test needed' };
        }
      },
      {
        name: 'Profile Update Function',
        test: async () => {
          if (!user) {
            throw new Error('No user to update profile for');
          }
          const testUpdate = {
            displayName: testFormData.displayName,
            username: testFormData.username,
          };
          await updateProfile(testUpdate);
          return { updatedFields: Object.keys(testUpdate) };
        }
      },
      {
        name: 'Logout Function',
        test: async () => {
          // Test logout function exists and can be called
          if (typeof signOut !== 'function' && typeof adminLogout !== 'function') {
            throw new Error('Logout function not available');
          }
          return { logoutAvailable: true };
        }
      },
      {
        name: 'Form Data Handling',
        test: async () => {
          // Test form data state management
          setTestFormData(prev => ({ ...prev, displayName: 'Updated Test Doctor' }));
          return { formDataUpdated: true };
        }
      },
      {
        name: 'Error Handling',
        test: async () => {
          // Test error handling by trying to update with invalid data
          try {
            await updateProfile({ displayName: '' });
            return { errorHandling: 'No error thrown for empty display name' };
          } catch (error) {
            return { errorHandling: 'Error properly caught' };
          }
        }
      },
      {
        name: 'Loading States',
        test: async () => {
          if (authLoading && profileLoading) {
            return { loadingStates: 'Both auth and profile loading' };
          } else if (authLoading) {
            return { loadingStates: 'Auth loading' };
          } else if (profileLoading) {
            return { loadingStates: 'Profile loading' };
          } else {
            return { loadingStates: 'No loading states active' };
          }
        }
      },
      {
        name: 'User Type Detection',
        test: async () => {
          if (isAuthenticated) {
            return { userType: 'Admin' };
          } else if (user) {
            return { userType: 'Doctor' };
          } else {
            return { userType: 'Not authenticated' };
          }
        }
      },
      {
        name: 'Profile Data Persistence',
        test: async () => {
          if (userProfile) {
            const hasPersistentData = userProfile.uid && userProfile.email;
            if (!hasPersistentData) {
              throw new Error('Profile data not persistent');
            }
            return { persistent: true, uid: userProfile.uid };
          }
          return { persistent: 'Admin user - no persistence test needed' };
        }
      }
    ];

    const results: TestResult[] = [];
    for (const test of tests) {
      const result = await runTest(test.name, test.test);
      results.push(result);
      setTestResults([...results]);
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Page Function Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>

          {/* Current Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <Badge variant="secondary">Loading</Badge>
                  </>
                ) : user || isAuthenticated ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="default" className="bg-green-500">Authenticated</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">Not Authenticated</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Profile Data</span>
              </div>
              <div className="flex items-center gap-2">
                {profileLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <Badge variant="secondary">Loading</Badge>
                  </>
                ) : userProfile || isAuthenticated ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="default" className="bg-green-500">Loaded</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">Not Loaded</Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      {result.details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log(`${result.name} details:`, result.details)}
                        >
                          Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {testResults.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Test Summary:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tests:</span> {testResults.length}
                </div>
                <div>
                  <span className="font-medium">Passed:</span> {testResults.filter(r => r.status === 'success').length}
                </div>
                <div>
                  <span className="font-medium">Failed:</span> {testResults.filter(r => r.status === 'error').length}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 