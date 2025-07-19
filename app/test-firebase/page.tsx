'use client';

import { useState } from 'react';
import { runFirebasePerformanceTest, evaluatePerformance } from '@/lib/firebase-test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FirebaseMonitor } from '@/components/ui/firebase-monitor';

export default function FirebaseTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runTest = async () => {
    setIsRunning(true);
    setLogs([]);
    setResults(null);

    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      setLogs(prev => [...prev, args.join(' ')]);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      setLogs(prev => [...prev, `❌ ${args.join(' ')}`]);
      originalError(...args);
    };

    try {
      const testResults = await runFirebasePerformanceTest();
      setResults(testResults);
      
      if (testResults.success) {
        evaluatePerformance(testResults);
      }
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
      console.log = originalLog;
      console.error = originalError;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            🔥 Firebase Performance Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Test your Firebase database performance and real-time features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runTest} 
                  disabled={isRunning}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? 'Running Tests...' : 'Run Performance Test'}
                </Button>
                
                {results && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Test Results:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Submission Time:</span>
                        <Badge variant={results.submissionTime < 1000 ? "default" : "secondary"}>
                          {results.submissionTime}ms
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Fetch Time:</span>
                        <Badge variant={results.fetchTime < 500 ? "default" : "secondary"}>
                          {results.fetchTime}ms
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cache Size:</span>
                        <Badge variant="outline">
                          {results.cacheSize} items
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Firebase Monitor */}
            <div className="mt-6">
              <FirebaseMonitor />
            </div>
          </div>

          {/* Test Logs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground">
                      Click "Run Performance Test" to start testing...
                    </p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Benchmarks */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Submission Time</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Excellent:</span>
                      <span className="text-sm text-green-600">{"< 1 second"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Good:</span>
                      <span className="text-sm text-yellow-600">{"< 2 seconds"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Acceptable:</span>
                      <span className="text-sm text-orange-600">{"< 5 seconds"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Fetch Time</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Excellent:</span>
                      <span className="text-sm text-green-600">{"< 0.5 seconds"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Good:</span>
                      <span className="text-sm text-yellow-600">{"< 1 second"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Acceptable:</span>
                      <span className="text-sm text-orange-600">{"< 2 seconds"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 