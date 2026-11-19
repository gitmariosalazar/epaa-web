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

export interface GeoJSONFeatureGatewayResponse {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: GeoJSONFeatureProperties;
}

export interface StateEventsGeoJSONGatewayResponse {
  type: 'FeatureCollection';
  totalFeatures: number;
  features: GeoJSONFeatureGatewayResponse[];
}
