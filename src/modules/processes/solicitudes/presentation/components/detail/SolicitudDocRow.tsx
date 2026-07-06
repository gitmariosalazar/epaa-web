import React from 'react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';
import { getDocEstadoUI } from '@/shared/presentation/utils/colors/docs.colors';
import { DocumentIcon } from '@/shared/presentation/utils/icons/CustomIcons';
import { Upload, Clock } from 'lucide-react';

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
  uploadingDocId?: string | null;
  onFileReplace?: (docId: string, file: File, documentTypeId: number) => void;
}

export const SolicitudDocRow: React.FC<SolicitudDocRowProps> = ({
  doc,
  onClick,
  uploadingDocId,
  onFileReplace
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
      <div className="sol-detail-doc-row__badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
        <ColorChip
          color={docUI.color}
          label={doc.estadoValidacion}
          variant="soft"
          size="xs"
          icon={<StateIcon size={12} />}
        />
        {onFileReplace && (doc.estadoValidacion.toUpperCase() === 'RECHAZADO' || doc.estadoValidacion.toUpperCase() === 'INVALIDO') && (
          <>
            <button
              type="button"
              className="sol-detail-doc-row__upload-btn"
              disabled={uploadingDocId === doc.id}
              onClick={(e) => {
                e.stopPropagation();
                const input = document.getElementById(`file-input-admin-${doc.id}`);
                if (input) input.click();
              }}
            >
              {uploadingDocId === doc.id ? (
                <Clock size={10} className="sol-detail-loading__spinner" />
              ) : (
                <Upload size={10} />
              )}
              {uploadingDocId === doc.id ? 'Subiendo...' : 'Subir Corrección'}
            </button>
            <input
              type="file"
              id={`file-input-admin-${doc.id}`}
              style={{ display: 'none' }}
              accept=".pdf,image/*"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onFileReplace) {
                  onFileReplace(doc.id, file, Number(doc.tipodocumento));
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
