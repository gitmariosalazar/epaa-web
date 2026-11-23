import React, { useState } from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Eye, HelpCircle, Layers } from 'lucide-react';
import { useStateHistoryAudit } from '../hooks/useStateHistoryAudit';
import { StateHistoryKpiCards } from '../components/StateHistoryKpiCards';
import { StateHistoryFilterBar } from '../components/StateHistoryFilterBar';
import { ConnectionStateHistoryModal } from '../components/ConnectionStateHistoryModal';
import { BulkChangeStateModal } from '../components/BulkChangeStateModal';
import {
  renderStateChip,
  formatStateHistoryDate,
  formatOriginChannel
} from '../utils/stateCatalogUtils';
import type { StateHistory } from '../../domain/models/StateHistory';
import '../styles/StateHistoryAudit.css';

export const StateHistoryAuditPage: React.FC = () => {
  const auditHook = useStateHistoryAudit();

  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const columns: Column<StateHistory>[] = [
    {
      id: 'historialId',
      header: 'ID',
      accessor: (row) => `#${row.historialId}`
    },
    {
      id: 'connectionId',
      header: 'Acometida',
      accessor: (row) => (
        <span
          style={{
            fontWeight: 600,
            color: 'var(--primary, #0ea5e9)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedConnectionId(row.connectionId)}
        >
          {row.connectionId}
        </span>
      )
    },
    {
      id: 'changeDate',
      header: 'Fecha Efectiva',
      accessor: (row) =>
        formatStateHistoryDate(row.effectiveDate || row.changeDate)
    },
    {
      id: 'transition',
      header: 'Transición Aplicada',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {row.previousStateId && (
            <>
              {renderStateChip(
                row.previousStateId,
                row.previousStateName,
                'xs'
              )}
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
      header: 'Documento / OT',
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
      id: 'actions',
      header: 'Acciones',
      accessor: (row) => (
        <Tooltip content="Ver historial completo de esta acometida">
          <Button
            size="xs"
            variant="ghost"
            circle
            onClick={() => setSelectedConnectionId(row.connectionId)}
          >
            <Eye size={14} />
          </Button>
        </Tooltip>
      )
    }
  ];

  return (
    <div className="state-audit-page">
      {/* Header con título y acciones globales */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            Auditoría y Libro Mayor de Estados de Acometidas
          </h2>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}
          >
            Trazabilidad cronológica inmutable, análisis de transición y control
            forense de la red.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Layers size={16} />}
            onClick={() => setIsBulkModalOpen(true)}
          >
            Transición Masiva
          </Button>
        </div>
      </div>

      {/* Indicadores KPI globales del sistema */}
      <StateHistoryKpiCards
        summary={auditHook.summary}
        isLoading={auditHook.isLoadingSummary}
        selectedStateId={auditHook.stateId}
        onSelectState={(id) => {
          auditHook.setStateId(id);
          auditHook.fetchRecords();
        }}
      />

      {/* Barra de Filtros */}
      <StateHistoryFilterBar
        catalog={auditHook.catalog}
        connectionId={auditHook.connectionId}
        onConnectionIdChange={auditHook.setConnectionId}
        stateId={auditHook.stateId}
        onStateIdChange={auditHook.setStateId}
        origin={auditHook.origin}
        onOriginChange={auditHook.setOrigin}
        isReversal={auditHook.isReversal}
        onIsReversalChange={auditHook.setIsReversal}
        startDate={auditHook.startDate}
        onStartDateChange={auditHook.setStartDate}
        endDate={auditHook.endDate}
        onEndDateChange={auditHook.setEndDate}
        onSearch={auditHook.fetchRecords}
        onReset={() => {
          auditHook.resetFilters();
          auditHook.fetchRecords();
        }}
        isLoading={auditHook.isLoading}
      />

      {/* Tabla de Eventos */}
      <div className="state-audit-table-card">
        <Table
          data={auditHook.records}
          columns={columns}
          isLoading={auditHook.isLoading}
          pagination
          pageSize={15}
          emptyState={
            <EmptyState
              icon={HelpCircle}
              message="No se encontraron eventos de estado"
              description="Ajusta los filtros de búsqueda o fechas para consultar el libro mayor de acometidas."
              variant="info"
            />
          }
        />
      </div>

      {/* Modal de Historial de la Acometida Seleccionada */}
      {selectedConnectionId && (
        <ConnectionStateHistoryModal
          isOpen={true}
          onClose={() => setSelectedConnectionId(null)}
          connectionId={selectedConnectionId}
          onStateChanged={() => {
            auditHook.fetchRecords();
            auditHook.refreshSummary();
          }}
        />
      )}

      {/* Modal de Transición Masiva */}
      <BulkChangeStateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedConnectionIds={
          auditHook.records.length > 0
            ? Array.from(
              new Set(auditHook.records.map((r) => r.connectionId))
            ).slice(0, 10)
            : []
        }
        onSuccess={() => {
          auditHook.fetchRecords();
          auditHook.refreshSummary();
        }}
      />
    </div>
  );
};
