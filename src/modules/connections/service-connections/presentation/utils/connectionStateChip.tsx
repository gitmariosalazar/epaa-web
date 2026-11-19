import React from 'react';
import {
  Check,
  X,
  Clock,
  Scissors,
  AlertTriangle,
  Wrench,
  Search,
  RotateCcw,
  Ban,
  FileX,
  Archive,
  Zap
} from 'lucide-react';
import {
  ACTIVE_STATES,
  READABLE_RESTRICTED_STATES,
  CLOSED_STATES,
  ConnectionState
} from '../../domain/models/ConnectionState';

/**
 * Visual configuration for rendering a connection-state chip.
 * SRP: this type owns only presentation data, nothing else.
 */
export interface ConnectionStateChipConfig {
  /** Human-readable label (Spanish) */
  label: string;
  /** Hex color for the chip */
  color: string;
  /** Lucide icon element */
  icon: React.ReactElement;
  /**
   * Semantic category used for additional UI decisions
   * (e.g., showing a "blocked" warning card on reading pages).
   */
  category: 'active' | 'restricted' | 'closed';
}

/**
 * Maps a `connectionStatus` string (from cat_estados_acometida.nombre) to its
 * chip visual config.
 *
 * OCP: add a new case at the bottom without modifying existing ones.
 * SRP: this is the single source of truth for status → presentation mapping.
 */
export function getConnectionStateChip(
  status: string | undefined | null
): ConnectionStateChipConfig {
  switch (status) {
    // ── Fully operational ────────────────────────────────────────────────────
    case ConnectionState.ACTIVA:
      return {
        label: 'Activa',
        color: '#22c55e',
        icon: React.createElement(Check, { size: 14 }),
        category: 'active'
      };

    // ── Restricted / readable with caveats ───────────────────────────────────
    case ConnectionState.SUSPENDIDA_VOLUNTARIA:
      return {
        label: 'Susp. voluntaria',
        color: '#f59e0b',
        icon: React.createElement(Clock, { size: 14 }),
        category: 'restricted'
      };

    case ConnectionState.CORTADA_POR_MORA:
      return {
        label: 'Cortada por mora',
        color: '#f97316',
        icon: React.createElement(Scissors, { size: 14 }),
        category: 'restricted'
      };

    case ConnectionState.IRREGULAR_FRAUDE:
      return {
        label: 'Irregular / fraude',
        color: '#dc2626',
        icon: React.createElement(AlertTriangle, { size: 14 }),
        category: 'restricted'
      };

    case ConnectionState.DAÑO_TECNICO:
      return {
        label: 'Daño técnico',
        color: '#7c3aed',
        icon: React.createElement(Zap, { size: 14 }),
        category: 'restricted'
      };

    case ConnectionState.PAGO_PENDIENTE_RECONEXION:
      return {
        label: 'Pago pend. reconex.',
        color: '#0ea5e9',
        icon: React.createElement(RotateCcw, { size: 14 }),
        category: 'restricted'
      };

    case ConnectionState.EN_REPARACION:
      return {
        label: 'En reparación',
        color: '#64748b',
        icon: React.createElement(Wrench, { size: 14 }),
        category: 'restricted'
      };

    // ── Closed / non-readable ────────────────────────────────────────────────
    case ConnectionState.NUEVA_PENDIENTE:
      return {
        label: 'Nueva pendiente',
        color: '#6366f1',
        icon: React.createElement(Clock, { size: 14 }),
        category: 'closed'
      };

    case ConnectionState.CLAUSURADA:
      return {
        label: 'Clausurada',
        color: '#ef4444',
        icon: React.createElement(Ban, { size: 14 }),
        category: 'closed'
      };

    case ConnectionState.ANULADA_SOLICITUD:
      return {
        label: 'Anulada solicitud',
        color: '#ef4444',
        icon: React.createElement(FileX, { size: 14 }),
        category: 'closed'
      };

    case ConnectionState.BAJA_ADMINISTRATIVA:
      return {
        label: 'Baja administrativa',
        color: '#94a3b8',
        icon: React.createElement(Archive, { size: 14 }),
        category: 'closed'
      };

    case ConnectionState.EN_REVISION_CATASTRAL:
      return {
        label: 'En rev. catastral',
        color: '#d97706',
        icon: React.createElement(Search, { size: 14 }),
        category: 'closed'
      };

    // ── Unknown / fallback ───────────────────────────────────────────────────
    default:
      return {
        label: status ?? 'Desconocido',
        color: '#94a3b8',
        icon: React.createElement(X, { size: 14 }),
        category: 'closed'
      };
  }
}

/**
 * Convenience: returns true for states that belong to the active group.
 * Kept here so call-sites don't need to import the domain sets directly.
 */
export const isActiveState = (status: string): boolean =>
  ACTIVE_STATES.has(status);

export const isRestrictedState = (status: string): boolean =>
  READABLE_RESTRICTED_STATES.has(status);

export const isClosedState = (status: string): boolean =>
  CLOSED_STATES.has(status);
