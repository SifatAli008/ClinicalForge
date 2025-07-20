'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase-config';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface ProfileData {
  uid: string;
  displayName: string;
  email: string;
  institution: string;
  specialty: string;
  location: string;
  bio: string;
  avatarUrl: string;
  phoneNumber?: string;
  designation?: string;
  socialMedia?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: ProfileData | null;
  loading: boolean;
  profileLoading: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  createProfile: (profileData: Omit<ProfileData, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(userData);
        
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as ProfileData;
            setUserProfile(profileData);
          } else {
            // Create default profile if doesn't exist
            const defaultProfile: ProfileData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              institution: 'Not specified',
              specialty: 'General Medicine',
              location: 'Not specified',
              bio: 'No bio available',
              avatarUrl: firebaseUser.photoURL || '/default-avatar.svg',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists in Firestore
      const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!profileDoc.exists()) {
        // Create new profile for new user
        const newProfile: ProfileData = {
          uid: result.user.uid,
          displayName: result.user.displayName || 'User',
          email: result.user.email || '',
          institution: 'Not specified',
          specialty: 'General Medicine',
          location: 'Not specified',
          bio: 'No bio available',
          avatarUrl: result.user.photoURL || '/default-avatar.svg',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, 'users', result.user.uid), newProfile);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) throw new Error('No user signed in');
    
    try {
      setProfileLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates, updatedAt: new Date() });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<ProfileData, 'uid' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('No user signed in');
    
    try {
      setProfileLoading(true);
      const newProfile: ProfileData = {
        ...profileData,
        uid: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      profileLoading, 
      isLoading, 
      signIn, 
      signOut, 
      updateProfile,
      createProfile
    }}>
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