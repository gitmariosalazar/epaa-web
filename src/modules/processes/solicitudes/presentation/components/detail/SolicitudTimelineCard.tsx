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
import { Card } from '@/shared/presentation/components/Card/Card';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getEstadoConfig } from '../SolicitudConfig';
import type { TrackingSolicitudResponse, HistorialTrackingEntry } from '../../../domain/models/Solicitud';
import { TbTimelineEventText } from 'react-icons/tb';

interface SolicitudTimelineCardProps {
  matchedTracking: TrackingSolicitudResponse | null;
}

interface StateConfig {
  icon: React.ReactNode;
  color: string;
  label: string;
}

const getStateConfig = (estado: string): StateConfig => {
  const config = getEstadoConfig(estado);
  const code = estado.toUpperCase();

  let icon = <Activity size={14} />;

  if (code.includes('CREAD') || code.includes('NUEV') || code === 'DRAFT') {
    icon = <Plus size={14} />;
  } else if (code.includes('SUBMIT') || code.includes('ENVIAD') || code.includes('RECEPC')) {
    icon = <FileText size={14} />;
  } else if (code.includes('REJECT') || code.includes('RECHAZ') || code.includes('FALLID')) {
    icon = <XCircle size={14} />;
  } else if (code.includes('APPROV') || code.includes('APROB') || code.includes('COMPLET') || code.includes('FINALIZ')) {
    icon = <CheckCircle2 size={14} />;
  } else if (code.includes('PAGO') || code.includes('FACTUR') || code.includes('COBRO')) {
    if (code.includes('PENDIENT')) {
      icon = <Clock size={14} />;
    } else {
      icon = <CreditCard size={14} />;
    }
  } else if (code.includes('INSPECCION') || code.includes('ORDEN') || code.includes('OT_') || code.includes('PROGRAM')) {
    if (code.includes('PROGR') || code.includes('ASIGN') || code.includes('EMIT')) {
      icon = <Calendar size={14} />;
    } else {
      icon = <Search size={14} />;
    }
  } else if (code.includes('CONTRATO') || code.includes('FIRMA')) {
    icon = <FileSignature size={14} />;
  } else if (code.includes('INSTALAC') || code.includes('MEDIDOR') || code.includes('OBRA') || code.includes('TRABAJO')) {
    icon = <Wrench size={14} />;
  } else if (code.includes('CATASTR') || code.includes('REGISTR') || code.includes('CUENTA') || code.includes('ACTIV')) {
    icon = <FileText size={14} />;
  }

  return {
    icon,
    color: config.color,
    label: config.label
  };
};

export const SolicitudTimelineCard: React.FC<SolicitudTimelineCardProps> = ({
  matchedTracking,
}) => {
  const historial = matchedTracking?.historial ?? [];
  const hasTimeline = historial.length > 0;

  // Formateador de texto amigable para estados anteriores
  const formatStateLabel = (stateStr: string) => {
    if (!stateStr) return '';
    return stateStr
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Card className="sol-detail-card sol-detail-card--timeline">
      <div className="sol-detail-card__title-row">
        <div className="sol-detail-timeline-header-left">
          <Activity size={16} className="sol-detail-card__title-icon" />
          <h3 className="sol-detail-card__title" style={{ fontSize: '0.875rem' }}>
            Historial de Movimientos
          </h3>
        </div>
        {hasTimeline && (
          <span className="">
            <ColorChip
              label={`${historial.length} ${historial.length === 1 ? 'evento' : 'eventos'}`}
              variant="soft"
              size="sm"
              color="var(--text-secondary)"
              borderRadius={6}
              icon={<TbTimelineEventText size={14} />}
            />
          </span>
        )}
      </div>

      {!hasTimeline ? (
        <div className="sol-detail-no-timeline">
          <Clock size={28} className="sol-detail-no-timeline-icon" />
          <p className="sol-detail-no-timeline-text">No se registran movimientos de seguimiento.</p>
          <span className="sol-detail-no-timeline-sub">Los cambios de estado se mostrarán aquí.</span>
        </div>
      ) : (
        <div className="sol-detail-timeline-container">
          <div className="sol-detail-timeline">
            {historial.map((entry: HistorialTrackingEntry, idx: number) => {
              const config = getStateConfig(entry.estado);
              return (
                <div
                  key={idx}
                  className="sol-detail-timeline-node"
                  style={{ '--node-color': config.color } as React.CSSProperties}
                >
                  <div className="sol-detail-timeline-node__line" />

                  <div className="sol-detail-timeline-node__icon-container">
                    <div className="sol-detail-timeline-node__icon-glow" />
                    <div className="sol-detail-timeline-node__icon">
                      {config.icon}
                    </div>
                  </div>

                  <div className="sol-detail-timeline-node__content">
                    <div className="sol-detail-timeline-node__header">
                      <div className="sol-detail-timeline-node__flow-row">
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
                      <span className="sol-detail-timeline-node__date">
                        <ColorChip
                          label={`${new Date(entry.fecha).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: 'short',
                          })} ${new Date(entry.fecha).toLocaleTimeString('es-EC', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                          variant="soft"
                          size="xs"
                          color="info"
                          borderRadius={6}
                          icon={<Clock size={12} />}
                        />
                      </span>
                    </div>

                    {entry.comentario && (
                      <div className="sol-detail-timeline-node__comment">
                        <MessageSquare
                          size={12}
                          className="sol-detail-timeline-node__comment-icon"
                        />
                        <p>{entry.comentario}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
