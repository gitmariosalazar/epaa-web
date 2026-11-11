import type { Feature, FeatureCollection, Geometry } from 'geojson';

export type GeoJsonCoordinates = number[] | number[][] | number[][][];

export type ScadaNodeType =
  | 'TANK'
  | 'TANQUE'
  | 'PLANT'
  | 'PLANTA'
  | 'PUMP'
  | 'BOMBEO'
  | 'SOURCE'
  | 'CAPTACION'
  | 'CONNECTION'
  | 'VIRTUAL_LINK';

export interface GeoJsonFeatureProperties {
  nodeType: ScadaNodeType | (string & {});
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

export type GeoJsonGeometry = Geometry;

export type GeoJsonFeature = Feature<Geometry, GeoJsonFeatureProperties>;

export type MapGeojsonResponse = FeatureCollection<Geometry, GeoJsonFeatureProperties>;
