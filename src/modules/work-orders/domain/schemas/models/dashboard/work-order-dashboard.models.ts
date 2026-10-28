/**
 * Work Orders Dashboard Domain Models
 *
 * Clean Architecture — Domain Layer.
 * Pure business entities and aggregations for Work Order statistics,
 * executive analytics, SLAs, technicians workload, finances and geospatial distribution.
 *
 * SOLID:
 *   SRP: Each interface/class models a single business domain entity.
 *   LSP: Safe data contracts with pure types (no any).
 */

// ── 1. Priority, Status & Type Statistics ─────────────────────────────────────

export interface WorkOrderPriorityStatistic {
  priorityLevel: string;
  priorityId: number;
  description: string;
  quantity: number;
  percentageOfTotal: number;
}

export interface WorkOrderStatusStatistic {
  statusName: string;
  statusId: string;
  statusDescription: string;
  quantity: number;
  percentageOfTotal: number;
}

export interface WorkOrderTypeStatistic {
  workType: string;
  workTypeId: number;
  quantity: number;
  completed: number;
  completionRatePercentage: number;
}

export interface WorkOrdersKeyStatistic {
  totalOrders: number;
  statusId: number;
  statusName: string;
  workTypeId: number;
  workType: string;
  departmentId: number;
  departmentName: string;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  criticalOrders: number;
  createdToday: number;
  createdLast7Days: number;
  createdThisMonth: number;
  closed: number;
  completed: number;
  avgHoursToComplete: number | null;
  avgHoursToAssignment: number | null;
  avgHoursToExecution: number | null;
  pctCompletedInGroup: number;
  pctPendingOrAssigned: number;
  totalMaterialCost: number;
  avgWorkersPerOrder: number | null;
  totalWorkerAssignments: number | null;
}

export class WorkOrdersKeyStatisticsSummary {
  readonly totalOrders: number;
  readonly pendingOrAssigned: number;
  readonly criticalOrders: number;
  readonly emergency: number;
  readonly urgent: number;
  readonly createdToday: number;
  readonly createdLast7Days: number;
  readonly createdThisMonth: number;
  readonly completed: number;
  readonly closed: number;
  readonly totalMaterialCost: number;
  readonly avgHoursToComplete: number | null;

  constructor(data: {
    totalOrders: number;
    pendingOrAssigned: number;
    criticalOrders: number;
    emergency: number;
    urgent: number;
    createdToday: number;
    createdLast7Days: number;
    createdThisMonth: number;
    completed: number;
    closed: number;
    totalMaterialCost: number;
    avgHoursToComplete: number | null;
  }) {
    this.totalOrders = data.totalOrders;
    this.pendingOrAssigned = data.pendingOrAssigned;
    this.criticalOrders = data.criticalOrders;
    this.emergency = data.emergency;
    this.urgent = data.urgent;
    this.createdToday = data.createdToday;
    this.createdLast7Days = data.createdLast7Days;
    this.createdThisMonth = data.createdThisMonth;
    this.completed = data.completed;
    this.closed = data.closed;
    this.totalMaterialCost = data.totalMaterialCost;
    this.avgHoursToComplete = data.avgHoursToComplete;
  }

  static empty(): WorkOrdersKeyStatisticsSummary {
    return new WorkOrdersKeyStatisticsSummary({
      totalOrders: 0,
      pendingOrAssigned: 0,
      criticalOrders: 0,
      emergency: 0,
      urgent: 0,
      createdToday: 0,
      createdLast7Days: 0,
      createdThisMonth: 0,
      completed: 0,
      closed: 0,
      totalMaterialCost: 0,
      avgHoursToComplete: null
    });
  }

  get inProgress(): number {
    const value = this.totalOrders - this.pendingOrAssigned - this.completed - this.closed;
    return value < 0 ? 0 : value;
  }

  get completionRate(): number {
    return this.totalOrders === 0 ? 0 : (this.completed / this.totalOrders) * 100;
  }

  static fromRows(rows: WorkOrdersKeyStatistic[]): WorkOrdersKeyStatisticsSummary {
    if (!rows || rows.length === 0) return WorkOrdersKeyStatisticsSummary.empty();

    const sum = (fn: (e: WorkOrdersKeyStatistic) => number): number =>
      rows.reduce((acc, curr) => acc + (fn(curr) || 0), 0);

    let weightedHours = 0;
    let weight = 0;
    for (const r of rows) {
      if (r.avgHoursToComplete !== null && r.completed > 0) {
        weightedHours += r.avgHoursToComplete * r.completed;
        weight += r.completed;
      }
    }

    return new WorkOrdersKeyStatisticsSummary({
      totalOrders: sum((e) => e.totalOrders),
      pendingOrAssigned: sum((e) => Math.round((e.totalOrders * (e.pctPendingOrAssigned || 0)) / 100)),
      criticalOrders: sum((e) => e.criticalOrders),
      emergency: sum((e) => e.emergency),
      urgent: sum((e) => e.urgent),
      createdToday: sum((e) => e.createdToday),
      createdLast7Days: sum((e) => e.createdLast7Days),
      createdThisMonth: sum((e) => e.createdThisMonth),
      completed: sum((e) => e.completed),
      closed: sum((e) => e.closed),
      totalMaterialCost: rows.reduce((acc, curr) => acc + (curr.totalMaterialCost || 0), 0),
      avgHoursToComplete: weight === 0 ? null : weightedHours / weight
    });
  }
}

// ── 2. Incidentes vs Órdenes de Trabajo (Funnel & Conversion) ─────────────────

export interface FunnelSummary {
  totalReportesIngresados: number;
  reportesEnTriajeSinOt: number;
  reportesConOrdenTrabajo: number;
  pctTasaConversionAOt: number | null;
  otPendientesAsignar: number;
  otAsignadasACuadrilla: number;
  otEnProcesoEjecucion: number;
  otEnEsperaPausadas: number;
  otCompletadasResueltas: number;
  otCanceladasOFalsosReportes: number;
  totalCargaActivaPendiente: number;
  pctTasaResolucionGlobal: number | null;
  horasPromedioTriajeACreacionOt: number | null;
  horasPromedioAsignacionTecnico: number | null;
  horasPromedioEjecucionCampo: number | null;
  horasPromedioCicloCompletoResolucion: number | null;
}

export interface StateMatrixItem {
  estadoIncidente: string;
  estadoOrdenTrabajo: string;
  nombreEstadoOt: string;
  cantidadReportes: number;
  porcentajeDelTotalReportes: number;
  diasPromedioAbierto: number | null;
  criticosEnEstaEtapa: number;
  diagnosticoOperativo: string;
}

export interface OriginChannelItem {
  canalOrigen: string;
  totalReportes: number;
  conOrdenTrabajo: number;
  tasaConversionOtPct: number | null;
  asignadosATecnico: number;
  enProcesoCampo: number;
  totalResueltos: number;
  tasaExitoResolucionPct: number | null;
  descartadosFalsos: number;
  tasaDescartePct: number | null;
  horasPromedioResolucion: number | null;
}

export interface CategoryDepartmentItem {
  categoriaProblema: string;
  tipoProblema: string;
  prioridadSugerida: string | null;
  departamentoResponsable: string;
  totalIncidentes: number;
  totalOtsCreadas: number;
  otsAsignadasActivas: number;
  otsEnProcesoCampo: number;
  totalCompletados: number;
  pctCumplimiento: number | null;
  costoReparacionAcumulado: number;
  diasPromedioAtencion: number | null;
}

export interface SyncDiscrepancyItem {
  codigoIncidente: string;
  codigoOrden: string;
  estadoIncidente: string;
  estadoOt: string;
  fechaReporte: string;
  fechaCompletadaOt: string | null;
  fechaAsignacionOt: string | null;
  tipoDesfase: string;
  tecnicoAsignado: string;
}

export interface DispatchControlItem {
  codigoIncidente: string;
  fechaReporte: string;
  acometidaId: string | null;
  direccionReferencia: string | null;
  origenReporte: string;
  prioridadReporte: string;
  estadoReporte: string;
  codigoOrden: string | null;
  estadoOt: string;
  nombreEstadoOt: string;
  tipoTrabajo: string | null;
  tecnicoResponsable: string;
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  fechaCompletada: string | null;
  slaHoras: number | null;
  horasDesdeReporte: number;
  semaforoSla: string;
}

// ── 3. Executive Overview & Header KPIs ──────────────────────────────────────

export interface HeaderKpis {
  totalOrders: number;
  pendingOrAssigned: number;
  inProgress: number;
  onHold: number;
  criticalOrders: number;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  createdToday: number;
  createdLast7Days: number;
  createdThisMonth: number;
  completed: number;
  closed: number;
  completionRate: number | null;
  totalMaterialCost: number;
  avgHoursToComplete: number | null;
  avgHoursToAssignment: number | null;
}

export interface ExecutiveImmediateOrder {
  codigoOrden: string;
  tipoTrabajo: string;
  prioridad: string;
  estado: string;
  tecnico: string;
  horasTranscurridas: number;
  slaHoras: number;
}

export interface ExecutiveOverview {
  empresa: string;
  sistema: string;
  generadoEn: string;
  comparativa: FunnelSummary;
  kpis: HeaderKpis;
  estados: WorkOrderStatusStatistic[];
  prioridades: WorkOrderPriorityStatistic[];
  ordenesAtencionInmediata: ExecutiveImmediateOrder[];
}

// ── 4. Cuadrillas & Técnicos ──────────────────────────────────────────────────

export interface TechnicianPerformanceItem {
  idTecnico: string;
  nombreTecnico: string;
  cedula: string | null;
  telefonoInterno: string | null;
  totalOrdenesAsignadasHistoricas: number;
  ordenesPorIniciar: number;
  ordenesEnEjecucionHoy: number;
  ordenesEnPausa: number;
  totalBacklogActivo: number;
  totalCompletadas: number;
  completadasEsteMes: number;
  tasaCumplimientoSlaPct: number | null;
  horasPromedioEnCampo: number | null;
}

export interface TechnicianDailyFeedItem {
  idOrdenTrabajo: number;
  codigoOrden: string;
  estado: string;
  nombreEstado: string;
  tipoTrabajo: string;
  prioridad: string;
  slaHoras: number;
  direccion: string | null;
  ubicacionDetalles: string | null;
  claveCatastral: string | null;
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  latitud: number | null;
  longitud: number | null;
  horasRestantesSla: number;
  esOrdenMasPrioritaria: boolean;
}

export interface CrewAssignmentItem {
  codigoOrden: string;
  estadoOt: string;
  tipoTrabajo: string;
  nombreTrabajador: string;
  cedula: string | null;
  rolEnCuadrilla: string | null;
  esResponsable: boolean;
  fechaAsignacion: string | null;
}

// ── 5. SLA & Control de Calidad ──────────────────────────────────────────────

export interface SlaMonitorItem {
  codigoOrden: string;
  tipoTrabajo: string;
  departamento: string;
  prioridad: string;
  slaHoras: number;
  fechaCreacion: string;
  tecnicoAsignado: string;
  horasTranscurridas: number;
  horasHolguraSla: number;
  estadoSlaSemaforo: string;
}

export interface QualityIndicatorItem {
  departamento: string;
  tipoTrabajo: string;
  totalOrdenesInspeccionadas: number;
  totalInspeccionesPreparacion: number;
  preinspeccionesAprobadas: number;
  preinspeccionesRechazadas: number;
  pctAprobacionPreinspeccion: number | null;
  totalControlesCalidad: number;
  trabajosCalidadAprobados: number;
  trabajosCalidadRechazadosRetrabajo: number;
  pctAprobacionCalidadFinal: number | null;
}

export interface EscalationAuditItem {
  codigoOrden: string;
  tipoTrabajo: string;
  departamento: string;
  estadoActual: string;
  fechaCreacion: string;
  tecnicoQueEscalo: string | null;
  motivoEscalamiento: string | null;
}

// ── 6. Financiero y Costos ───────────────────────────────────────────────────

export interface MaterialCostItem {
  departamento: string;
  tipoTrabajo: string;
  codigoMaterial: string | null;
  descripcionMaterial: string;
  cantidadTotalConsumida: number;
  costoUnitarioPromedio: number | null;
  costoTotalMateriales: number;
  ordenesQueLoUtilizaron: number;
}

export interface EconomicBalanceItem {
  mes: string;
  totalOrdenes: number;
  costoTotalMaterialesEpaa: number;
  costoTotalAdicionalesEpaa: number;
  costoOperativoTotalIncurrido: number;
  montoCobrableAUsuarios: number;
  balanceNetoRecuperacion: number;
}

// ── 7. Tendencias y Geoespacial ──────────────────────────────────────────────

export interface DailyTrendItem {
  fecha: string;
  incidentesReportados: number;
  ordenesCreadas: number;
  ordenesCompletadas: number;
  balanceFlujoNeto: number;
}

export interface TerritorialConcentrationItem {
  parroquia: string;
  sectorHidrometrico: string;
  totalIncidentesZona: number;
  totalOtsZona: number;
  otsActivasEnCampo: number;
  incidentesCriticos: number;
  latitudCentroide: number | null;
  longitudCentroide: number | null;
}
