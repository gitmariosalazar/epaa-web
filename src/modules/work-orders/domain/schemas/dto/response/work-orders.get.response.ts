export interface CuadrillaMiembro {
  idMiembro: string; // UUID
  idEmpleado: string; // UUID
  nombreEmpleado: string; // CONCAT nombres y apellidos
  rol: string;
  activo: boolean;
  fechaAsignacion: string; // ISO Timestamp
}

export interface MaterialUtilizado {
  idDetalle: string; // UUID
  idMaterial: string; // UUID
  nombreMaterial: string | null; // ALTER TABLE agregado
  descripcion: string | null; // ALTER TABLE agregado
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface AdjuntoEvidencia {
  idAdjunto: string; // UUID
  nombreArchivo: string;
  url: string;
  tipoAdjunto: string;
  mimeType: string;
  fechaCarga: string; // ISO Timestamp
}

export interface ObservacionBitacora {
  idObservacion: string; // UUID
  texto: string;
  fecha: string; // ISO Timestamp
  autorId: string; // UUID
}

export interface CostoAdicional {
  idCosto: string; // UUID
  concepto: string;
  cantidad: number;
  costoUnitario: number;
  total: number;
}

export interface HitoHistorialTimeline {
  estado: string;
  estadoLabel: string;
  estadoAnterior: string | null;
  fecha: string; // ISO Timestamp
  comentario: string | null;
  usuarioId?: string; // Incluido en la Query 2
}

export interface FotoEvidenciaCliente {
  nombre: string;
  url: string;
  tipo: string;
  fechaCarga: string; // ISO Timestamp
}

export interface OrdenTrabajoDetalle {
  // ── Identificación ──
  idOrdenTrabajo: string; // UUID
  codigoOrden: string;
  numeroSecuencial: number;
  version: number;
  estado: string;
  estadoLabel: string;
  origen: string;
  origenLabel: string;

  // ── Clasificación ──
  tipoTrabajo: string;
  tipoTrabajoDescripcion: string | null;
  departamento: string;
  prioridad: string;
  slaHoras: number;

  // ── Ubicación (PostGIS / Catastral) ──
  direccion: string | null;
  ubicacionDetalles: string | null;
  claveCatastral: string | null;
  coordenadasPunto: string | null; // WKT ej: "POINT(-78.12 0.34)"
  coordenadasTrazado: string | null; // WKT ej: "LINESTRING(...)"
  coordenadasArea: string | null; // WKT ej: "POLYGON(...)"
  latitud: number | null;
  longitud: number | null;

  // ── Descripción y Metadata ──
  descripcion: string | null;
  metadata: Record<string, any> | null; // Campo JSONB nativo

  // ── Métricas de Tiempo ──
  fechaCreacion: string; // ISO Timestamp
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  fechaCompletada: string | null;
  createdAt: string; // ISO Timestamp — NOT NULL en el schema
  updatedAt: string; // ISO Timestamp — NOT NULL en el schema (fn_update_timestamp)
  diasEnProceso: number;
  horasTotalesProceso: number;
  horasHastaAsignacion: number | null;
  horasEjecucionCampo: number | null;

  // ── SLA ──
  escalaSupervisor: boolean;
  motivoEscalamiento: string | null;
  cumpleSla: boolean;
  horasRestantesSla: number;

  // ── Asignación Operativa ──
  tipoAsignacion: 'CUADRILLA' | 'INDIVIDUAL' | 'SIN_ASIGNAR';
  idCuadrilla: string | null; // UUID
  codigoCuadrilla: string | null;
  nombreCuadrilla: string | null;
  inspectorUsername: string | null;
  inspectorNombre: string | null;
  idUsuarioAsignacion: string | null;
  nombreAsignador: string | null;
  idUsuarioCompletacion: string | null;
  nombreCompletador: string | null;
  idUsuarioCreador: string;
  creadorUsername: string;
  creadorNombre: string;

  // ── Cliente Vinculado ──
  idCliente: string | null;

  // ── Bloques Agregados (Arreglos JSONB garantizados por COALESCE) ──
  cuadrillaMiembros: CuadrillaMiembro[];
  materiales: MaterialUtilizado[];
  adjuntos: AdjuntoEvidencia[];
  observaciones: ObservacionBitacora[];
  costosAdicionales: CostoAdicional[];

  // ── Resumen de Costos Numéricos ──
  costoTotalMateriales: number;
  costoTotalAdicionales: number;
  costoTotalOrden: number;

  // ── Checklist / Inspección de Cuadrilla ──
  idInspeccion: string | null; // UUID
  checklistAprobado: boolean | null;
  observacionesChecklist: string | null;

  // ── Control de Calidad ──
  idControl: string | null; // UUID
  calidadAprobada: boolean | null;
  comentariosCalidad: string | null;

  // ── Encuesta de Satisfacción ──
  idEncuesta: string | null; // UUID
  calificacionSatisfaccion: number | null;
  comentariosSatisfaccion: string | null;

  // ── Corte de Servicio Vinculado ──
  idCorte: string | null; // UUID
  tipoCorte: string | null;
  sectorAfectado: string | null;
  corteFechaInicio: string | null;
  corteFechaFinEstimada: string | null;
  corteFechaRestablecido: string | null;
  corteNotificado: boolean | null;

  // ── Orden Padre (Jerarquía) ──
  idOrdenPadre: string | null; // UUID
  codigoOrdenPadre: string | null;
}

export interface OrdenTrabajoTracking {
  // ── Identificación ──
  idOrdenTrabajo: string; // UUID
  codigoOrden: string;
  numeroSecuencial: number;
  origen: string;
  idEntidadOrigen: string | null; // UUID o ID del trámite origen

  // ── Clasificación ──
  tipoTrabajo: string;
  departamento: string;
  prioridad: string;
  slaHoras: number;

  // ── Ubicación ──
  direccion: string | null;
  claveCatastral: string | null;

  // ── Fechas Formateadas y Hitos ──
  fechaCreacionEs: string; // Ej: "06 de junio, 2026"
  estadoCodigo: string;
  estadoActualLabel: string;

  // ── SLA e Indicadores de Proceso ──
  escalaSupervisor: boolean;
  motivoEscalamiento: string | null;
  diasEnProceso: number;
  horasTotalesProceso: number;
  horasHastaAsignacion: number;
  slaVencido: boolean;

  // ── Hitos de Tiempo Crudos ──
  fechaCreacion: string; // ISO Timestamp
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  fechaCompletada: string | null;
  createdAt: string; // ISO Timestamp — NOT NULL en el schema
  updatedAt: string; // ISO Timestamp — NOT NULL en el schema (fn_update_timestamp)

  // ── Último Movimiento (Campos Escalares del Historial) ──
  ultimoMovimiento: string | null; // ISO Timestamp
  ultimoComentario: string | null;
  ultimoEstadoCodigo: string | null;

  // ── Métricas y Conteos Computados ──
  adjuntosTotal: number;
  materialesTotal: number;
  costoTotalMateriales: number;
  costoTotalAdicionales: number;
  observacionesTotal: number;
  rechazosCalidad: number;
  rechazosChecklist: number;

  // ── Asignación ──
  tipoAsignacion: 'CUADRILLA' | 'INDIVIDUAL' | 'SIN_ASIGNAR';
  codigoCuadrilla: string | null;
  nombreCuadrilla: string | null;
  asignadoUsername: string | null;
  asignadoNombre: string | null;

  // ── Calificación ──
  calificacionSatisfaccion: number | null;

  // ── Cliente ──
  idCliente: string | null;

  // ── Timeline Completo (Historial Completo de Cambios de Estado) ──
  historial: HitoHistorialTimeline[] | null;
}

export interface OrdenTrabajoVistaCliente {
  // ── Identificación de la OT ──
  idOrdenTrabajo: string; // UUID — de orden_trabajo
  tipoOrden: string; // De solicitud_orden_trabajo: 'INSPECCION' | 'INSTALACION'
  codigoOrden: string; // Ej: OT-2026-0000001
  numeroSecuencial: number;

  // ── Detalles y Descripciones ──
  tipoTrabajo: string; // De cat trabajo.nombre
  departamentoEjecutor: string;
  descripcion: string; // COALESCE(ot.descripcion, ot.metadata->>'descripcion', '')

  // ── Estado y Progreso en UI ──
  estadoCodigo: string; // Código interno del estado (NOTIFICADA, EN_PROCESO, etc.)
  estadoLabel: string; // Nombre legible del estado
  estadoDescripcion: string | null;
  progresoPct: number; // 0–100 para barra de progreso. -1 = CANCELADA

  // ── SLA y Gestión de Tiempos ──
  prioridad: string;
  slaHoras: number;
  cumpleSla: boolean;
  fechaCreacion: string; // ISO Timestamp
  fechaAsignacion: string | null;
  fechaInicioCampo: string | null;
  fechaCompletada: string | null;
  diasEnProceso: number;
  fechaCreacionEs: string; // Ej: "06 de junio, 2026"

  // ── Ubicación Geográfica ──
  direccionTrabajo: string | null;
  ubicacionDetalles: string | null;
  latitud: number | null; // ST_Y(geom_punto)
  longitud: number | null; // ST_X(geom_punto)

  // ── Datos del Ejecutor Técnico ──
  tipoAsignacion: 'CUADRILLA' | 'TECNICO_INDIVIDUAL' | 'PENDIENTE_ASIGNACION';
  codigoCuadrilla: string | null;
  nombreCuadrilla: string | null;
  tecnicoUsername: string | null;
  tecnicoNombre: string | null;

  // ── Última Actualización del Portal ──
  ultimaActualizacion: string | null; // ISO Timestamp del último historial
  ultimoComentarioTecnico: string | null; // descripcion_cambio del último historial

  // ── Evidencias de Campo ──
  totalFotosEvidencia: number;
  fotosEvidencia: FotoEvidenciaCliente[]; // COALESCE → nunca null, puede ser []

  // ── Validaciones y Filtros Internos de Calidad / Seguridad ──
  checklistAprobado: boolean | null; // inspeccion_cuadrilla.pasa_revision
  trabajoAprobadoCalidad: boolean | null; // control_calidad.trabajo_aprobado
  comentariosCalidad: string | null; // control_calidad.comentarios

  // ── Feedback (Satisfacción del Usuario) ──
  calificacionSatisfaccion: number | null; // 1–5
  comentariosEncuesta: string | null;
  encuestaCompletada: boolean; // TRUE si existe registro en encuesta_satisfaccion

  // ── Afectaciones Vinculadas (Corte de Agua) ──
  tipoCorte: string | null; // 'PROGRAMADO' | 'EMERGENCIA'
  sectorAfectado: string | null;
  corteInicio: string | null; // ISO Timestamp
  corteFinEstimado: string | null; // ISO Timestamp
  fechaRestablecido: string | null; // ISO Timestamp
  corteNotificado: boolean | null;

  // ── Cliente Vinculado ──
  idCliente: string | null; // ot.id_cliente (faltaba en versión anterior)

  // ── Stepper / Timeline Completo para el Portal del Cliente ──
  historialEstados: HitoHistorialTimeline[] | null; // null si aún no hay historial
}
