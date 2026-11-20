import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export const notify = {
  success: (msg: string, title: string = 'Éxito') =>
    MessageToastCustom('success', msg, title, { position: 'top-right' }),
  error: (msg: string, title: string = 'Error') =>
    MessageToastCustom('error', msg, title, { position: 'top-right' }),
  warning: (msg: string, title: string = 'Atención') =>
    MessageToastCustom('warning', msg, title, { position: 'top-right' }),
  info: (msg: string, title: string = 'Información') =>
    MessageToastCustom('info', msg, title, { position: 'top-right' })
};

export type RouteAssignmentStatus =
  | 'NO_ASIGNADA'
  | 'SIN_ASIGNAR'
  | 'ASIGNADA'
  | 'EN_PROCESO'
  | 'PAUSADA'
  | 'COMPLETADA'
  | 'REASIGNADA';

export type Color =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'accent';

export interface RouteAssignmentStatusMeta {
  label: string;
  color: Color;       // Token semántico para ColorChip (status={...})
  hex: string;        // Hexadecimal para inline styles, mapas o canvas
  cssVar: string;     // Variable CSS (ej: var(--primary))
}

export const RouteAssignmentStatusOptionsColorMap: Record<
  RouteAssignmentStatus,
  Color
> = {
  NO_ASIGNADA: 'secondary',
  SIN_ASIGNAR: 'secondary',
  ASIGNADA: 'primary',
  EN_PROCESO: 'info',
  PAUSADA: 'warning',
  COMPLETADA: 'success',
  REASIGNADA: 'accent'
};

export const RouteAssignmentStatusCatalog: Record<
  string,
  RouteAssignmentStatusMeta
> = {
  NO_ASIGNADA: {
    label: 'Sin Asignar',
    color: 'secondary',
    hex: '#64748b',
    cssVar: 'var(--secondary, #64748b)'
  },
  SIN_ASIGNAR: {
    label: 'Sin Asignar',
    color: 'secondary',
    hex: '#64748b',
    cssVar: 'var(--secondary, #64748b)'
  },
  ASIGNADA: {
    label: 'Asignada',
    color: 'primary',
    hex: '#2563eb',
    cssVar: 'var(--primary, #2563eb)'
  },
  EN_PROCESO: {
    label: 'En Proceso',
    color: 'info',
    hex: '#0284c7',
    cssVar: 'var(--info, #0284c7)'
  },
  PAUSADA: {
    label: 'Pausada',
    color: 'warning',
    hex: '#f59e0b',
    cssVar: 'var(--warning, #f59e0b)'
  },
  COMPLETADA: {
    label: 'Completada',
    color: 'success',
    hex: '#10b981',
    cssVar: 'var(--success, #10b981)'
  },
  REASIGNADA: {
    label: 'Reasignada',
    color: 'accent',
    hex: '#8b5cf6',
    cssVar: 'var(--accent, #8b5cf6)'
  }
};

/**
 * Normaliza cualquier string de estado de asignación de manera segura y case-insensitive
 */
export function normalizeRouteAssignmentStatus(
  status?: string | null
): RouteAssignmentStatus {
  if (!status) return 'SIN_ASIGNAR';
  const clean = status.trim().toUpperCase().replace(/\s+/g, '_');
  if (clean === 'NO_ASIGNADA' || clean === 'SIN_ASIGNAR' || clean === 'PENDIENTE') {
    return 'SIN_ASIGNAR';
  }
  return clean in RouteAssignmentStatusCatalog
    ? (clean as RouteAssignmentStatus)
    : 'SIN_ASIGNAR';
}

/**
 * Retorna la configuración completa (label, color semántico, hex y cssVar)
 */
export function getRouteAssignmentStatusInfo(
  status?: string | null
): RouteAssignmentStatusMeta {
  const normalized = normalizeRouteAssignmentStatus(status);
  return (
    RouteAssignmentStatusCatalog[normalized] ||
    RouteAssignmentStatusCatalog.SIN_ASIGNAR
  );
}

/**
 * Retorna el token semántico de color ('primary', 'info', 'warning', 'success', 'accent', 'secondary')
 */
export function getRouteAssignmentStatusColor(
  status?: string | null
): Color {
  return getRouteAssignmentStatusInfo(status).color;
}

/**
 * Retorna la etiqueta legible en español ('Sin Asignar', 'En Proceso', 'Asignada', etc.)
 */
export function getRouteAssignmentStatusLabel(
  status?: string | null
): string {
  return getRouteAssignmentStatusInfo(status).label;
}

/**
 * Retorna tanto el color como el label en un solo objeto:
 * const { label, color, hex, cssVar } = getRouteAssignmentStatus(route.estado);
 */
export function getRouteAssignmentStatus(
  status?: string | null
): RouteAssignmentStatusMeta {
  return getRouteAssignmentStatusInfo(status);
}
