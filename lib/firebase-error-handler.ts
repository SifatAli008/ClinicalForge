import { FirebaseError } from 'firebase/app';

export interface FirebaseErrorInfo {
  code: string;
  message: string;
  userFriendlyMessage: string;
  action?: string;
}

export class FirebaseErrorHandler {
  private static errorMap: Map<string, FirebaseErrorInfo> = new Map([
    ['auth/network-request-failed', {
      code: 'auth/network-request-failed',
      message: 'Network request failed',
      userFriendlyMessage: 'Network connection issue. Please check your internet connection and try again.',
      action: 'Check internet connection and retry'
    }],
    ['auth/popup-closed-by-user', {
      code: 'auth/popup-closed-by-user',
      message: 'Popup closed by user',
      userFriendlyMessage: 'Sign-in popup was closed. Please try signing in again.',
      action: 'Try signing in again'
    }],
    ['auth/popup-blocked', {
      code: 'auth/popup-blocked',
      message: 'Popup blocked by browser',
      userFriendlyMessage: 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
      action: 'Allow popups and try again'
    }],
    ['auth/unauthorized-domain', {
      code: 'auth/unauthorized-domain',
      message: 'Unauthorized domain',
      userFriendlyMessage: 'This domain is not authorized for Firebase authentication.',
      action: 'Contact administrator'
    }],
    ['firestore/unavailable', {
      code: 'firestore/unavailable',
      message: 'Firestore unavailable',
      userFriendlyMessage: 'Database is temporarily unavailable. Please try again in a few moments.',
      action: 'Retry in a few moments'
    }],
    ['firestore/permission-denied', {
      code: 'firestore/permission-denied',
      message: 'Permission denied',
      userFriendlyMessage: 'You don\'t have permission to access this data.',
      action: 'Contact administrator for access'
    }],
    ['firestore/unauthenticated', {
      code: 'firestore/unauthenticated',
      message: 'User not authenticated',
      userFriendlyMessage: 'Please sign in to access this feature.',
      action: 'Sign in to continue'
    }],
    ['storage/unauthorized', {
      code: 'storage/unauthorized',
      message: 'Storage unauthorized',
      userFriendlyMessage: 'You don\'t have permission to access this file.',
      action: 'Contact administrator'
    }],
    ['storage/object-not-found', {
      code: 'storage/object-not-found',
      message: 'File not found',
      userFriendlyMessage: 'The requested file was not found.',
      action: 'Check if the file exists'
    }],
    // Add specific handling for iframe URL errors
    ['auth/iframe-error', {
      code: 'auth/iframe-error',
      message: 'Illegal URL for new iframe',
      userFriendlyMessage: 'Authentication configuration issue. Please try again or contact support.',
      action: 'Try again or contact support'
    }],
    ['auth/configuration-error', {
      code: 'auth/configuration-error',
      message: 'Firebase configuration error',
      userFriendlyMessage: 'There is a configuration issue with the authentication system.',
      action: 'Contact administrator'
    }]
  ]);

  static handleError(error: FirebaseError | Error): FirebaseErrorInfo {
    const errorCode = 'code' in error ? error.code : 'unknown';
    const errorMessage = error.message || 'Unknown error occurred';
    
    // Check for iframe URL errors specifically
    if (errorMessage.includes('Illegal url for new iframe') || errorMessage.includes('%0A')) {
      return {
        code: 'auth/iframe-error',
        message: errorMessage,
        userFriendlyMessage: 'Authentication configuration issue. Please try again or contact support.',
        action: 'Try again or contact support'
      };
    }
    
    // Check for configuration errors
    if (errorMessage.includes('configuration') || errorMessage.includes('config')) {
      return {
        code: 'auth/configuration-error',
        message: errorMessage,
        userFriendlyMessage: 'There is a configuration issue with the authentication system.',
        action: 'Contact administrator'
      };
    }
    
    const mappedError = this.errorMap.get(errorCode);
    
    if (mappedError) {
      return {
        ...mappedError,
        message: errorMessage
      };
    }

    // Default error handling
    return {
      code: errorCode,
      message: errorMessage,
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
      action: 'Try again or contact support'
    };
  }

  static isNetworkError(error: FirebaseError | Error): boolean {
    const errorCode = 'code' in error ? error.code : '';
    return errorCode === 'auth/network-request-failed' || 
           errorCode === 'firestore/unavailable' ||
           error.message.includes('network') ||
           error.message.includes('connection');
  }

  static isAuthError(error: FirebaseError | Error): boolean {
    const errorCode = 'code' in error ? error.code : '';
    return errorCode.startsWith('auth/');
  }

  static isFirestoreError(error: FirebaseError | Error): boolean {
    const errorCode = 'code' in error ? error.code : '';
    return errorCode.startsWith('firestore/');
  }

  static isStorageError(error: FirebaseError | Error): boolean {
    const errorCode = 'code' in error ? error.code : '';
    return errorCode.startsWith('storage/');
  }

  static isIframeError(error: FirebaseError | Error): boolean {
    const errorMessage = error.message || '';
    return errorMessage.includes('Illegal url for new iframe') || 
           errorMessage.includes('%0A') ||
           errorMessage.includes('iframe');
  }

  static getRetryableErrors(): string[] {
    return [
      'auth/network-request-failed',
      'firestore/unavailable',
      'storage/network-request-failed'
    ];
  }

  static shouldRetry(error: FirebaseError | Error): boolean {
    const errorCode = 'code' in error ? error.code : '';
    return this.getRetryableErrors().includes(errorCode);
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry iframe errors as they're configuration issues
        if (this.isIframeError(error as FirebaseError)) {
          throw error;
        }
        
        if (!this.shouldRetry(error as FirebaseError) || attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }
}

export function logFirebaseError(error: FirebaseError | Error, context?: string): void {
  const errorInfo = FirebaseErrorHandler.handleError(error);
  
  console.error(`🔥 Firebase Error${context ? ` (${context})` : ''}:`, {
    code: errorInfo.code,
    message: errorInfo.message,
    userFriendlyMessage: errorInfo.userFriendlyMessage,
    action: errorInfo.action,
    originalError: error
  });
}

export function getFirebaseErrorMessage(error: FirebaseError | Error): string {
  const errorInfo = FirebaseErrorHandler.handleError(error);
  return errorInfo.userFriendlyMessage;
} 