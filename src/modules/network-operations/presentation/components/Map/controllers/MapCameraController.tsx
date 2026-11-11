import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { GeoJsonFeature } from '../../../../domain/models/GeoJsonFeature';
import { NodeClassifier } from '../../../../domain/services/NodeClassifier';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

interface MapCameraControllerProps {
  selectedTankFilter: string | null;
  features: GeoJsonFeature[];
  selectedNode?: GeoJsonFeature | null;
}

/**
 * Controller responsible for calculating and animating the optimal Google Maps viewport
 * (centering and bounds-fitting with intelligent padding) whenever a tank filter is applied
 * or when an individual node/connection is selected.
 */
export const MapCameraController: React.FC<MapCameraControllerProps> = ({
  selectedTankFilter,
  features,
  selectedNode
}) => {
  const map = useMap();
  const prevFilterRef = useRef<string | null>(null);
  const prevSelectedNodeRef = useRef<string | number | undefined>(undefined);

  // 1. Manejo de centrado proporcional por sector/tanque
  useEffect(() => {
    if (!map) return;

    // Detect if filter actually changed
    const isFirstRun = prevFilterRef.current === null;
    prevFilterRef.current = selectedTankFilter;

    if (!selectedTankFilter) {
      // Filter cleared -> smooth pan back to municipal overview
      if (!isFirstRun) {
        map.panTo(FALLBACK_CENTER_ANTONIO_ANTE);
        map.setZoom(11.5);
      }
      return;
    }

    // Filter active: Collect all points belonging to this tank and its supplied connections
    const targetPoints: google.maps.LatLngLiteral[] = [];

    features.forEach((f) => {
      if (f.geometry?.type !== 'Point' || !f.geometry.coordinates || f.geometry.coordinates.length < 2) {
        return;
      }

      const [lng, lat] = f.geometry.coordinates;

      // The tank itself
      if (NodeClassifier.isTank(f) && f.properties?.name === selectedTankFilter) {
        targetPoints.push({ lat, lng });
      }

      // Connections supplied by this tank
      if (f.properties?.nodeType === 'CONNECTION' && f.properties?.suppliedByTank === selectedTankFilter) {
        targetPoints.push({ lat, lng });
      }
    });

    if (targetPoints.length === 0) return;

    if (targetPoints.length === 1) {
      // Only the tank point exists
      map.panTo(targetPoints[0]);
      map.setZoom(15.5);
    } else {
      // Multiple points: Calculate bounding box encompassing the tank and all its supplied houses
      const bounds = new google.maps.LatLngBounds();
      targetPoints.forEach((pt) => bounds.extend(pt));

      // Intelligently pad viewport so nodes aren't hidden behind the right sidebar (320px) or floating filter
      const padding: google.maps.Padding = {
        top: 80,
        right: 360, // Clear the 320px sidebar on the right
        bottom: 90,
        left: 90    // Clear the floating filter on the left
      };

      map.fitBounds(bounds, padding);

      // Prevent over-zooming on ultra-dense clusters
      const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
        const currentZoom = map.getZoom();
        if (currentZoom !== undefined && currentZoom > 16.5) {
          map.setZoom(16.5);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, selectedTankFilter, features]);

  // 2. Manejo de foco cuando se selecciona una acometida específica (ej. desde el modal)
  useEffect(() => {
    if (!map || !selectedNode) return;
    const nodeId = selectedNode.id || selectedNode.properties?.cadastralKey;
    if (nodeId && nodeId === prevSelectedNodeRef.current) return;
    prevSelectedNodeRef.current = nodeId;

    if (
      selectedNode.properties?.nodeType === 'CONNECTION' &&
      selectedNode.geometry?.type === 'Point' &&
      selectedNode.geometry.coordinates.length >= 2
    ) {
      const [lng, lat] = selectedNode.geometry.coordinates;
      map.panTo({ lat, lng });
      const currentZoom = map.getZoom() || 0;
      if (currentZoom < 16.5) {
        map.setZoom(17);
      }
    }
  }, [map, selectedNode]);

  return null;
};
