export type GeoJsonCoordinates = number[] | number[][] | number[][][];

export type GeoJsonGeometry =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'LineString'; coordinates: number[][] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPoint'; coordinates: number[][] }
  | { type: 'MultiLineString'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };

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
