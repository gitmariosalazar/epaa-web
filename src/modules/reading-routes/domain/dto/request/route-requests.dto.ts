export interface BatchMorningDispatchRequest {
  zonaId?: number;
  sectorId?: number;
  sector?: number;
  periodo: string;
  fechaProgramada: string;
  lecturistaIds?: string[];
  observaciones?: string;
  asignaciones?: Array<{
    rutaId: number;
    lecturistaId: string;
  }>;
}

export interface AssignSingleRouteRequest {
  rutaId: number;
  usuarioId: string;
  periodo: string;
  fechaProgramada: string;
}

export interface ReassignRouteSegmentRequest {
  asignacionId?: number;
  idAsignacionOrigen?: number;
  nuevoUsuarioId?: string;
  nuevoLecturistaId?: string;
  secuenciaInicio?: number;
  secuenciaFin?: number;
  motivo: string;
}

export interface ResolveRouteRequest {
  latitud: number;
  longitud: number;
  sector?: number;
  acometidaId?: string;
}

export interface InsertConnectionIntoRouteRequest {
  idRuta: number;
  acometidaId: string;
  ordenSugerido?: number;
  ladoCalle?: 'IZQUIERDA' | 'DERECHA' | 'CENTRO';
  instruccionAcceso?: string;
}

export interface OptimizeRouteSequenceRequest {
  acometidaInicio?: string;
}

export interface FindReadingRoutesQuery {
  sectorId?: number;
  activa?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
