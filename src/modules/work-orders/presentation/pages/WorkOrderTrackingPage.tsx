/**
 * WorkOrderTrackingPage — Vista de tracking de una OT individual
 *
 * Clean Architecture:
 *   Presentation layer. Muestra el timeline completo + métricas de SLA
 *   de una OT, orientado a monitoreo interno (analista / supervisor).
 *
 * Parámetro de ruta: `:codigoOrden` (Ej: OT-2026-0000001)
 * Espejo de SolicitudesTrackingPage.
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Search,
} from 'lucide-react';

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// ── Domain types ──────────────────────────────────────────────────────────────
import type { OrdenTrabajoTracking } from '../../domain/schemas/dto/response/work-orders.get.response';

// ── Sub-components ────────────────────────────────────────────────────────────
import { WorkOrderTimelineCard } from '../components/detail/WorkOrderTimelineCard';
import {
  getEstadoOrdenConfig,
  getPrioridadConfig,
  getSlaColor,
  formatSlaHoras,
} from '../components/WorkOrderConfig';

import '../styles/WorkOrderDetailPage.css';

// ── Stat card helper ──────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon }) => (
  <div className="wo-track-stat">
    {icon && <div className="wo-track-stat__icon" style={{ color }}>{icon}</div>}
    <div className="wo-track-stat__body">
      <span className="wo-track-stat__label">{label}</span>
      <span className="wo-track-stat__value" style={{ color }}>{value}</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export const WorkOrderTrackingPage: React.FC = () => {
  const { codigoOrden = '' } = useParams<{ codigoOrden: string }>();
  const navigate = useNavigate();

  const [tracking, setTracking] = useState<OrdenTrabajoTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const repo = React.useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);
  const trackingUseCase = React.useMemo(
    () => new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repo),
    [repo]
  );

  // ── Load ───────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!codigoOrden) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await trackingUseCase.execute(codigoOrden);
        if (isMounted) setTracking(data);
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Error al cargar el tracking.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [codigoOrden, trackingUseCase]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div className="wo-detail-loading">
          <Clock className="wo-detail-loading__spinner" size={24} />
          <span>Cargando tracking...</span>
        </div>
      </PageLayout>
    );
  }

  if (error || !tracking) {
    return (
      <PageLayout>
        <div className="wo-detail-error">
          <AlertTriangle size={48} style={{ color: 'var(--error)', opacity: 0.8 }} />
          <h3>Tracking no encontrado</h3>
          <p>{error || 'No se pudo localizar el tracking de esta orden.'}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>Volver Atrás</Button>
        </div>
      </PageLayout>
    );
  }

  const estadoConfig    = getEstadoOrdenConfig(tracking.estadoCodigo);
  const prioridadConfig = getPrioridadConfig(tracking.prioridad);
  // OrdenTrabajoTracking no tiene horasRestantesSla; usamos slaVencido como indicador
  const slaColor        = getSlaColor(!tracking.slaVencido, tracking.slaVencido ? 0 : tracking.slaHoras);

  // Historial filtrado por búsqueda
  const historialFiltrado = (tracking.historial ?? []).filter((h) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (h.estadoLabel ?? h.estado).toLowerCase().includes(q) ||
      (h.comentario ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <PageLayout
      header={
        <div className="wo-detail-header-nav">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <div className="wo-detail-header-nav__info">
            <h2 className="wo-detail-header-nav__title">
              Tracking: {tracking.codigoOrden}
            </h2>
            <span className="wo-detail-header-nav__subtitle">
              {tracking.tipoTrabajo} · {tracking.departamento}
            </span>
          </div>
        </div>
      }
    >
      <div className="wo-tracking-container">

        {/* ── Estado actual ─────────────────────────────────────── */}
        <div
          className="wo-tracking-estado"
          style={{ borderColor: estadoConfig.color, background: estadoConfig.bg }}
        >
          <div className="wo-tracking-estado__label">Estado actual</div>
          <div
            className="wo-tracking-estado__value"
            style={{ color: estadoConfig.color }}
          >
            {tracking.estadoActualLabel}
          </div>
        </div>

        {/* ── Métricas ────────────────────────────────────────────── */}
        <div className="wo-tracking-metrics">
          <StatCard label="Prioridad" value={prioridadConfig.label} color={prioridadConfig.color} />
          <StatCard label="Días en Proceso" value={`${tracking.diasEnProceso} día(s)`} />
          <StatCard label="Horas Proceso" value={`${tracking.horasTotalesProceso?.toFixed(1)}h`} />
          <StatCard
            label="SLA"
            value={
              tracking.slaVencido
                ? 'VENCIDO'
                : `${formatSlaHoras(tracking.slaHoras)} límite`
            }
            color={slaColor}
            icon={tracking.slaVencido ? <ShieldX size={16} /> : <ShieldCheck size={16} />}
          />
          <StatCard label="Materiales" value={tracking.materialesTotal} />
          <StatCard label="Adjuntos" value={tracking.adjuntosTotal} />
          <StatCard label="Observaciones" value={tracking.observacionesTotal} />
          <StatCard
            label="Rechazos QC"
            value={tracking.rechazosCalidad}
            color={tracking.rechazosCalidad > 0 ? '#ef4444' : undefined}
          />

          {tracking.calificacionSatisfaccion != null && (
            <StatCard
              label="Satisfacción"
              value={`${tracking.calificacionSatisfaccion}/5 ★`}
              color="#f59e0b"
            />
          )}
        </div>

        {/* ── Último movimiento ─────────────────────────────────── */}
        {tracking.ultimoMovimiento && (
          <div className="wo-tracking-last">
            <span className="wo-tracking-last__label">Último movimiento:</span>
            <span>{new Date(tracking.ultimoMovimiento).toLocaleString('es-EC')}</span>
            {tracking.ultimoComentario && (
              <span className="wo-tracking-last__comment">"{tracking.ultimoComentario}"</span>
            )}
          </div>
        )}

        {/* ── Búsqueda en historial ─────────────────────────────── */}
        <div className="wo-tracking-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Buscar en historial por estado o comentario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="wo-tracking-search"
          />
        </div>

        {/* ── Timeline ──────────────────────────────────────────── */}
        <WorkOrderTimelineCard
          historial={historialFiltrado}
          title={`Historial Completo (${historialFiltrado.length} entradas)`}
        />

      </div>
    </PageLayout>
  );
};
