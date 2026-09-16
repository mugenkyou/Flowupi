# ⚡ SplitPe (SplitUPI) — 0% MDR Payment Micro-Tranching Engine

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![NPCI Compliant](https://img.shields.io/badge/NPCI-0%25_MDR_Compliant-orange?style=flat-square)](https://npci.org.in)

> **Educational & Algorithmic Research Project** simulating retail counter bill micro-tranching into sub-₹2,000 payment slices for 100% MDR (Merchant Discount Rate) surcharge-free UPI settlement under NPCI guidelines.

---

## 📌 Overview

Under National Payments Corporation of India (NPCI) guidelines, standard UPI transactions up to **₹2,000** carry **0% MDR (Merchant Discount Rate)** surcharges. For small businesses, Kirana stores, and retail merchants, larger single transactions above ₹2,000 often incur merchant fees and MDR overheads.

**SplitPe (SplitUPI)** is a high-performance web application and algorithmic engine that automatically partitions large counter payments into optimal, sub-₹2,000 micro-tranches (e.g. splitting a ₹3,850 bill into ₹1,999 + ₹1,851). This ensures full compliance while maximizing merchant savings and offering frictionless customer payment flows via dynamic UPI QR codes and soundbox confirmation alerts.

---

## ✨ Key Features

- ⚡ **POS Micro-Tranching Engine**: Instantly partitions counter bills above ₹2,000 into sub-₹2,000 tranches with real-time MDR savings metrics.
- 🛍️ **Kirana & Retail Presets**: Pre-configured quick-select billing presets (e.g., Dhaba Dinner, Full Ration, Atta & Oil, Dry Fruits).
- 📲 **Dynamic UPI QR Code Generator**: Generates deep-linkable UPI QR codes (`upi://pay`) for instant scan-and-pay via Google Pay, PhonePe, Paytm, and BHIM.
- 📷 **Integrated QR Scanner**: Camera-based scanner modal powered by `html5-qrcode` to scan existing UPI codes and invoices.
- 🔊 **Soundbox Audio Notifications**: Built-in audio engine simulating physical POS soundbox payment alerts in multiple languages.
- 🧮 **Interactive Calculator & POS Mode**: Built-in split calculator, dedicated POS terminal view, and group bill split workflows.
- 📜 **Persistent Order History**: Auto-saves order history and cumulative MDR savings using browser storage.
- 🎨 **NeoPOP & Dark Cyber UI**: High-contrast, responsive dark UI featuring custom NeoPOP design components and micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Utilities**: `qrcode.react` & `html5-qrcode`
- **Effects**: `canvas-confetti`

---

## 📁 Project Structure

```
web/
├── app/                      # Next.js App Router pages & layouts
│   ├── calculator/           # Split & MDR savings calculator tool
│   ├── group/                # Group expense tranching & split management
│   ├── history/              # Saved order history & transaction logs
│   ├── pos/                  # Minimal POS merchant counter terminal
│   ├── soundbox/             # Soundbox audio verification suite
│   ├── globals.css           # Design tokens, NeoPOP styling, custom CSS
│   ├── layout.tsx            # Global layout with navigation & footer
│   └── page.tsx              # Main POS Micro-Tranching Dashboard
├── components/               # Modular UI components
│   ├── CloutShareModal.tsx   # Social & receipt share modal
│   ├── Navbar.tsx            # Application header & navigation links
│   ├── NeoPopComponents.tsx  # Custom NeoPOP cards, buttons & badges
│   ├── QRScannerModal.tsx    # Live camera QR scanner modal
│   ├── SoundboxSpeaker.tsx   # Audio soundbox speaker UI component
│   ├── SplitCheckoutModal.tsx# Step-by-step tranche payment modal
│   ├── SplitUpiLogo.tsx      # SVG logo asset
│   └── TrancheCard.tsx       # Individual tranche status & QR component
├── lib/                      # Core business logic & helpers
│   ├── soundbox.ts           # Speech synthesis & audio alert engine
│   ├── splitEngine.ts        # Algorithmic micro-tranching engine
│   ├── storage.ts            # LocalStorage persistence manager
│   └── types.ts              # TypeScript interface definitions
├── public/                   # Static assets & icons
│   ├── manifest.json         # Web App Manifest
│   └── favicon.png           # App favicon
├── index.html                # Root HTML entry fallback
├── next.config.js            # Next.js build configuration
├── tailwind.config.ts        # Custom theme & color configuration
├── tsconfig.json             # TypeScript compiler rules
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `yarn` / `pnpm`)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SplitPe.git
   cd SplitPe/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧠 Algorithmic Micro-Tranching Mechanics

The core algorithm located in [`lib/splitEngine.ts`](file:///c:/Users/Sachi/Documents/GITHUB/mugenkyou/SplitPe/web/lib/splitEngine.ts) operates as follows:

1. **Cap Threshold**: Standard 0% MDR threshold is capped at `₹1,999` per tranche (sub-₹2,000).
2. **Tranche Division**:
   $$\text{Tranche Count} = \left\lceil \frac{\text{Total Bill Amount}}{1999} \right\rceil$$
3. **Balanced Allocation**: The total bill is partitioned into balanced slices, ensuring no single tranche exceeds ₹1,999 while keeping tranche amounts clean for quick customer approval.
4. **Deep-Link Generation**: Every tranche generates a valid UPI payment URL:
   `upi://pay?pa={merchantVpa}&pn={merchantName}&am={trancheAmount}&cu=INR&tn={note}`

---

## 📜 License & Disclaimer

This project is licensed under the [MIT License](LICENSE).

*Disclaimer: This repository is built for educational, academic demonstration, and algorithmic research purposes regarding payment mechanics under NPCI UPI rules.*
