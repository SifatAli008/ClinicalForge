import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth } from './firebase-config';
import { ClinicalLogic, UserProfile } from './types';

// Cache for performance optimization
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Connection status
let isConnected = false;
let connectionListeners: Array<(status: boolean) => void> = [];

// Update connection status
function updateConnectionStatus(status: boolean) {
  isConnected = status;
  connectionListeners.forEach(listener => listener(status));
}

// Subscribe to connection status
export function onConnectionChange(callback: (status: boolean) => void) {
  connectionListeners.push(callback);
  return () => {
    connectionListeners = connectionListeners.filter(listener => listener !== callback);
  };
}

// Get connection status
export function getConnectionStatus() {
  return {
    isConnected,
    cacheSize: cache.size,
    cacheKeys: Array.from(cache.keys())
  };
}

// Clear cache
export function clearCache() {
  cache.clear();
  console.log('🗑️ Cache cleared');
}

// Submit clinical logic data
export async function submitClinicalLogic(data: ClinicalLogic): Promise<string> {
  try {
    updateConnectionStatus(true);
    
    const docData = {
      ...data,
      submissionDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'clinicalLogic'), docData);
    
    // Clear cache to ensure fresh data
    cache.delete('clinicalLogic');
    
    console.log('📊 Analytics Event: clinical_data_submitted', { docId: docRef.id });
    return docRef.id;
  } catch (error) {
    updateConnectionStatus(false);
    console.error('Error submitting clinical logic:', error);
    throw new Error('Failed to submit clinical data');
  }
}

// Get clinical logic submissions with caching
export async function getClinicalLogicSubmissions(limitCount = 50): Promise<ClinicalLogic[]> {
  try {
    const cacheKey = `clinicalLogic_${limitCount}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    updateConnectionStatus(true);
    
    const q = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as ClinicalLogic[];
    
    // Cache the results
    cache.set(cacheKey, {
      data: submissions,
      timestamp: Date.now()
    });
    
    return submissions;
  } catch (error) {
    updateConnectionStatus(false);
    console.error('Error fetching clinical logic:', error);
    throw new Error('Failed to fetch clinical data');
  }
}

// Real-time listener for clinical logic
export function subscribeToClinicalLogic(
  callback: (submissions: ClinicalLogic[]) => void,
  errorCallback?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, 
      (snapshot) => {
        const submissions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as ClinicalLogic[];
        
        // Update cache
        cache.set('clinicalLogic_50', {
          data: submissions,
          timestamp: Date.now()
        });
        
        callback(submissions);
      },
      (error) => {
        updateConnectionStatus(false);
        if (errorCallback) {
          errorCallback(error);
        }
        console.error('Real-time listener error:', error);
      }
    );
  } catch (error) {
    updateConnectionStatus(false);
    console.error('Error setting up real-time listener:', error);
    throw new Error('Failed to set up real-time listener');
  }
}

// Authentication functions
export async function signInWithGoogle(): Promise<{ user: FirebaseUser }> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    console.log('📊 Analytics Event: user_sign_in', { method: 'google' });
    return { user: result.user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw new Error('Failed to sign in with Google');
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    console.log('📊 Analytics Event: user_sign_out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

// User profile functions
export async function createOrUpdateUserProfile(user: FirebaseUser): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new profile
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'physician',
        institution: '',
        specialty: '',
        location: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userRef, profile);
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const cacheKey = `userProfile_${uid}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      
      // Cache the profile
      cache.set(cacheKey, {
        data: profile,
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

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    
    // Clear cache for this user
    cache.delete(`userProfile_${uid}`);
    
    console.log('📊 Analytics Event: profile_updated', { fields: Object.keys(updates) });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

// Performance monitoring
export function getPerformanceMetrics() {
  return {
    cacheSize: cache.size,
    cacheKeys: Array.from(cache.keys()),
    isConnected,
    timestamp: Date.now()
  };
} 