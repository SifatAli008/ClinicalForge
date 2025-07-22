const fs = require('fs');
const path = require('path');

console.log('🚀 Firebase Deployment Script\n');

// Step 1: Update environment variables
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

// Step 2: Create Firebase configuration
console.log('📝 Creating Firebase configuration...');
const firebaseConfig = {
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
};

fs.writeFileSync(path.join(__dirname, '..', 'firebase.json'), JSON.stringify(firebaseConfig, null, 2));
console.log('✅ Firebase configuration created');

// Step 3: Create deployment instructions
console.log('📝 Creating deployment instructions...');
const instructions = `# 🔥 Firebase Deployment Instructions

## ✅ Automated Steps Completed:
1. Environment variables updated with real Firebase credentials
2. Firebase configuration created
3. Security rules file ready

## 🔧 Manual Deployment Steps:

### 1. Deploy Firebase Rules:
1. Go to: https://console.firebase.google.com/
2. Select project: hdms-a8e42
3. Navigate to: Firestore Database → Rules
4. Copy the rules from firestore.rules file
5. Paste and click "Publish"

### 2. Add Test Data (Optional):
1. In Firebase Console → Firestore Database
2. Create collection: clinicalLogic
3. Add 3 test documents with the following data:

Document 1:
- diseaseName: "Type 2 Diabetes"
- diseaseType: "Chronic"
- typicalOnsetAge: 45
- physicianName: "Dr. Sarah Johnson"
- institution: "Johns Hopkins"
- specialty: "Endocrinology"
- submissionDate: [current timestamp]
- consentGiven: true

Document 2:
- diseaseName: "Hypertension"
- diseaseType: "Chronic"
- typicalOnsetAge: 50
- physicianName: "Dr. Michael Chen"
- institution: "Mayo Clinic"
- specialty: "Cardiology"
- submissionDate: [yesterday timestamp]
- consentGiven: true

Document 3:
- diseaseName: "Cardiovascular Disease"
- diseaseType: "Chronic"
- typicalOnsetAge: 55
- physicianName: "Dr. Emily Davis"
- institution: "Cleveland Clinic"
- specialty: "Cardiology"
- submissionDate: [2 days ago timestamp]
- consentGiven: true

### 3. Restart Application:
\`\`\`bash
npm run dev
\`\`\`

## 🎯 Expected Results:
- ✅ No more Firebase permission errors
- ✅ Dashboard shows real data
- ✅ Real-time updates work
- ✅ All features fully functional

## 📊 Dashboard Will Show:
- Total Forms: 3
- Total Users: 3
- Recent Submissions: 3
- Top Diseases: Type 2 Diabetes, Hypertension, Cardiovascular Disease
- User Activity: Dr. Sarah Johnson, Dr. Michael Chen, Dr. Emily Davis

## 🔐 Admin Access:
- URL: http://localhost:3000/login
- Password: Data Debo Na
- Dashboard: http://localhost:3000/dashboard
`;

fs.writeFileSync(path.join(__dirname, 'firebase-deployment-guide.md'), instructions);
console.log('✅ Deployment guide created');

console.log('\n🎉 Firebase deployment setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Follow the guide in: scripts/firebase-deployment-guide.md');
console.log('   2. Deploy Firebase rules manually');
console.log('   3. Add test data (optional)');
console.log('   4. Restart: npm run dev');
console.log('\n🔧 The application will be fully functional after deployment!'); 