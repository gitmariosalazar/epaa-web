export interface ProcessWorkOrderResponse {
  action: string;
  recordId: string;
  workOrderId: string;
  orderCode?: string;
  cadastralKey?: string;
  previousStatus?: string;
  previousStatusName?: string;
  newStatus?: string;
  newStatusName?: string;
  currentStatus?: string;
  currentStatusName?: string;
  createdByUserId: string;
  processedByUserId?: string;
  approved?: boolean;
  comment?: string;
  processedAt: Date;
  metadata?: Record<string, string | number | boolean | null>;
}

// ==========================================
// SUB-INTERFACES PARA ARREGLOS JSONB
// ==========================================

export interface CuadrillaMiembro {
  id_miembro: string; // UUID
  id_empleado: string; // UUID
  nombre_empleado: string;
  rol: string;
  activo: boolean;
  fecha_asignacion: string; // ISO Date String
}

export interface MaterialUtilizado {
  id_detalle: string; // UUID
  id_material: string; // UUID
  nombre_material: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

export interface AdjuntoEvidencia {
  id_adjunto: string; // UUID
  nombre_archivo: string;
  url: string;
  tipo_adjunto: string;
  mime_type: string;
  fecha_carga: string; // ISO Date String
}

export interface ObservacionBitacora {
  id_observacion: string; // UUID
  texto: string;
  fecha: string; // ISO Date String
  autor_id: string; // UUID
}

export interface CostoAdicional {
  id_costo: string; // UUID
  concepto: string;
  cantidad: number;
  costo_unitario: number;
  total: number;
}

// ==========================================
// INTERFAZ PRINCIPAL: DETALLE ORDEN TRABAJO
// ==========================================

export interface DetalleOrdenTrabajo {
  // ── Identificación ──
  id_orden_trabajo: string; // UUID
  codigo_orden: string;
  numero_secuencial: number;
  version: number;
  estado: string;
  estado_label: string;
  origen: string;
  origen_label: string;

  // ── Clasificación ──
  tipo_trabajo: string;
  tipo_trabajo_descripcion: string | null;
  departamento: string;
  prioridad: string;
  sla_horas: number;

  // ── Ubicación (PostGIS y Datos de Dirección) ──
  direccion: string | null;
  ubicacion_detalles: string | null;
  clave_catastral: string | null;
  coordenadas_punto: string | null; // WKT ej: "POINT(-78.123 0.123)"
  coordenadas_trazado: string | null; // WKT ej: "LINESTRING(...)"
  coordenadas_area: string | null; // WKT ej: "POLYGON(...)"
  latitud: number | null;
  longitud: number | null;

  // ── Descripción y Metadata ──
  descripcion: string | null;
  metadata: Record<string, any> | null; // Mapeo para el campo jsonb general

  // ── Métricas de tiempo (Timestamps e Intervalos) ──
  fecha_creacion: string; // ISO Date String
  fecha_asignacion: string | null;
  fecha_inicio_campo: string | null;
  fecha_completada: string | null;
  created_at: string;
  updated_at: string | null;
  dias_en_proceso: number;
  horas_totales_proceso: number;
  horas_hasta_asignacion: number | null;
  horas_ejecucion_campo: number | null;

  // ── SLA ──
  escala_supervisor: boolean;
  motivo_escalamiento: string | null;
  cumple_sla: boolean;
  horas_restantes_sla: number;

  // ── Asignación operativa ──
  tipo_asignacion: 'CUADRILLA' | 'INDIVIDUAL' | 'SIN_ASIGNAR';
  id_cuadrilla: string | null; // UUID
  codigo_cuadrilla: string | null;
  nombre_cuadrilla: string | null;
  inspector_username: string | null;
  inspector_nombre: string | null; // Concatenación de nombres y apellidos
  id_usuario_asignacion: string | null;
  nombre_asignador: string | null;
  id_usuario_completacion: string | null;
  nombre_completador: string | null;
  id_usuario_creador: string;
  creador_username: string;
  creador_nombre: string;

  // ── Cliente vinculado ──
  id_cliente: string | null; // UUID o ID del cliente

  // ── Bloques Agregados (JSON Arrays) ──
  cuadrilla_miembros: CuadrillaMiembro[];
  materiales: MaterialUtilizado[];
  adjuntos: AdjuntoEvidencia[];
  observaciones: ObservacionBitacora[];
  costos_adicionales: CostoAdicional[];

  // ── Resumen de costos numéricos ──
  costo_total_materiales: number;
  costo_total_adicionales: number;
  costo_total_orden: number;

  // ── Checklist / Inspección de cuadrilla ──
  id_inspeccion: string | null; // UUID
  checklist_aprobado: boolean | null;
  observaciones_checklist: string | null;

  // ── Control de Calidad ──
  id_control: string | null; // UUID
  calidad_aprobada: boolean | null;
  comentarios_calidad: string | null;

  // ── Encuesta de Satisfacción ──
  id_encuesta: string | null; // UUID
  calificacion_satisfaccion: number | null;
  comentarios_satisfaccion: string | null;

  // ── Corte de Servicio vinculado ──
  id_corte: string | null; // UUID
  tipo_corte: string | null;
  sector_afectado: string | null;
  corte_fecha_inicio: string | null;
  corte_fecha_fin_estimada: string | null;
  corte_fecha_restablecimiento: string | null;
  corte_notificado: boolean | null;

  // ── Jerarquía (Orden Padre) ──
  id_orden_padre: string | null; // UUID
  codigo_orden_padre: string | null;
}
