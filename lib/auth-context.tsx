'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange, 
  getUserProfile, 
  updateUserProfile,
  UserProfile 
} from './auth-service';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Cache for user profiles
  const profileCache = new Map<string, { profile: UserProfile; timestamp: number }>();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedProfile = (uid: string): UserProfile | null => {
    const cached = profileCache.get(uid);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.profile;
    }
    return null;
  };

  const setCachedProfile = (uid: string, profile: UserProfile) => {
    profileCache.set(uid, {
      profile,
      timestamp: Date.now()
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        setProfileLoading(true);
        try {
          // Check cache first
          const cachedProfile = getCachedProfile(user.uid);
          if (cachedProfile) {
            setUserProfile(cachedProfile);
            setProfileLoading(false);
            return;
          }

          // Fetch from Firebase if not cached
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          if (profile) {
            setCachedProfile(user.uid, profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateUserProfile(user.uid, updates);
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...updates,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 