#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Enhanced Firebase Configuration...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${step}. ${description}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if user is logged into Firebase
function checkFirebaseAuth() {
  try {
    const result = execSync('firebase projects:list', { stdio: 'pipe' });
    return result.toString().includes('No projects found') || result.toString().includes('Project ID');
  } catch (error) {
    return false;
  }
}

// Initialize Firebase project
function initializeFirebase() {
  logStep('1', 'Checking Firebase CLI installation...');
  
  if (!checkFirebaseCLI()) {
    logError('Firebase CLI is not installed. Please install it first:');
    log('npm install -g firebase-tools', 'yellow');
    process.exit(1);
  }
  
  logSuccess('Firebase CLI is installed');
  
  logStep('2', 'Checking Firebase authentication...');
  
  if (!checkFirebaseAuth()) {
    logWarning('You are not logged into Firebase. Please run:');
    log('firebase login', 'yellow');
    log('Then run this script again.', 'yellow');
    process.exit(1);
  }
  
  logSuccess('Firebase authentication verified');
}

// Update Firebase configuration files
function updateFirebaseConfig() {
  logStep('3', 'Updating Firebase configuration files...');
  
  // Update firebase.json
  const firebaseConfig = {
    "firestore": {
      "rules": "firestore.rules-enhanced",
      "indexes": "firestore.indexes-enhanced.json"
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
    },
    "emulators": {
      "auth": {
        "port": 9099
      },
      "firestore": {
        "port": 8080
      },
      "hosting": {
        "port": 5000
      },
      "ui": {
        "enabled": true,
        "port": 4000
      }
    }
  };
  
  fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));
  logSuccess('Updated firebase.json with enhanced configuration');
  
  // Copy enhanced security rules
  if (fs.existsSync('firestore.rules-enhanced')) {
    fs.copyFileSync('firestore.rules-enhanced', 'firestore.rules');
    logSuccess('Updated firestore.rules with enhanced security rules');
  } else {
    logWarning('firestore.rules-enhanced not found, using default rules');
  }
  
  // Copy enhanced indexes
  if (fs.existsSync('firestore.indexes-enhanced.json')) {
    fs.copyFileSync('firestore.indexes-enhanced.json', 'firestore.indexes.json');
    logSuccess('Updated firestore.indexes.json with enhanced indexes');
  } else {
    logWarning('firestore.indexes-enhanced.json not found, using default indexes');
  }
}

// Deploy Firebase configuration
function deployFirebaseConfig() {
  logStep('4', 'Deploying Firebase configuration...');
  
  try {
    logInfo('Deploying Firestore security rules...');
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    logSuccess('Firestore security rules deployed successfully');
    
    logInfo('Deploying Firestore indexes...');
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    logSuccess('Firestore indexes deployed successfully');
    
  } catch (error) {
    logError('Failed to deploy Firebase configuration');
    logError(error.message);
    process.exit(1);
  }
}

// Create initial collections and documents
function createInitialCollections() {
  logStep('5', 'Creating initial collections and documents...');
  
  const adminDoc = {
    accessControl: {
      adminUsers: [],
      readAccess: [],
      writeAccess: []
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      description: 'Enhanced Clinical Database Admin Configuration'
    }
  };
  
  // This would be created when the first admin user is added
  logInfo('Admin configuration will be created when first admin user is added');
  logSuccess('Initial collections structure prepared');
}

// Setup environment variables
function setupEnvironment() {
  logStep('6', 'Setting up environment variables...');
  
  const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Enhanced Database Configuration
NEXT_PUBLIC_ENHANCED_DATABASE_ENABLED=true
NEXT_PUBLIC_CROSS_FORM_VALIDATION_ENABLED=true
NEXT_PUBLIC_ADVANCED_ANALYTICS_ENABLED=true

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
`;
  
  if (!fs.existsSync('.env.local')) {
    fs.writeFileSync('.env.local', envContent);
    logSuccess('Created .env.local with Firebase configuration template');
    logWarning('Please update .env.local with your actual Firebase project credentials');
  } else {
    logInfo('.env.local already exists, skipping creation');
  }
}

// Validate setup
function validateSetup() {
  logStep('7', 'Validating setup...');
  
  const requiredFiles = [
    'firebase.json',
    'firestore.rules',
    'firestore.indexes.json',
    'lib/enhanced-clinical-database-service.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    logError('Missing required files:');
    missingFiles.forEach(file => log(`  - ${file}`, 'red'));
    process.exit(1);
  }
  
  logSuccess('All required files are present');
  
  // Check if Firebase project is initialized
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
    if (firebaseConfig.firestore && firebaseConfig.firestore.rules) {
      logSuccess('Firebase configuration is valid');
    } else {
      logError('Firebase configuration is invalid');
      process.exit(1);
    }
  } catch (error) {
    logError('Failed to validate Firebase configuration');
    process.exit(1);
  }
}

// Create setup completion script
function createCompletionScript() {
  logStep('8', 'Creating setup completion script...');
  
  const completionScript = `#!/bin/bash

echo "🎉 Enhanced Firebase Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env.local with actual Firebase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Test the forms to ensure they're working with the enhanced database"
echo "4. Deploy to production when ready"
echo ""
echo "For more information, see:"
echo "- ENHANCED_CLINICAL_DATABASE_DESIGN.md"
echo "- DATABASE_IMPROVEMENTS_SUMMARY.md"
echo ""
echo "Happy coding! 🚀"
`;
  
  fs.writeFileSync('scripts/setup-complete.sh', completionScript);
  fs.chmodSync('scripts/setup-complete.sh', '755');
  logSuccess('Created setup completion script');
}

// Main setup function
function main() {
  log('🚀 Enhanced Firebase Setup for ClinicalForge', 'bright');
  log('===============================================\n', 'bright');
  
  try {
    initializeFirebase();
    updateFirebaseConfig();
    deployFirebaseConfig();
    createInitialCollections();
    setupEnvironment();
    validateSetup();
    createCompletionScript();
    
    log('\n🎉 Enhanced Firebase Setup Complete!', 'green');
    log('===============================================', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Update your .env.local with actual Firebase credentials', 'yellow');
    log('2. Run "npm run dev" to start the development server', 'yellow');
    log('3. Test the forms to ensure they\'re working with the enhanced database', 'yellow');
    log('4. Deploy to production when ready', 'yellow');
    log('\nFor more information, see:', 'cyan');
    log('- ENHANCED_CLINICAL_DATABASE_DESIGN.md', 'blue');
    log('- DATABASE_IMPROVEMENTS_SUMMARY.md', 'blue');
    log('\nHappy coding! 🚀', 'green');
    
  } catch (error) {
    logError('Setup failed:');
    logError(error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  initializeFirebase,
  updateFirebaseConfig,
  deployFirebaseConfig,
  createInitialCollections,
  setupEnvironment,
  validateSetup,
  createCompletionScript
}; 