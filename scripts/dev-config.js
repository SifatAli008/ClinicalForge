#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Development configuration for Fast Refresh
const devConfig = {
  // Fast Refresh settings
  fastRefresh: {
    enabled: true,
    overlay: true,
    errorOverlay: true,
  },
  
  // Development server settings
  devServer: {
    host: 'localhost',
    port: 3000,
    https: false,
  },
  
  // Cache settings
  cache: {
    clearOnStart: true,
    disableServiceWorker: true, // Disable SW in development
  },
  
  // Browser settings
  browser: {
    clearCache: true,
    disableExtensions: false,
    incognito: false,
  }
};

// Function to clear browser cache instructions
function getBrowserCacheInstructions() {
  return `
🌐 Browser Cache Clear Instructions:

Chrome/Edge:
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+R (Cmd+Shift+R on Mac)

Firefox:
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+R (Cmd+Shift+R on Mac)

Safari:
1. Open Developer Tools (Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Caches and Reload"
4. Or use Cmd+Option+R

Alternative Methods:
- Use incognito/private browsing mode
- Disable browser extensions temporarily
- Clear all browser data for localhost
`;
}

// Function to check development environment
function checkDevEnvironment() {
  const issues = [];
  
  // Check if running on localhost
  if (process.env.HOST && process.env.HOST !== 'localhost') {
    issues.push('⚠️  Consider using localhost instead of custom host for better Fast Refresh');
  }
  
  // Check if HTTPS is enabled (can cause issues)
  if (process.env.HTTPS === 'true') {
    issues.push('⚠️  HTTPS in development can cause Fast Refresh issues');
  }
  
  // Check for service worker
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    issues.push('ℹ️  Service worker detected - may interfere with Fast Refresh');
  }
  
  return issues;
}

// Function to generate development tips
function getDevTips() {
  return `
💡 Fast Refresh Troubleshooting Tips:

1. **Clear Caches:**
   - Run: npm run setup:dev
   - Clear browser cache (see instructions above)
   - Restart development server

2. **Check Environment:**
   - Use localhost:3000 (not 127.0.0.1)
   - Disable browser extensions temporarily
   - Try incognito/private mode

3. **Service Worker Issues:**
   - Service worker may interfere with Fast Refresh
   - Consider disabling in development
   - Clear service worker cache

4. **Network Issues:**
   - Check firewall settings
   - Ensure port 3000 is available
   - Try different port if needed

5. **File System Issues:**
   - Ensure file permissions are correct
   - Check for file system watchers limit
   - Restart IDE/editor if needed

6. **Dependencies:**
   - Run: npm install
   - Clear node_modules and reinstall if needed
   - Check for conflicting packages
`;
}

// Export functions for use in other scripts
module.exports = {
  devConfig,
  getBrowserCacheInstructions,
  checkDevEnvironment,
  getDevTips
};

// If run directly, show help
if (require.main === module) {
  console.log('🔧 Development Configuration Helper\n');
  
  console.log('📋 Current Configuration:');
  console.log(JSON.stringify(devConfig, null, 2));
  
  console.log('\n🔍 Environment Check:');
  const issues = checkDevEnvironment();
  if (issues.length === 0) {
    console.log('✅ Environment looks good for Fast Refresh');
  } else {
    issues.forEach(issue => console.log(issue));
  }
  
  console.log('\n' + getBrowserCacheInstructions());
  console.log('\n' + getDevTips());
} 