import { useState, useEffect, useRef } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const promptRef = useRef(null);
  
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return /iphone|ipad|ipod/.test(userAgent) || isIPad;
  });

  const [isStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return ('standalone' in window.navigator && window.navigator.standalone) ||
      window.matchMedia('(display-mode: standalone)').matches;
  });

  // Check localStorage and standalone mode to remember installation state across reloads
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // If they are currently using the PWA, it's definitely installed
    if (('standalone' in window.navigator && window.navigator.standalone) ||
        window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    // Otherwise, check if we remember installing it
    return localStorage.getItem('pwa_installed') === 'true';
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt fired — app is installable');
      promptRef.current = e;
      setDeferredPrompt(e);
      // If this event fires, the browser confirms the app is NOT installed
      setIsInstalled(false);
      setIsInstalling(false);
      localStorage.setItem('pwa_installed', 'false'); // Reset just in case they uninstalled
    };

    const handleAppInstalled = () => {
      console.log('[PWA] appinstalled fired — app is NOW installed');
      setIsInstalled(true);
      setIsInstalling(false);
      setDeferredPrompt(null);
      promptRef.current = null;
      localStorage.setItem('pwa_installed', 'true'); // Remember for next reload
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    const prompt = promptRef.current;
    if (!prompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      setIsInstalling(true);
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`[PWA] User response: ${outcome}`);

      if (outcome === 'dismissed') {
        // User cancelled — reset so they can try again
        setIsInstalling(false);
        return false;
      }

      // outcome === 'accepted' means user tapped Install.
      // Do NOT set isInstalled here — wait for the appinstalled event.
      // The installing state will show a spinner until appinstalled fires.
      // Safety timeout: if appinstalled never fires within 15s, reset
      setTimeout(() => {
        setIsInstalling((current) => {
          if (current) {
            console.log('[PWA] Install timeout — resetting state');
            return false;
          }
          return current;
        });
      }, 15000);

      return true;
    } catch (err) {
      console.error('[PWA] Install error:', err);
      setIsInstalling(false);
      return false;
    } finally {
      // Prompt can only be used once
      promptRef.current = null;
      setDeferredPrompt(null);
    }
  };

  return { deferredPrompt, isStandalone, isInstalled, isInstalling, isIOS, installApp };
};
