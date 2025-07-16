#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Script for ClinicalForge');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687
NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K26DF8CGV4

# Performance Settings
NEXT_PUBLIC_CACHE_DURATION=300000
NEXT_PUBLIC_MAX_RETRIES=3
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully');
} else {
  console.log('✅ .env.local already exists');
}

// Check package.json for Firebase dependencies
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'firebase',
    '@firebase/app',
    '@firebase/firestore',
    '@firebase/auth'
  ];
  
  const missingDeps = requiredDeps.filter(dep => !dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('📦 Missing Firebase dependencies detected:');
    missingDeps.forEach(dep => console.log(`   - ${dep}`));
    console.log('\nRun: npm install firebase');
  } else {
    console.log('✅ All Firebase dependencies are installed');
  }
}

// Check Firebase configuration files
const firebaseFiles = [
  'firebase.json',
  'firestore.rules',
  'firestore.indexes.json'
];

console.log('\n📁 Checking Firebase configuration files...');
firebaseFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Create basic firebase.json if it doesn't exist
const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseJsonPath)) {
  console.log('\n📝 Creating firebase.json...');
  
  const firebaseConfig = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "hosting": {
      "public": "out",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };
  
  fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2));
  console.log('✅ firebase.json created');
}

// Create basic firestore.rules if it doesn't exist
const firestoreRulesPath = path.join(process.cwd(), 'firestore.rules');
if (!fs.existsSync(firestoreRulesPath)) {
  console.log('\n📝 Creating firestore.rules...');
  
  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to submit clinical data
    match /clinicalLogic/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read contributor data
    match /contributors/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Analytics data
    match /analytics/{document} {
      allow read, write: if request.auth != null;
    }
  }
}`;
  
  fs.writeFileSync(firestoreRulesPath, rules);
  console.log('✅ firestore.rules created');
}

// Create basic firestore.indexes.json if it doesn't exist
const firestoreIndexesPath = path.join(process.cwd(), 'firestore.indexes.json');
if (!fs.existsSync(firestoreIndexesPath)) {
  console.log('\n📝 Creating firestore.indexes.json...');
  
  const indexes = {
    "indexes": [
      {
        "collectionGroup": "clinicalLogic",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "submissionDate",
            "order": "DESCENDING"
          }
        ]
      },
      {
        "collectionGroup": "contributors",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "lastSubmission",
            "order": "DESCENDING"
          }
        ]
      },
      {
        "collectionGroup": "clinicalLogic",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "physicianName",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "submissionDate",
            "order": "DESCENDING"
          }
        ]
      }
    ],
    "fieldOverrides": []
  };
  
  fs.writeFileSync(firestoreIndexesPath, JSON.stringify(indexes, null, 2));
  console.log('✅ firestore.indexes.json created');
}

console.log('\n🎉 Firebase setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select your project: hdms-a8e42');
console.log('3. Enable Firestore Database');
console.log('4. Deploy security rules: firebase deploy --only firestore:rules');
console.log('5. Start your development server: npm run dev');
console.log('\n📊 Monitor performance in the dashboard using the Firebase Monitor component');
console.log('\n🔧 For troubleshooting, check the FIREBASE_SETUP.md file'); 