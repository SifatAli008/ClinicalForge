'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { LoginButton } from '@/components/auth/LoginButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  X,
  Plus,
  Users,
  Mail,
  Linkedin,
  FileText,
  BarChart3,
  Upload,
  Camera,
  CheckCircle,
  Download
} from 'lucide-react';
import { trackProfileAccess } from '@/lib/analytics-service';
import { useRouter } from 'next/navigation';

interface ProfileFormData {
  displayName: string;
  username: string;
  email: string;
  phoneNumber: string;
  institution: string;
  specialty: string;
  role: 'physician' | 'researcher' | 'student' | 'other';
  experience: number;
  bio: string;
  location: string;
  photoURL: string;
  linkedinUrl: string;
}

interface ActivityItem {
  id: string;
  type: 'submission' | 'profile_update' | 'data_added' | 'validation';
  title: string;
  timestamp: string;
  color: string;
}

interface ProfileStats {
  submissions: number;
  diseaseTypes: number;
  contributions: number;
  pending: number;
  lastSubmission?: string;
}

interface FormItem {
  id: string;
  title: string;
  type: string;
  missingFields: string[];
  lastUpdated: string;
  progress: number;
  status: 'complete' | 'incomplete';
}

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, profileLoading, signOut, updateProfile } = useAuth();
  const { isAuthenticated, loading: adminLoading, logout: adminLogout } = useAdmin();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = React.useState<ProfileFormData>({
    displayName: '',
    username: '',
    email: '',
    phoneNumber: '',
    institution: '',
    specialty: '',
    role: 'physician',
    experience: 0,
    bio: '',
    location: '',
    photoURL: '',
    linkedinUrl: '',
  });

  // Activity data
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);

  // Profile statistics
  const [profileStats, setProfileStats] = React.useState<ProfileStats>({
    submissions: 0,
    diseaseTypes: 0,
    contributions: 0,
    pending: 0
  });

  // Forms data (both complete and incomplete)
  const [forms, setForms] = React.useState<FormItem[]>([
    {
      id: '1',
      title: 'Diabetes Clinical Data',
      type: 'Clinical Logic Collection',
      missingFields: ['Lab values', 'Medication protocol'],
      lastUpdated: '2 days ago',
      progress: 75,
      status: 'incomplete'
    },
    {
      id: '2',
      title: 'Hypertension Research Data',
      type: 'Clinical Logic Collection',
      missingFields: ['Emergency conditions', 'Cultural aspects'],
      lastUpdated: '1 week ago',
      progress: 60,
      status: 'incomplete'
    },
    {
      id: '3',
      title: 'Cardiovascular Disease Study',
      type: 'Clinical Logic Collection',
      missingFields: [],
      lastUpdated: '3 days ago',
      progress: 100,
      status: 'complete'
    },
    {
      id: '4',
      title: 'Respiratory Conditions Analysis',
      type: 'Clinical Logic Collection',
      missingFields: [],
      lastUpdated: '1 day ago',
      progress: 100,
      status: 'complete'
    }
  ]);

  // Initialize form data when userProfile is loaded
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || user?.displayName || 'Sifat Ali',
        username: userProfile.username || '',
        email: userProfile.email || user?.email || 'alisifat061@gmail.com',
        phoneNumber: userProfile.phoneNumber || '01315576968',
        institution: userProfile.institution || 'United International University',
        specialty: userProfile.specialty || 'BioTech',
        role: userProfile.role || 'physician',
        experience: userProfile.experience || 0,
        bio: userProfile.bio || 'Dedicated medical professional committed to advancing healthcare through collaborative research and clinical excellence.',
        location: userProfile.location || 'Jatrabari Dhaka-1204',
        photoURL: userProfile.photoURL || user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        linkedinUrl: 'https://www.linkedin.com/in/sifat-ali'
      });
    }
  }, [userProfile, user]);

  // Track profile access
  React.useEffect(() => {
    if (user || isAuthenticated) {
      trackProfileAccess();
    }
  }, [user, isAuthenticated]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        adminLogout();
      } else if (user) {
        await signOut();
      }
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile save
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const updateData = {
        displayName: formData.displayName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        institution: formData.institution,
        specialty: formData.specialty,
        role: formData.role as 'physician' | 'researcher' | 'student' | 'other',
        experience: formData.experience,
        bio: formData.bio,
        location: formData.location,
        photoURL: formData.photoURL,
      };

      await updateProfile(updateData);
      
      // Add activity for profile update
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'profile_update',
        title: 'Profile Updated',
        timestamp: 'Just now',
        color: 'bg-blue-500'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || user?.displayName || 'Sifat Ali',
        username: userProfile.username || '',
        email: userProfile.email || user?.email || 'alisifat061@gmail.com',
        phoneNumber: userProfile.phoneNumber || '01315576968',
        institution: userProfile.institution || 'United International University',
        specialty: userProfile.specialty || 'BioTech',
        role: userProfile.role || 'physician',
        experience: userProfile.experience || 0,
        bio: userProfile.bio || 'Dedicated medical professional committed to advancing healthcare through collaborative research and clinical excellence.',
        location: userProfile.location || 'Jatrabari Dhaka-1204',
        photoURL: userProfile.photoURL || user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        linkedinUrl: 'https://www.linkedin.com/in/sifat-ali'
      });
    }
    setIsEditing(false);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit mode toggle with animation
  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
      // Add a subtle animation effect
      setTimeout(() => {
        const firstInput = document.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you would upload to a storage service
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          handleInputChange('photoURL', result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handle new submission
  const handleNewSubmission = () => {
    router.push('/dashboard');
  };

  // Handle collaboration request
  const handleCollaboration = () => {
    // In a real app, this would open a modal or navigate to a collaboration page
    alert('Collaboration feature coming soon!');
  };

  // Handle completing incomplete forms
  const handleCompleteForm = (formId: string) => {
    // In a real app, this would navigate to the form with pre-filled data
    router.push(`/dashboard?formId=${formId}&mode=edit`);
  };

  // Handle downloading form data as JSON
  const handleDownloadForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      const formData = {
        id: form.id,
        title: form.title,
        type: form.type,
        status: form.status,
        progress: form.progress,
        lastUpdated: form.lastUpdated,
        submittedBy: user?.email,
        submittedAt: new Date().toISOString(),
        // In a real app, this would include the actual form data
        formData: {
          // Placeholder for actual form data
          diseaseName: "Sample Disease",
          diseaseType: "Chronic",
          typicalOnsetAge: 45,
          // ... other form fields
        }
      };
      
      const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title.replace(/\s+/g, '_')}_${formId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'submission':
        return <FileText className="h-4 w-4" />;
      case 'profile_update':
        return <User className="h-4 w-4" />;
      case 'data_added':
        return <BarChart3 className="h-4 w-4" />;
      case 'validation':
        return <Award className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
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
                <h1 className="text-3xl font-bold">{formData.role} Profile</h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage your professional profile, clinical data, and account settings.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Profile Summary Card */}
                  <Card className={`transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-200 shadow-lg' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <img
                            src={formData.photoURL}
                            alt={formData.displayName}
                            className={`w-20 h-20 rounded-full object-cover transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-300' : ''}`}
                          />
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0 bg-white hover:bg-gray-50 border-2 border-gray-300 shadow-md transition-all duration-200 hover:scale-110"
                              onClick={handleProfilePictureUpload}
                            >
                              <Camera className="h-3 w-3 text-gray-600" />
                            </Button>
                          )}
                          {!isEditing && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Edit className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <Input
                                value={formData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                className="text-2xl font-bold border-none p-0 h-auto focus:ring-0 focus:border-none bg-transparent placeholder:text-gray-400"
                                placeholder="Enter your name"
                              />
                              <Textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="text-sm border-none p-0 resize-none focus:ring-0 focus:border-none bg-transparent placeholder:text-gray-400"
                                rows={3}
                                placeholder="Enter your professional bio"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold">{formData.displayName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formData.bio}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Information Card */}
                  <Card className={`transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-200 shadow-lg' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        Account Information
                        {isEditing && (
                          <Badge variant="secondary" className="text-xs">
                            Editing
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Designation</Label>
                            {isEditing ? (
                              <Input
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter designation"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.role}</p>
                            )}
                          </div>
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Specialty</Label>
                            {isEditing ? (
                              <Input
                                value={formData.specialty}
                                onChange={(e) => handleInputChange('specialty', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter specialty"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.specialty}</p>
                            )}
                          </div>
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                            {isEditing ? (
                              <Input
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                type="email"
                                placeholder="Enter email"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.email}</p>
                            )}
                          </div>
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Social Media</Label>
                            {isEditing ? (
                              <Input
                                value={formData.linkedinUrl}
                                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter LinkedIn URL"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.linkedinUrl}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Institution</Label>
                            {isEditing ? (
                              <Input
                                value={formData.institution}
                                onChange={(e) => handleInputChange('institution', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter institution"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.institution}</p>
                            )}
                          </div>
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                            {isEditing ? (
                              <Input
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter location"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.location}</p>
                            )}
                          </div>
                          <div className="group">
                            <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                            {isEditing ? (
                              <Input
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter phone number"
                              />
                            ) : (
                              <p className="text-sm mt-1 group-hover:text-gray-700 transition-colors">{formData.phoneNumber}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  {/* Forms List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Forms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {forms.length > 0 ? (
                        <div className="space-y-3">
                          {forms.map((form) => (
                            <div 
                              key={form.id} 
                              className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                                form.status === 'complete' 
                                  ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900' 
                                  : 'border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  form.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium">{form.title}</p>
                                    {form.status === 'complete' && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {form.status === 'complete' 
                                      ? 'All fields completed' 
                                      : `Missing: ${form.missingFields.join(', ')}`
                                    }
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Last updated: {form.lastUpdated}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className={`flex-1 rounded-full h-1 ${
                                      form.status === 'complete' ? 'bg-green-200' : 'bg-orange-200'
                                    }`}>
                                      <div 
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                          form.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'
                                        }`}
                                        style={{ width: `${form.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-xs ${
                                      form.status === 'complete' 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                      {form.progress}% complete
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-3">
                                {form.status === 'incomplete' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-orange-600 border-orange-300 hover:bg-orange-200"
                                    onClick={() => handleCompleteForm(form.id)}
                                  >
                                    Continue Editing
                                  </Button>
                                )}
                                {form.status === 'complete' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 border-green-300 hover:bg-green-200"
                                    onClick={() => handleDownloadForm(form.id)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download JSON
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-gray-600" />
                          </div>
                          <p className="text-sm text-muted-foreground">No forms available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Clinical Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">No clinical data available yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Profile Actions */}
              <div className="space-y-3">
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={handleEditToggle}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>

              {/* Profile Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Profile Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Submissions</span>
                      <span className="text-sm font-medium">{profileStats.submissions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Type of Disease</span>
                      <span className="text-sm font-medium">{profileStats.diseaseTypes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Number of Contribution</span>
                      <span className="text-sm font-medium">{profileStats.contributions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="text-sm font-medium">{profileStats.pending}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">Last Submission</p>
                      <p className="text-xs text-muted-foreground">
                        {profileStats.lastSubmission || "No submissions yet."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={handleNewSubmission}
                    >
                      <Plus className="h-4 w-4" />
                      New Submission
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={handleCollaboration}
                    >
                      <Users className="h-4 w-4" />
                      Connect for Collaboration
                    </Button>
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