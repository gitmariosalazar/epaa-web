/**
 * SolicitudDocumentPreviewModal
 *
 * SRP: handles document preview display and document validation UI.
 *      All blob/preview/download concerns are delegated to dedicated hooks.
 * DIP: consumes ValidateDocumentsUseCase and document hooks via abstraction,
 *      never depends on concrete repositories directly.
 */
import React, { useState, useMemo, useEffect } from 'react';
import type { DocumentoAdjuntoResponse } from '../../domain/models/Solicitud';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { ValidateDocumentsUseCase } from '../../application/usecases/ValidateDocumentsUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { useDocumentPreview } from '@/modules/documents/presentation/hooks/useDocumentPreview';
import { useDocumentDownload } from '@/modules/documents/presentation/hooks/useDocumentDownload';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Loader2,
  Save
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';

// ─── Module-level constants ────────────────────────────────────────────────────

const TIPO_DOC_LABELS: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano del Predio',
  3: 'Escritura Pública',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal',
  6: 'Certificado de No Adeudar',
  7: 'RUC / Nombramiento'
};

const ESTADO_VALIDACION_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDIENTE: {
    label: 'Pendiente',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    icon: <Clock size={12} />
  },
  APROBADO: {
    label: 'Aprobado',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    icon: <CheckCircle size={12} />
  },
  RECHAZADO: {
    label: 'Rechazado',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    icon: <AlertCircle size={12} />
  }
};

const QUICK_OBSERVATIONS = [
  'Documento ilegible o borroso',
  'Documento incompleto (faltan páginas)',
  'Fecha de vigencia expirada',
  'Faltan firmas requeridas',
  'Los datos no coinciden con el titular',
  'Tipo de documento incorrecto'
];

/** Maps a DB validation status to the local UI decision value. */
function mapDbStatusToDecision(
  dbStatus: string
): 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' {
  const upper = (dbStatus || '').toUpperCase();
  if (upper === 'VALIDO' || upper === 'APROBADO') return 'APROBADO';
  if (upper === 'INVALIDO' || upper === 'RECHAZADO') return 'RECHAZADO';
  return 'PENDIENTE';
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DecisionEntry {
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observation: string;
}

interface SolicitudDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentos: DocumentoAdjuntoResponse[];
  solicitudNumero: string;
  solicitudId: string;
  onValidationSuccess?: () => void;
  initialActiveId?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const SolicitudDocumentPreviewModal: React.FC<
  SolicitudDocumentPreviewModalProps
> = ({
  isOpen,
  onClose,
  documentos,
  solicitudNumero,
  solicitudId,
  onValidationSuccess,
  initialActiveId
}) => {
    const { user } = useAuth();
    const [activeIdx, setActiveIdx] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // ── Active document ──────────────────────────────────────────────────────────

    // Sync active document when modal opens with a pre-selected document
    useEffect(() => {
      if (isOpen && initialActiveId) {
        const idx = documentos.findIndex((d) => d.id === initialActiveId);
        if (idx !== -1) setActiveIdx(idx);
      }
    }, [isOpen, initialActiveId, documentos]);

    const doc = documentos[activeIdx] ?? null;

    // ── Document preview & download (delegated to dedicated hooks) ───────────────

    const {
      blobUrl: previewBlobUrl,
      mimeType: previewMimeType,
      loading: loadingPreview,
      error: previewError
    } = useDocumentPreview(doc?.id, doc?.url);

    const { download, isDownloading } = useDocumentDownload();

    const isPdf = previewMimeType === 'application/pdf';
    const isImage = previewMimeType?.startsWith('image/') ?? false;

    const tipoLabel =
      TIPO_DOC_LABELS[Number(doc?.tipodocumento)] ??
      `Documento tipo ${doc?.tipodocumento}`;

    const handleDownload = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!doc) return;
      const filename = TIPO_DOC_LABELS[Number(doc.tipodocumento)] ?? `Documento-${doc.id}`;
      download(doc.id, doc.url, filename);
    };

    // ── Validation decisions (local state, analyst-only) ─────────────────────────

    const [localDecisions, setLocalDecisions] = useState<Record<string, DecisionEntry>>(
      () => {
        const initial: Record<string, DecisionEntry> = {};
        documentos.forEach((d) => {
          initial[d.id] = {
            status: mapDbStatusToDecision(d.estadoValidacion),
            observation: d.observacion || ''
          };
        });
        return initial;
      }
    );

    const isAnalyst = useMemo(() => {
      return (
        user?.roles?.some((role) => {
          const roleName = typeof role === 'string' ? role : role.name;
          const upper = roleName.toUpperCase();
          return upper === 'ADMINISTRADOR COMERCIAL' || upper === 'SUPER ADMINISTRADOR' || upper === 'INSPECTOR MICRO MEDICION';
        }) ?? false
      );
    }, [user]);

    const hasChanges = useMemo(() => {
      return documentos.some((d) => {
        const dec = localDecisions[d.id];
        if (!dec) return false;
        const expected = mapDbStatusToDecision(d.estadoValidacion);
        return dec.status !== expected || dec.observation !== (d.observacion || '');
      });
    }, [documentos, localDecisions]);

    const hasErrors = useMemo(() => {
      return Object.values(localDecisions).some(
        (dec) => dec.status === 'RECHAZADO' && !dec.observation.trim()
      );
    }, [localDecisions]);

    const hasPending = useMemo(() => {
      return Object.values(localDecisions).some((dec) => dec.status === 'PENDIENTE');
    }, [localDecisions]);

    const validateUseCase = useMemo(
      () => new ValidateDocumentsUseCase(new SolicitudRepositoryImpl()),
      []
    );

    // ── Decision handlers ─────────────────────────────────────────────────────────

    const handleStatusChange = (status: 'APROBADO' | 'RECHAZADO') => {
      if (!doc) return;
      setLocalDecisions((prev) => ({
        ...prev,
        [doc.id]: { ...prev[doc.id], status }
      }));
    };

    const handleObservationChange = (observation: string) => {
      if (!doc) return;
      setLocalDecisions((prev) => ({
        ...prev,
        [doc.id]: { ...prev[doc.id], observation }
      }));
    };

    const handleQuickObs = (text: string) => {
      if (!doc) return;
      setLocalDecisions((prev) => ({
        ...prev,
        [doc.id]: { ...prev[doc.id], observation: text }
      }));
    };

    const handleSaveValidation = async () => {
      if (!hasChanges || hasErrors || hasPending || isSaving || !user?.userId) return;

      setIsSaving(true);
      try {
        const payloadDecisions = Object.entries(localDecisions).map(([id, dec]) => ({
          documentId: id,
          validationStatus: dec.status as 'APROBADO' | 'RECHAZADO',
          observation: dec.observation.trim() || undefined
        }));

        await validateUseCase.execute(solicitudId, payloadDecisions, user.userId);

        MessageToastCustom(
          'success',
          'Éxito',
          'La validación de documentos ha sido guardada correctamente.'
        );

        onValidationSuccess?.();
        onClose();
      } catch (err) {
        const error = err as Error;
        console.error('[SolicitudDocumentPreviewModal] Error saving validation:', error);
        MessageToastCustom(
          'error',
          'Error',
          error.message || 'No se pudo guardar la validación de los documentos.'
        );
      } finally {
        setIsSaving(false);
      }
    };

    // ── Early exit ────────────────────────────────────────────────────────────────

    if (!isOpen || documentos.length === 0 || !doc) return null;

    // ── Derived values for current document ───────────────────────────────────────

    const activeDecision: DecisionEntry = localDecisions[doc.id] ?? {
      status: 'PENDIENTE',
      observation: ''
    };

    // ── Render ────────────────────────────────────────────────────────────────────

    return (
      <div
        className="doc-modal__overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={`Documentos de ${solicitudNumero}`}
      >
        <div className="doc-modal__panel">
          {/* ── Header ── */}
          <div className="doc-modal__header">
            <div className="doc-modal__header-left">
              <FileText size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <span className="doc-modal__title">Documentos adjuntos</span>
                <span className="doc-modal__subtitle">{solicitudNumero}</span>
              </div>
            </div>
            <button
              className="doc-modal__close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="doc-modal__body">
            {/* ── Sidebar: document list ── */}
            <div className="doc-modal__sidebar">
              <p className="doc-modal__sidebar-title">
                {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
              </p>
              {documentos.map((d, idx) => {
                const label =
                  TIPO_DOC_LABELS[Number(d.tipodocumento)] ?? `Doc. ${idx + 1}`;
                const localDec = localDecisions[d.id] ?? {
                  status: d.estadoValidacion,
                  observation: d.observacion || ''
                };
                const ev =
                  ESTADO_VALIDACION_CONFIG[localDec.status] ??
                  ESTADO_VALIDACION_CONFIG['PENDIENTE'];
                const isEdited =
                  localDec.status !== d.estadoValidacion ||
                  localDec.observation !== (d.observacion || '');

                return (
                  <button
                    key={d.id}
                    className={`doc-modal__doc-item${idx === activeIdx ? ' doc-modal__doc-item--active' : ''}`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: '0.4rem',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          minWidth: 0,
                          flex: 1
                        }}
                      >
                        <FileText size={15} style={{ flexShrink: 0 }} />
                        <span className="doc-modal__doc-name">{label}</span>
                      </div>
                      {isEdited && (
                        <span
                          className="doc-modal__edited-dot"
                          title="Cambios sin guardar"
                        />
                      )}
                    </div>
                    <span
                      className="doc-modal__doc-estado"
                      style={{ color: ev.color, background: ev.bg }}
                    >
                      {ev.icon} {ev.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Preview area ── */}
            <div className="doc-modal__preview">
              {/* Metadata bar */}
              <div className="doc-modal__meta-bar">
                <span className="doc-modal__meta-tipo">{tipoLabel}</span>

                <span
                  className="doc-modal__meta-estado"
                  style={{
                    color: (
                      ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                      ESTADO_VALIDACION_CONFIG.PENDIENTE
                    ).color,
                    background: (
                      ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                      ESTADO_VALIDACION_CONFIG.PENDIENTE
                    ).bg,
                    border: `1px solid ${(ESTADO_VALIDACION_CONFIG[activeDecision.status] || ESTADO_VALIDACION_CONFIG.PENDIENTE).color}40`
                  }}
                >
                  {(
                    ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                    ESTADO_VALIDACION_CONFIG.PENDIENTE
                  ).icon}{' '}
                  {(
                    ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                    ESTADO_VALIDACION_CONFIG.PENDIENTE
                  ).label}
                </span>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <Button
                    onClick={handleDownload}
                    title="Descargar"
                    disabled={isDownloading}
                    size='xs'
                  >
                    {isDownloading ? (
                      <Loader2
                        size={14}
                        style={{ animation: 'btn-spin 0.8s linear infinite' }}
                      />
                    ) : (
                      <Download size={14} />
                    )}
                    Descargar
                  </Button>
                  {previewBlobUrl && (
                    <Button
                      variant='ghost'
                      color='info'
                      size='xs'
                      title="Abrir en nueva pestaña"
                      onClick={() => window.open(previewBlobUrl, '_blank')}
                    >
                      <ExternalLink size={14} /> Abrir
                    </Button>
                  )}
                </div>

                {activeDecision.observation && (
                  <span className="doc-modal__meta-obs">
                    <AlertCircle size={12} /> {activeDecision.observation}
                  </span>
                )}
              </div>

              {/* PDF / Image / fallback viewer */}
              <div className="doc-modal__viewer">
                {loadingPreview ? (
                  <div
                    className="doc-modal__no-preview"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: '0.5rem'
                    }}
                  >
                    <Loader2
                      size={28}
                      style={{
                        color: 'var(--accent)',
                        animation: 'btn-spin 0.8s linear infinite'
                      }}
                    />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Cargando vista previa...
                    </p>
                  </div>
                ) : previewBlobUrl ? (
                  isPdf ? (
                    <iframe
                      key={previewBlobUrl}
                      src={`${previewBlobUrl}#toolbar=1&navpanes=0`}
                      title={tipoLabel}
                      className="doc-modal__iframe"
                    />
                  ) : isImage ? (
                    <div
                      className="doc-modal__no-preview"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: '1rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <img
                        src={previewBlobUrl}
                        alt={tipoLabel}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '4px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="doc-modal__no-preview">
                      <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                      <p>Vista previa no disponible para este tipo de archivo.</p>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Descarga el archivo para visualizarlo.
                      </small>
                    </div>
                  )
                ) : previewError ? (
                  <div className="doc-modal__no-preview">
                    <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                    <p>No se pudo cargar la vista previa.</p>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {previewError}
                    </small>
                  </div>
                ) : (
                  <div className="doc-modal__no-preview">
                    <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                    <p>Vista previa no disponible para este documento.</p>
                  </div>
                )}
              </div>

              {/* Navigation arrows if multiple docs */}
              {documentos.length > 1 && (
                <div className="doc-modal__nav">
                  <button
                    className="doc-modal__nav-btn"
                    disabled={activeIdx === 0}
                    onClick={() => setActiveIdx((i) => i - 1)}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="doc-modal__nav-info">
                    {activeIdx + 1} / {documentos.length}
                  </span>
                  <button
                    className="doc-modal__nav-btn"
                    disabled={activeIdx === documentos.length - 1}
                    onClick={() => setActiveIdx((i) => i + 1)}
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* ── Validation Panel (Analysts only) ── */}
            {isAnalyst && (
              <div className="doc-modal__validation-panel">
                <div className="doc-validation__header">
                  <h4 className="doc-validation__title">
                    Validación de Documento
                  </h4>
                  <p className="doc-validation__subtitle">{tipoLabel}</p>
                </div>

                <div className="doc-validation__form">
                  <label className="doc-validation__label">
                    Decisión de Validación
                  </label>
                  <div className="doc-validation__buttons">
                    <button
                      type="button"
                      className={`doc-validation__btn doc-validation__btn--approve${activeDecision.status === 'APROBADO' ? ' active' : ''}`}
                      onClick={() => handleStatusChange('APROBADO')}
                    >
                      <CheckCircle size={15} />
                      <span>Aprobar</span>
                    </button>
                    <button
                      type="button"
                      className={`doc-validation__btn doc-validation__btn--reject${activeDecision.status === 'RECHAZADO' ? ' active' : ''}`}
                      onClick={() => handleStatusChange('RECHAZADO')}
                    >
                      <XCircle size={15} />
                      <span>Rechazar</span>
                    </button>
                  </div>

                  <div className="doc-validation__observation-section">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <label className="doc-validation__label">
                        Observación{' '}
                        {activeDecision.status === 'RECHAZADO' && (
                          <span className="doc-validation__required-star">*</span>
                        )}
                      </label>
                      <span className="doc-validation__char-count">
                        {activeDecision.observation.length} / 300
                      </span>
                    </div>
                    <textarea
                      className="doc-validation__textarea"
                      value={activeDecision.observation}
                      onChange={(e) => handleObservationChange(e.target.value)}
                      placeholder={
                        activeDecision.status === 'RECHAZADO'
                          ? 'Explique claramente el motivo del rechazo (obligatorio)...'
                          : 'Añada una observación opcional...'
                      }
                      maxLength={300}
                    />

                    {/* Quick observation templates */}
                    <div className="doc-validation__quick-obs">
                      <span className="doc-validation__quick-obs-title">
                        Plantillas rápidas:
                      </span>
                      <div className="doc-validation__quick-obs-tags">
                        {QUICK_OBSERVATIONS.map((obsText) => (
                          <button
                            key={obsText}
                            type="button"
                            className="doc-validation__quick-tag"
                            onClick={() => handleQuickObs(obsText)}
                          >
                            {obsText}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Footer: Save and summary */}
                <div className="doc-validation__footer">
                  <div className="doc-validation__summary">
                    {hasChanges ? (
                      <span className="doc-validation__summary-text">
                        Tiene cambios pendientes por guardar.
                      </span>
                    ) : (
                      <span className="doc-validation__summary-text doc-validation__summary-text--empty">
                        No hay cambios sin guardar.
                      </span>
                    )}
                    {hasErrors && (
                      <span className="doc-validation__error-text">
                        * Ingrese observación para los documentos rechazados.
                      </span>
                    )}
                    {hasPending && (
                      <span className="doc-validation__error-text">
                        * Debe validar todos los documentos.
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    disabled={!hasChanges || hasErrors || hasPending || isSaving}
                    onClick={handleSaveValidation}
                    leftIcon={<Save size={15} />}
                    variant='dashed'
                    isLoading={isSaving}
                    color='primary'
                    size='sm'
                  >
                    {isSaving ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Loader2 className="doc-validation__spinner" size={15} />
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      <span>Guardar Validación</span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
