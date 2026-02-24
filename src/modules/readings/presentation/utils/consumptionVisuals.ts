/**
 * consumptionVisuals.ts
 *
 * Helper puro de la capa Presentation.
 * Única fuente de verdad para la lógica de colores e iconos de consumo,
 * compartida entre ReadingSummaryCards y ReadingConfirmationModal.
 *
 * Principios aplicados:
 *  SRP  – sólo determina la representación visual del consumo.
 *  DRY  – elimina la duplicación entre los dos componentes.
 *  Pure – sin efectos secundarios, sin estado.
 */

import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ConsumptionVisualLevel = 'neutral' | 'green' | 'orange' | 'red';

export interface ConsumptionVisuals {
  /** Nivel semántico del consumo */
  level: ConsumptionVisualLevel;
  /** Clase CSS para el badge/fondo del valor (ej. cr-consumo-green) */
  badgeClass: string;
  /** Clase CSS para el color del icono (ej. cr-icon-consumo-green) */
  iconClass: string;
  /** Clase CSS para el color del texto (ej. cr-icon-consumo-green) */
  textClass: string;
  /** Clase CSS para el stat-box del modal (ej. cr-stat-warn) */
  statBoxClass: string;
  /** Componente de icono de react-icons/fa */
  Icon: IconType;
  /** Texto de advertencia corto para mostrar bajo el valor (null si normal) */
  warningText: string | null;
}

// ── Umbrales ──────────────────────────────────────────────────────────────────
//
//  Verde  : [60 %, 140 %] del promedio  → consumo normal
//  Naranja: [30 %, 60 %)  ∪ (140 %, 170 %] del promedio  → leve desviación
//  Rojo   : < 30 % o > 170 % del promedio  → consumo anómalo

// ── Función principal ─────────────────────────────────────────────────────────

/**
 * Calcula los estilos visuales según el consumo y el promedio histórico.
 *
 * @param currentConsumption - Consumo del período actual (puede ser null si no se ingresó lectura)
 * @param averageConsumption - Promedio histórico del cliente (puede ser null)
 * @returns ConsumptionVisuals con clases CSS, icono y texto de advertencia
 */
export const calculateConsumptionVisuals = (
  currentConsumption: number | null,
  averageConsumption: number | null
): ConsumptionVisuals => {
  // Sin datos suficientes → neutral
  if (
    currentConsumption === null ||
    averageConsumption === null ||
    averageConsumption === 0
  ) {
    return {
      level: 'neutral',
      badgeClass: 'cr-consumo-neutral',
      iconClass: 'cr-icon-consumo-neutral',
      textClass: 'cr-icon-consumo-neutral',
      statBoxClass: '',
      Icon: FaInfoCircle,
      warningText: null
    };
  }

  const lowerGreen = averageConsumption * 0.6;
  const upperGreen = averageConsumption * 1.4;
  const lowerWarning = averageConsumption * 0.3;
  const upperWarning = averageConsumption * 1.7;

  if (currentConsumption >= lowerGreen && currentConsumption <= upperGreen) {
    return {
      level: 'green',
      badgeClass: 'cr-consumo-green',
      iconClass: 'cr-icon-consumo-green',
      textClass: 'cr-icon-consumo-green',
      statBoxClass: '',
      Icon: FaCheckCircle,
      warningText: null
    };
  }

  if (
    (currentConsumption >= lowerWarning && currentConsumption < lowerGreen) ||
    (currentConsumption > upperGreen && currentConsumption <= upperWarning)
  ) {
    return {
      level: 'orange',
      badgeClass: 'cr-consumo-orange',
      iconClass: 'cr-icon-consumo-orange',
      textClass: 'cr-icon-consumo-orange',
      statBoxClass: 'cr-stat-warn',
      Icon: FaExclamationTriangle,
      warningText: '¡Consumo elevado!'
    };
  }

  // Resto → rojo (muy bajo o muy alto)
  return {
    level: 'red',
    badgeClass: 'cr-consumo-red',
    iconClass: 'cr-icon-consumo-red',
    textClass: 'cr-icon-consumo-red',
    statBoxClass: 'cr-stat-critical',
    Icon: FaTimesCircle,
    warningText: '¡Consumo crítico!'
  };
};
