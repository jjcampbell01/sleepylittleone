#!/usr/bin/env node

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = dirname(__dirname)

// Base URLs for the sitemap
const baseUrl = 'https://www.sleepylittleone.com'

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/faq', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/sleep-quiz', priority: '0.9', changefreq: 'monthly' },
  { url: '/platform', priority: '0.7', changefreq: 'monthly' },
  { url: '/thank-you', priority: '0.3', changefreq: 'yearly' }
]

// Blog posts data (should be loaded from your data source)
const blogPosts = [
  { slug: 'sleep-regression-guide', lastmod: '2024-12-07' },
  { slug: 'newborn-sleep-patterns', lastmod: '2024-12-06' },
  { slug: 'sleep-training-methods', lastmod: '2024-12-05' },
  { slug: 'bedtime-routine-tips', lastmod: '2024-12-04' },
  { slug: 'co-sleeping-safety', lastmod: '2024-12-03' },
  { slug: 'baby-sleep-environment', lastmod: '2024-12-02' },
  { slug: 'nap-schedule-guide', lastmod: '2024-12-01' },
  { slug: 'night-weaning-guide', lastmod: '2024-11-30' },
  { slug: 'toddler-sleep-tips', lastmod: '2024-11-29' },
  { slug: 'sleep-props-elimination', lastmod: '2024-11-28' },
  { slug: 'early-rising-solutions', lastmod: '2024-11-27' },
  { slug: 'travel-sleep-strategies', lastmod: '2024-11-26' },
  { slug: 'daycare-sleep-transition', lastmod: '2024-11-25' },
  { slug: 'gentle-sleep-methods', lastmod: '2024-11-24' },
  { slug: 'baby-sleep-myths', lastmod: '2024-11-23' },
  { slug: 'sleep-deprivation-parents', lastmod: '2024-11-22' },
  { slug: 'cry-it-out-alternatives', lastmod: '2024-11-21' },
  { slug: 'sleep-training-age', lastmod: '2024-11-20' },
  { slug: 'pacifier-sleep-training', lastmod: '2024-11-19' },
  { slug: 'room-sharing-tips', lastmod: '2024-11-18' },
  { slug: 'white-noise-benefits', lastmod: '2024-11-17' },
  { slug: 'sleep-tracking-apps', lastmod: '2024-11-16' },
  { slug: 'multiple-babies-sleep', lastmod: '2024-11-15' },
  { slug: 'growth-spurts-sleep', lastmod: '2024-11-14' },
  { slug: 'sleep-safety-guidelines', lastmod: '2024-11-13' },
  { slug: 'feeding-sleep-connection', lastmod: '2024-11-12' },
  { slug: 'seasonal-sleep-changes', lastmod: '2024-11-11' },
  { slug: 'sleep-routine-consistency', lastmod: '2024-11-10' },
  { slug: 'baby-sleep-positions', lastmod: '2024-11-09' }
]

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>
`
  })

  // Add blog posts
  blogPosts.forEach(post => {
    sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
`
  })

  sitemap += `</urlset>`

  // Write sitemap to public directory
  const sitemapPath = join(root, 'public', 'sitemap.xml')
  writeFileSync(sitemapPath, sitemap)
  
  console.log(`✅ Generated sitemap with ${staticPages.length + blogPosts.length} URLs`)
  console.log(`📍 Sitemap saved to: ${sitemapPath}`)
}

generateSitemap()