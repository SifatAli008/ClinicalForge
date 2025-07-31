#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Re-enabling service worker...');

const swPath = path.join(process.cwd(), 'public', 'sw.js');
const swBackupPath = path.join(process.cwd(), 'public', 'sw.js.backup');

// Check if backup exists
if (!fs.existsSync(swBackupPath)) {
  console.log('ℹ️  No service worker backup found');
  console.log('Service worker is already enabled or was never disabled');
  process.exit(0);
}

try {
  // Restore original service worker
  fs.copyFileSync(swBackupPath, swPath);
  console.log('✅ Original service worker restored');
  
  // Remove backup file
  fs.unlinkSync(swBackupPath);
  console.log('✅ Backup file removed');
  
  console.log('✅ Service worker re-enabled');
  console.log('💡 Remember to restart your development server');
  
} catch (error) {
  console.error('❌ Failed to re-enable service worker:', error.message);
  process.exit(1);
} 