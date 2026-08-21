import React, { useState } from 'react';

import { AuditMapSidePanel } from './AuditMapSidePanel';
import { AuditGeojsonMap } from './AuditGeojsonMap';
import type { MapRouteFeatureCollection, MapFeature } from '../../../domain/models/map-geojson';
import './AuditMapSidePanel.css';

interface AuditMapFeatureProps {
  geojsonData: MapRouteFeatureCollection | null;
}

export const AuditMapFeature: React.FC<AuditMapFeatureProps> = ({ geojsonData }) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);



  const handleSelectFeature = (feature: MapFeature | null) => {
    if (!feature) {
      setSelectedFeatureId(null);
    } else {
      setSelectedFeatureId((feature as any).id);
    }
  };

  return (
    <div className="audit-map-feature-container">
      <AuditMapSidePanel
        geojsonData={geojsonData}
        selectedFeatureId={selectedFeatureId}
        onSelectFeature={handleSelectFeature}
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((c) => !c)}
      />
      
      <div className="audit-map-view-wrapper">
        <AuditGeojsonMap
          geojsonData={geojsonData}
          selectedFeatureId={selectedFeatureId}
          onFeatureSelect={handleSelectFeature}
        />
      </div>
    </div>
  );
};
