'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { UserProfile } from '@/components/auth/UserProfile';
import { DoctorProfile } from '@/components/auth/DoctorProfile';
import { LoginButton } from '@/components/auth/LoginButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Shield, 
  User, 
  Stethoscope, 
  Building, 
  MapPin, 
  Calendar,
  Award,
  Activity,
  Settings,
  LogOut,
  Phone,
  Edit,
  Save,
  X
} from 'lucide-react';
import { trackProfileAccess } from '@/lib/analytics-service';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, profileLoading, signOut, updateProfile } = useAuth();
  const { isAuthenticated, loading: adminLoading, logout: adminLogout } = useAdmin();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Track profile access
  React.useEffect(() => {
    if (user || isAuthenticated) {
      trackProfileAccess();
    }
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        adminLogout();
      } else if (user) {
        await signOut();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // The save logic is handled by the UserProfile component
      // We just need to close the editing mode
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      setIsLoading(true);
      // This will be called by the UserProfile component when it saves
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while userProfile is being fetched
  if (user && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Doctor Login Required</CardTitle>
            <p className="text-muted-foreground">
              Please sign in to access your doctor profile and clinical data.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Doctor Profile</h1>
                {isAuthenticated && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
                {user && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Doctor
                  </Badge>
                )}
                {isEditing && (
                  <Badge variant="default" className="flex items-center gap-1 bg-orange-500">
                    <Edit className="h-3 w-3" />
                    Editing
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel Edit
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Edit
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage your professional profile, clinical data, and account settings.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Profile Section */}
            <div className="lg:col-span-2">
              {isAuthenticated ? (
                <DoctorProfile isEditing={isEditing} setIsEditing={setIsEditing} />
              ) : user ? (
                <UserProfile 
                  isEditing={isEditing} 
                  setIsEditing={setIsEditing} 
                  onSave={handleProfileSave} 
                />
              ) : (
                <Card className="w-full">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold leading-none tracking-tight flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Username</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.username || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Institution</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.institution || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Specialty</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.specialty || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Years of Experience</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.experience || 0} years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.location || 'Not specified'}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone Number</p>
                          <p className="text-sm text-muted-foreground">{userProfile?.phoneNumber || 'Not specified'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Account Type</p>
                          <p className="text-sm text-muted-foreground">Administrator</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Access Level</p>
                          <p className="text-sm text-muted-foreground">Full System Access</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Authentication</p>
                          <p className="text-sm text-muted-foreground">Password Protected</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Diabetes Data Submitted</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Profile Updated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Hypertension Data Added</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Research Data Validated</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 