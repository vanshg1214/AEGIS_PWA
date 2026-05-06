import { useState, useEffect, useCallback } from 'react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { InstallBanner } from './components/InstallBanner';
import { IOSInstructions } from './components/IOSInstructions';
import { Download, Check } from 'lucide-react';
import './index.css';

function App() {
  const { deferredPrompt, isStandalone, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const targetUrl = 'https://www.aegisltd.co';

  const handleRedirect = useCallback(() => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);
  }, [isRedirecting, targetUrl]);

  const handleInstallAction = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      await installApp();
      setShowInstallBanner(false);
    } else if (isIOS) {
      const contactInfo = document.querySelector('.ios-instruction');
      if (contactInfo) {
        contactInfo.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    // Only redirect if opened in standalone mode
    if (isStandalone) {
      setTimeout(handleRedirect, 0);
    }
  }, [isStandalone, handleRedirect]);

  useEffect(() => {
    if (deferredPrompt && !sessionStorage.getItem('bannerDismissed') && !isInstalled && !isStandalone) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, isInstalled, isStandalone]);

  const dismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('bannerDismissed', 'true');
  };

  if (isStandalone) {
    return (
      <div className={`loader-wrapper active`}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`loader-wrapper ${isRedirecting ? 'active' : ''}`}>
        <div className="spinner"></div>
      </div>

      <div className="container animate-fade-in">
        <div className="logo-wrapper delay-1">
          <img src="/icons/AEGIS-REVISION-1 (1)-photoaidcom-cropped.jpg" alt="AEGIS Logo" className="logo-img" />
        </div>
        
        <h1 className="title delay-2">AEGIS</h1>
        <p className="subtitle delay-3">
          Accede instantáneamente desde tu pantalla de inicio para una experiencia rápida y sin interrupciones.
        </p>

        <div className="button-group delay-3">
          <button 
            className={`btn ${isInstalled ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={handleInstallAction}
            disabled={isInstalled}
          >
            {isInstalled ? <Check size={20} /> : <Download size={20} />}
            {isInstalled ? 'Downloaded' : 'Download App'}
          </button>
        </div>

        {isIOS && !isInstalled && <IOSInstructions />}
      </div>

      <InstallBanner 
        show={showInstallBanner && !isIOS} 
        onInstall={handleInstallAction} 
        onDismiss={dismissBanner} 
      />
    </>
  );
}

export default App;
