import React from 'react';
import { Bell, Snowflake, X } from 'lucide-react';
import '../styles/Seasonal.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export interface ChristmasBannerProps {
  message?: string;
  subMessage?: string;
  showSnowToggle?: boolean;
  isSnowActive?: boolean;
  onToggleSnow?: () => void;
  onClose?: () => void;
}

export const ChristmasBanner: React.FC<ChristmasBannerProps> = ({
  message = '¡Feliz Navidad y un Próspero Año Nuevo les desea EPAA!',
  subMessage = 'Paz, salud y bienestar para ti y toda tu familia',
  showSnowToggle = true,
  isSnowActive = true,
  onToggleSnow,
  onClose
}) => {
  return (
    <aside
      className="seasonal-banner-container"
      role="banner"
      aria-label="Saludo Festivo"
    >
      <div className="seasonal-banner-content">
        <div className="seasonal-banner-left">
          <div className="seasonal-banner-icon-badge" aria-hidden="true">
            <Bell size={16} color="#ffffff" />
          </div>

          <div className="seasonal-banner-text-group">
            <span className="seasonal-banner-title">{message}</span>
            {subMessage && (
              <span className="seasonal-banner-subtitle">· {subMessage}</span>
            )}
          </div>
        </div>

        <div className="seasonal-banner-actions">
          {showSnowToggle && onToggleSnow && (
            <Tooltip
              content={isSnowActive ? 'Pausar nieve' : 'Activar nieve'}
              followCursor={false}
              themeColor="amber"
            >
              <button
                type="button"
                className="seasonal-banner-toggle-btn"
                onClick={() => onToggleSnow()}
                aria-label={isSnowActive ? 'Pausar nieve' : 'Activar nieve'}
              >
                <Snowflake size={13} />
                <span>{isSnowActive ? 'Nieve activa' : 'Activar nieve'}</span>
              </button>
            </Tooltip>
          )}

          {onClose && (
            <Tooltip
              content="Cerrar saludo festivo"
              followCursor={false}
              themeColor="amber"
            >
              <button
                type="button"
                className="seasonal-banner-close-btn"
                onClick={onClose}
                aria-label="Cerrar saludo festivo"
              >
                <X size={15} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
};
