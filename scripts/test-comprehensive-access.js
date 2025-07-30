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

async function testComprehensiveAccess() {
  console.log('🔍 Testing comprehensive Firebase access...');
  
  const collections = [
    'enhancedClinicalDatabase',
    'comprehensiveParameterValidation', 
    'advancedClinicalAnalytics',
    'formSubmissions',
    'articles',
    'analytics'
  ];
  
  const results = {};
  
  for (const collectionName of collections) {
    try {
      console.log(`📊 Testing ${collectionName} collection...`);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      results[collectionName] = {
        success: true,
        count: snapshot.size
      };
      console.log(`✅ Successfully read ${snapshot.size} documents from ${collectionName}`);
    } catch (error) {
      results[collectionName] = {
        success: false,
        error: error.message
      };
      console.log(`❌ Error reading ${collectionName}: ${error.message}`);
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('='.repeat(50));
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [collectionName, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${collectionName}: ${result.count} documents`);
      successCount++;
      totalCount += result.count;
    } else {
      console.log(`❌ ${collectionName}: ${result.error}`);
    }
  }
  
  console.log('='.repeat(50));
  console.log(`🎯 Success Rate: ${successCount}/${collections.length} collections accessible`);
  console.log(`📊 Total Documents: ${totalCount}`);
  
  if (successCount === collections.length) {
    console.log('\n🎉 All collections are now accessible without authentication!');
    console.log('📱 Dashboard and findings pages should work perfectly.');
  } else {
    console.log('\n⚠️ Some collections still have permission issues.');
    console.log('🔧 Check Firebase rules for the failed collections.');
  }
}

// Run the test
testComprehensiveAccess(); 