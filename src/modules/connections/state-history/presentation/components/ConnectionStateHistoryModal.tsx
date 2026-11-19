import React, { useState } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { Tabs, type TabItem } from '@/shared/presentation/components/Tabs';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import {
  History,
  RotateCcw,
  Sparkles,
  Table as TableIcon,
  GitCommit
} from 'lucide-react';
import { useConnectionStateHistory } from '../hooks/useConnectionStateHistory';
import { ConnectionStateHistoryTimeline } from './ConnectionStateHistoryTimeline';
import { ChangeConnectionStateModal } from './ChangeConnectionStateModal';
import { RevertStateHistoryModal } from './RevertStateHistoryModal';
import {
  renderStateChip,
  formatStateHistoryDate,
  formatOriginChannel
} from '../utils/stateCatalogUtils';
import type { StateHistory } from '../../domain/models/StateHistory';

export interface ConnectionStateHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string | null;
  onStateChanged?: () => void;
}

export const ConnectionStateHistoryModal: React.FC<ConnectionStateHistoryModalProps> = ({
  isOpen,
  onClose,
  connectionId,
  onStateChanged
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'table'>('timeline');

  // Modales hijos
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [selectedRecordToRevert, setSelectedRecordToRevert] = useState<number | undefined>(undefined);

  const {
    history,
    currentState,
    reversibleRecord,
    isLoading,
    refreshAll
  } = useConnectionStateHistory({
    connectionId,
    autoFetch: isOpen && !!connectionId
  });

  if (!isOpen || !connectionId) return null;

  const tabs: TabItem<'timeline' | 'table'>[] = [
    {
      id: 'timeline',
      label: 'Línea de Tiempo',
      icon: <GitCommit size={15} />
    },
    {
      id: 'table',
      label: 'Registro Forense / Tabla',
      icon: <TableIcon size={15} />
    }
  ];

  const columns: Column<StateHistory>[] = [
    {
      id: 'changeDate',
      header: 'Fecha / Hora',
      accessor: (row) => formatStateHistoryDate(row.effectiveDate || row.changeDate)
    },
    {
      id: 'transition',
      header: 'Transición de Estado',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {row.previousStateId && (
            <>
              {renderStateChip(row.previousStateId, row.previousStateName, 'xs')}
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
            </>
          )}
          {renderStateChip(row.newStateId, row.newStateName, 'xs')}
          {row.isReversal && (
            <ColorChip
              label="REVERSO"
              status="error"
              size="xs"
              variant="solid"
            />
          )}
        </div>
      )
    },
    {
      id: 'reason',
      header: 'Motivo / Justificación',
      accessor: (row) => row.reason || '-'
    },
    {
      id: 'supportDocument',
      header: 'Documento Respaldo',
      accessor: (row) => row.supportDocument || '-'
    },
    {
      id: 'origin',
      header: 'Canal',
      accessor: (row) => {
        const info = formatOriginChannel(row.origin);
        return (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              backgroundColor: `${info.badgeColor}18`,
              color: info.badgeColor
            }}
          >
            {info.label}
          </span>
        );
      }
    },
    {
      id: 'user',
      header: 'Operador / Usuario',
      accessor: (row) => row.userFullName || row.userEmail || 'Sistema'
    },
    {
      id: 'flags',
      header: 'Propiedades',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {row.allowsBilling && (
            <Tooltip content="Facturable">
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>$</span>
            </Tooltip>
          )}
          {row.allowsReading && (
            <Tooltip content="Leíble">
              <span style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 600 }}>R</span>
            </Tooltip>
          )}
          {row.requiresInspection && (
            <Tooltip content="Requiere Inspección">
              <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>!</span>
            </Tooltip>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="var(--primary, #0ea5e9)" />
            <span>Historial de Estados y Auditoría</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              ({connectionId})
            </span>
          </div>
        }
        description="Libro mayor cronológico inmutable de transiciones de estado de la acometida."
        size="xl"
        headerActions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="xs"
              leftIcon={<RotateCcw size={14} />}
              disabled={!reversibleRecord?.isReversible}
              onClick={() => {
                setSelectedRecordToRevert(undefined);
                setIsRevertModalOpen(true);
              }}
              title={
                reversibleRecord?.isReversible
                  ? 'Revertir última transición'
                  : reversibleRecord?.message || 'No elegible para reverso'
              }
            >
              Revertir Estado
            </Button>
            <Button
              variant="primary"
              size="xs"
              leftIcon={<Sparkles size={14} />}
              onClick={() => setIsChangeModalOpen(true)}
            >
              Cambiar Estado
            </Button>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="subtle" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Estado Actual */}
          {currentState && (
            <div className="state-current-banner">
              <div className="state-current-label">
                <span>Estado Actual Registrado</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {currentState.description}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {renderStateChip(currentState.stateId, currentState.stateName, 'md')}
              </div>
            </div>
          )}

          {/* Navegación por pestañas */}
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Contenido según pestaña */}
          {activeTab === 'timeline' ? (
            <ConnectionStateHistoryTimeline
              history={history}
              isLoading={isLoading}
              reversibleHistorialId={reversibleRecord?.record?.historialId}
              onRevertTransition={(record) => {
                setSelectedRecordToRevert(record.historialId);
                setIsRevertModalOpen(true);
              }}
            />
          ) : (
            <div style={{ minHeight: '300px' }}>
              <Table
                data={history}
                columns={columns}
                isLoading={isLoading}
                pagination
                pageSize={10}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Modal para Cambiar Estado */}
      <ChangeConnectionStateModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        connectionId={connectionId}
        currentStatusName={currentState?.stateName}
        onSuccess={() => {
          refreshAll();
          if (onStateChanged) onStateChanged();
        }}
      />

      {/* Modal para Revertir Estado */}
      <RevertStateHistoryModal
        isOpen={isRevertModalOpen}
        onClose={() => setIsRevertModalOpen(false)}
        connectionId={connectionId}
        specificHistorialId={selectedRecordToRevert}
        onSuccess={() => {
          refreshAll();
          if (onStateChanged) onStateChanged();
        }}
      />
    </>
  );
};
