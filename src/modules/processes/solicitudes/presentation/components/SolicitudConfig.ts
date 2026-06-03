/**
 * ESTADO_CONFIG — centralized status configuration for ALL BPMN states
 *
 * SRP: single place to add/modify statuses.
 * OCP: pages just import and use; never modify this map.
 */

export const ESTADO_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  border: string;
  cardAccent: string;
  iconBg: string;
  iconColor: string;
}> = {
  // ── Genéricos (legacy) ─────────────────────────────────────
  en_proceso:  { label: 'En Proceso',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',  cardAccent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)',  iconColor: '#f59e0b' },
  aprobada:    { label: 'Aprobada',    color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  rechazada:   { label: 'Rechazada',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  completada:  { label: 'Completada',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', cardAccent: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  pendiente:   { label: 'Pendiente',   color: '#64748b', bg: 'rgba(100,116,139,0.12)',border: 'rgba(100,116,139,0.3)',cardAccent: '#64748b', iconBg: 'rgba(100,116,139,0.12)',iconColor: '#64748b' },

  // ── Estados BPMN reales ─────────────────────────────────────
  DRAFT:                        { label: 'Borrador',                     color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.25)', cardAccent: '#94a3b8', iconBg: 'rgba(148,163,184,0.1)', iconColor: '#94a3b8' },
  DOCS_SUBMITTED:               { label: 'Documentos Enviados',           color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',   cardAccent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
  DOCS_REJECTED:                { label: 'Documentos Rechazados',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',    cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  DOCS_APPROVED:                { label: 'Documentos Aprobados',          color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  FACTURA_INSPECCION_EMITIDA:   { label: 'Factura de Inspección Emitida', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)',   cardAccent: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)', iconColor: '#3b82f6' },
  PAGO_PENDIENTE:               { label: 'Pago en Verificación',          color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',   cardAccent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
  PAGO_CONFIRMADO:              { label: 'Pago Confirmado',               color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  ORDEN_INSPECCION_EMITIDA:     { label: 'Inspección Agendada',           color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)',   cardAccent: '#6366f1', iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366f1' },
  INSPECCION_EN_PROCESO:        { label: 'Inspección en Proceso',         color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)',   cardAccent: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  INFORME_EN_REVISION:          { label: 'Informe en Revisión',           color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)',   cardAccent: '#a855f7', iconBg: 'rgba(168,85,247,0.12)', iconColor: '#a855f7' },
  INFORME_APROBADO:             { label: 'Informe Aprobado',              color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  RECHAZADA_TECNICA:            { label: 'Rechazada (Técnica)',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',    cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  CONTRATO_GENERADO:            { label: 'Contrato Generado',             color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)',   cardAccent: '#ec4899', iconBg: 'rgba(236,72,153,0.12)', iconColor: '#ec4899' },
  CONTRATO_FIRMADO:             { label: 'Contrato Firmado',              color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  OT_INSTALACION_EMITIDA:       { label: 'OT Instalación Emitida',        color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)',   cardAccent: '#f97316', iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316' },
  INSTALACION_EN_PROCESO:       { label: 'Instalación en Proceso',        color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)',   cardAccent: '#f97316', iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316' },
  INSTALACION_COMPLETADA:       { label: 'Instalación Completada',        color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  INSTALACION_FALLIDA:          { label: 'Instalación Fallida',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',    cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
  REGISTRO_CATASTRAL_PENDIENTE: { label: 'Registro Catastral Pendiente',  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',    cardAccent: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)',  iconColor: '#06b6d4' },
  SUMINISTRO_ACTIVO:            { label: 'Suministro Activo ✓',           color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',   cardAccent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  ANULADA:                      { label: 'Anulada',                       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',    cardAccent: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',  iconColor: '#ef4444' },
};

export type EstadoKey = keyof typeof ESTADO_CONFIG;

export const TIPO_ACOMETIDA_LABELS: Record<string, string> = {
  AGUA_POTABLE: 'Agua Potable',
  ALCANTARILLADO: 'Alcantarillado',
  NUEVA_ACOMETIDA: 'Nueva Acometida',
  CAMBIO_TITULAR: 'Cambio Titular',
  SUSPENSION_SERVICIO: 'Suspensión',
  SUSPENSION_SERVICIO_POTABLE: 'Suspensión Potable',
  BENEFICIO_TERCERA_EDAD: 'Tercera Edad',
  BENEFICIO_DISCAPACIDAD: 'Discapacidad'
};

export const TIPO_PERSONA_LABELS: Record<string, string> = {
  NATURAL: 'Persona Natural',
  JURIDICA: 'Persona Jurídica'
};

export const USO_PREDIO_LABELS: Record<string, string> = {
  RESIDENCIAL: 'Residencial',
  COMERCIAL: 'Comercial',
  INDUSTRIAL: 'Industrial',
  MIXTO: 'Mixto'
};

export const getEstadoConfig = (estado: string) =>
  ESTADO_CONFIG[estado] ?? {
    label: estado,
    color: '#64748b',
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.3)',
    cardAccent: '#64748b',
    iconBg: 'rgba(100,116,139,0.12)',
    iconColor: '#64748b'
  };
