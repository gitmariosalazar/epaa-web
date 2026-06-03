/**
 * SolicitudDetailPage — Enterprise Portal
 *
 * Clean Architecture:
 *   Presentation layer only. No business logic here.
 *   All actions are delegated to Use Cases via modals.
 *
 * SOLID:
 *   SRP: page orchestrates panels/modals, not business rules.
 *   OCP: new phases → new modal, no changes needed here beyond adding modal state.
 *   DIP: all data flows through use cases (interfaces), not direct repo calls.
 *
 * Covered BPMN phases for the analyst/operator:
 *   Fase 3  — Validar documentos      (existing: SolicitudDocumentPreviewModal)
 *   Fase 4  — Crear factura inspección (existing: CreateInspectionInvoiceModal)
 *   Fase 5  — Confirmar pago           (existing: inline form)
 *   Fase 6  — Emitir OT inspección     (NEW: EmitInspectionOrderModal)
 *   Fase 7  — Iniciar inspección        (NEW: inline quick-action)
 *   Fase 8  — Subir informe técnico     (NEW: SubmitInspectionReportModal)
 *   Fase 9  — Aprobar/rechazar informe  (NEW: ApproveInspectionReportModal)
 *   Fase 10 — Generar contrato          (NEW: GenerateContractModal)
 *   Fase 11 — Firmar contrato           (NEW: SignContractModal)
 *   Fase 12 — Emitir OT instalación     (NEW: EmitInstallationOrderModal)
 *   Fase 13 — Iniciar instalación       (NEW: inline quick-action)
 *   Fase 14 — Registro catastral        (NEW: RegisterCadastralModal)
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { GetRequestDetailByRequestIdOrNumberUseCase } from '../../application/usecases/GetRequestDetailByRequestIdOrNumberUseCase';
import { GetTrackingBySolicitudIdUseCase } from '../../application/usecases/GetTrackingBySolicitudIdUseCase';
import { ConfirmPaymentUseCase } from '../../application/usecases/ConfirmPaymentUseCase';
import { StartInspectionUseCase } from '../../application/usecases/StartInspectionUseCase';
import { StartInstallationUseCase } from '../../application/usecases/StartInstallationUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';

// ── Domain Models ─────────────────────────────────────────────────────────────
import type { RequestDetailByClientResponse, TrackingSolicitudResponse } from '../../domain/models/Solicitud';

// ── Existing Modals ───────────────────────────────────────────────────────────
import { SolicitudDocumentPreviewModal } from '../components/SolicitudDocumentPreviewModal';
import { CreateInspectionInvoiceModal } from '../components/CreateInspectionInvoiceModal';
import { PaymentReceiptPreviewModal } from '../components/PaymentReceiptPreviewModal';

// ── New Phase Modals ──────────────────────────────────────────────────────────
import { EmitInspectionOrderModal } from '../components/EmitInspectionOrderModal';
import { SubmitInspectionReportModal } from '../components/SubmitInspectionReportModal';
import { ApproveInspectionReportModal } from '../components/ApproveInspectionReportModal';
import { GenerateContractModal } from '../components/GenerateContractModal';
import { SignContractModal } from '../components/SignContractModal';
import { EmitInstallationOrderModal } from '../components/EmitInstallationOrderModal';
import { RegisterCadastralModal } from '../components/RegisterCadastralModal';

// ── Config & Helpers ──────────────────────────────────────────────────────────
import {
  getEstadoConfig,
  TIPO_ACOMETIDA_LABELS,
  TIPO_PERSONA_LABELS,
  USO_PREDIO_LABELS
} from '../components/SolicitudConfig';

// ── Shared Components ─────────────────────────────────────────────────────────
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useAuth } from '@/shared/presentation/context/AuthContext';

// ── Icons ─────────────────────────────────────────────────────────────────────
import {
  ArrowLeft, User, MapPin, FileText, Navigation, Info, Home, Building,
  Mail, Phone, Clock, CheckCircle, XCircle, FileCheck, CreditCard, Gauge,
  ClipboardList, MessageSquare, AlertTriangle, FolderOpen, Activity,
  ExternalLink, Search, Wrench, FileSignature, ShieldCheck, Zap, Play,
  BarChart2, DollarSign
} from 'lucide-react';
import './SolicitudDetailPage.css';

// ─── Doc state helpers ─────────────────────────────────────────────────────────
const DOC_ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  PENDIENTE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  APROBADO:  { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  RECHAZADO: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  }
};

const TIPO_DOC_LABEL: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano del Predio',
  3: 'Escritura Pública',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal',
  6: 'Certificado de No Adeudar',
  7: 'RUC / Nombramiento'
};

// ─── Phase Action Button ───────────────────────────────────────────────────────
interface ActionBtnProps {
  color: string;
  bg: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const PhaseActionBtn: React.FC<ActionBtnProps> = ({ color, bg, icon, label, onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="sol-phase-action-btn"
    style={{ '--phase-color': color, '--phase-bg': bg } as React.CSSProperties}
  >
    <span className="sol-phase-action-btn__icon">
      {loading ? <Clock size={18} className="sol-detail-loading__spinner" /> : icon}
    </span>
    <span className="sol-phase-action-btn__label">{loading ? 'Procesando...' : label}</span>
  </button>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const SolicitudDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Data state ─────────────────────────────────────────────────────────────
  const [solicitud, setSolicitud] = useState<RequestDetailByClientResponse | null>(null);
  const [matchedTracking, setMatchedTracking] = useState<TrackingSolicitudResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [docsOpen, setDocsOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [emitInspectionOpen, setEmitInspectionOpen] = useState(false);
  const [submitReportOpen, setSubmitReportOpen] = useState(false);
  const [approveReportOpen, setApproveReportOpen] = useState(false);
  const [generateContractOpen, setGenerateContractOpen] = useState(false);
  const [signContractOpen, setSignContractOpen] = useState(false);
  const [emitInstallationOpen, setEmitInstallationOpen] = useState(false);
  const [registerCadastralOpen, setRegisterCadastralOpen] = useState(false);

  // ── Payment confirm state ──────────────────────────────────────────────────
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('TRANSFERENCIA');
  const [paymentReference, setPaymentReference] = useState('');

  // ── Quick-action loading state (for inline start buttons) ──────────────────
  const [isStartingInspection, setIsStartingInspection] = useState(false);
  const [isStartingInstallation, setIsStartingInstallation] = useState(false);

  // ── Use cases (memoized) ───────────────────────────────────────────────────
  const repo = React.useMemo(() => new SolicitudRepositoryImpl(), []);
  const requestDetailUseCase = React.useMemo(() => new GetRequestDetailByRequestIdOrNumberUseCase(repo), [repo]);
  const trackingUseCase      = React.useMemo(() => new GetTrackingBySolicitudIdUseCase(repo), [repo]);
  const confirmPaymentUseCase  = React.useMemo(() => new ConfirmPaymentUseCase(repo), [repo]);
  const startInspectionUseCase = React.useMemo(() => new StartInspectionUseCase(repo), [repo]);
  const startInstallUseCase    = React.useMemo(() => new StartInstallationUseCase(repo), [repo]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const reload = () => setReloadTrigger(p => p + 1);

  // ── Load data ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [sol, trk] = await Promise.all([
          requestDetailUseCase.execute(id),
          trackingUseCase.execute(id)
        ]);
        if (isMounted) { setSolicitud(sol); setMatchedTracking(trk); }
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Error al cargar el expediente.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id, requestDetailUseCase, trackingUseCase, reloadTrigger]);

  // ── Confirm payment ────────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!solicitud?.facturaId) { MessageToastCustom('error', 'Error', 'ID de factura no encontrado.'); return; }
    if (!paymentReference.trim()) { MessageToastCustom('error', 'Requerido', 'Ingrese la referencia de pago.'); return; }
    if (!user?.userId) { MessageToastCustom('error', 'Sesión', 'Inicie sesión nuevamente.'); return; }
    setIsConfirmingPayment(true);
    try {
      await confirmPaymentUseCase.execute({
        invoiceId: solicitud.facturaId,
        paymentMethod,
        paymentReference: paymentReference.trim(),
        proofOfPaymentUrl: solicitud.urlComprobante || undefined,
        collectorId: user.userId
      });
      MessageToastCustom('success', 'Pago Confirmado', 'El pago fue registrado exitosamente.');
      setPaymentReference('');
      reload();
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'Error al confirmar el pago.');
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // ── Start inspection (Fase 7) ─────────────────────────────────────────────
  const handleStartInspection = async () => {
    const workOrderId = (solicitud as any)?.workOrderId || '';
    if (!workOrderId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID de la orden de trabajo en este expediente.');
      return;
    }
    if (!user?.userId) { MessageToastCustom('error', 'Sesión', 'Inicie sesión nuevamente.'); return; }
    setIsStartingInspection(true);
    try {
      await startInspectionUseCase.execute({ workOrderId, technicianId: user.userId });
      MessageToastCustom('success', 'Inspección Iniciada', 'El estado cambió a INSPECCION_EN_PROCESO.');
      reload();
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'No se pudo iniciar la inspección.');
    } finally {
      setIsStartingInspection(false);
    }
  };

  // ── Start installation (Fase 13) ──────────────────────────────────────────
  const handleStartInstallation = async () => {
    const workOrderId = (solicitud as any)?.workOrderId || '';
    if (!workOrderId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID de la OT de instalación.');
      return;
    }
    if (!user?.userId) { MessageToastCustom('error', 'Sesión', 'Inicie sesión nuevamente.'); return; }
    setIsStartingInstallation(true);
    try {
      await startInstallUseCase.execute({ workOrderId, technicianId: user.userId });
      MessageToastCustom('success', 'Instalación Iniciada', 'El estado cambió a INSTALACION_EN_PROCESO.');
      reload();
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'No se pudo iniciar la instalación.');
    } finally {
      setIsStartingInstallation(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (isLoading) return (
    <PageLayout>
      <div className="sol-detail-loading">
        <Clock className="sol-detail-loading__spinner" size={24} />
        <span>Cargando expediente...</span>
      </div>
    </PageLayout>
  );

  if (error || !solicitud) return (
    <PageLayout>
      <div className="sol-detail-error">
        <AlertTriangle size={48} style={{ color: 'var(--error)', opacity: 0.8 }} />
        <h3>Expediente no encontrado</h3>
        <p>{error || 'No se pudo localizar la solicitud.'}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>Volver Atrás</Button>
      </div>
    </PageLayout>
  );

  // ── Derived data ───────────────────────────────────────────────────────────
  const statusConfig = getEstadoConfig(solicitud.estado);
  const tipoLabel  = TIPO_ACOMETIDA_LABELS[solicitud.tipoAcometida] ?? solicitud.tipoAcometida;
  const personaLabel = TIPO_PERSONA_LABELS[solicitud.tipoPersona] ?? solicitud.tipoPersona;
  const usoLabel = USO_PREDIO_LABELS[solicitud.usoPredio] ?? solicitud.usoPredio;
  const isJuridica = solicitud.tipoPersona === 'JURIDICA';
  const fechaStr = solicitud.fechaSolicitud
    ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
  const updatedStr = solicitud.updatedAt
    ? new Date(solicitud.updatedAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
  const titular = isJuridica
    ? (solicitud.company?.businessName || solicitud.datosAdicionales?.nombres || solicitud.clienteId)
    : (solicitud.person ? `${solicitud.person.firstName} ${solicitud.person.lastName}`
        : (solicitud.datosAdicionales?.nombres && solicitud.datosAdicionales?.apellidos
            ? `${solicitud.datosAdicionales.nombres} ${solicitud.datosAdicionales.apellidos}`
            : solicitud.clienteId));
  const identificationVal = isJuridica
    ? (solicitud.company?.ruc || solicitud.clienteId)
    : (solicitud.person?.personId || solicitud.clienteId);
  const emailVal = isJuridica
    ? (solicitud.company?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || '')
    : (solicitud.person?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || '');
  const phoneVal = isJuridica
    ? (solicitud.company?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || '')
    : (solicitud.person?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || '');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageLayout
      header={
        <div className="sol-detail-header-nav">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Volver
          </Button>
          <div className="sol-detail-header-nav__info">
            <h2 className="sol-detail-header-nav__title">Expediente: {solicitud.solicitudNumero}</h2>
            <span className="sol-detail-header-nav__subtitle">Creado el {fechaStr}</span>
          </div>
        </div>
      }
    >
      <div className="sol-detail-container">
        {/* ══ COLUMNA IZQUIERDA ══ */}
        <div className="sol-detail-main-col">

          {/* Card 1: Estado Hero + Acciones primarias */}
          <Card className="sol-detail-card sol-detail-card--hero">
            <div className="sol-detail-card__header-accent" style={{ background: statusConfig.color }} />
            <div className="sol-detail-card__body sol-detail-card__body--hero">
              <div className="sol-detail-hero-status">
                <div className="sol-detail-hero-status__badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                  {['aprobada', 'completada', 'DOCS_APPROVED', 'PAGO_CONFIRMADO', 'INFORME_APROBADO',
                    'CONTRATO_FIRMADO', 'INSTALACION_COMPLETADA', 'SUMINISTRO_ACTIVO'].includes(solicitud.estado)
                    ? <CheckCircle size={24} />
                    : ['rechazada', 'RECHAZADA_TECNICA', 'ANULADA'].includes(solicitud.estado)
                      ? <XCircle size={24} />
                      : <Clock size={24} />}
                </div>
                <div>
                  <div className="sol-detail-hero-status__label">Estado Actual</div>
                  <h3 className="sol-detail-hero-status__value" style={{ color: statusConfig.color }}>
                    {statusConfig.label}
                  </h3>
                </div>
              </div>

              <div className="sol-detail-hero-stats">
                <div className="sol-detail-hero-stat">
                  <span className="sol-detail-hero-stat__label">Días en Proceso</span>
                  <span className="sol-detail-hero-stat__value">{solicitud.diasEnProceso ?? 0}</span>
                </div>
                <div className="sol-detail-hero-stat">
                  <span className="sol-detail-hero-stat__label">Tipo Trámite</span>
                  <span className="sol-detail-hero-stat__value">{tipoLabel}</span>
                </div>
                <div className="sol-detail-hero-stat">
                  <span className="sol-detail-hero-stat__label">Última Actualización</span>
                  <span className="sol-detail-hero-stat__value" style={{ fontSize: '0.8rem' }}>{updatedStr}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ══ ACCIONES POR FASE ══ */}
          <div className="sol-detail-phase-actions">

            {/* Fase 4: Generar factura de inspección */}
            {solicitud.estado === 'DOCS_APPROVED' && (
              <PhaseActionBtn
                color="#3b82f6" bg="rgba(59,130,246,0.1)"
                icon={<CreditCard size={18} />}
                label="Generar Factura de Inspección"
                onClick={() => setInvoiceModalOpen(true)}
              />
            )}

            {/* Fase 5: Confirmar pago */}
            {solicitud.estado === 'PAGO_PENDIENTE' && (
              <div className="sol-detail-payment-confirm-card">
                <div className="sol-detail-payment-confirm-card__header">
                  <CreditCard size={20} className="sol-detail-payment-confirm-card__header-icon" />
                  <div>
                    <h3 className="sol-detail-payment-confirm-card__title">Validación de Pago de Inspección</h3>
                    <p className="sol-detail-payment-confirm-card__subtitle">
                      Revise el comprobante y confirme los detalles del depósito o transferencia del cliente.
                    </p>
                  </div>
                </div>
                <div className="sol-detail-payment-confirm-card__body">
                  <div className="sol-detail-payment-confirm-grid">
                    <div className="sol-detail-payment-confirm-info">
                      <h4 className="sol-detail-payment-confirm-section-title">Detalles de Facturación</h4>
                      <div className="sol-detail-payment-confirm-details">
                        <div className="sol-detail-payment-confirm-item">
                          <span className="sol-detail-payment-confirm-item__label">N° Factura</span>
                          <span className="sol-detail-payment-confirm-item__value">{solicitud.numeroFactura || '—'}</span>
                        </div>
                        <div className="sol-detail-payment-confirm-item">
                          <span className="sol-detail-payment-confirm-item__label">Monto a Validar</span>
                          <span className="sol-detail-payment-confirm-item__value">
                            ${solicitud.montofactura ? solicitud.montofactura.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        {solicitud.urlComprobante ? (
                          <div className="sol-detail-payment-confirm-item sol-detail-payment-confirm-item--full" style={{ marginTop: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => setReceiptModalOpen(true)}
                              className="sol-detail-view-receipt-link"
                              style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--accent)', width: '100%', justifyContent: 'center', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.18s' }}
                            >
                              <FileText size={16} /> Ver Comprobante de Pago <ExternalLink size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="sol-detail-payment-confirm-item sol-detail-payment-confirm-item--full" style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                            <span>El cliente aún no ha subido una captura del comprobante.</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sol-detail-payment-confirm-form">
                      <h4 className="sol-detail-payment-confirm-section-title">Registro de Confirmación</h4>
                      <div className="sol-detail-payment-confirm-fields">
                        <div className="sol-detail-payment-confirm-field">
                          <label className="sol-detail-payment-confirm-field__label">Método de Pago</label>
                          <select className="sol-detail-payment-confirm-field__select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                            <option value="VENTANILLA">Depósito en Ventanilla</option>
                            <option value="ONLINE">Pago en Línea</option>
                          </select>
                        </div>
                        <div className="sol-detail-payment-confirm-field">
                          <label className="sol-detail-payment-confirm-field__label">Referencia / N° Transacción</label>
                          <input
                            type="text"
                            className="sol-detail-payment-confirm-field__input"
                            placeholder="Ej: DEP-109283"
                            value={paymentReference}
                            onChange={e => setPaymentReference(e.target.value)}
                          />
                        </div>
                        <Button
                          variant="primary"
                          style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                          disabled={isConfirmingPayment}
                          onClick={handleConfirmPayment}
                          leftIcon={isConfirmingPayment ? <Clock size={16} className="sol-detail-loading__spinner" /> : <CheckCircle size={16} />}
                        >
                          {isConfirmingPayment ? 'Registrando...' : 'Confirmar y Registrar Pago'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fase 6: Emitir OT de inspección */}
            {solicitud.estado === 'PAGO_CONFIRMADO' && (
              <PhaseActionBtn
                color="#6366f1" bg="rgba(99,102,241,0.1)"
                icon={<Search size={18} />}
                label="Emitir Orden de Inspección Técnica"
                onClick={() => setEmitInspectionOpen(true)}
              />
            )}

            {/* Fase 7: Iniciar inspección */}
            {solicitud.estado === 'ORDEN_INSPECCION_EMITIDA' && (
              <PhaseActionBtn
                color="#8b5cf6" bg="rgba(139,92,246,0.1)"
                icon={<Play size={18} />}
                label="Iniciar Inspección Técnica"
                onClick={handleStartInspection}
                loading={isStartingInspection}
              />
            )}

            {/* Fase 8: Subir informe técnico */}
            {solicitud.estado === 'INSPECCION_EN_PROCESO' && (
              <PhaseActionBtn
                color="#a855f7" bg="rgba(168,85,247,0.1)"
                icon={<FileText size={18} />}
                label="Enviar Informe Técnico de Campo"
                onClick={() => setSubmitReportOpen(true)}
              />
            )}

            {/* Fase 9: Aprobar / rechazar informe */}
            {solicitud.estado === 'INFORME_EN_REVISION' && (
              <PhaseActionBtn
                color="#06b6d4" bg="rgba(6,182,212,0.1)"
                icon={<ShieldCheck size={18} />}
                label="Emitir Dictamen — Aprobar o Rechazar Informe"
                onClick={() => setApproveReportOpen(true)}
              />
            )}

            {/* Fase 10: Generar contrato */}
            {solicitud.estado === 'INFORME_APROBADO' && (
              <PhaseActionBtn
                color="#ec4899" bg="rgba(236,72,153,0.1)"
                icon={<FileSignature size={18} />}
                label="Generar Contrato de Servicio"
                onClick={() => setGenerateContractOpen(true)}
              />
            )}

            {/* Fase 11: Firmar contrato */}
            {(solicitud.estado === 'CONTRATO_GENERADO') && solicitud.contratoId && (
              <PhaseActionBtn
                color="#10b981" bg="rgba(16,185,129,0.1)"
                icon={<FileCheck size={18} />}
                label="Registrar Firma del Contrato"
                onClick={() => setSignContractOpen(true)}
              />
            )}

            {/* Fase 12: Emitir OT de instalación */}
            {solicitud.estado === 'CONTRATO_FIRMADO' && (
              <PhaseActionBtn
                color="#f97316" bg="rgba(249,115,22,0.1)"
                icon={<Wrench size={18} />}
                label="Emitir Orden de Trabajo — Instalación"
                onClick={() => setEmitInstallationOpen(true)}
              />
            )}

            {/* Fase 13: Iniciar instalación */}
            {solicitud.estado === 'OT_INSTALACION_EMITIDA' && (
              <PhaseActionBtn
                color="#f97316" bg="rgba(249,115,22,0.1)"
                icon={<Play size={18} />}
                label="Iniciar Proceso de Instalación"
                onClick={handleStartInstallation}
                loading={isStartingInstallation}
              />
            )}

            {/* Fase 14: Registro catastral */}
            {(solicitud.estado === 'INSTALACION_COMPLETADA' || solicitud.estado === 'REGISTRO_CATASTRAL_PENDIENTE') && (
              <PhaseActionBtn
                color="#10b981" bg="rgba(16,185,129,0.1)"
                icon={<Zap size={18} />}
                label="Registro Catastral y Activación del Suministro"
                onClick={() => setRegisterCadastralOpen(true)}
              />
            )}
          </div>

          {/* ══ PANEL INFORME (cuando aplica) ══ */}
          {solicitud.informeId && (solicitud.resultadoInforme || solicitud.costoMateriales != null) && (
            <Card className="sol-detail-card">
              <div className="sol-detail-card__title-row">
                <BarChart2 size={16} className="sol-detail-card__title-icon" style={{ color: '#a855f7' }} />
                <h3 className="sol-detail-card__title">Informe Técnico de Inspección</h3>
                <div style={{ marginLeft: 'auto' }}>
                  <ColorChip
                    color={solicitud.informeAprobado ? '#10b981' : solicitud.informeAprobado === false ? '#ef4444' : '#f59e0b'}
                    label={solicitud.informeAprobado ? 'APROBADO' : solicitud.informeAprobado === false ? 'RECHAZADO' : 'EN REVISIÓN'}
                    variant="soft" size="xs"
                  />
                </div>
              </div>
              <div className="sol-detail-grid">
                {solicitud.resultadoInforme && (
                  <div className="sol-detail-item">
                    <span className="sol-detail-item__label"><CheckCircle size={11} style={{ display: 'inline', marginRight: 4 }} /> Resultado</span>
                    <span className="sol-detail-item__value"><strong>{solicitud.resultadoInforme}</strong></span>
                  </div>
                )}
                {solicitud.costoMateriales != null && (
                  <div className="sol-detail-item">
                    <span className="sol-detail-item__label"><DollarSign size={11} style={{ display: 'inline', marginRight: 4 }} /> Materiales</span>
                    <span className="sol-detail-item__value">${solicitud.costoMateriales.toFixed(2)}</span>
                  </div>
                )}
                {solicitud.costoManoObra != null && (
                  <div className="sol-detail-item">
                    <span className="sol-detail-item__label"><DollarSign size={11} style={{ display: 'inline', marginRight: 4 }} /> Mano de Obra</span>
                    <span className="sol-detail-item__value">${solicitud.costoManoObra.toFixed(2)}</span>
                  </div>
                )}
                {solicitud.costoTotal != null && (
                  <div className="sol-detail-item">
                    <span className="sol-detail-item__label">Costo Total Estimado</span>
                    <span className="sol-detail-item__value" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      ${solicitud.costoTotal.toFixed(2)}
                    </span>
                  </div>
                )}
                {solicitud.motivoRechazo && (
                  <div className="sol-detail-item sol-detail-item--full">
                    <span className="sol-detail-item__label" style={{ color: '#ef4444' }}>Motivo de Rechazo</span>
                    <span className="sol-detail-item__value">{solicitud.motivoRechazo}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Card 2: Información General */}
          <Card className="sol-detail-card">
            <div className="sol-detail-card__title-row">
              <User size={18} className="sol-detail-card__title-icon" />
              <h3 className="sol-detail-card__title">Información General</h3>
            </div>
            <div className="sol-detail-grid">
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">Nombre del Titular</span>
                <span className="sol-detail-item__value">{titular}</span>
              </div>
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">Identificación (Cédula / RUC)</span>
                <span className="sol-detail-item__value">{identificationVal}</span>
              </div>
              {emailVal && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> Correo Electrónico</span>
                  <span className="sol-detail-item__value">{emailVal}</span>
                </div>
              )}
              {phoneVal && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> Teléfono</span>
                  <span className="sol-detail-item__value">{phoneVal}</span>
                </div>
              )}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label"><Building size={12} style={{ display: 'inline', marginRight: 4 }} /> Tipo de Persona</span>
                <span className="sol-detail-item__value">{personaLabel}</span>
              </div>
              <div className="sol-detail-item">
                <span className="sol-detail-item__label"><Home size={12} style={{ display: 'inline', marginRight: 4 }} /> Uso del Predio</span>
                <span className="sol-detail-item__value">{usoLabel}</span>
              </div>
              <div className="sol-detail-item sol-detail-item--full">
                <span className="sol-detail-item__label"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> Dirección</span>
                <span className="sol-detail-item__value">{solicitud.direccion}</span>
              </div>
              <div className="sol-detail-item">
                <span className="sol-detail-item__label"><FileText size={12} style={{ display: 'inline', marginRight: 4 }} /> Clave Catastral</span>
                <span className="sol-detail-item__value">{solicitud.claveCatastral ?? '—'}</span>
              </div>
              {solicitud.coordenadas && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label"><Navigation size={12} style={{ display: 'inline', marginRight: 4 }} /> Coordenadas</span>
                  <span className="sol-detail-item__value">{solicitud.coordenadas}</span>
                </div>
              )}
              {solicitud.analistaUsername && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label"><User size={12} style={{ display: 'inline', marginRight: 4 }} /> Analista Asignado</span>
                  <span className="sol-detail-item__value">{solicitud.analistaUsername}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Card 3: Documentos */}
          <Card className="sol-detail-card">
            <div className="sol-detail-card__title-row">
              <ClipboardList size={18} className="sol-detail-card__title-icon" />
              <h3 className="sol-detail-card__title">Requisitos y Documentos Adjuntos</h3>
              {solicitud.documentos?.length > 0 && (
                <Button variant="outline" size="compact" leftIcon={<FolderOpen size={14} />}
                  onClick={() => setDocsOpen(true)} style={{ marginLeft: 'auto' }}>
                  Visor Completo
                </Button>
              )}
            </div>
            {solicitud.documentos?.length === 0 ? (
              <div className="sol-detail-no-docs">
                <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No se encontraron documentos registrados para esta solicitud.</p>
              </div>
            ) : (
              <div className="sol-detail-docs-list">
                {solicitud.documentos.map(doc => {
                  const docState = DOC_ESTADO_COLOR[doc.estadoValidacion] ?? DOC_ESTADO_COLOR['PENDIENTE'];
                  const docLabel = TIPO_DOC_LABEL[Number(doc.tipodocumento)] ?? `Documento ${doc.tipodocumento}`;
                  return (
                    <div key={doc.id} className="sol-detail-doc-row">
                      <div className="sol-detail-doc-row__icon"><FileText size={16} /></div>
                      <div className="sol-detail-doc-row__info">
                        <h4 className="sol-detail-doc-row__label">{docLabel}</h4>
                        <span className="sol-detail-doc-row__filename">{doc.url.split('/').pop()}</span>
                        {doc.observacion && (
                          <p className="sol-detail-doc-row__feedback">
                            <span style={{ fontWeight: 600 }}>Obs:</span> {doc.observacion}
                          </p>
                        )}
                      </div>
                      <div className="sol-detail-doc-row__badge">
                        <ColorChip color={docState.color} label={doc.estadoValidacion} variant="soft" size="xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ══ COLUMNA DERECHA ══ */}
        <div className="sol-detail-sidebar-col">

          {/* Métricas del servicio */}
          {(solicitud.numeroFactura || solicitud.numeroContrato || solicitud.numeroMedidor) && (
            <Card className="sol-detail-card sol-detail-card--metrics">
              <div className="sol-detail-card__title-row">
                <Info size={16} className="sol-detail-card__title-icon" />
                <h3 className="sol-detail-card__title" style={{ fontSize: '0.875rem' }}>Detalles del Servicio</h3>
              </div>
              <div className="sol-detail-metrics-list">
                {solicitud.numeroFactura && (
                  <div className="sol-detail-metric-item">
                    <div className="sol-detail-metric-item__icon" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>
                      <CreditCard size={15} />
                    </div>
                    <div className="sol-detail-metric-item__body">
                      <span className="sol-detail-metric-item__label">Inspección & Pago</span>
                      <span className="sol-detail-metric-item__value">Factura: {solicitud.numeroFactura}</span>
                      {solicitud.montofactura && (
                        <span className="sol-detail-metric-item__meta">
                          Monto: ${solicitud.montofactura.toFixed(2)} ({solicitud.estadoPago ?? 'Pendiente'})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {solicitud.numeroContrato && (
                  <div className="sol-detail-metric-item">
                    <div className="sol-detail-metric-item__icon" style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.1)' }}>
                      <FileCheck size={15} />
                    </div>
                    <div className="sol-detail-metric-item__body">
                      <span className="sol-detail-metric-item__label">Contrato Registrado</span>
                      <span className="sol-detail-metric-item__value">Contrato N°: {solicitud.numeroContrato}</span>
                      {solicitud.estadoFirma && (
                        <span className="sol-detail-metric-item__meta">Firma: {solicitud.estadoFirma}</span>
                      )}
                      {solicitud.valorTotal != null && (
                        <span className="sol-detail-metric-item__meta">
                          Valor: ${solicitud.valorTotal.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {(solicitud.numeroCuenta || solicitud.numeroMedidor) && (
                  <div className="sol-detail-metric-item">
                    <div className="sol-detail-metric-item__icon" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                      <Gauge size={15} />
                    </div>
                    <div className="sol-detail-metric-item__body">
                      <span className="sol-detail-metric-item__label">Medidor e Instalación</span>
                      {solicitud.numeroMedidor && <span className="sol-detail-metric-item__value">Medidor N°: {solicitud.numeroMedidor}</span>}
                      {solicitud.numeroCuenta && <span className="sol-detail-metric-item__meta">Cuenta N°: {solicitud.numeroCuenta}</span>}
                      {solicitud.fechaActivacion && (
                        <span className="sol-detail-metric-item__meta">
                          Activo: {new Date(solicitud.fechaActivacion).toLocaleDateString('es-EC')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="sol-detail-card sol-detail-card--timeline">
            <div className="sol-detail-card__title-row">
              <Activity size={16} className="sol-detail-card__title-icon" />
              <h3 className="sol-detail-card__title" style={{ fontSize: '0.875rem' }}>Línea de Tiempo</h3>
            </div>
            {!matchedTracking || matchedTracking.historial?.length === 0 ? (
              <div className="sol-detail-no-timeline">
                <Clock size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
                <p>No se registran movimientos de seguimiento.</p>
              </div>
            ) : (
              <div className="sol-detail-timeline">
                {matchedTracking.historial.map((entry, idx) => (
                  <div key={idx} className="sol-detail-timeline-node">
                    <div className="sol-detail-timeline-node__line" />
                    <div className="sol-detail-timeline-node__dot" />
                    <div className="sol-detail-timeline-node__content">
                      <span className="sol-detail-timeline-node__date">
                        {new Date(entry.fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <h4 className="sol-detail-timeline-node__title">{entry.estadoLabel}</h4>
                      {entry.comentario && (
                        <div className="sol-detail-timeline-node__comment">
                          <MessageSquare size={10} style={{ marginRight: 4, flexShrink: 0, marginTop: 2 }} />
                          <p>{entry.comentario}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ══ MODALES ══ */}

      {/* Visor documentos */}
      {docsOpen && (
        <SolicitudDocumentPreviewModal
          isOpen={docsOpen}
          onClose={() => setDocsOpen(false)}
          documentos={solicitud.documentos}
          solicitudNumero={solicitud.solicitudNumero}
          solicitudId={solicitud.solicitudId}
          onValidationSuccess={reload}
        />
      )}

      {/* Crear factura inspección */}
      {invoiceModalOpen && (
        <CreateInspectionInvoiceModal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          onSuccess={reload}
        />
      )}

      {/* Ver comprobante */}
      <PaymentReceiptPreviewModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptUrl={solicitud.urlComprobante}
        facturaLabel={solicitud.numeroFactura ? `Factura ${solicitud.numeroFactura}` : solicitud.solicitudNumero}
      />

      {/* Fase 6: Emitir OT Inspección */}
      {emitInspectionOpen && (
        <EmitInspectionOrderModal
          isOpen={emitInspectionOpen}
          onClose={() => setEmitInspectionOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          emitterId={user?.userId ?? ''}
          onSuccess={reload}
        />
      )}

      {/* Fase 8: Subir informe */}
      {submitReportOpen && (
        <SubmitInspectionReportModal
          isOpen={submitReportOpen}
          onClose={() => setSubmitReportOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          workOrderId={(solicitud as any)?.workOrderId ?? ''}
          technicianId={user?.userId ?? ''}
          onSuccess={reload}
        />
      )}

      {/* Fase 9: Aprobar informe */}
      {approveReportOpen && (
        <ApproveInspectionReportModal
          isOpen={approveReportOpen}
          onClose={() => setApproveReportOpen(false)}
          reportId={solicitud.informeId ?? ''}
          solicitudNumero={solicitud.solicitudNumero}
          approverId={user?.userId ?? ''}
          onSuccess={reload}
        />
      )}

      {/* Fase 10: Generar contrato */}
      {generateContractOpen && (
        <GenerateContractModal
          isOpen={generateContractOpen}
          onClose={() => setGenerateContractOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          generatorId={user?.userId ?? ''}
          defaultMaterialCost={solicitud.costoMateriales ?? undefined}
          defaultLaborCost={solicitud.costoManoObra ?? undefined}
          onSuccess={reload}
        />
      )}

      {/* Fase 11: Firmar contrato */}
      {signContractOpen && solicitud.contratoId && (
        <SignContractModal
          isOpen={signContractOpen}
          onClose={() => setSignContractOpen(false)}
          contractId={solicitud.contratoId}
          solicitudNumero={solicitud.solicitudNumero}
          userId={user?.userId ?? ''}
          onSuccess={reload}
        />
      )}

      {/* Fase 12: Emitir OT Instalación */}
      {emitInstallationOpen && (
        <EmitInstallationOrderModal
          isOpen={emitInstallationOpen}
          onClose={() => setEmitInstallationOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          emitterId={user?.userId ?? ''}
          onSuccess={reload}
        />
      )}

      {/* Fase 14: Registro catastral */}
      {registerCadastralOpen && (
        <RegisterCadastralModal
          isOpen={registerCadastralOpen}
          onClose={() => setRegisterCadastralOpen(false)}
          solicitudId={solicitud.solicitudId}
          solicitudNumero={solicitud.solicitudNumero}
          contractId={solicitud.contratoId ?? undefined}
          registratorId={user?.userId ?? ''}
          defaultCadastralKey={solicitud.claveCatastral ?? undefined}
          defaultAddress={solicitud.direccion}
          onSuccess={reload}
        />
      )}
    </PageLayout>
  );
};
