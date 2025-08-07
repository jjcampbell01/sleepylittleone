#!/usr/bin/env node

// This is a compatibility wrapper for the actual prebuild script
// Since package.json is read-only and references prebuild.js, 
// this file redirects to the actual script at scripts/prebuild.mjs

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = join(__dirname, 'scripts', 'prebuild.mjs');

console.log('🔍 Checking prebuild environment...');
console.log('📂 Current directory:', __dirname);
console.log('📄 Looking for script at:', scriptPath);

// Verify the script exists before trying to run it
if (!existsSync(scriptPath)) {
  console.error('❌ Prebuild script not found at:', scriptPath);
  console.error('📁 Available files in scripts directory:');
  
  const scriptsDir = join(__dirname, 'scripts');
  if (existsSync(scriptsDir)) {
    import('fs').then(fs => {
      console.log(fs.readdirSync(scriptsDir));
    });
  } else {
    console.error('❌ Scripts directory does not exist');
  }
  process.exit(1);
}

console.log('✅ Prebuild script found');
console.log('🔄 Running prebuild script...');

const child = spawn('node', [scriptPath], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'production' }
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Prebuild completed successfully');
  } else {
    console.error(`❌ Prebuild failed with exit code ${code}`);
  }
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Failed to run prebuild script:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});