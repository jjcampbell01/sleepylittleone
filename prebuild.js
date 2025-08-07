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

// Verify the script exists before trying to run it
if (!existsSync(scriptPath)) {
  console.error('❌ Prebuild script not found at:', scriptPath);
  process.exit(1);
}

console.log('🔄 Running prebuild script...');

const child = spawn('node', [scriptPath], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Failed to run prebuild script:', error);
  process.exit(1);
});