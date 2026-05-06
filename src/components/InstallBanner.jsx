import { Download, ArrowRight } from 'lucide-react';

export const InstallBanner = ({ show, onInstall, onDismiss }) => {
  return (
    <div className={`install-banner ${show ? 'visible' : ''}`}>
      <div className="banner-content">
        <span className="banner-title">Añadir AEGIS</span>
        <span className="banner-subtitle">Instalar para un mejor rendimiento</span>
      </div>
      <div className="banner-actions">
        <button className="btn-small ghost" onClick={onDismiss}>Omitir</button>
        <button className="btn-small primary" onClick={onInstall}>Instalar</button>
      </div>
    </div>
  );
};
