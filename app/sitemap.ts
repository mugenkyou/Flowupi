import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

  const staticRoutes = [
    '',
    '/scan',
    '/pos',
    '/group',
    '/calculator',
    '/soundbox',
    '/blog',
    '/about',
    '/help',
    '/contact',
    '/privacy',
    '/terms',
    '/security',
    '/disclaimer',
    '/accessibility',
  ];

  const blogRoutes = BLOG_POSTS.map((post) => `/blog/${post.slug}`);

  const allRoutes = [...staticRoutes, ...blogRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : route.startsWith('/blog') ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/blog' ? 0.9 : 0.8,
  }));
}
