const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOkVxqHhXqHhXqHhXqHhXqHhXqHhXqHhX",
  authDomain: "clinicalforge.firebaseapp.com",
  projectId: "clinicalforge",
  storageBucket: "clinicalforge.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRealUserData() {
  console.log('🔍 Testing Real User Data Extraction...\n');

  try {
    // Test different collections
    const collections = [
      'enhancedClinicalDatabase',
      'comprehensiveParameterValidation',
      'formSubmissions'
    ];

    for (const collectionName of collections) {
      console.log(`📊 Testing ${collectionName} collection:`);
      
      const querySnapshot = await getDocs(collection(db, collectionName));
      const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (submissions.length === 0) {
        console.log(`   ❌ No submissions found in ${collectionName}`);
        continue;
      }

      console.log(`   ✅ Found ${submissions.length} submissions`);

      // Extract user information from first few submissions
      const userData = submissions.slice(0, 3).map(submission => {
        let displayName = 'Unknown User';
        let userInstitution = 'Unknown Institution';
        let userSpecialty = 'General Medicine';

        // Try to get user info from multiple sources
        if (submission.comprehensiveData?.physicianConsent?.physicianName) {
          displayName = submission.comprehensiveData.physicianConsent.physicianName;
        } else if (submission.metadata?.creation?.createdBy) {
          displayName = submission.metadata.creation.createdBy;
        } else if (submission.metadata?.lastModifiedBy) {
          displayName = submission.metadata.lastModifiedBy;
        } else if (submission.collaboratorId && submission.collaboratorId !== 'unknown') {
          const collaboratorId = submission.collaboratorId;
          if (collaboratorId.includes(' ') || collaboratorId.includes('@')) {
            displayName = collaboratorId;
          } else {
            displayName = `User ${collaboratorId}`;
          }
        }

        // Get institution
        if (submission.comprehensiveData?.physicianConsent?.institution) {
          userInstitution = submission.comprehensiveData.physicianConsent.institution;
        } else if (submission.metadata?.accessControl?.owner) {
          const owner = submission.metadata.accessControl.owner;
          if (owner.includes('@') && owner.includes('.')) {
            const domain = owner.split('@')[1];
            userInstitution = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) + ' Institution';
          }
        }

        return {
          submissionId: submission.submissionId || submission.id,
          displayName,
          userInstitution,
          userSpecialty,
          collaboratorId: submission.collaboratorId,
          hasPhysicianConsent: !!submission.comprehensiveData?.physicianConsent,
          hasMetadata: !!submission.metadata,
          diseaseName: submission.diseaseName || 'Unknown Disease'
        };
      });

      console.log('   👥 Extracted User Data:');
      userData.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.displayName}`);
        console.log(`      Institution: ${user.userInstitution}`);
        console.log(`      Specialty: ${user.userSpecialty}`);
        console.log(`      Disease: ${user.diseaseName}`);
        console.log(`      Submission ID: ${user.submissionId}`);
        console.log(`      Has Physician Consent: ${user.hasPhysicianConsent}`);
        console.log(`      Has Metadata: ${user.hasMetadata}`);
        console.log('');
      });
    }

    console.log('✅ Real user data extraction test completed!');

  } catch (error) {
    console.error('❌ Error testing real user data:', error);
  }
}

// Run the test
testRealUserData(); 