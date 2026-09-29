import React, { useEffect, useMemo } from 'react';
import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer, TextLayer, ArcLayer } from '@deck.gl/layers';
import type { MapGeojsonResponse } from '../../../domain/models/GeoJsonFeature';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

interface ScadaMapProps {
  geoJsonData: MapGeojsonResponse | null;
  onNodeSelect?: (node: any) => void;
  selectedNode?: any;
}

// Normal Google Maps Style is used by default

const DeckGlOverlay: React.FC<{ layers: any[] }> = ({ layers }) => {
  const map = useMap();
  const [overlay, setOverlay] = React.useState<any>(null);

  useEffect(() => {
    if (!map) return;

    const instance = new GoogleMapsOverlay({ interleaved: false });

    // Workaround for deck.gl bug where it crashes on resize/draw if projection is null
    const originalDrawRaster = (instance as any)._onDrawRaster.bind(instance);
    (instance as any)._onDrawRaster = () => {
      const overlayView = (instance as any)._overlay;
      if (overlayView && !overlayView.getProjection()) {
        return;
      }
      originalDrawRaster();
    };

    instance.setMap(map);
    setOverlay(instance);

    return () => {
      instance.setMap(null);
      instance.finalize();
    };
  }, [map]);

  useEffect(() => {
    if (overlay) {
      overlay.setProps({
        layers,
        getTooltip: ({ object }: any) => {
          if (!object) return null;

          let html = '';
          if (object.properties?.nodeType === 'TANK') {
            html = `<strong>Tanque:</strong> ${object.properties?.name || 'Desconocido'}`;
          } else if (object.properties?.cadastralKey) {
            html = `<strong>Clave Catastral:</strong> ${object.properties.cadastralKey}`;
          } else if (object.properties?.name) {
            html = `<strong>Nodo:</strong> ${object.properties.name}`;
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

export const ScadaMap: React.FC<ScadaMapProps> = ({ geoJsonData, onNodeSelect, selectedNode }) => {
  const { theme } = useTheme();

  // Encontrar el tanque abastecedor si la selección es una acometida
  const selectedTankFeature = useMemo(() => {
    if (!selectedNode || !geoJsonData) return null;
    if (selectedNode.properties?.nodeType === 'CONNECTION' && selectedNode.properties?.suppliedByTank) {
      return geoJsonData.features.find((f: any) =>
        f.properties?.nodeType === 'TANK' &&
        f.properties?.name === selectedNode.properties.suppliedByTank
      );
    }
    return null;
  }, [selectedNode, geoJsonData]);

  const layers = useMemo(() => {
    if (!geoJsonData) return [];

    const nodesData = geoJsonData.features.filter(f => f.geometry.type === 'Point');

    // Separar los virtual links (líneas rectas) para dibujarlos como arcos
    const virtualLinksData = geoJsonData.features.filter(
      f => f.properties?.nodeType === 'VIRTUAL_LINK' && f.geometry.type === 'LineString'
    );

    // Filtrar los datos para el layer normal (excluyendo los virtual links que ahora son arcos)
    const standardGeoJsonFeatures = geoJsonData.features.filter(
      f => !(f.properties?.nodeType === 'VIRTUAL_LINK' && f.geometry.type === 'LineString')
    );

    return [
      // 0. ArcLayer para conexiones (VIRTUAL_LINK)
      new ArcLayer({
        id: 'scada-arc-layer',
        data: virtualLinksData,
        pickable: true,
        getSourcePosition: (d: any) => d.geometry.coordinates[0],
        getTargetPosition: (d: any) => d.geometry.coordinates[d.geometry.coordinates.length - 1],
        // Gradiente desde el color del nodo (Celeste) hasta el tanque (Morado)
        getSourceColor: [14, 165, 233, 200],
        getTargetColor: [139, 92, 246, 255],
        getWidth: 3,
        getHeight: 0.15, // Añade una curvatura elegante
        getTilt: 15,
      }),

      // 1. Line/Polygon/Node Layer
      new GeoJsonLayer({
        id: 'scada-network-layer',
        data: { ...geoJsonData, features: standardGeoJsonFeatures } as any,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        lineWidthUnits: 'pixels', // Asegura que los bordes de puntos y grosores de líneas sean en píxeles
        pointRadiusMinPixels: 4, 
        pointRadiusUnits: 'pixels', // Asegura que el radio sea en píxeles y no metros
        getFillColor: (f: any) => {
          if (f.properties?.nodeType === 'TANK') return [71, 85, 105, 255]; // Slate-600
          if (f.properties?.nodeType === 'SOURCE') return [16, 185, 129, 255]; // Emerald
          return [14, 165, 233, 230]; // Sky-500 slightly transparent
        },
        getLineColor: (f: any) => {
          // Lines and polygon borders
          if (f.geometry.type !== 'Point') {
            const colorName = f.properties?.colorMarker?.toLowerCase() || '';
            if (colorName.includes('green') || colorName === '#00ff00') return [34, 197, 94, 255];
            if (colorName.includes('red') || colorName === '#ff0000') return [239, 68, 68, 255];
            if (colorName.includes('blue') || colorName === '#0000ff') return [59, 130, 246, 255];
            if (f.properties?.nodeType === 'VIRTUAL_LINK') return [168, 85, 247, 255]; // Purple links
            return [71, 85, 105, 255];
          }
          // Point borders - professional white ring
          return [255, 255, 255, 255];
        },
        getPointRadius: (f: any) => (f.properties?.nodeType === 'TANK' ? 18 : 7),
        getLineWidth: (f: any) => {
          if (f.geometry.type === 'Point') return 2; // White border width for points
          return f.properties?.nodeType === 'VIRTUAL_LINK' ? 4 : 2;
        },
        onClick: (info: any) => {
          if (info.object && onNodeSelect) {
            onNodeSelect(info.object);
          } else if (onNodeSelect) {
            onNodeSelect(null);
          }
        },
      }),
      // 2. Text Layer for Labels
      new TextLayer({
        id: 'scada-text-layer',
        data: nodesData,
        pickable: false,
        getPosition: (d: any) => d.geometry.coordinates,
        getText: (d: any) => {
          if (d.properties?.nodeType === 'TANK') return `🛢️ ${d.properties?.name || ''}`;
          if (d.properties?.nodeType === 'SOURCE') return `⛰️ ${d.properties?.name || ''}`;
          return d.properties?.name || '';
        },
        getSize: 16,
        getColor: [30, 41, 59, 255],
        getAngle: 0,
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        getPixelOffset: [15, 0],
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold'
      })
    ];
  }, [geoJsonData, onNodeSelect]);

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
        mapTypeControl={true}
      >
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
              <div className="heartbeat-marker node-selected" />
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

        .marker-centering-wrapper {
          /* AdvancedMarker ancla en el centro-inferior por defecto.
             Desplazarlo 50% hacia abajo alinea perfectamente el centro del marcador con la coordenada */
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
      `}</style>
    </div>
  );
};
