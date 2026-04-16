import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Client, Invoice, ActivityItem, DashboardData } from '../types';
import { generateId, getTrustSegment } from '../utils/helpers';

interface AppState {
  clients: Client[];
  invoices: Invoice[];
  dashboardData: DashboardData;
}

interface AppContextType extends AppState {
  // Client operations
  addClient: (clientData: Omit<Client, 'id' | 'createdDate' | 'trustScore' | 'segment' | 'totalInvoiced' | 'totalPaid' | 'totalOwed' | 'invoiceCount'>) => void;
  updateClient: (clientId: string, clientData: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
  
  // Invoice operations
  addInvoice: (invoiceData: Partial<Invoice>) => void;
  updateInvoice: (invoiceId: string, invoiceData: Partial<Invoice>) => void;
  deleteInvoice: (invoiceId: string) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  getInvoiceById: (invoiceId: string) => Invoice | undefined;
  
  // Dashboard operations
  refreshDashboard: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    trustScore: 85,
    segment: 'butterfly',
    createdDate: new Date('2023-06-15'),
    lastPaymentDate: new Date('2024-01-10'),
    totalInvoiced: 125000,
    totalPaid: 100000,
    totalOwed: 25000,
    invoiceCount: 8,
    notes: 'Excellent client, always pays on time',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    trustScore: 72,
    segment: 'loyal',
    createdDate: new Date('2023-08-20'),
    lastPaymentDate: new Date('2024-01-08'),
    totalInvoiced: 85000,
    totalPaid: 70000,
    totalOwed: 15000,
    invoiceCount: 5,
    notes: 'Good client, occasional delays but reliable',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    trustScore: 45,
    segment: 'oneTime',
    createdDate: new Date('2023-12-01'),
    lastPaymentDate: new Date('2023-12-15'),
    totalInvoiced: 18000,
    totalPaid: 10000,
    totalOwed: 8000,
    invoiceCount: 2,
    notes: 'New client, monitoring payment behavior',
  },
  {
    id: '4',
    name: 'Sunita Singh',
    email: 'sunita@example.com',
    phone: '+91 65432 10987',
    trustScore: 25,
    segment: 'risky',
    createdDate: new Date('2023-05-10'),
    lastPaymentDate: new Date('2023-11-20'),
    totalInvoiced: 95000,
    totalPaid: 60000,
    totalOwed: 35000,
    invoiceCount: 6,
    notes: 'Frequent payment delays, requires follow-up',
  },
  {
    id: '5',
    name: 'Vikram Mehta',
    email: 'vikram@example.com',
    phone: '+91 54321 09876',
    trustScore: 78,
    segment: 'loyal',
    createdDate: new Date('2023-07-05'),
    lastPaymentDate: new Date('2024-01-05'),
    totalInvoiced: 156000,
    totalPaid: 140000,
    totalOwed: 16000,
    invoiceCount: 9,
    notes: 'Consistent client, good communication',
  },
];

const initialInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    clientId: '1',
    client: { id: '1', name: 'Rajesh Sharma', email: 'rajesh@example.com', trustScore: 85, segment: 'butterfly' },
    items: [
      { id: 'item-1', description: 'Web Development Services', quantity: 1, rate: 25000, amount: 25000 }
    ],
    subtotal: 25000,
    tax: 0,
    total: 25000,
    status: 'paid',
    createdDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    paidDate: new Date('2024-02-10')
  },
  {
    id: '2',
    number: 'INV-2024-002',
    clientId: '2',
    client: { id: '2', name: 'Priya Patel', email: 'priya@example.com', trustScore: 72, segment: 'loyal' },
    items: [
      { id: 'item-2', description: 'Mobile App Development', quantity: 1, rate: 15000, amount: 15000 }
    ],
    subtotal: 15000,
    tax: 0,
    total: 15000,
    status: 'pending',
    createdDate: new Date('2024-01-20'),
    dueDate: new Date('2024-02-20')
  },
  {
    id: '3',
    number: 'INV-2024-003',
    clientId: '3',
    client: { id: '3', name: 'Amit Kumar', email: 'amit@example.com', trustScore: 45, segment: 'oneTime' },
    items: [
      { id: 'item-3', description: 'Consulting Services', quantity: 4, rate: 2000, amount: 8000 }
    ],
    subtotal: 8000,
    tax: 0,
    total: 8000,
    status: 'overdue',
    createdDate: new Date('2024-01-10'),
    dueDate: new Date('2024-01-30')
  },
  {
    id: '4',
    number: 'INV-2024-004',
    clientId: '4',
    client: { id: '4', name: 'Sunita Singh', email: 'sunita@example.com', trustScore: 25, segment: 'risky' },
    items: [
      { id: 'item-4', description: 'Design Services', quantity: 1, rate: 35000, amount: 35000 }
    ],
    subtotal: 35000,
    tax: 0,
    total: 35000,
    status: 'overdue',
    createdDate: new Date('2023-12-15'),
    dueDate: new Date('2024-01-15')
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  
  // Calculate dashboard data using useMemo (derived state)
  const dashboardData = useMemo<DashboardData>(() => {
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.total, 0);

    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    const trustDistribution = clients.reduce(
      (acc, client) => {
        acc[client.segment] = (acc[client.segment] || 0) + 1;
        return acc;
      },
      { butterfly: 0, loyal: 0, oneTime: 0, risky: 0 }
    );

    // Generate recent activity from invoices
    const recentActivity: ActivityItem[] = invoices
      .slice(0, 5)
      .map(invoice => ({
        id: invoice.id,
        type: invoice.status === 'paid' ? 'payment_received' as const : 
              invoice.status === 'overdue' ? 'invoice_overdue' as const : 
              'invoice_created' as const,
        timestamp: invoice.paidDate || invoice.createdDate,
        description: invoice.status === 'paid' 
          ? `Payment received from ${invoice.client.name}`
          : invoice.status === 'overdue'
          ? `Invoice for ${invoice.client.name} is now overdue`
          : `New invoice created for ${invoice.client.name}`,
        client: invoice.client,
        amount: invoice.total,
        status: invoice.status === 'paid' ? 'success' : 
                invoice.status === 'overdue' ? 'danger' : 'info',
      }));

    // Get upcoming due dates
    const upcomingDueDates = invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'sent')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);

    return {
      metrics: {
        totalRevenue,
        pendingAmount,
        overdueAmount,
        clientCount: clients.length,
      },
      trustDistribution,
      recentActivity,
      upcomingDueDates,
    };
  }, [clients, invoices]);

  // Client operations
  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdDate' | 'trustScore' | 'segment' | 'totalInvoiced' | 'totalPaid' | 'totalOwed' | 'invoiceCount'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      createdDate: new Date(),
      trustScore: 50,
      segment: getTrustSegment(50),
      totalInvoiced: 0,
      totalPaid: 0,
      totalOwed: 0,
      invoiceCount: 0,
    };
    setClients(prev => [...prev, newClient]);
  }, []);

  const updateClient = useCallback((clientId: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, ...clientData, segment: getTrustSegment(clientData.trustScore ?? client.trustScore) }
        : client
    ));
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  }, []);

  const getClientById = useCallback((clientId: string) => {
    return clients.find(client => client.id === clientId);
  }, [clients]);

  // Invoice operations
  const addInvoice = useCallback((invoiceData: Partial<Invoice>) => {
    const client = clients.find(c => c.id === invoiceData.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const newInvoice: Invoice = {
      id: generateId(),
      number: invoiceData.number || `INV-${Date.now()}`,
      clientId: invoiceData.clientId!,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        trustScore: client.trustScore,
        segment: client.segment,
      },
      items: invoiceData.items || [],
      subtotal: invoiceData.subtotal || 0,
      tax: invoiceData.tax || 0,
      total: invoiceData.total || 0,
      status: invoiceData.status || 'draft',
      createdDate: new Date(),
      dueDate: invoiceData.dueDate || new Date(),
      notes: invoiceData.notes,
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Update client's invoice count and total invoiced
    updateClient(client.id, {
      invoiceCount: client.invoiceCount + 1,
      totalInvoiced: client.totalInvoiced + newInvoice.total,
      totalOwed: client.totalOwed + newInvoice.total,
    });
  }, [clients, updateClient]);

  const updateInvoice = useCallback((invoiceId: string, invoiceData: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, ...invoiceData } : invoice
    ));
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
  }, []);

  const updateInvoiceStatus = useCallback((invoiceId: string, status: Invoice['status']) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    const updatedInvoice = {
      ...invoice,
      status,
      paidDate: status === 'paid' ? new Date() : invoice.paidDate,
    };

    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? updatedInvoice : inv
    ));

    // Update client trust score when invoice is paid
    if (status === 'paid' && invoice.status !== 'paid') {
      const client = clients.find(c => c.id === invoice.clientId);
      if (client) {
        const newTrustScore = Math.min(100, client.trustScore + 5);
        updateClient(client.id, {
          trustScore: newTrustScore,
          lastPaymentDate: new Date(),
          totalPaid: client.totalPaid + invoice.total,
          totalOwed: client.totalOwed - invoice.total,
        });
      }
    }
  }, [invoices, clients, updateClient]);

  const getInvoiceById = useCallback((invoiceId: string) => {
    return invoices.find(invoice => invoice.id === invoiceId);
  }, [invoices]);

  const refreshDashboard = useCallback(() => {
    // Dashboard data is automatically recalculated via useMemo
    // This function is kept for API compatibility but doesn't need to do anything
  }, []);

  const value: AppContextType = {
    clients,
    invoices,
    dashboardData,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    getInvoiceById,
    refreshDashboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
