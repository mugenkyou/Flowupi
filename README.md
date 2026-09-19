# FlowUPI

FlowUPI is a local-first web application for scanning UPI payment QR codes, splitting merchant invoices into sequential sub-₹2,000 micro-tranches, managing group bill splits, and simulating merchant soundbox audio alerts.

## Live Demo

[https://flowupi.vercel.app/](https://flowupi.vercel.app/)

## What it does

FlowUPI helps users and merchants process UPI payment workflows client-side without requiring a cloud backend or account registration. It parses standard NPCI UPI QR codes, slices invoice totals into smaller payment tranches, generates UPI intent deep links for installed payment applications, and stores transaction history locally inside the browser.

## Features

- **Merchant QR Scanner**: Scan physical QR standees via device camera or import screenshot images from gallery.
- **UPI Intent Parser**: Extract payee VPA, payee name, amount, and reference notes from raw `upi://pay` strings.
- **Bill Micro-Tranching**: Slice larger merchant invoices into sequential sub-₹2,000 payment tranches under NPCI 0% MDR guidelines.
- **POS Counter Register Mode**: Fast bill tranching interface with retail preset items.
- **Group Bill Splitter**: Divide bills equally or itemized among participants and generate individual payment links.
- **MDR Calculator**: Interactive model comparing interchange fee economics across savings UPI, PPI wallets, and credit cards.
- **Soundbox Audio Simulator**: Web Audio alert simulator for counter payment confirmations in 8 Indian languages.
- **Local Payment History**: Manage payment records locally in `localStorage` with JSON export and import capabilities.
- **PWA Support**: Progressive Web App manifest for installability on mobile devices.

## How it works

```text
Merchant QR / Screenshot
         ↓
 Camera or Canvas Decoder
         ↓
 Parse `upi://pay` Parameters
         ↓
  Confirm Total Amount
         ↓
 Generate Sub-₹2,000 Tranches
         ↓
 Deep Link to UPI App (GPay, PhonePe, Paytm, BHIM)
         ↓
 Payment Verification
```

## Privacy

- **Local Storage**: All transaction history, group splits, and user preferences are saved strictly in your browser's `localStorage`.
- **Client-Side QR Decoding**: Camera feeds and uploaded image frames are processed in-memory in your browser using the `BarcodeDetector` API and canvas utilities. No images are uploaded to any server.
- **No Credentials**: FlowUPI does not collect or store UPI PINs, passwords, OTPs, or card details.
- **Analytics**: FlowUPI uses Google Analytics (`G-4BFKD44HFM`) to measure basic page usage and traffic metrics. Scanned QR content and financial figures are never sent to analytics.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- [React 18](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)
- `html5-qrcode` & `qrcode.react` (QR scanning & rendering)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mugenkyou/Flowupi.git
   cd Flowupi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Project Structure

```text
Flowupi/
├── app/                  # Next.js 14 App Router routes & pages
│   ├── about/            # About page & open-source summary
│   ├── blog/             # Knowledge base & guides
│   ├── calculator/       # MDR calculator
│   ├── group/            # Group bill splitter
│   ├── history/          # Local ledger & JSON export/import
│   ├── pos/              # POS counter register
│   ├── scan/             # Scan & pay workstation
│   ├── soundbox/         # Audio synthesizer
│   ├── layout.tsx        # Root layout with header, footer, & analytics
│   └── page.tsx          # Main home workstation
├── components/           # Reusable UI components & modals
│   ├── Navbar.tsx        # Header navigation & GitHub link
│   ├── Footer.tsx        # Footer navigation & repository links
│   ├── QRScannerModal.tsx # Camera & image file QR reader
│   └── ...
├── lib/                  # Business logic & utilities
│   ├── qrDecoder.ts      # Multi-strategy QR decoding pipeline
│   ├── splitEngine.ts    # Micro-tranche & UPI URI algorithms
│   ├── storage.ts        # LocalStorage persistence & backup helpers
│   └── types.ts          # TypeScript interfaces
└── public/               # Static assets & web manifest
```

## Development Scripts

In `package.json`:

- `npm run dev`: Starts local Next.js development server.
- `npm run build`: Compiles TypeScript and creates optimized production build.
- `npm run start`: Runs production Next.js server.
- `npm run lint`: Runs Next.js ESLint code checks.

## Contributing

FlowUPI is open source. Contributions, bug reports, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Security

Please review [SECURITY.md](SECURITY.md) for vulnerability disclosure guidelines.

## License

FlowUPI is released under the [MIT License](LICENSE).

## Links

- **GitHub Repository**: [https://github.com/mugenkyou/Flowupi](https://github.com/mugenkyou/Flowupi)
- **Issue Tracker**: [https://github.com/mugenkyou/Flowupi/issues](https://github.com/mugenkyou/Flowupi/issues)
- **Live Demo**: [https://flowupi.vercel.app/](https://flowupi.vercel.app/)
