import React from 'react';
import { useSeasonal } from '../context/SeasonalContext';
import { SnowCanvas } from './SnowCanvas';
import { ChristmasBanner } from './ChristmasBanner';
import { SeasonalFloatingWidget } from './SeasonalFloatingWidget';

export interface SeasonalOverlayProps {
  /** Permitir ocultar el banner superior si la vista actual no lo requiere */
  hideBanner?: boolean;
  /** Permitir ocultar el botón flotante si se prefiere una interfaz limpia */
  hideFloatingWidget?: boolean;
}

export const SeasonalOverlay: React.FC<SeasonalOverlayProps> = ({
  hideBanner = false,
  hideFloatingWidget = false
}) => {
  const { config, toggleSnow, toggleBanner, dismissBanner } = useSeasonal();

  if (!config.enabled || config.holiday === 'none') {
    return null;
  }

  return (
    <>
      {/* 1. Nieve animada en toda la pantalla (pointer-events: none) */}
      {config.showSnow && <SnowCanvas flakeCount={50} />}

      {/* 2. Banner de saludo festivo superior (opcional y descartable) */}
      {!hideBanner && config.showBanner && (
        <ChristmasBanner
          message={config.bannerMessage}
          subMessage={config.bannerSubMessage}
          isSnowActive={config.showSnow}
          onToggleSnow={toggleSnow}
          onClose={dismissBanner}
        />
      )}

      {/* 3. Botón flotante para alternar nieve y restaurar banner en cualquier momento */}
      {!hideFloatingWidget && (
        <SeasonalFloatingWidget
          isSnowActive={config.showSnow}
          isBannerActive={config.showBanner}
          onToggleSnow={toggleSnow}
          onToggleBanner={toggleBanner}
        />
      )}
    </>
  );
};
