# Netlify SSG Migration Guide

This guide helps you migrate your Lovable project to Netlify for improved SEO through Static Site Generation (SSG).

## 🚀 Quick Start

### 1. Connect to GitHub (if not already done)
1. In Lovable, click GitHub → Connect to GitHub
2. Authorize the Lovable GitHub App
3. Create repository in GitHub

### 2. Setup Netlify
1. Create Netlify account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command:** `npm run build:ssg`
   - **Publish directory:** `dist`
   - **Node version:** 18+

### 3. Environment Variables
Add these to Netlify's environment settings:
```
SUPABASE_URL=https://oscrvqfpsrmpnqzndtyl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY3J2cWZwc3JtcG5xem5kdHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDQ5ODQsImV4cCI6MjA2ODg4MDk4NH0.4JK4zOg-PtVZbpGVGS8Ky36xWeUMYDL6ke_ezfrbwMk
```

## 📁 Files Added for SSG

### Core SSG Files
- `scripts/prebuild.mjs` - Fetches blog data from Supabase and generates static files
- `netlify.toml` - Netlify configuration with build settings and redirects
- `src/hooks/useStaticData.ts` - React hooks for accessing static data with API fallback
- `src/components/StaticDataProvider.tsx` - React context for static data management

### Build Process
- `npm run prebuild` - Generates static JSON files from Supabase
- `npm run build:ssg` - Full SSG build (prebuild + vite build)

## 🔄 Auto-Rebuild Setup

### 1. Create Build Hook in Netlify
1. Go to Site Settings → Build & Deploy → Build Hooks
2. Create new hook named "Content Update"
3. Copy the webhook URL

### 2. Add Environment Variables
Add to Netlify:
```
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/[your-hook-id]
SUPABASE_WEBHOOK_SECRET=your-secret-key-here
```

### 3. Setup Supabase Webhooks
In Supabase Dashboard → Database → Webhooks:
1. Create webhook for `blog_posts` table
2. URL: `https://your-site.netlify.app/.netlify/functions/rebuild-hook`
3. Secret: Same as `SUPABASE_WEBHOOK_SECRET`
4. Events: INSERT, UPDATE, DELETE

## 🎯 SEO Benefits

### Static Generation
- ✅ Blog posts pre-rendered as static HTML
- ✅ Automatic sitemap.xml generation
- ✅ Individual JSON files for each post
- ✅ Optimized meta tags and structured data

### Performance
- ✅ CDN distribution worldwide
- ✅ Improved Core Web Vitals
- ✅ Faster initial page loads
- ✅ Better lighthouse scores

### Search Engine Optimization
- ✅ Crawlable HTML content
- ✅ Proper meta descriptions and titles
- ✅ Structured data for rich snippets
- ✅ Automatic sitemap updates

## 🔧 Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Test SSG build locally
npm run build:ssg
npm run preview
```

### Deployment
1. Push changes to GitHub
2. Netlify automatically builds and deploys
3. Content changes in Supabase trigger rebuilds

## 📊 Monitoring

### Build Logs
- Check Netlify deploy logs for any build failures
- Monitor function logs for webhook issues

### Performance
- Use Lighthouse to verify improved scores
- Monitor Core Web Vitals in Google Search Console

## 🔍 Troubleshooting

### Build Failures
- Check Supabase connection in build logs
- Verify environment variables are set
- Ensure all dependencies are in package.json

### Webhook Issues
- Check function logs in Netlify
- Verify webhook secret matches
- Test webhook URL manually

### SEO Not Improving
- Allow time for search engines to recrawl
- Submit updated sitemap to Google Search Console
- Verify meta tags are properly rendered

## 🎉 Migration Complete!

Your site now has:
- ✅ Static HTML generation for better SEO
- ✅ Automatic content updates
- ✅ Global CDN distribution
- ✅ Improved performance scores

Continue developing in Lovable while enjoying the SEO benefits of Netlify's SSG!