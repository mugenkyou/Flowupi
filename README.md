# ⚡ FlowUPI — Fast, Local-First UPI Payment Utility

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa)](https://flowupi.vercel.app/)

**FlowUPI** is a fast, local-first web application designed for seamless UPI payments, merchant QR code scanning, bill micro-tranching, group bill splitting, MDR fee calculations, and merchant soundbox audio confirmations.

Created by **Sachin**, FlowUPI operates as an installable **Progressive Web App (PWA)** with 100% local persistence. All calculations, QR decodes, and transaction records execute entirely client-side inside your browser—working offline without requiring a cloud backend or database.

🌐 **Live Web Application**: [https://flowupi.vercel.app/](https://flowupi.vercel.app/)

---

## ✨ Core Features & Utility Workstations

### 1. 📷 Instant QR Scan & Payment Workstation (`/scan`)
- **Live Camera Scanning**: High-speed QR scanning via device camera powered by `html5-qrcode`.
- **Multi-Strategy Screenshot Import**: Upload payment QR screenshots saved in your photo gallery. Uses a 4-tier failover decoder engine:
  1. **Native `BarcodeDetector` API**: Hardware/OS accelerated vision decoding (Chrome, Edge, Safari 17+, Android WebViews).
  2. **Direct `Html5Qrcode` Scan**: Pure JS scanning.
  3. **Canvas Resizing**: Scales down high-res (1080p/4K) phone screenshots to 800px max dimension.
  4. **Section Cropping**: Crops central QR placement regions targeting standard GPay, Paytm, and PhonePe screenshots.
- **Intent URI Parsing**: Parses raw `upi://pay` URIs to extract payee address (`pa`), merchant name (`pn`), amount (`am`), and notes (`tn`).

### 2. ⚡ 0% MDR Micro-Tranching Engine (`/pos`)
- **Algorithmic Bill Partitioning**: Automatically divides large merchant invoices into structured sub-₹2,000 tranches to remain within 0% MDR fee tiers under NPCI guidelines.
- **POS Counter Register Mode**: Fast bill calculator with pre-configured retail Kirana presets (`Atta & Oil`, `Full Ration`, `Dhaba Dinner`).
- **Sequential Checkout**: Step-by-step progress checklist with instant deep-linking to installed UPI apps.

### 3. 👥 Group Bill Splitter (`/group`)
- **Equal & Itemized Division**: Divide dining, trip, or household bills between friends.
- **QR Auto-Fill**: Scan a merchant QR code via camera or upload a QR screenshot to automatically populate Merchant Name, VPA, and total bill amount.
- **Individual Slice Cards**: Generates individual UPI QR cards for each friend.
- **1-Click WhatsApp Sharing**: Pre-formatted text cards and 1-click WhatsApp share buttons for sending individual payment links directly to group chats.

### 4. 🧮 MDR Surcharge Roast & Calculator (`/calculator`)
- **Turnover & Ticket Size Sliders**: Interactive financial model demonstrating business MDR fee recovery.
- **Policy Comparison**: Simulates fee economics across standard savings bank UPI (0% MDR), PPI digital wallets (1.1%), and RuPay credit cards on UPI (0.4%–2.0%).

### 5. 🔊 Soundbox Audio Synthesizer (`/soundbox`)
- **Web Audio Alert Simulator**: Simulates merchant audio soundbox alerts (*"Payment of ₹X received on FlowUPI"*) in multiple Indian languages (Hindi, English, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati).

### 6. 📚 SEO Knowledge Base & Blog (`/blog`)
- **6 In-Depth Search-Focused Guides**:
  1. *How to Pay Using a UPI QR Code: Complete Step-by-Step Guide*
  2. *How to Split a Restaurant or Group Bill Using UPI*
  3. *How to Split a Large UPI Payment Into Multiple Payments*
  4. *UPI MDR Explained: Merchant Charges and Calculations*
  5. *How to Split Bills With Friends Without Losing Track of Payments*
  6. *Useful UPI Tools for Managing Everyday Payments*
- **Structured Data**: Injects schema.org compliant `Article`, `FAQPage`, and `BreadcrumbList` JSON-LD tags into article markup.

### 7. 💾 Local-First History Ledger (`/history`)
- **100% Client-Side Privacy**: All transaction records and group split histories are stored in browser `localStorage`.
- **JSON Backup Export & Import**: Download an unencrypted `flowupi-backup-YYYY-MM-DD.json` file anytime or restore data on new devices.

---

## 🏗️ Architecture & Data Flow

```text
                           ┌───────────────────────────┐
                           │   FlowUPI PWA Frontend    │
                           │   (Next.js 14 App Router) │
                           └─────────────┬─────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
      │ Client Engine      │   │ Privacy Storage    │   │ Knowledge Base     │
      ├────────────────────┤   ├────────────────────┤   ├────────────────────┤
      │ • Multi-Strategy   │   │ • localStorage     │   │ • 6 SEO Guides     │
      │   QR Decoder       │   │ • JSON Backups     │   │ • JSON-LD Schemas  │
      │ • Tranche Builder  │   │ • Zero Telemetry   │   │ • FAQ Accordions   │
      │ • Soundbox Audio   │   │ • 100% Offline     │   │ • Internal Links   │
      └────────────────────┘   └────────────────────┘   └────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components, SSG static pre-rendering)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with NeoPOP 3D tactile borders and dark fintech color tokens
- **QR Engine**: `html5-qrcode` & `qrcode.react`
- **Native Vision**: Web `BarcodeDetector` API with Canvas fallback pipeline
- **UI Components**: Custom NeoPOP buttons, cards, badges, and [Lucide React](https://lucide.dev/) icons
- **Audio**: Web Audio API Soundbox synthesizer
- **Animations**: `canvas-confetti` celebration triggers

---

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mugenkyou/splitupi.git
   cd splitupi/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build

```bash
# Compile TypeScript & generate production bundle
npm run build

# Launch production server
npm run start
```

---

## 📁 Directory Structure

```text
web/
├── app/                      # Next.js 14 App Router routes
│   ├── about/                # About 0% MDR Arbitrage guide
│   ├── blog/                 # SEO Knowledge Base & [slug] reader
│   ├── calculator/           # MDR Surcharge Roast Calculator
│   ├── group/                # Group Bill Splitter with QR auto-fill
│   ├── history/              # Local storage ledger & JSON backup
│   ├── pos/                  # POS Micro-Tranche Workstation
│   ├── scan/                 # Scan / Pay workstation
│   ├── soundbox/             # Soundbox Audio Synthesizer
│   ├── layout.tsx            # Root layout with Navbar & Footer
│   ├── page.tsx              # Homepage workstation
│   ├── robots.ts             # Dynamic robots.txt metadata
│   └── sitemap.ts            # Dynamic sitemap.xml generator
├── components/               # Reusable NeoPOP UI components
│   ├── HomeScannerWorkstation.tsx
│   ├── NeoPopComponents.tsx
│   ├── QRScannerModal.tsx
│   ├── TrancheCard.tsx
│   └── ...
├── lib/                      # Core business logic & engines
│   ├── blogData.ts           # 6 SEO blog articles repository
│   ├── jsonld.ts             # Schema.org structured data helpers
│   ├── qrDecoder.ts          # Multi-strategy image QR decoder
│   ├── soundbox.ts           # Web Audio synthesizer engine
│   ├── splitEngine.ts        # Micro-tranche & group split algorithms
│   └── storage.ts            # LocalStorage persistence & migration
└── public/                   # Static assets, manifests, and icons
```

---

## ⚖️ Financial Disclaimer & Compliance

FlowUPI is designed strictly for educational research, academic demonstration, and payment utility simulation under National Payments Corporation of India (NPCI) guidelines. FlowUPI is not a bank, regulated financial institution, or payment processor. It does not store user financial credentials, UPI PINs, or process monetary transactions directly.

---

## 👤 Author & License

**Created and maintained by [Sachin](https://github.com/mugenkyou)**.

Licensed under the **MIT License**. See [LICENSE](LICENSE) for details.
