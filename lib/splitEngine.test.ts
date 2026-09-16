import {
  calculateTrancheAmounts,
  buildUpiUri,
  parseUpiUri,
  createTrancheOrder,
  createGroupSplitOrder,
  calcMdrStandard,
  calcMdrSavings,
} from './splitEngine';

export function runSplitEngineSanityTests() {
  const results: { test: string; passed: boolean; details?: string }[] = [];

  // Test 1: ₹6,800 Slicing
  const tranches6800 = calculateTrancheAmounts(6800, 1999, false);
  const sum6800 = tranches6800.reduce((a, b) => a + b, 0);
  const pass1 = tranches6800.length === 4 && Math.abs(sum6800 - 6800) < 0.01 && tranches6800.every(a => a <= 1999);
  results.push({ test: '₹6,800 Slicing into 4 sub-₹2,000 tranches', passed: pass1, details: JSON.stringify(tranches6800) });

  // Test 2: ₹1,999 Single Tranche
  const tranches1999 = calculateTrancheAmounts(1999, 1999, false);
  const pass2 = tranches1999.length === 1 && tranches1999[0] === 1999;
  results.push({ test: '₹1,999 Single Tranche Bounds', passed: pass2, details: JSON.stringify(tranches1999) });

  // Test 3: ₹2,001 Slicing
  const tranches2001 = calculateTrancheAmounts(2001, 1999, false);
  const sum2001 = tranches2001.reduce((a, b) => a + b, 0);
  const pass3 = tranches2001.length === 2 && Math.abs(sum2001 - 2001) < 0.01;
  results.push({ test: '₹2,001 Slicing Bounds', passed: pass3, details: JSON.stringify(tranches2001) });

  // Test 4: UPI URI Builder & Parser
  const uri = buildUpiUri({ vpa: 'store@upi', name: 'Kirana Store', amount: 1999, note: 'Tranche 1' });
  const parsed = parseUpiUri(uri);
  const pass4 = parsed.pa === 'store@upi' && parsed.pn === 'Kirana Store' && parsed.am === '1999.00';
  results.push({ test: 'UPI URI Building & Parsing', passed: pass4, details: JSON.stringify(parsed) });

  // Test 5: MDR Math
  const mdr6800 = calcMdrStandard(6800); // 6800 * 0.004 = 27.20
  const pass5 = Math.abs(mdr6800 - 27.20) < 0.01;
  results.push({ test: 'MDR Gateway Fee Math', passed: pass5, details: `MDR: ₹${mdr6800}` });

  console.log('Sanity Test Suite Results:', results);
  return results.every(r => r.passed);
}
