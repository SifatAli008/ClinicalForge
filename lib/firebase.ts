import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hdms-a8e42.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hdms-a8e42",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hdms-a8e42.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1041849143687",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1041849143687:web:34d48f1209e10443a30322",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-K26DF8CGV4"
};

// Initialize Firebase with performance optimizations
const app = initializeApp(firebaseConfig);

// Initialize Firestore with caching and offline support
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Performance monitoring and connection management
let isConnected = true;
let connectionRetries = 0;
const MAX_RETRIES = 3;

// Connection health check
export const checkConnection = async (): Promise<boolean> => {
  try {
    await enableNetwork(db);
    isConnected = true;
    connectionRetries = 0;
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    isConnected = false;
    return false;
  }
};

// Optimized connection management
export const optimizeConnection = async (): Promise<void> => {
  if (!isConnected && connectionRetries < MAX_RETRIES) {
    connectionRetries++;
    console.log(`Attempting to reconnect to Firebase (attempt ${connectionRetries}/${MAX_RETRIES})`);
    
    try {
      await checkConnection();
    } catch (error) {
      console.error('Failed to reconnect:', error);
      
      if (connectionRetries >= MAX_RETRIES) {
        console.error('Max reconnection attempts reached');
      }
    }
  }
};

// Initialize Analytics with error handling
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.error('Analytics initialization failed:', error);
      }
    }
  }).catch((error) => {
    console.error('Analytics support check failed:', error);
  });
}

export { analytics };

export default app; 