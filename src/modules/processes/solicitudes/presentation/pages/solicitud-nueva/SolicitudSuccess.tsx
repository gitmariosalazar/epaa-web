import React from 'react';
import { Check } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';

interface SolicitudSuccessProps {
  tramite?: Tramite | null;
  docsSubidos: number;
  createdSolicitudId: string | null;
  onGoToTramites: () => void;
  onCreateAnother: () => void;
}

export const SolicitudSuccess: React.FC<SolicitudSuccessProps> = ({
  tramite,
  docsSubidos,
  createdSolicitudId,
  onGoToTramites,
  onCreateAnother
}) => {
  const solNum = createdSolicitudId
    ? `SOL-${createdSolicitudId.slice(0, 8).toUpperCase()}`
    : `SOL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  return (
    <PageLayout
      header={
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>
          Nueva Solicitud
        </h2>
      }
    >
      <div className="solicitud-success">
        <div className="solicitud-success__icon">
          <Check size={48} />
        </div>
        <h2>¡Solicitud Enviada!</h2>
        <p>
          Tu solicitud de <strong>{tramite?.nombre}</strong> ha sido registrada con&nbsp;
          <strong>
            {docsSubidos} documento{docsSubidos !== 1 ? 's' : ''}
          </strong>{' '}
          adjuntos.
        </p>
        <div className="solicitud-success__info">
          <strong>Número de Solicitud:</strong> {solNum}
        </div>
        {createdSolicitudId && (
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem'
            }}
          >
            ID de Seguimiento: <code style={{ color: 'var(--accent)' }}>{createdSolicitudId}</code>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button variant="outline" onClick={onGoToTramites}>
            Ver Trámites
          </Button>
          <Button variant="primary" onClick={onCreateAnother}>
            Nueva Solicitud
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};
