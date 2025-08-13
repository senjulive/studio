#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Performance budget thresholds (in bytes)
const BUDGETS = {
  // Relaxed budgets for crypto trading platform
  maxBundleSize: 800 * 1024,  // 800KB (crypto platforms need more)
  maxChunkSize: 300 * 1024,   // 300KB per chunk
  maxImageSize: 100 * 1024,   // 100KB for images
  maxCssSize: 80 * 1024,      // 80KB for CSS
  maxServerSize: 15 * 1024 * 1024, // 15MB server bundle

  // Target budgets (ideal)
  targetBundleSize: 600 * 1024,  // 600KB target
  targetChunkSize: 200 * 1024,   // 200KB target per chunk
};

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function analyzeBundle() {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run npm run build first.');
    process.exit(1);
  }
  
  console.log('🔍 Analyzing bundle performance...\n');
  
  // Check build manifest
  const manifestPath = path.join(buildDir, 'build-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('📦 Build Manifest Analysis:');
    console.log(`   Pages: ${Object.keys(manifest.pages).length}`);
    console.log(`   Static assets: ${manifest.devFiles?.length || 0}`);
  }
  
  // Analyze static directory
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    analyzeStaticAssets(staticDir);
  }
  
  // Check server directory size
  const serverDir = path.join(buildDir, 'server');
  if (fs.existsSync(serverDir)) {
    const serverSize = getDirSize(serverDir);
    console.log(`\n🖥️  Server Bundle: ${formatBytes(serverSize)}`);
  }
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');

  const totalJsSize = getTotalJSSize();
  if (totalJsSize > BUDGETS.maxBundleSize) {
    console.log('   📦 Consider using dynamic imports for heavy components');
    console.log('   🔄 Enable code splitting for trading chart libraries');
    console.log('   🗜️  Use tree shaking to remove unused code');
  }

  if (totalJsSize > BUDGETS.targetBundleSize && totalJsSize <= BUDGETS.maxBundleSize) {
    console.log('   ✅ Bundle size acceptable but could be optimized');
  }

  if (totalJsSize <= BUDGETS.targetBundleSize) {
    console.log('   🎯 Excellent! Bundle size meets target budget');
  }

  console.log('\n✅ Performance analysis complete!');
}

function analyzeStaticAssets(staticDir) {
  console.log('\n📊 Static Assets Analysis:');
  
  const jsDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(jsDir)) {
    const jsFiles = getFilesRecursively(jsDir, '.js');
    const totalJsSize = jsFiles.reduce((sum, file) => sum + getFileSize(file), 0);
    
    console.log(`   JavaScript: ${formatBytes(totalJsSize)} (${jsFiles.length} files)`);
    
    // Check for large chunks
    const largeChunks = jsFiles.filter(file => getFileSize(file) > BUDGETS.maxChunkSize);
    if (largeChunks.length > 0) {
      console.log(`   ⚠️  Large chunks found: ${largeChunks.length}`);
      largeChunks.forEach(chunk => {
        console.log(`      - ${path.basename(chunk)}: ${formatBytes(getFileSize(chunk))}`);
      });
    }
    
    if (totalJsSize > BUDGETS.maxBundleSize) {
      console.log(`   ⚠️  Total JS size exceeds budget by ${formatBytes(totalJsSize - BUDGETS.maxBundleSize)}`);
    }
  }
  
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = getFilesRecursively(cssDir, '.css');
    const totalCssSize = cssFiles.reduce((sum, file) => sum + getFileSize(file), 0);
    
    console.log(`   CSS: ${formatBytes(totalCssSize)} (${cssFiles.length} files)`);
    
    if (totalCssSize > BUDGETS.maxCssSize) {
      console.log(`   ⚠️  CSS size exceeds budget by ${formatBytes(totalCssSize - BUDGETS.maxCssSize)}`);
    }
  }
}

function getFilesRecursively(dir, extension) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (path.extname(item) === extension) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function getFileSize(filePath) {
  return fs.statSync(filePath).size;
}

function getDirSize(dirPath) {
  let totalSize = 0;

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        totalSize += stat.size;
      }
    }
  }

  traverse(dirPath);
  return totalSize;
}

function getTotalJSSize() {
  const staticDir = path.join(process.cwd(), '.next', 'static');
  const jsDir = path.join(staticDir, 'chunks');

  if (!fs.existsSync(jsDir)) {
    return 0;
  }

  const jsFiles = getFilesRecursively(jsDir, '.js');
  return jsFiles.reduce((sum, file) => sum + getFileSize(file), 0);
}

// Run analysis
analyzeBundle();
