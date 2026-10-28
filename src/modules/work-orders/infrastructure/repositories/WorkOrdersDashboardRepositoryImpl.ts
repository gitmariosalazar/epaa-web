/**
 * WorkOrdersDashboardRepositoryImpl
 *
 * Clean Architecture — Infrastructure layer.
 *   Implements WorkOrdersDashboardRepository (domain interface).
 *   All HTTP calls delegated to HttpClientInterface (DIP).
 *   Defensive parsing guarantees runtime safety without `any`.
 *
 * Backend controllers:
 *   - /work-orders-dashboard
 *   - /work-orders
 *
 * SOLID:
 *   SRP: HTTP transport and response mapping for all work orders analytics.
 *   OCP: Adding new dashboard metrics only requires adding a parser and method.
 *   LSP: Fully adheres to WorkOrdersDashboardRepository contract.
 *   ISP: Implements segregated sub-interfaces cleanly.
 *   DIP: Depends on HttpClientInterface abstraction, not concrete Axios/Fetch.
 */

import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type {
  CategoryDepartmentItem,
  CrewAssignmentItem,
  DailyTrendItem,
  DispatchControlItem,
  EconomicBalanceItem,
  EscalationAuditItem,
  ExecutiveImmediateOrder,
  ExecutiveOverview,
  FunnelSummary,
  HeaderKpis,
  MaterialCostItem,
  OriginChannelItem,
  QualityIndicatorItem,
  SlaMonitorItem,
  StateMatrixItem,
  SyncDiscrepancyItem,
  TechnicianDailyFeedItem,
  TechnicianPerformanceItem,
  TerritorialConcentrationItem,
  WorkOrderPriorityStatistic,
  WorkOrderStatusStatistic,
  WorkOrderTypeStatistic,
  WorkOrdersKeyStatistic
} from '../../domain/schemas/models/dashboard/work-order-dashboard.models';
import type { WorkOrdersDashboardRepository } from '../../domain/repositories/work-orders-dashboard.interface.repository';

// ── Defensive Type Parsers (Strictly typed, 0% `any`) ─────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseToInt(v: unknown, fallback = 0): number {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'number') return Number.isFinite(v) ? Math.trunc(v) : fallback;
  if (typeof v === 'string') {
    const parsed = parseInt(v, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function parseToIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const num = parseToInt(v, Number.NaN);
  return Number.isNaN(num) ? null : num;
}

function parseToDouble(v: unknown, fallback = 0.0): number {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  if (typeof v === 'string') {
    const parsed = parseFloat(v);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function parseToDoubleOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const num = parseToDouble(v, Number.NaN);
  return Number.isNaN(num) ? null : num;
}

function parseToStr(v: unknown, fallback = ''): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function parseToStrOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null;
  return String(v);
}

function parseToBool(v: unknown, fallback = false): boolean {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'boolean') return v;
  const str = String(v).trim().toLowerCase();
  if (str === 'true' || str === '1' || str === 't') return true;
  if (str === 'false' || str === '0' || str === 'f') return false;
  return fallback;
}

// ── Model Parsers ────────────────────────────────────────────────────────────

function parseFunnelSummary(data: unknown): FunnelSummary {
  const r = isRecord(data) ? data : {};
  return {
    totalReportesIngresados: parseToInt(r.totalReportesIngresados ?? r.total_reportes),
    reportesEnTriajeSinOt: parseToInt(r.reportesEnTriajeSinOt ?? r.reportes_sin_ot),
    reportesConOrdenTrabajo: parseToInt(r.reportesConOrdenTrabajo ?? r.reportes_con_ot),
    pctTasaConversionAOt: parseToDoubleOrNull(r.pctTasaConversionAOt ?? r.tasa_conversion_ot_pct),
    otPendientesAsignar: parseToInt(r.otPendientesAsignar ?? r.ot_pendientes_asignacion),
    otAsignadasACuadrilla: parseToInt(r.otAsignadasACuadrilla ?? r.ot_asignadas_a_cuadrilla),
    otEnProcesoEjecucion: parseToInt(r.otEnProcesoEjecucion ?? r.ot_en_proceso_campo),
    otEnEsperaPausadas: parseToInt(r.otEnEsperaPausadas ?? r.ot_en_espera),
    otCompletadasResueltas: parseToInt(r.otCompletadasResueltas ?? r.ot_completadas_resueltas),
    otCanceladasOFalsosReportes: parseToInt(r.otCanceladasOFalsosReportes ?? r.ot_canceladas_falsos_reportes),
    totalCargaActivaPendiente: parseToInt(r.totalCargaActivaPendiente ?? r.total_carga_activa),
    pctTasaResolucionGlobal: parseToDoubleOrNull(r.pctTasaResolucionGlobal ?? r.tasa_resolucion_global_pct),
    horasPromedioTriajeACreacionOt: parseToDoubleOrNull(r.horasPromedioTriajeACreacionOt ?? r.horas_promedio_triaje_creacion_ot),
    horasPromedioAsignacionTecnico: parseToDoubleOrNull(r.horasPromedioAsignacionTecnico ?? r.horas_promedio_asignacion_tecnico),
    horasPromedioEjecucionCampo: parseToDoubleOrNull(r.horasPromedioEjecucionCampo ?? r.horas_promedio_ejecucion_campo),
    horasPromedioCicloCompletoResolucion: parseToDoubleOrNull(r.horasPromedioCicloCompletoResolucion ?? r.horas_promedio_ciclo_resolucion)
  };
}

function parseStateMatrixItem(data: unknown): StateMatrixItem {
  const r = isRecord(data) ? data : {};
  return {
    estadoIncidente: parseToStr(r.estadoIncidente ?? r.estado_incidente),
    estadoOrdenTrabajo: parseToStr(r.estadoOrdenTrabajo ?? r.estado_orden_trabajo),
    nombreEstadoOt: parseToStr(r.nombreEstadoOt ?? r.nombre_estado_ot ?? r.estado_ot),
    cantidadReportes: parseToInt(r.cantidadReportes ?? r.cantidad_reportes ?? r.cantidad),
    porcentajeDelTotalReportes: parseToDouble(r.porcentajeDelTotalReportes ?? r.porcentaje_total ?? r.porcentaje),
    diasPromedioAbierto: parseToDoubleOrNull(r.diasPromedioAbierto ?? r.dias_promedio_abierto),
    criticosEnEstaEtapa: parseToInt(r.criticosEnEstaEtapa ?? r.criticos_en_esta_etapa ?? r.criticos),
    diagnosticoOperativo: parseToStr(r.diagnosticoOperativo ?? r.diagnostico_operativo ?? r.diagnostico)
  };
}

function parseOriginChannelItem(data: unknown): OriginChannelItem {
  const r = isRecord(data) ? data : {};
  return {
    canalOrigen: parseToStr(r.canalOrigen ?? r.canal_origen ?? r.origen),
    totalReportes: parseToInt(r.totalReportes ?? r.total_reportes),
    conOrdenTrabajo: parseToInt(r.conOrdenTrabajo ?? r.con_orden_trabajo ?? r.con_ot),
    tasaConversionOtPct: parseToDoubleOrNull(r.tasaConversionOtPct ?? r.tasa_conversion_ot_pct),
    asignadosATecnico: parseToInt(r.asignadosATecnico ?? r.asignados_a_tecnico),
    enProcesoCampo: parseToInt(r.enProcesoCampo ?? r.en_proceso_campo),
    totalResueltos: parseToInt(r.totalResueltos ?? r.total_resueltos),
    tasaExitoResolucionPct: parseToDoubleOrNull(r.tasaExitoResolucionPct ?? r.tasa_exito_resolucion_pct),
    descartadosFalsos: parseToInt(r.descartadosFalsos ?? r.descartados_falsos),
    tasaDescartePct: parseToDoubleOrNull(r.tasaDescartePct ?? r.tasa_descarte_pct),
    horasPromedioResolucion: parseToDoubleOrNull(r.horasPromedioResolucion ?? r.horas_promedio_resolucion)
  };
}

function parseCategoryDepartmentItem(data: unknown): CategoryDepartmentItem {
  const r = isRecord(data) ? data : {};
  return {
    categoriaProblema: parseToStr(r.categoriaProblema ?? r.categoria_problema ?? r.categoria),
    tipoProblema: parseToStr(r.tipoProblema ?? r.tipo_problema ?? r.tipo),
    prioridadSugerida: parseToStrOrNull(r.prioridadSugerida ?? r.prioridad_sugerida),
    departamentoResponsable: parseToStr(r.departamentoResponsable ?? r.departamento_responsable ?? r.departamento),
    totalIncidentes: parseToInt(r.totalIncidentes ?? r.total_incidentes),
    totalOtsCreadas: parseToInt(r.totalOtsCreadas ?? r.total_ots_creadas),
    otsAsignadasActivas: parseToInt(r.otsAsignadasActivas ?? r.ots_asignadas_activas),
    otsEnProcesoCampo: parseToInt(r.otsEnProcesoCampo ?? r.ots_en_proceso_campo),
    totalCompletados: parseToInt(r.totalCompletados ?? r.total_completados),
    pctCumplimiento: parseToDoubleOrNull(r.pctCumplimiento ?? r.pct_cumplimiento),
    costoReparacionAcumulado: parseToDouble(r.costoReparacionAcumulado ?? r.costo_reparacion_acumulado),
    diasPromedioAtencion: parseToDoubleOrNull(r.diasPromedioAtencion ?? r.dias_promedio_atencion)
  };
}

function parseSyncDiscrepancyItem(data: unknown): SyncDiscrepancyItem {
  const r = isRecord(data) ? data : {};
  return {
    codigoIncidente: parseToStr(r.codigoIncidente ?? r.codigo_incidente),
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    estadoIncidente: parseToStr(r.estadoIncidente ?? r.estado_incidente),
    estadoOt: parseToStr(r.estadoOt ?? r.estado_ot),
    fechaReporte: parseToStr(r.fechaReporte ?? r.fecha_reporte),
    fechaCompletadaOt: parseToStrOrNull(r.fechaCompletadaOt ?? r.fecha_completada_ot),
    fechaAsignacionOt: parseToStrOrNull(r.fechaAsignacionOt ?? r.fecha_asignacion_ot),
    tipoDesfase: parseToStr(r.tipoDesfase ?? r.tipo_desfase),
    tecnicoAsignado: parseToStr(r.tecnicoAsignado ?? r.tecnico_asignado)
  };
}

function parseDispatchControlItem(data: unknown): DispatchControlItem {
  const r = isRecord(data) ? data : {};
  return {
    codigoIncidente: parseToStr(r.codigoIncidente ?? r.codigo_incidente),
    fechaReporte: parseToStr(r.fechaReporte ?? r.fecha_reporte),
    acometidaId: parseToStrOrNull(r.acometidaId ?? r.acometida_id),
    direccionReferencia: parseToStrOrNull(r.direccionReferencia ?? r.direccion_referencia),
    origenReporte: parseToStr(r.origenReporte ?? r.origen_reporte),
    prioridadReporte: parseToStr(r.prioridadReporte ?? r.prioridad_reporte),
    estadoReporte: parseToStr(r.estadoReporte ?? r.estado_reporte),
    codigoOrden: parseToStrOrNull(r.codigoOrden ?? r.codigo_orden),
    estadoOt: parseToStr(r.estadoOt ?? r.estado_ot),
    nombreEstadoOt: parseToStr(r.nombreEstadoOt ?? r.nombre_estado_ot ?? r.estado_ot),
    tipoTrabajo: parseToStrOrNull(r.tipoTrabajo ?? r.tipo_trabajo),
    tecnicoResponsable: parseToStr(r.tecnicoResponsable ?? r.tecnico_responsable),
    fechaAsignacion: parseToStrOrNull(r.fechaAsignacion ?? r.fecha_asignacion),
    fechaInicioCampo: parseToStrOrNull(r.fechaInicioCampo ?? r.fecha_inicio_campo),
    fechaCompletada: parseToStrOrNull(r.fechaCompletada ?? r.fecha_completada),
    slaHoras: parseToIntOrNull(r.slaHoras ?? r.sla_horas),
    horasDesdeReporte: parseToDouble(r.horasDesdeReporte ?? r.horas_desde_reporte),
    semaforoSla: parseToStr(r.semaforoSla ?? r.semaforo_sla ?? 'VERDE')
  };
}

function parseHeaderKpis(data: unknown): HeaderKpis {
  const r = isRecord(data) ? data : {};
  const total = parseToInt(r.totalOrders ?? r.total_ordenes ?? r.total);
  const pending = parseToInt(r.pendingOrAssigned ?? r.pendientes_o_asignadas ?? r.pendientes);
  let inProgress = parseToInt(r.inProgress ?? r.en_progreso ?? r.en_proceso);
  const completed = parseToInt(r.completed ?? r.completadas ?? r.completadas_resueltas);

  if (inProgress === 0 && total > pending + completed) {
    inProgress = total - (pending + completed);
  }

  return {
    totalOrders: total,
    pendingOrAssigned: pending,
    inProgress,
    onHold: parseToInt(r.onHold ?? r.en_espera ?? r.ot_en_espera),
    criticalOrders: parseToInt(r.criticalOrders ?? r.criticas ?? r.criticas_ordenes),
    emergency: parseToInt(r.emergency ?? r.emergencias ?? r.emergencia),
    urgent: parseToInt(r.urgent ?? r.urgentes ?? r.urgente),
    high: parseToInt(r.high ?? r.altas ?? r.alta),
    medium: parseToInt(r.medium ?? r.medias ?? r.media),
    low: parseToInt(r.low ?? r.bajas ?? r.baja),
    createdToday: parseToInt(r.createdToday ?? r.creadas_hoy ?? r.hoy),
    createdLast7Days: parseToInt(r.createdLast7Days ?? r.creadas_ultimos_7_dias),
    createdThisMonth: parseToInt(r.createdThisMonth ?? r.creadas_este_mes),
    completed,
    closed: parseToInt(r.closed ?? r.cerradas),
    completionRate: parseToDoubleOrNull(r.completionRate ?? r.tasa_cumplimiento_pct),
    totalMaterialCost: parseToDouble(r.totalMaterialCost ?? r.costo_total_materiales ?? r.costo_materiales),
    avgHoursToComplete: parseToDoubleOrNull(r.avgHoursToComplete ?? r.horas_promedio_resolucion),
    avgHoursToAssignment: parseToDoubleOrNull(r.avgHoursToAssignment ?? r.horas_promedio_asignacion)
  };
}

function parseWorkOrderStatusStatistic(data: unknown): WorkOrderStatusStatistic {
  const r = isRecord(data) ? data : {};
  return {
    statusName: parseToStr(r.statusName ?? r.status_name ?? r.estado_nombre),
    statusId: parseToStr(r.statusId ?? r.status_id ?? r.estado ?? r.id),
    statusDescription: parseToStr(r.statusDescription ?? r.status_description ?? r.descripcion),
    quantity: parseToInt(r.quantity ?? r.cantidad ?? r.total ?? r.count),
    percentageOfTotal: parseToDouble(r.percentageOfTotal ?? r.percentage_of_total ?? r.porcentaje)
  };
}

function parseWorkOrderPriorityStatistic(data: unknown): WorkOrderPriorityStatistic {
  const r = isRecord(data) ? data : {};
  return {
    priorityLevel: parseToStr(r.priorityLevel ?? r.priority_level ?? r.prioridad),
    priorityId: parseToInt(r.priorityId ?? r.priority_id ?? r.id),
    description: parseToStr(r.description ?? r.descripcion),
    quantity: parseToInt(r.quantity ?? r.cantidad ?? r.total),
    percentageOfTotal: parseToDouble(r.percentageOfTotal ?? r.percentage_of_total ?? r.porcentaje)
  };
}

function parseWorkOrderTypeStatistic(data: unknown): WorkOrderTypeStatistic {
  const r = isRecord(data) ? data : {};
  return {
    workType: parseToStr(r.workType ?? r.work_type ?? r.tipo_trabajo),
    workTypeId: parseToInt(r.workTypeId ?? r.work_type_id ?? r.id),
    quantity: parseToInt(r.quantity ?? r.cantidad ?? r.total),
    completed: parseToInt(r.completed ?? r.completadas),
    completionRatePercentage: parseToDouble(r.completionRatePercentage ?? r.completion_rate_percentage ?? r.porcentaje_cumplimiento)
  };
}

function parseWorkOrdersKeyStatistic(data: unknown): WorkOrdersKeyStatistic {
  const r = isRecord(data) ? data : {};
  return {
    totalOrders: parseToInt(r.totalOrders ?? r.total_ordenes),
    statusId: parseToInt(r.statusId ?? r.status_id),
    statusName: parseToStr(r.statusName ?? r.status_name),
    workTypeId: parseToInt(r.workTypeId ?? r.work_type_id),
    workType: parseToStr(r.workType ?? r.work_type),
    departmentId: parseToInt(r.departmentId ?? r.department_id),
    departmentName: parseToStr(r.departmentName ?? r.department_name),
    emergency: parseToInt(r.emergency),
    urgent: parseToInt(r.urgent),
    high: parseToInt(r.high),
    medium: parseToInt(r.medium),
    low: parseToInt(r.low),
    criticalOrders: parseToInt(r.criticalOrders ?? r.critical_orders),
    createdToday: parseToInt(r.createdToday ?? r.created_today),
    createdLast7Days: parseToInt(r.createdLast7Days ?? r.created_last_7_days),
    createdThisMonth: parseToInt(r.createdThisMonth ?? r.created_this_month),
    closed: parseToInt(r.closed),
    completed: parseToInt(r.completed),
    avgHoursToComplete: parseToDoubleOrNull(r.avgHoursToComplete ?? r.avg_hours_to_complete),
    avgHoursToAssignment: parseToDoubleOrNull(r.avgHoursToAssignment ?? r.avg_hours_to_assignment),
    avgHoursToExecution: parseToDoubleOrNull(r.avgHoursToExecution ?? r.avg_hours_to_execution),
    pctCompletedInGroup: parseToDouble(r.pctCompletedInGroup ?? r.pct_completed_in_group),
    pctPendingOrAssigned: parseToDouble(r.pctPendingOrAssigned ?? r.pct_pending_or_assigned),
    totalMaterialCost: parseToDouble(r.totalMaterialCost ?? r.total_material_cost),
    avgWorkersPerOrder: parseToDoubleOrNull(r.avgWorkersPerOrder ?? r.avg_workers_per_order),
    totalWorkerAssignments: parseToIntOrNull(r.totalWorkerAssignments ?? r.total_worker_assignments)
  };
}

function parseExecutiveImmediateOrder(data: unknown): ExecutiveImmediateOrder {
  const r = isRecord(data) ? data : {};
  return {
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    prioridad: parseToStr(r.prioridad),
    estado: parseToStr(r.estado),
    tecnico: parseToStr(r.tecnico),
    horasTranscurridas: parseToDouble(r.horasTranscurridas ?? r.horas_transcurridas),
    slaHoras: parseToInt(r.slaHoras ?? r.sla_horas)
  };
}

function parseExecutiveOverview(data: unknown): ExecutiveOverview {
  const r = isRecord(data) ? data : {};
  const meta = isRecord(r.metadata) ? r.metadata : {};
  const comp = r.comparativaIncidentesVsOts ?? r.comparativa_incidentes_vs_ots;
  const kpis = r.kpisOrdenesTrabajo ?? r.kpis_ordenes_trabajo;
  const estados = Array.isArray(r.distribucionEstados) ? r.distribucionEstados : Array.isArray(r.distribucion_estados) ? r.distribucion_estados : [];
  const prioridades = Array.isArray(r.distribucionPrioridades) ? r.distribucionPrioridades : Array.isArray(r.distribucion_prioridades) ? r.distribucion_prioridades : [];
  const atencion = Array.isArray(r.ordenesAtencionInmediata) ? r.ordenesAtencionInmediata : Array.isArray(r.ordenes_atencion_inmediata) ? r.ordenes_atencion_inmediata : [];

  return {
    empresa: parseToStr(meta.empresa ?? r.empresa ?? 'EPAA'),
    sistema: parseToStr(meta.sistema ?? r.sistema ?? 'Sistema de Gestión Operativa'),
    generadoEn: parseToStr(meta.generadoEn ?? r.generadoEn ?? new Date().toISOString()),
    comparativa: parseFunnelSummary(comp),
    kpis: parseHeaderKpis(kpis),
    estados: estados.map(parseWorkOrderStatusStatistic),
    prioridades: prioridades.map(parseWorkOrderPriorityStatistic),
    ordenesAtencionInmediata: atencion.map(parseExecutiveImmediateOrder)
  };
}

function parseTechnicianPerformanceItem(data: unknown): TechnicianPerformanceItem {
  const r = isRecord(data) ? data : {};
  return {
    idTecnico: parseToStr(r.idTecnico ?? r.id_tecnico),
    nombreTecnico: parseToStr(r.nombreTecnico ?? r.nombre_tecnico),
    cedula: parseToStrOrNull(r.cedula),
    telefonoInterno: parseToStrOrNull(r.telefonoInterno ?? r.telefono_interno),
    totalOrdenesAsignadasHistoricas: parseToInt(r.totalOrdenesAsignadasHistoricas ?? r.total_ordenes_historicas),
    ordenesPorIniciar: parseToInt(r.ordenesPorIniciar ?? r.ordenes_por_iniciar),
    ordenesEnEjecucionHoy: parseToInt(r.ordenesEnEjecucionHoy ?? r.ordenes_en_ejecucion_hoy),
    ordenesEnPausa: parseToInt(r.ordenesEnPausa ?? r.ordenes_en_pausa),
    totalBacklogActivo: parseToInt(r.totalBacklogActivo ?? r.total_backlog_activo),
    totalCompletadas: parseToInt(r.totalCompletadas ?? r.total_completadas),
    completadasEsteMes: parseToInt(r.completadasEsteMes ?? r.completadas_este_mes),
    tasaCumplimientoSlaPct: parseToDoubleOrNull(r.tasaCumplimientoSlaPct ?? r.tasa_cumplimiento_sla_pct),
    horasPromedioEnCampo: parseToDoubleOrNull(r.horasPromedioEnCampo ?? r.horas_promedio_en_campo)
  };
}

function parseTechnicianDailyFeedItem(data: unknown): TechnicianDailyFeedItem {
  const r = isRecord(data) ? data : {};
  return {
    idOrdenTrabajo: parseToInt(r.idOrdenTrabajo ?? r.id_orden_trabajo),
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    estado: parseToStr(r.estado),
    nombreEstado: parseToStr(r.nombreEstado ?? r.nombre_estado ?? r.estado),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    prioridad: parseToStr(r.prioridad),
    slaHoras: parseToInt(r.slaHoras ?? r.sla_horas),
    direccion: parseToStrOrNull(r.direccion),
    ubicacionDetalles: parseToStrOrNull(r.ubicacionDetalles ?? r.ubicacion_detalles),
    claveCatastral: parseToStrOrNull(r.claveCatastral ?? r.clave_catastral),
    fechaAsignacion: parseToStrOrNull(r.fechaAsignacion ?? r.fecha_asignacion),
    fechaInicioCampo: parseToStrOrNull(r.fechaInicioCampo ?? r.fecha_inicio_campo),
    latitud: parseToDoubleOrNull(r.latitud),
    longitud: parseToDoubleOrNull(r.longitud),
    horasRestantesSla: parseToDouble(r.horasRestantesSla ?? r.horas_restantes_sla),
    esOrdenMasPrioritaria: parseToBool(r.esOrdenMasPrioritaria ?? r.es_orden_mas_prioritaria)
  };
}

function parseCrewAssignmentItem(data: unknown): CrewAssignmentItem {
  const r = isRecord(data) ? data : {};
  return {
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    estadoOt: parseToStr(r.estadoOt ?? r.estado_ot),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    nombreTrabajador: parseToStr(r.nombreTrabajador ?? r.nombre_trabajador),
    cedula: parseToStrOrNull(r.cedula),
    rolEnCuadrilla: parseToStrOrNull(r.rolEnCuadrilla ?? r.rol_en_cuadrilla),
    esResponsable: parseToBool(r.esResponsable ?? r.es_responsable),
    fechaAsignacion: parseToStrOrNull(r.fechaAsignacion ?? r.fecha_asignacion)
  };
}

function parseSlaMonitorItem(data: unknown): SlaMonitorItem {
  const r = isRecord(data) ? data : {};
  return {
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    departamento: parseToStr(r.departamento),
    prioridad: parseToStr(r.prioridad),
    slaHoras: parseToInt(r.slaHoras ?? r.sla_horas),
    fechaCreacion: parseToStr(r.fechaCreacion ?? r.fecha_creacion),
    tecnicoAsignado: parseToStr(r.tecnicoAsignado ?? r.tecnico_asignado),
    horasTranscurridas: parseToDouble(r.horasTranscurridas ?? r.horas_transcurridas),
    horasHolguraSla: parseToDouble(r.horasHolguraSla ?? r.horas_holgura_sla),
    estadoSlaSemaforo: parseToStr(r.estadoSlaSemaforo ?? r.estado_sla_semaforo ?? 'NORMAL')
  };
}

function parseQualityIndicatorItem(data: unknown): QualityIndicatorItem {
  const r = isRecord(data) ? data : {};
  return {
    departamento: parseToStr(r.departamento),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    totalOrdenesInspeccionadas: parseToInt(r.totalOrdenesInspeccionadas ?? r.total_ordenes_inspeccionadas),
    totalInspeccionesPreparacion: parseToInt(r.totalInspeccionesPreparacion ?? r.total_inspecciones_preparacion),
    preinspeccionesAprobadas: parseToInt(r.preinspeccionesAprobadas ?? r.preinspecciones_aprobadas),
    preinspeccionesRechazadas: parseToInt(r.preinspeccionesRechazadas ?? r.preinspecciones_rechazadas),
    pctAprobacionPreinspeccion: parseToDoubleOrNull(r.pctAprobacionPreinspeccion ?? r.pct_aprobacion_preinspeccion),
    totalControlesCalidad: parseToInt(r.totalControlesCalidad ?? r.total_controles_calidad),
    trabajosCalidadAprobados: parseToInt(r.trabajosCalidadAprobados ?? r.trabajos_calidad_aprobados),
    trabajosCalidadRechazadosRetrabajo: parseToInt(r.trabajosCalidadRechazadosRetrabajo ?? r.trabajos_calidad_rechazados_retrabajo),
    pctAprobacionCalidadFinal: parseToDoubleOrNull(r.pctAprobacionCalidadFinal ?? r.pct_aprobacion_calidad_final)
  };
}

function parseEscalationAuditItem(data: unknown): EscalationAuditItem {
  const r = isRecord(data) ? data : {};
  return {
    codigoOrden: parseToStr(r.codigoOrden ?? r.codigo_orden),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    departamento: parseToStr(r.departamento),
    estadoActual: parseToStr(r.estadoActual ?? r.estado_actual),
    fechaCreacion: parseToStr(r.fechaCreacion ?? r.fecha_creacion),
    tecnicoQueEscalo: parseToStrOrNull(r.tecnicoQueEscalo ?? r.tecnico_que_escalo),
    motivoEscalamiento: parseToStrOrNull(r.motivoEscalamiento ?? r.motivo_escalamiento)
  };
}

function parseMaterialCostItem(data: unknown): MaterialCostItem {
  const r = isRecord(data) ? data : {};
  return {
    departamento: parseToStr(r.departamento),
    tipoTrabajo: parseToStr(r.tipoTrabajo ?? r.tipo_trabajo),
    codigoMaterial: parseToStrOrNull(r.codigoMaterial ?? r.codigo_material),
    descripcionMaterial: parseToStr(r.descripcionMaterial ?? r.descripcion_material),
    cantidadTotalConsumida: parseToDouble(r.cantidadTotalConsumida ?? r.cantidad_total_consumida),
    costoUnitarioPromedio: parseToDoubleOrNull(r.costoUnitarioPromedio ?? r.costo_unitario_promedio),
    costoTotalMateriales: parseToDouble(r.costoTotalMateriales ?? r.costo_total_materiales),
    ordenesQueLoUtilizaron: parseToInt(r.ordenesQueLoUtilizaron ?? r.ordenes_que_lo_utilizaron)
  };
}

function parseEconomicBalanceItem(data: unknown): EconomicBalanceItem {
  const r = isRecord(data) ? data : {};
  return {
    mes: parseToStr(r.mes),
    totalOrdenes: parseToInt(r.totalOrdenes ?? r.total_ordenes),
    costoTotalMaterialesEpaa: parseToDouble(r.costoTotalMaterialesEpaa ?? r.costo_total_materiales_epaa),
    costoTotalAdicionalesEpaa: parseToDouble(r.costoTotalAdicionalesEpaa ?? r.costo_total_adicionales_epaa),
    costoOperativoTotalIncurrido: parseToDouble(r.costoOperativoTotalIncurrido ?? r.costo_operativo_total_incurrido),
    montoCobrableAUsuarios: parseToDouble(r.montoCobrableAUsuarios ?? r.monto_cobrable_a_usuarios),
    balanceNetoRecuperacion: parseToDouble(r.balanceNetoRecuperacion ?? r.balance_neto_recuperacion)
  };
}

function parseDailyTrendItem(data: unknown): DailyTrendItem {
  const r = isRecord(data) ? data : {};
  return {
    fecha: parseToStr(r.fecha),
    incidentesReportados: parseToInt(r.incidentesReportados ?? r.incidentes_reportados),
    ordenesCreadas: parseToInt(r.ordenesCreadas ?? r.ordenes_creadas),
    ordenesCompletadas: parseToInt(r.ordenesCompletadas ?? r.ordenes_completadas),
    balanceFlujoNeto: parseToInt(r.balanceFlujoNeto ?? r.balance_flujo_neto)
  };
}

function parseTerritorialConcentrationItem(data: unknown): TerritorialConcentrationItem {
  const r = isRecord(data) ? data : {};
  return {
    parroquia: parseToStr(r.parroquia),
    sectorHidrometrico: parseToStr(r.sectorHidrometrico ?? r.sector_hidrometrico),
    totalIncidentesZona: parseToInt(r.totalIncidentesZona ?? r.total_incidentes_zona),
    totalOtsZona: parseToInt(r.totalOtsZona ?? r.total_ots_zona),
    otsActivasEnCampo: parseToInt(r.otsActivasEnCampo ?? r.ots_activas_en_campo),
    incidentesCriticos: parseToInt(r.incidentesCriticos ?? r.incidentes_criticos),
    latitudCentroide: parseToDoubleOrNull(r.latitudCentroide ?? r.latitud_centroide),
    longitudCentroide: parseToDoubleOrNull(r.longitudCentroide ?? r.longitud_centroide)
  };
}

// ── Repository Implementation ────────────────────────────────────────────────

const DASHBOARD_BASE = '/work-orders-dashboard';
const WORK_ORDERS_BASE = '/work-orders';

export class WorkOrdersDashboardRepositoryImpl implements WorkOrdersDashboardRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  private async fetchList<T>(
    url: string,
    itemParser: (item: unknown) => T
  ): Promise<T[]> {
    try {
      const response = await this.client.get<unknown>(url);
      const rawData = isRecord(response.data) && 'data' in response.data ? response.data.data : response.data;
      if (!Array.isArray(rawData)) return [];
      return rawData.map(itemParser);
    } catch (error) {
      console.warn(`[WorkOrdersDashboardRepositoryImpl] fetchList failed for ${url}:`, error);
      return [];
    }
  }

  private async fetchObject<T>(
    url: string,
    parser: (data: unknown) => T,
    fallback: T
  ): Promise<T> {
    try {
      const response = await this.client.get<unknown>(url);
      const rawData = isRecord(response.data) && 'data' in response.data ? response.data.data : response.data;
      if (!rawData) return fallback;
      return parser(rawData);
    } catch (error) {
      console.warn(`[WorkOrdersDashboardRepositoryImpl] fetchObject failed for ${url}:`, error);
      return fallback;
    }
  }

  // ── 1. Incidentes vs Órdenes de Trabajo ─────────────────────────────────────

  async getFunnelSummary(): Promise<FunnelSummary> {
    return this.fetchObject(
      `${DASHBOARD_BASE}/funnel-summary`,
      parseFunnelSummary,
      parseFunnelSummary({})
    );
  }

  async getStateMatrix(): Promise<StateMatrixItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/state-matrix`, parseStateMatrixItem);
  }

  async getOriginChannels(): Promise<OriginChannelItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/origin-channel`, parseOriginChannelItem);
  }

  async getCategoryDepartments(): Promise<CategoryDepartmentItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/category-department`, parseCategoryDepartmentItem);
  }

  async getSyncDiscrepancies(): Promise<SyncDiscrepancyItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/sync-discrepancies`, parseSyncDiscrepancyItem);
  }

  async getDispatchControl(limit?: number): Promise<DispatchControlItem[]> {
    const url = limit ? `${DASHBOARD_BASE}/dispatch-control?limit=${limit}` : `${DASHBOARD_BASE}/dispatch-control`;
    return this.fetchList(url, parseDispatchControlItem);
  }

  // ── 2. Cuadrillas y Técnicos ────────────────────────────────────────────────

  async getTechnicianPerformance(): Promise<TechnicianPerformanceItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/technician-performance`, parseTechnicianPerformanceItem);
  }

  async getTechnicianDailyFeed(technicianId?: string): Promise<TechnicianDailyFeedItem[]> {
    const url = technicianId
      ? `${DASHBOARD_BASE}/technician-daily-feed?technicianId=${encodeURIComponent(technicianId)}`
      : `${DASHBOARD_BASE}/technician-daily-feed`;
    return this.fetchList(url, parseTechnicianDailyFeedItem);
  }

  async getCrewAssignments(): Promise<CrewAssignmentItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/crew-assignments`, parseCrewAssignmentItem);
  }

  // ── 3. SLA y Calidad ────────────────────────────────────────────────────────

  async getSlaMonitor(): Promise<SlaMonitorItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/sla-monitor`, parseSlaMonitorItem);
  }

  async getQualityIndicators(): Promise<QualityIndicatorItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/quality-indicators`, parseQualityIndicatorItem);
  }

  async getEscalationAudit(): Promise<EscalationAuditItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/escalation-audit`, parseEscalationAuditItem);
  }

  // ── 4. Financiero ───────────────────────────────────────────────────────────

  async getMaterialCosts(): Promise<MaterialCostItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/material-costs`, parseMaterialCostItem);
  }

  async getEconomicBalance(): Promise<EconomicBalanceItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/economic-balance`, parseEconomicBalanceItem);
  }

  // ── 5. Tendencias & Geoespacial ─────────────────────────────────────────────

  async getDailyTrend(): Promise<DailyTrendItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/daily-trend`, parseDailyTrendItem);
  }

  async getTerritorialConcentration(): Promise<TerritorialConcentrationItem[]> {
    return this.fetchList(`${DASHBOARD_BASE}/territorial-concentration`, parseTerritorialConcentrationItem);
  }

  // ── 6. Resumen Ejecutivo y KPIs ─────────────────────────────────────────────

  async getHeaderKpis(): Promise<HeaderKpis> {
    return this.fetchObject(
      `${DASHBOARD_BASE}/header-kpis`,
      parseHeaderKpis,
      parseHeaderKpis({})
    );
  }

  async getExecutiveOverview(): Promise<ExecutiveOverview> {
    return this.fetchObject(
      `${DASHBOARD_BASE}/executive-overview`,
      parseExecutiveOverview,
      parseExecutiveOverview({})
    );
  }

  async getStatusDistribution(): Promise<WorkOrderStatusStatistic[]> {
    return this.fetchList(`${DASHBOARD_BASE}/status-distribution`, parseWorkOrderStatusStatistic);
  }

  async getPriorityDistribution(): Promise<WorkOrderPriorityStatistic[]> {
    return this.fetchList(`${DASHBOARD_BASE}/priority-distribution`, parseWorkOrderPriorityStatistic);
  }

  async getWorkTypePerformance(): Promise<WorkOrderTypeStatistic[]> {
    return this.fetchList(`${DASHBOARD_BASE}/work-type-performance`, parseWorkOrderTypeStatistic);
  }

  async getKeyStatisticsMatrix(): Promise<WorkOrdersKeyStatistic[]> {
    return this.fetchList(`${DASHBOARD_BASE}/key-statistics-matrix`, parseWorkOrdersKeyStatistic);
  }

  // ── 7. Direct Statistics (/work-orders/...) ─────────────────────────────────

  async getPriorityStatistics(): Promise<WorkOrderPriorityStatistic[]> {
    return this.fetchList(`${WORK_ORDERS_BASE}/get-work-order-priority-statistics`, parseWorkOrderPriorityStatistic);
  }

  async getStatusStatistics(): Promise<WorkOrderStatusStatistic[]> {
    return this.fetchList(`${WORK_ORDERS_BASE}/get-work-order-status-statistics`, parseWorkOrderStatusStatistic);
  }

  async getTypeStatistics(): Promise<WorkOrderTypeStatistic[]> {
    return this.fetchList(`${WORK_ORDERS_BASE}/get-work-order-type-statistics`, parseWorkOrderTypeStatistic);
  }

  async getKeyStatistics(): Promise<WorkOrdersKeyStatistic[]> {
    return this.fetchList(`${WORK_ORDERS_BASE}/get-work-orders-statistics-key`, parseWorkOrdersKeyStatistic);
  }
}
