'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  User, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Activity,
  Download
} from 'lucide-react';
import { auth, db } from '@/lib/firebase-config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: Date;
}

export default function FirebaseTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addResult = (name: string, status: 'success' | 'error' | 'pending', message: string) => {
    setResults(prev => [...prev, {
      name,
      status,
      message,
      timestamp: new Date()
    }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test 1: Firebase App Initialization
      addResult('Firebase App', 'pending', 'Checking Firebase initialization...');
      if (auth && db) {
        addResult('Firebase App', 'success', 'Firebase initialized successfully');
      } else {
        addResult('Firebase App', 'error', 'Firebase not initialized');
        return;
      }

      // Test 2: Authentication
      addResult('Authentication', 'pending', 'Testing authentication...');
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        addResult('Authentication', 'success', `Signed in as ${result.user.email}`);
      } catch (error: any) {
        addResult('Authentication', 'error', `Auth error: ${error.message}`);
      }

      // Test 3: Firestore Write
      addResult('Firestore Write', 'pending', 'Testing Firestore write...');
      try {
        const testData = {
          test: true,
          timestamp: new Date(),
          message: 'Firebase test data'
        };
        const docRef = await addDoc(collection(db, 'test'), testData);
        addResult('Firestore Write', 'success', `Document written with ID: ${docRef.id}`);
      } catch (error: any) {
        addResult('Firestore Write', 'error', `Write error: ${error.message}`);
      }

      // Test 4: Firestore Read
      addResult('Firestore Read', 'pending', 'Testing Firestore read...');
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        addResult('Firestore Read', 'success', `Read ${querySnapshot.size} documents`);
      } catch (error: any) {
        addResult('Firestore Read', 'error', `Read error: ${error.message}`);
      }

      // Test 5: User Profile
      if (user) {
        addResult('User Profile', 'pending', 'Testing user profile...');
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            addResult('User Profile', 'success', 'User profile exists');
          } else {
            // Create user profile
            const profileData = {
              uid: user.uid,
              displayName: user.displayName || 'User',
              email: user.email || '',
              institution: 'Test Hospital',
              specialty: 'General Medicine',
              location: 'Test City',
              bio: 'Test user profile',
              avatarUrl: user.photoURL || '/default-avatar.svg',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(userRef, profileData);
            addResult('User Profile', 'success', 'User profile created');
          }
        } catch (error: any) {
          addResult('User Profile', 'error', `Profile error: ${error.message}`);
        }
      }

    } catch (error: any) {
      addResult('Overall Test', 'error', `Test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Activity className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Firebase test...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Firebase Integration Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test Firebase authentication, Firestore, and user profile functionality
          </p>
        </div>

        {/* User Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.photoURL || '/default-avatar.svg'} 
                    alt={user.displayName || 'User'} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Not signed in</p>
                <p className="text-sm text-muted-foreground">Sign in to test Firebase functionality</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Firebase Tests</span>
            </CardTitle>
            <CardDescription>
              Run comprehensive tests to verify Firebase integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <Activity className="h-4 w-4" />
                <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
              </Button>
              <Button 
                onClick={clearResults} 
                variant="outline"
                disabled={results.length === 0}
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Test Results</span>
              </CardTitle>
              <CardDescription>
                Results from Firebase integration tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Environment:</p>
                <p className="text-muted-foreground">{process.env.NODE_ENV}</p>
              </div>
              <div>
                <p className="font-medium">Firebase Project:</p>
                <p className="text-muted-foreground">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 