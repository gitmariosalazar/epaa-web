export interface ReadingRoute {
  idRuta: number;
  sectorId: number;
  zonaId?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  cantidadAcometidas: number;
  tiempoEstimadoHoras: number;
  distanciaEstimadaKm?: number;
  colorIdentificador: string;
  poligono?: string | any;
  esRural: boolean;
  activa: boolean;
  idAsignacion?: number;
  estado?: string;
  periodo?: string;
  idUsuarioAsignado?: string;
  nombreUsuario?: string;
  usuario?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  lecturasEsperadas?: number;
  lecturasCompletadas?: number;
  lecturasPendientes?: number;
  observacionSupervisor?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Aliases for presentation and mapping compatibility
  codigoRuta?: string;
  nombreRuta?: string;
  sector?: number;
  activo?: boolean;
}

export interface RouteFeatureProperties {
  idRuta: number;
  codigo: string;
  codigoRuta?: string;
  nombre: string;
  nombreRuta?: string;
  descripcion?: string;
  sectorId: number;
  sector?: number;
  zonaId?: number;
  cantidadAcometidas: number;
  tiempoEstimadoHoras: number;
  esRural: boolean;
  activa: boolean;
  colorBase?: string;
  estaAsignada?: boolean;
  idAsignacion?: number | null;
  estado?: string;
  periodo?: string;
  fechaProgramada?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idUsuarioAsignado?: string;
  usuario?: string;
  nombreUsuario?: string;
  observacionSupervisor?: string;
  lecturasEsperadas?: number;
  lecturasCompletadas?: number;
  lecturasPendientes?: number;
  lecturasNovedad?: number;
  porcentajeAvance?: number;
  color?: string;
  stroke: string;
  strokeColor?: string;
  fill: string;
  fillColor?: string;
  'fill-opacity': number;
  fillOpacity?: number;
  'stroke-width': number;
  strokeWeight?: number;
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
  cantidadAcometidas?: number;
  latitud: number;
  longitud: number;
  title: string;
  activa?: boolean;
  colorBase?: string;
  estaAsignada?: boolean;
  idAsignacion?: number | null;
  estado?: string;
  periodo?: string;
  fechaProgramada?: string;
  fechaInicio?: string;
  fechaFin?: string;
  idUsuarioAsignado?: string;
  usuario?: string;
  nombreUsuario?: string;
  lecturasEsperadas?: number;
  lecturasCompletadas?: number;
  lecturasPendientes?: number;
  lecturasNovedad?: number;
  porcentajeAvance?: number;
  color?: string;
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
