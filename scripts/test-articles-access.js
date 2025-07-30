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

async function testArticlesAccess() {
  console.log('🔍 Testing articles access to Firebase...');
  
  try {
    // Test reading from articles collection
    console.log('📰 Testing articles collection...');
    const articlesCollection = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesCollection);
    console.log(`✅ Successfully read ${articlesSnapshot.size} articles from articles collection`);
    
    // Display article details if any exist
    if (articlesSnapshot.size > 0) {
      console.log('\n📄 Articles found:');
      articlesSnapshot.forEach((doc) => {
        const article = doc.data();
        console.log(`   - ${article.title || 'Untitled'} (ID: ${doc.id})`);
        console.log(`     Status: ${article.status || 'unknown'}`);
        console.log(`     Author: ${article.authorId || 'unknown'}`);
      });
    } else {
      console.log('📝 No articles found in the collection (this is normal for new projects)');
    }
    
    // Test reading from analytics collection
    console.log('\n📊 Testing analytics collection...');
    const analyticsCollection = collection(db, 'analytics');
    const analyticsSnapshot = await getDocs(analyticsCollection);
    console.log(`✅ Successfully read ${analyticsSnapshot.size} documents from analytics collection`);
    
    console.log('\n🎉 Articles access test passed!');
    console.log('📰 Articles can now be accessed without authentication.');
    console.log('📊 Analytics data is also publicly readable for dashboard statistics.');
    
  } catch (error) {
    console.error('❌ Error testing articles access:', error.message);
    console.log('🔧 This might indicate that:');
    console.log('   - Firebase rules need to be updated');
    console.log('   - Articles collection is empty (which is normal for new projects)');
    console.log('   - Network connectivity issues');
  }
}

// Run the test
testArticlesAccess(); 