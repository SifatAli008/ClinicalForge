const fs = require('fs');
const path = require('path');

console.log('🏥 ClinicalForge Health Check\n');

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
  console.log(`${status} ${name}: ${message}`);
  if (!passed) allPassed = false;
});

console.log('\n' + (allPassed ? '🎉 All checks passed! Project is ready.' : '⚠️  Some checks failed. Please review the issues above.'));

if (allPassed) {
  console.log('\n🚀 You can now run:');
  console.log('   npm run dev    # Start development server');
  console.log('   npm run build  # Build for production');
  console.log('   npm run start  # Start production server');
}
