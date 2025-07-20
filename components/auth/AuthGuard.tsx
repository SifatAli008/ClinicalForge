'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'contributor' | 'admin' | 'any';
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole = 'any',
  redirectTo = '/login'
}: AuthGuardProps) {
  const { user, loading, isAdmin, isContributor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user is logged in, redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check role requirements
      if (requiredRole === 'admin' && !isAdmin) {
        router.push('/login');
        return;
      }

      if (requiredRole === 'contributor' && !isContributor) {
        router.push('/login');
        return;
      }
    }
  }, [user, loading, isAdmin, isContributor, requiredRole, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user or role doesn't match, don't render children
  if (!user) {
    return null;
  }

  // Check role requirements
  if (requiredRole === 'admin' && !isAdmin) {
    return null;
  }

  if (requiredRole === 'contributor' && !isContributor) {
    return null;
  }

  // User is authenticated and has required role
  return <>{children}</>;
} 