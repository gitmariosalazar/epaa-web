export type RouteResolutionMethod =
  | 'POINT_IN_POLYGON'
  | 'NEAREST_CENTROID_KNN'
  | 'SECTOR_FALLBACK';

export interface ResolvedRoute {
  idRuta: number;
  rutaId?: number;
  codigoRuta?: string;
  codigo?: string;
  nombreRuta?: string;
  nombre?: string;
  sectorId?: number;
  sector?: number;
  metodoResolucion?: RouteResolutionMethod;
  metodoAsignacion?: string;
  distanciaMetros?: number;
  ordenSugerido: number;
  acometidaAnteriorId?: string;
  acometidaSiguienteId?: string;
}

export type RouteResolution = ResolvedRoute;
