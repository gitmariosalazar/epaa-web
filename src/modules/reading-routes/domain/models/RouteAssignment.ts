export type RouteAssignmentStatus =
  | 'ASIGNADA'
  | 'EN_PROCESO'
  | 'PAUSADA'
  | 'COMPLETADA'
  | 'REASIGNADA';

export interface RouteAssignment {
  idAsignacion: number;
  rutaId: number;
  codigoRuta?: string;
  nombreRuta?: string;
  usuarioId?: string;
  lecturistaId?: string;
  nombreLecturista?: string;
  empleadoId?: string | null;
  periodoMes?: string;
  fechaProgramada?: string;
  fechaInicio?: string | null;
  fechaCierre?: string | null;
  estado: RouteAssignmentStatus | string;
  totalPredios?: number;
  prediosLeidos?: number;
  prediosConNovedad?: number;
  prediosPendientes?: number;
  porcentajeAvance?: number;
  esReasignacion?: boolean;
  asignacionOrigenId?: number | null;
  motivoReasignacion?: string | null;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // DB and DTO aliases:
  sector?: number;
  sectorId?: number;
  lecturasEsperadas?: number;
  lecturasCompletadas?: number;
  lecturasPendientes?: number;
  lecturasNovedad?: number;
}

export interface DispatchedRouteSummary {
  idAsignacion: number;
  codigoRuta: string;
  lecturistaId: string;
  nombreLecturista?: string;
  totalPredios: number;
}
