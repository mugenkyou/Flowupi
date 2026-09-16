import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.app';

  const routes = [
    '',
    '/scan',
    '/pos',
    '/group',
    '/calculator',
    '/soundbox',
    '/history',
    '/about',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
    '/security',
    '/disclaimer',
    '/accessibility',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
