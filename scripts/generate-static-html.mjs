#!/usr/bin/env node

// Generate static HTML for better SEO crawling
import { createServer } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..')

async function generateStaticHTML() {
  console.log('🏗️  Generating static HTML for SEO...')
  
  try {
    // Read the built index.html
    const indexPath = join(root, 'dist', 'index.html')
    
    if (!existsSync(indexPath)) {
      console.log('⚠️  Built index.html not found, skipping static HTML generation')
      return
    }
    
    let html = readFileSync(indexPath, 'utf-8')
    
    // Inject static content for better SEO crawling
    const staticContent = `
      <!-- SEO-friendly static content -->
      <div id="static-content" style="display: none;">
        <h1>Sleepy Little One - Baby Sleep Without Tears</h1>
        <h2>Finally a baby sleep solution that works. No cry-it-out.</h2>
        <p>Learn the Sleepy Little One method that transforms nights in just a few days.</p>
        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Gentle, science-backed approach</strong> - No crying or stress</li>
          <li><strong>Quick results</strong> - See improvements in just a few days</li>
          <li><strong>Expert guidance</strong> - From certified sleep specialists</li>
          <li><strong>Family-friendly</strong> - Works for parents and babies</li>
        </ul>
        <h3>What You'll Learn</h3>
        <p>Our comprehensive course covers everything you need to know about baby sleep, from understanding sleep cycles to creating the perfect bedtime routine.</p>
        <h3>Frequently Asked Questions</h3>
        <h4>How quickly will I see results?</h4>
        <p>Most families see significant improvements within 3-7 days of implementing our methods.</p>
        <h4>Is this method safe for my baby?</h4>
        <p>Yes, our approach is completely gentle and based on scientific research about infant sleep development.</p>
      </div>
    `
    
    // Insert static content before the closing body tag
    html = html.replace('</body>', `${staticContent}</body>`)
    
    // Add meta tags directly to HTML for crawlers
    const metaTags = `
      <meta name="description" content="Finally a baby sleep solution that works. No cry-it-out. Learn the Sleepy Little One method that transforms nights in just a few days.">
      <meta name="keywords" content="baby sleep, sleep training, no cry method, infant sleep, baby sleep course">
      <meta property="og:title" content="Sleepy Little One | Baby Sleep Without Tears">
      <meta property="og:description" content="Finally a baby sleep solution that works. No cry-it-out. Learn the Sleepy Little One method that transforms nights in just a few days.">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://www.sleepylittleone.com">
      <link rel="canonical" href="https://www.sleepylittleone.com">
    `
    
    html = html.replace('</head>', `${metaTags}</head>`)
    
    // Write the enhanced HTML back
    writeFileSync(indexPath, html)
    
    console.log('✅ Static HTML enhanced for SEO crawlers')
    
  } catch (error) {
    console.error('❌ Failed to generate static HTML:', error)
    // Don't fail the build, just warn
  }
}

generateStaticHTML()