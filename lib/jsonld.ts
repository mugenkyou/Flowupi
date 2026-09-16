/**
 * FlowUPI Structured Data (JSON-LD) Helper Utilities
 * Generates schema.org compliant JSON-LD objects matching actual visible content.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FlowUPI',
    url: SITE_URL,
    description: 'Fast, local-first UPI payment utility for QR scanning, payment splitting into tranches, MDR calculations, and local history.',
    inLanguage: 'en-IN',
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FlowUPI',
    operatingSystem: 'Any (Web Browser, PWA, Android, iOS, Windows, macOS)',
    applicationCategory: 'FinanceApplication',
    url: SITE_URL,
    description: 'Local-first web application for QR code scanning, sub-₹2,000 micro-tranche bill splitting, group bill splitting, MDR calculations, and soundbox audio alerts.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  metaDescription: string;
  slug: string;
  publishedDate: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FlowUPI',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
      },
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
