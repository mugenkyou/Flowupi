import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BLOG_POSTS } from '../../lib/blogData';
import { getBreadcrumbSchema } from '../../lib/jsonld';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';
import { BookOpen, ArrowRight, Clock, Tag, Sparkles } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'UPI Payment & Bill Splitting Knowledge Base | FlowUPI Blog',
  description:
    'Learn how UPI QR codes work, split restaurant & group bills among friends, calculate merchant MDR fees, and utilize local-first payment tools.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'UPI Payment & Bill Splitting Knowledge Base | FlowUPI Blog',
    description:
      'Learn how UPI QR codes work, split restaurant & group bills among friends, calculate merchant MDR fees, and utilize local-first payment tools.',
    url: `${SITE_URL}/blog`,
    siteName: 'FlowUPI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPI Payment & Bill Splitting Knowledge Base | FlowUPI Blog',
    description:
      'Learn how UPI QR codes work, split restaurant & group bills among friends, calculate merchant MDR fees, and utilize local-first payment tools.',
  },
};

export default function BlogIndexPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header Banner */}
      <div className="border-b border-border-subtle pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <NeoPopBadge label="UPI KNOWLEDGE BASE" variant="primary" />
          <NeoPopBadge label="6 GUIDES AVAILABLE" variant="surface" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-txt-primary tracking-tight">
          UPI Payment, Bill Splitting & Merchant Guides
        </h1>
        <p className="text-xs sm:text-sm font-bold text-txt-secondary max-w-2xl leading-relaxed">
          Search-focused, practical guides explaining UPI QR codes, equal & itemized group bill splitting, MDR fee economics, and privacy-first payment utilities in India.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo flex flex-col justify-between space-y-5 hover:border-brand-primary/60 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-1 border border-brand-primary/20">
                  <Tag className="h-3 w-3" /> {post.category}
                </span>
                <span className="text-[11px] font-bold text-txt-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readingTime}
                </span>
              </div>

              <h2 className="text-lg font-black text-txt-primary leading-snug tracking-tight hover:text-brand-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-xs text-txt-secondary leading-relaxed line-clamp-3 font-medium">
                {post.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-txt-muted">
                {new Date(post.publishedDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-primary hover:underline"
              >
                <span>READ GUIDE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="border-[1.5px] border-brand-primary bg-bg-elevated p-6 shadow-neo-brand space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-cyan" />
          <h3 className="text-base font-black text-txt-primary uppercase tracking-tight">
            Ready to Try FlowUPI Payment Tools?
          </h3>
        </div>
        <p className="text-xs text-txt-secondary leading-relaxed max-w-2xl font-medium">
          FlowUPI offers zero-install web tools for live QR scanning, screenshot decoding, group bill splitting, MDR calculations, and soundbox audio confirmation.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link href="/">
            <NeoPopButton variant="primary" fullWidth={false}>
              <span>OPEN SCANNER WORKSTATION</span>
              <ArrowRight className="h-4 w-4" />
            </NeoPopButton>
          </Link>
          <Link href="/group">
            <NeoPopButton variant="surface" fullWidth={false}>
              <span>TRY GROUP SPLITTER</span>
            </NeoPopButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
