import { buildUpiUri } from './splitEngine';

export interface RawPaymentPayload {
  vpa: string;
  name: string;
  amount: number;
  payer?: string;
  note?: string;
}

export interface DecodedPaymentData {
  valid: boolean;
  error?: 'INVALID_LINK' | 'INVALID_AMOUNT' | 'MISSING_DATA';
  errorMessage?: string;
  vpa?: string;
  name?: string;
  amount?: number;
  payer?: string;
  note?: string;
  upiUri?: string;
}

/**
 * Encodes payment details into a compact, URL-safe Base64 payload string
 * format: { v: vpa, m: name, a: amount, p: payer, n: note }
 */
export function encodePaymentPayload(data: RawPaymentPayload): string {
  const compactObj = {
    v: (data.vpa || '').trim(),
    m: (data.name || '').trim(),
    a: Number(data.amount.toFixed(2)),
    p: (data.payer || '').trim(),
    n: (data.note || 'Group Bill Split').trim(),
  };

  const jsonString = JSON.stringify(compactObj);

  // Convert to Base64url (URL-safe without +, /, =)
  if (typeof window !== 'undefined' && typeof btoa === 'function') {
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } else {
    // Node.js fallback
    return Buffer.from(jsonString).toString('base64url');
  }
}

/**
 * Generates a clean FlowUPI payment link for sharing cross-device.
 * E.g., https://flowupi.vercel.app/p/eyJhIjoxODAwLCJwIjoicmVzdGF1cmFudEB1cGki...
 */
export function generatePaymentUrl(data: RawPaymentPayload, absolute: boolean = false): string {
  const payloadStr = encodePaymentPayload(data);
  const relativeUrl = `/p/${payloadStr}`;

  if (absolute && typeof window !== 'undefined') {
    return `${window.location.origin}${relativeUrl}`;
  }
  
  if (absolute) {
    return `https://flowupi.vercel.app${relativeUrl}`;
  }

  return relativeUrl;
}

/**
 * Decodes and strictly validates an incoming payment payload string from /p/[payload].
 * Prevents XSS, invalid amounts, malformed VPAs, and arbitrary code execution.
 */
export function decodePaymentPayload(payloadStr: string): DecodedPaymentData {
  if (!payloadStr || typeof payloadStr !== 'string') {
    return {
      valid: false,
      error: 'INVALID_LINK',
      errorMessage: "Payment link isn't valid.",
    };
  }

  try {
    // Restore base64url to standard base64
    let base64 = payloadStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    let jsonString: string;
    if (typeof window !== 'undefined' && typeof atob === 'function') {
      jsonString = decodeURIComponent(atob(base64));
    } else {
      jsonString = Buffer.from(base64, 'base64').toString('utf-8');
    }

    const obj = JSON.parse(jsonString);

    if (!obj || typeof obj !== 'object') {
      return {
        valid: false,
        error: 'INVALID_LINK',
        errorMessage: "Payment link isn't valid.",
      };
    }

    const vpa = typeof obj.v === 'string' ? obj.v.trim() : '';
    const name = typeof obj.m === 'string' ? obj.m.trim() : '';
    const amountRaw = Number(obj.a);
    const payer = typeof obj.p === 'string' ? obj.p.trim() : '';
    const note = typeof obj.n === 'string' ? obj.n.trim() : 'Group Bill Split';

    // 1. Amount validation
    if (typeof amountRaw !== 'number' || isNaN(amountRaw) || !isFinite(amountRaw) || amountRaw <= 0) {
      return {
        valid: false,
        error: 'INVALID_AMOUNT',
        errorMessage: 'Payment amount is invalid.',
      };
    }

    // Maximum safe UPI transaction cap check (200,000 INR)
    if (amountRaw > 200000) {
      return {
        valid: false,
        error: 'INVALID_AMOUNT',
        errorMessage: 'Payment amount exceeds standard UPI limits (₹2,00,000).',
      };
    }

    // 2. VPA validation (must contain @ and valid handle characters)
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!vpa || !vpaRegex.test(vpa)) {
      return {
        valid: false,
        error: 'MISSING_DATA',
        errorMessage: 'Payment details are unavailable.',
      };
    }

    // 3. Name & Note Sanitization
    const cleanName = name || 'Merchant';
    const cleanPayer = payer || 'Friend';
    const cleanNote = note || 'Group Bill Split';
    const validAmount = Number(amountRaw.toFixed(2));

    // Construct internal UPI deep link
    const upiUri = buildUpiUri({
      vpa,
      name: cleanName,
      amount: validAmount,
      note: cleanPayer ? `${cleanNote} (${cleanPayer})` : cleanNote,
    });

    return {
      valid: true,
      vpa,
      name: cleanName,
      amount: validAmount,
      payer: cleanPayer,
      note: cleanNote,
      upiUri,
    };
  } catch (_) {
    return {
      valid: false,
      error: 'INVALID_LINK',
      errorMessage: "Payment link isn't valid.",
    };
  }
}
