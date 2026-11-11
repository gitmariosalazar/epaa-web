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
  | 'VIRTUAL_LINK'
  | 'TRANSMISSION_LINK'
  | 'PIPELINE';

export interface GeoJsonFeatureProperties {
  nodeType: ScadaNodeType | (string & {});
  name?: string;
  code?: string;
  facilityType?: string;
  colorMarker?: string;
  connectionId?: string;
  cadastralKey?: string;
  suppliedByTank?: string;
  supplierType?: string;
  source?: string;
  sourceCode?: string;
  sourceType?: string;
  destination?: string;
  destinationCode?: string;
  destinationType?: string;
  pipelineMaterial?: string;
  pipelineDiameterMm?: number;
  distanceInMeters?: number;
}

export type GeoJsonGeometry = Geometry;

export type GeoJsonFeature = Feature<Geometry, GeoJsonFeatureProperties>;

export type MapGeojsonResponse = FeatureCollection<Geometry, GeoJsonFeatureProperties>;
