const SITE = "https://uplocal.app";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: "HiddenLab",
    url: "https://hiddenlab.fr",
    logo: `${SITE}/icon-512.png`,
    email: "contact@metalya.fr",
    sameAs: ["https://hiddenlab.fr"],
    brand: {
      "@type": "Brand",
      name: "Uplocal",
      url: SITE,
      logo: `${SITE}/icon-512.png`,
    },
  };
}

export function generateWebAppSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "WebApplication",
    name: "Uplocal",
    url: SITE,
    description:
      "AI image upscaler that runs 100% in your browser. No upload, total privacy.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires WebGL support",
    softwareVersion: "1.0",
    author: {
      "@type": "Organization",
      name: "HiddenLab",
      url: "https://hiddenlab.fr",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "9",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Studio",
        price: "24",
        priceCurrency: "USD",
        billingIncrement: "P1M",
        availability: "https://schema.org/InStock",
      },
    ],
    featureList: [
      "AI image upscaling up to 8x",
      "100% browser based processing",
      "No file upload required",
      "Supports PNG, JPEG, WebP, BMP",
      "Batch processing",
      "Custom output dimensions",
      "Available in 10 languages",
    ],
    screenshot: `${SITE}/og/og-en.png`,
    inLanguage: [
      "en", "fr", "de", "es", "pt", "ja", "ko", "zh", "ar", "hi",
    ],
  };
}

export function generateFAQSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org/",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateProductSchema(plans: {
  free: { name: string; price: string };
  pro: { name: string; priceMonthly: string; priceYearly: string };
  studio: { name: string; priceMonthly: string; priceYearly: string };
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Uplocal",
    description: "AI image upscaler that runs 100% in your browser. Private, fast, no upload.",
    brand: { "@type": "Brand", name: "Uplocal" },
    image: `${SITE}/og/og-en.png`,
    offers: [
      {
        "@type": "Offer",
        name: plans.free.name,
        price: plans.free.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: plans.pro.name,
        price: plans.pro.priceMonthly,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plans.pro.priceMonthly,
          priceCurrency: "USD",
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1 },
        },
      },
      {
        "@type": "Offer",
        name: plans.studio.name,
        price: plans.studio.priceMonthly,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plans.studio.priceMonthly,
          priceCurrency: "USD",
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1 },
        },
      },
    ],
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  url: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: "HiddenLab", url: "https://hiddenlab.fr" },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: article.url,
    publisher: { "@type": "Organization", name: "Uplocal", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
    ...(article.imageUrl && { image: { "@type": "ImageObject", url: article.imageUrl } }),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
