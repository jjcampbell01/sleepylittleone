#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'

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
    
    // Dynamic import to handle ES modules properly
    const { default: App } = await import('../src/App.tsx')
    
    const helmetContext = {}
    
    const html = renderToString(
      React.createElement(HelmetProvider, { context: helmetContext },
        React.createElement(StaticRouter, { location: route.path },
          React.createElement(App)
        )
      )
    )
    
    const { helmet } = helmetContext
    
    return {
      html,
      head: helmet ? {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString()
      } : null
    }
  } catch (error) {
    console.error(`❌ Failed to render ${route.path}:`, error)
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
      
      // Add static SEO content for better crawling
      const staticSEO = `
        <!-- Static SEO content for crawlers -->
        <div id="static-seo-content" style="position: absolute; top: -9999px; left: -9999px;">
          <h1>Sleepy Little One - Baby Sleep Without Tears</h1>
          <h2>Finally a baby sleep solution that works. No cry-it-out.</h2>
          <h3>Gentle, science-backed sleep methods</h3>
          <p>Learn the Sleepy Little One method that transforms nights in just a few days. Our gentle approach helps babies sleep 10-12 hours without crying or stress.</p>
          <img src="/images/hero-baby-sleep.jpg" alt="Peaceful sleeping baby using Sleepy Little One methods" />
          <a href="/sleep-quiz">Take our free sleep assessment</a>
          <a href="/platform">Start your sleep journey</a>
        </div>
      `
      
      html = html.replace('</body>', `${staticSEO}</body>`)
      
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