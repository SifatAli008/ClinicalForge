'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { UserProfile as UserProfileType } from '@/lib/auth-service';
import { LogOut, Edit, Save, X, User as UserIcon } from 'lucide-react';

export function UserProfile() {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    institution: userProfile?.institution || '',
    specialty: userProfile?.specialty || '',
    role: userProfile?.role || 'physician',
    experience: userProfile?.experience || 0,
    bio: userProfile?.bio || '',
  });

  if (!user || !userProfile) {
    return null;
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile.displayName,
      institution: userProfile.institution || '',
      specialty: userProfile.specialty || '',
      role: userProfile.role || 'physician',
      experience: userProfile.experience || 0,
      bio: userProfile.bio || '',
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Profile</CardTitle>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          {userProfile.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.displayName}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Display Name"
              />
            ) : (
              <h3 className="font-semibold">{userProfile.displayName}</h3>
            )}
            <p className="text-sm text-gray-500">{userProfile.email}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="institution">Institution</Label>
            {isEditing ? (
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Your institution"
              />
            ) : (
              <p className="text-sm">{userProfile.institution || 'Not specified'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="specialty">Specialty</Label>
            {isEditing ? (
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Your specialty"
              />
            ) : (
              <p className="text-sm">{userProfile.specialty || 'Not specified'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserProfileType['role'] || 'physician' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm capitalize">{userProfile.role || 'Not specified'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            {isEditing ? (
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                placeholder="Years of experience"
              />
            ) : (
              <p className="text-sm">{userProfile.experience || 0} years</p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <p className="text-sm">{userProfile.bio || 'No bio provided'}</p>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Member since {userProfile.createdAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 