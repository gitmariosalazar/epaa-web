import React, { useState, useEffect } from 'react';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { useAuditViewModel } from '../hooks/useAuditViewModel';
import type { AuditRegistroResponse } from '../../domain/models/AuditModels';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Calendar, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/DataLogsTable.module.css';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { BiTable, BiUser } from 'react-icons/bi';
import { MdOutlineDeleteForever, MdOutlineUpdate, MdPhoneIphone } from 'react-icons/md';
import { FaSquarePlus } from 'react-icons/fa6';

export const DataLogsTable: React.FC = () => {
  const { state, actions } = useAuditViewModel();
  const { auditLogs, isLoading, error: errorObj } = state;
  const { fetchAuditLogs } = actions;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditRegistroResponse | null>(
    null
  );

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
        <ColorChip
          color="var(--primary, #3b82f6)"
          label={row.tableName}
          variant="ghost"
          size="sm"
          borderRadius={4}
          icon={<BiTable size={16} />}
        />
      )
    },
    {
      header: 'Operación',
      accessor: (row) => {
        let color = 'var(--info, #3b82f6)';
        if (row.operation === 'INSERT') color = 'var(--success, #10b981)';
        if (row.operation === 'UPDATE') color = 'var(--warning, #f59e0b)';
        if (row.operation === 'DELETE') color = 'var(--danger, #ef4444)';
        let icon: React.ReactNode;
        if (row.operation === 'INSERT') icon = <FaSquarePlus size={16} />;
        if (row.operation === 'UPDATE') icon = <MdOutlineUpdate size={16} />;
        if (row.operation === 'DELETE') icon = <MdOutlineDeleteForever size={16} />;
        return (
          <ColorChip
            color={color}
            label={row.operation}
            variant="soft"
            size="xs"
            borderRadius={4}
            icon={icon}
          />
        );
      }
    },
    {
      header: 'Usuario',
      accessor: (row) => (
        <ColorChip
          color="var(--primary, #3b82f6)"
          label={row.username || row.userId || 'Sistema'}
          variant="ghost"
          size="sm"
          borderRadius={4}
          icon={<BiUser size={16} />}
        />
      )
    },
    {
      header: 'IP Modificador',
      accessor: (row) => (
        <ColorChip
          color="var(--primary, #3b82f6)"
          label={row.ipAddress || 'N/A'}
          variant="ghost"
          size="sm"
          borderRadius={4}
          icon={<MdPhoneIphone size={16} />}
        />
      )
    },
    {
      header: 'Fecha',
      accessor: (row) => (
        <ColorChip
          color="var(--primary, #3b82f6)"
          label={new Date(row.auditTimestamp).toLocaleString()}
          variant="ghost"
          size="sm"
          borderRadius={4}
          icon={<Calendar size={16} />}
        />
      )
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
        data={auditLogs}
        columns={columns}
        isLoading={isLoading}
        pagination={true}
        pageSize={15}
        fullHeight={true}
        emptyState={
          <EmptyState
            message="No se encontraron registros"
            description="No hay registros de auditoría que coincidan con los filtros seleccionados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
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
