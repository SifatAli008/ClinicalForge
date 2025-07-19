'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { UserProfile as UserProfileType } from '@/lib/auth-service';
import { 
  Edit, 
  Save, 
  X, 
  User as UserIcon,
  Building,
  MapPin,
  Loader2
} from 'lucide-react';

interface UserProfileProps {
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  onSave?: () => Promise<void>;
}

export function UserProfile({ isEditing: externalIsEditing, setIsEditing: externalSetIsEditing, onSave }: UserProfileProps) {
  const { user, userProfile, updateProfile } = useAuth();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    username: userProfile?.username || '',
    email: userProfile?.email || user?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    institution: userProfile?.institution || '',
    specialty: userProfile?.specialty || '',
    role: userProfile?.role || 'physician',
    experience: userProfile?.experience || 0,
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    profilePicture: userProfile?.photoURL || user?.photoURL || '',
  });

  // Show loading state with better UX
  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show profile loading with skeleton
  if (!userProfile) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-muted animate-pulse rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          
          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
        role: formData.role,
        experience: formData.experience,
        bio: formData.bio,
        location: formData.location,
        photoURL: formData.profilePicture,
      };
      await updateProfile(updateData);
      setIsEditing(false);
      // Call external save function if provided
      if (onSave) {
        await onSave();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile.displayName,
      username: userProfile.username || '',
      email: userProfile.email || user?.email || '',
      phoneNumber: userProfile.phoneNumber || '',
      institution: userProfile.institution || '',
      specialty: userProfile.specialty || '',
      role: userProfile.role || 'physician',
      experience: userProfile.experience || 0,
      bio: userProfile.bio || '',
      location: userProfile.location || '',
      profilePicture: userProfile.photoURL || user?.photoURL || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-lg font-semibold">Doctor Profile</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Doctor
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {isEditing ? (
              <div className="relative">
                <img
                  src={formData.profilePicture || userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    // In a real app, this would open a file picker
                    const newUrl = prompt('Enter profile picture URL:');
                    if (newUrl) {
                      setFormData({ ...formData, profilePicture: newUrl });
                    }
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <img
                src={userProfile.photoURL}
                alt={userProfile.displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Doctor Name"
                className="text-lg font-semibold"
              />
            ) : (
              <h3 className="text-lg font-semibold">{userProfile.displayName}</h3>
            )}
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Professional Bio"
                className="mt-2 text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                {userProfile.bio || 'No professional bio provided'}
              </p>
            )}
          </div>
        </div>

        {/* Professional Bio Section */}
        {!isEditing && userProfile.bio && (
          <div>
            <Label className="text-sm font-medium">Professional Bio</Label>
            <p className="text-sm text-muted-foreground mt-1">{userProfile.bio}</p>
          </div>
        )}

        {/* Form Fields for Editing */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Institution"
              />
            </div>
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Specialty"
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                placeholder="Years of Experience"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'physician' | 'researcher' | 'student' | 'other' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="physician">Physician</option>
                <option value="researcher">Researcher</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 