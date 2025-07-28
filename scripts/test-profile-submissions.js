// Simple test to check profile submissions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

// Firebase config (you'll need to add your actual config here)
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "hdms-a8e42.firebaseapp.com",
  projectId: "hdms-a8e42",
  storageBucket: "hdms-a8e42.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testProfileSubmissions() {
  console.log('🔍 Testing Profile Submissions...');
  
  try {
    // Check if there are any submissions in the enhancedClinicalDatabase
    console.log('\n1. Checking enhancedClinicalDatabase collection...');
    const enhancedQuery = query(
      collection(db, 'enhancedClinicalDatabase'),
      orderBy('submittedAt', 'desc'),
      limit(5)
    );
    
    const enhancedSnapshot = await getDocs(enhancedQuery);
    console.log('✅ Found', enhancedSnapshot.size, 'submissions in enhancedClinicalDatabase');
    
    if (enhancedSnapshot.size > 0) {
      console.log('\n📋 Sample submissions:');
      enhancedSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`\nSubmission ${index + 1}:`);
        console.log('- Document ID:', doc.id);
        console.log('- Submission ID:', data.submissionId);
        console.log('- Collaborator ID:', data.collaboratorId);
        console.log('- Form Type:', data.formType);
        console.log('- Status:', data.status);
        console.log('- Submitted At:', data.submittedAt?.toDate());
      });
    }
    
    // Check legacy collections too
    console.log('\n2. Checking legacy collections...');
    
    const clinicalQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(3)
    );
    const clinicalSnapshot = await getDocs(clinicalQuery);
    console.log('✅ Found', clinicalSnapshot.size, 'submissions in clinicalLogic');
    
    const parameterQuery = query(
      collection(db, 'comprehensiveParameterValidation'),
      orderBy('submissionDate', 'desc'),
      limit(3)
    );
    const parameterSnapshot = await getDocs(parameterQuery);
    console.log('✅ Found', parameterSnapshot.size, 'submissions in comprehensiveParameterValidation');
    
    const analyticsQuery = query(
      collection(db, 'advancedClinicalAnalytics'),
      orderBy('submissionDate', 'desc'),
      limit(3)
    );
    const analyticsSnapshot = await getDocs(analyticsQuery);
    console.log('✅ Found', analyticsSnapshot.size, 'submissions in advancedClinicalAnalytics');
    
    console.log('\n🎯 Summary:');
    console.log('- Enhanced submissions:', enhancedSnapshot.size);
    console.log('- Clinical submissions:', clinicalSnapshot.size);
    console.log('- Parameter submissions:', parameterSnapshot.size);
    console.log('- Analytics submissions:', analyticsSnapshot.size);
    
    if (enhancedSnapshot.size === 0) {
      console.log('\n⚠️ No enhanced submissions found. Please submit a form first.');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
testProfileSubmissions().then(() => {
  console.log('\n🎉 Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 