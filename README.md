# ⚡ FlowUPI — Fast Local-First UPI Payment Utility

**FlowUPI** is a fast, local-first web application designed for seamless UPI payments, merchant QR scanning, bill micro-tranching, group bill splits, MDR savings calculations, and merchant soundbox audio confirmations.

It functions as an installable **Progressive Web App (PWA)** with complete local persistence, working offline without requiring a remote database or cloud account.

---

## ✨ Core Features & Utilities

1. **Scan / Pay**: Instant camera QR scanning, gallery screenshot decoding, raw UPI intent URI parsing, and confirmed amount entry.
2. **0% MDR Micro-Tranching Engine**: Algorithmic bill partitioning into sub-₹2,000 tranches to legally eliminate payment gateway MDR fees under NPCI regulations.
3. **POS Counter Register Mode**: Fast bill calculator with pre-configured retail Kirana presets (`Atta & Oil`, `Full Ration`, `Dhaba Dinner`).
4. **Group Bill Splitter**: Equal & itemized bill division with instant individual friend QR slice cards and WhatsApp sharing.
5. **Annual MDR Savings Calculator**: Interactive turnover & ticket size slider engine showing business MDR fee recovery.
6. **Soundbox Audio Synthesizer**: Hardware audio confirmation alert simulator (*"Payment of ₹X received on FlowUPI"*) utilizing Web Audio API.
7. **Local-First History Ledger**: Full transaction history stored locally on the user's device, surviving browser refreshes and restarts with JSON Backup Export & Import capabilities.
8. **Installable PWA**: Installable on Android, iOS, Windows, macOS, and Linux as a standalone web application with offline shell caching.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Client Components, SSR Safe)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with NeoPOP 3D tactile borders and dark fintech color system
- **QR Scanning & Generation**: `html5-qrcode` & `qrcode.react`
- **PWA & Offline**: Web App Manifest, Service Worker (`sw.js`), `usePwaInstall` hook
- **Local Storage**: Versioned LocalStorage abstraction with JSON schema backup export/import

---

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- `npm` or `pnpm`

### Installation & Local Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 💾 Local-First & Privacy Architecture

FlowUPI operates entirely on client devices:

```text
             FlowUPI Web App
                    │
          ┌─────────┴─────────┐
          │                   │
       React UI          Local Storage
          │                   │
          │             localStorage &
          │             Versioned JSON
          │
          ├── Tranche Engine
          ├── QR Scanner
          ├── UPI Parser
          ├── Calculator
          ├── Group Split
          ├── Soundbox
          └── History Ledger
```

- **No Server Database**: Your transaction records and groups remain private on your device.
- **Backup & Restore**: Export your data anytime as `flowupi-backup-YYYY-MM-DD.json` or restore from a previous backup.
- **Zero Sensitive Credential Storage**: No UPI PINs, bank passwords, or authentication keys are stored.

---

## 📄 License

MIT License. Designed for educational research, academic demonstration, and algorithmic simulation under NPCI guidelines.
