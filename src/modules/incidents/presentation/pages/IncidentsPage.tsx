import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useIncidentsViewModel } from '../hooks/useIncidentsViewModel';
import type { IncidentTab } from '../hooks/useIncidentsViewModel';
import { ResolveIncidentModal } from '../components/ResolveIncidentModal';
import { IncidentDetailModal } from '../components/IncidentDetailModal';
import { IncidentFilters } from '../components/IncidentFilters';
import { IncidentMapFeature } from '../components/Map/IncidentMapFeature';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  AlertCircle,
  Eye,
  Wrench,
  ShieldAlert,
  Network,
  X,
  List,
  Map,
  Navigation,
  Repeat
} from 'lucide-react';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useState } from 'react';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';
import '../styles/Incidents.css';
import '../components/Map/IncidentMap.css';

/**
 * IncidentsPage — Página principal de incidentes con tabs (Lista | Mapa).
 *
 * Arquitectura Clean Architecture + MVVM:
 *  - View: este componente (solo renderiza, sin lógica de negocio)
 *  - ViewModel: useIncidentsViewModel()
 *  - Patrón espejo de ConnectionsPage (tabs + filters + content)
 */

const INCIDENT_TABS: TabItem<IncidentTab>[] = [
  {
    id: 'list',
    label: 'Lista de Incidentes',
    icon: <List size={16} />
  },
  {
    id: 'map',
    label: 'Mapa de Incidentes',
    icon: <Map size={16} />
  }
];

export const IncidentsPage: React.FC = () => {
  const vm = useIncidentsViewModel();
  const {
    incidents,
    categories,
    isLoading,
    error,
    filters,
    activeTab,
    connectionMode,
    connectionIdFromUrl,
    handleFilterChange,
    handleConsultar,
    handleTabChange,
    refresh,
    pageSize
  } = vm;

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // ── Detectar ruta activa para sincronizar el tab (igual que ConnectionsPage) ──
  useEffect(() => {
    if (pathname.endsWith('/map')) {
      handleTabChange('map');
    } else {
      handleTabChange('list');
    }
  }, [pathname, handleTabChange]);

  // ── Sincronizar navegación cuando el usuario hace clic en un tab ──
  const handleTabClick = (tab: IncidentTab) => {
    handleTabChange(tab);
    if (tab === 'map') {
      navigate('/incidents/map');
    } else {
      navigate('/incidents/list');
    }
  };

  const progress = useSimulatedProgress(isLoading);

  // ── Estado local de modales (SRP: la Page gestiona el estado de UI) ──
  const [resolveIncidentId, setResolveIncidentId] = useState<number | null>(
    null
  );
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentDetailRowResponse | null>(null);

  const [focusedIncident, setFocusedIncident] =
    useState<IncidentDetailRowResponse | null>(null);

  // ── Helpers de color (aislados aquí, no en el ViewModel) ─────────────────
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESUELTO':
        return 'green';
      case 'EN_INSPECCION':
        return 'orange';
      case 'REPORTADO':
        return 'yellow';
      case 'FALSO_REPORTE':
        return 'red';
      default:
        return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICA':
        return 'red';
      case 'ALTA':
        return 'orange';
      case 'MEDIA':
        return 'yellow';
      case 'BAJA':
        return 'cyan';
      default:
        return 'neutral';
    }
  };

  // ── Columnas de la tabla ──────────────────────────────────────────────────
  const columns: Column<IncidentDetailRowResponse>[] = [
    {
      header: 'ID',
      accessor: (item) => (
        <span className="text-secondary" style={{ fontWeight: 600 }}>
          {item.incidentId}
        </span>
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="incident-category-text">{item.referenceAddress?.toUpperCase()}</span>
            <div className="geo-status-bar-table">
              <div className="geo-status-bar__item">
                <Navigation size={12} className="geo-status-bar__icon geo-status-bar__icon--lat" />
                <span className="geo-status-bar__label">Latitud:</span>
                <span className="geo-status-bar__value geo-status-bar__value--coord">
                  {item.latitude ? Number(item.latitude).toFixed(7) : '-'}
                </span>
              </div>
              <div className="geo-status-bar__divider" />
              <div className="geo-status-bar__item">
                <Navigation size={12} className="geo-status-bar__icon geo-status-bar__icon--lng" style={{ transform: 'rotate(90deg)' }} />
                <span className="geo-status-bar__label">Longitud:</span>
                <span className="geo-status-bar__value geo-status-bar__value--coord">
                  {item.longitude ? Number(item.longitude).toFixed(7) : '-'}
                </span>
              </div>
            </div>
          </div>
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
        <span style={{ fontSize: '0.8125rem' }}>
          {ConverDate(item.reportDate)}
        </span>
      ),
      id: 'reportDate',
      style: { width: '110px' }
    },
    {
      header: 'ACCIONES',
      accessor: (item) => (
        <div
          className="incident-actions-cell"
          style={{ display: 'flex', gap: '8px' }}
        >
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

  // ── Banner de conexión (reutilizable entre lista y mapa) ─────────────────
  const ConnectionBanner =
    connectionMode && connectionIdFromUrl ? (
      <div className="incidents-connection-banner">
        <Network size={16} />
        <span>
          Incidentes activos de la acometida
          <strong> {connectionIdFromUrl}</strong> — solo estados distintos de
          RESUELTO
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
    ) : null;

  // ── Renderizado del contenido según el tab activo ─────────────────────────
  const renderContent = () => {
    // Loading inicial (sin datos aún)
    if (isLoading && incidents.length === 0) {
      return (
        <div className="incidents-loading-state">
          <CircularProgress
            progress={progress}
            size={80}
            label="Cargando incidentes..."
          />
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="incidents-loading-state">
          <EmptyState
            message="Error al cargar incidentes"
            description={error}
            icon={AlertCircle}
            variant="error"
            minHeight="300px"
            actionButton={
              <Button onClick={refresh} variant="outline" size="sm" color='error'
                leftIcon={<Repeat size={12} />}
              >
                Actualizar
              </Button>
            }
          />

        </div>
      );
    }

    // Tab: Mapa
    if (activeTab === 'map') {
      return (
        <div className="incident-map-page-content">
          {ConnectionBanner}
          <IncidentMapFeature
            incidents={incidents}
            selectedIncident={focusedIncident} // ← Usar focused para highlight
            onSelect={setFocusedIncident} // ← Solo focus + highlight
            onViewDetail={(incident) => setSelectedIncident(incident)} // ← Modal
          />
        </div>
      );
    }

    // Tab: Lista
    return (
      <>
        {ConnectionBanner}
        {incidents.length === 0 && !isLoading ? (
          <div className="incidents-loading-state">
            <EmptyState
              message={
                connectionMode ? 'Sin Incidentes Activos' : 'Sin Incidentes'
              }
              description={
                connectionMode
                  ? `La acometida ${connectionIdFromUrl} no tiene incidentes activos.`
                  : 'No hay incidentes reportados o no coinciden con los filtros actuales.'
              }
              icon={ShieldAlert}
              variant="info"
              minHeight="300px"
            />
          </div>
        ) : (
          <Table<IncidentDetailRowResponse>
            data={incidents}
            columns={columns}
            isLoading={isLoading}
            loadingState={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '3rem',
                  gap: '1rem'
                }}
              >
                <CircularProgress
                  progress={progress}
                  size={80}
                  label="Cargando incidentes..."
                />
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
                    : 'No se encontraron resultados con los filtros actuales.'}
                </p>
              </div>
            }
          />
        )}
      </>
    );
  };

  return (
    <>
      <PageLayout
        className="incidents-page"
        header={
          /* ── Tabs row (igual que connections-tabs-row) ── */
          <div className="incidents-tabs-row">
            <Tabs<IncidentTab>
              tabs={INCIDENT_TABS}
              activeTab={activeTab}
              onTabChange={handleTabClick}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                leftIcon={<ShieldAlert size={16} />}
                size="compact"
                onClick={() => navigate('/incidents/create')}
              >
                Reportar Incidente
              </Button>
            </div>
          </div>
        }
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
        {/* ── Content ── */}
        <div className="incidents-page-content">{renderContent()}</div>
      </PageLayout>

      {/* ── Modales ── */}
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
