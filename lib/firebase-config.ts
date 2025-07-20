import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
  authDomain: "hdms-a8e42.firebaseapp.com",
  databaseURL: "https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hdms-a8e42",
  storageBucket: "hdms-a8e42.firebasestorage.app",
  messagingSenderId: "1041849143687",
  appId: "1:1041849143687:web:34d48f1209e10443a30322",
  measurementId: "G-K26DF8CGV4"
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

// Initialize Analytics conditionally
export const analytics = isSupported().then((yes: boolean) => yes ? getAnalytics(app) : null);

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