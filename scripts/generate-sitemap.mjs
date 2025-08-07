#!/usr/bin/env node

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = dirname(__dirname)

// Base URL for the sitemap
const baseUrl = 'https://www.sleepylittleone.com'

// Important static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/faq', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/sleep-quiz', priority: '0.9', changefreq: 'monthly' },
  { url: '/platform', priority: '0.7', changefreq: 'monthly' },
  { url: '/about', priority: '0.6', changefreq: 'yearly' },
  { url: '/contact', priority: '0.6', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { url: '/terms', priority: '0.4', changefreq: 'yearly' }
]

// Supabase client (public, read-only)
const SUPABASE_URL = 'https://oscrvqfpsrmpnqzndtyl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3J2cWZwc3JtcG5xem5kdHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQ5ODQsImV4cCI6MjA2ODg4MDk4NH0.4JK4zOg-PtVZbpGVGS8Ky36xWeUMYDL6ke_ezfrbwMk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchPublishedBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, publish_date, updated_at, published')
      .eq('published', true)
      .order('publish_date', { ascending: false })

    if (error) throw error

    return (data || []).map(post => ({
      slug: post.slug,
      lastmod: (post.updated_at || post.publish_date || new Date().toISOString()).slice(0, 10)
    }))
  } catch (err) {
    console.warn('⚠️  Supabase fetch failed for sitemap, falling back to static JSON:', err.message)
    // Fallback to static JSON if available
    const fallbackPath = join(root, 'public', 'static', 'blog-posts.json')
    if (existsSync(fallbackPath)) {
      try {
        const json = JSON.parse(readFileSync(fallbackPath, 'utf-8'))
        return (json || []).filter(p => p.published).map(p => ({
          slug: p.slug,
          lastmod: (p.updated_at || p.publish_date || new Date().toISOString()).slice(0, 10)
        }))
      } catch {}
    }
    return []
  }
}

async function generateSitemap() {
  const blogPosts = await fetchPublishedBlogPosts()

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // Static pages
  staticPages.forEach(page => {
    sitemap += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <priority>${page.priority}</priority>\n    <changefreq>${page.changefreq}</changefreq>\n  </url>\n`
  })

  // Blog posts
  blogPosts.forEach(post => {
    sitemap += `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${post.lastmod}</lastmod>\n    <priority>0.7</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`
  })

  sitemap += `</urlset>`

  const sitemapPath = join(root, 'public', 'sitemap.xml')
  writeFileSync(sitemapPath, sitemap)

  console.log(`✅ Generated sitemap with ${staticPages.length + blogPosts.length} URLs`)
  console.log(`📍 Sitemap saved to: ${sitemapPath}`)
}

generateSitemap()