'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/lib/admin-context';
import { 
  LogOut, 
  Edit, 
  Save, 
  X, 
  User as UserIcon, 
  Shield,
  Stethoscope,
  Building,
  GraduationCap,
  Award,
  Calendar,
  MapPin
} from 'lucide-react';

interface DoctorProfileData {
  displayName: string;
  username: string;
  email: string;
  phoneNumber: string;
  designation: string;
  institution: string;
  specialty: string;
  role: 'physician' | 'researcher' | 'student' | 'other';
  experience: number;
  bio: string;
  location: string;
  certifications: string[];
  education: string;
  researchInterests: string[];
  publications: number;
  patientsSeen: number;
  profilePicture: string;
}

interface DoctorProfileProps {
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
}

export function DoctorProfile({ isEditing: externalIsEditing, setIsEditing: externalSetIsEditing }: DoctorProfileProps) {
  const { logout } = useAdmin();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = externalSetIsEditing || setInternalIsEditing;
  const [formData, setFormData] = useState<DoctorProfileData>({
    displayName: 'Dr. Sarah Johnson',
    username: 'sarah.johnson',
    email: 'sarah.johnson@mayoclinic.com',
    phoneNumber: '+1 (555) 123-4567',
    designation: 'Senior Endocrinologist',
    institution: 'Mayo Clinic',
    specialty: 'Endocrinology',
    role: 'physician',
    experience: 15,
    bio: 'Experienced endocrinologist specializing in diabetes management and metabolic disorders. Passionate about clinical research and patient care.',
    location: 'Rochester, MN',
    certifications: ['Board Certified Endocrinology', 'Diabetes Management Specialist', 'Clinical Research Certification'],
    education: 'MD - Harvard Medical School, Residency - Johns Hopkins',
    researchInterests: ['Type 2 Diabetes', 'Metabolic Syndrome', 'Precision Medicine'],
    publications: 45,
    patientsSeen: 2500,
    profilePicture: '',
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      logout();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-lg font-semibold">Doctor Profile</CardTitle>
          <div className="flex items-center space-x-2 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
            <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Admin</span>
          </div>
        </div>
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
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {isEditing ? (
              <div className="relative">
                <img
                  src={formData.profilePicture || '/default-avatar.png'}
                  alt={formData.displayName}
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
                src={formData.profilePicture || '/default-avatar.png'}
                alt={formData.displayName}
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
              <h3 className="text-lg font-semibold">{formData.displayName}</h3>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formData.institution}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formData.location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formData.experience}</div>
            <div className="text-xs text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formData.publications}</div>
            <div className="text-xs text-muted-foreground">Publications</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formData.patientsSeen}</div>
            <div className="text-xs text-muted-foreground">Patients Seen</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formData.certifications.length}</div>
            <div className="text-xs text-muted-foreground">Certifications</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Your username"
                />
              ) : (
                <p className="text-sm font-medium">{formData.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your email"
                />
              ) : (
                <p className="text-sm">{formData.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Your phone number"
                />
              ) : (
                <p className="text-sm">{formData.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="designation">Designation</Label>
              {isEditing ? (
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Your designation"
                />
              ) : (
                <p className="text-sm font-medium">{formData.designation}</p>
              )}
            </div>

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
                <p className="text-sm">{formData.institution}</p>
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
                <p className="text-sm font-medium">{formData.specialty}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Role</Label>
              {isEditing ? (
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as DoctorProfileData['role'] })}
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
                <p className="text-sm capitalize">{formData.role}</p>
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
                <p className="text-sm">{formData.experience} years</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Your location"
                />
              ) : (
                <p className="text-sm">{formData.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="education">Education</Label>
              {isEditing ? (
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="Your education background"
                  rows={3}
                />
              ) : (
                <p className="text-sm">{formData.education}</p>
              )}
            </div>

            <div>
              <Label>Certifications</Label>
              {isEditing ? (
                <div className="space-y-2">
                  {formData.certifications.map((cert, index) => (
                    <Input
                      key={index}
                      value={cert}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index] = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      placeholder="Certification"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({
                      ...formData,
                      certifications: [...formData.certifications, '']
                    })}
                  >
                    Add Certification
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              rows={4}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{formData.bio}</p>
          )}
        </div>

        {/* Research Interests */}
        <div>
          <Label>Research Interests</Label>
          {isEditing ? (
            <div className="space-y-2">
              {formData.researchInterests.map((interest, index) => (
                <Input
                  key={index}
                  value={interest}
                  onChange={(e) => {
                    const newInterests = [...formData.researchInterests];
                    newInterests[index] = e.target.value;
                    setFormData({ ...formData, researchInterests: newInterests });
                  }}
                  placeholder="Research interest"
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  researchInterests: [...formData.researchInterests, '']
                })}
              >
                Add Research Interest
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {formData.researchInterests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 