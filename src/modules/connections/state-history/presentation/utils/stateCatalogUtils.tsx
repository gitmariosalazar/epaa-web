import React from 'react';
import {
  CheckCircle2,
  Clock,
  PauseCircle,
  Scissors,
  Lock,
  Ban,
  FileX,
  AlertTriangle,
  Wrench,
  DollarSign,
  Hammer,
  Search,
  Pause,
  Slash,
  Archive,
  HelpCircle
} from 'lucide-react';
import { ColorChip, type ColorChipProps } from '@/shared/presentation/components/chip/ColorChip';
import { ConnectionStateEnum } from '../../domain/models/StateCatalog';

export interface StateMetadata {
  id: number;
  code: string;
  label: string;
  badgeStatus: NonNullable<ColorChipProps['status']>;
  color: string;
  icon: React.ReactNode;
  description: string;
  allowsBilling: boolean;
  allowsReading: boolean;
  requiresInspection: boolean;
}

export const STATE_CATALOG_REGISTRY: Record<number, StateMetadata> = {
  [ConnectionStateEnum.ACTIVE]: {
    id: 1,
    code: 'ACTIVA',
    label: 'Activa',
    badgeStatus: 'success',
    color: 'var(--success, #10b981)',
    icon: <CheckCircle2 size={14} />,
    description: 'Servicio habilitado y facturación normal activa.',
    allowsBilling: true,
    allowsReading: true,
    requiresInspection: false
  },
  [ConnectionStateEnum.NEW_PENDING]: {
    id: 2,
    code: 'NUEVA_PENDIENTE',
    label: 'Nueva Pendiente',
    badgeStatus: 'info',
    color: '#0284c7',
    icon: <Clock size={14} />,
    description: 'Conexión registrada pendiente de inspección o activación.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  },
  [ConnectionStateEnum.VOLUNTARY_SUSPENDED]: {
    id: 3,
    code: 'SUSPENSION_VOLUNTARIA',
    label: 'Suspensión Voluntaria',
    badgeStatus: 'warning',
    color: '#f59e0b',
    icon: <PauseCircle size={14} />,
    description: 'Servicio suspendido a petición expresa del titular.',
    allowsBilling: false,
    allowsReading: true,
    requiresInspection: false
  },
  [ConnectionStateEnum.CUT_FOR_ARREARS]: {
    id: 4,
    code: 'CORTADA_POR_MORA',
    label: 'Cortada por Mora',
    badgeStatus: 'error',
    color: '#ef4444',
    icon: <Scissors size={14} />,
    description: 'Corte coercitivo por acumulación de planillas vencidas.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.CLOSED]: {
    id: 5,
    code: 'CLAUSURADA',
    label: 'Clausurada',
    badgeStatus: 'error',
    color: '#b91c1c',
    icon: <Lock size={14} />,
    description: 'Clausura legal o técnica definitiva por reincidencia o fraude.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  },
  [ConnectionStateEnum.CANCELLED_REQUEST]: {
    id: 6,
    code: 'SOLICITUD_ANULADA',
    label: 'Solicitud Anulada',
    badgeStatus: 'secondary',
    color: '#6b7280',
    icon: <Ban size={14} />,
    description: 'Trámite de instalación cancelado antes de ejecución física.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.ADMINISTRATIVE_DISCHARGE]: {
    id: 7,
    code: 'BAJA_ADMINISTRATIVA',
    label: 'Baja Administrativa',
    badgeStatus: 'secondary',
    color: '#7c3aed',
    icon: <FileX size={14} />,
    description: 'Baja formal ordenada por resolución administrativa o jurídica.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.IRREGULAR_FRAUD]: {
    id: 8,
    code: 'CLANDESTINA_FRAUDULENTA',
    label: 'Clandestina / Fraude',
    badgeStatus: 'error',
    color: '#dc2626',
    icon: <AlertTriangle size={14} />,
    description: 'Acometida no autorizada o alteración física detectada en campo.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  },
  [ConnectionStateEnum.TECHNICAL_DAMAGE]: {
    id: 9,
    code: 'DANO_TECNICO',
    label: 'Daño Técnico',
    badgeStatus: 'warning',
    color: '#ea580c',
    icon: <Wrench size={14} />,
    description: 'Avería física en tubería, medidor o collarín que interrumpe el flujo.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  },
  [ConnectionStateEnum.PAYMENT_PENDING_RECONNECTION]: {
    id: 10,
    code: 'PENDIENTE_PAGO_RECONEXION',
    label: 'Pendiente Reconexión',
    badgeStatus: 'info',
    color: '#0891b2',
    icon: <DollarSign size={14} />,
    description: 'Pago pendiente para ordenar la cuadrilla de reconexión.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.UNDER_REPAIR]: {
    id: 11,
    code: 'EN_REPARACION',
    label: 'En Reparación',
    badgeStatus: 'warning',
    color: '#d97706',
    icon: <Hammer size={14} />,
    description: 'Cuadrilla técnica en sitio ejecutando reparación o reemplazo.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  },
  [ConnectionStateEnum.UNDER_CADASTRAL_REVIEW]: {
    id: 12,
    code: 'EN_REVISION_CATASTRAL',
    label: 'En Revisión Catastral',
    badgeStatus: 'accent',
    color: '#6366f1',
    icon: <Search size={14} />,
    description: 'Verificación catastral de predio, titular o coordenadas.',
    allowsBilling: true,
    allowsReading: true,
    requiresInspection: true
  },
  [ConnectionStateEnum.SUSPENDED_GENERAL]: {
    id: 13,
    code: 'SUSPENDIDA_TEMPORAL',
    label: 'Suspendida Temporal',
    badgeStatus: 'warning',
    color: '#f97316',
    icon: <Pause size={14} />,
    description: 'Suspensión operativa temporal por mantenimiento o contingencia.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.INACTIVE]: {
    id: 14,
    code: 'INACTIVA',
    label: 'Inactiva',
    badgeStatus: 'secondary',
    color: '#475569',
    icon: <Slash size={14} />,
    description: 'Servicio inactivo prolongado sin demanda ni facturación.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  },
  [ConnectionStateEnum.REMOVED]: {
    id: 15,
    code: 'LEVANTADA_RETIRADA',
    label: 'Levantada / Retirada',
    badgeStatus: 'secondary',
    color: '#334155',
    icon: <Archive size={14} />,
    description: 'Medidor y elementos de conexión retirados permanentemente.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: true
  }
};

/**
 * Normaliza y busca los metadatos de un estado por su ID o por su código.
 */
export function getStateMeta(stateIdOrCode: number | string | null | undefined, fallbackName?: string | null): StateMetadata {
  if (stateIdOrCode !== null && stateIdOrCode !== undefined) {
    const numericId = Number(stateIdOrCode);
    if (!isNaN(numericId) && STATE_CATALOG_REGISTRY[numericId]) {
      return STATE_CATALOG_REGISTRY[numericId];
    }

    if (typeof stateIdOrCode === 'string') {
      const normalized = stateIdOrCode.toUpperCase().trim();
      const found = Object.values(STATE_CATALOG_REGISTRY).find(
        (m) => m.code === normalized || m.label.toUpperCase() === normalized
      );
      if (found) return found;
    }
  }

  if (fallbackName) {
    const normalized = fallbackName.toUpperCase().trim();
    const found = Object.values(STATE_CATALOG_REGISTRY).find(
      (m) => m.code === normalized || m.label.toUpperCase() === normalized
    );
    if (found) return found;
  }

  // Fallback genérico para estados desconocidos o sin asignar
  return {
    id: 0,
    code: fallbackName || 'DESCONOCIDO',
    label: fallbackName || 'No especificado',
    badgeStatus: 'secondary',
    color: '#94a3b8',
    icon: <HelpCircle size={14} />,
    description: 'Estado de acometida no catalogado en el sistema.',
    allowsBilling: false,
    allowsReading: false,
    requiresInspection: false
  };
}

/**
 * Renderiza un ColorChip consistente para cualquier estado.
 */
export function renderStateChip(
  stateIdOrCode: number | string | null | undefined,
  fallbackName?: string | null,
  size: 'xs' | 'sm' | 'md' = 'sm'
): React.ReactElement {
  const meta = getStateMeta(stateIdOrCode, fallbackName);
  return (
    <ColorChip
      label={meta.label}
      status={meta.badgeStatus}
      size={size}
      variant="soft"
      icon={meta.icon}
      iconPosition="left"
      withDot
    />
  );
}

/**
 * Traduce y formatea el canal de origen del evento.
 */
export function formatOriginChannel(origin?: string | null): { label: string; badgeColor: string } {
  switch (origin?.toUpperCase()) {
    case 'WEB':
      return { label: 'Web Portal', badgeColor: '#3b82f6' };
    case 'APP_MOVIL':
      return { label: 'App Móvil Cuadrilla', badgeColor: '#10b981' };
    case 'CUADRILLA':
      return { label: 'Cuadrilla Campo', badgeColor: '#f59e0b' };
    case 'SISTEMA':
      return { label: 'Sistema Automático', badgeColor: '#8b5cf6' };
    case 'INTEGRACION':
      return { label: 'Integración Externa', badgeColor: '#06b6d4' };
    case 'MIGRACION':
      return { label: 'Migración Histórica', badgeColor: '#64748b' };
    default:
      return { label: origin || 'SISTEMA', badgeColor: '#64748b' };
  }
}

/**
 * Formateo amigable de fechas ISO a formato Ecuador con hora legible.
 */
export function formatStateHistoryDate(dateStr?: string | Date | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(dateStr);
  }
}
