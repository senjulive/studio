#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Advanced bundle analysis for AstralCore
class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.results = {
      totalSize: 0,
      chunks: [],
      recommendations: [],
      performance: 'unknown'
    };
  }

  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  analyzeChunks() {
    const chunksDir = path.join(this.buildDir, 'static', 'chunks');
    
    if (!fs.existsSync(chunksDir)) {
      console.log('❌ No chunks directory found. Run npm run build first.');
      return;
    }

    const chunks = this.getChunkFiles(chunksDir);
    
    chunks.forEach(chunk => {
      const size = fs.statSync(chunk.path).size;
      chunk.size = size;
      chunk.sizeFormatted = this.formatSize(size);
      this.results.totalSize += size;
      this.results.chunks.push(chunk);
    });

    // Sort by size
    this.results.chunks.sort((a, b) => b.size - a.size);
  }

  getChunkFiles(dir) {
    const chunks = [];
    
    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.js')) {
          chunks.push({
            name: item,
            path: fullPath,
            relativePath: path.relative(this.buildDir, fullPath),
            type: this.categorizeChunk(item)
          });
        }
      });
    };
    
    scanDirectory(dir);
    return chunks;
  }

  categorizeChunk(filename) {
    if (filename.includes('framework')) return 'Framework';
    if (filename.includes('vendor')) return 'Vendor';
    if (filename.includes('runtime')) return 'Runtime';
    if (filename.includes('main')) return 'Main';
    if (filename.includes('pages')) return 'Pages';
    if (filename.includes('webpack')) return 'Webpack';
    if (filename.includes('react')) return 'React';
    if (filename.includes('next')) return 'Next.js';
    return 'Other';
  }

  generateRecommendations() {
    const largeChunks = this.results.chunks.filter(chunk => chunk.size > 300 * 1024);
    const veryLargeChunks = this.results.chunks.filter(chunk => chunk.size > 500 * 1024);

    if (veryLargeChunks.length > 0) {
      this.results.recommendations.push({
        type: 'critical',
        title: 'Very Large Chunks Detected',
        description: `${veryLargeChunks.length} chunks exceed 500KB`,
        actions: [
          'Consider dynamic imports for heavy components',
          'Split vendor libraries into smaller chunks',
          'Use tree shaking to remove unused exports'
        ]
      });
    }

    if (largeChunks.length > 3) {
      this.results.recommendations.push({
        type: 'warning',
        title: 'Multiple Large Chunks',
        description: `${largeChunks.length} chunks exceed 300KB`,
        actions: [
          'Implement route-based code splitting',
          'Use React.lazy() for component splitting',
          'Consider removing unused dependencies'
        ]
      });
    }

    const totalMB = this.results.totalSize / (1024 * 1024);
    if (totalMB > 5) {
      this.results.recommendations.push({
        type: 'info',
        title: 'Large Bundle Size',
        description: `Total bundle: ${this.formatSize(this.results.totalSize)}`,
        actions: [
          'Audit dependencies with npm-bundle-analyzer',
          'Consider using lighter alternatives',
          'Implement progressive loading strategies'
        ]
      });
    }

    // Performance classification
    if (totalMB < 2) this.results.performance = 'excellent';
    else if (totalMB < 4) this.results.performance = 'good';
    else if (totalMB < 6) this.results.performance = 'acceptable';
    else this.results.performance = 'needs-improvement';
  }

  printReport() {
    console.log('\n🔍 Advanced Bundle Analysis Report\n');
    console.log('='.repeat(50));

    // Summary
    console.log(`📊 Total Bundle Size: ${this.formatSize(this.results.totalSize)}`);
    console.log(`📦 Total Chunks: ${this.results.chunks.length}`);
    console.log(`🎯 Performance: ${this.getPerformanceEmoji()} ${this.results.performance.toUpperCase()}`);

    // Top 10 largest chunks
    console.log('\n📈 Largest Chunks:');
    this.results.chunks.slice(0, 10).forEach((chunk, index) => {
      const icon = index < 3 ? '🔴' : index < 6 ? '🟡' : '🟢';
      console.log(`   ${icon} ${chunk.sizeFormatted.padStart(10)} - ${chunk.name} (${chunk.type})`);
    });

    // Chunk categories
    console.log('\n📂 Chunk Categories:');
    const categories = this.groupByCategory();
    Object.entries(categories).forEach(([type, chunks]) => {
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
      console.log(`   ${type}: ${this.formatSize(totalSize)} (${chunks.length} files)`);
    });

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Optimization Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'critical' ? '🚨' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`\n   ${icon} ${rec.title}`);
        console.log(`      ${rec.description}`);
        rec.actions.forEach(action => {
          console.log(`      • ${action}`);
        });
      });
    }

    // Next steps
    console.log('\n🚀 Next Steps:');
    if (this.results.performance === 'excellent') {
      console.log('   ✅ Bundle size is optimal for production');
      console.log('   ✅ Ready for deployment');
    } else if (this.results.performance === 'good') {
      console.log('   ✅ Bundle size is good for a crypto trading platform');
      console.log('   💡 Consider minor optimizations for better performance');
    } else {
      console.log('   📦 Consider implementing the recommendations above');
      console.log('   🔄 Re-run analysis after optimizations');
    }

    console.log('\n' + '='.repeat(50));
  }

  getPerformanceEmoji() {
    switch (this.results.performance) {
      case 'excellent': return '🎯';
      case 'good': return '✅';
      case 'acceptable': return '⚠️';
      default: return '🚨';
    }
  }

  groupByCategory() {
    return this.results.chunks.reduce((acc, chunk) => {
      if (!acc[chunk.type]) acc[chunk.type] = [];
      acc[chunk.type].push(chunk);
      return acc;
    }, {});
  }

  run() {
    this.analyzeChunks();
    this.generateRecommendations();
    this.printReport();
  }
}

// Run analysis
const analyzer = new BundleAnalyzer();
analyzer.run();
