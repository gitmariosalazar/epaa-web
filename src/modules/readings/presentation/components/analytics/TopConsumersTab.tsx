import React, { useMemo, useState } from 'react';
import { Search, Trophy, Droplets, DollarSign } from 'lucide-react';
import type { TopConsumerAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Input } from '@/shared/presentation/components/Input/Input';
import {
  formatCurrency,
  formatNumber,
  formatVolume
} from '../../utils/analytics-formatters';

interface TopConsumersTabProps {
  data: TopConsumerAnalytics[] | null;
  isLoading: boolean;
}

export const TopConsumersTab: React.FC<TopConsumersTabProps> = ({
  data,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(
      (c) =>
        String(c.account).includes(term) ||
        (c.cadastralKey && c.cadastralKey.toLowerCase().includes(term)) ||
        (c.clientName && c.clientName.toLowerCase().includes(term)) ||
        (c.meterNumber && c.meterNumber.toLowerCase().includes(term)) ||
        (c.novelty && c.novelty.toLowerCase().includes(term))
    );
  }, [data, searchTerm]);

  const summary = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { totalVolume: 0, totalBilled: 0 };
    }
    const totalVolume = filteredData.reduce(
      (acc, c) => acc + c.consumedVolumeM3,
      0
    );
    const totalBilled = filteredData.reduce(
      (acc, c) => acc + c.totalBilledUsd,
      0
    );
    return { totalVolume, totalBilled };
  }, [filteredData]);

  const columns: Column<TopConsumerAnalytics>[] = useMemo(
    () => [
      {
        header: '#',
        accessor: (_item, index?: number) => (
          <span
            style={{ fontWeight: 600, color: 'var(--text-secondary, #64748b)' }}
          >
            {(index ?? 0) + 1}
          </span>
        )
      },
      {
        header: 'Sector',
        accessor: (item) => (
          <span
            style={{ fontWeight: 600, color: 'var(--primary-color, #2563eb)' }}
          >
            Sec {item.sector}
          </span>
        ),
        sortable: true,
        sortKey: 'sector'
      },
      {
        header: 'Cuenta',
        accessor: (item) => (
          <span
            style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}
          >
            {item.account}
          </span>
        ),
        sortable: true,
        sortKey: 'account'
      },
      {
        header: 'Clave Catastral',
        accessor: (item) => item.cadastralKey || '-'
      },
      {
        header: 'Medidor',
        accessor: (item) => item.meterNumber || '-'
      },
      {
        header: 'Cliente / Abonado',
        accessor: (item) => (
          <span style={{ fontWeight: 500 }}>
            {item.clientName || 'CONSUMIDOR REGISTRADO'}
          </span>
        )
      },
      {
        header: 'Lect. Ant.',
        accessor: (item) => formatNumber(item.previousReading),
        isNumeric: true
      },
      {
        header: 'Lect. Act.',
        accessor: (item) => formatNumber(item.currentReading),
        isNumeric: true
      },
      {
        header: 'Consumo',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#2563eb' }}>
            {formatVolume(item.consumedVolumeM3)}
          </span>
        ),
        sortable: true,
        sortKey: 'consumedVolumeM3',
        isNumeric: true
      },
      {
        header: 'Total Facturado ($)',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#059669' }}>
            {formatCurrency(item.totalBilledUsd)}
          </span>
        ),
        sortable: true,
        sortKey: 'totalBilledUsd',
        isNumeric: true
      },
      {
        header: 'Novedad',
        accessor: (item: TopConsumerAnalytics) => (
          <span
            style={{
              fontSize: '0.8rem',
              color: item.novelty ? '#ef4444' : 'var(--text-secondary, #64748b)'
            }}
          >
            {item.novelty || 'NORMAL'}
          </span>
        )
      },
      {
        header: 'Fecha',
        accessor: (item) =>
          item.readingDate ? item.readingDate.substring(0, 10) : '-'
      }
    ],
    []
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '350px'
        }}
      >
        <CircularProgress size={40} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="Sin registros de altos consumidores"
        description="No se identificaron cuentas que superen el umbral mínimo de consumo para este periodo."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner & Quick stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '12px',
          padding: '1rem 1.25rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={18} color="#f59e0b" />
            <span
              style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}
            >
              {filteredData.length} Grandes Consumidores
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Droplets size={18} color="#2563eb" />
            <span style={{ color: 'var(--text-secondary, #64748b)' }}>
              Volumen Acumulado:
            </span>
            <strong style={{ color: '#2563eb' }}>
              {formatVolume(summary.totalVolume)}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="#059669" />
            <span style={{ color: 'var(--text-secondary, #64748b)' }}>
              Facturación Acumulada:
            </span>
            <strong style={{ color: '#059669' }}>
              {formatCurrency(summary.totalBilled)}
            </strong>
          </div>
        </div>

        <div style={{ minWidth: '240px' }}>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cuenta, clave, cliente..."
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Outliers Table */}
      <div className="analytics-card-section">
        <Table<TopConsumerAnalytics>
          data={filteredData}
          columns={columns}
          pagination={true}
          pageSize={15}
          width="100"
        />
      </div>
    </div>
  );
};
