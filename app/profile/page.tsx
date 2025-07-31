'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit,
  Save,
  FileText,
  Clock, 
  CheckCircle,
  AlertCircle,
  Building,
  Phone,
  MapPin,
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
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AuthGuard from '@/components/auth/AuthGuard';
import { getProfileAnalytics, ProfileAnalytics } from '@/lib/profile-analytics-service';
import { EnhancedClinicalDatabaseService } from '@/lib/enhanced-clinical-database-service';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string | null;
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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Simplified analytics state
  const [analyticsData, setAnalyticsData] = useState<ProfileAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Initialize profile from real user data
  useEffect(() => {
    if (user && userProfile) {
      // Ensure we have a valid photo URL with fallback
      let photoUrl = user.photoURL || userProfile.avatarUrl;
      
      // If the photo URL is empty or invalid, don't set a default - let the UI handle it
      if (!photoUrl || photoUrl === 'null' || photoUrl === 'undefined' || photoUrl === '') {
        photoUrl = null as string | null;
      }
      
      // Log for debugging
      console.log('Profile photo URL:', photoUrl);
      
      const realProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || userProfile.displayName || 'Demo User',
        email: user.email || userProfile.email || 'demo@example.com',
        photo: photoUrl,
        bio: userProfile.bio || 'Medical professional committed to advancing healthcare through collaborative research and clinical excellence.',
        designation: userProfile.designation || 'Medical Professional',
        specialty: userProfile.specialty || 'General Medicine',
        institution: userProfile.institution || 'Medical Institution',
        location: userProfile.location || 'City, Country',
        phone: userProfile.phoneNumber || '+1 (555) 123-4567',
        socialMedia: userProfile.socialMedia || 'https://linkedin.com/in/demo-profile',
        joinedDate: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Recently',
        formsCompleted: 0,
        formsIncomplete: 0,
        totalContributions: 0,
        completionRate: 0,
      };
      setProfile(realProfile);
      setEditedProfile(realProfile);
      setImageError(false); // Reset image error state when profile changes
    }
  }, [user, userProfile]);

  const loadAnalytics = useCallback(async () => {
    if (!user?.uid) {
      console.log('⚠️ No user UID available for analytics loading');
      return;
    }
    
    console.log('🔄 Loading analytics for user:', user.uid);
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    
    try {
      const data = await getProfileAnalytics(user.uid);
      console.log('✅ Analytics loaded:', data);
      console.log('📊 Statistics:', data.statistics);
      console.log('📋 Recent activity count:', data.statistics.recentActivity.length);
      console.log('📋 Recent activity:', data.statistics.recentActivity);
      setAnalyticsData(data);
    } catch (error: unknown) {
      console.error('❌ Analytics error:', error);
      setAnalyticsError((error as Error)?.message || 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user?.uid]);

  // Load analytics data once when user is available
  useEffect(() => {
    if (user?.uid) {
      loadAnalytics();
    }
  }, [user?.uid, loadAnalytics]);

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

  const handleViewSubmission = async (activity: any) => {
    console.log('Viewing submission:', activity);
    console.log('Activity details:', {
      id: activity.id,
      submissionId: activity.submissionId,
      formType: activity.formType,
      status: activity.status
    });
    
    // Find the full submission data from analytics
    let fullSubmission = null;
    if (analyticsData?.statistics?.recentActivity) {
      // Find the submission in recent activity that matches this activity
      const matchingActivity = analyticsData.statistics.recentActivity.find(
        recent => recent.id === activity.id || recent.id === activity.submissionId
      );
      
      if (matchingActivity) {
        // Try to get the full submission data from the enhanced submissions
        const enhancedService = new EnhancedClinicalDatabaseService();
        try {
          const userSubmissions = await enhancedService.getUserSubmissions(user?.uid || '');
          fullSubmission = userSubmissions.find(s => 
            s.submissionId === activity.id || 
            s.submissionId === activity.submissionId ||
            s.submissionId === matchingActivity.id
          );
        } catch (error) {
          console.log('Could not fetch full submission data:', error);
        }
      }
    }
    
    // Set the submission data for the modal
    setSelectedSubmission({
      activity,
      fullSubmission
    });
    setShowSubmissionModal(true);
  };

  const handleUpdateSubmission = async (activity: any) => {
    console.log('Updating submission:', activity);
    
    // Try to get the actual submission data
    let submissionData = null;
    const enhancedService = new EnhancedClinicalDatabaseService();
    
    try {
      // First try to get from user submissions
      const userSubmissions = await enhancedService.getUserSubmissions(user?.uid || '');
      submissionData = userSubmissions.find(s => 
        s.submissionId === activity.id || 
        s.submissionId === activity.submissionId
      );
      
      if (submissionData) {
        console.log('Found actual submission data:', submissionData);
      } else {
        console.log('No actual submission data found, creating mock data');
        // Create mock data as fallback
        submissionData = {
          submissionId: activity.id,
          formType: activity.formType,
          status: activity.status,
          submittedAt: activity.submittedAt,
          diseaseName: activity.diseaseName || '',
          diseaseType: activity.diseaseType || '',
          // Add form-specific data structure
          comprehensiveData: activity.formType.includes('Comprehensive Parameter Validation') ? {
            diseaseOverview: {
              diseaseName: { clinical: activity.diseaseName || 'Unknown Disease' },
              diseaseType: { primary: activity.diseaseType || 'unknown' }
            },
            additionalNotes: 'Original submission data'
          } : undefined,
          advancedAnalyticsData: activity.formType.includes('Advanced Clinical Analytics') ? {
            decisionModels: [],
            criticalPoints: [],
            conflictZones: [],
            feedbackLoops: [],
            sections: [],
            overallAssessment: {
              additionalSections: '',
              overallFeedback: 'Original submission data',
              clinicalRelevance: 'good',
              implementationReadiness: 'ready'
            }
          } : undefined
        };
      }
    } catch (error) {
      console.error('Error fetching submission data:', error);
      // Create mock data as fallback
      submissionData = {
        submissionId: activity.id,
        formType: activity.formType,
        status: activity.status,
        submittedAt: activity.submittedAt,
        diseaseName: activity.diseaseName || '',
        diseaseType: activity.diseaseType || '',
        // Add form-specific data structure
        comprehensiveData: activity.formType.includes('Comprehensive Parameter Validation') ? {
          diseaseOverview: {
            diseaseName: { clinical: activity.diseaseName || 'Unknown Disease' },
            diseaseType: { primary: activity.diseaseType || 'unknown' }
          },
          additionalNotes: 'Original submission data'
        } : undefined,
        advancedAnalyticsData: activity.formType.includes('Advanced Clinical Analytics') ? {
          decisionModels: [],
          criticalPoints: [],
          conflictZones: [],
          feedbackLoops: [],
          sections: [],
          overallAssessment: {
            additionalSections: '',
            overallFeedback: 'Original submission data',
            clinicalRelevance: 'good',
            implementationReadiness: 'ready'
          }
        } : undefined
      };
    }
    
    // Store the submission data in localStorage for the form to use
    localStorage.setItem('editSubmissionData', JSON.stringify(submissionData));
    localStorage.setItem('editSubmissionId', activity.id);
    
    // Redirect to the appropriate form page
    if (activity.formType.includes('Comprehensive Parameter Validation')) {
      window.location.href = '/forms/comprehensive-parameter-validation';
    } else if (activity.formType.includes('Advanced Clinical Analytics')) {
      window.location.href = '/forms/data-field-validation';
    } else {
      alert(`Update functionality for ${activity.formType} is not yet implemented.`);
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
                                             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-900/60 to-orange-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                           <AlertCircle className="h-4 w-4 text-orange-300" />
                           <span className="text-xs font-medium text-orange-100">Forms Incomplete</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                             <Loader2 className="h-4 w-4 animate-spin text-orange-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                             <span className="rounded-lg px-2 py-1 bg-orange-700/60 text-orange-100 font-bold text-sm">{stats.formsIncomplete}</span>
                          )}
                        </div>
                      </div>
                                             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-900/60 to-indigo-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                           <PieChart className="h-4 w-4 text-indigo-300" />
                           <span className="text-xs font-medium text-indigo-100">Completion Rate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                             <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                             <span className="rounded-lg px-2 py-1 bg-indigo-700/60 text-indigo-100 font-bold text-sm">{stats.completionRate}%</span>
                          )}
                        </div>
                      </div>
                                             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 shadow-sm">
                        <div className="flex items-center space-x-2">
                           <TrendingUp className="h-4 w-4 text-emerald-300" />
                           <span className="text-xs font-medium text-emerald-100">Contributions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {analyticsLoading ? (
                             <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
                          ) : analyticsError ? (
                            <Badge variant="secondary">--</Badge>
                          ) : (
                             <span className="rounded-lg px-2 py-1 bg-emerald-700/60 text-emerald-100 font-bold text-sm">{stats.totalContributions}</span>
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
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-blue-900/60 to-indigo-800/40">
                      <Shield className="h-4 w-4 text-blue-300" />
                      <span className="text-xs text-blue-100 font-semibold">Data Encrypted</span>
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
                      <div className="relative w-24 h-24">
                        {profile.photo && profile.photo !== '/default-avatar.svg' && profile.photo !== '' ? (
                          <div className="relative">
                            {(() => {
                              try {
                                return (
                                  <Image 
                                    src={imageError ? '/default-avatar.svg' : profile.photo} 
                                    alt={profile.name}
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-white shadow-lg object-cover"
                                    onError={() => {
                                      setImageError(true);
                                    }}
                                    onLoad={() => {
                                      setImageError(false);
                                    }}
                                    unoptimized={profile.photo.startsWith('data:') || profile.photo.startsWith('blob:')}
                                  />
                                );
                              } catch (error) {
                                console.error('Error rendering profile image:', error);
                                return (
                                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                      <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-1" />
                                      <div className="text-xs text-gray-500 font-medium">
                                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-1" />
                              <div className="text-xs text-gray-500 font-medium">
                                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
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
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="ml-2"
                              onClick={() => handleViewSubmission(activity)}
                            >
                              View
                            </Button>
                            {(activity.status === 'in_progress' || activity.status === 'draft') && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleUpdateSubmission(activity)}
                              >
                                Update
                              </Button>
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

       {/* Submission Details Modal */}
       {showSubmissionModal && selectedSubmission && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center space-x-3">
                 <FileText className="h-6 w-6 text-blue-500" />
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submission Details</h2>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowSubmissionModal(false)}
                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               >
                 <X className="h-5 w-5" />
               </Button>
             </div>

             {/* Modal Content */}
             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
               <div className="space-y-6">
                 {/* Basic Submission Info */}
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                   <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center space-x-2">
                     <FileText className="h-5 w-5" />
                     <span>Submission Information</span>
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Form Type</label>
                       <p className="text-blue-900 dark:text-blue-100 font-semibold">{selectedSubmission.activity.formType}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Status</label>
                       <Badge className={`ml-2 ${selectedSubmission.activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                         {selectedSubmission.activity.status}
                       </Badge>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Submission ID</label>
                       <p className="text-blue-900 dark:text-blue-100 font-mono text-sm">{selectedSubmission.activity.id}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Submitted</label>
                       <p className="text-blue-900 dark:text-blue-100">{selectedSubmission.activity.submittedAt.toLocaleDateString()}</p>
                     </div>
                   </div>
                 </div>

                 {/* Comprehensive Data */}
                 {selectedSubmission.fullSubmission?.comprehensiveData && (
                   <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                     <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center space-x-2">
                       <Database className="h-5 w-5" />
                       <span>Comprehensive Parameter Validation Data</span>
                     </h3>
                     <div className="space-y-3">
                       <div>
                         <label className="text-sm font-medium text-green-700 dark:text-green-300">Disease Name</label>
                         <p className="text-green-900 dark:text-green-100 font-semibold">
                           {selectedSubmission.fullSubmission.comprehensiveData.diseaseOverview?.diseaseName?.clinical || 'N/A'}
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-green-700 dark:text-green-300">Disease Type</label>
                         <p className="text-green-900 dark:text-green-100">
                           {selectedSubmission.fullSubmission.comprehensiveData.diseaseOverview?.diseaseType?.primary || 'N/A'}
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-green-700 dark:text-green-300">Additional Notes</label>
                         <p className="text-green-900 dark:text-green-100">
                           {selectedSubmission.fullSubmission.comprehensiveData.additionalNotes || 'N/A'}
                         </p>
                       </div>
                       {selectedSubmission.fullSubmission.comprehensiveData.diseaseSubtypes?.length > 0 && (
                         <div>
                           <label className="text-sm font-medium text-green-700 dark:text-green-300">Disease Subtypes</label>
                           <p className="text-green-900 dark:text-green-100">
                             {selectedSubmission.fullSubmission.comprehensiveData.diseaseSubtypes.length} subtypes defined
                           </p>
                         </div>
                       )}
                       {selectedSubmission.fullSubmission.comprehensiveData.geneticRiskFactors?.length > 0 && (
                         <div>
                           <label className="text-sm font-medium text-green-700 dark:text-green-300">Genetic Risk Factors</label>
                           <p className="text-green-900 dark:text-green-100">
                             {selectedSubmission.fullSubmission.comprehensiveData.geneticRiskFactors.length} factors identified
                           </p>
                         </div>
                       )}
                       {selectedSubmission.fullSubmission.comprehensiveData.medications?.length > 0 && (
                         <div>
                           <label className="text-sm font-medium text-green-700 dark:text-green-300">Medications</label>
                           <p className="text-green-900 dark:text-green-100">
                             {selectedSubmission.fullSubmission.comprehensiveData.medications.length} medications documented
                           </p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Advanced Analytics Data */}
                 {selectedSubmission.fullSubmission?.advancedAnalyticsData && (
                   <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                     <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center space-x-2">
                       <BarChart3 className="h-5 w-5" />
                       <span>Advanced Clinical Analytics Data</span>
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Decision Models</label>
                         <p className="text-purple-900 dark:text-purple-100 font-semibold">
                           {selectedSubmission.fullSubmission.advancedAnalyticsData.decisionModels?.length || 0} models
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Critical Points</label>
                         <p className="text-purple-900 dark:text-purple-100 font-semibold">
                           {selectedSubmission.fullSubmission.advancedAnalyticsData.criticalPoints?.length || 0} points
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Conflict Zones</label>
                         <p className="text-purple-900 dark:text-purple-100 font-semibold">
                           {selectedSubmission.fullSubmission.advancedAnalyticsData.conflictZones?.length || 0} zones
                         </p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Feedback Loops</label>
                         <p className="text-purple-900 dark:text-purple-100 font-semibold">
                           {selectedSubmission.fullSubmission.advancedAnalyticsData.feedbackLoops?.length || 0} loops
                         </p>
                       </div>
                     </div>
                     {selectedSubmission.fullSubmission.advancedAnalyticsData.overallAssessment?.overallFeedback && (
                       <div className="mt-4">
                         <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Overall Feedback</label>
                         <p className="text-purple-900 dark:text-purple-100 mt-1">
                           {selectedSubmission.fullSubmission.advancedAnalyticsData.overallAssessment.overallFeedback}
                         </p>
                       </div>
                     )}
                   </div>
                 )}



                 {/* Fallback Summary */}
                 {!selectedSubmission.fullSubmission && (
                   <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                     <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center space-x-2">
                       <AlertCircle className="h-5 w-5" />
                       <span>Summary View</span>
                     </h3>
                     <p className="text-yellow-900 dark:text-yellow-100 mb-3">
                       This is a summary view. For detailed data, use the Update button to edit the submission.
                     </p>
                     {selectedSubmission.activity.formType.includes('Comprehensive Parameter Validation') && (
                       <div className="space-y-2">
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Disease Name:</strong> {selectedSubmission.activity.diseaseName || 'N/A'}
                         </p>
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Disease Type:</strong> {selectedSubmission.activity.diseaseType || 'N/A'}
                         </p>
                       </div>
                     )}
                     {selectedSubmission.activity.formType.includes('Advanced Clinical Analytics') && (
                       <div className="space-y-2">
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Decision Models:</strong> Multiple models validated
                         </p>
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Critical Points:</strong> Critical decision points identified
                         </p>
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Conflict Zones:</strong> Conflict zones analyzed
                         </p>
                         <p className="text-sm text-yellow-700 dark:text-yellow-300">
                           <strong>Feedback Loops:</strong> Feedback loops implemented
                         </p>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             </div>

             {/* Modal Footer */}
             <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
               <Button
                 variant="outline"
                 onClick={() => setShowSubmissionModal(false)}
               >
                 Close
               </Button>
               {(selectedSubmission.activity.status === 'in_progress' || selectedSubmission.activity.status === 'draft') && (
                 <Button
                   onClick={() => {
                     setShowSubmissionModal(false);
                     handleUpdateSubmission(selectedSubmission.activity);
                   }}
                 >
                   Update Submission
                 </Button>
               )}
             </div>
           </div>
         </div>
       )}
    </AuthGuard>
  );
} 