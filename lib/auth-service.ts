// Mock auth service for better performance - replaces Firebase Auth
import { ProfileData } from './mock-data';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber?: string;
  designation?: string;
  institution?: string;
  specialty?: string;
  role?: 'physician' | 'researcher' | 'student' | 'other';
  experience?: number;
  bio?: string;
  location?: string;
  education?: string;
  certifications?: string[];
  researchInterests?: string[];
  publications?: number;
  patientsSeen?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock user credential
export interface UserCredential {
  user: User;
}

// Mock user
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock authentication
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      uid: 'mock-user-123',
      email: 'test@example.com',
      displayName: 'Dr. Test User',
      photoURL: '/default-avatar.svg',
    };
    
    // Create or update user profile
    await createOrUpdateUserProfile(mockUser);
    
    // Track sign in event
    console.log('📊 Analytics Event: user_sign_in', { method: 'google' });
    
    return { user: mockUser };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw new Error('Failed to sign in with Google');
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Track sign out event
    console.log('📊 Analytics Event: user_sign_out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

// Create or update user profile
async function createOrUpdateUserProfile(user: User): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'physician',
      institution: 'Test Hospital',
      specialty: 'General Medicine',
      location: 'Test City',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store in localStorage for demo purposes
    localStorage.setItem('userProfile', JSON.stringify(mockProfile));
    
    console.log('User profile created/updated:', mockProfile);
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

// Cache for user profiles
const profileCache = new Map<string, { profile: UserProfile; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get user profile with caching
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    // Check cache first
    const cached = profileCache.get(uid);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.profile;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get from localStorage for demo purposes
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      const profile = JSON.parse(stored) as UserProfile;
      
      // Cache the profile
      profileCache.set(uid, {
        profile,
        timestamp: Date.now()
      });
      
      return profile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

// Update user profile
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current profile
    const currentProfile = await getUserProfile(uid);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }
    
    // Update profile
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date(),
    };
    
    // Store updated profile
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Clear cache for this user to ensure fresh data
    profileCache.delete(uid);
    
    // Track profile update event
    const updatedFields = Object.keys(updates);
    console.log('📊 Analytics Event: profile_updated', { fields: updatedFields });
    
    console.log('User profile updated:', updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  // Simulate auth state change
  const mockUser: User = {
    uid: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Dr. Test User',
    photoURL: '/default-avatar.svg',
  };
  
  // Call callback immediately with mock user
  setTimeout(() => callback(mockUser), 100);
  
  // Return unsubscribe function
  return () => {};
}

// Get current user
export function getCurrentUser(): User | null {
  const mockUser: User = {
    uid: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Dr. Test User',
    photoURL: '/default-avatar.svg',
  };
  
  return mockUser;
} 