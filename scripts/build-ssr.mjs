#!/usr/bin/env node

import { spawn } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..')

function runCommand(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`)
    
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, ...env }
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', reject)
  })
}

async function buildWithSSR() {
  try {
    console.log('🚀 Starting SSR build process...')
    
    // Step 1: Build the client app
    console.log('📦 Building client application...')
    await runCommand('npx', ['vite', 'build'], {
      NODE_ENV: 'production'
    })
    
    // Step 2: Build server bundle for SSR (optional, we're doing direct imports)
    console.log('🏗️  Preparing SSR environment...')
    // No need for separate SSR build, we're importing directly
    
    // Step 3: Generate sitemap
    console.log('🗺️  Generating sitemap...')
    await runCommand('node', ['scripts/generate-sitemap.mjs'])
    
    // Step 4: Generate static HTML
    console.log('📄 Generating static HTML pages...')
    await runCommand('node', ['scripts/ssr-render.mjs'])
    
    console.log('✅ SSR build complete!')
    
  } catch (error) {
    console.error('❌ SSR build failed:', error)
    process.exit(1)
  }
}

buildWithSSR()

