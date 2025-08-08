const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
  const base = "https://www.sleepylittleone.com";
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    "/",
    "/blog",
    "/faq",
    "/contact",
    "/sleep-quiz",
    "/privacidade",
    "/termos"
  ];

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("slug, publish_date")
    .eq("published", true);

  if (error) {
    console.error("Error fetching posts for sitemap:", error);
    process.exit(1);
  }

  const urls = [
    ...staticPages.map((url) => ({
      loc: `${base}${url}`,
      lastmod: today,
      changefreq: "weekly",
      priority: url === "/" ? "1.0" : "0.8",
    })),
    ...(posts || []).map((post) => ({
      loc: `${base}/blog/${post.slug}`,
      lastmod: post.publish_date || today,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
  console.log("✅ Sitemap generated with", urls.length, "URLs");
}

generateSitemap();
