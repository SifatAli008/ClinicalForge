const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample article data
const sampleArticle = {
  title: 'As a physician, why is your participation in the creation and use of clinical synthetic data in Bangladesh necessary?',
  description: 'Comprehensive analysis of disease prevalence, clinical diversity, and the necessity of physician participation in creating contextually appropriate health datasets for Bangladesh.',
  category: 'Public Health Research',
  tags: ['Clinical Data', 'Physician Participation', 'Bangladesh Healthcare', 'Disease Prevalence', 'Synthetic Data', 'Diabetes', 'CKD'],
  author: 'Team Bionic',
  institution: 'ClinicalForge Platform',
  impact: 'Established framework for physician-driven clinical data collection in Bangladesh',
  methodology: 'Comprehensive literature review and analysis of national health statistics from 2021-2024',
  keyFindings: [
    'Diabetes prevalence: 14.2% with 61.5% unawareness rate',
    'CKD prevalence: 22-22.5% (twice global average)',
    'Only 32% follow-up rate due to economic barriers',
    'Regional variations in disease patterns require local expertise',
    'Women often conceal symptoms due to cultural factors',
    'Urban vs rural disparities in healthcare access'
  ],
  datasetSize: 'Literature Review & National Statistics',
  contributors: 1,
  citations: 8,
  readTime: '25 min read',
  status: 'published',
  publishDate: '2024-01-20',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
};

async function populateFirebase() {
  try {
    console.log('🚀 Starting to populate Firebase with article data...');
    
    const docRef = await addDoc(collection(db, 'articles'), sampleArticle);
    console.log('✅ Article added successfully with ID:', docRef.id);
    console.log('🎉 Firebase population completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating Firebase:', error);
    process.exit(1);
  }
}

// Run the population
populateFirebase(); 