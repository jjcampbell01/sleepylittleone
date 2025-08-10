import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Graceful sitemap generator that works with or without env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const base = "https://www.sleepylittleone.com";
const today = new Date().toISOString().split("T")[0];

// Core static pages
const staticPages = [
  "/",
  "/blog",
  "/faq",
  "/contact",
  "/sleep-quiz",
  "/platform",
  "/about",
  "/privacy",
  "/terms",
];

function writeSitemap(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
  console.log("✅ sitemap.xml generated with", urls.length, "URLs");
}

async function fetchPostsFromSupabase() {
  // If env vars missing, skip Supabase and fall back
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "⚠️  VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set. Generating sitemap without dynamic blog URLs."
    );
    return [];
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, publish_date")
      .eq("published", true);

    if (error) {
      console.warn("⚠️  Supabase fetch failed for sitemap:", error.message);
      return [];
    }

    return posts || [];
  } catch (e) {
    console.warn("⚠️  Supabase client error: ", e?.message || e);
    return [];
  }
}

async function generateSitemap() {
  // 1) Always include key static pages
  const urls = [
    ...staticPages.map((url) => ({
      loc: `${base}${url}`,
      lastmod: today,
      changefreq: url === "/" ? "daily" : "weekly",
      priority: url === "/" ? "1.0" : "0.8",
    })),
  ];

  // 2) Try to enrich with blog posts (Supabase optional)
  const posts = await fetchPostsFromSupabase();

  urls.push(
    ...posts.map((post) => ({
      loc: `${base}/blog/${post.slug}`,
      lastmod: (post.publish_date || today).slice(0, 10),
      changefreq: "monthly",
      priority: "0.7",
    }))
  );

  writeSitemap(urls);
}

generateSitemap().catch((e) => {
  console.error("❌ Unexpected sitemap generation error:", e);
  // Do not fail the build — write a minimal sitemap instead
  try {
    const fallbackUrls = staticPages.map((url) => ({
      loc: `${base}${url}`,
      lastmod: today,
      changefreq: url === "/" ? "daily" : "weekly",
      priority: url === "/" ? "1.0" : "0.8",
    }));
    writeSitemap(fallbackUrls);
  } catch (err) {
    console.error("❌ Failed to write fallback sitemap:", err);
    process.exit(0); // Still don't block the build
  }
});
