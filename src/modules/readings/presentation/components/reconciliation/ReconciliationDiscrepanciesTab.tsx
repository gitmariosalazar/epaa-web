import React, { useEffect } from 'react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { DetalleAuditoriaResponse, LecturaAuditoriaDetalleItem } from '../../../domain/models/lecturas-reconciliation';
import { ShieldAlert } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface Props {
  dataResponse: DetalleAuditoriaResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReconciliationDiscrepanciesTab: React.FC<Props> = ({
  dataResponse,
  isLoading,
  onRefresh
}) => {
  const progress = useSimulatedProgress(isLoading);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'OK': return 'green';
      case 'DIFERENTE': return 'red';
      case 'DUPLICADO_EN_SQL_SERVER': return 'amber';
      case 'SOLO_EN_POSTGRES': return 'blue';
      default: return 'gray';
    }
  };

  const columns: Column<LecturaAuditoriaDetalleItem>[] = [
    {
      header: 'ID Acometida',
      accessor: (item) => <span style={{ fontWeight: 600 }}>{item.acometida_id}</span>,
      id: 'acometida_id'
    },
    {
      header: 'Mes Lectura',
      accessor: (item) => <span>{item.mes_lectura}</span>,
      id: 'mes_lectura'
    },
    {
      header: 'Lectura Anterior (PG | AP)',
      accessor: (item) => (
        <span>{item.pg_lectura_anterior} | {item.ap_lectura_anterior ?? '-'}</span>
      ),
      id: 'lectura_anterior'
    },
    {
      header: 'Lectura Actual (PG | AP)',
      accessor: (item) => (
        <span>{item.pg_lectura_actual} | {item.ap_lectura_actual ?? '-'}</span>
      ),
      id: 'lectura_actual'
    },
    {
      header: 'Registros (Legacy)',
      accessor: (item) => <span>{item.total_en_sql_server}</span>,
      id: 'total_en_sql_server',
      style: { width: '130px', textAlign: 'center' }
    },
    {
      header: 'Estado',
      accessor: (item) => (
        <ColorChip
          label={item.status.replace(/_/g, ' ')}
          color={getStatusColor(item.status)}
          variant="soft"
          size="xs"
        />
      ),
      id: 'status',
      style: { width: '180px' }
    }
  ];

  if (isLoading && (!dataResponse || dataResponse.data.length === 0)) {
    return (
      <div className="circular-progress">
        <CircularProgress progress={progress} size={80} label="Cargando detalles..." />
      </div>
    );
  }

  const items = dataResponse?.data || [];

  return (
    <div className="reconciliation-tab-content">
      <Table<LecturaAuditoriaDetalleItem>
        data={items}
        columns={columns}
        isLoading={isLoading}
        loadingState={
          <div className="circular-progress">
            <CircularProgress progress={progress} size={80} label="Actualizando datos..." />
          </div>
        }
        emptyState={
          <EmptyState
            message="Sin Discrepancias"
            description="No se encontraron registros para los filtros seleccionados."
            icon={ShieldAlert}
            variant="info"
            minHeight="300px"
          />
        }
        pagination={true}
      />
    </div>
  );
};
