import React from 'react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import type { StateSummaryItem } from '../../domain/models/StateSummary';
import { getStateMeta } from '../utils/stateCatalogUtils';
import '../styles/StateHistoryAudit.css';

export interface StateHistoryKpiCardsProps {
  summary: StateSummaryItem[];
  isLoading?: boolean;
  selectedStateId?: number | '';
  onSelectState?: (stateId: number | '') => void;
}

export const StateHistoryKpiCards: React.FC<StateHistoryKpiCardsProps> = ({
  summary,
  isLoading,
  selectedStateId,
  onSelectState
}) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px' }}>
        <CircularProgress size={24} strokeWidth={3} progress={70} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Cargando indicadores de estados del sistema...
        </span>
      </div>
    );
  }

  if (!summary || summary.length === 0) return null;

  return (
    <div className="state-kpis-grid">
      {summary.map((item) => {
        const meta = getStateMeta(item.stateId, item.stateName);
        const isSelected = selectedStateId === item.stateId;

        return (
          <div
            key={item.stateId}
            className={`state-kpi-card ${isSelected ? 'active-filter' : ''}`}
            onClick={() => {
              if (onSelectState) {
                onSelectState(isSelected ? '' : item.stateId);
              }
            }}
          >
            <div className="state-kpi-header">
              <span className="state-kpi-title">{meta.label}</span>
              <ColorChip
                label={meta.code}
                status={meta.badgeStatus}
                size="xs"
                variant="soft"
              />
            </div>

            <div className="state-kpi-body">
              <span className="state-kpi-count">
                {item.totalConnections.toLocaleString()}
              </span>
              <span className="state-kpi-percentage">{item.percentage.toFixed(2)}%</span>
            </div>

            <div className="state-kpi-flags">
              <span>{item.allowsBilling ? '• Facturable' : '• No Fact.'}</span>
              <span>{item.allowsReading ? '• Leíble' : '• No Leíble'}</span>
              {item.requiresInspection && <span>• Req. Insp.</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
