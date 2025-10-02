#!/usr/bin/env node

/**
 * Alora Project Migration Script
 * Helps migrate from old structure to new improved structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname);
const srcPath = path.join(projectRoot, 'myapp', 'src');

/**
 * Migration tasks
 */
const migrationTasks = [
  {
    name: '1. Standardize folder names',
    description: 'Convert inconsistent folder names to kebab-case',
    files: [
      { from: 'pages/Home', to: 'pages/home' },
      { from: 'professionals Dashboard', to: 'features/professional/dashboard' }
    ]
  },
  {
    name: '2. Move shared components',
    description: 'Move reusable components to shared folder',
    files: [
      { from: 'components/header.tsx', to: 'shared/components/header.tsx' },
      { from: 'components/footer.tsx', to: 'shared/components/footer.tsx' },
      { from: 'components/loader.tsx', to: 'shared/components/loader.tsx' }
    ]
  },
  {
    name: '3. Create feature modules',
    description: 'Organize features into dedicated folders',
    features: [
      {
        name: 'auth',
        files: ['pages/auth/*', 'context/auth_provider.ts']
      },
      {
        name: 'booking', 
        files: ['pages/booking/*', 'components/booking_form.tsx']
      },
      {
        name: 'professional',
        files: ['pages/professional/*', 'components/professional-profile-modal.tsx']
      }
    ]
  }
];

/**
 * Check if path exists
 */
function pathExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Create directory recursively
 */
function createDir(dirPath) {
  if (!pathExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

/**
 * Move file from source to destination
 */
function moveFile(from, to) {
  const fromPath = path.join(srcPath, from);
  const toPath = path.join(srcPath, to);
  
  if (!pathExists(fromPath)) {
    console.log(`⚠️  Source file not found: ${from}`);
    return false;
  }
  
  // Create destination directory
  createDir(path.dirname(toPath));
  
  try {
    fs.renameSync(fromPath, toPath);
    console.log(`✅ Moved: ${from} → ${to}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to move ${from}: ${error.message}`);
    return false;
  }
}

/**
 * Update import statements in file
 */
function updateImports(filePath, importMap) {
  if (!pathExists(filePath)) {
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    for (const [oldImport, newImport] of Object.entries(importMap)) {
      const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g');
      if (content.includes(oldImport)) {
        content = content.replace(regex, newImport);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Failed to update imports in ${filePath}: ${error.message}`);
  }
}

/**
 * Scan for files that need import updates
 */
function updateAllImports() {
  const importMap = {
    // Old relative imports to new absolute imports
    '../../../components/ui/': '@/components/ui/',
    '../../components/ui/': '@/components/ui/',
    '../components/ui/': '@/components/ui/',
    './components/ui/': '@/components/ui/',
    
    // Context imports
    '../../context/auth_provider': '@/context/auth_provider',
    '../context/auth_provider': '@/context/auth_provider',
    
    // Shared utilities
    '../../lib/utils': '@/shared/utils',
    '../lib/utils': '@/shared/utils',
    
    // Hooks
    '../../hooks/': '@/hooks/',
    '../hooks/': '@/hooks/',
  };
  
  // Find all TypeScript/JavaScript files
  function findFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findFiles(fullPath, files);
      } else if (item.match(/\\.(ts|tsx|js|jsx)$/)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const files = findFiles(srcPath);
  
  console.log(`\\n📝 Updating imports in ${files.length} files...`);
  
  for (const file of files) {
    updateImports(file, importMap);
  }
}

/**
 * Create index files for better imports
 */
function createIndexFiles() {
  const indexFiles = [
    {
      path: 'shared/index.ts',
      content: `export * from './constants';
export * from './services';
export * from './utils';`
    },
    {
      path: 'features/index.ts',
      content: `// Feature exports
// Add feature exports here as you create them`
    }
  ];
  
  for (const { path: filePath, content } of indexFiles) {
    const fullPath = path.join(srcPath, filePath);
    createDir(path.dirname(fullPath));
    
    if (!pathExists(fullPath)) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Created index file: ${filePath}`);
    }
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Alora Project Migration...\\n');
  
  // Create new directory structure
  const newDirs = [
    'shared',
    'shared/components',
    'shared/constants', 
    'shared/services',
    'shared/utils',
    'shared/layouts',
    'features',
    'features/auth',
    'features/booking',
    'features/professional',
    'features/admin'
  ];
  
  console.log('📁 Creating new directory structure...');
  for (const dir of newDirs) {
    createDir(path.join(srcPath, dir));
  }
  
  // Create index files
  console.log('\\n📄 Creating index files...');
  createIndexFiles();
  
  // Update imports
  console.log('\\n🔄 Updating import statements...');
  updateAllImports();
  
  console.log('\\n✅ Migration completed!');
  console.log('\\n📋 Next steps:');
  console.log('1. Review the changes and test the application');
  console.log('2. Gradually move components to feature folders');
  console.log('3. Update remaining import statements manually');
  console.log('4. Test all functionality to ensure nothing is broken');
  
  console.log('\\n📚 Documentation:');
  console.log('- See PROJECT_STRUCTURE.md for the new structure');
  console.log('- See CODE_QUALITY_IMPROVEMENTS.md for detailed improvements');
}

// Run migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(console.error);
}

export { migrate };