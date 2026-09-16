import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  BLOG_POSTS,
} from '../../../lib/blogData';
import {
  getArticleSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from '../../../lib/jsonld';
import { NeoPopBadge, NeoPopButton } from '../../../components/NeoPopComponents';
import {
  ArrowLeft,
  Clock,
  Tag,
  HelpCircle,
  Link as LinkIcon,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found | FlowUPI',
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: canonicalUrl,
      siteName: 'FlowUPI',
      locale: 'en_IN',
      type: 'article',
      publishedTime: post.publishedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = getArticleSchema({
    title: post.title,
    metaDescription: post.metaDescription,
    slug: post.slug,
    publishedDate: post.publishedDate,
  });

  const faqSchema = getFaqSchema(post.faqs);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const relatedPosts = post.relatedSlugs
    .map((s) => getBlogPostBySlug(s))
    .filter(Boolean);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs font-bold text-txt-muted overflow-x-auto py-1"
      >
        <Link href="/" className="hover:text-brand-primary transition-colors flex-shrink-0">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-txt-muted/60" />
        <Link href="/blog" className="hover:text-brand-primary transition-colors flex-shrink-0">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-txt-muted/60" />
        <span className="text-txt-primary truncate max-w-[200px] sm:max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Article Header Header */}
      <header className="border-b border-border-subtle pb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <NeoPopBadge label={post.category.toUpperCase()} variant="primary" />
          <span className="text-xs font-bold text-txt-muted flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime}
          </span>
          <span className="text-xs font-bold text-txt-muted">
            • Published: {post.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-txt-primary tracking-tight leading-tight">
          {post.h1}
        </h1>

        <p className="text-sm font-semibold text-txt-secondary leading-relaxed border-l-2 border-brand-primary pl-4 py-1 bg-bg-elevated/40">
          {post.summary}
        </p>
      </header>

      {/* Article Content Sections */}
      <main className="space-y-8 text-xs sm:text-sm leading-relaxed text-txt-primary">
        {post.sections.map((sec, idx) => (
          <section key={idx} className="space-y-4">
            {sec.level === 'h2' ? (
              <h2 className="text-xl sm:text-2xl font-black text-txt-primary tracking-tight pt-2 border-b border-border-subtle/50 pb-2">
                {sec.heading}
              </h2>
            ) : (
              <h3 className="text-base sm:text-lg font-black text-txt-primary tracking-tight pt-1">
                {sec.heading}
              </h3>
            )}

            <div className="prose prose-invert max-w-none text-txt-secondary space-y-3 font-medium">
              {sec.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Render Table if present */}
            {sec.table && (
              <div className="overflow-x-auto border-[1.5px] border-border-subtle shadow-neo my-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bg-elevated border-b border-border-subtle text-txt-primary font-black uppercase tracking-wider">
                    <tr>
                      {sec.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 border-r border-border-subtle/50 last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/40 bg-bg-surface text-txt-secondary font-bold">
                    {sec.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-bg-elevated/50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 border-r border-border-subtle/50 last:border-r-0 whitespace-normal">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Render Callout if present */}
            {sec.callout && (
              <div className="border-[1.5px] border-brand-primary bg-bg-surface p-5 shadow-neo-brand space-y-3 my-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-cyan" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                    {sec.callout.title}
                  </h4>
                </div>
                <p className="text-xs text-txt-secondary leading-relaxed font-semibold">
                  {sec.callout.text}
                </p>
                {sec.callout.linkUrl && (
                  <Link href={sec.callout.linkUrl}>
                    <NeoPopButton variant="primary" fullWidth={false} className="mt-1">
                      <span>{sec.callout.linkText || 'Open Tool'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </NeoPopButton>
                  </Link>
                )}
              </div>
            )}
          </section>
        ))}

        {/* FAQs Section */}
        {post.faqs.length > 0 && (
          <section className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-5 mt-10">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <HelpCircle className="h-5 w-5 text-brand-cyan" />
              <h2 className="text-lg font-black text-txt-primary uppercase tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {post.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="border border-border-subtle bg-bg-elevated p-4 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-txt-primary flex items-start gap-2">
                    <span className="text-brand-cyan font-mono font-bold">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs text-txt-secondary leading-relaxed pl-5 font-semibold">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contextual Internal Links */}
        {post.internalLinks.length > 0 && (
          <section className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <LinkIcon className="h-4 w-4 text-brand-primary" />
              <h2 className="text-xs font-black uppercase tracking-wider text-txt-primary">
                Related FlowUPI Tools & Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.internalLinks.map((link, lIdx) => (
                <Link
                  key={lIdx}
                  href={link.url}
                  className="border border-border-subtle bg-bg-elevated p-3.5 hover:border-brand-primary transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-txt-primary group-hover:text-brand-primary transition-colors">
                      {link.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-txt-muted group-hover:text-brand-primary transition-colors" />
                  </div>
                  <p className="text-[11px] text-txt-muted mt-1 font-semibold">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles Navigation */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-txt-secondary">
              Related Knowledge Base Articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                rel && (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="border-[1.5px] border-border-subtle bg-bg-surface p-4 shadow-neo hover:border-brand-primary transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <span className="text-[10px] font-black uppercase text-brand-primary">
                      {rel.category}
                    </span>
                    <h3 className="text-xs font-black text-txt-primary group-hover:text-brand-primary transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <span className="text-[10px] font-bold text-txt-muted flex items-center gap-1 pt-1">
                      <span>Read Guide</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                )
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
          <Link href="/blog">
            <NeoPopButton variant="surface" fullWidth={false}>
              <ArrowLeft className="h-4 w-4" />
              <span>← BACK TO ALL GUIDES</span>
            </NeoPopButton>
          </Link>
          <Link href="/">
            <NeoPopButton variant="primary" fullWidth={false}>
              <span>GO TO WORKSTATION</span>
            </NeoPopButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
