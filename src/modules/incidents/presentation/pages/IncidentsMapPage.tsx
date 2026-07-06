import React, { useState } from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useIncidentsViewModel } from '../hooks/useIncidentsViewModel';
import { IncidentDetailModal } from '../components/IncidentDetailModal';
import { IncidentMapFeature } from '../components/Map/IncidentMapFeature';
import { IncidentFilters } from '../components/IncidentFilters';
import { useNavigate } from 'react-router-dom';
import { Network, X } from 'lucide-react';
import '../styles/Incidents.css';
import '../components/Map/IncidentMap.css';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

/**
 * IncidentsMapPage — dedicated full-screen incident map.
 *
 * Replicates exactly the same layout pattern as ConnectionsPage (map mode):
 *   PageLayout (className="incident-map-page")
 *     └── div.incident-map-page-content
 *           └── IncidentMapFeature  →  div.incident-map-feature-container (calc(100vh-180px))
 */
export const IncidentsMapPage: React.FC = () => {
  const {
    incidents,
    categories,
    isLoading,
    filters,
    connectionMode,
    connectionIdFromUrl,
    handleFilterChange,
    handleConsultar
  } = useIncidentsViewModel();

  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentDetailRowResponse | null>(null);
  const [focusedIncident, setFocusedIncident] =
    useState<IncidentDetailRowResponse | null>(null); // ← Nuevo

  // Solo enfoca el mapa (sin abrir modal)
  const handleFocusOnMap = (incident: IncidentDetailRowResponse) => {
    setFocusedIncident(incident); // ← Usaremos esto para el highlight visual
  };
  const handleViewDetail = (incident: IncidentDetailRowResponse) => {
    setSelectedIncident(incident);
  };
  return (
    <>
      <PageLayout
        className="incident-map-page"
        filters={
          <IncidentFilters
            searchQuery={filters.search}
            onSearchQueryChange={(val) => handleFilterChange({ search: val })}
            searchField={filters.searchField}
            onSearchFieldChange={(val) => handleFilterChange({ searchField: val })}
            selectedStatus={filters.status}
            onStatusChange={(val) => handleFilterChange({ status: val })}
            selectedPriority={filters.priority}
            onPriorityChange={(val) => handleFilterChange({ priority: val })}
            selectedCategoryId={filters.categoryId}
            onCategoryIdChange={(val) =>
              handleFilterChange({ categoryId: val })
            }
            categories={categories}
            onConsultar={handleConsultar}
            onReportIncident={() => navigate('/incidents/create')}
            isLoading={isLoading}
          />
        }
      >
        <div className="incident-map-page-content">
          {connectionMode && connectionIdFromUrl && (
            <div className="incidents-connection-banner">
              <Network size={16} />
              <span>
                Incidentes activos de la acometida
                <strong> {connectionIdFromUrl}</strong> — solo estados distintos
                de RESUELTO
              </span>
              <button
                className="incidents-banner-clear"
                onClick={handleConsultar}
                title="Ver todos los incidentes"
              >
                <X size={14} />
                Limpiar filtro
              </button>
            </div>
          )}

          <IncidentMapFeature
            incidents={incidents}
            selectedIncident={focusedIncident} // ← Cambiado
            onSelect={handleFocusOnMap} // ← Solo focus
            onViewDetail={handleViewDetail}
          />
        </div>
      </PageLayout>

      {selectedIncident !== null && (
        <IncidentDetailModal
          isOpen={true}
          onClose={() => setSelectedIncident(null)}
          incident={selectedIncident}
        />
      )}
    </>
  );
};
