import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Disable analytics import to prevent measurement ID errors
// import { getAnalytics, isSupported } from 'firebase/analytics';

// Helper function to clean URLs and remove newline characters
const cleanUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url
    .trim()
    .replace(/\s+/g, '') // Remove all whitespace including newlines
    .replace(/\n/g, '') // Explicitly remove newlines
    .replace(/\r/g, '') // Remove carriage returns
    .replace(/%0A/g, '') // Remove URL-encoded newlines
    .replace(/%0D/g, ''); // Remove URL-encoded carriage returns
};

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

// Clean up any whitespace or newline characters in config values
const cleanConfig = {
  ...firebaseConfig,
  authDomain: cleanUrl(firebaseConfig.authDomain),
  projectId: cleanUrl(firebaseConfig.projectId),
  apiKey: cleanUrl(firebaseConfig.apiKey),
  appId: cleanUrl(firebaseConfig.appId),
  messagingSenderId: cleanUrl(firebaseConfig.messagingSenderId),
  storageBucket: cleanUrl(firebaseConfig.storageBucket),
  databaseURL: cleanUrl(firebaseConfig.databaseURL)
};

// Log the cleaned config for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config (cleaned):', {
    authDomain: cleanConfig.authDomain,
    projectId: cleanConfig.projectId,
    apiKey: cleanConfig.apiKey ? '***' : 'undefined'
  });
}

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(cleanConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Check if we're on a Vercel domain
const isVercelDomain = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.includes('vercel.app') || hostname.includes('localhost');
};

// Completely disable analytics to prevent measurement ID errors
export const analytics = Promise.resolve(null);

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