import type { TrustSegmentConfig, NavigationItem } from '../types';

// Trust Segment Configuration based on Design System
export const TRUST_SEGMENTS: TrustSegmentConfig = {
  butterfly: {
    color: '#10B981',
    lightColor: '#D1FAE5',
    darkColor: '#047857',
    emoji: '🦋',
    range: [80, 100],
    label: 'Butterfly (High Trust)',
  },
  loyal: {
    color: '#F59E0B',
    lightColor: '#FEF3C7',
    darkColor: '#D97706',
    emoji: '⭐',
    range: [60, 79],
    label: 'Loyal (Medium Trust)',
  },
  oneTime: {
    color: '#6366F1',
    lightColor: '#E0E7FF',
    darkColor: '#4F46E5',
    emoji: '💤',
    range: [40, 59],
    label: 'One-Time (Low Trust)',
  },
  risky: {
    color: '#EF4444',
    lightColor: '#FEE2E2',
    darkColor: '#DC2626',
    emoji: '⚠️',
    range: [0, 39],
    label: 'Risky (Needs Attention)',
  },
};

// Navigation Items
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/',
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'Users',
    route: '/clients',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: 'FileText',
    route: '/invoices',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    route: '/settings',
  },
];

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  positiveNumber: 'Must be a positive number',
  futureDate: 'Date must be in the future',
} as const;

// Currency Formatting
export const CURRENCY_CONFIG = {
  locale: 'en-IN',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

// Date Formatting
export const DATE_FORMATS = {
  short: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  time: 'HH:mm',
  datetime: 'MMM dd, yyyy HH:mm',
} as const;

// Performance Constants
export const PERFORMANCE = {
  debounceDelay: 300,
  loadingTimeout: 1000,
  maxTableRows: 100,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
} as const;

// Trust Score Calculation
export const TRUST_SCORE_WEIGHTS = {
  paymentHistory: 0.4,
  paymentTiming: 0.3,
  invoiceAmount: 0.2,
  relationshipLength: 0.1,
} as const;