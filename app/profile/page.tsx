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
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AuthGuard from '@/components/auth/AuthGuard';

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
        formsCompleted: 12,
        formsIncomplete: 3,
        totalContributions: 45,
        completionRate: 80,
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
        specialty: editedProfile.specialty,
        designation: editedProfile.designation,
        phoneNumber: editedProfile.phone,
        socialMedia: editedProfile.socialMedia,
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
    <AuthGuard requiredRole="any">
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

          {/* User Identity Section */}
          <Card className="mb-6">
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

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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

          {/* Recent Activity Section */}
          <Card className="mt-8">
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
                  <>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">Data Field Validation Form</h4>
                          <p className="text-sm text-muted-foreground">Clinical Logic Collection Template validation</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium">Parameter Validation Form</h4>
                          <p className="text-sm text-muted-foreground">Type 2 Diabetes Mellitus parameters</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <div>
                          <h4 className="font-medium">Data Field Validation Form</h4>
                          <p className="text-sm text-muted-foreground">Cardiovascular disease template review</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-sm text-muted-foreground">Start contributing to see your activity here</p>
                    <Link href="/forms">
                      <Button className="mt-4">
                        <FileText className="h-4 w-4 mr-2" />
                        Start Contributing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
} 