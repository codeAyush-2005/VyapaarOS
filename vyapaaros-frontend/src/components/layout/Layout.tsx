import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

const iconMap = {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (route: string) => {
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle keyboard navigation for mobile menu
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-primary">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-white">VyapaarOS</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-1 flex-col overflow-y-auto" aria-label="Main navigation">
            <div className="flex-1 space-y-1 px-2 py-4">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = isActiveRoute(item.route);
                
                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                      isActive
                        ? 'bg-primary-active text-white'
                        : 'text-white/80 hover:bg-primary-hover hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-white/20 text-white" aria-label={`${item.badge} notifications`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          role="dialog" 
          aria-modal="true"
          aria-label="Mobile navigation menu"
          onKeyDown={handleMenuKeyDown}
        >
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-primary">
            {/* Mobile menu header */}
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-white">VyapaarOS</h1>
              <button
                onClick={closeMobileMenu}
                className="text-white hover:text-white/80"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Mobile navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4" aria-label="Mobile navigation">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = isActiveRoute(item.route);
                
                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200',
                      isActive
                        ? 'bg-primary-active text-white'
                        : 'text-white/80 hover:bg-primary-hover hover:text-white'
                    )}
                  >
                    <Icon className="mr-4 h-6 w-6 flex-shrink-0" aria-hidden="true" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-white/20 text-white" aria-label={`${item.badge} notifications`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-border lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="border-r border-border px-4 text-text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-text-primary">VyapaarOS</h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1" role="main" id="main-content">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation (for tablets) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-border md:hidden lg:hidden" aria-label="Bottom navigation">
        <div className="flex">
          {NAVIGATION_ITEMS.slice(0, 4).map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = isActiveRoute(item.route);
            
            return (
              <Link
                key={item.id}
                to={item.route}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
                style={{ minHeight: '60px' }} // Touch-friendly
              >
                <Icon className="h-5 w-5 mb-1" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 inline-block h-4 w-4 text-xs rounded-full bg-danger text-white text-center leading-4" aria-label={`${item.badge} notifications`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Add bottom padding on mobile to account for bottom navigation */}
      <div className="h-16 md:hidden lg:hidden" />
    </div>
  );
};

export default Layout;