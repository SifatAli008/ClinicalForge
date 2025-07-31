const { execSync } = require('child_process');

const envVars = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': 'AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'hdms-a8e42.firebaseapp.com',
  'NEXT_PUBLIC_FIREBASE_DATABASE_URL': 'https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'hdms-a8e42',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': 'hdms-a8e42.firebasestorage.app',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': '1041849143687',
  'NEXT_PUBLIC_FIREBASE_APP_ID': '1:1041849143687:web:34d48f1209e10443a30322',
  'NEXT_PUBLIC_ENHANCED_DATABASE_ENABLED': 'true',
  'NEXT_PUBLIC_CROSS_FORM_VALIDATION_ENABLED': 'true',
  'NEXT_PUBLIC_ADVANCED_ANALYTICS_ENABLED': 'true',
  'NODE_ENV': 'production',
  'NEXT_PUBLIC_USE_EMULATORS': 'false'
};

console.log('Setting up Vercel environment variables...');

Object.entries(envVars).forEach(([key, value]) => {
  try {
    console.log(`Adding ${key}...`);
    execSync(`vercel env add ${key} production`, { 
      input: value + '\n',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(`✅ Added ${key}`);
  } catch (error) {
    console.log(`⚠️ ${key} might already exist or failed to add`);
  }
});

console.log('Environment variables setup complete!'); 