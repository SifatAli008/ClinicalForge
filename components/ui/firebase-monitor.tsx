'use client';

import { useState, useEffect } from 'react';
import { getConnectionStatus, clearFirebaseCache } from '@/lib/firebase-service';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';

interface ConnectionStatus {
  isConnected: boolean;
  cacheSize: number;
  cacheKeys: string[];
}

export function FirebaseMonitor() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = () => {
    try {
      const currentStatus = getConnectionStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Error getting connection status:', error);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      clearFirebaseCache();
      updateStatus();
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cacheUsagePercentage = Math.min((status.cacheSize / 50) * 100, 100); // Assuming max 50 cached items

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Firebase Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Connection</span>
            <Badge variant={status.isConnected ? "default" : "destructive"}>
              {status.isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Cache Size</span>
            <span className="text-sm text-muted-foreground">
              {status.cacheSize} items
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cache Usage</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(cacheUsagePercentage)}%
              </span>
            </div>
            <Progress value={cacheUsagePercentage} className="h-2" />
          </div>
        </div>

        {status.cacheKeys.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Cached Data</span>
            <div className="space-y-1">
              {status.cacheKeys.map((key) => (
                <div key={key} className="text-xs text-muted-foreground bg-muted p-1 rounded">
                  {key}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleClearCache} 
          disabled={isLoading}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          {isLoading ? "Clearing..." : "Clear Cache"}
        </Button>
      </CardContent>
    </Card>
  );
} 