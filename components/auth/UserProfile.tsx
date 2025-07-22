'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { UserProfile as UserProfileType } from '@/lib/auth-service';
import { ProfileData } from '@/lib/mock-data';
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
  realtimeProfileData?: ProfileData | null;
}

export function UserProfile({ 
  isEditing: externalIsEditing, 
  setIsEditing: externalSetIsEditing, 
  onSave,
  realtimeProfileData
}: UserProfileProps) {
  const { user, userProfile, updateProfile } = useAuth();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;
  
  const [formData, setFormData] = useState({
    displayName: '',
    profilePicture: '',
  });

  // Initialize form data when userProfile or realtimeProfileData changes
  useEffect(() => {
    if (userProfile || realtimeProfileData) {
      console.log('UserProfile: Updating form data from userProfile:', userProfile, 'realtimeProfileData:', realtimeProfileData);
      setFormData({
        displayName: realtimeProfileData?.displayName || userProfile?.displayName || '',
        profilePicture: realtimeProfileData?.profilePicture || userProfile?.avatarUrl || user?.photoURL || '',
      });
    }
  }, [userProfile, realtimeProfileData, user]);

  // Sync form data when external editing state changes
  useEffect(() => {
    if (externalIsEditing !== undefined && (userProfile || realtimeProfileData)) {
      console.log('UserProfile: Syncing form data for external editing:', userProfile, realtimeProfileData);
      setFormData({
        displayName: realtimeProfileData?.displayName || userProfile?.displayName || '',
        profilePicture: realtimeProfileData?.profilePicture || userProfile?.avatarUrl || user?.photoURL || '',
      });
    }
  }, [externalIsEditing, userProfile, realtimeProfileData, user]);

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
      setError(null);
      
      console.log('UserProfile: Starting save with form data:', formData);
      
      const updateData = {
        displayName: formData.displayName,
        photoURL: formData.profilePicture,
      };
      
      console.log('UserProfile: Updating profile with data:', updateData);
      await updateProfile(updateData);
      
      console.log('UserProfile: Profile update completed');
      setIsEditing(false);
      
      // Call external save function if provided
      if (onSave) {
        console.log('UserProfile: Calling external save function');
        await onSave();
      }
      
      console.log('UserProfile: Save completed, profile should be updated');
    } catch (error) {
      console.error('UserProfile: Failed to update profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('UserProfile: Canceling edit, resetting form data');
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        profilePicture: userProfile.avatarUrl || user?.photoURL || '',
      });
    }
    setError(null);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
        </div>
        {/* Remove edit button: do not render edit controls */}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {isEditing ? (
              <div className="relative">
                <Image
                  src={formData.profilePicture || realtimeProfileData?.profilePicture || userProfile?.avatarUrl}
                  alt={userProfile?.displayName}
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-2 border-slate-200"
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
              <Image
                src={realtimeProfileData?.profilePicture || userProfile?.avatarUrl}
                alt={userProfile?.displayName}
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Doctor Name"
                className="text-3xl font-bold"
              />
            ) : (
              <h3 className="text-4xl font-bold">{userProfile?.displayName}</h3>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Dedicated medical professional committed to advancing healthcare through collaborative research and clinical excellence.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 