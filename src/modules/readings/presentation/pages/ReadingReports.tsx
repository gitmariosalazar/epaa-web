import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useReadingReportsViewModel } from '../hooks/useReadingReportsViewModel';
import type { IncidentTab } from '../hooks/useReadingReportsViewModel';
import { ResolveReadingReportModal } from '../components/ReadingReports/ResolveReadingReportModal';
import { AddWorkOrderReadingReportModal } from '../components/ReadingReports/AddWorkOrderReadingReportModal';
import { ReadingReportDetailModal } from '../components/ReadingReports/ReadingReportDetailModal';
import { ReadingReportsFilters } from '../components/ReadingReportsFilters';
import { ReadingReportMapFeature } from '@/modules/readings/presentation/components/ReadingReports/Map/ReadingReportMapFeature';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { CreateReadingPage } from './CreateReadingPage';
import { UpdateReadingWithImagesPage } from './UpdateReadingWithImagesPage';
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
  Repeat,
  Plus,
  MapPin,
  FileText,
} from 'lucide-react';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useState, useMemo } from 'react';
import type { IncidentDetailRowResponse } from '../../../incidents/domain/schemas/dtos/response/view_incident.response';
import '../styles/ReadingReports.css';
import '../components/ReadingReports/Map/ReadingReportMap.css';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { getMeterConditionColor, getPhysicalStateColor, getPriorityColor, getStatusColor, getWorkOrderStatusColor } from '@/shared/presentation/utils/colors/status-colors';
import { FaEdit, FaTools } from 'react-icons/fa';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

/**
 * ReadingReports — Página principal de incidentes con tabs (Lista | Mapa).
 *
 * Arquitectura Clean Architecture + MVVM:
 *  - View: este componente (solo renderiza, sin lógica de negocio)
 *  - ViewModel: useReadingReportsViewModel()
 *  - Patrón espejo de ConnectionsPage (tabs + filters + content)
 */

const INCIDENT_TABS: TabItem<IncidentTab>[] = [
  {
    id: 'list',
    label: 'Lista de Reportes de Lecturas',
    icon: <List size={16} />
  },
  {
    id: 'map',
    label: 'Mapa de Reportes de Lecturas',
    icon: <Map size={16} />
  }
];

import { IncidentProvider } from '../../../incidents/presentation/context/IncidentContext';
import { useTranslation } from 'react-i18next';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ConnectionDetailModal } from '@/modules/connections/presentation/components/ConnectionDetailModal';
import { ReadingDetailModal } from '../components/ReadingDetailModal';

const ReadingReportsContent: React.FC = () => {
  const vm = useReadingReportsViewModel();
  const {
    incidents,
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
  const { t } = useTranslation();


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
  };

  const progress = useSimulatedProgress(isLoading);

  // ── Estado local de modales (SRP: la Page gestiona el estado de UI) ──
  const [resolveIncidentId, setResolveIncidentId] = useState<string | null>(
    null
  );
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentDetailRowResponse | null>(null);

  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);
  const focusedIncident = useMemo(
    () => incidents.find((i) => i.incidentId === focusedIncidentId) || null,
    [incidents, focusedIncidentId]
  );
  const [addWorkOrderIncident, setAddWorkOrderIncident] =
    useState<IncidentDetailRowResponse | null>(null);

  const [detailCadastralKey, setDetailCadastralKey] = useState<string | null>(null);




  const [readingModalState, setReadingModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'update';
    cadastralKey: string;
  } | null>(null);

  // Detail Modal State for Readings
  const [detailModalState, setDetailModalState] = useState<{ isOpen: boolean; cadastralKey: string | null; yearAndMonth: string | null }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null,
  });

  const handleViewDetails = (cadastralKey: string, yearAndMonth: string) => {
    setDetailModalState({ isOpen: true, cadastralKey, yearAndMonth });
  };

  const handleAction = (mode: 'create' | 'update', cadastralKey: string) => {
    setReadingModalState({ isOpen: true, mode, cadastralKey });
  };





  // ── Columnas de la tabla ──────────────────────────────────────────────────
  const columns: Column<IncidentDetailRowResponse>[] = [
    {
      header: 'Nº Incidente',
      accessor: (item) => (
        <span className="text-secondary" style={{ fontWeight: 600 }}>
          {item.incidentCode}
        </span>
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
      header: 'CONDICIÓN/ESTADO',
      accessor: (item) => {
        const meter = getMeterConditionColor(item.meterCondition || '');
        const physical = getPhysicalStateColor(item.physicalState || '');

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="geo-status-bar-table">
                <div className="geo-status-bar__item">
                  <Tooltip content={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="geo-status-bar__label">Condicion del medidor: {meter.label}</span>
                    </div>
                  }
                    followCursor={false}
                    themeColor={meter.color}
                    position='top'>

                    <ColorChip
                      label={meter.label}
                      color={meter.color}
                      icon={meter.icon}
                      size='xs'
                    />
                  </Tooltip>
                </div>
                <div className="geo-status-bar__item">
                  <Tooltip content={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="geo-status-bar__label">Estado físico del medidor: {physical.label}</span>
                    </div>
                  }
                    followCursor={false}
                    themeColor={physical.color}
                    position='top'>

                    <ColorChip
                      label={physical.label}
                      color={physical.color}
                      icon={physical.icon}
                      size='xs'
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        );
      },
      id: 'connectionState',
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
            <span className="incident-category-text">{truncateText(item.referenceAddress?.toUpperCase() || '-', 40)}</span>
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
                color={'amber'}
                variant="ghost"
                size="xs"
                borderRadius={5}
              />
            </div>
            {
              item.orderCode !== null && (
                <Tooltip content={`Ver Orden de Trabajo Nro. : ${item.orderCode}`} themeColor='accent' followCursor={false}>
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
          <Tooltip followCursor={false} themeColor="warning" content={t('common.edit', 'Editar')}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAction('update', item.connectionId!)}
              color="warning"
              circle
            >
              <FaEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip followCursor={false}
            themeColor="cyan"
            content={
              <>
                <div> Ver Detalles de la Acometida </div>
                <div> Acometida ID: {item.connectionId} </div>
              </>
            }
          >
            <Button color="cyan" size="sm" variant="ghost" onClick={() => setDetailCadastralKey(item.connectionId)} circle>
              <MapPin size={16} />
            </Button>
          </Tooltip>

          <Tooltip followCursor={false}
            themeColor="info"
            content={
              <>
                <div> Ver Detalles de la Lectura </div>
                <div> Lectura ID: {item.readingId} </div>
              </>
            }
          >
            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(item.connectionId!, item.reportDate)} circle>
              <FileText size={16} />
            </Button>
          </Tooltip>
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
          <ReadingReportMapFeature
            incidents={incidents}
            selectedIncident={focusedIncident} // ← Usar focused para highlight
            onSelect={(incident) => setFocusedIncidentId(incident.incidentId)} // ← Solo focus + highlight
            onViewDetail={(incident) => setSelectedIncident(incident)} // ← Modal
            onResolve={(id) => setResolveIncidentId(id)}
            onAddWorkOrder={(incident) => setAddWorkOrderIncident(incident)}
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
        className="reading-images-page"
        header={
          /* ── Tabs row (igual que connections-tabs-row) ── */
          <div className="incidents-tabs-row">
            <Tabs<IncidentTab>
              tabs={INCIDENT_TABS}
              activeTab={activeTab}
              onTabChange={handleTabClick}
            />
            {
              /*
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                leftIcon={<ShieldAlert size={16} />}
                size="compact"
                onClick={() => navigate('/incidents/create')}
              >
                Reportar Lectura
              </Button>
            </div>
              */
            }
          </div>
        }
        filters={
          <ReadingReportsFilters
            searchQuery={filters.search}
            onSearchQueryChange={(val) => handleFilterChange({ search: val })}
            searchField={filters.searchField}
            onSearchFieldChange={(val) => handleFilterChange({ searchField: val })}
            selectedStatus={filters.status}
            onStatusChange={(val) => handleFilterChange({ status: val })}
            selectedPriority={filters.priority}
            onPriorityChange={(val) => handleFilterChange({ priority: val })}
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
        <ResolveReadingReportModal
          isOpen={true}
          onClose={() => setResolveIncidentId(null)}
          incidentId={resolveIncidentId}
        />
      )}

      {selectedIncident !== null && (
        <ReadingReportDetailModal
          isOpen={true}
          onClose={() => setSelectedIncident(null)}
          incident={selectedIncident}
        />
      )}

      {/* Connection Detail Modal */}
      <ConnectionProvider>
        <ConnectionDetailModal
          isOpen={detailCadastralKey !== null}
          onClose={() => setDetailCadastralKey(null)}
          cadastralKey={detailCadastralKey}
        />
      </ConnectionProvider>

      {/* Reading Detail Modal (No extra provider needed as page is already under ReadingsProvider) */}
      <ReadingDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
        cadastralKey={detailModalState.cadastralKey}
        yearAndMonth={detailModalState.yearAndMonth}
      />


    {addWorkOrderIncident !== null && (
        <AddWorkOrderReadingReportModal
          isOpen={true}
          onClose={() => setAddWorkOrderIncident(null)}
          incident={addWorkOrderIncident}
          onSubmit={() => {
            setAddWorkOrderIncident(null);
            refresh();
          }}
        />
      )}

      {/* Modal de Creación/Edición de Lectura */}
      <Modal
        isOpen={!!readingModalState?.isOpen}
        onClose={() => setReadingModalState(null)}
        title={
          readingModalState?.mode === 'create'
            ? 'Nueva Lectura'
            : 'Editar Lectura'
        }
        size="full"
      >
        <div style={{ padding: '0px 10px', height: '100%' }}>
          {readingModalState?.mode === 'create' && (
            <CreateReadingPage
              initialCadastralKey={readingModalState?.cadastralKey}
              onSuccess={() => setReadingModalState(null)}
              onCancel={() => setReadingModalState(null)}
            />
          )}
          {readingModalState?.mode === 'update' && (
            <UpdateReadingWithImagesPage
              initialCadastralKey={readingModalState?.cadastralKey}
              onSuccess={() => setReadingModalState(null)}
              onCancel={() => setReadingModalState(null)}
            />
          )}
        </div>
      </Modal>
    </>
  );
};


export const ReadingReports: React.FC = () => {
  return (
    <IncidentProvider>
      <ReadingReportsContent />
    </IncidentProvider>
  );
};

