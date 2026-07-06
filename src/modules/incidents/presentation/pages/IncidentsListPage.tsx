import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useIncidentsViewModel } from '../hooks/useIncidentsViewModel';
import { ResolveIncidentModal } from '../components/ResolveIncidentModal';
import { IncidentDetailModal } from '../components/IncidentDetailModal';
import { IncidentFilters } from '../components/IncidentFilters';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { AlertCircle, Eye, Wrench, ShieldAlert, Network, X } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { useSimulatedProgress } from '@/shared/presentation/components/CircularProgress/useSimulatedProgress';
import '../styles/Incidents.css';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

/**
 * IncidentsListPage
 *
 * Presentation layer (MVVM View) — solo tabla.
 * El mapa de incidencias vive en IncidentsMapPage (/incidents/map).
 */
export const IncidentsListPage: React.FC = () => {
  const {
    incidents,
    categories,
    pageSize,
    isLoading,
    error,
    filters,
    connectionMode,
    connectionIdFromUrl,
    handleFilterChange,
    handleConsultar,
    refresh
  } = useIncidentsViewModel();

  const progress = useSimulatedProgress(isLoading);
  const navigate = useNavigate();

  const [resolveIncidentId, setResolveIncidentId] = useState<number | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetailRowResponse | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESUELTO': return 'green';
      case 'EN_INSPECCION': return 'orange';
      case 'REPORTADO': return 'yellow';
      case 'FALSO_REPORTE': return 'red';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICA': return 'red';
      case 'ALTA': return 'orange';
      case 'MEDIA': return 'yellow';
      case 'BAJA': return 'cyan';
      default: return 'neutral';
    }
  };

  const columns: Column<IncidentDetailRowResponse>[] = [
    {
      header: 'ID',
      accessor: (item) => (
        <span className="text-secondary" style={{ fontWeight: 600 }}>{item.incidentId}</span>
      ),
      id: 'incidentId',
      style: { width: '80px' }
    },
    {
      header: 'CONEXION',
      accessor: (item) => <span>{item.connectionId || '-'}</span>,
      id: 'connectionId',
      style: { width: '110px' }
    },
    {
      header: 'CATEGORIA / TIPO',
      accessor: (item) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="incident-category-text">{item.categoryName}</span>
          <span className="incident-type-text">{item.incidentTypeName}</span>
        </div>
      ),
      id: 'categoryAndType'
    },
    {
      header: 'UBICACIÓN',
      accessor: (item) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="incident-category-text">{`${item.latitude}, ${item.longitude}`}</span>
        </div>
      ),
      id: 'location'
    },
    {
      header: 'PRIORIDAD',
      accessor: (item) => (
        <ColorChip
          label={item.suggestedPriority}
          color={getPriorityColor(item.suggestedPriority)}
          variant="soft"
          size="xs"
        />
      ),
      id: 'priority',
      style: { width: '100px' }
    },
    {
      header: 'ESTADO',
      accessor: (item) => (
        <ColorChip
          label={item.status.replace(/_/g, ' ')}
          color={getStatusColor(item.status)}
          variant="soft"
          size="xs"
        />
      ),
      id: 'status',
      style: { width: '130px' }
    },
    {
      header: 'F. REPORTE',
      accessor: (item) => (
        <span style={{ fontSize: '0.8125rem' }}>{ConverDate(item.reportDate)}</span>
      ),
      id: 'reportDate',
      style: { width: '110px' }
    },
    {
      header: 'ACCIONES',
      accessor: (item) => (
        <div className="incident-actions-cell" style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setSelectedIncident(item)}
            leftIcon={<Eye size={12} />}
          >
            Ver
          </Button>
          {item.status !== 'RESUELTO' && item.status !== 'FALSO_REPORTE' && (
            <Button
              variant="dashed"
              color="amber"
              size="xs"
              onClick={() => setResolveIncidentId(item.incidentId)}
              leftIcon={<Wrench size={12} />}
            >
              Resolver
            </Button>
          )}
        </div>
      ),
      id: 'actions',
      style: { width: '180px' }
    }
  ];

  return (
    <>
      <PageLayout
        className="payments-page"
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
            onCategoryIdChange={(val) => handleFilterChange({ categoryId: val })}
            categories={categories}
            onConsultar={handleConsultar}
            onReportIncident={() => navigate('/incidents/create')}
            isLoading={isLoading}
          />
        }
      >
        {connectionMode && connectionIdFromUrl && (
          <div className="incidents-connection-banner">
            <Network size={16} />
            <span>
              Incidentes activos de la acometida
              <strong> {connectionIdFromUrl}</strong>
              {' '}— solo estados distintos de RESUELTO
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

        {error ? (
          <div className="incidents-error-state">
            <AlertCircle size={28} />
            <h3>Error al cargar incidentes</h3>
            <p>{error}</p>
            <Button onClick={refresh} variant="outline" size="sm">
              Reintentar
            </Button>
          </div>
        ) : (
          <Table<IncidentDetailRowResponse>
            data={incidents}
            columns={columns}
            isLoading={isLoading}
            loadingState={
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
                <CircularProgress progress={progress} size={80} label="Cargando incidentes..." />
              </div>
            }
            pagination={true}
            pageSize={pageSize}
            onEndReached={() => { }}
            hasMore={false}
            emptyState={
              <div className="incidents-empty-state">
                <ShieldAlert size={48} className="empty-icon" />
                <h3>Sin Incidentes{connectionMode ? ' Activos' : ''}</h3>
                <p>
                  {connectionMode
                    ? `La acometida ${connectionIdFromUrl} no tiene incidentes activos.`
                    : incidents.length === 0
                      ? 'No hay incidentes reportados en el sistema.'
                      : 'No se encontraron resultados con los filtros actuales.'}
                </p>
              </div>
            }
          />
        )}
      </PageLayout>

      {resolveIncidentId !== null && (
        <ResolveIncidentModal
          isOpen={true}
          onClose={() => setResolveIncidentId(null)}
          incidentId={resolveIncidentId}
        />
      )}

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
