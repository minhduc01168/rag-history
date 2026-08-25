import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Clean up any stale legacy caches to ensure localhost and IP are always 100% in sync
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (!cacheName.includes('v4')) {
        console.log('[Cache] Purging legacy cache on startup:', cacheName);
        caches.delete(cacheName);
      }
    });
  });
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        registration.update();
        if (import.meta.env.DEV) {
          console.log('SW registered:', registration.scope);
        }
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
