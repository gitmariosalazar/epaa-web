// 1. Tipos permitidos en las geometrías
type GeoJsonGeometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'LineString'; coordinates: [number, number][] };

// 2. Propiedades específicas que devuelve tu consulta SQL
export interface RouteMapProperties {
  tipo: 'ruta_lector' | 'medidor' | 'captura' | 'punto_inicio' | 'punto_final';
  clave_catastral?: string;
  acometida_id?: string;
  numero_medidor?: string;
  hora_lectura?: string;
  novedad?: string;
  orden_visita?: number;
  es_inicio?: boolean;
  es_fin?: boolean;
  usuario_lectura?: string;
  // Estilos de visualización
  stroke?: string;
  'stroke-width'?: number;
  'marker-color'?: string;
  'marker-size'?: 'small' | 'medium' | 'large';
  'marker-symbol'?: string;
}

// 3. Objeto individual del mapa
export interface MapFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: RouteMapProperties;
}

// 4. El objeto padre final que retorna el Backend
export interface MapRouteFeatureCollection {
  type: 'FeatureCollection';
  features: MapFeature[];
}
