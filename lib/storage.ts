import { SplitOrder } from './types';

export const FLOWUPI_STORAGE_VERSION = 1;

const KEYS = {
  VERSION: 'flowupi_version',
  HISTORY: 'flowupi_transaction_history',
  GROUPS: 'flowupi_group_splits',
  PREFERENCES: 'flowupi_user_preferences',
};

const LEGACY_KEYS = {
  VERSION: 'splitupi_version',
  HISTORY: 'splitupi_transaction_history',
  GROUPS: 'splitupi_group_splits',
  PREFERENCES: 'splitupi_user_preferences',
};

export interface GroupSplitRecord {
  id: string;
  groupName: string;
  totalAmount: number;
  numberOfPeople: number;
  friendNames: string[];
  merchantName: string;
  merchantVpa: string;
  createdAt: string;
  order?: SplitOrder;
}

export interface UserPreferences {
  soundboxVolume?: number;
  lastPosAmount?: number;
  lastCalculatorTurnover?: number;
  lastCalculatorTicketSize?: number;
}

export interface BackupDataFormat {
  appName: string;
  version: number;
  exportedAt: string;
  data: {
    history: SplitOrder[];
    groups: GroupSplitRecord[];
    preferences: UserPreferences;
  };
}

/**
 * Migration helper: Reads legacy splitupi_* keys if flowupi_* keys are not initialized
 */
function migrateLegacyStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const version = localStorage.getItem(KEYS.VERSION);
    if (!version) {
      localStorage.setItem(KEYS.VERSION, String(FLOWUPI_STORAGE_VERSION));

      // Migrate History
      const legacyHistory = localStorage.getItem(LEGACY_KEYS.HISTORY);
      if (legacyHistory && !localStorage.getItem(KEYS.HISTORY)) {
        localStorage.setItem(KEYS.HISTORY, legacyHistory);
      }

      // Migrate Groups
      const legacyGroups = localStorage.getItem(LEGACY_KEYS.GROUPS);
      if (legacyGroups && !localStorage.getItem(KEYS.GROUPS)) {
        localStorage.setItem(KEYS.GROUPS, legacyGroups);
      }

      // Migrate Preferences
      const legacyPrefs = localStorage.getItem(LEGACY_KEYS.PREFERENCES);
      if (legacyPrefs && !localStorage.getItem(KEYS.PREFERENCES)) {
        localStorage.setItem(KEYS.PREFERENCES, legacyPrefs);
      }
    }
  } catch (_) {}
}

// -------------------------------------------------------------
// Transaction History
// -------------------------------------------------------------
export function getSavedOrders(): SplitOrder[] {
  if (typeof window === 'undefined') return [];
  migrateLegacyStorage();
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as SplitOrder[];
  } catch (_) {
    return [];
  }
}

export function saveOrder(order: SplitOrder): void {
  if (typeof window === 'undefined') return;
  migrateLegacyStorage();
  try {
    const orders = getSavedOrders();
    const existingIndex = orders.findIndex((o) => o.orderId === order.orderId);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(orders));
  } catch (_) {}
}

export function deleteOrder(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getSavedOrders().filter((o) => o.orderId !== orderId);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(orders));
  } catch (_) {}
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEYS.HISTORY);
  } catch (_) {}
}

// -------------------------------------------------------------
// Group Splits
// -------------------------------------------------------------
export function getSavedGroups(): GroupSplitRecord[] {
  if (typeof window === 'undefined') return [];
  migrateLegacyStorage();
  try {
    const raw = localStorage.getItem(KEYS.GROUPS);
    if (!raw) return [];
    return JSON.parse(raw) as GroupSplitRecord[];
  } catch (_) {
    return [];
  }
}

export function saveGroup(group: GroupSplitRecord): void {
  if (typeof window === 'undefined') return;
  migrateLegacyStorage();
  try {
    const groups = getSavedGroups();
    const existingIndex = groups.findIndex((g) => g.id === group.id);
    if (existingIndex >= 0) {
      groups[existingIndex] = group;
    } else {
      groups.unshift(group);
    }
    localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
  } catch (_) {}
}

export function deleteGroup(groupId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const groups = getSavedGroups().filter((g) => g.id !== groupId);
    localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
  } catch (_) {}
}

export function clearGroups(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEYS.GROUPS);
  } catch (_) {}
}

// -------------------------------------------------------------
// User Preferences
// -------------------------------------------------------------
export function getSavedPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  migrateLegacyStorage();
  try {
    const raw = localStorage.getItem(KEYS.PREFERENCES);
    if (!raw) return {};
    return JSON.parse(raw) as UserPreferences;
  } catch (_) {
    return {};
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  migrateLegacyStorage();
  try {
    const existing = getSavedPreferences();
    const updated = { ...existing, ...prefs };
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (_) {}
}

// -------------------------------------------------------------
// Backup Export & Import
// -------------------------------------------------------------
export function exportData(): void {
  if (typeof window === 'undefined') return;
  try {
    const backup: BackupDataFormat = {
      appName: 'FlowUPI',
      version: FLOWUPI_STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        history: getSavedOrders(),
        groups: getSavedGroups(),
        preferences: getSavedPreferences(),
      },
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `flowupi-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed:', err);
  }
}

export function importData(jsonContent: string): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'SSR environment' };
  }

  try {
    const parsed = JSON.parse(jsonContent) as Partial<BackupDataFormat>;

    if (!parsed || (parsed.appName !== 'FlowUPI' && parsed.appName !== 'SplitUPI')) {
      return {
        success: false,
        message: 'Invalid backup file: File signature does not match FlowUPI data format.',
      };
    }

    if (!parsed.data) {
      return { success: false, message: 'Invalid backup file: Payload data missing.' };
    }

    // Restore History
    if (Array.isArray(parsed.data.history)) {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(parsed.data.history));
    }

    // Restore Groups
    if (Array.isArray(parsed.data.groups)) {
      localStorage.setItem(KEYS.GROUPS, JSON.stringify(parsed.data.groups));
    }

    // Restore Preferences
    if (parsed.data.preferences && typeof parsed.data.preferences === 'object') {
      localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(parsed.data.preferences));
    }

    // Dispatch update notification event
    window.dispatchEvent(new CustomEvent('flowupi:data_imported'));

    return {
      success: true,
      message: `Successfully imported backup data (${parsed.data.history?.length || 0} orders, ${parsed.data.groups?.length || 0} groups).`,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to parse JSON file. Please select a valid FlowUPI backup JSON file.',
    };
  }
}
