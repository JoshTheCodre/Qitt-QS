'use client';

import { useState, useEffect } from 'react';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful');
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    });

    // Handle installed PWA
    window.addEventListener('appinstalled', () => {
      setInstallPrompt(null);
      setIsInstallable(false);
    });
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return false;
    
    const result = await installPrompt.prompt();
    // Reset the installPrompt to null whether user accepted or not
    setInstallPrompt(null);
    setIsInstallable(false);
    return result.outcome === 'accepted';
  };

  return {
    isInstallable,
    triggerInstall
  };
}