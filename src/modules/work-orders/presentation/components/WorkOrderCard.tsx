/**
 * WorkOrderCard — expandable card for the list page.
 *
 * SRP: renders one OrdenTrabajoVistaCliente. Expand state is local.
 * DIP: receives onView as prop.
 */
import React, { useState } from 'react';
import {
  Wrench, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp,
  MapPin, Calendar, User, Eye, ShieldCheck, AlertTriangle
} from 'lucide-react';
import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import {
  getEstadoOrdenConfig,
  getPrioridadConfig,
  TIPO_ORDEN_LABELS,
  formatSlaHoras,
  getSlaColor,
} from './WorkOrderConfig';

interface WorkOrderCardProps {
  orden: OrdenTrabajoVistaCliente;
  onView: (codigoOrden: string) => void;
  style?: React.CSSProperties;
}

const TIPO_ICON: Record<string, React.ReactNode> = {
  INSPECCION: <ShieldCheck size={20} />,
  INSTALACION: <Wrench size={20} />,
  MANTENIMIENTO: <Wrench size={20} />,
  REPARACION: <Wrench size={20} />,
  EMERGENCIA: <AlertTriangle size={20} />,
};

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ orden, onView, style }) => {
  const [expanded, setExpanded] = useState(false);

  const estadoConfig = getEstadoOrdenConfig(orden.estadoCodigo);
  const prioridadConfig = getPrioridadConfig(orden.prioridad);
  const slaColor = getSlaColor(orden.cumpleSla, 0);
  const tipoLabel = TIPO_ORDEN_LABELS[orden.tipoOrden] ?? orden.tipoOrden;
  const tipoIcon = TIPO_ICON[orden.tipoOrden] ?? <Wrench size={20} />;

  const fechaStr = orden.fechaCreacion
    ? new Date(orden.fechaCreacion).toLocaleDateString('es-EC', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    : '—';

  const ejecutorLabel =
    false
      ? orden.tecnicoNombre ?? '—'
      : orden.tecnicoNombre ?? 'Sin asignar';

  const toggle = () => setExpanded((p) => !p);

  return (
    <div
      className={`wo-card wo-card--expandable${expanded ? ' wo-card--open' : ''}`}
      style={{
        '--wo-accent': estadoConfig.cardAccent,
        '--wo-icon-bg': estadoConfig.iconBg,
        '--wo-icon-color': estadoConfig.iconColor,
        ...style,
      } as React.CSSProperties}
      role="article"
      aria-label={`Orden ${orden.codigoOrden}`}
    >
      {/* ── MAIN ROW ── */}
      <div
        className="wo-card__main-row"
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggle()}
      >
        <div className="wo-card__icon">{tipoIcon}</div>

        <div className="wo-card__body">
          <div className="wo-card__top">
            <span className="wo-card__num">{orden.codigoOrden}</span>

            <Tooltip content="Estado de la OT" position="bottom" themeColor="info">
              <ColorChip
                color={estadoConfig.color}
                label={orden.estadoLabel}
                variant="soft"
                size="xs"
                borderRadius={5}
              />
            </Tooltip>

            <Tooltip content="Tipo de Orden" position="bottom" themeColor="info">
              <ColorChip
                label={tipoLabel}
                variant="soft"
                size="xs"
                color="var(--text-secondary)"
                borderRadius={5}
              />
            </Tooltip>

            <Tooltip content="Prioridad" position="bottom" themeColor="info">
              <ColorChip
                label={prioridadConfig.label}
                variant="soft"
                size="xs"
                color={prioridadConfig.color}
                borderRadius={5}
              />
            </Tooltip>

            <Tooltip content="Días en proceso" position="bottom" themeColor="info">
              <ColorChip
                label={orden.diasEnProceso > 1 ? `${orden.diasEnProceso} días` : '1 día'}
                icon={<Clock size={10} />}
                variant="soft"
                size="xs"
                color="var(--text-muted)"
                borderRadius={5}
              />
            </Tooltip>
          </div>

          <div className="wo-card__meta">
            <ColorChip
              label={<strong>{ejecutorLabel}</strong>}
              icon={<User size={12} color="#65a30d" />}
              variant="ghost"
              size="xs"
              color="var(--text-main)"
              borderRadius={5}
            />

            {orden.direccionTrabajo && (
              <ColorChip
                label={orden.direccionTrabajo}
                icon={<MapPin size={12} color="#b23808ff" />}
                variant="soft"
                size="xs"
                color="var(--text-secondary)"
                borderRadius={5}
              />
            )}

            <ColorChip
              label={fechaStr}
              icon={<Calendar size={12} color="#0891b2" />}
              variant="ghost"
              size="xs"
              color="var(--text-secondary)"
              borderRadius={5}
            />

            <ColorChip
              label={orden.cumpleSla ? 'SLA OK' : 'SLA Vencido'}
              icon={orden.cumpleSla ? <CheckCircle size={10} /> : <XCircle size={10} />}
              variant="soft"
              size="xs"
              color={slaColor}
              borderRadius={5}
            />
          </div>
        </div>

        <div className="wo-card__actions" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={() => onView(orden.codigoOrden)}
            id={`btn-ver-wo-${orden.idOrdenTrabajo}`}
            variant="dashed"
            leftIcon={<Eye size={14} />}
            size="xs"
          >
            Ver Detalle
          </Button>

          <Button
            className={`wo-card__expand-btn${expanded ? ' wo-card__expand-btn--open' : ''}`}
            onClick={toggle}
            title={expanded ? 'Colapsar' : 'Expandir'}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* ── EXPAND PANEL ── */}
      <div className={`wo-card__expand-panel${expanded ? ' wo-card__expand-panel--open' : ''}`}>
        <div className="wo-card__expand-inner">

          <div className="wo-expand__group">
            <span className="wo-expand__label">
              <Wrench size={10} style={{ display: 'inline', marginRight: 3 }} />
              Trabajo
            </span>
            <span className="wo-expand__value">{orden.tipoTrabajo}</span>
            <span className="wo-expand__value">Dpto: <strong>{orden.departamentoEjecutor}</strong></span>
            {orden.descripcion && (
              <span className="wo-expand__value" style={{ fontSize: '0.78rem', opacity: 0.85 }}>
                {orden.descripcion}
              </span>
            )}
          </div>

          <div className="wo-expand__group">
            <span className="wo-expand__label">
              <Calendar size={10} style={{ display: 'inline', marginRight: 3 }} />
              Fechas
            </span>
            <span className="wo-expand__value">
              Creación: <strong>{orden.fechaCreacionEs}</strong>
            </span>
            {orden.fechaAsignacion && (
              <span className="wo-expand__value">
                Asignación: <strong>{new Date(orden.fechaAsignacion).toLocaleDateString('es-EC')}</strong>
              </span>
            )}
            {orden.fechaCompletada && (
              <span className="wo-expand__value">
                Completada: <strong>{new Date(orden.fechaCompletada).toLocaleDateString('es-EC')}</strong>
              </span>
            )}
          </div>

          <div className="wo-expand__group">
            <span className="wo-expand__label">
              <ShieldCheck size={10} style={{ display: 'inline', marginRight: 3 }} />
              SLA
            </span>
            <span className="wo-expand__value">
              Límite: <strong style={{ color: slaColor }}>{formatSlaHoras(orden.slaHoras)}</strong>
            </span>
            <span className="wo-expand__value" style={{ color: slaColor }}>
              {orden.cumpleSla ? '✓ Cumplido' : '✗ Vencido'}
            </span>
            {orden.ultimaActualizacion && (
              <span className="wo-expand__value" style={{ fontSize: '0.76rem', opacity: 0.8 }}>
                Última act.: {new Date(orden.ultimaActualizacion).toLocaleString('es-EC')}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
