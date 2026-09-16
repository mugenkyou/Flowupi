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
  const sum6800 = Math.round(tranches6800.reduce((a, b) => a + b, 0) * 100) / 100;
  const pass1 = tranches6800.length === 4 && sum6800 === 6800 && tranches6800.every(a => a <= 1999 && a > 0);
  results.push({ test: '₹6,800 Slicing into 4 sub-₹2,000 tranches', passed: pass1, details: JSON.stringify(tranches6800) });

  // Test 2: ₹1,999 Single Tranche
  const tranches1999 = calculateTrancheAmounts(1999, 1999, false);
  const pass2 = tranches1999.length === 1 && tranches1999[0] === 1999;
  results.push({ test: '₹1,999 Single Tranche Bounds', passed: pass2, details: JSON.stringify(tranches1999) });

  // Test 3: ₹2,001 Slicing
  const tranches2001 = calculateTrancheAmounts(2001, 1999, false);
  const sum2001 = Math.round(tranches2001.reduce((a, b) => a + b, 0) * 100) / 100;
  const pass3 = tranches2001.length === 2 && sum2001 === 2001;
  results.push({ test: '₹2,001 Slicing Bounds', passed: pass3, details: JSON.stringify(tranches2001) });

  // Test 4: Zero & Boundary Amounts
  const tranchesZero = calculateTrancheAmounts(0, 1999, false);
  const passZero = tranchesZero.length === 0;
  results.push({ test: 'Zero Amount Bounds', passed: passZero, details: JSON.stringify(tranchesZero) });

  // Test 5: ₹50,000 Large Invoice Slicing
  const tranches50k = calculateTrancheAmounts(50000, 1999, true);
  const sum50k = Math.round(tranches50k.reduce((a, b) => a + b, 0) * 100) / 100;
  const pass50k = tranches50k.length === 26 && sum50k === 50000 && tranches50k.every(a => a <= 1999 && a > 0);
  results.push({ test: '₹50,000 Large Invoice Slicing', passed: pass50k, details: `Count: ${tranches50k.length}, Sum: ₹${sum50k}` });

  // Test 6: UPI URI Building & Parsing
  const uri = buildUpiUri({ vpa: 'store@upi', name: 'Kirana Store', amount: 1999, note: 'Tranche 1' });
  const parsed = parseUpiUri(uri);
  const pass6 = parsed.pa === 'store@upi' && parsed.pn === 'Kirana Store' && parsed.am === '1999.00';
  results.push({ test: 'UPI URI Building & Parsing', passed: pass6, details: JSON.stringify(parsed) });

  // Test 7: Plain VPA Raw String Parsing
  const parsedVpa = parseUpiUri('merchant@okhdfcbank');
  const pass7 = parsedVpa.pa === 'merchant@okhdfcbank' && parsedVpa.pn === 'Merchant';
  results.push({ test: 'Raw VPA String Parsing', passed: pass7, details: JSON.stringify(parsedVpa) });

  // Test 8: Group Bill Split Order
  const groupOrder = createGroupSplitOrder({
    totalAmount: 5400,
    numberOfPeople: 3,
    merchantVpa: 'bistro@upi',
    merchantName: 'Bistro Grill',
    friendNames: ['Alex', 'Priya', 'Rahul'],
  });
  const groupSum = Math.round(groupOrder.tranches.reduce((sum, t) => sum + t.amount, 0) * 100) / 100;
  const pass8 = groupOrder.tranches.length === 3 && groupSum === 5400;
  results.push({ test: 'Group Bill Split Exact Sum', passed: pass8, details: `Tranches: ${groupOrder.tranches.length}, Sum: ₹${groupSum}` });

  // Test 9: MDR Math (0.4% capped at ₹300)
  const mdr6800 = calcMdrStandard(6800); // 6800 * 0.004 = 27.20
  const pass9 = Math.abs(mdr6800 - 27.20) < 0.01;
  results.push({ test: 'MDR Gateway Fee Math', passed: pass9, details: `MDR: ₹${mdr6800}` });

  if (typeof window !== 'undefined') {
    console.log('SplitUPI QA Test Suite Results:', results);
  }
  return results.every(r => r.passed);
}
