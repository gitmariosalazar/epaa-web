import React from 'react';
import { ClipboardList, FolderOpen, FileText, Upload } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { SolicitudDocRow } from './SolicitudDocRow';

interface SolicitudDocsCardProps {
  solicitud: RequestDetailByClientResponse;
  setDocsOpen: (open: boolean) => void;
  setSelectedDocId: (id: string) => void;
  onFileReplace?: (docId: string, file: File, documentTypeId: number) => void;
  uploadingDocId?: string | null;
  onBulkCorrectionsClick?: () => void;
}

export const SolicitudDocsCard: React.FC<SolicitudDocsCardProps> = ({
  solicitud,
  setDocsOpen,
  setSelectedDocId,
  onFileReplace,
  uploadingDocId,
  onBulkCorrectionsClick,
}) => {
  const hasDocs = solicitud.documentos?.length > 0;
  const rejectedDocs = solicitud.documentos?.filter(d => d.estadoValidacion === 'RECHAZADO' || d.estadoValidacion === 'INVALIDO') || [];
  const hasRejectedDocs = rejectedDocs.length > 0;

  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <ClipboardList size={18} className="sol-detail-card__title-icon" />
        <h3 className="sol-detail-card__title">
          Requisitos y Documentos Adjuntos
        </h3>
        {hasDocs && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            {hasRejectedDocs && onBulkCorrectionsClick && (
              <Button
                variant="primary"
                size="compact"
                leftIcon={<Upload size={14} />}
                onClick={onBulkCorrectionsClick}
              >
                Subir Correcciones Lote
              </Button>
            )}
            <Button
              variant="outline"
              size="compact"
              leftIcon={<FolderOpen size={14} />}
              onClick={() => setDocsOpen(true)}
            >
              Visor Completo
            </Button>
          </div>
        )}
      </div>
      {!hasDocs ? (
        <div className="sol-detail-no-docs">
          <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No se encontraron documentos registrados para esta solicitud.</p>
        </div>
      ) : (
        <div className="sol-detail-docs-list">
          {solicitud.documentos.map((doc) => (
            <SolicitudDocRow
              key={doc.id}
              doc={doc}
              uploadingDocId={uploadingDocId}
              onFileReplace={onFileReplace}
              onClick={() => {
                setSelectedDocId(doc.id);
                setDocsOpen(true);
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
