export type GeoJsonCoordinates = number[] | number[][] | number[][][];

export interface GeoJsonGeometry {
  type:
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon';
  coordinates: GeoJsonCoordinates;
}

export interface GeoJsonFeatureProperties {
  nodeType: 'TANK' | 'CONNECTION' | 'VIRTUAL_LINK';
  name?: string;
  code?: string;
  colorMarker?: string;
  connectionId?: string;
  cadastralKey?: string;
  suppliedByTank?: string;
  source?: string;
  destination?: string;
  distanceInMeters?: number;
}

export interface GeoJsonFeature {
  type: 'Feature';
  id?: string;
  geometry: GeoJsonGeometry;
  properties: GeoJsonFeatureProperties;
}

export interface MapGeojsonResponse {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}
