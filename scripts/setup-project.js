const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up ClinicalForge project...\n');

// Check if .env.local exists, if not create it
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Firebase Configuration (Mock for Development)
NEXT_PUBLIC_FIREBASE_API_KEY=mock_api_key_for_development
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=clinicalforge-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=clinicalforge-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=clinicalforge-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
NEXT_PUBLIC_APP_NAME=ClinicalForge
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_APP_ENVIRONMENT=development

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_ANALYTICS_ID=

# Performance Monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ERROR_REPORTING=false
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully');
} else {
  console.log('✅ .env.local already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Check if .next exists, if not run build
const nextPath = path.join(__dirname, '..', '.next');
if (!fs.existsSync(nextPath)) {
  console.log('🔨 Building project...');
  try {
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Project built successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.log('⚠️  You can still run the development server with: npm run dev');
  }
} else {
  console.log('✅ Project already built');
}

// Create a simple health check script
const healthCheckPath = path.join(__dirname, 'health-check.js');
const healthCheckContent = `const fs = require('fs');
const path = require('path');

console.log('🏥 ClinicalForge Health Check\\n');

const checks = [
  {
    name: 'Package.json',
    check: () => fs.existsSync(path.join(__dirname, '..', 'package.json')),
    message: 'Package.json exists'
  },
  {
    name: 'Node Modules',
    check: () => fs.existsSync(path.join(__dirname, '..', 'node_modules')),
    message: 'Dependencies installed'
  },
  {
    name: 'Environment File',
    check: () => fs.existsSync(path.join(__dirname, '..', '.env.local')),
    message: 'Environment configured'
  },
  {
    name: 'TypeScript Config',
    check: () => fs.existsSync(path.join(__dirname, '..', 'tsconfig.json')),
    message: 'TypeScript configured'
  },
  {
    name: 'Tailwind Config',
    check: () => fs.existsSync(path.join(__dirname, '..', 'tailwind.config.js')),
    message: 'Tailwind CSS configured'
  },
  {
    name: 'App Directory',
    check: () => fs.existsSync(path.join(__dirname, '..', 'app')),
    message: 'Next.js app directory exists'
  },
  {
    name: 'Components Directory',
    check: () => fs.existsSync(path.join(__dirname, '..', 'components')),
    message: 'Components directory exists'
  },
  {
    name: 'Lib Directory',
    check: () => fs.existsSync(path.join(__dirname, '..', 'lib')),
    message: 'Library directory exists'
  }
];

let allPassed = true;

checks.forEach(({ name, check, message }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(\`\${status} \${name}: \${message}\`);
  if (!passed) allPassed = false;
});

console.log('\\n' + (allPassed ? '🎉 All checks passed! Project is ready.' : '⚠️  Some checks failed. Please review the issues above.'));

if (allPassed) {
  console.log('\\n🚀 You can now run:');
  console.log('   npm run dev    # Start development server');
  console.log('   npm run build  # Build for production');
  console.log('   npm run start  # Start production server');
}
`;

fs.writeFileSync(healthCheckPath, healthCheckContent);
console.log('✅ Health check script created');

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Open: http://localhost:3000');
console.log('   3. For health check: node scripts/health-check.js');
console.log('\n🔧 Available commands:');
console.log('   npm run dev      # Start development server');
console.log('   npm run build    # Build for production');
console.log('   npm run start    # Start production server');
console.log('   npm run lint     # Run ESLint'); 