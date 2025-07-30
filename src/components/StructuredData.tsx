import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "FAQPage";
  data: any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    return JSON.stringify(baseData);
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {getStructuredData()}
      </script>
    </Helmet>
  );
};

// Predefined structured data for common use cases
export const OrganizationStructuredData = () => (
  <StructuredData
    type="Organization"
    data={{
      name: "Sleepy Little One",
      url: "https://www.sleepylittleone.com",
      logo: "https://www.sleepylittleone.com/images/logo.png",
      description: "Gentle, science-backed baby sleep solutions without tears",
      sameAs: [
        "https://www.instagram.com/sleepylittleone",
        "https://www.facebook.com/sleepylittleone"
      ]
    }}
  />
);

export const WebSiteStructuredData = () => (
  <StructuredData
    type="WebSite"
    data={{
      name: "Sleepy Little One",
      url: "https://www.sleepylittleone.com",
      description: "Help your baby sleep 10–12 hours with the gentle, science-backed Sleepy Little One method",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.sleepylittleone.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }}
  />
);