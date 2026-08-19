import React, { useEffect } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type { MapRouteFeatureCollection } from '../../../domain/models/map-geojson';

interface AuditGeojsonMapProps {
  geojsonData: MapRouteFeatureCollection | null;
  mapId?: string;
}

export const AuditGeojsonMap: React.FC<AuditGeojsonMapProps> = ({
  geojsonData,
  mapId = 'audit-geojson-map'
}) => {
  const { theme } = useTheme();
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // 1. Limpiar características anteriores
    map.data.forEach((feature: google.maps.Data.Feature) => {
      map.data.remove(feature);
    });

    // 2. Si no hay data, no hacemos nada más
    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
      return;
    }

    try {
      // 3. Agregar nuevo GeoJSON
      map.data.addGeoJson(geojsonData);

      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();

      // 4. Estilizar las capas con los atributos que devuelve la Base de Datos
      map.data.setStyle((feature: google.maps.Data.Feature) => {
        const type = feature.getProperty('tipo') as string;
        const stroke = feature.getProperty('stroke') as string;
        const strokeWidth = feature.getProperty('stroke-width') as number;
        const markerColor = feature.getProperty('marker-color') as string;

        if (feature.getGeometry()?.getType() === 'Point') {
          // Diferenciar inicio/fin con un tamaño mayor
          const isEndpoint = type === 'punto_inicio' || type === 'punto_final';
          return {
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              fillColor: markerColor || (type === 'medidor' ? '#10b981' : '#3b82f6'),
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: isEndpoint ? 8 : 6
            },
            title: (feature.getProperty('clave_catastral') as string),
            infoWindowContent: (feature.getProperty('novedad') as string),
          };
        } else if (feature.getGeometry()?.getType() === 'LineString') {
          return {
            strokeColor: stroke || '#ef4444',
            strokeWeight: strokeWidth || 3,
            strokeOpacity: 0.8
          };
        }
        return {};
      });

      // 5. Centrar el mapa encuadrando todos los puntos y líneas
      map.data.forEach((feature: google.maps.Data.Feature) => {
        const geom = feature.getGeometry();
        if (geom?.getType() === 'Point') {
          const pointGeom = geom as google.maps.Data.Point;
          bounds.extend(pointGeom.get());
        } else if (geom?.getType() === 'LineString') {
          const lineGeom = geom as google.maps.Data.LineString;
          lineGeom.getArray().forEach((latLng: google.maps.LatLng) => bounds.extend(latLng));
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
      }
    } catch (error) {
      console.error('Failed to add GeoJSON to map', error);
    }
  }, [map, geojsonData]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={FALLBACK_CENTER_ANTONIO_ANTE}
        defaultZoom={15}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', flexGrow: 1, borderRadius: '8px', overflow: 'hidden' }}
      />
    </div>
  );
};
