import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const DOC_ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  PENDIENTE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  APROBADO: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  VALIDO: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  RECHAZADO: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  INVALIDO: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  CORREGIDO: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' }
};

export type DocEstado = "PENDIENTE" | "APROBADO" | "VALIDO" | "RECHAZADO" | "INVALIDO" | "CORREGIDO";

export interface DocEstadoUIConfig {
  color: string;
  bg: string;
  label: string;
  icon: LucideIcon;
}

export const DOC_ESTADO_CONFIG: Record<DocEstado, DocEstadoUIConfig> = {
  PENDIENTE: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    label: 'Pendiente',
    icon: Clock
  },
  APROBADO: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    label: 'Aprobado',
    icon: CheckCircle
  },
  VALIDO: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    label: 'Aprobado',
    icon: CheckCircle
  },
  RECHAZADO: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    label: 'Rechazado',
    icon: AlertTriangle
  },
  INVALIDO: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    label: 'Rechazado',
    icon: AlertTriangle
  },
  CORREGIDO: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    label: 'Corregido / Resubido',
    icon: Clock
  }
};

/**
 * Returns the color, background, localized label, and icon component
 * for a given document validation state.
 */
export const getDocEstadoUI = (estado: string): DocEstadoUIConfig => {
  const normalized = (estado || 'PENDIENTE').toUpperCase() as DocEstado;
  return DOC_ESTADO_CONFIG[normalized] ?? DOC_ESTADO_CONFIG.PENDIENTE;
};