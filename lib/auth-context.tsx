'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithRedirect,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  browserPopupRedirectResolver,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { logFirebaseError, getFirebaseErrorMessage, FirebaseErrorHandler } from './firebase-error-handler';

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

  // Configure Firebase Auth for better compatibility
  useEffect(() => {
    const configureAuth = async () => {
      try {
        // Try local persistence first, fallback to session if iframe issues occur
        try {
          await setPersistence(auth, browserLocalPersistence);
          console.log('🔥 Auth persistence set to local');
        } catch (error) {
          console.warn('🔥 Local persistence failed, using session persistence');
          await setPersistence(auth, browserSessionPersistence);
        }
        
        // Configure popup redirect resolver for better compatibility
        auth.settings.appVerificationDisabledForTesting = false;
      } catch (error) {
        logFirebaseError(error as Error, 'configureAuth');
      }
    };

    configureAuth();
  }, []);

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('🔥 Redirect result found:', result.user.email);
          // Handle the redirect result
          await handleAuthResult(result.user);
        }
      } catch (error) {
        logFirebaseError(error as Error, 'checkRedirectResult');
      }
    };

    checkRedirectResult();
  }, []);

  const handleAuthResult = async (firebaseUser: FirebaseUser) => {
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
      const profileDoc = await FirebaseErrorHandler.retryOperation(
        () => getDoc(doc(db, 'users', firebaseUser.uid))
      );
      
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
        await FirebaseErrorHandler.retryOperation(
          () => setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile)
        );
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      logFirebaseError(error as Error, 'handleAuthResult');
      // Set default profile if Firestore fails
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
      setUserProfile(defaultProfile);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await handleAuthResult(firebaseUser);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        logFirebaseError(error as Error, 'authStateChange');
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (method: 'google' | 'admin') => {
    try {
      if (method === 'google') {
        const provider = new GoogleAuthProvider();
        
        // Configure provider for better compatibility
        provider.setCustomParameters({
          prompt: 'select_account',
          // Add additional parameters to prevent iframe issues
          auth_type: 'signin',
          include_granted_scopes: 'true'
        });
        
        // Add scopes if needed
        provider.addScope('email');
        provider.addScope('profile');
        
        // Try popup first, fallback to redirect if iframe issues occur
        try {
          const result = await signInWithPopup(auth, provider);
          console.log('🔥 Sign in successful via popup');
          
          // Check if user profile exists in Firestore
          try {
            const profileDoc = await FirebaseErrorHandler.retryOperation(
              () => getDoc(doc(db, 'users', result.user.uid))
            );
            
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
              await FirebaseErrorHandler.retryOperation(
                () => setDoc(doc(db, 'users', result.user.uid), newProfile)
              );
            }
          } catch (error) {
            logFirebaseError(error as Error, 'createUserProfile');
            // Continue even if profile creation fails
          }
        } catch (popupError) {
          console.warn('🔥 Popup failed, trying redirect:', popupError);
          
          // If popup fails (likely due to iframe issues), try redirect
          if (FirebaseErrorHandler.isIframeError(popupError as Error)) {
            await signInWithRedirect(auth, provider);
            console.log('🔥 Redirect initiated');
            // The redirect will be handled by the redirect result listener
            return;
          } else {
            throw popupError;
          }
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
      logFirebaseError(error as Error, 'signIn');
      throw new Error(getFirebaseErrorMessage(error as Error));
    }
  };

  const signOut = async () => {
    try {
      if (user?.role !== 'admin') {
        await FirebaseErrorHandler.retryOperation(
          () => firebaseSignOut(auth)
        );
      } else {
        // For admin, just clear the state
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      logFirebaseError(error as Error, 'signOut');
      throw new Error(getFirebaseErrorMessage(error as Error));
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
      
      await FirebaseErrorHandler.retryOperation(
        () => setDoc(doc(db, 'users', user.uid), updatedProfile)
      );
      setUserProfile(updatedProfile as ProfileData);
    } catch (error) {
      logFirebaseError(error as Error, 'updateProfile');
      throw new Error(getFirebaseErrorMessage(error as Error));
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