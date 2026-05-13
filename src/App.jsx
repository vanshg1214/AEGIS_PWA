import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePWAInstall } from './hooks/usePWAInstall';
import { InstallBanner } from './components/InstallBanner';
import { IOSInstructions } from './components/IOSInstructions';
import { Download, Check, Loader } from 'lucide-react';
import './index.css';

function App() {
  const navigate = useNavigate();
  const { deferredPrompt, isStandalone, isInstalled, isInstalling, isIOS, installApp } = usePWAInstall();
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
    // Don't do anything if already installed or currently installing
    if (isInstalled || isInstalling) return;

    if (deferredPrompt) {
      const result = await installApp();
      if (result) {
        setShowInstallBanner(false);
        navigate('/form');
      }
    } else if (isIOS) {
      const contactInfo = document.querySelector('.ios-instruction');
      if (contactInfo) {
        contactInfo.scrollIntoView({ behavior: 'smooth' });
      }
      alert("Tu navegador no soporta la instalación automática. Por favor, usa el menú de tu navegador y pulsa 'Añadir a la pantalla de inicio' o 'Instalar aplicación'.");
    }
  };

  useEffect(() => {
    // Only redirect if opened in standalone mode (user opened the installed PWA)
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

  // If opened as installed PWA, just show loader and redirect
  if (isStandalone) {
    return (
      <div className={`loader-wrapper active`}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Determine button state
  const getButtonContent = () => {
    if (isInstalled) {
      return { icon: <Check size={20} />, text: 'Descargada', className: 'btn btn-success', disabled: true };
    }
    if (isInstalling) {
      return { icon: <Loader size={20} className="spin-icon" />, text: 'Instalando...', className: 'btn btn-installing', disabled: true };
    }
    return { icon: <Download size={20} />, text: 'Descargar App', className: 'btn btn-primary', disabled: false };
  };

  const buttonState = getButtonContent();

  return (
    <>
      <div className={`loader-wrapper ${isRedirecting ? 'active' : ''}`}>
        <div className="spinner"></div>
      </div>

      <div className="container animate-fade-in">
        <div className="logo-wrapper delay-1">
          <img src="/icons/aegis-logo.jpg" alt="AEGIS Logo" className="logo-img" />
        </div>
        
        <h1 className="title delay-2">AEGIS</h1>
        <p className="subtitle delay-3">
          Descarga la aplicación para acceder al instante desde tu pantalla de inicio.
        </p>

        <div className="button-group delay-3">
          <button 
            className={buttonState.className} 
            onClick={handleInstallAction}
            disabled={buttonState.disabled}
          >
            {buttonState.icon}
            {buttonState.text}
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
