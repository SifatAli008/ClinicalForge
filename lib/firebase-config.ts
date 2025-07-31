import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hdms-a8e42.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hdms-a8e42",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hdms-a8e42.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1041849143687",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1041849143687:web:34d48f1209e10443a30322"
  // Removed measurementId to prevent conflicts
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally with better error handling
export const analytics = isSupported().then((yes: boolean) => {
  if (yes) {
    try {
      // Only initialize analytics if we're on an authorized domain
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
      const isVercelDomain = currentDomain.includes('vercel.app');
      
      if (isLocalhost || isVercelDomain) {
        console.log('🔥 Firebase Analytics: Domain may not be authorized, skipping analytics');
        return null;
      }
      
      return getAnalytics(app);
    } catch (error) {
      console.warn('Firebase Analytics initialization failed:', error);
      return null;
    }
  }
  return null;
}).catch((error) => {
  console.warn('Firebase Analytics not supported:', error);
  return null;
});

// Connect to emulator in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Uncomment these lines if you want to use Firebase emulator
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔥 Firebase initialized in development mode');
  } catch (error) {
    console.log('🔥 Firebase initialized (emulator not available)');
  }
} else {
  console.log('🔥 Firebase initialized in production mode');
}

export default app; 