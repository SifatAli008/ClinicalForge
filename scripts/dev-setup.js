#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up development environment...');

// Clear Next.js cache
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('🗑️  Clearing Next.js cache...');
  try {
    // Use cross-platform approach
    if (process.platform === 'win32') {
      execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit', shell: true });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    console.log('✅ Next.js cache cleared');
  } catch (error) {
    console.log('⚠️  Could not clear Next.js cache:', error.message);
  }
}

// Clear node_modules cache if needed
console.log('🧹 Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleared');
} catch (error) {
  console.log('⚠️  Could not clear npm cache:', error.message);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.log('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Clear browser caches (informational)
console.log('\n🌐 Browser Cache Instructions:');
console.log('To clear browser cache and fix Fast Refresh issues:');
console.log('1. Open Developer Tools (F12)');
console.log('2. Right-click the refresh button');
console.log('3. Select "Empty Cache and Hard Reload"');
console.log('4. Or use Ctrl+Shift+R (Cmd+Shift+R on Mac)');

console.log('\n🚀 Development setup complete!');
console.log('Run "npm run dev" to start the development server.');
console.log('\n💡 Tips for Fast Refresh:');
console.log('- Make sure you\'re using localhost, not 127.0.0.1');
console.log('- Check that no browser extensions are interfering');
console.log('- Try incognito/private browsing mode');
console.log('- Disable service worker in development if issues persist'); 