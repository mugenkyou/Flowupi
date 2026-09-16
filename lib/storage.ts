import { SplitOrder } from './types';

const STORAGE_KEY = 'splitupi_transaction_history';

export function getSavedOrders(): SplitOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SplitOrder[];
  } catch (_) {
    return [];
  }
}

export function saveOrder(order: SplitOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getSavedOrders();
    const existingIndex = orders.findIndex((o) => o.orderId === order.orderId);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (_) {}
}

export function deleteOrder(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getSavedOrders().filter((o) => o.orderId !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (_) {}
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}
