import { RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';

interface WorkOrderProcessToolbarProps {
  numeroOrden: string;
  solicitudId: string;
  isLoading: boolean;
  relatedCount: number;
  historyCount: number;
  onNumeroOrdenChange: (value: string) => void;
  onSolicitudIdChange: (value: string) => void;
  onLoadTracking: () => void;
  onLoadDetail: () => void;
  onLoadBySolicitud: () => void;
  onClearFilters: () => void;
}

export const WorkOrderProcessToolbar = ({
  numeroOrden,
  solicitudId,
  isLoading,
  relatedCount,
  historyCount,
  onNumeroOrdenChange,
  onSolicitudIdChange,
  onLoadTracking,
  onLoadDetail,
  onLoadBySolicitud,
  onClearFilters
}: WorkOrderProcessToolbarProps) => {
  const hasFilters = numeroOrden.trim() || solicitudId.trim();

  return (
    <div className="wo-toolbar">
      <div className="wo-toolbar__search">
        <Search size={15} className="wo-toolbar__search-icon" />
        <input
          type="text"
          placeholder="Buscar por numero de orden..."
          value={numeroOrden}
          onChange={(event) => onNumeroOrdenChange(event.target.value)}
        />
      </div>

      <div className="wo-toolbar__divider" />

      <div className="wo-toolbar__search wo-toolbar__search--short">
        <input
          type="text"
          placeholder="Solicitud ID"
          value={solicitudId}
          onChange={(event) => onSolicitudIdChange(event.target.value)}
        />
      </div>

      <Button size="compact" onClick={onLoadTracking} isLoading={isLoading}>
        Tracking
      </Button>

      <Button
        size="compact"
        variant="outline"
        onClick={onLoadDetail}
        isLoading={isLoading}
      >
        Detalle
      </Button>

      <Button
        size="compact"
        variant="subtle"
        onClick={onLoadBySolicitud}
        isLoading={isLoading}
      >
        Ordenes por solicitud
      </Button>

      {hasFilters && (
        <button
          className="wo-toolbar__btn"
          onClick={onClearFilters}
          title="Limpiar filtros"
        >
          <X size={13} /> Limpiar
        </button>
      )}

      <button
        className="wo-toolbar__btn"
        onClick={onLoadTracking}
        title="Actualizar tracking"
      >
        <RefreshCw size={13} /> Refrescar
      </button>

      <span className="wo-toolbar__count">
        <SlidersHorizontal
          size={11}
          style={{ display: 'inline', marginRight: 4 }}
        />
        Historial: {historyCount} / OTs relacionadas: {relatedCount}
      </span>
    </div>
  );
};
