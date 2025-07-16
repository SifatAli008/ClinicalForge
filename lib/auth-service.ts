import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { trackUserSignIn, trackUserSignOut, trackProfileUpdate } from './analytics-service';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  institution?: string;
  specialty?: string;
  role?: 'physician' | 'researcher' | 'student' | 'other';
  experience?: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Google authentication
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    
    // Create or update user profile in Firestore
    if (result.user) {
      await createOrUpdateUserProfile(result.user);
    }
    
    // Track sign in event
    trackUserSignIn('google');
    
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw new Error('Failed to sign in with Google');
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
    // Track sign out event
    trackUserSignOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

// Create or update user profile in Firestore
async function createOrUpdateUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new profile
      const userProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'physician' as const, // Default role
      };
      
      await setDoc(userRef, {
        ...userProfile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
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
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    // Track profile update event
    const updatedFields = Object.keys(updates);
    trackProfileUpdate(updatedFields);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
} 