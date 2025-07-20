'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';

export type UserRole = 'public' | 'contributor' | 'admin';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
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
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: ProfileData | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (method: 'google' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  isAdmin: boolean;
  isContributor: boolean;
  isPublic: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if this is an admin user (by email or special flag)
        const isAdminUser = firebaseUser.email === 'admin@clinicalforge.com' || 
                           firebaseUser.displayName?.includes('Admin');
        
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          role: isAdminUser ? 'admin' : 'contributor',
        };
        setUser(userData);
        
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data() as ProfileData;
            setUserProfile(profileData);
          } else {
            // Create default profile for new user
            const defaultProfile: ProfileData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              institution: 'Not specified',
              specialty: 'General Medicine',
              location: 'Not specified',
              bio: 'No bio available',
              avatarUrl: firebaseUser.photoURL || '/default-avatar.svg',
              role: isAdminUser ? 'admin' : 'contributor',
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
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (method: 'google' | 'admin') => {
    try {
      if (method === 'google') {
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
            role: 'contributor',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await setDoc(doc(db, 'users', result.user.uid), newProfile);
        }
      } else if (method === 'admin') {
        // For admin login, we'll use a special approach
        // This could be enhanced with a proper admin authentication system
        const adminUser: User = {
          uid: 'admin-uid',
          displayName: 'Admin User',
          email: 'admin@clinicalforge.com',
          role: 'admin',
        };
        setUser(adminUser);
        
        const adminProfile: ProfileData = {
          uid: 'admin-uid',
          displayName: 'Admin User',
          email: 'admin@clinicalforge.com',
          institution: 'ClinicalForge Admin',
          specialty: 'System Administration',
          location: 'System',
          bio: 'System Administrator',
          avatarUrl: '/default-avatar.svg',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(adminProfile);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (user?.role !== 'admin') {
        await firebaseSignOut(auth);
      } else {
        // For admin, just clear the state
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(updatedProfile as ProfileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isContributor = user?.role === 'contributor';
  const isPublic = !user;

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      profileLoading,
      signIn,
      signOut,
      updateProfile,
      isAdmin,
      isContributor,
      isPublic,
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