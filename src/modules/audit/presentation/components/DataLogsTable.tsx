import React, { useState, useEffect } from 'react';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { useAuditViewModel } from '../hooks/useAuditViewModel';
import type { AuditRegistroResponse } from '../../domain/models/AuditModels';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/DataLogsTable.module.css';

export const DataLogsTable: React.FC = () => {
  const { state, actions } = useAuditViewModel();
  const { auditLogs, isLoading, error: errorObj } = state;
  const { fetchAuditLogs } = actions;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditRegistroResponse | null>(null);

  useEffect(() => {
    fetchAuditLogs({ limit: 100, offset: 0 });
  }, [fetchAuditLogs]);

  const handleViewDetails = (log: AuditRegistroResponse) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns: Column<AuditRegistroResponse>[] = [
    {
      header: 'Tabla',
      accessor: (row) => (
        <span className={styles.tableName}>{row.tableName}</span>
      )
    },
    {
      header: 'Operación',
      accessor: (row) => {
        let color = 'var(--info, #3b82f6)';
        if (row.operation === 'INSERT') color = 'var(--success, #10b981)';
        if (row.operation === 'UPDATE') color = 'var(--warning, #f59e0b)';
        if (row.operation === 'DELETE') color = 'var(--danger, #ef4444)';
        return (
          <ColorChip
            color={color}
            label={row.operation}
            variant="soft"
            size="sm"
          />
        );
      }
    },
    {
      header: 'Usuario',
      accessor: (row) => row.username || row.userId || 'Sistema'
    },
    {
      header: 'IP Modificador',
      accessor: 'ipAddress'
    },
    {
      header: 'Fecha',
      accessor: (row) => new Date(row.auditTimestamp).toLocaleString()
    },
    {
      header: 'Auditoría',
      accessor: (row) => (
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Eye size={14} />}
          onClick={() => handleViewDetails(row)}
        >
          Cambios
        </Button>
      )
    }
  ];

  return (
    <div className="conn-table-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {errorObj && (
        <div className={styles.errorMessage}>{errorObj}</div>
      )}
      <Table
        data={auditLogs}
        columns={columns}
        isLoading={isLoading}
        pagination={true}
        pageSize={15}
        fullHeight={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Comparación de Cambios en la Base de Datos"
        size="lg"
      >
        {selectedLog && (
          <div className={styles.modalContent}>
            <div className={styles.comparisonGrid}>
              <div>
                <h4 className={`${styles.sectionTitle} ${styles.titleOld}`}>
                  Datos Anteriores (Old)
                </h4>
                <SyntaxHighlighter
                  language="json"
                  style={solarizedDarkAtom}
                  customStyle={{
                    background: 'var(--bg-secondary, #1e1e1e)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.85em',
                    margin: 0,
                    overflowX: 'auto',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {JSON.stringify(selectedLog.dataBefore, null, 2) || 'N/A'}
                </SyntaxHighlighter>
              </div>
              <div>
                <h4 className={`${styles.sectionTitle} ${styles.titleNew}`}>
                  Datos Nuevos (New)
                </h4>
                <SyntaxHighlighter
                  language="json"
                  style={solarizedDarkAtom}
                  customStyle={{
                    background: 'var(--bg-secondary, #1e1e1e)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.85em',
                    margin: 0,
                    overflowX: 'auto',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {JSON.stringify(selectedLog.dataAfter, null, 2) || 'N/A'}
                </SyntaxHighlighter>
              </div>
            </div>
            {selectedLog.diffJsonb && (
              <div>
                <h4 className={`${styles.sectionTitle} ${styles.titleDiff}`}>
                  Diferencias Rápidas
                </h4>
                <SyntaxHighlighter
                  language="json"
                  style={solarizedDarkAtom}
                  customStyle={{
                    background: 'var(--bg-secondary, #1e1e1e)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.85em',
                    margin: 0,
                    overflowX: 'auto',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {JSON.stringify(selectedLog.diffJsonb, null, 2)}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
