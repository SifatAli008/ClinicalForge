#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Firebase Development Environment...\n');

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

// Setup development environment
function setupDevEnvironment() {
  logStep('1', 'Setting up development environment...');
  
  // Create .env.local for development
  const devEnvContent = `# Firebase Development Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id

# Enhanced Database Configuration
NEXT_PUBLIC_ENHANCED_DATABASE_ENABLED=true
NEXT_PUBLIC_CROSS_FORM_VALIDATION_ENABLED=true
NEXT_PUBLIC_ADVANCED_ANALYTICS_ENABLED=true

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_USE_EMULATORS=true
`;
  
  fs.writeFileSync('.env.local', devEnvContent);
  logSuccess('Created .env.local for development');
}

// Update Firebase config for development
function updateFirebaseConfig() {
  logStep('2', 'Updating Firebase configuration for development...');
  
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
      },
      "storage": {
        "port": 9199
      }
    }
  };
  
  fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));
  logSuccess('Updated firebase.json for development');
  
  // Copy enhanced files
  if (fs.existsSync('firestore.rules-enhanced')) {
    fs.copyFileSync('firestore.rules-enhanced', 'firestore.rules');
    logSuccess('Updated firestore.rules');
  }
  
  if (fs.existsSync('firestore.indexes-enhanced.json')) {
    fs.copyFileSync('firestore.indexes-enhanced.json', 'firestore.indexes.json');
    logSuccess('Updated firestore.indexes.json');
  }
}

// Create development data
function createDevData() {
  logStep('3', 'Creating development data...');
  
  const devData = {
    sampleSubmissions: [
      {
        submissionId: 'dev-sample-1',
        formType: 'comprehensive-parameter-validation',
        diseaseName: 'Sample Disease',
        status: 'approved',
        createdAt: new Date().toISOString()
      },
      {
        submissionId: 'dev-sample-2',
        formType: 'advanced-clinical-analytics',
        diseaseName: 'Sample Analytics',
        status: 'submitted',
        createdAt: new Date().toISOString()
      }
    ]
  };
  
  fs.writeFileSync('scripts/dev-data.json', JSON.stringify(devData, null, 2));
  logSuccess('Created development data template');
}

// Create development scripts
function createDevScripts() {
  logStep('4', 'Creating development scripts...');
  
  const devScripts = {
    "scripts": {
      "dev": "next dev",
      "dev:firebase": "concurrently \"npm run dev\" \"firebase emulators:start\"",
      "dev:firebase:ui": "concurrently \"npm run dev\" \"firebase emulators:start --ui\"",
      "firebase:emulators": "firebase emulators:start",
      "firebase:emulators:ui": "firebase emulators:start --ui",
      "firebase:emulators:export": "firebase emulators:export ./emulator-data",
      "firebase:emulators:import": "firebase emulators:start --import=./emulator-data",
      "test:forms": "npm run dev & sleep 5 && npm run test:forms:cypress",
      "test:forms:cypress": "cypress run --spec \"cypress/e2e/forms.cy.js\""
    }
  };
  
  // Update package.json with dev scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.scripts = { ...packageJson.scripts, ...devScripts.scripts };
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  logSuccess('Updated package.json with development scripts');
}

// Create development documentation
function createDevDocs() {
  logStep('5', 'Creating development documentation...');
  
  const devDocs = `# Development Setup Guide

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup Firebase for development:**
   \`\`\`bash
   npm run setup:firebase:quick
   \`\`\`

3. **Start development server with Firebase emulators:**
   \`\`\`bash
   npm run dev:firebase:ui
   \`\`\`

## Development URLs

- **Next.js App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099

## Available Scripts

- \`npm run dev\` - Start Next.js development server
- \`npm run dev:firebase\` - Start Next.js + Firebase emulators
- \`npm run dev:firebase:ui\` - Start Next.js + Firebase emulators with UI
- \`npm run firebase:emulators\` - Start Firebase emulators only
- \`npm run firebase:emulators:ui\` - Start Firebase emulators with UI
- \`npm run firebase:emulators:export\` - Export emulator data
- \`npm run firebase:emulators:import\` - Import emulator data

## Testing Forms

1. Navigate to http://localhost:3000/forms
2. Test Comprehensive Parameter Validation form
3. Test Advanced Clinical Analytics form
4. Check Firebase emulator UI for data

## Development Data

Sample data is available in \`scripts/dev-data.json\` for testing purposes.

## Troubleshooting

- If emulators fail to start, try: \`firebase emulators:start --only firestore,auth\`
- If ports are in use, modify ports in \`firebase.json\`
- For authentication issues, check Firebase emulator UI
`;
  
  fs.writeFileSync('DEVELOPMENT_SETUP.md', devDocs);
  logSuccess('Created development documentation');
}

// Validate development setup
function validateDevSetup() {
  logStep('6', 'Validating development setup...');
  
  const requiredFiles = [
    'firebase.json',
    'firestore.rules',
    'firestore.indexes.json',
    '.env.local',
    'lib/enhanced-clinical-database-service.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    logError('Missing required files:');
    missingFiles.forEach(file => log(`  - ${file}`, 'red'));
    process.exit(1);
  }
  
  logSuccess('All required files are present');
  
  // Check if Firebase CLI is available
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    logSuccess('Firebase CLI is available');
  } catch (error) {
    logWarning('Firebase CLI not found. Install with: npm install -g firebase-tools');
  }
}

// Main development setup function
function main() {
  log('🚀 Firebase Development Setup for ClinicalForge', 'bright');
  log('==================================================\n', 'bright');
  
  try {
    setupDevEnvironment();
    updateFirebaseConfig();
    createDevData();
    createDevScripts();
    createDevDocs();
    validateDevSetup();
    
    log('\n🎉 Development Setup Complete!', 'green');
    log('==================================================', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Run "npm run dev:firebase:ui" to start development', 'yellow');
    log('2. Open http://localhost:3000 to test the application', 'yellow');
    log('3. Open http://localhost:4000 to view Firebase emulator UI', 'yellow');
    log('4. Test the forms at http://localhost:3000/forms', 'yellow');
    log('\nFor more information, see:', 'cyan');
    log('- DEVELOPMENT_SETUP.md', 'blue');
    log('- ENHANCED_CLINICAL_DATABASE_DESIGN.md', 'blue');
    log('\nHappy development! 🚀', 'green');
    
  } catch (error) {
    logError('Development setup failed:');
    logError(error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  setupDevEnvironment,
  updateFirebaseConfig,
  createDevData,
  createDevScripts,
  createDevDocs,
  validateDevSetup
}; 