import React, { useEffect, useMemo, useState } from 'react';
import { useConnectionDashboard } from '../../hooks/useConnectionDashboard';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
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

          {/* Table: Zones */}
          <section className={styles.tableSection}>
            <h3 className={styles.chartTitle}>Rendimiento por Zona</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.zonesTable}>
                <thead>
                  <tr>
                    <th>ID Zona</th>
                    <th>Total Acometidas</th>
                    <th>Completados (100%)</th>
                    <th>Pendientes (Faltan datos)</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.porZonas || []).map((zona) => {
                    const total = Number(zona.total);
                    const completados = Number(zona.completados);
                    const pendientes = Number(zona.pendientes);
                    const pct =
                      total > 0
                        ? ((completados / total) * 100).toFixed(1)
                        : '0';

                    return (
                      <tr key={zona.zona_id}>
                        <td>
                          <strong>Zona {zona.zona_id}</strong>
                        </td>
                        <td>{total.toLocaleString()}</td>
                        <td>
                          <span className={`${styles.badge} ${styles.success}`}>
                            {completados.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${styles.warning}`}>
                            {pendientes.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <span>{pct}%</span>
                            <div
                              style={{
                                flex: 1,
                                height: '6px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  backgroundColor: '#00aeff'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
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
