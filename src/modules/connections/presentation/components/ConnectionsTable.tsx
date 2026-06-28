import React, { useState, useMemo } from 'react';
import '../styles/ConnectionsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, CheckCircle, EyeIcon, X } from 'lucide-react';
import { FaTrashCan } from 'react-icons/fa6';
import { FaEdit, FaMapMarkerAlt } from 'react-icons/fa';
import type { Connection } from '../../domain/models/Connection';
import type { SortConfig } from '../hooks/useConnectionsViewModel';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { getConnectionStateChip } from '../utils/connectionStateChip';
import { BsTable } from 'react-icons/bs';

// ── DetailModal (lightweight inline modal for viewing a connection) ────────────
interface ConnectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: Connection | null;
}

const ConnectionDetailModal: React.FC<ConnectionDetailModalProps> = ({
  isOpen,
  onClose,
  connection
}) => {
  const { t } = useTranslation();
  if (!isOpen || !connection) return null;

  const detailRows = [
    {
      label: t('connections.table.connectionId'),
      value: connection.connectionId
    },
    { label: t('connections.table.clientId'), value: connection.clientId },
    {
      label: t('connections.table.meterNumber'),
      value: connection.connectionMeterNumber
    },
    {
      label: t('connections.table.cadastralKey'),
      value: connection.connectionCadastralKey
    },
    {
      label: t('connections.table.contractNumber'),
      value: connection.connectionContractNumber
    },
    {
      label: t('connections.wizard.clientSelection.address'),
      value: connection.connectionAddress
    },
    {
      label: t('connections.table.rate'),
      value: connection.connectionRateName
    },
    {
      label: t('connections.table.sector'),
      value: connection.connectionSector
    },
    { label: t('connections.table.zone'), value: connection.connectionZone },
    {
      label: t('connections.table.people'),
      value: connection.connectionPeopleNumber
    },
    { label: t('connections.table.latitude'), value: connection.latitude },
    { label: t('connections.table.longitude'), value: connection.longitude },
    {
      label: t('connections.table.altitude'),
      value: connection.connectionAltitude
    },
    {
      label: t('connections.table.installationDate'),
      value: connection.connectionInstallationDate
        ? new Date(connection.connectionInstallationDate).toLocaleDateString()
        : '-'
    }
  ];

  return (
    <div className="conn-detail-overlay" onClick={onClose}>
      <div className="conn-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="conn-detail-header">
          <h3>{t('connections.table.detailsTitle')}</h3>
          <Button variant="ghost" size="sm" circle onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="conn-detail-body">
          {detailRows.map(({ label, value }) => (
            <div key={label} className="conn-detail-row">
              <span className="conn-detail-label">{label}</span>
              <span className="conn-detail-value">{value || '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Props ──────────────────────────────────────────────────────────────────────
interface ConnectionsTableProps {
  data: Connection[];
  isLoading: boolean;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: SortConfig | null;
  onEndReached?: () => void;
  hasMore?: boolean;
  onViewOnMap: (connection: Connection) => void;
  /** Navega a la lista de incidentes filtrando por esta acometida (delegado al padre) */
  onViewIncidentsOnTable?: (connectionId: string) => void;
  onViewIncidentsOnMap?: (connectionId: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────
export const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
  onEndReached,
  hasMore,
  onViewOnMap,
  onViewIncidentsOnTable,
  onViewIncidentsOnMap
}) => {
  const { t } = useTranslation();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);

  console.log(data[0]);

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns: Column<Connection>[] = useMemo(
    () => [
      {
        header: t('connections.table.sector'),
        accessor: 'connectionSector',
        sortable: true,
        id: 'connectionSector'
      },
      {
        header: t('connections.table.client'),
        accessor: (item: Connection) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar name={item.clientId} size="sm" />
            <div>
              <div style={{ fontWeight: 300, fontSize: '0.8125rem' }}>
                {item.clientId}
              </div>
            </div>
          </div>
        ),
        id: 'clientId'
      },
      {
        header: t('connections.table.meterNumber'),
        accessor: 'connectionMeterNumber',
        sortable: true,
        id: 'connectionMeterNumber'
      },
      {
        header: t('connections.table.cadastralKey'),
        accessor: 'connectionCadastralKey',
        sortable: true,
        id: 'connectionCadastralKey'
      },

      {
        header: t('connections.table.incidents', 'Incidentes'),
        accessor: (item: Connection) => {
          // PostgreSQL COUNT devuelve bigint → llega como string. Castear a Number.
          const count = Number(item.incidents ?? 0);

          return count > 0 ? (
            <div className="table-column-center">
              <Tooltip
                content={t(
                  'connections.table.incidentsCount',
                  `La acometida tiene ${count} incidente(s).`
                )}
                position="bottom"
                followCursor={false}
              >
                <ColorChip
                  label={count.toString()}
                  color="#ef4444" // Rojo = problema
                  icon={<AlertTriangle size={14} />} // Triángulo de alerta
                  variant="soft"
                  size="sm"
                />
              </Tooltip>
              <Tooltip
                content={'Ver incidentes tabla'}
                position="bottom"
                followCursor={false}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  circle
                  style={{ color: '#ef4444' }}
                  onClick={() => onViewIncidentsOnTable?.(item.connectionId)}
                >
                  <BsTable size={14} />
                </Button>
              </Tooltip>
              <Tooltip
                content={'Ver incidentes en el mapa'}
                position="bottom"
                followCursor={false}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  circle
                  style={{ color: '#ef4444' }}
                  onClick={() => onViewIncidentsOnMap?.(item.connectionId)}
                >
                  <FaMapMarkerAlt size={14} />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <div className="table-column-center">
              <Tooltip
                content={t(
                  'connections.table.incidentsCount',
                  'La acometida no tiene incidentes.'
                )}
                position="bottom"
                followCursor={false}
              >
                <ColorChip
                  label="0"
                  color="#22c55e" // Verde = bueno
                  icon={<CheckCircle size={14} />} // Check = sin problemas
                  variant="soft"
                  size="sm"
                />
              </Tooltip>
            </div>
          );
        },
        sortable: true,
        sortKey: 'incidents',
        id: 'incidents'
      },
      {
        header: t('connections.table.contractNumber'),
        accessor: 'connectionContractNumber',
        sortable: true,
        id: 'connectionContractNumber'
      },
      {
        header: t('connections.table.rate'),
        accessor: 'connectionRateName',
        sortable: true,
        id: 'connectionRateName'
      },
      {
        header: t('connections.table.sewerage'),
        accessor: (item: Connection) => (
          <ColorChip
            label={
              item.connectionSewerage
                ? t('connections.table.yes')
                : t('connections.table.no')
            }
            color={item.connectionSewerage ? '#22c55e' : '#94a3b8'}
            icon={
              item.connectionSewerage ? <Check size={14} /> : <X size={14} />
            }
            variant="soft"
            size="sm"
          />
        ),
        id: 'connectionSewerage'
      },
      {
        header: t('connections.table.status'),
        accessor: (item: Connection) => {
          const chip = getConnectionStateChip(item.connectionStatus);
          return (
            <ColorChip
              label={chip.label}
              color={chip.color}
              icon={chip.icon}
              variant="soft"
              size="sm"
            />
          );
        },
        id: 'connectionStatus'
      },
      {
        header: t('connections.table.connectionIsReadable', 'Lecturable'),
        accessor: (item: Connection) => (
          <ColorChip
            label={
              item.connectionIsReadable
                ? t('connections.table.yes')
                : t('connections.table.no')
            }
            color={item.connectionIsReadable ? '#22c55e' : '#94a3b8'}
            icon={
              item.connectionIsReadable ? <Check size={14} /> : <X size={14} />
            }
            variant="soft"
            size="sm"
          />
        ),
        id: 'connectionIsReadable'
      },
      {
        header: t('connections.table.options'),
        accessor: (row: Connection) => (
          <div className="conn-table-actions">
            <Tooltip content={t('connections.table.edit')} position="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(row)}
                circle
                color="sky"
              >
                <FaEdit size={14} />
              </Button>
            </Tooltip>
            <Tooltip content={t('connections.table.delete')} position="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(row)}
                circle
                style={{ color: 'var(--error)' }}
              >
                <FaTrashCan size={14} />
              </Button>
            </Tooltip>
            <Tooltip
              content={t('connections.table.viewDetails')}
              position="top"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedConnection(row)}
                circle
                style={{ color: 'var(--success)' }}
              >
                <EyeIcon size={14} />
              </Button>
            </Tooltip>
            <Tooltip
              content={t(
                'connections.table.connectionCoordinates',
                'Ver en mapa'
              )}
              position="top"
            >
              <Button
                size="sm"
                variant="ghost"
                color="red"
                onClick={() => onViewOnMap(row)}
                circle
              >
                <FaMapMarkerAlt size={14} />
              </Button>
            </Tooltip>
          </div>
        )
      }
    ],
    [onEdit, onDelete, t]
  );

  // ── PDF Export ────────────────────────────────────────────────────────────
  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<Connection>({
    data,
    availableColumns: columns
      .filter((c) => c.id)
      .map((c) => ({
        id: c.id as string,
        label: c.header as string,
        isDefault: true
      })),
    reportTitle: t('connections.table.reportTitle'),
    reportDescription: t('connections.table.reportDescription'),
    labelsHorizontal: {
      [t('readings.historyTable.readingDate')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows: [
      {
        label: t('connections.table.totalConnections'),
        value: data.length,
        highlight: true,
        columnId: 'connectionSector'
      }
    ],
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        connectionSector: String(item.connectionSector ?? '-'),
        clientId: item.clientId,
        connectionMeterNumber: item.connectionMeterNumber ?? '-',
        connectionCadastralKey: item.connectionCadastralKey ?? '-',
        connectionContractNumber: item.connectionContractNumber ?? '-',
        connectionRateName: item.connectionRateName ?? '-',
        connectionSewerage: item.connectionSewerage
          ? t('connections.table.yes')
          : t('connections.table.no'),
        connectionStatus: getConnectionStateChip(item.connectionStatus).label,
        connectionIsReadable: item.connectionIsReadable
          ? t('connections.table.yes')
          : t('connections.table.no')
      };
      return selectedCols.map((col) => rowData[col.id] || '-');
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        onSort={onSort}
        sortConfig={sortConfig}
        onExportPdf={() => setShowPdfPreview(true)}
        onEndReached={onEndReached}
        hasMore={hasMore}
        totalRows={[
          {
            label: t('connections.table.totalConnections'),
            value: data.length,
            highlight: true,
            columnId: 'connectionSector'
          }
        ]}
        width="100"
        emptyState={
          <EmptyState
            message={t('connections.table.noData')}
            description={t('connections.table.noDataDescription')}
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />

      <ConnectionDetailModal
        isOpen={selectedConnection !== null}
        onClose={() => setSelectedConnection(null)}
        connection={selectedConnection}
      />
      {PdfPreviewModal}
    </div>
  );
};

