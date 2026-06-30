import React, { useEffect, useMemo, useState } from 'react';
import { useConnectionDashboard } from '../../hooks/useConnectionDashboard';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import {
  Activity,
  Target,
  Layers,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import styles from './ConnectionsDashboardPage.module.css';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import {
  APIProvider,
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import {
  DARK_MAP_STYLE,
  SILVER_MAP_STYLE
} from '../../components/Map/MapStyles';
import type { LiveMapConnectionResponse } from '../../../domain/models/DashboardStats';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

const MapController: React.FC<{
  theme: string;
  selectedPin: LiveMapConnectionResponse | null;
}> = ({ theme, selectedPin }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.setOptions({
      styles: theme === 'dark' ? DARK_MAP_STYLE : SILVER_MAP_STYLE
    });
  }, [map, theme]);

  useEffect(() => {
    if (!map || !selectedPin) return;
    map.panTo({
      lat: Number(selectedPin.latitude),
      lng: Number(selectedPin.longitude)
    });
    if (map.getZoom() < 16) {
      map.setZoom(16);
    }
  }, [map, selectedPin]);

  return null;
};

export const ConnectionsDashboardPage: React.FC = () => {
  const { data, liveData, isLoading, error, fetchStats, fetchLiveData } =
    useConnectionDashboard();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'update' | 'general' | 'map'>(
    'update'
  );
  const [selectedPin, setSelectedPin] =
    useState<LiveMapConnectionResponse | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLiveData = useMemo(() => {
    if (!searchQuery.trim()) return liveData;
    const q = searchQuery.toLowerCase().trim();
    return liveData.filter((conn) => {
      return (
        (conn.clientName || '').toLowerCase().includes(q) ||
        (conn.cadastralKey || '').toLowerCase().includes(q) ||
        (conn.sector?.toString() || '').toLowerCase().includes(q) ||
        (conn.address || '').toLowerCase().includes(q)
      );
    });
  }, [liveData, searchQuery]);

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

  const zonasColumns = useMemo<Column<ZonaRow>[]>(
    () => [
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
          const pct =
            total > 0 ? ((completados / total) * 100).toFixed(1) : '0';
          return (
            <ProgressBar
              value={Number(pct)}
              color={getTrafficLightColor(Number(pct))}
            />
          );
        }
      }
    ],
    []
  );

  const sectoresColumns = useMemo<Column<SectorRow>[]>(
    () => [
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
              <Tooltip
                content={`Falta Geolocalización. No esta geolocalizada.`}
                themeColor="info"
                followCursor={false}
                position="top"
              >
                <span className={styles.missingBadge}>
                  📍 GPS: {item.sinGeolocalizacion}
                </span>
              </Tooltip>
            )}
            {item.sinPredio > 0 && (
              <Tooltip
                content={`Falta información del predio. No esta vinculado a un predio.`}
                themeColor="info"
                followCursor={false}
                position="top"
              >
                <span className={styles.missingBadge}>
                  🏢 Predio: {item.sinPredio}
                </span>
              </Tooltip>
            )}
            {item.sinCliente > 0 && (
              <Tooltip
                content={`Falta Contacto Cliente (correo electrónico, teléfono o celular...)`}
                themeColor="info"
                followCursor={false}
                position="top"
              >
                <span className={styles.missingBadge}>
                  👤 Cliente: {item.sinCliente}
                </span>
              </Tooltip>
            )}
            {item.sinGeolocalizacion === 0 &&
              item.sinPredio === 0 &&
              item.sinCliente === 0 && (
                <Tooltip
                  content={`Todo al día`}
                  themeColor="success"
                  followCursor={false}
                  position="top"
                >
                  <span className={styles.allCorrectBadge}>✓ Todo al día</span>
                </Tooltip>
              )}
          </div>
        )
      },
      {
        header: 'Progreso',
        accessor: (item) => {
          const pct = Number(item.porcentaje).toFixed(1);
          return (
            <ProgressBar
              value={Number(pct)}
              widthSize="md"
              color={getTrafficLightColor(Number(pct))}
            />
          );
        },
        isNumeric: true,
        sortKey: 'porcentaje'
      }
    ],
    []
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'map') {
      fetchLiveData();
    }
  }, [activeTab, fetchLiveData]);

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

  const sortedZonas = useMemo(() => {
    if (!data?.porZonas) return [];
    return [...data.porZonas].sort((a, b) => {
      const pctA =
        Number(a.total) > 0
          ? (Number(a.completados) / Number(a.total)) * 100
          : 0;
      const pctB =
        Number(b.total) > 0
          ? (Number(b.completados) / Number(b.total)) * 100
          : 0;
      return pctB - pctA;
    });
  }, [data?.porZonas]);

  const sortedSectores = useMemo(() => {
    if (!data?.porSectores) return [];
    return [...data.porSectores].sort(
      (a, b) => Number(b.porcentaje) - Number(a.porcentaje)
    );
  }, [data?.porSectores]);

  if (isLoading && !data) {
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
        <button
          className={`${styles.tabButton} ${activeTab === 'map' ? styles.active : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapPin size={16} /> Mapa de Avance
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
                <h3 className={styles.chartTitle}>
                  Calidad y Completitud de Datos
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary, #9e9e9e)',
                    margin: '-0.5rem 0 1.5rem 0'
                  }}
                >
                  Flujo de decantación catastral y validación física de las
                  conexiones.
                </p>
                <div className={styles.funnelContainer}>
                  {data.embudo.map((step, idx) => {
                    const firstStepTotal = data.embudo[0].total || 1;
                    const percentOfTotal = (
                      (step.total / firstStepTotal) *
                      100
                    ).toFixed(1);
                    return (
                      <div key={idx} className={styles.funnelStepRow}>
                        <div className={styles.funnelStepLabel}>
                          <strong>{step.paso}</strong>
                          <span>{step.total.toLocaleString()} acometidas</span>
                        </div>
                        <div className={styles.funnelStepBarWrapper}>
                          <ProgressBar
                            value={Number(percentOfTotal)}
                            height="15px"
                            color={getTrafficLightColor(Number(percentOfTotal))}
                          />
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
            <h3 className={styles.chartTitle}>Actualización por Zona</h3>
            <Table
              data={sortedZonas}
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
              <h3 className={styles.chartTitle}>
                Auditoría y Avance por Sector
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary, #9e9e9e)',
                  margin: '-0.5rem 0 1rem 0'
                }}
              >
                Detalle del avance de actualización catastral por sectores
                geográficos y desglose de datos faltantes.
              </p>
              <Table
                data={sortedSectores}
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

      {activeTab === 'map' && (
        <div className={styles.tabContent}>
          <section className={styles.mapSection}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 className={styles.chartTitle} style={{ margin: 0 }}>
                  Mapa de Avance Catastral
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary, #9e9e9e)',
                    margin: '0.25rem 0 0 0'
                  }}
                >
                  Visualización geoespacial en vivo de las acometidas
                  registradas y su estado de completitud.
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <Clock size={14} /> Total georreferenciadas:{' '}
                {liveData.length.toLocaleString()}
              </span>
            </div>

            {/* Control Bar: Search + Legend */}
            <div
              className={styles.mapControlsRow}
              style={{ marginTop: '10px' }}
            >
              {/* Legend */}
              <div
                className={styles.mapLegend}
                style={{
                  backgroundColor: 'var(--surface-hover) !important'
                }}
              >
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: '#10b981' }}
                  />
                  <span>Completado (100%)</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: '#f59e0b' }}
                  />
                  <span>Pendiente Datos Cliente</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: '#3b82f6' }}
                  />
                  <span>Pendiente Ficha Predial</span>
                </div>
                <div className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{ backgroundColor: '#ef4444' }}
                  />
                  <span>Pendiente Geolocalización</span>
                </div>
              </div>

              {/* Search input */}
              <div className={styles.mapSearchWrapper}>
                <Search size={16} className={styles.mapSearchIcon} />
                <input
                  type="text"
                  placeholder="Buscar por cliente, sector o clave..."
                  className={styles.mapSearchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className={styles.mapSearchClearButton}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPin(null);
                    }}
                    title="Limpiar búsqueda"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Google Map & Side Panel Body */}
            <div className={styles.mapSectionBody}>
              {searchQuery.trim() !== '' && (
                <div className={styles.mapSidePanel}>
                  <div className={styles.mapSidePanelHeader}>
                    Resultados de búsqueda ({filteredLiveData.length})
                  </div>
                  <div className={styles.mapSidePanelList}>
                    {filteredLiveData.length === 0 ? (
                      <div
                        style={{
                          padding: '1rem',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        Sin resultados
                      </div>
                    ) : (
                      filteredLiveData.map((conn) => (
                        <div
                          key={conn.connectionId}
                          className={`${styles.mapSidePanelItem} ${selectedPin?.connectionId === conn.connectionId ? styles.activeItem : ''}`}
                          onClick={() => setSelectedPin(conn)}
                        >
                          <div className={styles.itemHeader}>
                            <span className={styles.itemTitle}>
                              Acometida {conn.cadastralKey}
                            </span>
                            <span
                              className={styles.itemDot}
                              style={{
                                backgroundColor: conn.markerColor || '#ef4444'
                              }}
                            />
                          </div>
                          <div className={styles.itemBody}>
                            <div className={styles.itemRow}>
                              <span className={styles.itemLabel}>Cliente:</span>
                              <span className={styles.itemVal}>
                                {conn.clientName}
                              </span>
                            </div>
                            <div className={styles.itemRow}>
                              <span className={styles.itemLabel}>Sector:</span>
                              <span className={styles.itemVal}>
                                {conn.sector}
                              </span>
                            </div>
                            {conn.address && (
                              <div className={styles.itemRow}>
                                <span className={styles.itemLabel}>
                                  Dirección:
                                </span>
                                <span
                                  className={styles.itemVal}
                                  title={conn.address}
                                >
                                  {conn.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Google Map */}
              <div className={styles.mapContainer}>
                {liveData.length === 0 && isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <Activity
                      size={24}
                      className="animate-spin"
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span>Cargando mapa de avance...</span>
                  </div>
                ) : (
                  <APIProvider
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
                    libraries={['marker']}
                  >
                    <Map
                      mapId={
                        import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'
                      }
                      defaultCenter={
                        liveData.length > 0
                          ? {
                              lat: Number(liveData[0].latitude),
                              lng: Number(liveData[0].longitude)
                            }
                          : {
                              lat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
                              lng: FALLBACK_CENTER_ANTONIO_ANTE.lng
                            }
                      }
                      defaultZoom={13}
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                      onClick={() => setSelectedPin(null)}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MapController theme={theme} selectedPin={selectedPin} />
                      {filteredLiveData.map((conn) => {
                        const isSelected =
                          selectedPin?.connectionId === conn.connectionId;
                        const isHovered = hoveredPinId === conn.connectionId;
                        const markerColor = conn.markerColor || '#ef4444';

                        return (
                          <AdvancedMarker
                            key={conn.connectionId}
                            position={{
                              lat: Number(conn.latitude),
                              lng: Number(conn.longitude)
                            }}
                            title={`Clave Catastral: ${conn.cadastralKey}`}
                            anchorPoint={
                              AdvancedMarkerAnchorPoint.BOTTOM_CENTER
                            }
                            zIndex={isSelected ? 1000 : 1}
                            onClick={() => {
                              setHoveredPinId(null);
                              setSelectedPin(conn);
                            }}
                            onMouseEnter={() =>
                              setHoveredPinId(conn.connectionId)
                            }
                            onMouseLeave={() =>
                              setHoveredPinId((prev) =>
                                prev === conn.connectionId ? null : prev
                              )
                            }
                          >
                            <button
                              type="button"
                              className={`${styles.mapAdvancedMarker} ${isSelected ? styles.mapAdvancedMarkerSelected : ''}`}
                              style={
                                {
                                  '--marker-color': markerColor
                                } as React.CSSProperties
                              }
                              aria-label={`Acometida ${conn.cadastralKey}`}
                            >
                              <span className={styles.mapAdvancedMarkerPin} />
                              <span className={styles.mapAdvancedMarkerDot} />
                              {isSelected && (
                                <span
                                  className={styles.mapAdvancedMarkerPulse}
                                />
                              )}
                              {isHovered && !isSelected && (
                                <span
                                  className={styles.mapAdvancedMarkerTooltip}
                                >
                                  {conn.cadastralKey}
                                </span>
                              )}
                            </button>
                          </AdvancedMarker>
                        );
                      })}

                      {selectedPin && (
                        <InfoWindow
                          position={{
                            lat: Number(selectedPin.latitude),
                            lng: Number(selectedPin.longitude)
                          }}
                          pixelOffset={[0, -30]}
                          onCloseClick={() => setSelectedPin(null)}
                        >
                          <div className={styles.infoWindowContent}>
                            <div className={styles.infoWindowHeader}>
                              <MapPin
                                size={16}
                                color={selectedPin.markerColor || '#ef4444'}
                              />
                              <h4 className={styles.infoWindowTitle}>
                                Acometida {selectedPin.cadastralKey}
                              </h4>
                            </div>

                            <div className={styles.infoWindowDivider} />

                            <div className={styles.infoWindowBody}>
                              <div className={styles.infoWindowRow}>
                                <span className={styles.infoWindowLabel}>
                                  ID:
                                </span>
                                <span className={styles.infoWindowVal}>
                                  {selectedPin.connectionId}
                                </span>
                              </div>

                              <div className={styles.infoWindowRow}>
                                <span className={styles.infoWindowLabel}>
                                  Cliente:
                                </span>
                                <span className={styles.infoWindowVal}>
                                  {selectedPin.clientName}
                                </span>
                              </div>

                              <div className={styles.infoWindowRow}>
                                <span className={styles.infoWindowLabel}>
                                  Dirección:
                                </span>
                                <span className={styles.infoWindowVal}>
                                  {selectedPin.address ||
                                    'Sin dirección registrada'}
                                </span>
                              </div>

                              <div className={styles.infoWindowRow}>
                                <span className={styles.infoWindowLabel}>
                                  Ubicación:
                                </span>
                                <span className={styles.infoWindowVal}>
                                  Sector {selectedPin.sector} | Zona{' '}
                                  {selectedPin.zoneId}
                                </span>
                              </div>

                              <div className={styles.infoWindowRow}>
                                <span className={styles.infoWindowLabel}>
                                  Actualizado:
                                </span>
                                <span className={styles.infoWindowVal}>
                                  {new Date(
                                    selectedPin.lastUpdated
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div
                              className={styles.infoWindowBadge}
                              style={{
                                backgroundColor: selectedPin.markerColor,
                                marginTop: '0.25rem'
                              }}
                            >
                              {selectedPin.statusCategory}
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Map>
                  </APIProvider>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </PageLayout>
  );
};
