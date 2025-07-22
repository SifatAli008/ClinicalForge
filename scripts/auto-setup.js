const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Automated ClinicalForge Setup...\n');

// Step 1: Update environment variables with real Firebase credentials
console.log('📝 Updating environment variables...');
const envContent = `# Firebase Configuration (Real Project)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687
NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K26DF8CGV4

# App Configuration
NEXT_PUBLIC_APP_NAME=ClinicalForge
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_APP_ENVIRONMENT=production

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ID=G-K26DF8CGV4

# Performance Monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_REPORTING=true

# Admin Access
ADMIN_PASSWORD=Data Debo Na
`;

fs.writeFileSync(path.join(__dirname, '..', '.env.local'), envContent);
console.log('✅ Environment variables updated');

// Step 2: Create Firebase configuration for deployment
console.log('📝 Creating Firebase configuration...');
const firebaseConfig = {
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
};

fs.writeFileSync(path.join(__dirname, '..', 'firebase.json'), JSON.stringify(firebaseConfig, null, 2));
console.log('✅ Firebase configuration created');

// Step 3: Create a script to add test data
console.log('📝 Creating test data script...');
const testDataScript = `
// Test data for ClinicalForge
const testData = {
  clinicalLogic: [
    {
      diseaseName: "Type 2 Diabetes",
      diseaseType: "Chronic",
      typicalOnsetAge: 45,
      genderBias: "Equal",
      urbanRuralBias: "Urban",
      physicianName: "Dr. Sarah Johnson",
      institution: "Johns Hopkins",
      specialty: "Endocrinology",
      submissionDate: new Date(),
      consentGiven: true,
      userId: "user1"
    },
    {
      diseaseName: "Hypertension",
      diseaseType: "Chronic",
      typicalOnsetAge: 50,
      genderBias: "Male",
      urbanRuralBias: "Urban",
      physicianName: "Dr. Michael Chen",
      institution: "Mayo Clinic",
      specialty: "Cardiology",
      submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      consentGiven: true,
      userId: "user2"
    },
    {
      diseaseName: "Cardiovascular Disease",
      diseaseType: "Chronic",
      typicalOnsetAge: 55,
      genderBias: "Male",
      urbanRuralBias: "Both",
      physicianName: "Dr. Emily Davis",
      institution: "Cleveland Clinic",
      specialty: "Cardiology",
      submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      consentGiven: true,
      userId: "user3"
    }
  ],
  contributors: [
    {
      name: "Dr. Sarah Johnson",
      institution: "Johns Hopkins",
      specialty: "Endocrinology",
      submissionCount: 12,
      lastSubmission: new Date(),
      attributionConsent: true
    },
    {
      name: "Dr. Michael Chen",
      institution: "Mayo Clinic",
      specialty: "Cardiology",
      submissionCount: 8,
      lastSubmission: new Date(Date.now() - 24 * 60 * 60 * 1000),
      attributionConsent: true
    },
    {
      name: "Dr. Emily Davis",
      institution: "Cleveland Clinic",
      specialty: "Cardiology",
      submissionCount: 6,
      lastSubmission: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      attributionConsent: true
    }
  ]
};

console.log('Test data ready for import');
`;

fs.writeFileSync(path.join(__dirname, 'test-data.js'), testDataScript);
console.log('✅ Test data script created');

// Step 4: Create deployment instructions
console.log('📝 Creating deployment instructions...');
const deploymentInstructions = `# Automated ClinicalForge Setup

## ✅ Completed Steps:
1. Environment variables updated with real Firebase credentials
2. Firebase configuration created
3. Test data script created

## 🔧 Manual Steps Required:

### 1. Deploy Firebase Rules:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: hdms-a8e42
3. Navigate to Firestore Database → Rules
4. Copy and paste the rules from firestore.rules
5. Click "Publish"

### 2. Add Test Data (Optional):
1. Open Firebase Console → Firestore Database
2. Add documents to collections:
   - clinicalLogic (3 test records)
   - contributors (3 test records)

### 3. Restart Development Server:
\`\`\`bash
npm run dev
\`\`\`

## 🎯 Expected Results:
- Dashboard will show real data instead of empty data
- No more Firebase permission errors
- Real-time updates will work
- All features will be fully functional

## 📊 Test Data Includes:
- 3 clinical logic submissions
- 3 contributor profiles
- Realistic disease data
- Professional healthcare information
`;

fs.writeFileSync(path.join(__dirname, 'deployment-instructions.md'), deploymentInstructions);
console.log('✅ Deployment instructions created');

console.log('\n🎉 Automated setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Deploy Firebase rules manually (see deployment-instructions.md)');
console.log('   2. Add test data to Firebase (optional)');
console.log('   3. Restart development server: npm run dev');
console.log('\n🔧 The application is ready for full functionality!'); 