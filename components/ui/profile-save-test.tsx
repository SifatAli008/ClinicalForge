'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { CheckCircle, XCircle, Loader2, Save, User } from 'lucide-react';

export function ProfileSaveTest() {
  const { user, userProfile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [testData, setTestData] = useState({
    displayName: 'Test Doctor',
    institution: 'Test Hospital',
    specialty: 'Test Specialty',
  });

  const runSaveTest = async () => {
    if (!user || !userProfile) {
      setTestResult('error');
      return;
    }

    setIsLoading(true);
    setTestResult('idle');

    try {
      console.log('Profile Save Test: Starting test...');
      
      // Save test data
      await updateProfile({
        displayName: testData.displayName,
        institution: testData.institution,
        specialty: testData.specialty,
      });

      console.log('Profile Save Test: Save completed, waiting for update...');
      
      // Wait a moment for the profile to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile Save Test: Test completed successfully');
      setTestResult('success');
    } catch (error) {
      console.error('Profile Save Test: Error during test:', error);
      setTestResult('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetTest = () => {
    setTestResult('idle');
    setTestData({
      displayName: 'Test Doctor',
      institution: 'Test Hospital',
      specialty: 'Test Specialty',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Profile Save Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Data Input */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="test-displayName">Display Name</Label>
            <Input
              id="test-displayName"
              value={testData.displayName}
              onChange={(e) => setTestData({ ...testData, displayName: e.target.value })}
              placeholder="Test Doctor"
            />
          </div>

          <div>
            <Label htmlFor="test-institution">Institution</Label>
            <Input
              id="test-institution"
              value={testData.institution}
              onChange={(e) => setTestData({ ...testData, institution: e.target.value })}
              placeholder="Test Hospital"
            />
          </div>
          <div>
            <Label htmlFor="test-specialty">Specialty</Label>
            <Input
              id="test-specialty"
              value={testData.specialty}
              onChange={(e) => setTestData({ ...testData, specialty: e.target.value })}
              placeholder="Test Specialty"
            />
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={runSaveTest} 
            disabled={isLoading || !user}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Test Save
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetTest}
            disabled={isLoading}
          >
            Reset Test
          </Button>
        </div>

        {/* Test Result */}
        {testResult !== 'idle' && (
          <div className={`p-3 rounded-lg border ${
            testResult === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {testResult === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="font-medium">
                {testResult === 'success' ? 'Test Passed' : 'Test Failed'}
              </span>
            </div>
            <p className="text-sm mt-1">
              {testResult === 'success' 
                ? 'Profile data was saved and updated successfully.' 
                : 'Failed to save or update profile data. Check console for details.'
              }
            </p>
          </div>
        )}

        {/* Current Profile Status */}
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 