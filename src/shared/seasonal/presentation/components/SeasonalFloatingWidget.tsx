import React from 'react';
import { Snowflake, Bell } from 'lucide-react';
import '../styles/Seasonal.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export interface SeasonalFloatingWidgetProps {
  isSnowActive: boolean;
  isBannerActive: boolean;
  onToggleSnow: () => void;
  onToggleBanner: () => void;
}

export const SeasonalFloatingWidget: React.FC<SeasonalFloatingWidgetProps> = ({
  isSnowActive,
  isBannerActive,
  onToggleSnow,
  onToggleBanner
}) => {
  return (
    <aside
      className="seasonal-floating-widget"
      aria-label="Controles de ambientación festiva"
    >
      {/* Si el banner superior de Feliz Navidad está oculto, permite reabrirlo con 1 clic */}
      {!isBannerActive && (
        <Tooltip
          content="Volver a mostrar el saludo festivo de Feliz Navidad"
          followCursor={false}
          themeColor="amber"
          position="right"
        >
          <button
            type="button"
            className="seasonal-floating-restore-pill"
            onClick={() => onToggleBanner()}
          >
            <Bell size={20} className="seasonal-bell-pulse" />
          </button>
        </Tooltip>
      )}

      {/* Botón para alternar la nieve animada */}
      <Tooltip
        content={
          isSnowActive ? 'Desactivar nieve festiva' : 'Activar nieve festiva'
        }
        followCursor={false}
        themeColor="amber"
        position="right"
      >
        <button
          type="button"
          className={`seasonal-floating-btn ${!isSnowActive ? 'snow-disabled' : ''}`}
          onClick={() => onToggleSnow()}
          aria-label="Alternar nieve festiva"
        >
          <Snowflake size={20} className="seasonal-snowflake-icon" />
        </button>
      </Tooltip>
    </aside>
  );
};
