import {
  FaCheckCircle,   // Pagados → cobro exitoso
  FaClock,         // Pendientes → en espera de pago
  FaExclamationTriangle, // En Mora → alerta de vencimiento
  FaLayerGroup     // Todos → vista global
} from 'react-icons/fa';
import type { JSX } from 'react';

export type AuditAccountingType =
  | 'Pagados (Recaudados)'
  | 'Pendientes (Cartera Corriente)'
  | 'En Mora (Cartera Vencida)'
  | 'Todos (Pagados y Pendientes)';

export type AuditAccountingSubTab = AuditAccountingType;

// OCP: agregar un nuevo tipo = agregar una entrada aquí.
export interface AuditAccountingSubTabConfig {
  cssClass: string;   // slug CSS estable — no derivado del label
  shortLabel: string; // texto del botón pill
}

export const AUDIT_ACCOUNTING_SUB_TAB_CONFIG: Record<
  AuditAccountingSubTab,
  AuditAccountingSubTabConfig
> = {
  'Pagados (Recaudados)': {
    cssClass: 'pagados',
    shortLabel: 'Cobros Efectuados'
  },
  'Pendientes (Cartera Corriente)': {
    cssClass: 'pendientes',
    shortLabel: 'Cartera Activa'
  },
  'En Mora (Cartera Vencida)': {
    cssClass: 'en-mora',
    shortLabel: 'Cartera Vencida'
  },
  'Todos (Pagados y Pendientes)': {
    cssClass: 'todos',
    shortLabel: 'Vista General'
  }
};

/**
 * SRP: Mapa de iconos por sub-tab.
 * Cada icono refleja semánticamente el estado de pago que representa el tab:
 *   ✅ FaCheckCircle  → Pagados: transacción completada y exitosa
 *   🕐 FaClock        → Pendientes: aún dentro del plazo, en espera
 *   ⚠️ FaExclamationTriangle → En Mora: vencido, requiere atención urgente
 *   📋 FaLayerGroup   → Todos: vista consolidada de todos los estados
 */
export const AUDIT_ACCOUNTING_SUB_TAB_ICONS: Record<
  AuditAccountingSubTab,
  JSX.Element
> = {
  'Pagados (Recaudados)':           <FaCheckCircle />,
  'Pendientes (Cartera Corriente)': <FaClock />,
  'En Mora (Cartera Vencida)':      <FaExclamationTriangle />,
  'Todos (Pagados y Pendientes)':   <FaLayerGroup />
};
