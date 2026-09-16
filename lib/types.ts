export type TrancheStatus = 'pending' | 'inProgress' | 'paid' | 'failed';

export interface Tranche {
  id: string;
  index: number;
  amount: number;
  upiUri: string;
  payerName?: string;
  status: TrancheStatus;
  paidAt?: string;
  txnRef?: string;
}

export interface SplitOrder {
  orderId: string;
  merchantVpa: string;
  merchantName: string;
  totalAmount: number;
  note: string;
  tranches: Tranche[];
  createdAt: string;
}

export type PaymentStateMode = 
  | 'IDLE'
  | 'READY'
  | 'PAYMENT_STARTED'
  | 'WAITING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'TIMEOUT'
  | 'PARTIAL_SUCCESS'
  | 'RETRY_REQUIRED';

export interface GroupSplitPerson {
  name: string;
  amount: number;
}

export interface CalculatorInputs {
  monthlyTurnover: number;
  avgTicketSize: number;
}
