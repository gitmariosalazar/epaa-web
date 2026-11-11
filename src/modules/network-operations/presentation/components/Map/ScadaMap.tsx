import React, { useEffect, useMemo, useState } from 'react';
import { Map, useMap, AdvancedMarker, ControlPosition } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import type { LayersList, PickingInfo } from '@deck.gl/core';
import { GeoJsonLayer, TextLayer, ArcLayer } from '@deck.gl/layers';
import type {
  GeoJsonFeature,
  GeoJsonFeatureProperties,
  MapGeojsonResponse
} from '../../../domain/models/GeoJsonFeature';
import { NodeClassifier } from '../../../domain/services/NodeClassifier';
import { NodeVisualConfigProvider } from './utils/nodeVisualConfig';
import { MapCameraController } from './controllers/MapCameraController';
import { ScadaMapFilter, type TankOption } from './ScadaMapFilter';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

// Re-exports for presentation backwards-compatibility
export const isPlantNode = (f?: GeoJsonFeature | null): boolean => NodeClassifier.isPlant(f);
export const isTankNode = (f?: GeoJsonFeature | null): boolean => NodeClassifier.isTank(f);
export const isPumpNode = (f?: GeoJsonFeature | null): boolean => NodeClassifier.isPump(f);

export interface ScadaMapProps {
  geoJsonData: MapGeojsonResponse | null;
  onNodeSelect?: (node: GeoJsonFeature | null) => void;
  selectedNode?: GeoJsonFeature | null;
  selectedTankFilter?: string | null;
  onTankFilterChange?: (tankName: string | null) => void;
  showFilterControl?: boolean;
}

interface GoogleMapsOverlayInternal {
  setMap(map: google.maps.Map | null): void;
  setProps(props: unknown): void;
  finalize(): void;
  _onDrawRaster?: () => void;
  _overlay?: {
    getProjection?: () => google.maps.MapCanvasProjection | null;
  };
}

interface DeckGlOverlayProps {
  layers: LayersList;
}

const DeckGlOverlay: React.FC<DeckGlOverlayProps> = ({ layers }) => {
  const map = useMap();
  const [overlay, setOverlay] = React.useState<GoogleMapsOverlay | null>(null);

  useEffect(() => {
    if (!map) return;

    const instance = new GoogleMapsOverlay({ interleaved: false });
    const internalInstance = instance as unknown as GoogleMapsOverlayInternal;

    // Workaround for deck.gl bug where it crashes on resize/draw if projection is null
    if (typeof internalInstance._onDrawRaster === 'function') {
      const originalDrawRaster = internalInstance._onDrawRaster.bind(internalInstance);
      internalInstance._onDrawRaster = () => {
        const overlayView = internalInstance._overlay;
        if (overlayView && !overlayView.getProjection?.()) {
          return;
        }
        originalDrawRaster();
      };
    }

    const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
      instance.setMap(map);
      setOverlay(instance);
    });

    return () => {
      google.maps.event.removeListener(listener);
      instance.setMap(null);
      instance.finalize();
    };
  }, [map]);

  useEffect(() => {
    if (overlay) {
      overlay.setProps({
        layers,
        getTooltip: (info: PickingInfo) => {
          const object = info.object as GeoJsonFeature | undefined;
          if (!object) return null;

          const config = NodeVisualConfigProvider.getConfig(object);
          let html = '';

          if (object.properties?.nodeType === 'TRANSMISSION_LINK' || object.properties?.nodeType === 'PIPELINE') {
            html = `<strong>⚡ Línea de Impulsión / Conducción:</strong> ${object.properties.name || ''}`;
            if (object.properties.source && object.properties.destination) {
              html += `<div style="color:#f97316;font-size:12px;margin-top:2px">${object.properties.source} ➔ ${object.properties.destination}</div>`;
            }
            const details: string[] = [];
            if (object.properties.pipelineMaterial) details.push(`Mat: ${object.properties.pipelineMaterial}`);
            if (object.properties.pipelineDiameterMm) details.push(`Ø ${object.properties.pipelineDiameterMm} mm`);
            if (object.properties.distanceInMeters) details.push(`${Math.round(object.properties.distanceInMeters)} m`);
            if (details.length > 0) {
              html += `<div style="color:#94a3b8;font-size:11px;margin-top:2px">${details.join(' | ')}</div>`;
            }
          } else if (NodeClassifier.isPlant(object)) {
            html = `<strong>🏭 Planta de Tratamiento:</strong> ${object.properties?.name || 'Desconocido'}`;
            if (object.properties?.code) {
              html += `<div style="color:#94a3b8;font-size:11px;margin-top:2px">Código: ${object.properties.code}</div>`;
            }
          } else if (NodeClassifier.isTank(object)) {
            html = `<strong>🛢️ Tanque de Reserva:</strong> ${object.properties?.name || 'Desconocido'}`;
            if (object.properties?.code) {
              html += `<div style="color:#94a3b8;font-size:11px;margin-top:2px">Código: ${object.properties.code}</div>`;
            }
          } else if (NodeClassifier.isPump(object)) {
            html = `<strong>⚡ Estación de Bombeo:</strong> ${object.properties?.name || 'Desconocido'}`;
            if (object.properties?.code) {
              html += `<div style="color:#94a3b8;font-size:11px;margin-top:2px">Código: ${object.properties.code}</div>`;
            }
          } else if (object.properties?.cadastralKey) {
            html = `<strong>🏠 Acometida:</strong> ${object.properties.cadastralKey}`;
            if (object.properties.suppliedByTank) {
              html += `<div style="color:#94a3b8;font-size:11px;margin-top:2px">Abastecido por: ${object.properties.suppliedByTank}</div>`;
            }
          } else if (object.properties?.name) {
            html = `<strong>${config.tooltipCategory}:</strong> ${object.properties.name}`;
          } else {
            return null;
          }

          return {
            html,
            style: {
              backgroundColor: '#1e293b',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
              border: '1px solid #334155'
            }
          };
        }
      });
    }
  }, [layers, overlay]);

  return null;
};

export const ScadaMap: React.FC<ScadaMapProps> = ({
  geoJsonData,
  onNodeSelect,
  selectedNode,
  selectedTankFilter,
  onTankFilterChange,
  showFilterControl = true
}) => {
  const { theme } = useTheme();

  // Internal filter state for uncontrolled usage
  const [internalFilter, setInternalFilter] = useState<string | null>(null);
  const activeTankFilter = selectedTankFilter !== undefined ? selectedTankFilter : internalFilter;

  const handleFilterChange = (tank: string | null) => {
    if (onTankFilterChange) {
      onTankFilterChange(tank);
    }
    setInternalFilter(tank);
  };

  // Extraer todos los tanques y plantas disponibles con su conteo de acometidas
  const tankOptions = useMemo<TankOption[]>(() => {
    if (!geoJsonData?.features) return [];
    const tankRecord: Record<string, TankOption> = {};

    // Identificar tanques y plantas
    geoJsonData.features.forEach((f) => {
      if ((NodeClassifier.isTank(f) || NodeClassifier.isPlant(f)) && f.properties?.name) {
        if (!tankRecord[f.properties.name]) {
          tankRecord[f.properties.name] = { name: f.properties.name, count: 0 };
        }
      }
    });

    // Contar las acometidas abastecidas por cada instalación
    geoJsonData.features.forEach((f) => {
      const tankName = f.properties?.suppliedByTank;
      if (tankName) {
        if (tankRecord[tankName]) {
          tankRecord[tankName].count += 1;
        } else {
          tankRecord[tankName] = { name: tankName, count: 1 };
        }
      }
    });

    return Object.values(tankRecord).sort((a, b) => a.name.localeCompare(b.name));
  }, [geoJsonData]);

  // Features filtradas según el tanque/planta seleccionado
  const filteredFeatures = useMemo(() => {
    if (!geoJsonData?.features) return [];
    if (!activeTankFilter) return geoJsonData.features;

    return geoJsonData.features.filter((f) => {
      // 1. Plantas de tratamiento y estaciones de bombeo siempre visibles
      if (NodeClassifier.isPlant(f) || NodeClassifier.isPump(f)) return true;

      // 1.1 Tuberías de impulsión/conducción (Bombeo -> Planta)
      if (f.properties?.nodeType === 'TRANSMISSION_LINK' || f.properties?.nodeType === 'PIPELINE') {
        return (
          f.properties?.source === activeTankFilter ||
          f.properties?.destination === activeTankFilter
        );
      }

      // 2. Tanques: conservar el seleccionado
      if (NodeClassifier.isTank(f)) {
        return f.properties?.name === activeTankFilter;
      }

      // 3. Acometidas abastecidas por este tanque o planta
      if (f.properties?.nodeType === 'CONNECTION') {
        return f.properties?.suppliedByTank === activeTankFilter;
      }

      // 4. Enlaces virtuales correspondientes a este tanque o planta
      if (f.properties?.nodeType === 'VIRTUAL_LINK') {
        return f.properties?.source === activeTankFilter;
      }

      return false;
    });
  }, [geoJsonData, activeTankFilter]);

  // Estadísticas del filtro activo
  const stats = useMemo(() => {
    let connectionsCount = 0;
    let plantsCount = 0;
    let tanksCount = 0;

    filteredFeatures.forEach((f) => {
      if (NodeClassifier.isPlant(f)) plantsCount++;
      else if (NodeClassifier.isTank(f)) tanksCount++;
      else if (f.properties?.nodeType === 'CONNECTION') connectionsCount++;
    });

    const totalConnections = geoJsonData?.features.filter(
      (f) => f.properties?.nodeType === 'CONNECTION'
    ).length || 0;

    return {
      connectionsCount,
      plantsCount,
      tanksCount,
      totalConnections
    };
  }, [filteredFeatures, geoJsonData]);

  // Encontrar la instalación abastecedora si la selección es una acometida
  const selectedTankFeature = useMemo(() => {
    if (!selectedNode || !geoJsonData) return null;
    if (selectedNode.properties?.nodeType === 'CONNECTION' && selectedNode.properties?.suppliedByTank) {
      return (
        geoJsonData.features.find(
          (f) =>
            (NodeClassifier.isTank(f) || NodeClassifier.isPlant(f)) &&
            f.properties?.name === selectedNode.properties?.suppliedByTank
        ) || null
      );
    }
    return null;
  }, [selectedNode, geoJsonData]);

  const layers: LayersList = useMemo(() => {
    if (!geoJsonData || filteredFeatures.length === 0) return [];

    const nodesData = filteredFeatures.filter((f) => f.geometry.type === 'Point');

    // Separar los virtual links (líneas rectas) para dibujarlos como arcos
    const virtualLinksData = filteredFeatures.filter(
      (f) => f.properties?.nodeType === 'VIRTUAL_LINK' && f.geometry.type === 'LineString'
    );

    // Filtrar los datos para el layer normal (excluyendo los virtual links que ahora son arcos)
    const standardGeoJsonFeatures = filteredFeatures.filter(
      (f) => !(f.properties?.nodeType === 'VIRTUAL_LINK' && f.geometry.type === 'LineString')
    );

    return [
      // 0. ArcLayer para conexiones (VIRTUAL_LINK)
      new ArcLayer<GeoJsonFeature>({
        id: 'scada-arc-layer',
        data: virtualLinksData,
        pickable: true,
        getSourcePosition: (d: GeoJsonFeature): [number, number] => {
          if (d.geometry.type === 'LineString' && d.geometry.coordinates.length > 0) {
            const coord = d.geometry.coordinates[0];
            return [coord[0], coord[1]];
          }
          return [0, 0];
        },
        getTargetPosition: (d: GeoJsonFeature): [number, number] => {
          if (d.geometry.type === 'LineString' && d.geometry.coordinates.length > 0) {
            const coord = d.geometry.coordinates[d.geometry.coordinates.length - 1];
            return [coord[0], coord[1]];
          }
          return [0, 0];
        },
        getSourceColor: [14, 165, 233, 200],
        getTargetColor: [139, 92, 246, 255],
        getWidth: 3,
        getHeight: 0.15,
        getTilt: 15
      }),

      // 1. Line/Polygon/Node Layer (Configurado con NodeVisualConfigProvider - OCP)
      new GeoJsonLayer<GeoJsonFeatureProperties>({
        id: 'scada-network-layer',
        data: standardGeoJsonFeatures,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        lineWidthUnits: 'pixels',
        pointRadiusMinPixels: 4,
        pointRadiusUnits: 'pixels',
        getFillColor: (f: GeoJsonFeature) => NodeVisualConfigProvider.getConfig(f).fillColor,
        getLineColor: (f: GeoJsonFeature) => NodeVisualConfigProvider.getConfig(f).lineColor,
        getPointRadius: (f: GeoJsonFeature) => NodeVisualConfigProvider.getConfig(f).radius,
        getLineWidth: (f: GeoJsonFeature) => NodeVisualConfigProvider.getConfig(f).lineWidth,
        onClick: (info: PickingInfo) => {
          const object = info.object as GeoJsonFeature | undefined;
          if (object && onNodeSelect) {
            onNodeSelect(object);
          } else if (onNodeSelect) {
            onNodeSelect(null);
          }
        }
      }),

      // 2. Text Layer for Labels
      new TextLayer<GeoJsonFeature>({
        id: 'scada-text-layer',
        data: nodesData,
        pickable: false,
        getPosition: (d: GeoJsonFeature): [number, number] => {
          if (d.geometry.type === 'Point' && d.geometry.coordinates.length >= 2) {
            return [d.geometry.coordinates[0], d.geometry.coordinates[1]];
          }
          return [0, 0];
        },
        getText: (d: GeoJsonFeature): string => {
          const name = d.properties?.name || '';
          const config = NodeVisualConfigProvider.getConfig(d);
          if (config.labelPrefix) {
            return `${config.labelPrefix} ${name}`;
          }
          return name;
        },
        getSize: 15,
        getColor: theme === 'dark' ? [241, 245, 249, 255] : [30, 41, 59, 255],
        getAngle: 0,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        getPixelOffset: [16, 0],
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold'
      })
    ];
  }, [geoJsonData, filteredFeatures, onNodeSelect, theme]);

  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Map
        mapId={mapId}
        style={{ width: '100%', height: '100%' }}
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={FALLBACK_CENTER_ANTONIO_ANTE}
        defaultZoom={11.5}
        gestureHandling="greedy"
        disableDefaultUI={false}
        rotateControl={false}
        mapTypeControl={true}
        mapTypeControlOptions={{
          position: ControlPosition.BOTTOM_RIGHT
        }}
        streetViewControl={true}
        streetViewControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        zoomControl={true}
        zoomControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
        fullscreenControl={true}
        fullscreenControlOptions={{
          position: ControlPosition.RIGHT_BOTTOM
        }}
      >
        {/* Controlador inteligente de centrado y zoom proporcional a la red del tanque */}
        <MapCameraController
          selectedTankFilter={activeTankFilter}
          features={geoJsonData?.features || []}
          selectedNode={selectedNode}
        />

        <DeckGlOverlay layers={layers} />

        {/* Marcador animado para el nodo seleccionado */}
        {selectedNode?.geometry?.type === 'Point' && (
          <AdvancedMarker
            position={{
              lat: selectedNode.geometry.coordinates[1],
              lng: selectedNode.geometry.coordinates[0]
            }}
            zIndex={100}
          >
            <div className="marker-centering-wrapper">
              <div
                className={`heartbeat-marker ${
                  NodeClassifier.isPlant(selectedNode)
                    ? 'plant-selected'
                    : NodeClassifier.isTank(selectedNode)
                    ? 'tank-selected'
                    : 'node-selected'
                }`}
              />
            </div>
          </AdvancedMarker>
        )}

        {/* Marcador animado para el tanque abastecedor */}
        {selectedTankFeature?.geometry?.type === 'Point' && (
          <AdvancedMarker
            position={{
              lat: selectedTankFeature.geometry.coordinates[1],
              lng: selectedTankFeature.geometry.coordinates[0]
            }}
            zIndex={100}
          >
            <div className="marker-centering-wrapper">
              <div className="heartbeat-marker tank-selected" />
            </div>
          </AdvancedMarker>
        )}
      </Map>

      {/* Floating Tank Filter Control (Single Responsibility Component) */}
      {showFilterControl && (
        <ScadaMapFilter
          tankOptions={tankOptions}
          activeTankFilter={activeTankFilter}
          totalConnectionsCount={stats.totalConnections}
          visibleConnectionsCount={stats.connectionsCount}
          plantsCount={stats.plantsCount}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onFilterChange={handleFilterChange}
        />
      )}

      <style>{`
        @keyframes map-heartbeat {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7);
          }
          70% {
            transform: scale(1.3);
            box-shadow: 0 0 0 15px rgba(14, 165, 233, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
          }
        }
        
        @keyframes map-heartbeat-tank {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          70% {
            transform: scale(1.3);
            box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }

        @keyframes map-heartbeat-plant {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1.3);
            box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .marker-centering-wrapper {
          transform: translateY(50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .heartbeat-marker {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid white;
          pointer-events: none;
        }

        .heartbeat-marker.node-selected {
          background-color: #0ea5e9; /* Sky 500 */
          animation: map-heartbeat 1.5s ease-out infinite;
        }

        .heartbeat-marker.tank-selected {
          background-color: #8b5cf6; /* Violet 500 */
          animation: map-heartbeat-tank 1.5s ease-out infinite;
          width: 30px;
          height: 30px;
        }

        .heartbeat-marker.plant-selected {
          background-color: #10b981; /* Emerald 500 */
          animation: map-heartbeat-plant 1.5s ease-out infinite;
          width: 32px;
          height: 32px;
        }

        .scada-floating-filter {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 10;
          min-width: 280px;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          font-family: 'Inter', sans-serif;
        }

        .scada-floating-filter.dark {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(51, 65, 85, 0.85);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .filter-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #1e293b;
        }

        .scada-floating-filter.dark .filter-title {
          color: #f1f5f9;
        }

        .filter-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: background 0.15s ease;
        }

        .filter-clear-btn:hover {
          background: rgba(239, 68, 68, 0.12);
        }

        .filter-select {
          width: 100%;
          padding: 7px 10px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .scada-floating-filter.dark .filter-select {
          background: #1e293b;
          border-color: #334155;
          color: #f8fafc;
        }

        .filter-select:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
        }

        .filter-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .filter-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .plant-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .scada-floating-filter.dark .plant-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .connection-badge {
          background: rgba(14, 165, 233, 0.12);
          color: #0284c7;
        }

        .scada-floating-filter.dark .connection-badge {
          background: rgba(14, 165, 233, 0.2);
          color: #38bdf8;
        }

        /* ==========================================================================
           Google Maps Controls: Alineación óptima en la parte inferior derecha
           y apertura hacia arriba (Dropup) del submenú de Map / Satellite
           ========================================================================== */

        /* Separación de la barra de tipos de mapa respecto al borde inferior */
        .gm-style .gm-style-mtc {
          margin-bottom: 22px !important;
          margin-right: 10px !important;
          position: relative !important;
          overflow: visible !important;
        }

        /* Fuerza a que el submenú de 'Relieve' (bajo Map) y 'Etiquetas' (bajo Satellite)
           se abra HACIA ARRIBA en lugar de hacia abajo (evitando que se corte en el borde) */
        .gm-style .gm-style-mtc > div:not(:first-child),
        .gm-style .gm-style-mtc > div[style*="top"] {
          top: auto !important;
          bottom: 100% !important;
          margin-bottom: 6px !important;
          box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.35) !important;
          border-radius: 6px !important;
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
};
