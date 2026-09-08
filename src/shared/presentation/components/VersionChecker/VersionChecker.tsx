import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useVersionCheck } from '../../hooks/useVersionCheck';

export const VersionChecker: React.FC = () => {
  const { hasNewVersion } = useVersionCheck();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (hasNewVersion && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.info(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong>¡Nueva versión disponible!</strong>
          <span style={{ fontSize: '0.85rem' }}>
            Hemos actualizado la plataforma. Haz clic aquí para recargar y aplicar los cambios.
          </span>
        </div>,
        {
          position: 'top-center',
          autoClose: false, // Make it persistent until clicked
          closeOnClick: true,
          draggable: false,
          theme: 'colored',
          icon: <span>🚀</span>,
          onClick: () => window.location.reload()
        }
      );
    }
  }, [hasNewVersion]);

  return null; // Component is invisible
};
