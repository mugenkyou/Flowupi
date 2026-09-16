import { SplitOrder, Tranche, TrancheStatus } from './types';

export const SAFE_TRANCHE_CAP = 1999.0;

/**
 * Rounding helper to avoid floating point precision artifacts (0.1 + 0.2 = 0.30000000000000004)
 */
function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates tranche amounts that sum EXACTLY to totalAmount
 * with each tranche <= maxTranche.
 */
export function calculateTrancheAmounts(
  totalAmount: number,
  maxTranche: number = SAFE_TRANCHE_CAP,
  randomize: boolean = true
): number[] {
  const roundedTotal = roundToTwoDecimals(Math.max(0, totalAmount));
  if (roundedTotal <= 0) return [];
  if (roundedTotal <= maxTranche) return [roundedTotal];

  const trancheCount = Math.ceil(roundedTotal / maxTranche);
  const amounts: number[] = [];
  let remaining = roundedTotal;

  if (!randomize || trancheCount <= 1) {
    for (let i = 0; i < trancheCount; i++) {
      if (i === trancheCount - 1) {
        amounts.push(roundToTwoDecimals(remaining));
      } else {
        const amt = roundToTwoDecimals(Math.min(maxTranche, remaining));
        amounts.push(amt);
        remaining = roundToTwoDecimals(remaining - amt);
      }
    }
    return amounts;
  }

  // Natural randomized distribution
  for (let i = 0; i < trancheCount - 1; i++) {
    const remainingCount = trancheCount - 1 - i;
    const minAllowed = Math.max(10.0, remaining - remainingCount * maxTranche);
    const maxAllowed = Math.min(maxTranche, remaining - remainingCount * 10.0);

    let picked: number;
    if (maxAllowed <= minAllowed) {
      picked = minAllowed;
    } else {
      const isWhole = roundedTotal % 1 === 0;
      const spread = maxAllowed - minAllowed;

      if (isWhole && spread >= 10) {
        const minInt = Math.ceil(minAllowed);
        const maxInt = Math.floor(maxAllowed);
        if (maxInt > minInt) {
          picked = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        } else {
          picked = minInt;
        }
      } else {
        picked = minAllowed + Math.random() * (maxAllowed - minAllowed);
      }
    }

    const roundedPicked = roundToTwoDecimals(picked);
    amounts.push(roundedPicked);
    remaining = roundToTwoDecimals(remaining - roundedPicked);
  }

  // Last tranche gets exact remaining amount to guarantee exact sum
  amounts.push(roundToTwoDecimals(remaining));

  // Sanity check: if any tranche violated bounds or returned <= 0, fallback to balanced split
  if (amounts.some((a) => a > maxTranche || a <= 0)) {
    amounts.length = 0;
    remaining = roundedTotal;
    const base = roundToTwoDecimals(roundedTotal / trancheCount);
    for (let i = 0; i < trancheCount; i++) {
      if (i === trancheCount - 1) {
        amounts.push(roundToTwoDecimals(remaining));
      } else {
        amounts.push(base);
        remaining = roundToTwoDecimals(remaining - base);
      }
    }
  }

  return amounts;
}

/**
 * Builds standard NPCI UPI Intent URI (compliant with GPay, PhonePe & Paytm)
 */
export function buildUpiUri(params: {
  vpa: string;
  name: string;
  amount: number;
  note: string;
  txnRef?: string;
}): string {
  const queryParams: string[] = [];
  const cleanVpa = params.vpa.trim() || 'merchant@upi';
  const cleanName = params.name.trim() || 'Merchant';
  const cleanNote = params.note.trim() || 'FlowUPI Checkout';

  queryParams.push(`pa=${encodeURIComponent(cleanVpa)}`);
  queryParams.push(`pn=${encodeURIComponent(cleanName)}`);
  queryParams.push(`am=${params.amount.toFixed(2)}`);
  queryParams.push('cu=INR');
  queryParams.push(`tn=${encodeURIComponent(cleanNote)}`);

  if (params.txnRef && params.txnRef.trim()) {
    queryParams.push(`tr=${encodeURIComponent(params.txnRef.trim())}`);
  }

  return `upi://pay?${queryParams.join('&')}`;
}

/**
 * Parses a raw scanned UPI QR string into a map of parameters (pa, pn, am, tn, etc.)
 */
export function parseUpiUri(rawData: string): {
  pa: string;
  pn: string;
  am: string;
  tn: string;
  tr: string;
} {
  let clean = (rawData || '').trim();
  const result = { pa: '', pn: '', am: '', tn: '', tr: '' };
  if (!clean) return result;

  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1).trim();
  }

  try {
    const url = new URL(clean);
    url.searchParams.forEach((val, key) => {
      const k = key.toLowerCase();
      if (k === 'pa') result.pa = val.trim();
      if (k === 'pn') result.pn = val.trim();
      if (k === 'am') result.am = val.trim();
      if (k === 'tn') result.tn = val.trim();
      if (k === 'tr') result.tr = val.trim();
    });
  } catch (_) {
    // Regex fallback
    const paMatch = clean.match(/[?&]pa=([^&]+)/i);
    if (paMatch) result.pa = decodeURIComponent(paMatch[1]).trim();

    const pnMatch = clean.match(/[?&]pn=([^&]+)/i);
    if (pnMatch) result.pn = decodeURIComponent(pnMatch[1]).trim();

    const amMatch = clean.match(/[?&]am=([^&]+)/i);
    if (amMatch) result.am = amMatch[1].trim();

    const tnMatch = clean.match(/[?&]tn=([^&]+)/i);
    if (tnMatch) result.tn = decodeURIComponent(tnMatch[1]).trim();

    const trMatch = clean.match(/[?&]tr=([^&]+)/i);
    if (trMatch) result.tr = decodeURIComponent(trMatch[1]).trim();
  }

  // Fallback: Direct VPA string
  if (!result.pa && clean.includes('@') && !clean.includes('://')) {
    result.pa = clean.replace(/\s+/g, '');
  }

  // Default name from VPA if name is blank
  if (!result.pn && result.pa) {
    const handle = result.pa.split('@')[0];
    result.pn = handle.charAt(0).toUpperCase() + handle.slice(1);
  }

  return result;
}

/**
 * Creates a SplitOrder by dividing totalAmount into sub-₹2,000 tranches.
 */
export function createTrancheOrder(params: {
  totalAmount: number;
  merchantVpa: string;
  merchantName: string;
  note?: string;
  maxTranche?: number;
  randomize?: boolean;
}): SplitOrder {
  const orderId = `ORD${Date.now().toString().slice(-6)}`;
  const note = params.note || 'FlowUPI Checkout';
  const maxTranche = params.maxTranche || SAFE_TRANCHE_CAP;
  const randomize = params.randomize ?? true;

  if (params.totalAmount <= 0) {
    return {
      orderId,
      merchantVpa: params.merchantVpa,
      merchantName: params.merchantName,
      totalAmount: 0,
      note,
      tranches: [],
      createdAt: new Date().toISOString(),
    };
  }

  const amounts = calculateTrancheAmounts(
    params.totalAmount,
    maxTranche,
    randomize
  );
  const trancheCount = amounts.length;
  const tranches: Tranche[] = [];

  for (let i = 0; i < trancheCount; i++) {
    const amt = amounts[i];
    const index = i + 1;
    const trancheId = `${orderId}_${index}`;
    const trancheNote =
      trancheCount === 1 ? note : `${note} Tranche ${index}/${trancheCount}`;

    const upiUri = buildUpiUri({
      vpa: params.merchantVpa,
      name: params.merchantName,
      amount: amt,
      note: trancheNote,
    });

    tranches.push({
      id: trancheId,
      index,
      amount: amt,
      upiUri,
      status: 'pending',
    });
  }

  return {
    orderId,
    merchantVpa: params.merchantVpa,
    merchantName: params.merchantName,
    totalAmount: params.totalAmount,
    note,
    tranches,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates a group bill split order
 */
export function createGroupSplitOrder(params: {
  totalAmount: number;
  numberOfPeople: number;
  merchantVpa: string;
  merchantName: string;
  friendNames?: string[];
  note?: string;
}): SplitOrder {
  const orderId = `GRP${Date.now().toString().slice(-6)}`;
  const note = params.note || 'Group Bill Split';
  const people = Math.max(1, params.numberOfPeople);
  const tranches: Tranche[] = [];

  const perPersonBase = params.totalAmount / people;
  let distributedTotal = 0;

  for (let i = 0; i < people; i++) {
    const personName =
      params.friendNames && i < params.friendNames.length && params.friendNames[i].trim()
        ? params.friendNames[i].trim()
        : `Friend #${i + 1}`;

    let amt: number;
    if (i === people - 1) {
      amt = Number((params.totalAmount - distributedTotal).toFixed(2));
    } else {
      amt = Number(perPersonBase.toFixed(2));
    }
    distributedTotal += amt;

    const trancheId = `${orderId}_${i + 1}`;
    const upiUri = buildUpiUri({
      vpa: params.merchantVpa,
      name: params.merchantName,
      amount: amt,
      note: `${note} (${personName})`,
    });

    tranches.push({
      id: trancheId,
      index: i + 1,
      amount: amt,
      payerName: personName,
      upiUri,
      status: 'pending',
    });
  }

  return {
    orderId,
    merchantVpa: params.merchantVpa,
    merchantName: params.merchantName,
    totalAmount: params.totalAmount,
    note,
    tranches,
    createdAt: new Date().toISOString(),
  };
}

/**
 * MDR calculations without SplitUPI (0.4% on full transaction if > 2000, capped at 300)
 */
export function calcMdrStandard(totalAmount: number): number {
  if (totalAmount <= 2000) return 0.0;
  const fee = totalAmount * 0.004;
  return fee > 300 ? 300.0 : fee;
}

export function calcMdrSavings(totalAmount: number): number {
  return calcMdrStandard(totalAmount);
}

export function calcPaidAmount(order: SplitOrder): number {
  return order.tranches
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calcRemainingAmount(order: SplitOrder): number {
  return Math.max(0, order.totalAmount - calcPaidAmount(order));
}

export function calcProgress(order: SplitOrder): number {
  if (order.totalAmount === 0) return 0;
  return calcPaidAmount(order) / order.totalAmount;
}
