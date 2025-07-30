const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "hdms-a8e42.firebaseapp.com",
  projectId: "hdms-a8e42",
  storageBucket: "hdms-a8e42.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testDashboardAccess() {
  console.log('🔍 Testing dashboard access to Firebase data...');
  
  try {
    // Test reading from enhanced clinical database
    console.log('📊 Testing enhancedClinicalDatabase collection...');
    const enhancedCollection = collection(db, 'enhancedClinicalDatabase');
    const enhancedSnapshot = await getDocs(enhancedCollection);
    console.log(`✅ Successfully read ${enhancedSnapshot.size} documents from enhancedClinicalDatabase`);
    
    // Test reading from comprehensive parameter validation
    console.log('📋 Testing comprehensiveParameterValidation collection...');
    const comprehensiveCollection = collection(db, 'comprehensiveParameterValidation');
    const comprehensiveSnapshot = await getDocs(comprehensiveCollection);
    console.log(`✅ Successfully read ${comprehensiveSnapshot.size} documents from comprehensiveParameterValidation`);
    
    // Test reading from advanced clinical analytics
    console.log('📈 Testing advancedClinicalAnalytics collection...');
    const analyticsCollection = collection(db, 'advancedClinicalAnalytics');
    const analyticsSnapshot = await getDocs(analyticsCollection);
    console.log(`✅ Successfully read ${analyticsSnapshot.size} documents from advancedClinicalAnalytics`);
    
    // Test reading from form submissions
    console.log('📝 Testing formSubmissions collection...');
    const submissionsCollection = collection(db, 'formSubmissions');
    const submissionsSnapshot = await getDocs(submissionsCollection);
    console.log(`✅ Successfully read ${submissionsSnapshot.size} documents from formSubmissions`);
    
    console.log('\n🎉 All tests passed! Dashboard should now be able to access Firebase data.');
    console.log('📊 Dashboard will show real data if available, or demo data if collections are empty.');
    
  } catch (error) {
    console.error('❌ Error testing dashboard access:', error.message);
    console.log('🔧 This might indicate that:');
    console.log('   - Firebase rules need to be updated');
    console.log('   - Collections are empty (which is normal for new projects)');
    console.log('   - Network connectivity issues');
  }
}

// Run the test
testDashboardAccess(); 