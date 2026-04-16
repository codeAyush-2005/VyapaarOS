import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LoadingState, ErrorBoundary } from './components/ui';
import { AppProvider } from './context/AppContext';
import './index.css';

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <AppProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingState message="Loading page..." />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </Layout>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;