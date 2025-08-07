#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = "https://oscrvqfpsrmpnqzndtyl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3J2cWZwc3JtcG5xem5kdHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQ5ODQsImV4cCI6MjA2ODg4MDk4NH0.4JK4zOg-PtVZbpGVGS8Ky36xWeUMYDL6ke_ezfrbwMk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateStaticData() {
  console.log('🚀 Starting static data generation...');
  
  try {
    // Ensure public/static directory exists
    const staticDir = join(__dirname, '../public/static');
    mkdirSync(staticDir, { recursive: true });

    // Fetch all published blog posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('publish_date', { ascending: false });

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    // Write static data files
    writeFileSync(
      join(staticDir, 'blog-posts.json'),
      JSON.stringify(posts, null, 2)
    );

    writeFileSync(
      join(staticDir, 'blog-categories.json'),
      JSON.stringify(categories, null, 2)
    );

    // Generate individual post files for better SEO
    const postsDir = join(staticDir, 'posts');
    mkdirSync(postsDir, { recursive: true });

    for (const post of posts) {
      writeFileSync(
        join(postsDir, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    }

    // Generate sitemap data
    const baseUrl = 'https://www.sleepylittleone.com';
    const sitemapUrls = [
      { url: baseUrl, changefreq: 'daily', priority: '1.0' },
      { url: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.9' },
      { url: `${baseUrl}/faq`, changefreq: 'weekly', priority: '0.8' },
      { url: `${baseUrl}/sleep-quiz`, changefreq: 'weekly', priority: '0.8' },
      { url: `${baseUrl}/platform`, changefreq: 'monthly', priority: '0.7' },
      ...posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: post.updated_at || post.publish_date
      }))
    ];

    writeFileSync(
      join(staticDir, 'sitemap-data.json'),
      JSON.stringify(sitemapUrls, null, 2)
    );

    console.log(`✅ Generated static data for ${posts.length} posts and ${categories.length} categories`);
    console.log(`📁 Files created in: ${staticDir}`);
    
  } catch (error) {
    console.error('❌ Error generating static data:', error);
    process.exit(1);
  }
}

async function generateSitemap() {
  console.log('🗺️  Generating XML sitemap...');
  
  try {
    const staticDir = join(__dirname, '../public');
    const sitemapDataPath = join(__dirname, '../public/static/sitemap-data.json');
    
    // Read sitemap data
    const sitemapData = JSON.parse(readFileSync(sitemapDataPath, 'utf8'));
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(item => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    ${item.lastmod ? `<lastmod>${new Date(item.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    writeFileSync(join(staticDir, 'sitemap.xml'), xmlContent);
    console.log('✅ Sitemap generated successfully');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  await generateStaticData();
  await generateSitemap();
  console.log('🎉 Prebuild completed successfully!');
}

main().catch(console.error);