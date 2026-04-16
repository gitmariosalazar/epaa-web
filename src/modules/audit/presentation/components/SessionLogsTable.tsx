import React, { useState, useEffect } from 'react';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { useAuditViewModel } from '../hooks/useAuditViewModel';
import type { AuditSessionResponse } from '../../domain/models/AuditModels';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import {
  Eye,
  User,
  Activity,
  Clock,
  Globe,
  MonitorSmartphone,
  AlertTriangle
} from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/SessionLogsTable.module.css';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';

export const SessionLogsTable: React.FC = () => {
  const { state, actions } = useAuditViewModel();
  const { sessionLogs, isLoading, error: errorObj } = state;
  const { fetchSessionLogs } = actions;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditSessionResponse | null>(
    null
  );

  useEffect(() => {
    fetchSessionLogs({ limit: 100, offset: 0 });
  }, [fetchSessionLogs]);

  const handleViewDetails = (log: AuditSessionResponse) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns: Column<AuditSessionResponse>[] = [
    {
      header: 'Usuario',
      accessor: (row) => row.username || row.userId || 'Sistema'
    },
    {
      header: 'Evento',
      accessor: (row) => {
        let color = 'var(--success, #10b981)';
        if (row.event === 'LOGOUT') color = 'var(--warning, #f59e0b)';
        if (row.event === 'LOGIN_FAILED') color = 'var(--danger, #ef4444)';
        return (
          <ColorChip color={color} label={row.event} variant="soft" size="sm" />
        );
      }
    },
    {
      header: 'IP',
      accessor: 'ipAddress'
    },
    {
      header: 'Navegador/Agente',
      accessor: (row) => (
        <span className={styles.userAgentLink} title={row.userAgent || ''}>
          {row.userAgent
            ? row.userAgent.length > 30
              ? row.userAgent.substring(0, 30) + '...'
              : row.userAgent
            : 'Desconocido'}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessor: (row) => new Date(row.auditTimestamp).toLocaleString()
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Eye size={14} />}
          onClick={() => handleViewDetails(row)}
        >
          Detalles
        </Button>
      )
    }
  ];

  return (
    <div
      className="conn-table-wrapper"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}
    >
      {errorObj && <div className={styles.errorMessage}>{errorObj}</div>}
      <Table
        data={sessionLogs}
        columns={columns}
        isLoading={isLoading}
        pagination={true}
        pageSize={15}
        width="100"
        fullHeight={true}
        emptyState={
          <EmptyState
            message="No se encontraron registros de sesiones"
            description="Intenta ajustar los filtros de búsqueda para ver los registros."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles de la Sesión"
      >
        {selectedLog && (
          <div className={styles.detailsContainer}>
            {/* Header info cards */}
            <div className={styles.headerGrid}>
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <User size={16} /> <span>Usuario</span>
                </div>
                <strong className={styles.cardValue}>
                  {selectedLog.username || selectedLog.userId || 'Sistema'}
                </strong>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <Activity size={16} /> <span>Evento</span>
                </div>
                <ColorChip
                  color={
                    selectedLog.event === 'LOGIN_FAILED'
                      ? 'var(--danger, #ef4444)'
                      : selectedLog.event === 'LOGOUT'
                        ? 'var(--warning, #f59e0b)'
                        : 'var(--success, #10b981)'
                  }
                  label={selectedLog.event}
                  variant="solid"
                  size="md"
                />
              </div>

              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <Clock size={16} /> <span>Fecha y Hora</span>
                </div>
                <strong className={styles.dateTimeValue}>
                  {new Date(selectedLog.auditTimestamp).toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Network / Device Info */}
            <div className={styles.networkDeviceBox}>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconIp}`}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className={styles.itemLabel}>Dirección IP</div>
                    <div className={styles.itemValue}>
                      {selectedLog.ipAddress || 'Desconocida'}
                    </div>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconDevice}`}>
                    <MonitorSmartphone size={20} />
                  </div>
                  <div>
                    <div className={styles.itemLabel}>
                      Navegador / Dispositivo
                    </div>
                    <div className={styles.itemValueAgent}>
                      {selectedLog.userAgent || 'Desconocido'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Failure Reason Alert */}
            {selectedLog.failureReason && (
              <div className={styles.failureAlert}>
                <AlertTriangle
                  size={20}
                  color="#ef4444"
                  className={styles.failureIcon}
                />
                <div>
                  <h4 className={styles.failureTitle}>
                    Motivo de Fallo Analizado
                  </h4>
                  <p className={styles.failureText}>
                    {selectedLog.failureReason}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata JSON block */}
            {selectedLog.metadata &&
              Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <h4 className={styles.metadataHeader}>
                    <Activity size={16} /> Metadata del Request
                  </h4>
                  <SyntaxHighlighter
                    language="json"
                    style={solarizedDarkAtom}
                    customStyle={{
                      background: 'var(--bg-secondary, #1e1e1e)',
                      padding: '1.25rem',
                      borderRadius: '8px',
                      margin: 0,
                      fontSize: '0.85em',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      border:
                        '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
                    }}
                  >
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </SyntaxHighlighter>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};
