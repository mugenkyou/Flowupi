# FlowUPI Security Policy

## Responsible Disclosure

FlowUPI is committed to ensuring a secure, privacy-respecting client-side application. If you believe you have discovered a security vulnerability or data handling issue in FlowUPI, please report it to us responsibly before public disclosure.

## How to Report a Vulnerability

1. Please submit your security findings via the official repository issue tracker or security reporting mechanism.
2. Provide a detailed description of the vulnerability, including step-by-step reproduction instructions, affected routes/components, and potential impact.
3. Allow reasonable time for project maintainers to investigate and address the report before sharing details publicly.

## Scope & Architectural Principles

- **Local-First Architecture:** FlowUPI operates entirely on the client side using browser Web Storage APIs (`localStorage`).
- **No Credentials:** FlowUPI does NOT collect, handle, or store UPI PINs, bank passwords, OTPs, CVVs, or biometric data.
- **Deep Links:** Payment intent URIs (`upi://pay`) are passed directly to native mobile operating system URI handlers.
- **Untrusted Input:** Scanned QR matrix strings and raw URI strings are parsed strictly as key-value parameters and sanitized against dangerous injection.
