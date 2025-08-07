#!/usr/bin/env node

// Fallback build script for Netlify deployment
// This script ensures the build can proceed even if prebuild fails

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting fallback build process...');

async function createFallbackStaticFiles() {
  console.log('📁 Creating fallback static files...');
  
  const staticDir = join(__dirname, 'public/static');
  mkdirSync(staticDir, { recursive: true });
  
  // Create empty fallback files
  const fallbackPosts = [];
  const fallbackCategories = [];
  
  writeFileSync(
    join(staticDir, 'blog-posts.json'),
    JSON.stringify(fallbackPosts, null, 2)
  );
  
  writeFileSync(
    join(staticDir, 'blog-categories.json'),
    JSON.stringify(fallbackCategories, null, 2)
  );
  
  // Create basic sitemap data
  const baseUrl = 'https://www.sleepylittleone.com';
  const basicSitemapUrls = [
    { url: baseUrl, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { url: `${baseUrl}/faq`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/sleep-quiz`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/platform`, changefreq: 'monthly', priority: '0.7' }
  ];
  
  writeFileSync(
    join(staticDir, 'sitemap-data.json'),
    JSON.stringify(basicSitemapUrls, null, 2)
  );
  
  console.log('✅ Fallback static files created');
}

async function runViteBuild() {
  console.log('🔨 Running Vite build...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['vite', 'build'], {
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Vite build completed successfully');
        resolve(code);
      } else {
        console.error(`❌ Vite build failed with exit code ${code}`);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to run Vite build:', error);
      reject(error);
    });
  });
}

async function main() {
  try {
    // First try to run the normal prebuild script
    console.log('🔄 Attempting normal prebuild...');
    
    const prebuildPath = join(__dirname, 'prebuild.js');
    if (existsSync(prebuildPath)) {
      try {
        await new Promise((resolve, reject) => {
          const child = spawn('node', [prebuildPath], {
            stdio: 'inherit',
            cwd: __dirname,
            env: { ...process.env, NODE_ENV: 'production' }
          });
          
          const timeout = setTimeout(() => {
            child.kill();
            reject(new Error('Prebuild timeout'));
          }, 60000); // 1 minute timeout
          
          child.on('close', (code) => {
            clearTimeout(timeout);
            if (code === 0) {
              console.log('✅ Normal prebuild succeeded');
              resolve(code);
            } else {
              reject(new Error(`Prebuild failed with code ${code}`));
            }
          });
          
          child.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });
      } catch (error) {
        console.warn('⚠️  Normal prebuild failed, using fallback:', error.message);
        await createFallbackStaticFiles();
      }
    } else {
      console.warn('⚠️  Prebuild script not found, using fallback');
      await createFallbackStaticFiles();
    }
    
    // Run Vite build
    await runViteBuild();
    
    console.log('🎉 Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);