export interface GeoJSONFeatureProperties {
  historialId: number;
  connectionId: string;
  sector: number | null;
  stateId: number;
  stateName: string;
  effectiveDate: string;
  reason: string | null;
  supportDocument: string | null;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: GeoJSONFeatureProperties;
}

export interface StateEventsGeoJSON {
  type: 'FeatureCollection';
  totalFeatures: number;
  features: GeoJSONFeature[];
}
