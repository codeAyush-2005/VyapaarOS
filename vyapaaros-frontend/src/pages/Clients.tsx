import React, { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ClientList, Button } from '../components/ui';
import AddClientForm from '../components/ui/AddClientForm';
import type { Client } from '../types';
import { useApp } from '../context/AppContext';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient } = useApp();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    document.title = 'Clients - VyapaarOS';
  }, []);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleClientSelect = useCallback((client: Client) => {
    console.log('Selected client:', client);
    // TODO: Open client detail modal or navigate to client detail page
  }, []);

  const handleClientEdit = useCallback((client: Client) => {
    setEditingClient(client);
  }, []);

  const handleAddClient = useCallback((clientData: Omit<Client, 'id' | 'createdDate' | 'trustScore' | 'segment' | 'totalInvoiced' | 'totalPaid' | 'totalOwed' | 'invoiceCount'>) => {
    addClient(clientData);
    setIsAddFormOpen(false);
  }, [addClient]);

  const handleEditClient = useCallback((clientData: Omit<Client, 'id' | 'createdDate' | 'trustScore' | 'segment' | 'totalInvoiced' | 'totalPaid' | 'totalOwed' | 'invoiceCount'>) => {
    if (!editingClient) return;
    updateClient(editingClient.id, clientData);
    setEditingClient(null);
  }, [editingClient, updateClient]);

  const handleCloseForm = useCallback(() => {
    setIsAddFormOpen(false);
    setEditingClient(null);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Clients</h1>
            <p className="text-text-secondary">Manage your client relationships and trust scores</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <ClientList 
        clients={clients}
        onClientSelect={handleClientSelect}
        onClientEdit={handleClientEdit}
      />

      {/* Add Client Form */}
      <AddClientForm
        isOpen={isAddFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddClient}
        mode="add"
      />

      {/* Edit Client Form */}
      <AddClientForm
        isOpen={!!editingClient}
        onClose={handleCloseForm}
        onSubmit={handleEditClient}
        initialData={editingClient || undefined}
        mode="edit"
      />
    </div>
  );
};

export default Clients;