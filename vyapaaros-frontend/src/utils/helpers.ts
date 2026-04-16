import { format } from 'date-fns';
import type { TrustSegment } from '../types';
import { TRUST_SEGMENTS, CURRENCY_CONFIG, DATE_FORMATS } from './constants';

// Trust Score Utilities
export function getTrustSegment(score: number): TrustSegment {
  if (score >= 80) return 'butterfly';
  if (score >= 60) return 'loyal';
  if (score >= 40) return 'oneTime';
  return 'risky';
}

export function getTrustSegmentConfig(segment: TrustSegment) {
  return TRUST_SEGMENTS[segment];
}

export function getTrustSegmentFromScore(score: number) {
  const segment = getTrustSegment(score);
  return getTrustSegmentConfig(segment);
}

// Currency Formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits: CURRENCY_CONFIG.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.maximumFractionDigits,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and parse as number
  const cleaned = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
}

// Date Formatting
export function formatDate(date: Date, formatType: keyof typeof DATE_FORMATS = 'short'): string {
  return format(date, DATE_FORMATS[formatType]);
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

export function getDaysOverdue(dueDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - dueDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// String Utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validation Utilities (basic - use validation.ts for comprehensive validation)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
}

export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
}

// Re-export comprehensive validation utilities
export * from './validation';

// Array Utilities
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterBy<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Debounce Utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local Storage Utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// Class Name Utilities
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Number Utilities
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// ID Generation
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `INV-${year}${month}-${random}`;
}