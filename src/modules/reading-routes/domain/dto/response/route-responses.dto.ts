import type { DispatchedRouteSummary } from '../../models/RouteAssignment';
import type { ReadingRoute } from '../../models/ReadingRoute';

export interface BatchDispatchResponse {
  success: boolean;
  message: string;
  periodo: string;
  totalRutasAsignadas: number;
  totalAcometidasDespachadas: number;
  rutasDespachadas: DispatchedRouteSummary[];
}

export type BatchMorningDispatchResponse = BatchDispatchResponse;

export interface AssignSingleRouteResponse {
  idAsignacion: number;
  message: string;
}

export interface ReassignSegmentResponse {
  success: boolean;
  nuevaAsignacionId: number;
  asignacionOrigenId: number;
  prediosTransferidos: number;
  message: string;
}

export type ReassignRouteSegmentResponse = ReassignSegmentResponse;

export interface OptimizeSequenceResponse {
  success: boolean;
  idRuta: number;
  totalReordenadas: number;
  distanciaTotalCaminadaMetros: number;
  message: string;
}

export type OptimizeRouteSequenceResponse = OptimizeSequenceResponse;

export interface PaginatedRoutesResponse {
  items: ReadingRoute[];
  total: number;
  page: number;
  limit: number;
}

export interface InsertConnectionIntoRouteResponse {
  success: boolean;
  message: string;
  ordenSecuencia?: number;
}
