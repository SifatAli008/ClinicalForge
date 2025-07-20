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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  expertise: string[];
  institution: string;
  contact: string;
  location: string;
  qualifications: string;
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

  // Initialize profile from real user data
  useEffect(() => {
    if (user && userProfile) {
      const realProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || userProfile.displayName || 'User',
        email: user.email || userProfile.email || '',
        photo: user.photoURL || userProfile.avatarUrl || '/default-avatar.svg',
        bio: userProfile.bio || 'No bio available',
        expertise: userProfile.specialty ? [userProfile.specialty] : ['General Medicine'],
        institution: userProfile.institution || 'Not specified',
        contact: userProfile.phoneNumber || 'Not provided',
        location: userProfile.location || 'Not specified',
        qualifications: userProfile.designation || 'Medical Professional',
        joinedDate: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Recently',
        formsCompleted: 0, // Will be updated with real data
        formsIncomplete: 0, // Will be updated with real data
        totalContributions: 0, // Will be updated with real data
        completionRate: 0, // Will be updated with real data
      };
      setProfile(realProfile);
      setEditedProfile(realProfile);
    }
  }, [user, userProfile]);

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
      // Update profile in Firebase
          await updateProfile({
        displayName: editedProfile.name,
        bio: editedProfile.bio,
        institution: editedProfile.institution,
        location: editedProfile.location,
        specialty: editedProfile.expertise.join(', '),
        designation: editedProfile.qualifications,
        phoneNumber: editedProfile.contact,
      });
      
      setProfile(editedProfile);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
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

  const handleInputChange = (field: keyof UserProfile, value: string | string[]) => {
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
      // Simulate API call to get user data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        profile,
        user: user,
        userProfile: userProfile,
        timestamp: new Date().toISOString(),
      };

      // Create and download JSON file
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
        <div className="max-w-4xl mx-auto">
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={profile.photo} 
                    alt={profile.name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{profile.institution}</span>
                  </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.location}</span>
                  </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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
            </div>
                    </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                                {isEditing ? (
                  <Textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="mb-4"
                    placeholder="Tell us about your medical expertise and experience..."
                                  />
                                ) : (
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                )}
                
                <h3 className="font-semibold mb-2">Qualifications</h3>
                                {isEditing ? (
                                  <Input
                    value={editedProfile?.qualifications || ''}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    className="mb-4"
                    placeholder="e.g., MBBS, MD, PhD, etc."
                                  />
                                ) : (
                  <p className="text-muted-foreground mb-4">{profile.qualifications}</p>
                )}
                
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.contact}</span>
                              </div>
                  <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.location}</span>
                              </div>
                            </div>
                          </div>
              
                              <div>
                <h3 className="font-semibold mb-2">Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                              </div>
                
                <h3 className="font-semibold mb-2">Member Since</h3>
                <p className="text-muted-foreground mb-4">{profile.joinedDate}</p>
                              </div>
                            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forms Completed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.formsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                Successfully submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forms Incomplete</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.formsIncomplete}</div>
              <p className="text-xs text-muted-foreground">
                Pending completion
              </p>
                    </CardContent>
                  </Card>

                  <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.totalContributions}</div>
                          <p className="text-xs text-muted-foreground">
                Data points contributed
              </p>
                    </CardContent>
                  </Card>

                    <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Average completion
              </p>
                      </CardContent>
                    </Card>
            </div>

        {/* Recent Activity */}
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
              {profile.totalContributions > 0 ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Clinical Data Submission</h4>
                      <p className="text-sm text-muted-foreground">Your contributions to medical research</p>
                    </div>
                        </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start contributing to see your activity here</p>
                      </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 