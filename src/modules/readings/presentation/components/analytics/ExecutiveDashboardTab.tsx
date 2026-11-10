import React from 'react';
import {
  DollarSign,
  Droplets,
  FileCheck,
  Users,
  Receipt,
  TrendingUp,
  Gauge,
  AlertTriangle,
  Activity,
  Landmark,
  FileText
} from 'lucide-react';
import type { ExecutiveDashboardAnalytics } from '../../../domain/models/readings-analytics';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatVolume
} from '../../utils/analytics-formatters';

interface ExecutiveDashboardTabProps {
  data: ExecutiveDashboardAnalytics | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const ExecutiveDashboardTab: React.FC<ExecutiveDashboardTabProps> = ({
  data,
  isLoading
}) => {
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

  if (!data) {
    return (
      <EmptyState
        message="Sin información disponible"
        description="No se encontraron registros de analítica para los filtros seleccionados."
      />
    );
  }

  const hasRentasBreakdown =
    data.totalTitleUsd !== undefined || data.totalBilledEpaaUsd !== undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Primary KPI Grid */}
      <div className="analytics-kpi-grid">
        <KPICard
          label="Facturación Total Institucional (EPAA)"
          value={formatCurrency(data.totalBilledEpaaUsd ?? data.totalBilledUsd)}
          description={
            hasRentasBreakdown
              ? 'Títulos + Recargos + Intereses (Datos_ingreso)'
              : 'Total facturado en el periodo'
          }
          icon={<DollarSign size={20} />}
          color="primary"
        />
        <KPICard
          label="Volumen Total Consumido"
          value={formatVolume(data.totalVolumeM3)}
          description="Metros cúbicos medidos"
          icon={<Droplets size={20} />}
          color="info"
        />
        <KPICard
          label="Lecturas Procesadas"
          value={formatNumber(data.totalReadingsTaken)}
          description="Medidores registrados"
          icon={<FileCheck size={20} />}
          color="success"
        />
        <KPICard
          label="Cuentas Activas"
          value={formatNumber(data.totalActiveConnections)}
          description="Conexiones en padrón"
          icon={<Users size={20} />}
          color="purple"
        />
      </div>

      {/* Secondary KPI Grid */}
      <div className="analytics-kpi-grid">
        <KPICard
          label="Ticket Promedio por Cuenta"
          value={formatCurrency(data.averageTicketPerAccountUsd)}
          description="Ingreso medio mensual por cliente"
          icon={<Receipt size={20} />}
          color="cyan"
        />
        <KPICard
          label="Tarifa Media Ponderada"
          value={`${formatCurrency(data.weightedAverageEffectiveTariffUsdPerM3)}/m³`}
          description="Tarifa efectiva neta (Agua / m³)"
          icon={<TrendingUp size={20} />}
          color="amber"
        />
        <KPICard
          label="Consumo Promedio por Cuenta"
          value={formatVolume(data.averageConsumptionPerAccountM3)}
          description="Demanda media por usuario"
          icon={<Gauge size={20} />}
          color="primary"
        />
        <KPICard
          label="Incidencia de Novedades"
          value={`${data.operativeNoveltyPercentage?.toFixed(2) ?? '0.00'}%`}
          description={`${formatNumber(data.totalReadingsWithNovelty)} lecturas con novedad`}
          icon={<AlertTriangle size={20} />}
          color={data.operativeNoveltyPercentage > 15 ? 'danger' : 'warning'}
        />
      </div>

      {/* Detailed Analysis Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Institutional Revenue Breakdown (Rentas / EPAA) */}
        {hasRentasBreakdown && (
          <div className="analytics-card-section">
            <div className="analytics-card-header">
              <h4 className="analytics-card-title">
                <Landmark size={18} color="var(--primary-color, #2563eb)" />
                Liquidación de Rentas EPAA
              </h4>
              <span className="analytics-card-badge">Títulos & Cargos</span>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle, #f8fafc)'
                }}
              >
                <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Total Títulos de Ingreso
                </span>
                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {formatCurrency(data.totalTitleUsd)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle, #f8fafc)'
                }}
              >
                <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Tasa de Recolección de Basura
                </span>
                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {formatCurrency(data.totalTrashTaxUsd)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle, #f8fafc)'
                }}
              >
                <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Valores de Terceros
                </span>
                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {formatCurrency(data.totalThirdPartiesUsd)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle, #f8fafc)'
                }}
              >
                <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Intereses Devengados (Caché)
                </span>
                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {formatCurrency(data.totalInterestUsd)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle, #f8fafc)'
                }}
              >
                <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                  Recargos por Mora
                </span>
                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                  {formatCurrency(data.totalSurchargesUsd)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  borderTop: '2px solid var(--border-color, #e2e8f0)',
                  background: 'rgba(37, 99, 235, 0.04)'
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--text-primary, #0f172a)'
                  }}
                >
                  Facturación Total EPAA
                </span>
                <strong
                  style={{
                    fontSize: '1.15rem',
                    color: 'var(--primary-color, #2563eb)'
                  }}
                >
                  {formatCurrency(data.totalBilledEpaaUsd ?? data.totalBilledUsd)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Micromedición Tariff Breakdown */}
        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <FileText size={18} color="#059669" />
              Composición Tarifaria (Micromedición)
            </h4>
            <span className="analytics-card-badge">Lecturas de Red</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                Servicio de Agua Potable
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {formatCurrency(data.waterBilledUsd)}
              </strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                Servicio de Alcantarillado
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {formatCurrency(data.sewerBilledUsd)}
              </strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '8px',
                borderTop: '2px solid var(--border-color, #e2e8f0)',
                background: 'rgba(5, 150, 105, 0.04)'
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--text-primary, #0f172a)'
                }}
              >
                Subtotal Tarifa Medida
              </span>
              <strong
                style={{
                  fontSize: '1.15rem',
                  color: '#059669'
                }}
              >
                {formatCurrency(data.waterBilledUsd + data.sewerBilledUsd)}
              </strong>
            </div>
          </div>
        </div>

        {/* Operational Range and Coverage */}
        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <Activity size={18} color="#10b981" />
              Parámetros Operativos y Cobertura
            </h4>
            <span className="analytics-card-badge">Comportamiento Físico</span>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                Sectores Operativos Cubiertos
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {data.totalSectorsCovered ?? 0} sectores
              </strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                Consumo Mínimo Registrado
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {formatVolume(data.minConsumptionM3)}
              </strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #64748b)' }}>
                Consumo Máximo Registrado
              </span>
              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>
                {formatVolume(data.maxConsumptionM3)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
