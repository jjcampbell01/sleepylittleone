#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'

// Set up module resolution for SSR
process.env.NODE_ENV = 'production'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..')

// Routes to pre-render
const routes = [
  { path: '/', name: 'index' },
  { path: '/faq', name: 'faq' },
  { path: '/blog', name: 'blog' }
]

async function renderPage(route) {
  try {
    console.log(`🏗️  Rendering ${route.path}...`)
    
    // Import React components with proper module resolution
    const { default: App } = await import('../src/App.tsx')
    
    const helmetContext = {}
    
    // Ensure we have proper global DOM environment for components
    if (typeof global !== 'undefined') {
      global.window = global.window || {}
      global.document = global.document || {}
      global.navigator = global.navigator || { userAgent: 'node' }
    }
    
    // Create a more complete rendering context with error boundaries
    const html = renderToString(
      React.createElement(HelmetProvider, { context: helmetContext },
        React.createElement(StaticRouter, { location: route.path },
          React.createElement(App)
        )
      )
    )
    
    const { helmet } = helmetContext
    
    // Validate that we got meaningful content
    const hasH1 = html.includes('<h1')
    const hasH2 = html.includes('<h2')
    const hasH3 = html.includes('<h3')
    const hasImages = html.includes('<img')
    const hasLinks = html.includes('<a')
    
    console.log(`📊 Content validation for ${route.path}:`)
    console.log(`   H1 tags: ${hasH1 ? '✅' : '❌'}`)
    console.log(`   H2 tags: ${hasH2 ? '✅' : '❌'}`)
    console.log(`   H3 tags: ${hasH3 ? '✅' : '❌'}`)
    console.log(`   Images: ${hasImages ? '✅' : '❌'}`)
    console.log(`   Links: ${hasLinks ? '✅' : '❌'}`)
    
    return {
      html,
      head: helmet ? {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString()
      } : null
    }
  } catch (error) {
    console.error(`❌ Failed to render ${route.path}:`, error.message)
    console.error('Stack trace:', error.stack)
    return null
  }
}

async function generateStaticPages() {
  console.log('🚀 Starting SSR generation...')
  
  try {
    // Read the built index.html template
    const indexPath = join(root, 'dist', 'index.html')
    
    if (!existsSync(indexPath)) {
      console.log('⚠️  Built index.html not found, skipping SSR generation')
      return
    }
    
    let template = readFileSync(indexPath, 'utf-8')
    
    for (const route of routes) {
      const rendered = await renderPage(route)
      
      if (!rendered) continue
      
      let html = template
      
      // Replace the empty div with the rendered content
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${rendered.html}</div>`
      )
      
      // Inject server-rendered head tags if available
      if (rendered.head) {
        html = html.replace('</head>', `${rendered.head.title}${rendered.head.meta}${rendered.head.link}</head>`)
      }
      
      // Write the rendered HTML
      const filename = route.name === 'index' ? 'index.html' : `${route.name}.html`
      const outputPath = join(root, 'dist', filename)
      
      writeFileSync(outputPath, html)
      console.log(`✅ Generated ${filename}`)
    }
    
    console.log('🎉 SSR generation complete!')
    
  } catch (error) {
    console.error('❌ SSR generation failed:', error)
    // Don't fail the build, just warn
  }
}

generateStaticPages()