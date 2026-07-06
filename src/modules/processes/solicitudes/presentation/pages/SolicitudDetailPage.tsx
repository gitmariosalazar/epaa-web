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

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { GetRequestDetailByRequestIdOrNumberUseCase } from '../../application/usecases/GetRequestDetailByRequestIdOrNumberUseCase';
import { GetTrackingBySolicitudIdUseCase } from '../../application/usecases/GetTrackingBySolicitudIdUseCase';
import { ConfirmPaymentUseCase } from '../../application/usecases/ConfirmPaymentUseCase';
import { RejectPaymentUseCase } from '../../application/usecases/RejectPaymentUseCase';
import { SubmitCorrectionsUseCase } from '../../application/usecases/SubmitCorrectionsUseCase';
import { StartInspectionUseCase } from '../../application/usecases/StartInspectionUseCase';
import { StartInstallationUseCase } from '../../application/usecases/StartInstallationUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { UpdateConnectionDocumentUseCase } from '../../application/usecases/UpdateConnectionDocumentUseCase';
import { UploadInspectionInvoiceReceiptUseCase } from '../../application/usecases/UploadInspectionInvoiceReceiptUseCase';

// ── Domain Models ─────────────────────────────────────────────────────────────
import type { DocumentoAdjuntoResponse, RequestDetailByClientResponse, SolicitudOrdenTrabajoResponse, TrackingSolicitudResponse } from '../../domain/models/Solicitud';

// ── Existing Modals ───────────────────────────────────────────────────────────
import { SolicitudDocumentPreviewModal } from '../components/SolicitudDocumentPreviewModal';
import { CreateInspectionInvoiceModal } from '../components/CreateInspectionInvoiceModal';
import { PaymentReceiptPreviewModal } from '../components/PaymentReceiptPreviewModal';
import { SubmitCorrectionsModal } from '../components/modals/SubmitCorrectionsModal';

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

// ── Subcomponents ─────────────────────────────────────────────────────────────
import { SolicitudHeroCard } from '../components/detail/SolicitudHeroCard';
// PaymentConfirmationCard removed — form now lives inside PaymentReceiptPreviewModal
import { SolicitudInfoCard } from '../components/detail/SolicitudInfoCard';
import { SolicitudDocsCard } from '../components/detail/SolicitudDocsCard';
import { SolicitudMetricsCard } from '../components/detail/SolicitudMetricsCard';
import { SolicitudTimelineCard } from '../components/detail/SolicitudTimelineCard';
import { SolicitudTechnicalReportCard } from '../components/detail/SolicitudTechnicalReportCard';
import { SolicitudWorkOrderCard } from '../components/detail/SolicitudWorkOrderCard';

// ── Icons ─────────────────────────────────────────────────────────────────────
import {
  ArrowLeft, FileText, Clock, FileCheck, CreditCard,
  AlertTriangle, Search, Wrench, FileSignature, ShieldCheck, Zap, Play, ChevronRight
} from 'lucide-react';
import '../styles/SolicitudDetailPage.css';
import { GetOrdenesTrabajoBysSolicitudIdUseCase } from '../../application/usecases/GetOrdenesTrabajoBysSolicitudIdUseCase';

// ─── Phase Action Button ───────────────────────────────────────────────────────
interface ActionBtnProps {
  color: string;
  bg: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
}

const PhaseActionBtn: React.FC<ActionBtnProps> = ({ color, bg, icon, label, description, onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="sol-phase-action-btn"
    style={{ '--phase-color': color, '--phase-bg': bg } as React.CSSProperties}
  >
    <div className="sol-phase-action-btn__content">
      <div className="sol-phase-action-btn__icon">
        {loading ? <Clock size={18} className="sol-detail-loading__spinner" /> : icon}
      </div>
      <div className="sol-phase-action-btn__main">
        <div className="sol-phase-action-btn__info">
          <span className="sol-phase-action-btn__label">{loading ? 'Procesando...' : label}</span>
          {description && (
            <span className="sol-phase-action-btn__description">{description}</span>
          )}
        </div>
      </div>
      <div className="sol-phase-action-btn__arrow">
        <ChevronRight size={18} />
      </div>
    </div>
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
  const [workOrders, setWorkOrders] = useState<SolicitudOrdenTrabajoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [docsOpen, setDocsOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [emitInspectionOpen, setEmitInspectionOpen] = useState(false);
  const [submitReportOpen, setSubmitReportOpen] = useState(false);
  const [approveReportOpen, setApproveReportOpen] = useState(false);
  const [generateContractOpen, setGenerateContractOpen] = useState(false);
  const [signContractOpen, setSignContractOpen] = useState(false);
  const [emitInstallationOpen, setEmitInstallationOpen] = useState(false);
  const [registerCadastralOpen, setRegisterCadastralOpen] = useState(false);

  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isRejectingPayment, setIsRejectingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('TRANSFERENCIA');
  const [paymentReference, setPaymentReference] = useState('');
  
  const [submitCorrectionsModalOpen, setSubmitCorrectionsModalOpen] = useState(false);
  const [isSubmittingCorrections, setIsSubmittingCorrections] = useState(false);

  // ── Quick-action loading state (for inline start buttons) ──────────────────
  const [isStartingInspection, setIsStartingInspection] = useState(false);
  const [isStartingInstallation, setIsStartingInstallation] = useState(false);

  // ── Use cases (memoized) ───────────────────────────────────────────────────
  const repo = React.useMemo(() => new SolicitudRepositoryImpl(), []);
  const requestDetailUseCase = React.useMemo(() => new GetRequestDetailByRequestIdOrNumberUseCase(repo), [repo]);
  const trackingUseCase = React.useMemo(() => new GetTrackingBySolicitudIdUseCase(repo), [repo]);
  const workOrderUseCase = React.useMemo(() => new GetOrdenesTrabajoBysSolicitudIdUseCase(repo), [repo]);
  const confirmPaymentUseCase = React.useMemo(() => new ConfirmPaymentUseCase(repo), [repo]);
  const rejectPaymentUseCase = React.useMemo(() => new RejectPaymentUseCase(repo), [repo]);
  const startInspectionUseCase = React.useMemo(() => new StartInspectionUseCase(repo), [repo]);
  const startInstallUseCase = React.useMemo(() => new StartInstallationUseCase(repo), [repo]);
  const updateDocUseCase = React.useMemo(() => new UpdateConnectionDocumentUseCase(repo), [repo]);
  const uploadReceiptUseCase = React.useMemo(() => new UploadInspectionInvoiceReceiptUseCase(repo), [repo]);
  const submitCorrectionsUseCase = React.useMemo(() => new SubmitCorrectionsUseCase(repo), [repo]);

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
        const [sol, trk, workOrders] = await Promise.all([
          requestDetailUseCase.execute(id),
          trackingUseCase.execute(id),
          workOrderUseCase.execute(id)
        ]);
        if (isMounted) { setSolicitud(sol); setMatchedTracking(trk); setWorkOrders(workOrders); }
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Error al cargar el expediente.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id, requestDetailUseCase, trackingUseCase, reloadTrigger]);
  // ── Confirm Payment (Fase 5) ───────────────────────────────────────────────
  const handleConfirmPayment = async (localFile?: File) => {
    if (!solicitud?.facturaId) { MessageToastCustom('error', 'Error', 'ID de factura no encontrado.'); return; }
    if (!paymentReference.trim()) { MessageToastCustom('error', 'Requerido', 'Ingrese la referencia de pago.'); return; }
    if (!user?.userId) { MessageToastCustom('error', 'Sesión', 'Inicie sesión nuevamente.'); return; }
    setIsConfirmingPayment(true);
    try {
      // 1. If a local file is provided, upload it first
      if (localFile) {
        const uploadSuccess = await uploadReceiptUseCase.execute(solicitud.facturaId, localFile);
        if (!uploadSuccess) {
          throw new Error('No se pudo subir el comprobante. Abortando confirmación.');
        }
      }

      // 2. Proceed with confirmation
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

  const handleRejectPayment = async (reason: string) => {
    if (!solicitud?.facturaId) { MessageToastCustom('error', 'Error', 'ID de factura no encontrado.'); return; }
    if (!user?.userId) { MessageToastCustom('error', 'Sesión', 'Inicie sesión nuevamente.'); return; }
    
    setIsRejectingPayment(true);
    try {
      await rejectPaymentUseCase.execute({
        invoiceId: solicitud.facturaId,
        adminId: user.userId,
        reason: reason.trim()
      });
      MessageToastCustom('success', 'Comprobante Rechazado', 'El trámite regresó a Recolección de Pago.');
      setReceiptModalOpen(false); // Close the modal
      reload();
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'Error al rechazar el pago.');
    } finally {
      setIsRejectingPayment(false);
    }
  };

  // ── File Replace (Document Corrección) ─────────────────────────────────────
  const handleDocFileReplace = async (docId: string, file: File, documentTypeId: number) => {
    if (!solicitud || !user) return;
    setUploadingDocId(docId);
    try {
      const success = await updateDocUseCase.execute(docId, file, user.userId, solicitud.solicitudId, documentTypeId);
      if (success) {
        MessageToastCustom('success', 'Documento Actualizado', 'El documento se subió correctamente.');
        reload();
      } else {
        throw new Error('Error al actualizar el documento.');
      }
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'Error al actualizar el documento.');
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleBulkCorrectionsSubmit = async (files: File[], documentIds: string[]) => {
    if (!solicitud || !user) return;
    setIsSubmittingCorrections(true);
    try {
      const success = await submitCorrectionsUseCase.execute(
        solicitud.solicitudId,
        user.userId,
        files,
        documentIds
      );
      if (success) {
        MessageToastCustom('success', 'Correcciones Subidas', 'Los documentos fueron subidos y enviados a revisión correctamente.');
        setSubmitCorrectionsModalOpen(false);
        reload();
      } else {
        throw new Error('Error al subir las correcciones en lote.');
      }
    } catch (e: any) {
      MessageToastCustom('error', 'Error', e.message || 'Error al subir las correcciones en lote.');
    } finally {
      setIsSubmittingCorrections(false);
    }
  };

  // ── Start inspection (Fase 7) ──────────────────────────────────────────────
  const handleStartInspection = async () => {
    // Buscar la OT de INSPECCION en el array cargado de work orders
    const otInspeccion = workOrders.find(
      (wo) => wo.tipoOrden === 'INSPECCION'
    );
    const workOrderId = otInspeccion?.workOrderId ?? '';
    if (!workOrderId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID de la OT de inspección. Recarga la página.');
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
    // Buscar la OT de INSTALACION en el array cargado de work orders
    const otInstalacion = workOrders.find(
      (wo) => wo.tipoOrden === 'INSTALACION'
    );
    const workOrderId = otInstalacion?.workOrderId ?? '';
    if (!workOrderId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID de la OT de instalación. Recarga la página.');
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
  const tipoLabel = TIPO_ACOMETIDA_LABELS[solicitud.tipoAcometida] ?? solicitud.tipoAcometida;
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

  // Determine actual payment document logic
  const paymentDocument: DocumentoAdjuntoResponse | null = solicitud.urlComprobante
    ? {
        id: 'mock-comprobante-id',
        tipodocumento: 'COMPROBANTE_PAGO_INSPECCION',
        url: solicitud.urlComprobante,
        estadoValidacion: 'PENDIENTE',
        observacion: null
      }
    : null;



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
          <SolicitudHeroCard
            solicitud={solicitud}
            statusConfig={statusConfig}
            tipoLabel={tipoLabel}
            updatedStr={updatedStr}
          />

          {/* ══ ACCIONES POR FASE ══ */}
          <div className="sol-detail-phase-actions">

            {/* Fase 3: Validar documentos */}
            {solicitud.estado === 'DOCS_SUBMITTED' && (
              <PhaseActionBtn
                color="#f59e0b" bg="rgba(245,158,11,0.1)"
                icon={<FileCheck size={18} />}
                label="Validar Documentos"
                description="Validar los documentos presentados por el cliente"
                onClick={() => setDocsOpen(true)}
              />
            )}

            {/* Fase 4: Generar factura de inspección */}
            {solicitud.estado === 'DOCS_APPROVED' && (
              <PhaseActionBtn
                color="#3b82f6" bg="rgba(59,130,246,0.1)"
                icon={<CreditCard size={18} />}
                label="Generar Factura de Inspección"
                description="Emitir la factura de cobro por el servicio de inspección técnica"
                onClick={() => setInvoiceModalOpen(true)}
              />
            )}

            {/* Fase 4.5 / 5: Confirmar pago — abre el modal con preview + formulario */}
            {(solicitud.estado === 'FACTURA_INSPECCION_EMITIDA' || solicitud.estado === 'PAGO_PENDIENTE') && (
              <>
                <PhaseActionBtn
                  color="#10b981" bg="rgba(16,185,129,0.1)"
                  icon={<CreditCard size={18} />}
                  label={solicitud.urlComprobante ? "Validar y Confirmar Pago" : "Subir y Confirmar Pago"}
                  description={solicitud.urlComprobante ? "Revise el comprobante del cliente y registre la confirmación del pago" : "Suba el comprobante de pago entregado por el cliente y confirme el pago en un solo paso"}
                  onClick={() => setReceiptModalOpen(true)}
                />
                {/* Info básica de la factura debajo del botón */}
                <div className="sol-detail-payment-info-card">
                  <div className="sol-detail-payment-info-card__grid">
                    {solicitud.numeroFactura && (
                      <div className="sol-detail-payment-info-card__item">
                        <span className="sol-detail-payment-info-card__label">N° Factura</span>
                        <span className="sol-detail-payment-info-card__value">{solicitud.numeroFactura}</span>
                      </div>
                    )}
                    <div className="sol-detail-payment-info-card__item">
                      <span className="sol-detail-payment-info-card__label">Concepto</span>
                      <span className="sol-detail-payment-info-card__value">Inspección Técnica de Acometida</span>
                    </div>
                    {solicitud.montofactura != null && (
                      <div className="sol-detail-payment-info-card__item">
                        <span className="sol-detail-payment-info-card__label">Monto</span>
                        <span className="sol-detail-payment-info-card__value sol-detail-payment-info-card__value--accent">
                          ${solicitud.montofactura.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {solicitud.fechaVencimiento && (
                      <div className="sol-detail-payment-info-card__item">
                        <span className="sol-detail-payment-info-card__label">Vence</span>
                        <span className="sol-detail-payment-info-card__value">
                          {new Date(solicitud.fechaVencimiento).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {solicitud.estadoPago && (
                      <div className="sol-detail-payment-info-card__item">
                        <span className="sol-detail-payment-info-card__label">Estado</span>
                        <span className="sol-detail-payment-info-card__value">{solicitud.estadoPago}</span>
                      </div>
                    )}
                    {solicitud.urlComprobante ? (
                      <div className="sol-detail-payment-info-card__item sol-detail-payment-info-card__item--full">
                        <span className="sol-detail-payment-info-card__label">Comprobante</span>
                        <span className="sol-detail-payment-info-card__value" style={{ color: '#10b981' }}>✓ Subido por el cliente</span>
                      </div>
                    ) : (
                      <div className="sol-detail-payment-info-card__item sol-detail-payment-info-card__item--full">
                        <span className="sol-detail-payment-info-card__label">Comprobante</span>
                        <span className="sol-detail-payment-info-card__value" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          ⚠ Pendiente de subir
                          <Button size="xs" variant="outline" color="primary" onClick={() => setReceiptModalOpen(true)}>
                            Subir por el cliente
                          </Button>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Fase 6: Emitir OT de inspección */}
            {solicitud.estado === 'PAGO_CONFIRMADO' && (
              <PhaseActionBtn
                color="#6366f1" bg="rgba(99,102,241,0.1)"
                icon={<Search size={18} />}
                label="Emitir Orden de Inspección Técnica"
                description="Crear y asignar la orden de trabajo para la visita de inspección en campo"
                onClick={() => setEmitInspectionOpen(true)}
              />
            )}

            {/* Fase 7: Iniciar inspección */}
            {solicitud.estado === 'ORDEN_INSPECCION_EMITIDA' && (
              <PhaseActionBtn
                color="#8b5cf6" bg="rgba(139,92,246,0.1)"
                icon={<Play size={18} />}
                label="Iniciar Inspección Técnica"
                description="Marcar el inicio de la inspección técnica en el predio del solicitante"
                onClick={handleStartInspection}
                loading={isStartingInspection}
              />
            )}

            {/* Fase 8: Subir informe técnico */}
            {solicitud.estado === 'INSPECCION_EN_PROCESO' && !solicitud.informeId && (
              <PhaseActionBtn
                color="#a855f7" bg="rgba(168,85,247,0.1)"
                icon={<FileText size={18} />}
                label={`Enviar Informe Técnico de Campo (${workOrders.find(o => o.codigoOrden === solicitud.solicitudNumero)?.estadoOt === 'INSPECCION_COMPLETADA' ? 'INSPECCION REALIZADA' : 'INSPECCION NO REALIZADA'})`}
                disabled={workOrders.find(o => o.codigoOrden === solicitud.solicitudNumero)?.estadoOt !== 'INSPECCION_COMPLETADA'}
                description="Cargar el informe con los resultados y observaciones de la inspección realizada"
                onClick={() => setSubmitReportOpen(true)}
              />
            )}

            {/* Fase 9: Aprobar / rechazar informe */}
            {(solicitud.estado === 'INFORME_EN_REVISION' || (solicitud.estado === 'INSPECCION_EN_PROCESO' && solicitud.informeId)) && (
              <PhaseActionBtn
                color="#06b6d4" bg="rgba(6,182,212,0.1)"
                icon={<ShieldCheck size={18} />}
                label="Emitir Dictamen — Aprobar o Rechazar Informe"
                description="Revisar el informe técnico y emitir la resolución de aprobación o rechazo"
                onClick={() => setApproveReportOpen(true)}
              />
            )}

            {/* Fase 10: Generar contrato */}
            {solicitud.estado === 'INFORME_APROBADO' && (
              <PhaseActionBtn
                color="#ec4899" bg="rgba(236,72,153,0.1)"
                icon={<FileSignature size={18} />}
                label="Generar Contrato de Servicio"
                description="Crear el contrato oficial de suministro de agua potable para el solicitante"
                onClick={() => setGenerateContractOpen(true)}
              />
            )}

            {/* Fase 11: Firmar contrato */}
            {(solicitud.estado === 'CONTRATO_GENERADO') && solicitud.contratoId && (
              <PhaseActionBtn
                color="#10b981" bg="rgba(16,185,129,0.1)"
                icon={<FileCheck size={18} />}
                label="Registrar Firma del Contrato"
                description="Registrar la firma del cliente y formalizar el contrato de servicio"
                onClick={() => setSignContractOpen(true)}
              />
            )}

            {/* Fase 12: Emitir OT de instalación */}
            {solicitud.estado === 'CONTRATO_FIRMADO' && (
              <PhaseActionBtn
                color="#f97316" bg="rgba(249,115,22,0.1)"
                icon={<Wrench size={18} />}
                label="Emitir Orden de Trabajo — Instalación"
                description="Generar la orden de trabajo para la instalación de la acometida de agua"
                onClick={() => setEmitInstallationOpen(true)}
              />
            )}

            {/* Fase 13: Iniciar instalación */}
            {solicitud.estado === 'OT_INSTALACION_EMITIDA' && (
              <PhaseActionBtn
                color="#f97316" bg="rgba(249,115,22,0.1)"
                icon={<Play size={18} />}
                label="Iniciar Proceso de Instalación"
                description="Iniciar la ejecución de la instalación física de la acometida en el predio"
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
                description="Registrar la clave catastral y activar el suministro de agua en el sistema"
                onClick={() => setRegisterCadastralOpen(true)}
              />
            )}
          </div>

          {/* ══ PANEL INFORME (cuando aplica) ══ */}
          <SolicitudTechnicalReportCard solicitud={solicitud} />

          {/* ══ ÓRDENES DE TRABAJO (cuando aplica) ══ */}
          <SolicitudWorkOrderCard workOrders={workOrders} />

          {/* Card 2: Información General */}
          <SolicitudInfoCard
            solicitud={solicitud}
            titular={titular}
            identificationVal={identificationVal}
            emailVal={emailVal}
            phoneVal={phoneVal}
            personaLabel={personaLabel}
            usoLabel={usoLabel}
          />

          {/* Card 3: Documentos */}
          <SolicitudDocsCard
          solicitud={solicitud}
          setDocsOpen={setDocsOpen}
          setSelectedDocId={setSelectedDocId}
          onFileReplace={handleDocFileReplace}
          uploadingDocId={uploadingDocId}
          onBulkCorrectionsClick={() => setSubmitCorrectionsModalOpen(true)}
        />
        </div>

        {/* ══ COLUMNA DERECHA ══ */}
        <div className="sol-detail-sidebar-col">
          {/* Métricas del servicio */}
          <SolicitudMetricsCard solicitud={solicitud} />

          {/* Timeline */}
          <SolicitudTimelineCard matchedTracking={matchedTracking} />
        </div>
      </div>

      {/* ══ MODALES ══ */}

      {/* Visor documentos */}
      {docsOpen && (
        <SolicitudDocumentPreviewModal
          isOpen={docsOpen}
          onClose={() => {
            setDocsOpen(false);
            setSelectedDocId(undefined);
          }}
          documentos={solicitud.documentos}
          solicitudNumero={solicitud.solicitudNumero}
          solicitudId={solicitud.solicitudId}
          onValidationSuccess={reload}
          initialActiveId={selectedDocId}
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

      {/* Ver / confirmar comprobante */}
      <PaymentReceiptPreviewModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        documento={paymentDocument}
        facturaLabel={solicitud.numeroFactura ? `Factura ${solicitud.numeroFactura}` : solicitud.solicitudNumero}
        numeroFactura={solicitud.numeroFactura}
        montofactura={solicitud.montofactura}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentReference={paymentReference}
        setPaymentReference={setPaymentReference}
        isConfirmingPayment={isConfirmingPayment}
        handleConfirmPayment={async (file) => { await handleConfirmPayment(file); setReceiptModalOpen(false); }}
        isRejectingPayment={isRejectingPayment}
        handleRejectPayment={handleRejectPayment}
      />

      {solicitud.documentos && (
        <SubmitCorrectionsModal
          isOpen={submitCorrectionsModalOpen}
          onClose={() => setSubmitCorrectionsModalOpen(false)}
          rejectedDocuments={solicitud.documentos.filter(
            (d) => d.estadoValidacion === 'RECHAZADO' || d.estadoValidacion === 'INVALIDO'
          )}
          onSubmitCorrections={handleBulkCorrectionsSubmit}
          isSubmitting={isSubmittingCorrections}
        />
      )}

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
          workOrderId={workOrders.find(wo => wo.tipoOrden === 'INSPECCION')?.workOrderId ?? ''}
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
