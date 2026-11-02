export interface ReadingRoute {
  idRuta: number;
  sectorId: number;
  zonaId?: number | null;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  cantidadAcometidas: number;
  tiempoEstimadoHoras: number;
  colorIdentificador?: string;
  poligono?: Record<string, unknown> | null;
  esRural?: boolean;
  activa?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Aliases for seamless interoperability
  codigoRuta?: string;
  nombreRuta?: string;
  sector?: number;
  activo?: boolean;
}

export interface RouteFeatureProperties {
  idRuta: number;
  codigo: string;
  nombre: string;
  sectorId: number;
  cantidadAcometidas: number;
  tiempoEstimadoHoras: number;
  esRural: boolean;
  activa: boolean;
  stroke: string;
  fill: string;
  'fill-opacity': number;
  'stroke-width': number;
}

export interface RouteGeoJsonFeature {
  type: 'Feature';
  id?: number;
  geometry: {
    type: 'MultiPolygon' | 'Polygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: RouteFeatureProperties;
}

export interface RouteGeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: RouteGeoJsonFeature[];
}

export interface CentroidFeatureProperties {
  numero: number;
  idRuta: number;
  codigo: string;
  codigoRuta?: string;
  nombre: string;
  nombreRuta?: string;
  sectorId: number;
  sector?: number;
  acometidas: number;
  latitud: number;
  longitud: number;
  title: string;
  'marker-color': string;
  'marker-size': string;
}

export interface RouteCentroidFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: CentroidFeatureProperties;
}

export interface RouteCentroidFeatureCollection {
  type: 'FeatureCollection';
  features: RouteCentroidFeature[];
}
