/**
 * SolicitudDocumentPreviewModal
 *
 * SRP: handles document preview display and document validation.
 * DIP: consumes ValidateDocumentsUseCase via Dependency Injection.
 */
import React, { useState, useMemo, useEffect } from 'react';
import type { DocumentoAdjuntoResponse } from '../../domain/models/Solicitud';
import { environments } from '@/settings/environments/environments';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { ValidateDocumentsUseCase } from '../../application/usecases/ValidateDocumentsUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
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
  Loader2
} from 'lucide-react';

const API_BASE = (environments.API_URL || '')
  .replace(/\/api$/, '')
  .replace(/\/$/, '');

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

interface SolicitudDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentos: DocumentoAdjuntoResponse[];
  solicitudNumero: string;
  solicitudId: string;
  onValidationSuccess?: () => void;
}

export const SolicitudDocumentPreviewModal: React.FC<
  SolicitudDocumentPreviewModalProps
> = ({
  isOpen,
  onClose,
  documentos,
  solicitudNumero,
  solicitudId,
  onValidationSuccess
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Debug: Imprime el usuario en consola para ver sus roles
  useEffect(() => {
    console.log('DEBUG [User Auth Session]:', user);
  }, [user]);

  // Local state for decisions initialized directly from props
  const [localDecisions, setLocalDecisions] = useState<
    Record<
      string,
      { status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'; observation: string }
    >
  >(() => {
    const initial: Record<
      string,
      { status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'; observation: string }
    > = {};
    documentos.forEach((d) => {
      let mappedStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' = 'PENDIENTE';
      const dbStatus = (d.estadoValidacion || '').toUpperCase();
      if (dbStatus === 'VALIDO' || dbStatus === 'APROBADO') {
        mappedStatus = 'APROBADO';
      } else if (dbStatus === 'INVALIDO' || dbStatus === 'RECHAZADO') {
        mappedStatus = 'RECHAZADO';
      }
      initial[d.id] = {
        status: mappedStatus,
        observation: d.observacion || ''
      };
    });
    return initial;
  });

  // Debug: Imprime el DTO en consola cada vez que cambien las decisiones locales
  useEffect(() => {
    if (!user?.userId) return;
    const payloadDecisions = Object.entries(localDecisions).map(([id, dec]) => ({
      documentId: id,
      validationStatus: dec.status as 'APROBADO' | 'RECHAZADO',
      observation: dec.observation.trim() || undefined
    }));
    console.log('DEBUG [Live Document Validation DTO]:', {
      solicitudId,
      dto: {
        decisions: payloadDecisions,
        validatorId: user.userId
      }
    });
  }, [localDecisions, solicitudId, user]);

  // Determine if logged-in user is an analyst
  const isAnalyst = useMemo(() => {
    return (
      user?.roles?.some((role) => {
        const roleName = typeof role === 'string' ? role : role.name;
        const upper = roleName.toUpperCase();
        return upper === 'ANALISTA' || upper === 'ADMINISTRADOR';
      }) ?? false
    );
  }, [user]);

  // Compare local choices to original document values to check for changes
  const hasChanges = useMemo(() => {
    return documentos.some((d) => {
      const dec = localDecisions[d.id];
      if (!dec) return false;
      let mappedStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' = 'PENDIENTE';
      const dbStatus = (d.estadoValidacion || '').toUpperCase();
      if (dbStatus === 'VALIDO' || dbStatus === 'APROBADO') {
        mappedStatus = 'APROBADO';
      } else if (dbStatus === 'INVALIDO' || dbStatus === 'RECHAZADO') {
        mappedStatus = 'RECHAZADO';
      }
      return (
        dec.status !== mappedStatus ||
        dec.observation !== (d.observacion || '')
      );
    });
  }, [documentos, localDecisions]);

  // Check if a rejected document lacks an observation
  const hasErrors = useMemo(() => {
    return Object.values(localDecisions).some((dec) => {
      return dec.status === 'RECHAZADO' && !dec.observation.trim();
    });
  }, [localDecisions]);

  // Check if any document is still pending validation
  const hasPending = useMemo(() => {
    return Object.values(localDecisions).some((dec) => {
      return dec.status === 'PENDIENTE';
    });
  }, [localDecisions]);

  const validateUseCase = useMemo(
    () => new ValidateDocumentsUseCase(new SolicitudRepositoryImpl()),
    []
  );

  if (!isOpen || documentos.length === 0) return null;

  const doc = documentos[activeIdx];
  if (!doc) return null;

  const docUrl = doc.url.startsWith('http') ? doc.url : `${API_BASE}${doc.url}`;
  const tipoLabel =
    TIPO_DOC_LABELS[Number(doc.tipodocumento)] ??
    `Documento tipo ${doc.tipodocumento}`;
  const isPdf =
    docUrl.toLowerCase().endsWith('.pdf') || docUrl.includes('.pdf');

  // Selected document state
  const activeDecision = localDecisions[doc.id] || {
    status: 'PENDIENTE',
    observation: ''
  };

  const handleStatusChange = (status: 'APROBADO' | 'RECHAZADO') => {
    setLocalDecisions((prev) => ({
      ...prev,
      [doc.id]: {
        ...prev[doc.id],
        status
      }
    }));
  };

  const handleObservationChange = (observation: string) => {
    setLocalDecisions((prev) => ({
      ...prev,
      [doc.id]: {
        ...prev[doc.id],
        observation
      }
    }));
  };

  const handleQuickObs = (text: string) => {
    setLocalDecisions((prev) => ({
      ...prev,
      [doc.id]: {
        ...prev[doc.id],
        observation: text
      }
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

      console.log('DEBUG [Validate Documents DTO Payload]:', {
        solicitudId,
        dto: {
          decisions: payloadDecisions,
          validatorId: user.userId
        }
      });

      await validateUseCase.execute(solicitudId, payloadDecisions, user.userId);

      MessageToastCustom(
        'success',
        'Éxito',
        'La validación de documentos ha sido guardada correctamente.'
      );

      if (onValidationSuccess) {
        onValidationSuccess();
      }
      onClose();
    } catch (err) {
      const error = err as Error;
      console.error('Error saving validation:', error);
      MessageToastCustom(
        'error',
        'Error',
        error.message || 'No se pudo guardar la validación de los documentos.'
      );
    } finally {
      setIsSaving(false);
    }
  };

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
              const localDec = localDecisions[d.id] || {
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

              {/* If user is not analyst or we want to show current status */}
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
                {
                  (
                    ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                    ESTADO_VALIDACION_CONFIG.PENDIENTE
                  ).icon
                }{' '}
                {
                  (
                    ESTADO_VALIDACION_CONFIG[activeDecision.status] ||
                    ESTADO_VALIDACION_CONFIG.PENDIENTE
                  ).label
                }
              </span>

              {activeDecision.observation && (
                <span className="doc-modal__meta-obs">
                  <AlertCircle size={12} /> {activeDecision.observation}
                </span>
              )}

              <div
                style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}
              >
                <a
                  href={docUrl}
                  download
                  className="doc-modal__action-btn"
                  title="Descargar"
                >
                  <Download size={14} /> Descargar
                </a>
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-modal__action-btn"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink size={14} /> Abrir
                </a>
              </div>
            </div>

            {/* PDF / fallback */}
            <div className="doc-modal__viewer">
              {isPdf ? (
                <iframe
                  key={docUrl}
                  src={`${docUrl}#toolbar=1&navpanes=0`}
                  title={tipoLabel}
                  className="doc-modal__iframe"
                />
              ) : (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>Vista previa no disponible para este tipo de archivo.</p>
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-modal__action-btn"
                  >
                    <ExternalLink size={14} /> Ver archivo
                  </a>
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

                <button
                  type="button"
                  className="doc-validation__submit-btn"
                  disabled={!hasChanges || hasErrors || hasPending || isSaving}
                  onClick={handleSaveValidation}
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
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
