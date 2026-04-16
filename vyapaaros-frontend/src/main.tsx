import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize Core Web Vitals monitoring in production
if (import.meta.env.PROD) {
  initPerformanceMonitoring((metric) => {
    // In production, you would send these metrics to your analytics service
    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
