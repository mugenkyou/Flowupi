import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { NeoPopBadge, NeoPopButton } from '../../components/NeoPopComponents';
import { HelpCircle, QrCode, Lock, Zap, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { getFaqSchema } from '../../lib/jsonld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowupi.vercel.app';

export const metadata: Metadata = {
  title: 'FlowUPI — Help & Frequently Asked Questions',
  description: 'Find answers to common questions regarding FlowUPI QR scanning, sub-₹2,000 micro-tranching, UPI launching, local browser storage, and PWA installation.',
  alternates: {
    canonical: `${SITE_URL}/help`,
  },
  openGraph: {
    title: 'FlowUPI — Help & Frequently Asked Questions',
    description: 'Find answers to common questions regarding FlowUPI QR scanning, sub-₹2,000 micro-tranching, UPI launching, local browser storage, and PWA installation.',
    url: `${SITE_URL}/help`,
    siteName: 'FlowUPI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FlowUPI — Help & Frequently Asked Questions',
    description: 'Find answers to common questions regarding FlowUPI QR scanning, sub-₹2,000 micro-tranching, UPI launching, local browser storage, and PWA installation.',
  },
};

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'Camera & QR Scanning',
      icon: QrCode,
      questions: [
        {
          q: 'How do I scan a UPI QR code?',
          a: 'Click "Scan / Pay" on the navigation bar or home page workstation, grant camera permission when prompted, and point your camera at any merchant QR code (GPay, PhonePe, Paytm, BharatQR). You can also upload a QR screenshot image or paste a raw upi://pay link.',
        },
        {
          q: 'What if camera permission is denied?',
          a: 'If camera permission is denied by your browser, FlowUPI provides first-class fallbacks: you can upload a saved QR screenshot from your gallery or paste the UPI intent URI link directly.',
        },
        {
          q: 'Why isn\'t my QR code recognized?',
          a: 'Ensure the QR image contains standard NPCI-compliant UPI parameters (pa for VPA, pn for merchant name). Highly blurry or custom proprietary closed QR codes may not be readable.',
        },
      ],
    },
    {
      title: 'Payment Amounts & Micro-Tranching',
      icon: Zap,
      questions: [
        {
          q: 'Why is my payment split into sub-₹2,000 tranches?',
          a: 'NPCI rules specify 0% MDR (Merchant Discount Rate) interchange fee for merchant transactions up to ₹2,000. FlowUPI algorithmically slices larger amounts into sub-₹2,000 tranches to demonstrate 0% MDR compliance.',
        },
        {
          q: 'Why is the next tranche locked?',
          a: 'Tranches follow a strict sequential state machine. Tranche #2 unlocks only after Tranche #1 is settled and marked as paid. This prevents accidental duplicate or out-of-order payments.',
        },
        {
          q: 'What does "Mark as Paid" mean?',
          a: '"Mark as Paid" is a user-controlled local state confirmation. Because FlowUPI is a client-side utility and does not sit between your bank account and NPCI, you click "Mark as Paid" after completing each payment in your UPI app.',
        },
      ],
    },
    {
      title: 'UPI Deep Links & Banking',
      icon: ShieldCheck,
      questions: [
        {
          q: 'What happens when I tap "Pay via UPI App"?',
          a: 'FlowUPI launches your mobile operating system\'s native deep link handler for upi://pay, allowing you to choose GPay, PhonePe, Paytm, BHIM, or your preferred UPI banking app.',
        },
        {
          q: 'Does FlowUPI automatically know if I completed payment in bank app?',
          a: 'No. External UPI banking apps do not return payment status back to web applications. You return to FlowUPI and tap "Mark as Paid" to progress to the next tranche.',
        },
      ],
    },
    {
      title: 'Local Storage & Data Backups',
      icon: Lock,
      questions: [
        {
          q: 'Where is my payment history stored?',
          a: 'Your transaction history and group split data are stored strictly inside your browser\'s local storage (localStorage). No data is sent to external servers.',
        },
        {
          q: 'What happens if I clear browser cache/cookies?',
          a: 'Clearing browser site data will reset your local storage. To preserve your records, visit the History page to export a flowupi-backup.json file anytime.',
        },
      ],
    },
    {
      title: 'PWA & Installation',
      icon: Smartphone,
      questions: [
        {
          q: 'How do I install FlowUPI on Android?',
          a: 'In Chrome or your Android browser, tap the browser menu (⋮) and select "Install app" or "Add to Home screen". Alternatively, tap "INSTALL FLOWUPI" in the navigation drawer.',
        },
        {
          q: 'How do I install FlowUPI on iOS (iPhone/iPad)?',
          a: 'In Safari, tap the Share button (square with arrow pointing up) and select "Add to Home Screen".',
        },
        {
          q: 'Does FlowUPI work offline?',
          a: 'Yes. FlowUPI includes a Progressive Web App (PWA) service worker shell. Core tools, calculators, group splitters, and locally saved history work completely offline.',
        },
      ],
    },
  ];

  const allFaqs = faqCategories.flatMap((cat) =>
    cat.questions.map((q) => ({ question: q.q, answer: q.a }))
  );
  const faqSchema = getFaqSchema(allFaqs);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page Header */}
      <div className="border-[1.5px] border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-neo space-y-3">
        <div className="flex items-center gap-2 text-brand-cyan font-black">
          <HelpCircle className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wider">SUPPORT & FAQ</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-txt-primary tracking-tight">
          Help & Frequently Asked Questions
        </h1>

        <p className="text-xs sm:text-sm font-bold text-txt-secondary leading-relaxed">
          Everything you need to know about using FlowUPI scanner, tranche checkout, local storage, backups, and PWA setup.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {faqCategories.map((cat, idx) => {
          const CategoryIcon = cat.icon;
          return (
            <div key={idx} className="border-[1.5px] border-border-subtle bg-bg-surface p-6 shadow-neo space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <div className="flex h-8 w-8 items-center justify-center border border-brand-cyan bg-brand-cyan/15 text-brand-cyan shadow-neo-sm">
                  <CategoryIcon className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-wider text-txt-primary">
                  {cat.title}
                </h2>
              </div>

              <div className="space-y-4">
                {cat.questions.map((item, qIdx) => (
                  <div key={qIdx} className="border border-border-subtle bg-bg-elevated p-4 space-y-2">
                    <h3 className="text-xs font-black text-txt-primary uppercase tracking-wide">
                      Q: {item.q}
                    </h3>
                    <p className="text-xs text-txt-secondary leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Callout */}
      <div className="border-[1.5px] border-border-subtle bg-bg-elevated p-6 shadow-neo-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black uppercase text-txt-primary">Still have questions or found a bug?</h3>
          <p className="text-xs font-bold text-txt-muted mt-0.5">Reach out via our official GitHub repository issue tracker.</p>
        </div>
        <Link href="/contact">
          <NeoPopButton variant="secondary" fullWidth={false}>
            <span>CONTACT MAINTAINERS</span>
            <ArrowRight className="h-4 w-4" />
          </NeoPopButton>
        </Link>
      </div>
    </div>
  );
}
