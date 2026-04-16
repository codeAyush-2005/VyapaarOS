// Trust Score Segment Types
export type TrustSegment = 'butterfly' | 'loyal' | 'oneTime' | 'risky';

// Invoice Status Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'pending' | 'overdue' | 'cancelled';

// Client Model
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  trustScore: number;
  segment: TrustSegment;
  createdDate: Date;
  lastPaymentDate?: Date;
  totalInvoiced: number;
  totalPaid: number;
  totalOwed: number;
  invoiceCount: number;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ClientSummary {
  id: string;
  name: string;
  email: string;
  trustScore: number;
  segment: TrustSegment;
}

// Invoice Model
export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client: ClientSummary;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  createdDate: Date;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Dashboard Model
export interface DashboardData {
  metrics: {
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
    clientCount: number;
  };
  trustDistribution: {
    butterfly: number;
    loyal: number;
    oneTime: number;
    risky: number;
  };
  recentActivity: ActivityItem[];
  upcomingDueDates: Invoice[];
}

export interface ActivityItem {
  id: string;
  type: 'invoice_created' | 'payment_received' | 'client_added' | 'invoice_overdue';
  timestamp: Date;
  description: string;
  client?: ClientSummary;
  amount?: number;
  status: 'success' | 'warning' | 'danger' | 'info';
}

// UI Component Props
export interface MetricCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

// Form Types
export interface ClientFilters {
  segment?: TrustSegment;
  search?: string;
  paymentStatus?: 'recent' | 'overdue' | 'no-outstanding';
  amountOwedRange?: 'none' | 'low' | 'medium' | 'high';
  sortBy?: 'name' | 'trustScore' | 'lastPaymentDate' | 'totalOwed';
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'number' | 'client' | 'amount' | 'dueDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

// Button and Input Types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'tel' | 'number' | 'date' | 'password';

// Trust Segment Configuration
export interface TrustSegmentConfig {
  butterfly: {
    color: string;
    lightColor: string;
    darkColor: string;
    emoji: string;
    range: [number, number];
    label: string;
  };
  loyal: {
    color: string;
    lightColor: string;
    darkColor: string;
    emoji: string;
    range: [number, number];
    label: string;
  };
  oneTime: {
    color: string;
    lightColor: string;
    darkColor: string;
    emoji: string;
    range: [number, number];
    label: string;
  };
  risky: {
    color: string;
    lightColor: string;
    darkColor: string;
    emoji: string;
    range: [number, number];
    label: string;
  };
}