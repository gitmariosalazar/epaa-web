import React, { useState, useEffect } from 'react';
import { Check, Info, AlertTriangle, XCircle, X, Bell } from 'lucide-react';
import './Alert.css';

export type AlertType = 'success' | 'info' | 'warning' | 'error' | 'gray';

export interface AlertProps {
  /** El tipo de alerta que determina el color y el icono (success, info, warning, error) */
  type: AlertType;
  /** El título de la alerta (se muestra en negrita) */
  title?: string;
  /** El mensaje principal de la alerta */
  message: string;
  /** Clase CSS adicional opcional */
  className?: string;
  /** Si la alerta puede ser cerrada por el usuario */
  dismissible?: boolean;
  /** Callback opcional que se ejecuta al cerrar la alerta */
  onClose?: () => void;
}

const icons = {
  success: <Check className="epaa-alert-icon" />,
  info: <Info className="epaa-alert-icon" />,
  warning: <AlertTriangle className="epaa-alert-icon" />,
  error: <XCircle className="epaa-alert-icon" />,
  gray: <Bell className="epaa-alert-icon" />
};

export const Alert: React.FC<AlertProps> = ({
  type = 'gray',
  title,
  message,
  className = '',
  dismissible = true,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Efecto para volver a mostrar la alerta si su contenido o tipo cambian (ej. nueva consulta)
  useEffect(() => {
    setIsVisible(true);
  }, [message, title, type]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`epaa-alert-container epaa-alert-${type} ${className}`} role="alert">
      <div className="epaa-alert-content-wrapper">
        <div className="epaa-alert-icon-wrapper">
          {icons[type]}
        </div>
        <div className="epaa-alert-text-wrapper">
          {title && <span className="epaa-alert-title">{title}</span>}
          <span className="epaa-alert-message">{message}</span>
        </div>
      </div>
      {dismissible && (
        <button 
          className="epaa-alert-close-btn" 
          onClick={handleClose} 
          aria-label="Cerrar alerta"
          type="button"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
