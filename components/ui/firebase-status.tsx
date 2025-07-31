'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Database,
  Shield
} from 'lucide-react';
import { auth, db } from '@/lib/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, limit } from 'firebase/firestore';

interface FirebaseStatusProps {
  showDetails?: boolean;
  onStatusChange?: (status: 'connected' | 'disconnected' | 'error') => void;
}

interface StatusInfo {
  auth: 'connected' | 'disconnected' | 'error';
  firestore: 'connected' | 'disconnected' | 'error';
  timestamp: Date;
  error?: string;
}

export function FirebaseStatus({ showDetails = false, onStatusChange }: FirebaseStatusProps) {
  const [status, setStatus] = useState<StatusInfo>({
    auth: 'disconnected',
    firestore: 'disconnected',
    timestamp: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkFirebaseStatus = useCallback(async () => {
    setIsChecking(true);
    const newStatus: StatusInfo = {
      auth: 'disconnected',
      firestore: 'disconnected',
      timestamp: new Date()
    };

    try {
      // Check Auth status
      try {
        await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, 
            () => {
              newStatus.auth = 'connected';
              unsubscribe();
              resolve(true);
            },
            (error) => {
              newStatus.auth = 'error';
              newStatus.error = error.message;
              unsubscribe();
              reject(error);
            }
          );
        });
      } catch (error) {
        newStatus.auth = 'error';
        newStatus.error = error instanceof Error ? error.message : 'Unknown auth error';
      }

      // Check Firestore status
      try {
        const testQuery = query(collection(db, 'users'), limit(1));
        await getDocs(testQuery);
        newStatus.firestore = 'connected';
      } catch (error) {
        newStatus.firestore = 'error';
        newStatus.error = error instanceof Error ? error.message : 'Unknown Firestore error';
      }

      setStatus(newStatus);
      setLastCheck(new Date());

      // Notify parent component
      if (onStatusChange) {
        const overallStatus = newStatus.auth === 'connected' && newStatus.firestore === 'connected' 
          ? 'connected' 
          : newStatus.auth === 'error' || newStatus.firestore === 'error' 
            ? 'error' 
            : 'disconnected';
        onStatusChange(overallStatus);
      }
    } catch (error) {
      console.error('Firebase status check failed:', error);
    } finally {
      setIsChecking(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    checkFirebaseStatus();
    
    // Set up periodic checks
    const interval = setInterval(checkFirebaseStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkFirebaseStatus]);

  const getOverallStatus = () => {
    if (status.auth === 'connected' && status.firestore === 'connected') {
      return 'connected';
    }
    if (status.auth === 'error' || status.firestore === 'error') {
      return 'error';
    }
    return 'disconnected';
  };

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'connected': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <WifiOff className="h-4 w-4" />;
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span className="text-sm font-medium">Firebase Status</span>
          <Badge 
            variant={overallStatus === 'connected' ? 'default' : overallStatus === 'error' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {overallStatus === 'connected' ? 'Online' : overallStatus === 'error' ? 'Error' : 'Offline'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkFirebaseStatus}
          disabled={isChecking}
          className="h-6 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {showDetails && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>Authentication</span>
            </div>
            <div className={`flex items-center space-x-1 ${getStatusColor(status.auth)}`}>
              {getStatusIcon(status.auth)}
              <span className="capitalize">{status.auth}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Database className="h-3 w-3" />
              <span>Firestore</span>
            </div>
            <div className={`flex items-center space-x-1 ${getStatusColor(status.firestore)}`}>
              {getStatusIcon(status.firestore)}
              <span className="capitalize">{status.firestore}</span>
            </div>
          </div>
        </div>
      )}

      {status.error && (
        <Alert variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription>
            <strong>Error:</strong> {status.error}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground">
        Last checked: {lastCheck.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default FirebaseStatus; 