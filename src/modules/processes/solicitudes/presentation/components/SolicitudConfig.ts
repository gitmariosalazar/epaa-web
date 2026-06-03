/**
 * ESTADO_CONFIG — centralized status configuration
 *
 * SRP: single place to add/modify statuses.
 * OCP: pages just import and use; never modify this map.
 */

export const ESTADO_CONFIG = {
  en_proceso: {
    label: 'En Proceso',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    cardAccent: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: '#f59e0b'
  },
  aprobada: {
    label: 'Aprobada',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    cardAccent: '#10b981',
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: '#10b981'
  },
  rechazada: {
    label: 'Rechazada',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    cardAccent: '#ef4444',
    iconBg: 'rgba(239,68,68,0.12)',
    iconColor: '#ef4444'
  },
  completada: {
    label: 'Completada',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.3)',
    cardAccent: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: '#8b5cf6'
  },
  pendiente: {
    label: 'Pendiente',
    color: '#64748b',
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.3)',
    cardAccent: '#64748b',
    iconBg: 'rgba(100,116,139,0.12)',
    iconColor: '#64748b'
  }
} as const;

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
  ESTADO_CONFIG[estado as EstadoKey] ?? {
    label: estado,
    color: '#64748b',
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.3)',
    cardAccent: '#64748b',
    iconBg: 'rgba(100,116,139,0.12)',
    iconColor: '#64748b'
  };
