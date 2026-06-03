import React from 'react';
import { AlertCircle, CheckCircle, UploadCloud } from 'lucide-react';
import { DocumentUploadCard } from '../DocumentUploadCard';
import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';

interface DocumentsStepProps {
  tramite: Tramite;
  documentos: DocumentosMap;
  onAttach: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  tramite,
  documentos,
  onAttach,
  onRemove
}) => {
  const obligatorios = tramite.requisitos.filter((r) => r.obligatorio);
  const uploaded = Object.keys(documentos).length;
  const total = obligatorios.length;
  const progress = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  const allReady = uploaded >= total;

  return (
    <div className="solicitud-form-section solicitud-docs-step">
      <div className="solicitud-form-section__header">
        <UploadCloud size={20} />
        <h3>Carga de Documentos — {tramite.nombre}</h3>
      </div>

      <p className="solicitud-docs-step__subtitle">
        Adjunta cada documento de forma independiente. Los documentos de terceros
        (Municipio, Registro de la Propiedad) deben obtenerse previamente.
      </p>

      <div className="doc-upload-progress">
        <div className="doc-upload-progress__bar-track">
          <div
            className="doc-upload-progress__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="doc-upload-progress__meta">
          <span>
            <strong style={{ color: allReady ? 'var(--success)' : 'var(--text-main)' }}>
              {uploaded}
            </strong>
            &nbsp;de <strong>{total}</strong> documentos obligatorios adjuntados
          </span>
          {allReady && (
            <span
              style={{
                color: 'var(--success)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <CheckCircle size={14} /> Listo para continuar
            </span>
          )}
        </div>
      </div>

      <div className="doc-upload-grid">
        {tramite.requisitos.map((req, i) => (
          <DocumentUploadCard
            key={req.id}
            requisito={req}
            index={i}
            adjunto={documentos[req.id]}
            onAttach={onAttach}
            onRemove={onRemove}
          />
        ))}
      </div>

      {!allReady && (
        <div className="solicitud-docs-step__warning">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          Faltan {total - uploaded} documento{total - uploaded !== 1 ? 's' : ''}{' '}
          obligatorio{total - uploaded !== 1 ? 's' : ''}. Debe adjuntar todos los documentos obligatorios para continuar.
        </div>
      )}
    </div>
  );
};
