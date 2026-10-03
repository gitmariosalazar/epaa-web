import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type {
  IncidentDashboardResponseDto,
  IncidenteCriticoDto
} from '../../../domain/schemas/dtos/response/incident-dashboard.dto';
import '../../styles/IncidentDashboard.css';

interface IncidentDashboardViewProps {
  data: IncidentDashboardResponseDto | null;
  isLoading: boolean;
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

export const IncidentDashboardView: React.FC<IncidentDashboardViewProps> = ({
  data,
  isLoading
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const columnsCritical: Column<IncidenteCriticoDto>[] = useMemo(() => [
    { header: 'Código', accessor: 'incident_code', sortable: true },
    { header: 'Conexión', accessor: 'connection_id', sortable: true },
    { header: 'Categoría', accessor: 'category', sortable: true },
    { header: 'Tipo', accessor: 'type', sortable: true },
    {
      header: 'Días Abierto',
      accessor: (item) => (
        <ColorChip
          label={`${item.days_open} días`}
          color={item.days_open > 7 ? 'red' : item.days_open > 3 ? 'amber' : 'green'}
          size="xs"
        />
      ),
      id: 'days_open',
      sortable: true
    }
  ], []);

  if (isLoading) {
    return (
      <div className="incident-dashboard-loading">
        <div className="spinner"></div>
        <p>Procesando métricas de incidentes...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="incident-dashboard-loading" style={{ height: '200px' }}>
        <p>No hay datos disponibles para el dashboard.</p>
      </div>
    );
  }

  const {
    kpis_generales,
    por_estado,
    por_categoria,
    por_origen_reporte,
    por_prioridad,
    tendencia_ultimos_30_dias,
    atencion_inmediata
  } = data;

  return (
    <div className="incident-dashboard-container">
      <div className="dashboard-header-area">
        <div>
          <h2 className="glow-text">Centro de Control de Incidentes</h2>
          <div className="dashboard-subtitle">Monitor en tiempo real del estado de operaciones y cuadrillas</div>
        </div>
      </div>

      <div className="kpi-cards-grid">
        <KPICard
          label="Total Incidentes (Mes)"
          value={kpis_generales.total_incidentes.toLocaleString()}
          icon={<Activity size={22} />}
          color="blue"
        />
        <KPICard
          label="Pendientes / En Progreso"
          value={kpis_generales.total_pendientes.toLocaleString()}
          icon={<Clock size={22} />}
          color="amber"
          description="Requieren atención"
        />
        <KPICard
          label="Incidentes Resueltos"
          value={kpis_generales.total_resueltos.toLocaleString()}
          icon={<CheckCircle size={22} />}
          color="emerald"
          valueColor="emerald"
        />
        <KPICard
          label="Críticos Activos"
          value={kpis_generales.total_criticos_activos.toLocaleString()}
          icon={<AlertCircle size={22} />}
          color="rose"
          valueColor={kpis_generales.total_criticos_activos > 0 ? 'rose' : 'gray'}
        />
        <KPICard
          label="Tiempo Promedio de Resolución"
          value={`${kpis_generales.tiempo_promedio_resolucion_dias.toFixed(1)} días`}
          icon={<TrendingUp size={22} />}
          color="cyan"
        />
        <KPICard
          label="Costo de Reparación (Acumulado)"
          value={formatCurrency(kpis_generales.costo_reparacion_acumulado)}
          icon={<DollarSign size={22} />}
          color="purple"
        />
      </div>

      <div className="chart-container glass-panel">
        <h3 className="chart-title">Tendencia Diaria (Últimos 30 días)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tendencia_ultimos_30_dias} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis
                dataKey="fecha"
                stroke="var(--text-secondary)"
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Area type="monotone" dataKey="cantidad_reportada" name="Incidentes Reportados" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid-3">
        <div className="chart-container glass-panel">
          <h3 className="chart-title">Distribución por Estado</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={por_estado}
                  dataKey="cantidad"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {por_estado.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel">
          <h3 className="chart-title">Por Origen de Reporte</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={por_origen_reporte} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <YAxis dataKey="origen" type="category" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} width={80} />
                <RechartsTooltip cursor={{ fill: 'var(--border-color)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="cantidad" name="Cantidad" fill="#10b981" radius={[0, 4, 4, 0]}>
                  {por_origen_reporte.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 2) % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel">
          <h3 className="chart-title">Por Prioridad</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={por_prioridad}
                  dataKey="cantidad"
                  nameKey="prioridad"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {por_prioridad.map((entry, index) => {
                    let color = '#8b5cf6';
                    if (entry.prioridad.toLowerCase().includes('alta') || entry.prioridad.toLowerCase().includes('urgente')) color = '#ef4444';
                    if (entry.prioridad.toLowerCase().includes('media')) color = '#f59e0b';
                    if (entry.prioridad.toLowerCase().includes('baja')) color = '#10b981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="chart-container glass-panel">
        <h3 className="chart-title">Top Categorías por Costo y Volumen</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={por_categoria} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="categoria" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 12 }} />
              <RechartsTooltip
                cursor={{ fill: 'var(--border-color)', opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Costo Total') return formatCurrency(value);
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" name="Cantidad de Incidentes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="costo_total" name="Costo Total" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <AlertTriangle color="#ef4444" size={24} />
          <h3 className="chart-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Incidentes de Atención Inmediata (Críticos)</h3>
        </div>
        {atencion_inmediata && atencion_inmediata.length > 0 ? (
          <Table
            data={atencion_inmediata}
            columns={columnsCritical}
            pagination={true}
            pageSize={5}
          />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No hay incidentes críticos pendientes de atención inmediata. ¡Buen trabajo!</p>
          </div>
        )}
      </div>

    </div>
  );
};
