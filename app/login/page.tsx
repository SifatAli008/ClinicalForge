'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Shield, 
  Database,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'contributor' | 'admin'>('contributor');

  const handleContributorLogin = async () => {
    try {
      setIsSigningIn(true);
      setError('');
      await signIn('google');
      router.push('/forms');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setIsSigningIn(true);
      setError('');
      
      if (adminPassword === 'Data Debo Na') {
        await signIn('admin');
        router.push('/dashboard');
      } else {
        setError('Invalid admin password. Please try again.');
      }
    } catch (error) {
      setError('Failed to sign in as admin. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ClinicalForge</h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Choose your login method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={activeTab === 'contributor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('contributor')}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Contributor
              </Button>
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('admin')}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>

            {/* Contributor Login */}
            {activeTab === 'contributor' && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Sign in with your Google account to contribute data
                  </p>
                </div>
                
                <Button 
                  onClick={handleContributorLogin}
                  disabled={loading || isSigningIn}
                  className="w-full"
                  size="lg"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Admin Login */}
            {activeTab === 'admin' && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter admin password to access system controls
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="pr-10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAdminLogin();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleAdminLogin}
                  disabled={loading || isSigningIn || !adminPassword}
                  className="w-full"
                  size="lg"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isSigningIn ? 'Signing in...' : 'Sign in as Admin'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 