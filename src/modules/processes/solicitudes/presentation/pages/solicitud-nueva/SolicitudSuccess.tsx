import React from 'react';
import { Check, Hash, FileKey, List } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import { CopyableField } from '@/shared/presentation/components/CopyableField/CopyableField';
import '../../styles/SolicitudSuccess.css';
import { VscGitPullRequestNewChanges } from 'react-icons/vsc';

interface SolicitudSuccessProps {
  tramite?: Tramite | null;
  docsSubidos: number;
  createdSolicitudId: string | null;
  onGoToTramites: () => void;
  onCreateAnother: () => void;
  onGoDetail: () => void;
  requestNumber: string | null;
}

export const SolicitudSuccess: React.FC<SolicitudSuccessProps> = ({
  tramite,
  docsSubidos,
  createdSolicitudId,
  onGoToTramites,
  onCreateAnother,
  onGoDetail,
  requestNumber
}) => {


  return (
    <PageLayout className="request-new-page-success">
      <div className="solicitud-success">
        <div className="solicitud-success__icon">
          <Check size={48} />
        </div>
        <h2>¡Solicitud Enviada!</h2>
        <p>
          Tu solicitud para el trámite de una <strong>{tramite?.nombre}</strong> ha sido registrada con&nbsp;
          <strong>
            {docsSubidos} documento{docsSubidos !== 1 ? 's' : ''}
          </strong>{' '}
          adjuntos.
        </p>

        <div className="solicitud-success__codes-container">
          <CopyableField
            value={`${requestNumber}`}
            label="Número de Solicitud"
            labelIcon={<Hash size={14} />}
          />

          {createdSolicitudId && (
            <CopyableField
              value={createdSolicitudId}
              label="ID de Seguimiento (UUID)"
              labelIcon={<FileKey size={14} />}
            />
          )}
        </div>

        <div className="solicitud-success__actions">
          <Button variant="primary" onClick={onGoDetail} leftIcon={<List size={14} />}>
            Ver Detalle
          </Button>
          <Button variant="secondary" onClick={onCreateAnother} leftIcon={<VscGitPullRequestNewChanges size={14} />}>
            Nueva Solicitud
          </Button>
          <Button variant="outline" onClick={onGoToTramites} leftIcon={<List size={14} />}>
            Ir aTrámites
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};
export default SolicitudSuccess;
