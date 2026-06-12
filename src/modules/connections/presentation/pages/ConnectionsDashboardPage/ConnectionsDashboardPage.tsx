import React, { useEffect, useMemo, useState } from 'react';
import { useConnectionDashboard } from '../../hooks/useConnectionDashboard';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import {
  Activity,
  Target,
  Layers,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import styles from './ConnectionsDashboardPage.module.css';

export const ConnectionsDashboardPage: React.FC = () => {
  const { data, isLoading, error, fetchStats } = useConnectionDashboard();
  const [activeTab, setActiveTab] = useState<'update' | 'general'>('update');

  interface ZonaRow {
    zona_id: number;
    total: number;
    completados: number;
    pendientes: number;
  }

  interface SectorRow {
    sector: number;
    total: number;
    totalActualizadas: number;
    pendientes: number;
    porcentaje: number;
    sinGeolocalizacion: number;
    sinPredio: number;
    sinCliente: number;
  }

  const zonasColumns = useMemo<Column<ZonaRow>[]>(() => [
    {
      header: 'ID Zona',
      accessor: (item) => <strong>Zona {item.zona_id}</strong>
    },
    {
      header: 'Total Acometidas',
      accessor: (item) => item.total.toLocaleString()
    },
    {
      header: 'Completados (100%)',
      accessor: (item) => (
        <span className={`${styles.badge} ${styles.success}`}>
          {item.completados.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Pendientes (Faltan datos)',
      accessor: (item) => (
        <span className={`${styles.badge} ${styles.warning}`}>
          {item.pendientes.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Progreso',
      accessor: (item) => {
        const total = Number(item.total);
        const completados = Number(item.completados);
        const pct = total > 0 ? ((completados / total) * 100).toFixed(1) : '0';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
            <span>{pct}%</span>
            <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#00aeff' }} />
            </div>
          </div>
        );
      }
    }
  ], []);

  const sectoresColumns = useMemo<Column<SectorRow>[]>(() => [
    {
      header: 'Sector',
      accessor: (item) => <strong>Sector {item.sector}</strong>
    },
    {
      header: 'Total Acometidas',
      accessor: (item) => item.total.toLocaleString()
    },
    {
      header: 'Actualizadas',
      accessor: (item) => (
        <span className={`${styles.badge} ${styles.success}`}>
          {item.totalActualizadas.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Pendientes',
      accessor: (item) => (
        <span className={`${styles.badge} ${styles.warning}`}>
          {item.pendientes.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Faltantes por Dimensión',
      accessor: (item) => (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {item.sinGeolocalizacion > 0 && (
            <span className={styles.missingBadge} title="Falta Geolocalización">
              📍 GPS: {item.sinGeolocalizacion}
            </span>
          )}
          {item.sinPredio > 0 && (
            <span className={styles.missingBadge} title="Falta Ficha Predial">
              🏢 Predio: {item.sinPredio}
            </span>
          )}
          {item.sinCliente > 0 && (
            <span className={styles.missingBadge} title="Falta Contacto Cliente">
              👤 Cliente: {item.sinCliente}
            </span>
          )}
          {item.sinGeolocalizacion === 0 && item.sinPredio === 0 && item.sinCliente === 0 && (
            <span className={styles.allCorrectBadge}>✓ Todo al día</span>
          )}
        </div>
      )
    },
    {
      header: 'Progreso',
      accessor: (item) => {
        const pct = Number(item.porcentaje).toFixed(1);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
            <span>{pct}%</span>
            <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#10b981' }} />
            </div>
          </div>
        );
      }
    }
  ], []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const donutSlices: DonutSlice[] = useMemo(() => {
    if (!data?.distribucion) return [];

    // Assign professional semantic colors based on the category string
    return data.distribucion.map((item) => {
      let color = '#9ca3af'; // default gray
      if (item.categoria.includes('Completado'))
        color = '#10b981'; // Green
      else if (item.categoria.includes('Cliente'))
        color = '#f59e0b'; // Orange
      else if (item.categoria.includes('Predial'))
        color = '#3b82f6'; // Blue
      else if (item.categoria.includes('Geolocalización')) color = '#8b5cf6'; // Violet

      return {
        label: item.categoria,
        value: Number(item.cantidad),
        color
      };
    });
  }, [data]);

  const tarifasSlices: DonutSlice[] = useMemo(() => {
    if (!data?.distribucionTarifas) return [];
    const colors = [
      '#3b82f6',
      '#f59e0b',
      '#10b981',
      '#8b5cf6',
      '#ec4899',
      '#6366f1'
    ];
    return data.distribucionTarifas.map((item, index) => ({
      label: item.tarifa || 'Sin Tarifa',
      value: Number(item.cantidad),
      color: colors[index % colors.length]
    }));
  }, [data]);

  const totalAlcantarillado = useMemo(() => {
    if (!data?.coberturaAlcantarillado) return 0;
    return (
      Number(data.coberturaAlcantarillado.con_alcantarillado) +
      Number(data.coberturaAlcantarillado.sin_alcantarillado)
    );
  }, [data]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Activity size={32} className="animate-spin" />
          <span>Cargando estadísticas de avance...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>No se pudo cargar el dashboard: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const headerContent = (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>Dashboard de Acometidas</h1>
        <p className={styles.subtitle}>
          Monitoreo del progreso de actualización y estado de las acometidas.
        </p>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'update' ? styles.active : ''}`}
          onClick={() => setActiveTab('update')}
        >
          <Activity size={16} /> Progreso de Actualización
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Layers size={16} /> Infraestructura General
        </button>
      </div>
    </header>
  );

  return (
    <PageLayout header={headerContent} className={styles.dashboardContainer}>
      {activeTab === 'update' && (
        <div className={styles.tabContent}>
          {/* KPIs Update */}
          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Layers size={18} /> Total de Acometidas
              </h3>
              <p className={styles.kpiValue}>
                {data.resumen.total_universo.toLocaleString()}
              </p>
              <p className={styles.kpiDescription}>
                {data.resumen.actualizaciones_hoy.toLocaleString()} de{' '}
                {data.resumen.total_universo.toLocaleString()}
              </p>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Target size={18} /> Progreso Consolidado
              </h3>
              <p className={`${styles.kpiValue} ${styles.accent}`}>
                {data.resumen.pct_progreso_total}%
              </p>
              <p className={styles.kpiDescription}>
                {data.resumen.actualizaciones_hoy.toLocaleString()} de{' '}
                {data.resumen.total_universo.toLocaleString()}
              </p>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTitle}>
                <h3 className={styles.kpiTitle}>
                  <CheckCircle2 size={18} /> Actualizados Hoy
                </h3>
                <span className={`${styles.kpiTitle} date-kpi`}>
                  <Clock size={18} /> {new Date().toLocaleString()}
                </span>
              </div>
              <p className={`${styles.kpiValue} ${styles.success}`}>
                +{data.resumen.actualizaciones_hoy.toLocaleString()}
              </p>
              <p className={styles.kpiDescription}>
                {data.resumen.actualizaciones_hoy.toLocaleString()} de{' '}
                {data.resumen.total_universo.toLocaleString()}
              </p>
            </div>
          </section>

          {/* Charts Update */}
          <section className={styles.chartsGrid}>
            <div className={styles.chartCard} style={{ flex: 2 }}>
              <h3 className={styles.chartTitle}>
                Histórico de Completados (30 días)
              </h3>
              <div className={styles.chartContent}>
                <GradientAreaChart
                  data={data.historico.map((h) => ({
                    ...h,
                    registros_completados: Number(h.registros_completados)
                  }))}
                  dataKeyX="fecha"
                  dataKeyY="registros_completados"
                  nameX="Fecha"
                  nameY="Acometidas Actualizadas"
                  startColor="#00aeffff"
                  endColor="#3c149aff"
                  showDots={true}
                  tooltipFormatterOrComponent={(payload) =>
                    `${payload.registros_completados} actualizadas`
                  }
                />
              </div>
            </div>

            <DonutChart
              title="Distribución de Estados"
              slices={donutSlices}
              centerLabel="Total"
              centerValue={data.resumen.total_universo.toLocaleString()}
              description="Estado de los registros"
            />
          </section>

          {/* Embudo de Calidad (Funnel Chart) */}
          {data.embudo && data.embudo.length > 0 && (
            <section className={styles.funnelSection}>
              <div className={styles.chartCard} style={{ minHeight: 'auto' }}>
                <h3 className={styles.chartTitle}>Embudo de Calidad y Completitud</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9e9e9e)', margin: '-0.5rem 0 1.5rem 0' }}>
                  Flujo de decantación catastral y validación física de las conexiones.
                </p>
                <div className={styles.funnelContainer}>
                  {data.embudo.map((step, idx) => {
                    const firstStepTotal = data.embudo[0].total || 1;
                    const percentOfTotal = ((step.total / firstStepTotal) * 100).toFixed(1);
                    
                    const widths = ['100%', '85%', '70%', '55%'];
                    const colors = ['#3b82f6', '#00aeff', '#8b5cf6', '#10b981'];
                    
                    return (
                      <div key={idx} className={styles.funnelStepRow}>
                        <div className={styles.funnelStepLabel}>
                          <strong>{step.paso}</strong>
                          <span>{step.total.toLocaleString()} acometidas</span>
                        </div>
                        <div className={styles.funnelStepBarWrapper}>
                          <div 
                            className={styles.funnelStepBar} 
                            style={{ 
                              width: widths[idx % widths.length],
                              backgroundColor: colors[idx % colors.length],
                              height: '28px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              paddingLeft: '0.75rem',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                              transition: 'all 0.4s ease'
                            }}
                          >
                            {percentOfTotal}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Table: Zones */}
          <section className={styles.tableSection}>
            <h3 className={styles.chartTitle}>Rendimiento por Zona</h3>
            <Table
              data={data.porZonas || []}
              columns={zonasColumns}
              showColumnModal={false}
              showTotalRecords={false}
              showRowsPerPage={false}
              fullHeight={false}
            />
          </section>

          {/* Table: Sectores */}
          {data.porSectores && data.porSectores.length > 0 && (
            <section className={styles.tableSection}>
              <h3 className={styles.chartTitle}>Auditoría y Avance por Sector</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9e9e9e)', margin: '-0.5rem 0 1rem 0' }}>
                Detalle del avance de actualización catastral por sectores geográficos y desglose de datos faltantes.
              </p>
              <Table
                data={data.porSectores}
                columns={sectoresColumns}
                showColumnModal={false}
                showTotalRecords={false}
                showRowsPerPage={false}
                fullHeight={false}
              />
            </section>
          )}
        </div>
      )}

      {activeTab === 'general' && (
        <div className={styles.tabContent}>
          {/* General KPIs Row 1 */}
          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Users size={18} /> Población Beneficiada
              </h3>
              <p className={styles.kpiValue}>
                {data.poblacionServida?.total_habitantes?.toLocaleString() || 0}
              </p>
              <span
                style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
              >
                Habitantes abastecidos estimados
              </span>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <Zap size={18} /> Red Operativa
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>Activas vs Inactivas</span>
                  <strong>
                    {data.estadoRed?.activas?.toLocaleString() || 0} func.
                  </strong>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${(Number(data.estadoRed?.activas || 0) / (Number(data.estadoRed?.activas || 0) + Number(data.estadoRed?.inactivas || 0) || 1)) * 100}%`,
                      height: '100%',
                      backgroundColor: '#00aeff'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>Cobertura Medidores Físicos</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>Acometidas con medidor real</span>
                  <strong>
                    {(
                      (Number(data.coberturaMedidores?.con_medidor || 0) /
                        (Number(data.coberturaMedidores?.con_medidor || 0) +
                          Number(data.coberturaMedidores?.sin_medidor || 0) ||
                          1)) *
                      100
                    ).toFixed(1)}
                    %
                  </strong>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${(Number(data.coberturaMedidores?.con_medidor || 0) / (Number(data.coberturaMedidores?.con_medidor || 0) + Number(data.coberturaMedidores?.sin_medidor || 0) || 1)) * 100}%`,
                      height: '100%',
                      backgroundColor: '#10b981'
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* General KPIs Row 2 */}
          <section className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>Cobertura Alcantarillado</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>Con servicio</span>
                  <strong>
                    {(
                      (Number(
                        data.coberturaAlcantarillado?.con_alcantarillado || 0
                      ) /
                        (totalAlcantarillado || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </strong>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${(Number(data.coberturaAlcantarillado?.con_alcantarillado || 0) / (totalAlcantarillado || 1)) * 100}%`,
                      height: '100%',
                      backgroundColor: '#10b981'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>
                <MapPin size={16} /> Precisión GPS Promedio
              </h3>
              <p
                className={`${styles.kpiValue} ${styles.accent}`}
                style={{ color: '#8b5cf6' }}
              >
                {data.calidadGps?.precision_promedio || 0}m
              </p>
            </div>

            <div className={styles.kpiCard}>
              <h3 className={styles.kpiTitle}>Nuevas Inst. (Año Act.)</h3>
              <p className={styles.kpiValue}>
                {(data.instalacionesRecientesCoords?.length || 0) > 99
                  ? '100+'
                  : data.instalacionesRecientesCoords?.length || 0}
              </p>
              <span
                style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
              >
                Mapeables en GIS
              </span>
            </div>
          </section>

          {/* General Charts */}
          <section className={styles.chartsGrid}>
            <div className={styles.chartCard} style={{ flex: 2 }}>
              <h3 className={styles.chartTitle}>
                Curva de Crecimiento (Acometidas en últimos 12 meses)
              </h3>
              <div className={styles.chartContent}>
                <GradientAreaChart
                  data={(data.curvaCrecimiento || []).map((h) => ({
                    ...h,
                    nuevas_acometidas: Number(h.nuevas_acometidas)
                  }))}
                  dataKeyX="mes"
                  dataKeyY="nuevas_acometidas"
                  nameX="Mes"
                  nameY="Instalaciones Nuevas"
                  startColor="#10b981"
                  endColor="#f59e0b"
                  showDots={true}
                  tooltipFormatterOrComponent={(payload) =>
                    `${payload.nuevas_acometidas} instalaciones`
                  }
                />
              </div>
            </div>

            <DonutChart
              title="Distribución por Tarifas"
              slices={tarifasSlices}
              centerLabel="Tarifas"
              centerValue={tarifasSlices.length.toString()}
              description="Clasificación comercial"
            />
          </section>
        </div>
      )}
    </PageLayout>
  );
};
