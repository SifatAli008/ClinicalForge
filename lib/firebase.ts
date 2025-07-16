import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
  authDomain: "hdms-a8e42.firebaseapp.com",
  projectId: "hdms-a8e42",
  storageBucket: "hdms-a8e42.firebasestorage.app",
  messagingSenderId: "1041849143687",
  appId: "1:1041849143687:web:34d48f1209e10443a30322",
  measurementId: "G-K26DF8CGV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

export default app; 