import React, { useState } from 'react';
import { Map, Table, Activity, Compass, Send, Route } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useReadingRoutesViewModel } from '../../hooks/useReadingRoutesViewModel';
import { useRouteMapViewModel } from '../../hooks/useRouteMapViewModel';
import { useRouteDispatchViewModel } from '../../hooks/useRouteDispatchViewModel';

// Presentation Components
import { ReadingRouteMap } from '../../components/map/ReadingRouteMap';
import { RouteCatalogTable } from '../../components/catalog/RouteCatalogTable';
import { RouteDetailDrawer } from '../../components/catalog/RouteDetailDrawer';
import { LiveTrackingBoard } from '../../components/dispatch/LiveTrackingBoard';
import { BatchMorningDispatchModal } from '../../components/dispatch/BatchMorningDispatchModal';
import { ReassignSegmentModal } from '../../components/dispatch/ReassignSegmentModal';
import { AssignSingleRouteModal } from '../../components/dispatch/AssignSingleRouteModal';
import { SmartRouteResolverModal } from '../../components/resolution/SmartRouteResolverModal';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { RouteAssignment } from '../../../domain/models/RouteAssignment';

import './ReadingRoutesPage.css';

export const ReadingRoutesPage: React.FC = () => {
  // Main Page View Model
  const pageVm = useReadingRoutesViewModel();

  // GIS Map View Model
  const mapVm = useRouteMapViewModel();

  // Live Dispatch View Model
  const dispatchVm = useRouteDispatchViewModel();

  // Route Detail Drawer for Catalog
  const [drawerRoute, setDrawerRoute] = useState<ReadingRoute | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Switch to Map and select a route
  const handleViewInMap = (idRuta: number) => {
    mapVm.selectRouteById(idRuta);
    pageVm.setActiveTab('map');
  };

  // Inspect route from catalog
  const handleInspectRouteCatalog = async (idRuta: number) => {
    await mapVm.selectRouteById(idRuta);
    const found =
      pageVm.routes.find((r) => r.idRuta === idRuta) || mapVm.selectedRoute;
    setDrawerRoute(found);
    setIsDrawerOpen(true);
  };

  // Handle Reassign Route from Catalog Table or Detail Drawer
  const handleReassignRoute = (route: ReadingRoute) => {
    const existing = dispatchVm.assignments.find(
      (a) =>
        (route.idAsignacion && a.idAsignacion === route.idAsignacion) ||
        a.rutaId === route.idRuta,
    );
    if (existing) {
      dispatchVm.openReassignModal(existing);
      return;
    }

    const assignmentFromRoute: RouteAssignment = {
      idAsignacion: Number(route.idAsignacion || route.idRuta),
      rutaId: route.idRuta,
      codigoRuta: route.codigoRuta || route.codigo,
      nombreRuta: route.nombreRuta || route.nombre,
      usuarioId: route.idUsuarioAsignado,
      lecturistaId: route.idUsuarioAsignado,
      nombreLecturista: route.nombreUsuario || route.usuario,
      periodoMes: route.periodo || pageVm.periodoFilter,
      estado: (route.estado as any) || 'ASIGNADA',
      lecturasEsperadas: route.lecturasEsperadas || route.cantidadAcometidas,
      lecturasCompletadas: route.lecturasCompletadas || 0,
      lecturasPendientes: route.lecturasPendientes || 0,
      totalPredios: route.cantidadAcometidas,
    };
    dispatchVm.openReassignModal(assignmentFromRoute);
  };

  return (
    <>
      <PageLayout
        className="reading-routes-page"
        header={
          <header className="reading-routes-header">
            <div className="reading-routes-header-left">
              <h1 className="reading-routes-title">
                <Route size={18} style={{ color: 'var(--accent)' }} />
                Administración SIG de Rutas de Lectura
              </h1>
              <p className="reading-routes-subtitle">
                Gestión cartográfica, secuenciamiento TSP, despacho matutino y
                monitoreo en tiempo real
              </p>
            </div>

            <div className="reading-routes-header-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => pageVm.setIsResolverModalOpen(true)}
                title="Enrutador Espacial PostGIS: Resolver y asignar nueva acometida"
                leftIcon={<Compass size={15} />}
              >
                Enrutador Inteligente
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => dispatchVm.setIsMorningDispatchModalOpen(true)}
                title="Despachar rutas matutinas a los lecturistas"
                leftIcon={<Send size={15} />}
              >
                Despacho Matutino
              </Button>
            </div>
          </header>
        }
        filters={
          <nav
            className="reading-routes-tabs-bar"
            aria-label="Secciones de Rutas de Lectura"
          >
            <button
              className={`reading-routes-tab-btn ${pageVm.activeTab === 'map' ? 'active' : ''}`}
              onClick={() => pageVm.setActiveTab('map')}
            >
              <Map size={16} />
              Visor GIS
              <span className="reading-routes-tab-badge">79 Rutas</span>
            </button>

            <button
              className={`reading-routes-tab-btn ${pageVm.activeTab === 'dispatch' ? 'active' : ''}`}
              onClick={() => pageVm.setActiveTab('dispatch')}
            >
              <Activity size={16} />
              Monitoreo de Rutas
              <span className="reading-routes-tab-badge">
                {dispatchVm.assignments.length}
              </span>
            </button>

            <button
              className={`reading-routes-tab-btn ${pageVm.activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => pageVm.setActiveTab('catalog')}
            >
              <Table size={16} />
              Catálogo de Rutas
              <span className="reading-routes-tab-badge">
                {pageVm.total || 79}
              </span>
            </button>

            <button
              className={`reading-routes-tab-btn ${pageVm.activeTab === 'resolver' ? 'active' : ''}`}
              onClick={() => pageVm.setActiveTab('resolver')}
            >
              <Compass size={16} />
              Enrutador Espacial
            </button>
          </nav>
        }
      >
        <div className="reading-routes-tab-content">
          {/* Tab 1: Map */}
          {pageVm.activeTab === 'map' && (
            <div className="reading-routes-map-tab-content">
              <ReadingRouteMap
                geojsonData={mapVm.geojsonData}
                centroidsData={mapVm.centroidsData}
                selectedRoute={mapVm.selectedRoute}
                routeConnections={mapVm.routeConnections}
                isConnectionsLoading={mapVm.isConnectionsLoading}
                isOptimizing={mapVm.isOptimizing}
                selectedSector={mapVm.selectedSector}
                onSectorChange={mapVm.setSelectedSector}
                periodoFilter={mapVm.periodoFilter}
                onPeriodoChange={mapVm.setPeriodoFilter}
                estadoFilter={mapVm.estadoFilter}
                onEstadoChange={mapVm.setEstadoFilter}
                onResetFilters={mapVm.resetFilters}
                hasActiveFilters={mapVm.hasActiveFilters}
                onSelectRouteId={mapVm.selectRouteById}
                onCloseSidePanel={mapVm.closeSidePanel}
                onOptimizeSequence={mapVm.optimizeSequence}
                onRefresh={mapVm.refreshMap}
                isLoading={mapVm.isLoading}
                isSidePanelOpen={mapVm.isSidePanelOpen}
                onAssignRoute={dispatchVm.openSingleAssignModal}
              />
            </div>
          )}

          {/* Tab 2: Live Tracking & Dispatch */}
          {pageVm.activeTab === 'dispatch' && (
            <LiveTrackingBoard
              assignments={dispatchVm.assignments}
              isLoading={dispatchVm.isLoading}
              periodo={dispatchVm.periodo}
              fecha={dispatchVm.fecha}
              onPeriodoChange={dispatchVm.setPeriodo}
              onFechaChange={dispatchVm.setFecha}
              onOpenMorningDispatch={() =>
                dispatchVm.setIsMorningDispatchModalOpen(true)
              }
              onOpenReassign={dispatchVm.openReassignModal}
              onCancelAssignment={dispatchVm.cancelAssignment}
              onRefresh={dispatchVm.refreshLiveTracking}
            />
          )}

          {/* Tab 3: Catalog Table */}
          {pageVm.activeTab === 'catalog' && (
            <RouteCatalogTable
              routes={pageVm.routes}
              isLoading={pageVm.isLoading}
              totalRoutes={pageVm.total}
              page={pageVm.page}
              limit={pageVm.limit}
              searchTerm={pageVm.search}
              selectedSector={pageVm.sectorFilter}
              activaOnly={pageVm.activaFilter}
              estadoFilter={pageVm.estadoFilter}
              periodoFilter={pageVm.periodoFilter}
              onSearchChange={pageVm.setSearch}
              onSectorChange={pageVm.setSectorFilter}
              onActivaChange={pageVm.setActivaFilter}
              onEstadoChange={pageVm.setEstadoFilter}
              onPeriodoChange={pageVm.setPeriodoFilter}
              onResetFilters={pageVm.resetFilters}
              onPageChange={pageVm.setPage}
              onViewInMap={handleViewInMap}
              onInspectRoute={handleInspectRouteCatalog}
              onOptimize={(idRuta) => mapVm.optimizeSequence(idRuta)}
              onAssignRoute={dispatchVm.openSingleAssignModal}
              onReassignRoute={handleReassignRoute}
            />
          )}

          {/* Tab 4: Spatial Resolver Hero */}
          {pageVm.activeTab === 'resolver' && (
            <div className="reading-routes-resolver-hero">
              <div className="reading-routes-resolver-icon">
                <Compass size={32} />
              </div>
              <h2 className="reading-routes-resolver-title">
                Enrutamiento Automático de Acometidas
              </h2>
              <p className="reading-routes-resolver-desc">
                Esta herramienta analiza la ubicación geográfica (latitud y
                longitud) de una acometida nueva o existente, evaluando
                polígonos cerrados y algoritmos de vecinos más cercanos (KNN
                PostGIS) para insertarla con el índice de recorrido óptimo sin
                romper la ruta existente.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => pageVm.setIsResolverModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.5rem'
                }}
              >
                <Compass size={16} />
                Abrir Enrutador Espacial
              </button>
            </div>
          )}
        </div>
      </PageLayout>

      {/* Catalog Route Detail Drawer */}
      <RouteDetailDrawer
        isOpen={isDrawerOpen}
        route={drawerRoute || mapVm.selectedRoute}
        connections={mapVm.routeConnections}
        isLoading={mapVm.isConnectionsLoading}
        isOptimizing={mapVm.isOptimizing}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerRoute(null);
        }}
        onOptimize={mapVm.optimizeSequence}
        onAssignRoute={dispatchVm.openSingleAssignModal}
        onReassignRoute={handleReassignRoute}
      />

      {/* Bulk Morning Dispatch Modal */}
      <BatchMorningDispatchModal
        isOpen={dispatchVm.isMorningDispatchModalOpen}
        onClose={() => dispatchVm.setIsMorningDispatchModalOpen(false)}
        routes={pageVm.allRoutes.length > 0 ? pageVm.allRoutes : pageVm.routes}
        onDispatch={async (req, onProgress) => {
          const res = await dispatchVm.executeMorningDispatch(req, onProgress);
          void pageVm.refreshRoutes();
          return res;
        }}
      />

      {/* Single Route Assignment Modal */}
      <AssignSingleRouteModal
        isOpen={dispatchVm.isSingleAssignModalOpen}
        route={dispatchVm.selectedRouteForAssign}
        onClose={dispatchVm.closeSingleAssignModal}
        onAssign={async (req) => {
          const res = await dispatchVm.executeSingleAssign(req);
          void pageVm.refreshRoutes();
          return res;
        }}
      />

      {/* Reassign Segment Modal */}
      <ReassignSegmentModal
        isOpen={dispatchVm.isReassignModalOpen}
        assignment={dispatchVm.selectedAssignmentForReassign}
        onClose={dispatchVm.closeReassignModal}
        onReassign={async (req) => {
          const res = await dispatchVm.executeReassignment(req);
          void pageVm.refreshRoutes();
          return res;
        }}
      />

      {/* Spatial Route Resolver Modal */}
      <SmartRouteResolverModal
        isOpen={pageVm.isResolverModalOpen}
        onClose={() => pageVm.setIsResolverModalOpen(false)}
        onSuccessInsert={() => {
          mapVm.refreshMap();
          pageVm.refreshRoutes();
        }}
      />
    </>
  );
};
