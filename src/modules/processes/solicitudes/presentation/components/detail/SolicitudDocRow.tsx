import React from 'react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';
import { getDocEstadoUI } from '@/shared/presentation/utils/colors/docs.colors';
import { DocumentIcon } from '@/shared/presentation/utils/icons/CustomIcons';

const TIPO_DOC_LABEL: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano del Predio',
  3: 'Escritura Pública',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal',
  6: 'Certificado de No Adeudar',
  7: 'RUC / Nombramiento'
};

interface SolicitudDocRowProps {
  doc: DocumentoAdjuntoResponse;
  onClick: () => void;
}

export const SolicitudDocRow: React.FC<SolicitudDocRowProps> = ({
  doc,
  onClick
}) => {
  const docUI = getDocEstadoUI(doc.estadoValidacion);
  const docLabel =
    TIPO_DOC_LABEL[Number(doc.tipodocumento)] ??
    `Documento ${doc.tipodocumento}`;
  const StateIcon = docUI.icon;

  return (
    <div
      className="sol-detail-doc-row sol-detail-doc-row--interactive"
      onClick={onClick}
      title="Haz clic para abrir el visor en este documento"
    >
      <div className="sol-detail-doc-row__icon">
        <DocumentIcon fileName={doc.url} size={16} />
      </div>
      <div className="sol-detail-doc-row__info">
        <h4 className="sol-detail-doc-row__label">{docLabel}</h4>
        <span className="sol-detail-doc-row__filename">
          {doc.url.split('/').pop()}
        </span>
        {doc.observacion && (
          <ColorChip
            color={docUI.color}
            label={`Obs: ${doc.observacion}`}
            variant="soft"
            borderRadius={3}
            size="xs"
            icon={<StateIcon size={12} />}
          />
        )}
      </div>
      <div className="sol-detail-doc-row__badge">
        <ColorChip
          color={docUI.color}
          label={doc.estadoValidacion}
          variant="soft"
          size="xs"
          icon={<StateIcon size={12} />}
        />
      </div>
    </div>
  );
};
