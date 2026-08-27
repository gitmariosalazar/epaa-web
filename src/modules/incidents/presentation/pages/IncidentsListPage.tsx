import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useIncidentsViewModel } from '../hooks/useIncidentsViewModel';
import { ResolveIncidentModal } from '../components/ResolveIncidentModal';
import { AddWorkOrderModal } from '../components/AddWorkOrderModal';
import { IncidentDetailModal } from '../components/IncidentDetailModal';
import { IncidentFilters } from '../components/IncidentFilters';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { AlertCircle, Eye, Wrench, ShieldAlert, Network, X, Navigation, Repeat, Plus } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { useSimulatedProgress } from '@/shared/presentation/components/CircularProgress/useSimulatedProgress';
import '../styles/Incidents.css';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { getPriorityColor, getStatusColor, getWorkOrderStatusColor } from '@/shared/presentation/utils/colors/status-color';
import { FaTools } from 'react-icons/fa';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

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

  const [resolveIncidentId, setResolveIncidentId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetailRowResponse | null>(null);
  const [addWorkOrderIncident, setAddWorkOrderIncident] = useState<IncidentDetailRowResponse | null>(null);


  const columns: Column<IncidentDetailRowResponse>[] = [
    {
      header: 'Nº Incidente',
      accessor: (item) => (
        <span className="text-secondary" style={{ fontWeight: 600 }}>{item.incidentCode}</span>
      ),
      id: 'incidentCode',
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
          <span className="incident-category-text">{truncateText(item.referenceAddress?.toUpperCase() || '-', 40)}</span>
          <div className="geo-status-bar">
            <div className="geo-status-bar__divider" />
            <div className="geo-status-bar__divider" />
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
      header: 'ESTADO OT1',
      accessor: (item) => (
        item.currentOrderState ? (
          <div
            className="incident-actions-cell-state">
            <div className='incident-row'>
              <ColorChip
                label={item.currentOrderState.replace(/_/g, ' ')}
                color={getWorkOrderStatusColor(item.currentOrderState || '')}
                variant="soft"
                size="xs"
                borderRadius={5}
              />
              <ColorChip
                label={item.orderCode}
                color={item.currentOrderState === 'COMPLETADA' ? 'green' : 'amber'}
                variant="ghost"
                size="xs"
                borderRadius={5}
              />
            </div>
            {
              item.orderCode !== null && (
                <Tooltip content={`Ver Orden de Trabajo`} themeColor='accent' followCursor={false}>
                  <Button
                    onClick={() => navigate(`/work-orders/search?code=${item.orderCode}`)}
                    size='xs'
                    color='accent'
                    circle
                    variant='dashed'
                  >
                    <FaTools size={13} />
                  </Button>
                </Tooltip>
              )
            }
          </div>
        ) : (
          <div
            className="incident-actions-cell">
            <ColorChip
              label="Sin Orden de Trabajo"
              color="red"
              variant="soft"
              size="xs"
              borderRadius={5}
            />
          </div>
        )

      ),
      id: 'currentOrderState',
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
          {item.currentOrderState == 'COMPLETADA' && item.status != 'RESUELTO' && (
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
          {
            !item.orderCode && item.status != 'RESUELTO' && item.status !== 'FALSO_REPORTE' && (
              <Button
                variant="dashed"
                color="green"
                size="xs"
                onClick={() => setAddWorkOrderIncident(item)}
                leftIcon={<Plus size={12} />}
              >
                Agregar OT
              </Button>
            )
          }
        </div>
      ),
      id: 'actions',
      style: { width: '180px' }
    }
  ];

  return (
    <>
      <PageLayout
        className="reading-images-page"
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

      {addWorkOrderIncident !== null && (
        <AddWorkOrderModal
          isOpen={true}
          onClose={() => setAddWorkOrderIncident(null)}
          incident={addWorkOrderIncident}
          onSubmit={() => {
            setAddWorkOrderIncident(null);
            refresh();
          }}
        />
      )}
    </>
  );
};
