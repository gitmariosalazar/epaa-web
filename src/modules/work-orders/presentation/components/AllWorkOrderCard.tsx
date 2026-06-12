/**
 * AllWorkOrderCard — expandable card for the global work-order list.
 *
 * SRP: renders one WorkOrderListItem. Expand state is local.
 * DIP: receives onView callback as prop — no navigate() inside.
 * OCP: new display fields → extend this component without touching the page.
 */
import React, { useState } from 'react';
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  User,
  Eye,
  FileText,
  Hash,
  Settings2
} from 'lucide-react';
import type { WorkOrderListItem } from '../../domain/schemas/dto/response/work-orders.get.response';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { getEstadoOrdenConfig } from './WorkOrderConfig';

// ── Priority label/color map ─────────────────────────────────────────────────
const PRIORITY_MAP: Record<number, { label: string; color: string }> = {
  1: { label: 'Baja', color: '#64748b' },
  2: { label: 'Media', color: '#f59e0b' },
  3: { label: 'Alta', color: '#f97316' },
  4: { label: 'Urgente', color: '#ef4444' },
  5: { label: 'Emergencia', color: '#9333ea' }
};

const ORIGIN_LABEL: Record<string, string> = {
  EMERGENCIA: '🚨 Emergencia',
  PLANIFICADA: '📅 Planificada',
  SOLICITUD: '📋 Solicitud',
  INSPECCION: '🔍 Inspección'
};

const PERSON_ICON: Record<string, React.ReactNode> = {
  NATURAL: <User size={12} />,
  JURIDICA: <Hash size={12} />
};

interface AllWorkOrderCardProps {
  orden: WorkOrderListItem;
  onView: (orderCode: string) => void;
  onProcess: (orderCode: string) => void;
  style?: React.CSSProperties;
}

export const AllWorkOrderCard: React.FC<AllWorkOrderCardProps> = ({
  orden,
  onView,
  onProcess,
  style
}) => {
  const [expanded, setExpanded] = useState(false);

  const estadoConfig = getEstadoOrdenConfig(orden.status);
  const priorityInfo = PRIORITY_MAP[orden.priorityId] ?? {
    label: `Prioridad ${orden.priorityId}`,
    color: '#64748b'
  };
  const originLabel = ORIGIN_LABEL[orden.origin] ?? orden.origin;
  const personIcon = PERSON_ICON[orden.personType] ?? null;

  const fechaStr = orden.creationDate
    ? new Date(orden.creationDate).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '—';

  return (
    <article
      className="wo-list-card"
      style={
        {
          '--wo-card-accent': estadoConfig.cardAccent,
          '--wo-icon-color': estadoConfig.iconColor,
          ...style
        } as React.CSSProperties
      }
      aria-label={`Orden de trabajo ${orden.orderCode}`}
    >
      {/* ── Main row ────────────────────────────────────────────────────────── */}
      <div className="wo-list-card__main">
        {/* Icon */}
        <div
          className="wo-list-card__type-icon"
          style={{ background: estadoConfig.iconBg }}
        >
          <Wrench size={20} style={{ color: estadoConfig.iconColor }} />
        </div>

        {/* Body */}
        <div className="wo-list-card__body">
          {/* Top row: code + badges */}
          <div className="wo-list-card__top">
            <span className="wo-list-card__code">{orden.orderCode}</span>
            <ColorChip
              label={estadoConfig.label}
              color={estadoConfig.color}
              variant="soft"
              size="xs"
            />
            <ColorChip
              label={priorityInfo.label}
              color={priorityInfo.color}
              variant="soft"
              size="xs"
            />
          </div>

          {/* Client + work type */}
          <div className="wo-list-card__meta">
            <Tooltip
              content={
                orden.personType === 'JURIDICA'
                  ? 'Persona Jurídica'
                  : 'Persona Natural'
              }
            >
              <span className="wo-list-card__meta-item">
                {personIcon}
                <strong>{orden.clientName || orden.clientId}</strong>
              </span>
            </Tooltip>
            <span className="wo-list-card__meta-sep">·</span>
            <span className="wo-list-card__meta-item">
              <Wrench size={11} />
              {orden.workTypeName}
            </span>
          </div>

          {/* Bottom row: origin + location + date */}
          <div className="wo-list-card__footer">
            <span className="wo-list-card__footer-item">
              <FileText size={11} />
              {originLabel}
            </span>
            {orden.location && (
              <span className="wo-list-card__footer-item">
                <MapPin size={11} />
                {orden.location}
              </span>
            )}
            <span className="wo-list-card__footer-item">
              <Calendar size={11} />
              {fechaStr}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="wo-list-card__actions">
          <Button
            id={`btn-wo-process-${orden.workOrderId}`}
            variant="secondary"
            size="sm"
            leftIcon={<Settings2 size={14} />}
            onClick={() => onProcess(orden.orderCode)}
          >
            Procesar
          </Button>
          <Button
            id={`btn-wo-view-${orden.workOrderId}`}
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={14} />}
            onClick={() => onView(orden.orderCode)}
          >
            Ver detalle
          </Button>
          <button
            className="wo-list-card__expand-btn"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'Ocultar detalles' : 'Ver más detalles'}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── Expanded row ────────────────────────────────────────────────────── */}
      {expanded && (
        <div className="wo-list-card__expanded">
          <div className="wo-list-card__expanded-grid">
            {orden.assignationDate && (
              <div className="wo-list-card__exp-item">
                <span className="wo-list-card__exp-label">Asignación</span>
                <span className="wo-list-card__exp-value">
                  {new Date(orden.assignationDate).toLocaleDateString('es-EC')}
                </span>
              </div>
            )}
            {orden.completionDate && (
              <div className="wo-list-card__exp-item">
                <span className="wo-list-card__exp-label">Completada</span>
                <span className="wo-list-card__exp-value">
                  {new Date(orden.completionDate).toLocaleDateString('es-EC')}
                </span>
              </div>
            )}
            {orden.cadastralKey && (
              <div className="wo-list-card__exp-item">
                <span className="wo-list-card__exp-label">Clave Catastral</span>
                <span className="wo-list-card__exp-value">
                  {orden.cadastralKey}
                </span>
              </div>
            )}
            {orden.description && (
              <div className="wo-list-card__exp-item wo-list-card__exp-item--full">
                <span className="wo-list-card__exp-label">Descripción</span>
                <span className="wo-list-card__exp-value">
                  {orden.description}
                </span>
              </div>
            )}
            {!orden.assignationDate &&
              !orden.completionDate &&
              !orden.cadastralKey &&
              !orden.description && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                  }}
                >
                  Sin información adicional disponible.
                </span>
              )}
          </div>
        </div>
      )}
    </article>
  );
};
