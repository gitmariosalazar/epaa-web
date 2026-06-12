/**
 * WorkOrderConfig — centralized status / label configuration for Work Orders
 *
 * SRP: single place to add/modify OT statuses, priorities and types.
 * OCP: pages just import and use; never modify this map.
 *
 * Covers every estado_codigo coming from the DB schema work_orders.cat_estado_orden
 */

// ─────────────────────────────────────────────────────────────────────────────
// Estado config — badge color, background and card accent per state code
// ─────────────────────────────────────────────────────────────────────────────
export const ESTADO_ORDEN_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  border: string;
  cardAccent: string;
  iconBg: string;
  iconColor: string;
}> = {
  // ── Ciclo de vida genérico (OTs que no son de acometidas) ────────────────
  NOTIFICADA:        { label: 'Notificada',          color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', cardAccent: '#64748b', iconBg: 'rgba(100,116,139,0.12)', iconColor: '#64748b' },
  PENDIENTE:         { label: 'Pendiente',            color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  cardAccent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)',  iconColor: '#f59e0b' },
  ASIGNADA:          { label: 'Asignada',             color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  cardAccent: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#3b82f6' },
  PREPARACION:       { label: 'En Preparación',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', cardAccent: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  REVISION_RECHAZADA:{ label: 'Revisión Rechazada',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  EN_PROCESO:        { label: 'En Proceso',            color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', cardAccent: '#f97316', iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316' },
  EJECUTADA:         { label: 'Ejecutada',             color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  cardAccent: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)',  iconColor: '#06b6d4' },
  RECHAZADA_TECNICA: { label: 'Rechazada (Técnica)',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  COMPLETADA:        { label: 'Completada ✓',          color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  CANCELADA:         { label: 'Cancelada',             color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', cardAccent: '#64748b', iconBg: 'rgba(100,116,139,0.12)', iconColor: '#64748b' },
  ESCALADA:          { label: 'Escalada',              color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', cardAccent: '#ec4899', iconBg: 'rgba(236,72,153,0.12)', iconColor: '#ec4899' },

  // ── Flujo INSPECCIÓN — acometidas (SRP: exclusivo inspección) ─────────────
  NOTIFICADA_INSPECCION:  { label: 'Notificada — Inspección',  color: '#6366f1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.3)', cardAccent: '#6366f1', iconBg: 'rgba(99,102,241,0.10)', iconColor: '#6366f1' },
  PENDIENTE_INSPECCION:   { label: 'Pendiente Inspección',     color: '#4f46e5', bg: 'rgba(79,70,229,0.12)',  border: 'rgba(79,70,229,0.3)',  cardAccent: '#4f46e5', iconBg: 'rgba(79,70,229,0.12)',  iconColor: '#4f46e5' },
  EN_PROCESO_INSPECCION:  { label: 'Inspección en Proceso',    color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', cardAccent: '#7c3aed', iconBg: 'rgba(124,58,237,0.12)', iconColor: '#7c3aed' },
  INSPECCION_EJECUTADA:   { label: 'Inspección Ejecutada',     color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  cardAccent: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)',  iconColor: '#06b6d4' },
  INSPECCION_COMPLETADA:  { label: 'Inspección Completada ✓',  color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },

  // ── Flujo INSTALACIÓN — acometidas (SRP: exclusivo instalación) ───────────
  NOTIFICADA_INSTALACION: { label: 'Notificada — Instalación', color: '#d97706', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.3)',  cardAccent: '#d97706', iconBg: 'rgba(217,119,6,0.10)',  iconColor: '#d97706' },
  PENDIENTE_INSTALACION:  { label: 'Pendiente Instalación',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', cardAccent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
  EN_PROCESO_INSTALACION: { label: 'Instalación en Proceso',   color: '#f97316', bg: 'rgba(249,115,22,0.14)', border: 'rgba(249,115,22,0.3)', cardAccent: '#f97316', iconBg: 'rgba(249,115,22,0.14)', iconColor: '#f97316' },
  INSTALACION_EJECUTADA:  { label: 'Instalación Ejecutada',    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  cardAccent: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)',  iconColor: '#06b6d4' },
  INSTALACION_COMPLETADA: { label: 'Instalación Completada ✓', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
};

export type EstadoOrdenKey = keyof typeof ESTADO_ORDEN_CONFIG;

export const getEstadoOrdenConfig = (codigo: string) =>
  ESTADO_ORDEN_CONFIG[codigo] ?? {
    label: codigo,
    color: '#64748b',
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.3)',
    cardAccent: '#64748b',
    iconBg: 'rgba(100,116,139,0.12)',
    iconColor: '#64748b',
  };

// ─────────────────────────────────────────────────────────────────────────────
// Barra de progreso: progreso_pct viene calculado desde el backend.
// Este helper agrega un color semafórico para la barra.
// ─────────────────────────────────────────────────────────────────────────────
export const getProgresoColor = (pct: number): string => {
  if (pct < 0) return '#64748b';   // CANCELADA
  if (pct < 30) return '#ef4444';  // rojo
  if (pct < 70) return '#f59e0b';  // amarillo
  return '#10b981';                // verde
};

// ─────────────────────────────────────────────────────────────────────────────
// Prioridad
// ─────────────────────────────────────────────────────────────────────────────
export const PRIORIDAD_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Baja:        { label: 'Baja',        color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  Media:       { label: 'Media',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  Alta:        { label: 'Alta',        color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  Urgente:     { label: 'Urgente',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  Emergencia:  { label: 'Emergencia',  color: '#9333ea', bg: 'rgba(147,51,234,0.12)'  },
};

export const getPrioridadConfig = (nivel: string) =>
  PRIORIDAD_CONFIG[nivel] ?? { label: nivel, color: '#64748b', bg: 'rgba(100,116,139,0.12)' };

// ─────────────────────────────────────────────────────────────────────────────
// Tipo de asignación
// ─────────────────────────────────────────────────────────────────────────────
export const TIPO_ASIGNACION_LABELS: Record<string, string> = {
  TECNICO_INDIVIDUAL:    'Técnico Individual',
  INDIVIDUAL:            'Técnico Individual',
  PENDIENTE_ASIGNACION:  'Sin Asignar',
  SIN_ASIGNAR:           'Sin Asignar',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tipo de orden (solicitud_orden_trabajo.tipo_orden)
// ─────────────────────────────────────────────────────────────────────────────
export const TIPO_ORDEN_LABELS: Record<string, string> = {
  INSPECCION:  'Inspección Técnica',
  INSTALACION: 'Instalación',
  MANTENIMIENTO: 'Mantenimiento',
  REPARACION:  'Reparación',
  EMERGENCIA:  'Emergencia',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tipo de corte de agua
// ─────────────────────────────────────────────────────────────────────────────
export const TIPO_CORTE_LABELS: Record<string, string> = {
  PROGRAMADO: 'Programado',
  EMERGENCIA: 'Emergencia',
};

// ─────────────────────────────────────────────────────────────────────────────
// SLA helpers
// ─────────────────────────────────────────────────────────────────────────────
export const getSlaColor = (cumple: boolean, horasRestantes: number): string => {
  if (!cumple) return '#ef4444';
  if (horasRestantes < 4) return '#f59e0b';
  return '#10b981';
};

export const formatSlaHoras = (horas: number): string => {
  if (horas >= 24) {
    const dias = Math.floor(horas / 24);
    const resto = horas % 24;
    return resto > 0 ? `${dias}d ${resto}h` : `${dias} día${dias > 1 ? 's' : ''}`;
  }
  return `${horas}h`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Máquina de transiciones — espejo exacto de work_orders.fn_validar_transicion_estado
// OCP: agregar un estado nuevo aquí es el único cambio necesario en el frontend.
// ─────────────────────────────────────────────────────────────────────────────
export interface NextEstadoOption {
  estado: string;
  label: string;
  color: string;
}

const TRANSICIONES: Record<string, string[]> = {
  // ── Genérico ───────────────────────────────────────────────────────────────
  NOTIFICADA:              ['PENDIENTE',               'CANCELADA'],
  PENDIENTE:               ['ASIGNADA',                'CANCELADA'],
  ASIGNADA:                ['PREPARACION',             'CANCELADA'],
  PREPARACION:             ['EN_PROCESO', 'REVISION_RECHAZADA', 'CANCELADA'],
  REVISION_RECHAZADA:      ['PREPARACION',             'CANCELADA'],
  EN_PROCESO:              ['EJECUTADA',               'CANCELADA'],
  EJECUTADA:               ['COMPLETADA', 'RECHAZADA_TECNICA',   'CANCELADA'],
  RECHAZADA_TECNICA:       ['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION', 'CANCELADA'],

  // ── Flujo INSPECCION (exclusivo acometidas — SRP) ──────────────────────────
  NOTIFICADA_INSPECCION:   ['PENDIENTE_INSPECCION',    'CANCELADA'],
  PENDIENTE_INSPECCION:    ['EN_PROCESO_INSPECCION',   'CANCELADA'],
  EN_PROCESO_INSPECCION:   ['INSPECCION_EJECUTADA',    'CANCELADA'],
  INSPECCION_EJECUTADA:    ['INSPECCION_COMPLETADA', 'RECHAZADA_TECNICA', 'CANCELADA'],

  // ── Flujo INSTALACION (exclusivo acometidas — SRP) ─────────────────────────
  NOTIFICADA_INSTALACION:  ['PENDIENTE_INSTALACION',   'CANCELADA'],
  PENDIENTE_INSTALACION:   ['EN_PROCESO_INSTALACION',  'CANCELADA'],
  EN_PROCESO_INSTALACION:  ['INSTALACION_EJECUTADA',   'CANCELADA'],
  INSTALACION_EJECUTADA:   ['INSTALACION_COMPLETADA', 'RECHAZADA_TECNICA', 'CANCELADA'],

  // ── Terminales (sin transición posible) ───────────────────────────────────
  COMPLETADA:              [],
  CANCELADA:               [],
  INSPECCION_COMPLETADA:   [],
  INSTALACION_COMPLETADA:  [],
};

/**
 * Devuelve los estados a los que puede pasar una OT desde su estado actual.
 * Retorna [] si ya está en un estado terminal.
 */
export const getNextEstados = (estadoActual: string): NextEstadoOption[] =>
  (TRANSICIONES[estadoActual] ?? []).map((estado) => ({
    estado,
    label:  getEstadoOrdenConfig(estado).label,
    color:  getEstadoOrdenConfig(estado).color,
  }));
