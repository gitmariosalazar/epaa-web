import React, { useEffect, useMemo } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import type { MapGeojsonResponse } from '../../../domain/models/GeoJsonFeature';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

interface ScadaMapProps {
  geoJsonData: MapGeojsonResponse | null;
  onNodeSelect?: (node: any) => void;
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
      overlay.setProps({ layers });
    }
  }, [layers, overlay]);

  return null;
};

export const ScadaMap: React.FC<ScadaMapProps> = ({ geoJsonData, onNodeSelect }) => {
  const { theme } = useTheme();

  const layers = useMemo(() => {
    if (!geoJsonData) return [];

    const nodesData = geoJsonData.features.filter(f => f.geometry.type === 'Point');

    return [
      // 1. Line/Polygon Layer
      new GeoJsonLayer({
        id: 'scada-network-layer',
        data: geoJsonData as any,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 1,
        lineWidthMinPixels: 3,
        pointRadiusMinPixels: 8, // Ensure markers are always visible
        getFillColor: (f: any) => {
          if (f.properties?.nodeType === 'TANK') return [100, 116, 139, 255]; // Gray base for tank
          return [56, 189, 248, 255];
        },
        getLineColor: (f: any) => {
          // Topology distinct colors based on type or name
          const colorName = f.properties?.colorMarker?.toLowerCase() || '';
          if (colorName.includes('green') || colorName === '#00ff00') return [34, 197, 94, 255];
          if (colorName.includes('red') || colorName === '#ff0000') return [239, 68, 68, 255];
          if (colorName.includes('blue') || colorName === '#0000ff') return [59, 130, 246, 255];
          if (f.properties?.nodeType === 'VIRTUAL_LINK') return [168, 85, 247, 255]; // Purple links
          return [71, 85, 105, 255]; // Dark slate borders
        },
        getPointRadius: (f: any) => (f.properties?.nodeType === 'TANK' ? 45 : 12),
        getLineWidth: (f: any) => (f.properties?.nodeType === 'VIRTUAL_LINK' ? 4 : 2),
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={FALLBACK_CENTER_ANTONIO_ANTE}
        defaultZoom={11.5}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
      >
        <DeckGlOverlay layers={layers} />
      </Map>
    </div>
  );
};
