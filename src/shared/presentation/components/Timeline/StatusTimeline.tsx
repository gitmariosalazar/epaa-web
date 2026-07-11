import React from 'react';
import {
  Activity,
  Clock,
  MessageSquare,
  Plus,
  XCircle,
  CreditCard,
  Calendar,
  Search,
  FileSignature,
  Wrench,
  CheckCircle2,
  FileText,
  ArrowRight
} from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { TbTimelineEventText } from 'react-icons/tb';
import './StatusTimeline.css';

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * A single event in any timeline.
 *
 * All fields are optional except `status` (the new state label).
 * Consumers map their domain objects to this shape before passing them in.
 */
export interface TimelineItem {
  /** The main state/status label (e.g. "RESUELTO", "INSTALACION_COMPLETADA"). */
  status: string;
  /** Human-readable label. Falls back to `status` when not provided. */
  statusLabel?: string;
  /** Previous state label (shown as "prev ➜ status"). */
  previousStatus?: string;
  /** Human-readable label for the previous state. Falls back to `previousStatus`. */
  previousStatusLabel?: string;
  /** ISO date string or Date object. */
  date?: string | Date;
  /** Optional comment / observation. */
  comment?: string;
  /** Who performed the action. */
  actor?: React.ReactNode;
  /**
   * Accent color for this node (hex, CSS variable, or named color).
   * Falls back to `--accent` when omitted.
   */
  color?: string;
  /**
   * Override the auto-detected icon for this node.
   * When omitted, an icon is selected based on `status` keywords.
   */
  icon?: React.ReactNode;
}

// ─── Icon resolution (pure function, module-level) ─────────────────────────────

/**
 * Selects a Lucide icon based on status code keywords.
 * SRP: single responsibility — icon resolution.
 */
function resolveIcon(status: string, override?: React.ReactNode): React.ReactNode {
  if (override) return override;
  const code = status.toUpperCase();

  if (code.includes('CREAD') || code.includes('NUEV') || code === 'DRAFT') {
    return <Plus size={14} />;
  }
  if (code.includes('SUBMIT') || code.includes('ENVIAD') || code.includes('RECEPC')) {
    return <FileText size={14} />;
  }
  if (code.includes('REJECT') || code.includes('RECHAZ') || code.includes('FALLID') || code.includes('FALSO')) {
    return <XCircle size={14} />;
  }
  if (
    code.includes('APPROV') || code.includes('APROB') ||
    code.includes('COMPLET') || code.includes('FINALIZ') ||
    code.includes('RESUELTO') || code.includes('ACTIVO') || code.includes('SUMINISTRO')
  ) {
    return <CheckCircle2 size={14} />;
  }
  if (code.includes('PAGO') || code.includes('FACTUR') || code.includes('COBRO')) {
    return code.includes('PENDIENT') ? <Clock size={14} /> : <CreditCard size={14} />;
  }
  if (code.includes('INSPECCION') || code.includes('ORDEN') || code.includes('OT_') || code.includes('PROGRAM')) {
    return (code.includes('PROGR') || code.includes('ASIGN') || code.includes('EMIT'))
      ? <Calendar size={14} />
      : <Search size={14} />;
  }
  if (code.includes('CONTRATO') || code.includes('FIRMA')) {
    return <FileSignature size={14} />;
  }
  if (code.includes('INSTALAC') || code.includes('MEDIDOR') || code.includes('OBRA') || code.includes('TRABAJO')) {
    return <Wrench size={14} />;
  }
  if (code.includes('CATASTR') || code.includes('REGISTR') || code.includes('CUENTA') || code.includes('ACTIV')) {
    return <FileText size={14} />;
  }
  return <Activity size={14} />;
}

// ─── Color resolution (pure function, module-level) ────────────────────────────

/**
 * Selects an accent color based on status keywords.
 * Consumers can override by setting `item.color` directly.
 */
function resolveColor(status: string, override?: string): string {
  if (override) return override;
  const code = status.toUpperCase();

  if (
    code.includes('APPROV') || code.includes('APROB') || code.includes('COMPLET') ||
    code.includes('FINALIZ') || code.includes('RESUELTO') || code.includes('ACTIVO') ||
    code.includes('SUMINISTRO') || code.includes('PAGO_CONFIRMADO')
  ) return '#10b981';

  if (
    code.includes('REJECT') || code.includes('RECHAZ') || code.includes('FALLID') ||
    code.includes('FALSO') || code.includes('ANULAD') || code.includes('CRITICA')
  ) return '#ef4444';

  if (code.includes('ALTA') || code.includes('PAGO_PENDIENTE') || code.includes('PENDIENT')) {
    return '#f59e0b';
  }
  if (code.includes('DRAFT') || code.includes('REPORTADO')) return '#94a3b8';
  if (code.includes('INSPECCION') || code.includes('INSPECCIÓN')) return '#6366f1';
  if (code.includes('INSTALAC') || code.includes('OT_')) return '#f97316';
  if (code.includes('CONTRATO') || code.includes('FIRMA')) return '#ec4899';

  return 'var(--accent, #3b82f6)';
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value?: string | Date): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);

  return `${d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
}

// ─── TimelineNode sub-component ───────────────────────────────────────────────

interface TimelineNodeProps {
  item: TimelineItem;
  isLast: boolean;
}

/**
 * TimelineNode
 *
 * Renders a single event within StatusTimeline.
 * SRP: visual presentation of one timeline event.
 */
const TimelineNode: React.FC<TimelineNodeProps> = ({ item, isLast }) => {
  const color = resolveColor(item.status, item.color);
  const icon = resolveIcon(item.status, item.icon);

  const currentLabel = item.statusLabel ?? formatLabel(item.status);
  const previousLabel = item.previousStatusLabel ?? (item.previousStatus ? formatLabel(item.previousStatus) : undefined);
  const dateFormatted = formatDate(item.date);

  return (
    <div
      className={`status-timeline-node${isLast ? ' status-timeline-node--last' : ''}`}
      style={{ '--node-color': color } as React.CSSProperties}
    >
      {/* Vertical connector line */}
      {!isLast && <div className="status-timeline-node__line" />}

      {/* Icon */}
      <div className="status-timeline-node__icon-container">
        <div className="status-timeline-node__icon-glow" />
        <div className="status-timeline-node__icon">{icon}</div>
      </div>

      {/* Content card */}
      <div className="status-timeline-node__content">
        <div className="status-timeline-node__header">
          {/* State flow: prev ➜ current */}
          <div className="status-timeline-node__flow-row">
            {previousLabel ? (
              <>
                <ColorChip
                  label={previousLabel}
                  variant="soft"
                  size="xs"
                  color="var(--text-secondary)"
                  borderRadius={6}
                />
                <ArrowRight size={12} className="flow-arrow" />
                <ColorChip
                  label={currentLabel}
                  variant="soft"
                  size="xs"
                  color={color}
                  borderRadius={6}
                  withDot
                />
              </>
            ) : (
              <ColorChip
                label={currentLabel}
                variant="soft"
                size="xs"
                color={color}
                borderRadius={6}
                icon={icon}
              />
            )}
          </div>

          {/* Date chip */}
          {dateFormatted && (
            <span className="status-timeline-node__date">
              <ColorChip
                label={dateFormatted}
                variant="soft"
                size="xs"
                color="info"
                borderRadius={6}
                icon={<Clock size={12} />}
              />
            </span>
          )}
        </div>

        {/* Comment / observation */}
        {item.comment && (
          <div className="status-timeline-node__comment">
            <MessageSquare size={12} className="status-timeline-node__comment-icon" />
            <p>{item.comment}</p>
          </div>
        )}

        {/* Actor */}
        {item.actor && (
          <span className="status-timeline-node__actor">
            {item.actor}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── StatusTimeline component ──────────────────────────────────────────────────

interface StatusTimelineProps {
  /** Events to display, ordered from newest to oldest (or vice-versa). */
  items: TimelineItem[];
  /** Title shown in the header. Defaults to "Historial de Estados". */
  title?: string;
  /** Message shown when items is empty. */
  emptyMessage?: string;
  /** Sub-message shown when items is empty. */
  emptySubMessage?: string;
  /** Additional CSS class on the root element. */
  className?: string;
}

/**
 * StatusTimeline
 *
 * Generic, fully styled audit/state-history timeline.
 * Used in any module that tracks state changes over time.
 *
 * SRP: renders a list of TimelineItems — no data fetching, no domain logic.
 * OCP: extensible via props (title, emptyMessage, custom item.color, item.icon).
 * DIP: depends only on the generic TimelineItem interface, not on any domain.
 *
 * @example
 * // In IncidentDetailModal:
 * <StatusTimeline
 *   items={incident.statusHistory.map(h => ({
 *     status: h.newStatus,
 *     previousStatus: h.previousStatus,
 *     date: h.changeDate,
 *     comment: h.observation,
 *     actor: h.managedBy,
 *   }))}
 * />
 *
 * @example
 * // In SolicitudTimelineCard:
 * <StatusTimeline
 *   title="Historial de Movimientos"
 *   items={historial.map(e => ({
 *     status: e.estado,
 *     statusLabel: e.estadoLabel,
 *     previousStatus: e.estadoAnterior,
 *     date: e.fecha,
 *     comment: e.comentario,
 *   }))}
 * />
 */
export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  items,
  title = 'Historial de Estados',
  emptyMessage = 'No se registran movimientos.',
  emptySubMessage = 'Los cambios de estado se mostrarán aquí.',
  className = '',
}) => {
  const hasItems = items.length > 0;

  return (
    <div className={`status-timeline-wrapper ${className}`}>
      {/* Header */}
      <div className="status-timeline-header">
        <div className="status-timeline-header__left">
          <Activity size={16} className="status-timeline-header__icon" />
          <span className="status-timeline-header__title">{title}</span>
        </div>
        {hasItems && (
          <ColorChip
            label={`${items.length} ${items.length === 1 ? 'evento' : 'eventos'}`}
            variant="soft"
            size="sm"
            color="var(--text-secondary)"
            borderRadius={6}
            icon={<TbTimelineEventText size={14} />}
          />
        )}
      </div>

      {/* Body */}
      {!hasItems ? (
        <div className="status-timeline-empty">
          <Clock size={28} className="status-timeline-empty__icon" />
          <p className="status-timeline-empty__text">{emptyMessage}</p>
          <span className="status-timeline-empty__sub">{emptySubMessage}</span>
        </div>
      ) : (
        <div className="status-timeline-body">
          {items.map((item, idx) => (
            <TimelineNode
              key={idx}
              item={item}
              isLast={idx === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
