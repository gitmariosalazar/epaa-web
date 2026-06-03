/**
 * SolicitudesTrackingPage
 *
 * SRP: orchestrates toolbar + list of SolicitudTrackingCard.
 * DIP: reads data exclusively via useTrackingViewModel.
 * OCP: new filters → extend useTrackingViewModel, not this page.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { SolicitudTrackingCard } from '../components/tracking/SolicitudTrackingCard';
import type { TrackingSolicitudResponse } from '../../domain/models/Solicitud';
import { useTrackingViewModel } from '../hooks/useTrackingViewModel';
import { ACOMETIDA_STEPS } from '../../domain/models/ProcesoAcometida';
import {
  Search,
  RefreshCw,
  Inbox,
  AlertTriangle,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import './SolicitudesTrackingPage.css';

// ── Toolbar ───────────────────────────────────────────────────────────────────
interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  currentStep: string;
  onStepChange: (v: string) => void;
  total: number;
  filtered: number;
  onRefresh: () => void;
}

const TrackingToolbar: React.FC<ToolbarProps> = ({
  search, onSearchChange,
  currentStep, onStepChange,
  total, filtered,
  onRefresh
}) => {
  const hasFilters = search || currentStep;
  return (
    <div className="trk-toolbar">
      {/* Search */}
      <div className="trk-toolbar__search">
        <Search size={14} className="trk-toolbar__search-icon" />
        <input
          type="text"
          placeholder="Buscar por código, dirección, estado..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="trk-search-input"
        />
      </div>

      {/* Step filter */}
      <select
        className="trk-toolbar__select"
        value={currentStep}
        onChange={(e) => onStepChange(e.target.value)}
        aria-label="Filtrar por etapa"
      >
        <option value="">Todas las etapas</option>
        {ACOMETIDA_STEPS.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
        <option value="completado">Activo</option>
        <option value="anulada">Anulada</option>
        <option value="rechazada">Rechazada</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          className="trk-toolbar__btn"
          onClick={() => { onSearchChange(''); onStepChange(''); }}
          title="Limpiar filtros"
        >
          <X size={13} /> Limpiar
        </button>
      )}

      <div className="trk-toolbar__divider" />

      <button
        className="trk-toolbar__btn"
        onClick={onRefresh}
        id="btn-refrescar-tracking"
        title="Actualizar"
      >
        <RefreshCw size={14} /> Actualizar
      </button>

      <span className="trk-toolbar__count">
        <SlidersHorizontal size={11} style={{ display: 'inline', marginRight: 4 }} />
        {filtered}{filtered !== total ? ` / ${total}` : ''} solicitud{filtered !== 1 ? 'es' : ''}
      </span>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export const SolicitudesTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tracking,
    totalCount,
    isLoading,
    error,
    filters,
    handleFilterChange,
    refresh
  } = useTrackingViewModel();

  if (isLoading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
          <CircularProgress />
          <span style={{ color: 'var(--text-muted)' }}>Cargando seguimiento...</span>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="trk-empty">
          <AlertTriangle size={28} style={{ color: '#ef4444' }} />
          <h3>No se pudo cargar el seguimiento</h3>
          <p>{error}</p>
          <button className="trk-toolbar__btn" onClick={refresh}>
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      filters={
        <TrackingToolbar
          search={filters.search}
          onSearchChange={(v) => handleFilterChange({ search: v })}
          currentStep={filters.currentStep}
          onStepChange={(v) => handleFilterChange({ currentStep: v })}
          total={totalCount}
          filtered={tracking.length}
          onRefresh={refresh}
        />
      }
    >
      <div className="trk-page-body">
        {tracking.length === 0 ? (
          <div className="trk-empty">
            <div className="trk-empty__icon">
              <Inbox size={28} />
            </div>
            <h3>No hay solicitudes</h3>
            <p>
              {totalCount === 0
                ? 'No tienes solicitudes registradas con seguimiento disponible.'
                : 'No hay resultados con los filtros aplicados.'}
            </p>
            {totalCount > 0 && (
              <button
                className="trk-toolbar__btn"
                onClick={() => handleFilterChange({ search: '', currentStep: '' })}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="trk-list">
            {tracking.map((t: TrackingSolicitudResponse) => (
              <SolicitudTrackingCard
                key={t.id}
                tracking={t}
                onVerDetalle={(id) => navigate(`/solicitudes/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
