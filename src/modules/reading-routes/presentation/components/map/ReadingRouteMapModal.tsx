import React, { useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ReadingRouteMap } from './ReadingRouteMap';
import {
  useRouteMapViewModel,
  type UseRouteMapViewModelReturn
} from '../../hooks/useRouteMapViewModel';
import type {
  ReadingRoute,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection
} from '@/modules/reading-routes/domain/models/ReadingRoute';
import type { RouteConnection } from '@/modules/reading-routes/domain/models/RouteConnection';
import type { MapThemeConfig } from './ReadingRouteMapStyles';
import './ReadingRouteMapModal.css';

/**
 * Propiedades del componente modal para el Visor GIS de Rutas.
 *
 * Clean Architecture & SOLID:
 * - ISP (Interface Segregation Principle): Todas las propiedades no esenciales son opcionales con valores predeterminados seguros.
 * - DIP (Dependency Inversion Principle): Permite la inyección de dependencias a través de `mapVm` opcional o resuelve autónomamente mediante `useRouteMapViewModel`.
 * - OCP (Open/Closed Principle): Permite extender acciones como asignación y reasignación sin alterar el contrato básico.
 */
export interface ReadingRouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoute?: ReadingRoute | null;
  routeId?: number | null;
  geojsonData?: RouteGeoJsonFeatureCollection | null;
  centroidsData?: RouteCentroidFeatureCollection | null;
  routeConnections?: RouteConnection[];
  isConnectionsLoading?: boolean;
  isOptimizing?: boolean;
  selectedSector?: number;
  onSectorChange?: (sector: number | undefined) => void;
  periodoFilter?: string;
  onPeriodoChange?: (periodo: string) => void;
  estadoFilter?: string;
  onEstadoChange?: (estado: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onSelectRouteId?: (idRuta: number) => void;
  onCloseSidePanel?: () => void;
  onOptimizeSequence?: (idRuta: number) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
  isSidePanelOpen?: boolean;
  showPolygons?: boolean;
  mapTheme?: MapThemeConfig;
  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
  mapVm?: UseRouteMapViewModelReturn;
}

/**
 * Presentación controlada con ViewModel inyectado desde el contenedor principal (Page/Context).
 * Evita la duplicación de subscripciones de red y sincroniza el estado de selección cartográfica.
 */
const ReadingRouteMapModalControlled: React.FC<
  ReadingRouteMapModalProps & { mapVm: UseRouteMapViewModelReturn }
> = ({
  isOpen,
  onClose,
  selectedRoute,
  routeId,
  mapVm,
  onAssignRoute,
  onReassignRoute,
  ...rest
}) => {
    const activeRoute = useMemo(() => {
      // Si el usuario seleccionó otra ruta en el mapa diferente a la inicial, priorizamos la seleccionada en el mapa
      if (
        mapVm.selectedRoute &&
        selectedRoute &&
        mapVm.selectedRoute.idRuta !== selectedRoute.idRuta
      ) {
        return mapVm.selectedRoute;
      }

      if (selectedRoute) {
        if (
          mapVm.selectedRoute &&
          mapVm.selectedRoute.idRuta === selectedRoute.idRuta
        ) {
          return {
            ...mapVm.selectedRoute,
            ...selectedRoute,
            idAsignacion:
              selectedRoute.idAsignacion ?? mapVm.selectedRoute.idAsignacion,
            estado: selectedRoute.estado || mapVm.selectedRoute.estado,
            usuario:
              selectedRoute.usuario ||
              selectedRoute.nombreUsuario ||
              mapVm.selectedRoute.usuario,
            nombreUsuario:
              selectedRoute.nombreUsuario ||
              selectedRoute.usuario ||
              mapVm.selectedRoute.nombreUsuario,
            idUsuarioAsignado:
              selectedRoute.idUsuarioAsignado ??
              mapVm.selectedRoute.idUsuarioAsignado,
            periodo: selectedRoute.periodo || mapVm.selectedRoute.periodo,
            lecturasEsperadas:
              selectedRoute.lecturasEsperadas ??
              mapVm.selectedRoute.lecturasEsperadas,
            lecturasCompletadas:
              selectedRoute.lecturasCompletadas ??
              mapVm.selectedRoute.lecturasCompletadas,
            lecturasPendientes:
              selectedRoute.lecturasPendientes ??
              mapVm.selectedRoute.lecturasPendientes,
          };
        }
        return selectedRoute;
      }
      return mapVm.selectedRoute;
    }, [selectedRoute, mapVm.selectedRoute]);

    const targetId = activeRoute?.idRuta ?? routeId;

    // Seleccionar la ruta en el ViewModel si aún no está seleccionada
    useEffect(() => {
      if (isOpen && targetId && mapVm.selectedRoute?.idRuta !== targetId) {
        void mapVm.selectRouteById(targetId);
      }
    }, [isOpen, targetId, mapVm]);

    const routeTitle = useMemo(() => {
      if (activeRoute) {
        const code =
          activeRoute.codigoRuta || activeRoute.codigo || `R-${activeRoute.idRuta}`;
        const name = activeRoute.nombreRuta || activeRoute.nombre || '';
        return `Visor SIG — Ruta ${code}${name ? `: ${name}` : ''}`;
      }
      return 'Visor SIG — Cartografía de Ruta';
    }, [activeRoute]);

    const handleSelectRoute = (id: number) => {
      void mapVm.selectRouteById(id);
      rest.onSelectRouteId?.(id);
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={routeTitle}
        description="Visualización cartográfica del polígono perimetral, centroide geométrico y acometidas en territorio"
        icon={<MapPin size={20} />}
        headerColor="teal"
        size="full"
      >
        <div className="reading-route-map-modal-wrapper">
          <ReadingRouteMap
            geojsonData={rest.geojsonData ?? mapVm.geojsonData}
            centroidsData={rest.centroidsData ?? mapVm.centroidsData}
            selectedRoute={activeRoute}
            routeConnections={rest.routeConnections ?? mapVm.routeConnections}
            isConnectionsLoading={
              rest.isConnectionsLoading ?? mapVm.isConnectionsLoading
            }
            isOptimizing={rest.isOptimizing ?? mapVm.isOptimizing}
            selectedSector={rest.selectedSector ?? mapVm.selectedSector}
            onSectorChange={rest.onSectorChange ?? mapVm.setSelectedSector}
            periodoFilter={rest.periodoFilter ?? mapVm.periodoFilter}
            onPeriodoChange={rest.onPeriodoChange ?? mapVm.setPeriodoFilter}
            estadoFilter={rest.estadoFilter ?? mapVm.estadoFilter}
            onEstadoChange={rest.onEstadoChange ?? mapVm.setEstadoFilter}
            onResetFilters={rest.onResetFilters ?? mapVm.resetFilters}
            hasActiveFilters={rest.hasActiveFilters ?? mapVm.hasActiveFilters}
            onSelectRouteId={handleSelectRoute}
            onCloseSidePanel={rest.onCloseSidePanel ?? mapVm.closeSidePanel}
            onOptimizeSequence={rest.onOptimizeSequence ?? mapVm.optimizeSequence}
            onRefresh={rest.onRefresh ?? mapVm.refreshMap}
            isLoading={rest.isLoading ?? mapVm.isLoading}
            isSidePanelOpen={rest.isSidePanelOpen ?? mapVm.isSidePanelOpen}
            onAssignRoute={onAssignRoute}
            onReassignRoute={onReassignRoute}
          />
        </div>
      </Modal>
    );
  };

/**
 * Presentación autónoma para uso independiente (ej. en Storybook o componentes aislados).
 * Inicializa su propia instancia de ViewModel consumiendo casos de uso del dominio mediante contexto.
 */
const ReadingRouteMapModalAutonomous: React.FC<ReadingRouteMapModalProps> = ({
  isOpen,
  onClose,
  selectedRoute,
  routeId,
  onAssignRoute,
  onReassignRoute,
  ...rest
}) => {
  const mapVm = useRouteMapViewModel();
  const activeRoute = useMemo(() => {
    // Si el usuario seleccionó otra ruta en el mapa diferente a la inicial, priorizamos la seleccionada en el mapa
    if (
      mapVm.selectedRoute &&
      selectedRoute &&
      mapVm.selectedRoute.idRuta !== selectedRoute.idRuta
    ) {
      return mapVm.selectedRoute;
    }

    if (selectedRoute) {
      if (
        mapVm.selectedRoute &&
        mapVm.selectedRoute.idRuta === selectedRoute.idRuta
      ) {
        return {
          ...mapVm.selectedRoute,
          ...selectedRoute,
          idAsignacion:
            selectedRoute.idAsignacion ?? mapVm.selectedRoute.idAsignacion,
          estado: selectedRoute.estado || mapVm.selectedRoute.estado,
          usuario:
            selectedRoute.usuario ||
            selectedRoute.nombreUsuario ||
            mapVm.selectedRoute.usuario,
          nombreUsuario:
            selectedRoute.nombreUsuario ||
            selectedRoute.usuario ||
            mapVm.selectedRoute.nombreUsuario,
          idUsuarioAsignado:
            selectedRoute.idUsuarioAsignado ??
            mapVm.selectedRoute.idUsuarioAsignado,
          periodo: selectedRoute.periodo || mapVm.selectedRoute.periodo,
          lecturasEsperadas:
            selectedRoute.lecturasEsperadas ??
            mapVm.selectedRoute.lecturasEsperadas,
          lecturasCompletadas:
            selectedRoute.lecturasCompletadas ??
            mapVm.selectedRoute.lecturasCompletadas,
          lecturasPendientes:
            selectedRoute.lecturasPendientes ??
            mapVm.selectedRoute.lecturasPendientes,
        };
      }
      return selectedRoute;
    }
    return mapVm.selectedRoute;
  }, [selectedRoute, mapVm.selectedRoute]);

  const targetId = activeRoute?.idRuta ?? routeId;

  useEffect(() => {
    if (isOpen && targetId && mapVm.selectedRoute?.idRuta !== targetId) {
      void mapVm.selectRouteById(targetId);
    }
  }, [isOpen, targetId, mapVm]);

  const routeTitle = useMemo(() => {
    if (activeRoute) {
      const code =
        activeRoute.codigoRuta || activeRoute.codigo || `R-${activeRoute.idRuta}`;
      const name = activeRoute.nombreRuta || activeRoute.nombre || '';
      return `Visor SIG — Ruta ${code}${name ? `: ${name}` : ''}`;
    }
    return 'Visor SIG — Cartografía de Ruta';
  }, [activeRoute]);

  const handleSelectRoute = (id: number) => {
    void mapVm.selectRouteById(id);
    rest.onSelectRouteId?.(id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={routeTitle}
      description="Visualización cartográfica del polígono perimetral, centroide geométrico y acometidas en territorio"
      icon={<MapPin size={20} />}
      headerColor="teal"
      size="full"
    >
      <div className="reading-route-map-modal-wrapper">
        <ReadingRouteMap
          geojsonData={rest.geojsonData ?? mapVm.geojsonData}
          centroidsData={rest.centroidsData ?? mapVm.centroidsData}
          selectedRoute={activeRoute}
          routeConnections={rest.routeConnections ?? mapVm.routeConnections}
          isConnectionsLoading={
            rest.isConnectionsLoading ?? mapVm.isConnectionsLoading
          }
          isOptimizing={rest.isOptimizing ?? mapVm.isOptimizing}
          selectedSector={rest.selectedSector ?? mapVm.selectedSector}
          onSectorChange={rest.onSectorChange ?? mapVm.setSelectedSector}
          periodoFilter={rest.periodoFilter ?? mapVm.periodoFilter}
          onPeriodoChange={rest.onPeriodoChange ?? mapVm.setPeriodoFilter}
          estadoFilter={rest.estadoFilter ?? mapVm.estadoFilter}
          onEstadoChange={rest.onEstadoChange ?? mapVm.setEstadoFilter}
          onResetFilters={rest.onResetFilters ?? mapVm.resetFilters}
          hasActiveFilters={rest.hasActiveFilters ?? mapVm.hasActiveFilters}
          onSelectRouteId={handleSelectRoute}
          onCloseSidePanel={rest.onCloseSidePanel ?? mapVm.closeSidePanel}
          onOptimizeSequence={rest.onOptimizeSequence ?? mapVm.optimizeSequence}
          onRefresh={rest.onRefresh ?? mapVm.refreshMap}
          isLoading={rest.isLoading ?? mapVm.isLoading}
          isSidePanelOpen={rest.isSidePanelOpen ?? mapVm.isSidePanelOpen}
          onAssignRoute={onAssignRoute}
          onReassignRoute={onReassignRoute}
        />
      </div>
    </Modal>
  );
};

/**
 * Modal para visualizar el mapa GIS con el polígono, centroide y acometidas de una ruta.
 *
 * Implementa el patrón Strategy para alternar limpiamente entre modo controlado y autónomo
 * cumpliendo con Clean Architecture y los principios SOLID.
 */
export const ReadingRouteMapModal: React.FC<ReadingRouteMapModalProps> = (
  props
) => {
  if (!props.isOpen) return null;

  if (props.mapVm) {
    return <ReadingRouteMapModalControlled {...props} mapVm={props.mapVm} />;
  }

  return <ReadingRouteMapModalAutonomous {...props} />;
};
