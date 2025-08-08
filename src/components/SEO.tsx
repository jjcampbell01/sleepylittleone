import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: string;
  keywords?: string;
}

export const SEO = ({
  title = "Sleepy Little One | Gentle Baby Sleep Course",
  description = "Help your baby sleep 10–12 hours with the gentle, science-backed Sleepy Little One method. No tears, no stress—just better nights for the whole family.",
  image = "https://www.sleepylittleone.com/images/og-sleep.jpg",
  canonical,
  type = "website",
  keywords
}: SEOProps) => {
  const fullTitle = title.includes("Sleepy Little One") ? title : `${title} | Sleepy Little One`;

  // Automatically create canonical if not passed
  const canonicalUrl =
    canonical || `https://www.sleepylittleone.com${typeof window !== "undefined" ? window.location.pathname : ""}`;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index,follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};
