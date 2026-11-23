import React from 'react';
import { Bell, Snowflake, Sparkles, X } from 'lucide-react';
import '../styles/Seasonal.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { IoGiftSharp } from 'react-icons/io5';
import { ChristmasTreeIcon } from './ChristmasTree';
import { SnowmanIcon } from './Snowman';

export interface ChristmasBannerProps {
  /** Mensaje principal del saludo navideño (Single Source of Truth si no se pasa prop) */
  message?: string;
  /** Subtítulo o dedicatoria opcional */
  subMessage?: string;
  /** Mostrar u ocultar el botón para alternar la nieve */
  showSnowToggle?: boolean;
  /** Estado actual de la animación de nieve */
  isSnowActive?: boolean;
  /** Callback al presionar el botón de nieve */
  onToggleSnow?: () => void;
  /** Callback al cerrar el saludo festivo */
  onClose?: () => void;
}

export const DEFAULT_CHRISTMAS_BANNER_MESSAGE =
  '¡Feliz Navidad y un Próspero Año Nuevo les desea EPAA-AA!';
export const DEFAULT_CHRISTMAS_BANNER_SUBMESSAGE =
  'Paz, salud y bienestar para ti y toda tu familia';

export const ChristmasBanner: React.FC<ChristmasBannerProps> = ({
  message = DEFAULT_CHRISTMAS_BANNER_MESSAGE,
  subMessage = DEFAULT_CHRISTMAS_BANNER_SUBMESSAGE,
  showSnowToggle = true,
  isSnowActive = true,
  onToggleSnow,
  onClose
}) => {
  const displayMessage = message || DEFAULT_CHRISTMAS_BANNER_MESSAGE;
  const displaySubMessage =
    subMessage !== undefined ? subMessage : DEFAULT_CHRISTMAS_BANNER_SUBMESSAGE;

  return (
    <aside
      className="seasonal-banner-container"
      role="banner"
      aria-label="Saludo Festivo"
    >
      <div className="seasonal-banner-content">
        <div className="seasonal-banner-left">
          <div className="seasonal-banner-icon-badge" aria-hidden="true">
            <SnowmanIcon className="w-8 h-8 text-white" />
          </div>
          <div className="seasonal-banner-icon-badge" aria-hidden="true">
            <Bell size={16} color="#ffffff" />
          </div>
          <div className="seasonal-banner-text-group">
            <span className="seasonal-banner-title">
              <Sparkles
                className="seasonal-text-sparkle"
                size={13}
                aria-hidden="true"
              />
              <span className="seasonal-banner-title-text">{displayMessage}</span>
            </span>
            {displaySubMessage && (
              <span className="seasonal-banner-subtitle">
                <span className="seasonal-banner-bullet" aria-hidden="true">
                  ✦
                </span>
                <span className="seasonal-banner-subtitle-text">
                  {displaySubMessage}
                </span>
              </span>
            )}
          </div>
          <div className="seasonal-banner-icon-badge" aria-hidden="true">
            <IoGiftSharp size={16} color="#ffffff" />
          </div>{' '}
          <div className="seasonal-banner-icon-badge" aria-hidden="true">
            <ChristmasTreeIcon className="w-8 h-8 text-white" />
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
