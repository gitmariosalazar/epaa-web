import React, { useRef, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ReadingMap } from './ReadingMap';
import { ReadingMapSidePanel } from './ReadingMapSidePanel';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import './ReadingMapSidePanel.css';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface ReadingMapFeatureProps {
  /**
   * Lista de lecturas a mostrar en el mapa y panel lateral.
   * NOTA: Por el momento se utiliza la primera lectura con coordenadas de captura
   * como lectura activa. Cuando se integre la vista global de lecturas, este prop
   * se conectará con el ViewModel correspondiente.
   */
  readings: TakenReadingConnection[];
  /** Lectura seleccionada inicialmente (opcional) */
  initialReading?: TakenReadingConnection | null;
  /** Callback al ver el detalle de una lectura */
  onViewDetail?: (reading: TakenReadingConnection) => void;
}

/**
 * ReadingMapFeature — Composition root para la vista de mapa de lecturas.
 *
 * SRP: solo gestiona el layout y orquesta los sub-componentes.
 * DIP: depende de la interfaz TakenReadingConnection, no de implementaciones concretas.
 * OCP: nuevas secciones del sidebar o controles del mapa se agregan via props.
 *
 * Equivalente a IncidentMapFeature del módulo incidents.
 */
export const ReadingMapFeature: React.FC<ReadingMapFeatureProps> = ({
  readings,
  initialReading,
  onViewDetail
}) => {
  const [selectedReading, setSelectedReading] = useState<TakenReadingConnection | null>(
    initialReading ?? readings.find((r) => r.locationCapture) ?? null
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const latestCameraRef = useRef<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: {
      lat: Number(FALLBACK_CENTER_ANTONIO_ANTE.lat),
      lng: Number(FALLBACK_CENTER_ANTONIO_ANTE.lng)
    },
    zoom: 16
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const activeReading = selectedReading;

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      <div className="reading-map-feature-container">
        {/* ── Side Panel ─────────────────────────────────────────────────── */}
        <ReadingMapSidePanel
          readings={readings}
          selectedReading={selectedReading}
          onSelect={(reading) => setSelectedReading(reading)}
          onViewDetail={onViewDetail}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((c) => !c)}
        />

        {/* ── Map ────────────────────────────────────────────────────────── */}
        <div className="reading-map-view-wrapper">
          <ReadingMap
            reading={activeReading}
            locationCapture={activeReading?.locationCapture}
            locationConnection={activeReading?.locationConnection}
            distanceMeters={activeReading?.distanceMeters}
            isInsideAllowedRadius={activeReading?.isInsideAllowedRadius}
            distanceLineGeoJSON={activeReading?.distanceLineGeoJSON}
            mapId={mapId}
            onViewDetail={onViewDetail}
            onCameraChange={(center, zoom) => {
              latestCameraRef.current = {
                center: {
                  lat: Number(center.lat),
                  lng: Number(center.lng)
                },
                zoom
              };
            }}
          />
        </div>
      </div>
    </APIProvider>
  );
};
