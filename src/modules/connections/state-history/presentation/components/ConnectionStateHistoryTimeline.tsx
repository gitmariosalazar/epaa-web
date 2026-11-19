import React from 'react';
import {
  RotateCcw,
  User,
  Calendar,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import type { StateHistory } from '../../domain/models/StateHistory';
import {
  getStateMeta,
  renderStateChip,
  formatStateHistoryDate,
  formatOriginChannel
} from '../utils/stateCatalogUtils';
import '../styles/StateHistoryTimeline.css';

export interface ConnectionStateHistoryTimelineProps {
  history: StateHistory[];
  isLoading?: boolean;
  onRevertTransition?: (record: StateHistory) => void;
  reversibleHistorialId?: number | null;
}

export const ConnectionStateHistoryTimeline: React.FC<ConnectionStateHistoryTimelineProps> = ({
  history,
  isLoading,
  onRevertTransition,
  reversibleHistorialId
}) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
        <CircularProgress size={48} strokeWidth={4} progress={65} />
        <span style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Cargando línea de tiempo de estados...
        </span>
      </div>
    );
  }

  const safeHistory = Array.isArray(history) ? history : [];

  if (safeHistory.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        message="Sin transiciones registradas"
        description="Esta acometida aún no registra eventos de cambio de estado en el libro mayor."
        variant="info"
        minHeight="220px"
      />
    );
  }

  return (
    <div className="state-timeline-container">
      {safeHistory.map((record) => {
        const newMeta = getStateMeta(record.newStateId, record.newStateName);
        const originInfo = formatOriginChannel(record.origin);
        const isEligibleToRevert =
          reversibleHistorialId === record.historialId && !record.isReversal;

        return (
          <div key={record.historialId} className="state-timeline-item">
            {/* Nodo circular */}
            <div
              className="state-timeline-node"
              style={{
                backgroundColor: newMeta.color,
                color: '#ffffff'
              }}
            >
              {newMeta.icon}
            </div>

            {/* Tarjeta de evento */}
            <div className={`state-timeline-card ${record.isReversal ? 'is-reversal' : ''}`}>
              <div className="state-timeline-header">
                <div className="state-timeline-transition">
                  {record.previousStateId ? (
                    <>
                      {renderStateChip(
                        record.previousStateId,
                        record.previousStateName,
                        'sm'
                      )}
                      <ArrowRight size={14} className="state-timeline-arrow" />
                    </>
                  ) : null}
                  {renderStateChip(record.newStateId, record.newStateName, 'sm')}

                  {record.isReversal && (
                    <ColorChip
                      label="REVERSO DE AUDITORÍA"
                      status="error"
                      size="xs"
                      variant="solid"
                      icon={<RotateCcw size={12} />}
                    />
                  )}
                </div>

                <div className="state-timeline-date">
                  <Calendar size={13} />
                  <span>{formatStateHistoryDate(record.effectiveDate || record.changeDate)}</span>
                </div>
              </div>

              {/* Motivo */}
              <div className="state-timeline-reason">
                {record.reason || 'Sin motivo detallado'}
              </div>

              {/* Observaciones Técnicas */}
              {record.observations && (
                <div className="state-timeline-observations">
                  {record.observations}
                </div>
              )}

              {/* Footer con metadatos de auditoría */}
              <div className="state-timeline-footer">
                <div className="state-timeline-badges">
                  {/* Origen */}
                  <span
                    className="state-timeline-channel"
                    style={{
                      backgroundColor: `${originInfo.badgeColor}18`,
                      color: originInfo.badgeColor
                    }}
                  >
                    {originInfo.label}
                  </span>

                  {/* Facturación */}
                  <span
                    className={`state-flag-pill ${
                      record.allowsBilling ? 'allowed' : 'forbidden'
                    }`}
                  >
                    {record.allowsBilling ? 'Facturable' : 'No Facturable'}
                  </span>

                  {/* Lectura */}
                  <span
                    className={`state-flag-pill ${
                      record.allowsReading ? 'allowed' : 'forbidden'
                    }`}
                  >
                    {record.allowsReading ? 'Leíble' : 'No Leíble'}
                  </span>

                  {/* Documento de Respaldo */}
                  {record.supportDocument && (
                    <Tooltip content="Documento o resolución de soporte">
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--primary, #0ea5e9)'
                        }}
                      >
                        <FileText size={12} />
                        <strong>{record.supportDocument}</strong>
                      </span>
                    </Tooltip>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Usuario */}
                  <div className="state-timeline-user">
                    <User size={13} />
                    <span>{record.userFullName || record.userEmail || 'Sistema'}</span>
                  </div>

                  {/* Botón de revertir si es la última y elegible */}
                  {isEligibleToRevert && onRevertTransition && (
                    <Tooltip content="Revertir este cambio de estado erróneo">
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => onRevertTransition(record)}
                        style={{ color: 'var(--error, #ef4444)' }}
                        leftIcon={<RotateCcw size={13} />}
                      >
                        Revertir
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
