import React, { useEffect } from 'react';

const Settings: React.FC = () => {
  useEffect(() => {
    document.title = 'Settings - VyapaarOS';
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Manage your application preferences</p>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Business Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Business Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter your business name"
                defaultValue="My Business"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                defaultValue="business@example.com"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Trust Score Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Butterfly Threshold (High Trust)
              </label>
              <input
                type="number"
                className="input"
                placeholder="80"
                defaultValue="80"
                min="0"
                max="100"
              />
              <p className="text-xs text-text-tertiary mt-1">Clients with scores above this are marked as Butterfly 🦋</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Loyal Threshold (Medium Trust)
              </label>
              <input
                type="number"
                className="input"
                placeholder="60"
                defaultValue="60"
                min="0"
                max="100"
              />
              <p className="text-xs text-text-tertiary mt-1">Clients with scores above this are marked as Loyal ⭐</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Overdue Invoice Alerts</p>
                <p className="text-xs text-text-tertiary">Get notified when invoices become overdue</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-primary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Payment Received</p>
                <p className="text-xs text-text-tertiary">Get notified when payments are received</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-primary" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;