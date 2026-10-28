/**
 * FinanceAndTrendsTab
 *
 * Tab 4: Finanzas, Costos Operativos, Tendencias Diarias y Concentración Territorial.
 * Clean Architecture — Presentation Layer.
 *
 * SOLID:
 *   SRP: Presentation of economic balance, material costs, temporal trends and geospatial density.
 *   DIP: Uses typed domain entities without any.
 */

import React, { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Package
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import type {
  DailyTrendItem,
  EconomicBalanceItem,
  MaterialCostItem,
  TerritorialConcentrationItem
} from '../../../../domain/schemas/models/dashboard/work-order-dashboard.models';

interface FinanceAndTrendsTabProps {
  materialCosts: MaterialCostItem[];
  economicBalance: EconomicBalanceItem[];
  dailyTrend: DailyTrendItem[];
  territorialConcentration: TerritorialConcentrationItem[];
}

export const FinanceAndTrendsTab: React.FC<FinanceAndTrendsTabProps> = ({
  materialCosts,
  economicBalance,
  dailyTrend,
  territorialConcentration
}) => {
  const latestBalance = economicBalance.length > 0 ? economicBalance[0] : null;

  // Format currency
  const formatCurrency = (val: number): string => {
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Sorted materials by cost descending
  const sortedMaterials = useMemo(() => {
    return [...materialCosts].sort((a, b) => b.costoTotalMateriales - a.costoTotalMateriales);
  }, [materialCosts]);

  // Total material expense across all entries
  const totalMaterialExpense = useMemo(() => {
    return materialCosts.reduce((acc, curr) => acc + curr.costoTotalMateriales, 0);
  }, [materialCosts]);

  // Formatted daily trend data for recharts
  const trendData = useMemo(() => {
    return dailyTrend.map((d) => ({
      fecha: d.fecha.length > 10 ? d.fecha.substring(5, 10) : d.fecha,
      incidentes: d.incidentesReportados,
      creadas: d.ordenesCreadas,
      completadas: d.ordenesCompletadas,
      balance: d.balanceFlujoNeto
    }));
  }, [dailyTrend]);

  return (
    <div className="wo-dashboard">
      {/* 1. Monthly Economic Balance Overview */}
      {latestBalance ? (
        <div className="wo-card-panel">
          <div className="wo-card-panel__header">
            <h3>
              <DollarSign size={18} style={{ color: 'var(--accent)' }} />
              Balance Económico Operativo Mensual
            </h3>
            <span className="wo-card-panel__header-tag">
              Período: {latestBalance.mes.split('T')[0]} • {latestBalance.totalOrdenes} OTs procesadas
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: '10px',
                padding: '1.125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e11d48', textTransform: 'uppercase' }}>
                Costo Operativo Incurrido (EPAA)
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48' }}>
                {formatCurrency(latestBalance.costoOperativoTotalIncurrido)}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Materiales: {formatCurrency(latestBalance.costoTotalMaterialesEpaa)} | Adicionales: {formatCurrency(latestBalance.costoTotalAdicionalesEpaa)}
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                padding: '1.125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
                Cobro Recuperable a Usuarios
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>
                {formatCurrency(latestBalance.montoCobrableAUsuarios)}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Monto facturable recuperable según normativa
              </span>
            </div>

            <div
              style={{
                backgroundColor:
                  latestBalance.balanceNetoRecuperacion >= 0
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'rgba(245, 158, 11, 0.05)',
                border: `1px solid ${latestBalance.balanceNetoRecuperacion >= 0
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(245, 158, 11, 0.2)'
                  }`,
                borderRadius: '10px',
                padding: '1.125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: latestBalance.balanceNetoRecuperacion >= 0 ? '#059669' : '#d97706',
                  textTransform: 'uppercase'
                }}
              >
                Balance Neto de Recuperación
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: latestBalance.balanceNetoRecuperacion >= 0 ? '#059669' : '#d97706'
                }}
              >
                {formatCurrency(latestBalance.balanceNetoRecuperacion)}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                {latestBalance.balanceNetoRecuperacion >= 0
                  ? 'Superávit / Recuperación completa'
                  : 'Déficit operativo absorbido'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="wo-empty-card">No hay balance económico mensual disponible</div>
      )}

      {/* 2. Daily Trend Chart */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            Tendencia Diaria de Flujo: Reportes vs Creadas vs Resueltas
          </h3>
          <span className="wo-card-panel__header-tag">{trendData.length} días de registro</span>
        </div>

        {trendData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncidentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCreadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="fecha" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="incidentes"
                  name="Incidentes Reportados"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorIncidentes)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="creadas"
                  name="OTs Creadas"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCreadas)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completadas"
                  name="OTs Completadas"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCompletadas)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="wo-empty-card">No hay datos de tendencias temporales disponibles</div>
        )}
      </div>

      {/* 3. Material Costs & Consumption Ranking */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <Package size={18} style={{ color: 'var(--accent)' }} />
            Consumo y Costo de Materiales en Campo
          </h3>
          <span className="wo-card-panel__header-tag">
            Total Invertido: {formatCurrency(totalMaterialExpense)}
          </span>
        </div>

        {sortedMaterials.length > 0 ? (
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Código Material</th>
                  <th>Descripción del Material</th>
                  <th>Departamento</th>
                  <th>Tipo de Trabajo</th>
                  <th>Cantidad Consumida</th>
                  <th>Costo Unitario</th>
                  <th>Costo Total</th>
                  <th>Órdenes</th>
                </tr>
              </thead>
              <tbody>
                {sortedMaterials.map((m, idx) => (
                  <tr key={`${m.codigoMaterial || m.descripcionMaterial}-${idx}`}>
                    <td style={{ fontWeight: 600 }}>{m.codigoMaterial || 'S/C'}</td>
                    <td style={{ fontWeight: 700 }}>{m.descripcionMaterial}</td>
                    <td>
                      <span className="wo-badge wo-badge--slate">{m.departamento}</span>
                    </td>
                    <td>{m.tipoTrabajo}</td>
                    <td style={{ fontWeight: 600 }}>{m.cantidadTotalConsumida.toLocaleString()}</td>
                    <td>{m.costoUnitarioPromedio !== null ? formatCurrency(m.costoUnitarioPromedio) : '—'}</td>
                    <td style={{ fontWeight: 800, color: 'var(--palette-blue)' }}>
                      {formatCurrency(m.costoTotalMateriales)}
                    </td>
                    <td>
                      <span className="wo-badge wo-badge--blue">{m.ordenesQueLoUtilizaron} OTs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="wo-empty-card">No hay registros de consumo de materiales</div>
        )}
      </div>

      {/* 4. Territorial Concentration & Geospatial Density */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <MapPin size={18} style={{ color: 'var(--accent)' }} />
            Concentración Territorial y Densidad por Parroquia / Sector
          </h3>
          <span className="wo-card-panel__header-tag">{territorialConcentration.length} sectores</span>
        </div>

        {territorialConcentration.length > 0 ? (
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Parroquia</th>
                  <th>Sector</th>
                  <th>Incidentes Zona</th>
                  <th>Total OTs Zona</th>
                  <th>OTs Activas Campo</th>
                  <th>Incidentes Críticos</th>
                  <th>Coordenadas Centroide</th>
                </tr>
              </thead>
              <tbody>
                {territorialConcentration.map((t, idx) => (
                  <tr key={`${t.parroquia}-${t.sectorHidrometrico}-${idx}`}>
                    <td style={{ fontWeight: 700 }}>{t.parroquia}</td>
                    <td style={{ fontWeight: 600 }}>{t.sectorHidrometrico}</td>
                    <td>{t.totalIncidentesZona}</td>
                    <td style={{ fontWeight: 600 }}>{t.totalOtsZona}</td>
                    <td>
                      <span className="wo-badge wo-badge--blue">{t.otsActivasEnCampo}</span>
                    </td>
                    <td>
                      {t.incidentesCriticos > 0 ? (
                        <span className="wo-badge wo-badge--rose">{t.incidentesCriticos}</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {t.latitudCentroide !== null && t.longitudCentroide !== null
                        ? `${t.latitudCentroide.toFixed(4)}, ${t.longitudCentroide.toFixed(4)}`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="wo-empty-card">No hay datos de distribución territorial disponibles</div>
        )}
      </div>
    </div>
  );
};
