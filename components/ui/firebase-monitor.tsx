'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Database,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function FirebaseMonitor() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [syncCount, setSyncCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setLastSync(new Date());
      setSyncCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  const handleRefresh = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setLastSync(new Date());
      setSyncCount(prev => prev + 1);
    }, 1000);
  };

  const handleClearCache = () => {
    setErrors([]);
    setSyncCount(0);
    setLastSync(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Data Service Monitor
        </CardTitle>
        <CardDescription>
          Monitor data service connection and sync status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">Connection Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
              <Badge variant="outline">{getStatusText()}</Badge>
            </div>
          </div>

          {/* Sync Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Sync Count</span>
              </div>
              <div className="text-2xl font-bold">{syncCount}</div>
              <p className="text-xs text-muted-foreground">Total syncs</p>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Last Sync</span>
              </div>
              <div className="text-sm font-medium">
                {lastSync.toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastSync.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Error Log */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Recent Errors ({errors.length})
                </span>
              </div>
              <div className="space-y-1">
                {errors.slice(-3).map((error, index) => (
                  <p key={index} className="text-xs text-red-600 dark:text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearCache}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Clear Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 