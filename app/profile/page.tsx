'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Edit,
  Save,
  Download, 
  FileText,
  Clock, 
  CheckCircle,
  AlertCircle,
  Activity,
  Award,
  Building,
  Phone,
  MapPin,
  GraduationCap,
  ArrowLeft,
  Settings,
  Mail,
  Globe,
  Stethoscope,
  User as UserIcon,
  Database,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Users,
  BookOpen,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AuthGuard from '@/components/auth/AuthGuard';
import { getProfileAnalytics, ProfileAnalytics } from '@/lib/profile-analytics-service';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  designation: string;
  specialty: string;
  institution: string;
  location: string;
  phone: string;
  socialMedia: string;
  joinedDate: string;
  formsCompleted: number;
  formsIncomplete: number;
  totalContributions: number;
  completionRate: number;
}

export default function ProfilePage() {
  const { user, userProfile, loading, updateProfile, profileLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Simplified analytics state
  const [analyticsData, setAnalyticsData] = useState<ProfileAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Initialize profile from real user data
  useEffect(() => {
    if (user && userProfile) {
      const realProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || userProfile.displayName || 'Sifat Ali',
        email: user.email || userProfile.email || 'alisifat061@gmail.com',
        photo: user.photoURL || userProfile.avatarUrl || '/default-avatar.svg',
        bio: userProfile.bio || 'Dedicated medical professional committed to advancing healthcare through collaborative research and clinical excellence.',
        designation: userProfile.designation || 'Founder',
        specialty: userProfile.specialty || 'BioTech',
        institution: userProfile.institution || 'United International University',
        location: userProfile.location || 'Jatrabari Dhaka-1204',
        phone: userProfile.phoneNumber || '01315576968',
        socialMedia: userProfile.socialMedia || 'https://www.linkedin.com/in/sifat-ali',
        joinedDate: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Recently',
        formsCompleted: 0,
        formsIncomplete: 0,
        totalContributions: 0,
        completionRate: 0,
      };
      setProfile(realProfile);
      setEditedProfile(realProfile);
    }
  }, [user, userProfile]);

  // Load analytics data once when user is available
  useEffect(() => {
    if (!user?.uid) return;
    
    const loadAnalytics = async () => {
      console.log('🔄 Loading analytics for user:', user.uid);
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      
      try {
        const data = await getProfileAnalytics(user.uid);
        console.log('✅ Analytics loaded:', data);
        setAnalyticsData(data);
      } catch (error: any) {
        console.error('❌ Analytics error:', error);
        setAnalyticsError(error?.message || 'Failed to load analytics');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, [user?.uid]);

  // Get real statistics
  const stats = analyticsData?.statistics || {
    formsCompleted: 0,
    formsIncomplete: 0,
    totalContributions: 0,
    completionRate: 0,
    recentActivity: []
  };

  const handleEdit = () => {
    if (profile) {
      setIsEditing(true);
      setEditedProfile(profile);
      setSaveMessage(null);
    }
  };

  const handleSave = async () => {
    if (!editedProfile || !user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: editedProfile.name,
        bio: editedProfile.bio,
        institution: editedProfile.institution,
        location: editedProfile.location,
        specialty: editedProfile.specialty,
        designation: editedProfile.designation,
        phoneNumber: editedProfile.phone,
        socialMedia: editedProfile.socialMedia,
      });
      
      setProfile(editedProfile);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setIsEditing(false);
      setEditedProfile(profile);
      setSaveMessage(null);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile(prev => prev ? ({
        ...prev,
        [field]: value,
      }) : null);
    }
  };

  const handleDownloadData = async () => {
    if (!profile) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        profile,
        user: user,
        userProfile: userProfile,
        analytics: analyticsData,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clinical-data-${profile.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Show loading state
  if (loading || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Profile Not Available</CardTitle>
              <CardDescription className="text-center">
                Please sign in to view your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="any">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleDownloadData} disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download Data'}
                </Button>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {saveMessage && (
            <Alert className={`mb-6 ${saveMessage.includes('successfully') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{saveMessage}</AlertDescription>
            </Alert>
          )}

          {/* Analytics Error */}
          {analyticsError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {analyticsError}
              </AlertDescription>
            </Alert>
          )}

          {/* Two Column Layout */}
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <Card className="sticky top-8 shadow-xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700 rounded-2xl backdrop-blur-lg">
                <CardHeader className="pb-2 border-b border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-blue-400 drop-shadow" />
                    <div>
                      <CardTitle className="text-lg text-white">Clinical Database</CardTitle>
                      <CardDescription className="text-xs text-zinc-400">Your clinical data stats</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quick Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-blue-300" />
                          <span className="text-xs font-medium text-blue-100">Forms Completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                            <span className="rounded-lg px-2 py-1 bg-blue-700/60 text-blue-100 font-bold text-sm">{stats.formsCompleted}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-900/60 to-yellow-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-300" />
                          <span className="text-xs font-medium text-yellow-100">Forms Incomplete</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-yellow-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                            <span className="rounded-lg px-2 py-1 bg-yellow-700/60 text-yellow-100 font-bold text-sm">{stats.formsIncomplete}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-900/60 to-blue-900/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <PieChart className="h-4 w-4 text-cyan-300" />
                          <span className="text-xs font-medium text-cyan-100">Completion Rate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                            <span className="rounded-lg px-2 py-1 bg-cyan-700/60 text-cyan-100 font-bold text-sm">{stats.completionRate}%</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-900/60 to-green-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-300" />
                          <span className="text-xs font-medium text-green-100">Contributions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-green-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                            <span className="rounded-lg px-2 py-1 bg-green-700/60 text-green-100 font-bold text-sm">{stats.totalContributions}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-zinc-700" />
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Link href="/forms">
                        <Button variant="outline" size="sm" className="w-full justify-start rounded-lg bg-zinc-900/60 hover:bg-blue-900/40 border-zinc-700 text-blue-100 font-semibold transition">
                          <FileText className="h-4 w-4 mr-2" />
                          Submit New Form
                        </Button>
                      </Link>
                      <Link href="/findings">
                        <Button variant="outline" size="sm" className="w-full justify-start rounded-lg bg-zinc-900/60 hover:bg-cyan-900/40 border-zinc-700 text-cyan-100 font-semibold transition">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Findings
                        </Button>
                      </Link>
                      <Link href="/collaborate">
                        <Button variant="outline" size="sm" className="w-full justify-start rounded-lg bg-zinc-900/60 hover:bg-green-900/40 border-zinc-700 text-green-100 font-semibold transition">
                          <Users className="h-4 w-4 mr-2" />
                          Collaborate
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Separator className="bg-zinc-700" />
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Data Security</h4>
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-green-900/60 to-green-800/40">
                      <Shield className="h-4 w-4 text-green-300" />
                      <span className="text-xs text-green-100 font-semibold">Data Encrypted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* User Identity Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Profile Picture */}
                    <div className="relative">
                      <img 
                        src={profile.photo} 
                        alt={profile.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isEditing ? (
                          <Input
                            value={editedProfile?.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-3xl font-bold border-none p-0 bg-transparent"
                          />
                        ) : (
                          profile.name
                        )}
                      </h1>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        {isEditing ? (
                          <Textarea
                            value={editedProfile?.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="border-none p-0 bg-transparent resize-none"
                            rows={3}
                          />
                        ) : (
                          profile.bio
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information Section */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-xl">Account Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.designation || ''}
                              onChange={(e) => handleInputChange('designation', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.designation}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialty</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.specialty || ''}
                              onChange={(e) => handleInputChange('specialty', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.specialty}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Media</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.socialMedia || ''}
                              onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.socialMedia}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.institution || ''}
                              onChange={(e) => handleInputChange('institution', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.institution}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.location || ''}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.location}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                          {isEditing ? (
                            <Input
                              value={editedProfile?.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{profile.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Save Buttons */}
                  <div className="flex justify-end mt-6 pt-4 border-t">
                    {!isEditing ? (
                      <Button onClick={handleEdit} variant="outline" disabled={profileLoading}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button onClick={handleSave} disabled={isSaving || profileLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Your recent form submissions and contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading recent activity...</p>
                      </div>
                    ) : analyticsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-500 font-semibold mb-2">Failed to load recent activity.</p>
                        <Button variant="destructive" onClick={() => window.location.reload()}>Retry</Button>
                      </div>
                    ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">{activity.formType}</h4>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.submittedAt.toLocaleDateString()} at {activity.submittedAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">{activity.status}</Badge>
                            <Link href={`/forms/${activity.formType.replace(/\s+/g, '-').toLowerCase()}/view/${activity.id}`} passHref legacyBehavior>
                              <Button size="sm" variant="outline" className="ml-2">View</Button>
                            </Link>
                            {(activity.status === 'in_progress' || activity.status === 'draft') && (
                              <Link href={`/forms/${activity.formType.replace(/\s+/g, '-').toLowerCase()}/edit/${activity.id}`} passHref legacyBehavior>
                                <Button size="sm" variant="secondary">Update</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground font-semibold mb-2">No activity yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Start contributing to see your activity here.</p>
                        <Link href="/forms">
                          <Button className="mt-2">
                            <FileText className="h-4 w-4 mr-2" />
                            Submit Your First Form
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 