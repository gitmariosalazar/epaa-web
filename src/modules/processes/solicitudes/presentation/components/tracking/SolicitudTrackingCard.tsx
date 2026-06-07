/**
 * SolicitudTrackingCard
 *
 * SRP: renders the full tracking state of ONE solicitud.
 * DIP: receives TrackingSolicitudResponse as prop — no context reads.
 * OCP: add new step sections by extending the render, no parent changes needed.
 */
import React, { useState } from 'react';
import '../../styles/SolicitudTrackingCard.css';
import type { TrackingSolicitudResponse, HistorialTrackingEntry } from '../../../domain/models/Solicitud';
import { ProcessTimeline } from '@/shared/presentation/components/Timeline/ProcessTimeline';
import type { TimelineStep } from '@/shared/presentation/components/Timeline/ProcessTimeline';
import {
  FileText,
  Files,
  ShieldCheck,
  CreditCard,
  Search,
  FileSignature,
  Wrench,
  Zap,
  MapPin,
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart2,
  Eye,
  ArrowRight,
  Hash,
  Activity,
  Plus,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getEstadoConfig } from '../SolicitudConfig';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';

// ─── Step definitions ─────────────────────────────────────────────────────────
interface TrackingStep extends TimelineStep<string> {
  icon: React.ReactNode;
}

const ALL_STEPS: TrackingStep[] = [
  { id: 'solicitud', label: 'Solicitud', icon: <FileText size={16} /> },
  { id: 'documentos', label: 'Documentos', icon: <Files size={16} /> },
  { id: 'pago', label: 'Pago', icon: <CreditCard size={16} /> },
  { id: 'inspeccion', label: 'Inspección', icon: <Search size={16} /> },
  { id: 'contrato', label: 'Contrato', icon: <FileSignature size={16} /> },
  { id: 'instalacion', label: 'Instalación', icon: <Wrench size={16} /> },
  { id: 'catastro', label: 'Catastro', icon: <ShieldCheck size={16} /> },
  { id: 'completado', label: 'Activo', icon: <Zap size={16} /> }
];

// Terminal-negative steps don't appear on the linear timeline
const TERMINAL_NEGATIVE = new Set(['anulada', 'rechazada']);

const mapEstadoToStep = (estadoCodigo: string): string => {
  switch (estadoCodigo) {
    case 'DRAFT':
      return 'solicitud';
    case 'DOCS_SUBMITTED':
    case 'DOCS_REJECTED':
      return 'documentos';
    case 'DOCS_APPROVED':
    case 'FACTURA_INSPECCION_EMITIDA':
    case 'PAGO_PENDIENTE':
      return 'pago';
    case 'PAGO_CONFIRMADO':
    case 'ORDEN_INSPECCION_EMITIDA':
    case 'INSPECCION_EN_PROCESO':
    case 'INFORME_EN_REVISION':
      return 'inspeccion';
    case 'INFORME_APROBADO':
    case 'CONTRATO_GENERADO':
      return 'contrato';
    case 'CONTRATO_FIRMADO':
    case 'OT_INSTALACION_EMITIDA':
    case 'INSTALACION_EN_PROCESO':
    case 'INSTALACION_FALLIDA':
      return 'instalacion';
    case 'INSTALACION_COMPLETADA':
    case 'REGISTRO_CATASTRAL_PENDIENTE':
      return 'catastro';
    case 'SUMINISTRO_ACTIVO':
      return 'completado';
    case 'ANULADA':
      return 'anulada';
    case 'RECHAZADA_TECNICA':
      return 'rechazada';
    default:
      return 'solicitud';
  }
};

// ─── Status helpers ───────────────────────────────────────────────────────────
interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}

const getStepStatusConfig = (currentStep: string): StatusConfig => {
  const MAP: Record<string, StatusConfig> = {
    solicitud: { label: 'Solicitud ingresada', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)', icon: <FileText size={12} /> },
    documentos: { label: 'Documentos requeridos', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: <Files size={12} /> },
    pago: { label: 'Pago de inspección', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', icon: <CreditCard size={12} /> },
    inspeccion: { label: 'Inspección técnica', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', icon: <Search size={12} /> },
    contrato: { label: 'Firma de contrato', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.25)', icon: <FileSignature size={12} /> },
    instalacion: { label: 'Instalación en proceso', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', icon: <Wrench size={12} /> },
    catastro: { label: 'Registro catastral', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', icon: <ShieldCheck size={12} /> },
    completado: { label: 'Servicio activo', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: <Zap size={12} /> },
    anulada: { label: 'Anulada', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: <XCircle size={12} /> },
    rechazada: { label: 'Rechazada', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: <XCircle size={12} /> }
  };
  return MAP[currentStep] ?? MAP['solicitud'];
};

interface StateConfig {
  icon: React.ReactNode;
  color: string;
  label: string;
}

const getStateConfig = (estado: string): StateConfig => {
  const config = getEstadoConfig(estado);
  const code = estado.toUpperCase();

  let icon = <Activity size={12} />;

  if (code.includes('CREAD') || code.includes('NUEV') || code === 'DRAFT') {
    icon = <Plus size={12} />;
  } else if (code.includes('SUBMIT') || code.includes('ENVIAD') || code.includes('RECEPC')) {
    icon = <FileText size={12} />;
  } else if (code.includes('REJECT') || code.includes('RECHAZ') || code.includes('FALLID')) {
    icon = <XCircle size={12} />;
  } else if (code.includes('APPROV') || code.includes('APROB') || code.includes('COMPLET') || code.includes('FINALIZ')) {
    icon = <CheckCircle2 size={12} />;
  } else if (code.includes('PAGO') || code.includes('FACTUR') || code.includes('COBRO')) {
    if (code.includes('PENDIENT')) {
      icon = <Clock size={12} />;
    } else {
      icon = <CreditCard size={12} />;
    }
  } else if (code.includes('INSPECCION') || code.includes('ORDEN') || code.includes('OT_') || code.includes('PROGRAM')) {
    if (code.includes('PROGR') || code.includes('ASIGN') || code.includes('EMIT')) {
      icon = <Calendar size={12} />;
    } else {
      icon = <Search size={12} />;
    }
  } else if (code.includes('CONTRATO') || code.includes('FIRMA')) {
    icon = <FileSignature size={12} />;
  } else if (code.includes('INSTALAC') || code.includes('MEDIDOR') || code.includes('OBRA') || code.includes('TRABAJO')) {
    icon = <Wrench size={12} />;
  } else if (code.includes('CATASTR') || code.includes('REGISTR') || code.includes('CUENTA') || code.includes('ACTIV')) {
    icon = <FileText size={12} />;
  }

  return {
    icon,
    color: config.color,
    label: config.label
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="trk-info-row">
    <span className="trk-info-row__icon">{icon}</span>
    <span className="trk-info-row__label">{label}</span>
    <span className="trk-info-row__value">{value ?? '—'}</span>
  </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="trk-section">
    <div className="trk-section__header">
      {icon}
      <span>{title}</span>
    </div>
    <div className="trk-section__body">{children}</div>
  </div>
);

const HistorialRow: React.FC<{ entry: HistorialTrackingEntry; isLast: boolean }> = ({ entry, isLast }) => {
  const config = getStateConfig(entry.estado);

  const formatStateLabel = (stateStr: string) => {
    if (!stateStr) return '';
    return stateStr
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div
      className={`trk-historial-node${isLast ? ' trk-historial-node--last' : ''}`}
      style={{ '--node-color': config.color } as React.CSSProperties}
    >
      <div className="trk-historial-node__line" />

      <div className="trk-historial-node__icon-container">
        <div className="trk-historial-node__icon-glow" />
        <div className="trk-historial-node__icon">
          {config.icon}
        </div>
      </div>

      <div className="trk-historial-node__content">
        <div className="trk-historial-node__header">
          <div className="trk-historial-node__flow-row">
            {entry.estadoAnterior ? (
              <>
                <ColorChip
                  label={formatStateLabel(entry.estadoAnterior)}
                  variant="soft"
                  size="xs"
                  color="var(--text-secondary)"
                  borderRadius={6}
                />
                <ArrowRight size={12} className="flow-arrow" />
                <ColorChip
                  label={entry.estadoLabel}
                  variant="soft"
                  size="xs"
                  color={config.color}
                  borderRadius={6}
                  withDot
                />
              </>
            ) : (
              <ColorChip
                label={entry.estadoLabel}
                variant="soft"
                size="xs"
                color={config.color}
                borderRadius={6}
                icon={config.icon}
              />
            )}
          </div>
          <span className="trk-historial-node__date">
            <ColorChip
              label={entry.fecha ? `${new Date(entry.fecha).toLocaleDateString('es-EC', {
                day: '2-digit',
                month: 'short',
              })} ${new Date(entry.fecha).toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit',
              })}` : '—'}
              variant="soft"
              size="xs"
              color="info"
              borderRadius={6}
              icon={<Clock size={12} />}
            />
          </span>
        </div>

        {entry.comentario && (
          <div className="trk-historial-node__comment">
            <MessageSquare
              size={12}
              className="trk-historial-node__comment-icon"
            />
            <p>{entry.comentario}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

interface SolicitudTrackingCardProps {
  tracking: TrackingSolicitudResponse;
  onVerDetalle?: (id: string) => void;
}

export const SolicitudTrackingCard: React.FC<SolicitudTrackingCardProps> = ({
  tracking,
  onVerDetalle
}) => {
  const [historialOpen, setHistorialOpen] = useState(false);

  const resolvedCurrentStep = mapEstadoToStep(tracking.estadoCodigo || '');
  const statusConfig = getStepStatusConfig(resolvedCurrentStep);
  const isTerminalNeg = TERMINAL_NEGATIVE.has(resolvedCurrentStep);
  const timelineSteps = isTerminalNeg ? [] : ALL_STEPS;

  // Docs progress percent
  const docsProgress = tracking.docsTotal > 0
    ? Math.round((tracking.docsAprobados / tracking.docsTotal) * 100)
    : 0;

  // Process progress percent based on the 8 stages
  const progressPercent = isTerminalNeg
    ? 100
    : (() => {
      const idx = ALL_STEPS.findIndex(s => s.id === resolvedCurrentStep);
      return idx >= 0 ? Math.round(((idx) / ALL_STEPS.length) * 100) : 0;
    })();

  const ultimoMov = tracking.ultimoMovimiento
    ? new Date(tracking.ultimoMovimiento).toLocaleDateString('es-EC', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    : null;

  return (
    <div className={`trk-card${isTerminalNeg ? ' trk-card--terminal-neg' : ''}`}
      style={{ '--trk-accent': statusConfig.color } as React.CSSProperties}
    >
      {/* ══ HEADER ══ */}
      <div className="trk-card__header">
        <div className="trk-card__header-left">
          <div className="trk-card__icon-wrap">
            <FileText size={18} />
          </div>
          <div>
            <div className="trk-card__title-row">
              <span className="trk-card__codigo">{tracking.codigo}</span>
              <span
                className="trk-card__status-badge"
                style={{ color: statusConfig.color, background: statusConfig.bg, borderColor: statusConfig.border }}
              >
                {statusConfig.icon}
                {tracking.estadoActualLabel || statusConfig.label}
              </span>
            </div>
            <div className="trk-card__meta">
              {tracking.direccion && (
                <span className="trk-card__meta-item">
                  <MapPin size={11} /> {tracking.direccion}
                </span>
              )}
              {tracking.claveCatastral && (
                <span className="trk-card__meta-item">
                  <Hash size={11} /> {tracking.claveCatastral}
                </span>
              )}
              <span className="trk-card__meta-item">
                <Calendar size={11} /> {tracking.fechaCreacion}
              </span>
              {tracking.diasEnProceso != null && (
                <span className="trk-card__meta-item" style={{ color: '#f59e0b' }}>
                  <Clock size={11} /> {tracking.diasEnProceso} {tracking.diasEnProceso === 1 ? 'día' : 'días'} en proceso
                </span>
              )}
              {tracking.analista && (
                <span className="trk-card__meta-item">
                  <User size={11} /> Analista: <strong>{tracking.analistaNombre?.toUpperCase()}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="trk-card__header-actions">
          {onVerDetalle && (
            <button
              className="trk-card__action-btn"
              onClick={() => onVerDetalle(tracking.id)}
              title="Ver expediente completo"
            >
              <Eye size={14} /> Ver detalle <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ══ TIMELINE ══ */}
      {!isTerminalNeg && timelineSteps.length > 0 && (
        <div className="trk-card__timeline">
          <ProcessTimeline
            steps={timelineSteps}
            currentStep={resolvedCurrentStep}

          />
        </div>
      )}

      {/* Terminal negative banner */}
      {isTerminalNeg && (
        <div className="trk-card__terminal-banner" style={{ borderColor: statusConfig.border, background: statusConfig.bg }}>
          <XCircle size={18} style={{ color: statusConfig.color }} />
          <span style={{ color: statusConfig.color, fontWeight: 700 }}>
            Esta solicitud fue {resolvedCurrentStep === 'rechazada' ? 'rechazada' : 'anulada'}
          </span>
          {tracking.ultimoComentario && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              — {tracking.ultimoComentario}
            </span>
          )}
        </div>
      )}

      {/* ══ DETAIL SECTIONS ══ */}
      <div className="trk-card__sections">

        {/* Documentos */}
        <Section title="Documentos" icon={<Files size={14} />}>
          <div className="trk-docs-bar">
            <div className="trk-docs-bar__track">
              <div
                className="trk-docs-bar__fill"
                style={{ width: `${docsProgress}%` }}
              />
            </div>
            <span className="trk-docs-bar__label">
              {tracking.docsAprobados} / {tracking.docsTotal} aprobados
            </span>
            {tracking.docsRechazados > 0 && (
              <span className="trk-docs-bar__rechazados">
                <AlertCircle size={11} /> {tracking.docsRechazados} rechazado{tracking.docsRechazados > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </Section>

        {/* Pago — solo si tiene factura o el step lo requiere */}
        {(tracking.numeroFactura || tracking.montoInspeccion != null) && (
          <Section title="Pago de Inspección" icon={<CreditCard size={14} />}>
            <InfoRow icon={<Hash size={11} />} label="Factura" value={tracking.numeroFactura} />
            {tracking.montoInspeccion != null && (
              <InfoRow icon={<BarChart2 size={11} />} label="Monto"
                value={<strong>${tracking.montoInspeccion?.toFixed(2)}</strong>}
              />
            )}
            {tracking.estadoPago && (
              <InfoRow icon={<CheckCircle size={11} />} label="Estado pago"
                value={
                  <span style={{
                    color: tracking.estadoPago === 'PAGADO' ? '#10b981' : '#f59e0b',
                    fontWeight: 600
                  }}>{tracking.estadoPago}</span>
                }
              />
            )}
            {tracking.fechaPago && (
              <InfoRow icon={<Calendar size={11} />} label="Fecha pago"
                value={new Date(tracking.fechaPago).toLocaleDateString('es-EC')}
              />
            )}
            {tracking.metodoPago && (
              <InfoRow icon={<CreditCard size={11} />} label="Método" value={tracking.metodoPago} />
            )}
          </Section>
        )}

        {/* Inspección */}
        {(tracking.resultadoInspeccion != null || tracking.costoEstimado != null || tracking.obsInspeccion) && (
          <Section title="Inspección Técnica" icon={<Search size={14} />}>
            {tracking.resultadoInspeccion && (
              <InfoRow icon={<CheckCircle size={11} />} label="Resultado" value={tracking.resultadoInspeccion} />
            )}
            {tracking.distanciaRedM != null && (
              <InfoRow icon={<MapPin size={11} />} label="Distancia red" value={`${tracking.distanciaRedM} m`} />
            )}
            {tracking.costoEstimado != null && (
              <InfoRow icon={<BarChart2 size={11} />} label="Costo estimado"
                value={<strong>${tracking.costoEstimado?.toFixed(2)}</strong>}
              />
            )}
            {tracking.informeAprobado != null && (
              <InfoRow icon={tracking.informeAprobado ? <CheckCircle size={11} /> : <XCircle size={11} />}
                label="Informe" value={tracking.informeAprobado ? 'Aprobado' : 'No aprobado'}
              />
            )}
            {tracking.obsInspeccion && (
              <InfoRow icon={<FileText size={11} />} label="Observación" value={tracking.obsInspeccion} />
            )}
          </Section>
        )}

        {/* Contrato */}
        {(tracking.numeroContrato || tracking.estadoFirma) && (
          <Section title="Contrato" icon={<FileSignature size={14} />}>
            <InfoRow icon={<Hash size={11} />} label="N° Contrato" value={tracking.numeroContrato} />
            {tracking.valorContrato != null && (
              <InfoRow icon={<BarChart2 size={11} />} label="Valor"
                value={<strong>${tracking.valorContrato?.toFixed(2)}</strong>}
              />
            )}
            {tracking.estadoFirma && (
              <InfoRow icon={<CheckCircle size={11} />} label="Estado firma"
                value={<span style={{ color: tracking.estadoFirma === 'FIRMADO' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{tracking.estadoFirma}</span>}
              />
            )}
            {tracking.fechaFirmaUsuario && (
              <InfoRow icon={<Calendar size={11} />} label="Firma cliente"
                value={new Date(tracking.fechaFirmaUsuario).toLocaleDateString('es-EC')}
              />
            )}
          </Section>
        )}

        {/* Instalación / Catastro */}
        {(tracking.numeroMedidor || tracking.numeroCuenta || tracking.servicioActivo != null) && (
          <Section title="Instalación y Catastro" icon={<Wrench size={14} />}>
            <InfoRow icon={<Hash size={11} />} label="N° Medidor" value={tracking.numeroMedidor} />
            <InfoRow icon={<Hash size={11} />} label="N° Cuenta" value={tracking.numeroCuenta} />
            {tracking.servicioActivo != null && (
              <InfoRow
                icon={tracking.servicioActivo ? <Zap size={11} style={{ color: '#10b981' }} /> : <XCircle size={11} />}
                label="Servicio"
                value={
                  <span style={{ color: tracking.servicioActivo ? '#10b981' : 'var(--text-muted)', fontWeight: 700 }}>
                    {tracking.servicioActivo ? 'Activo ✓' : 'Inactivo'}
                  </span>
                }
              />
            )}
            {tracking.fechaActivacion && (
              <InfoRow icon={<Calendar size={11} />} label="Activación"
                value={new Date(tracking.fechaActivacion).toLocaleDateString('es-EC')}
              />
            )}
          </Section>
        )}

        {/* Último comentario */}
        {tracking.ultimoComentario && (
          <Section title="Último comentario" icon={<FileText size={14} />}>
            <p className="trk-comentario">{tracking.ultimoComentario}</p>
            {ultimoMov && (
              <span className="trk-comentario__fecha">
                <Clock size={10} /> {ultimoMov}
              </span>
            )}
          </Section>
        )}
      </div>

      {/* ══ HISTORIAL ══ */}
      {tracking.historial?.length > 0 && (
        <div className="trk-card__historial">
          <div className="trk-card-header">
            <button
              className="trk-card__historial-toggle"
              onClick={() => setHistorialOpen(p => !p)}
              aria-expanded={historialOpen}
            >
              <BarChart2 size={14} />
              Historial de estados ({tracking.historial.length})
              {historialOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <div className='trk-card-right-percentage'
              onClick={() => setHistorialOpen(p => !p)}
              aria-expanded={historialOpen}>
              <span className='trk-card-right-percentage-text'>
                Avance del proceso
              </span>

              <ProgressBar
                className='trk-card-right-percentage-progress'
                value={progressPercent}
                color={getTrafficLightColor(progressPercent)}
              />
            </div>
          </div>

          <div className={`trk-historial${historialOpen ? ' trk-historial--open' : ''}`}>
            <div className="trk-historial__inner">
              {[...tracking.historial].reverse().map((entry, idx, arr) => (
                <HistorialRow
                  key={`${entry.estado}-${idx}`}
                  entry={entry}
                  isLast={idx === arr.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
