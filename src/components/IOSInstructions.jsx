import { Share, PlusSquare } from 'lucide-react';

export const IOSInstructions = () => {
  return (
    <div className="ios-instruction delay-3">
      <p style={{ fontWeight: 600, color: 'white' }}>Instalar en iOS</p>
      <div className="ios-step">
        <div className="icon-box">
          <Share size={16} />
        </div>
        <span>Pulsa el botón <strong>Compartir</strong> de abajo</span>
      </div>
      <div className="ios-step">
        <div className="icon-box">
          <PlusSquare size={16} />
        </div>
        <span>Selecciona <strong>Añadir a la pantalla de inicio</strong></span>
      </div>
    </div>
  );
};
