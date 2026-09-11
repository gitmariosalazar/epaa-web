import React, { useState } from 'react';
import { useVersionCheck } from '../../hooks/useVersionCheck';
import { Hourglass, RefreshCcw, Rocket, X } from 'lucide-react';
import './VersionChecker.css';
import { Button } from '../Button/Button';
import { Tooltip } from '../common/Tooltip/Tooltip';

export const VersionChecker: React.FC = () => {
  const { hasNewVersion } = useVersionCheck();

  // Estado local para manejar cuando el usuario decide actualizar "Más tarde"
  const [isDismissed, setIsDismissed] = useState(false);

  // Principio de Responsabilidad Única: El componente decide si se renderiza
  // basándose estrictamente en el estado de la versión y del usuario.
  if (!hasNewVersion || isDismissed) {
    return null;
  }

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="update-notification" role="alert" aria-live="assertive">
      <div className="update-icon">
        <Rocket size={22} strokeWidth={2} />
      </div>

      <div className="update-body">
        <h4 className="update-title">Nueva actualización disponible</h4>
        <p className="update-desc">
          Hay cambios recientes en el sistema, por favor recarga la página para aplicarlos.
          Antes de recargar, guarda tus cambios pendientes y pulsa recargar para sincronizar la última versión.
        </p>

        <div className="update-actions">
          <Button
            onClick={handleUpdate}
            variant="dashed"
            size="xs"
            color="success"
            leftIcon={<RefreshCcw size={12} />}
          >
            Recargar ahora
          </Button>
          <Button
            onClick={handleDismiss}
            size="xs"
            color="amber"
            variant="dashed"
            leftIcon={<Hourglass size={12} />}
          >
            Más tarde
          </Button>
        </div>
      </div>

      <Tooltip content="Descartar por ahora" followCursor={false}>
        <Button
          onClick={handleDismiss}
          iconOnly
          size='xs'
          color='red'
          variant='dashed'
          circle
          leftIcon={
            <X size={18} />
          }
        />
      </Tooltip>
    </div>
  );
};
