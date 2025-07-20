const fs = require('fs');
const path = require('path');

// Files that need to be updated
const filesToUpdate = [
  'lib/firebase-service.ts',
  'components/ui/firebase-test.tsx'
];

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace imports
    content = content.replace(
      /import\s*{\s*([^}]*)\s*}\s*from\s*['"]@?\.\/firebase['"]/g,
      (match, imports) => {
        const newImports = imports
          .split(',')
          .map(imp => imp.trim())
          .map(imp => {
            if (imp === 'db') return 'getDb';
            if (imp === 'auth') return 'getAuth';
            if (imp === 'database') return 'getDatabase';
            return imp;
          })
          .join(', ');
        
        return `import { ${newImports} } from './firebase'`;
      }
    );
    
    // Replace usage of db, auth, database with function calls
    content = content.replace(/\bdb\b/g, 'getDb()');
    content = content.replace(/\bauth\b/g, 'getAuth()');
    content = content.replace(/\bdatabase\b/g, 'getDatabase()');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${filePath}`);
  }
});

console.log('Firebase imports fixed!'); 