import { useMemo } from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import {
  calculateConsumptionVisuals,
  type ConsumptionVisuals
} from '../utils/consumptionVisuals';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ReadingConfirmationViewModel {
  /** Lectura anterior que se toma como base para calcular el consumo */
  previousReading: number;
  /** Lectura actual ingresada por el operador */
  currentReading: number;
  /** Consumo mensual calculado = currentReading - previousReading */
  consumption: number;
  /** Promedio histórico del cliente */
  averageConsumption: number;
  /** Visuals unificados (colores, iconos, clases CSS) — mismos que ReadingSummaryCards */
  visuals: ConsumptionVisuals;
  /** true si el consumo supera el umbral verde superior (≥ orange) */
  isHighConsumption: boolean;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Encapsula toda la lógica de cálculo del modal de confirmación de lectura.
 * Reutiliza `calculateConsumptionVisuals` para garantizar la misma paleta
 * de colores e iconos que ReadingSummaryCards (DRY, SRP, DIP).
 */
export const useReadingConfirmationModal = (
  readingInfo: ReadingInfo,
  currentReadingInput: number | ''
): ReadingConfirmationViewModel => {
  return useMemo(() => {
    const previousReading =
      Number(
        readingInfo.currentReading !== null
          ? readingInfo.currentReading
          : readingInfo.previousReading
      ) || 0;

    const currentReading = Number(currentReadingInput) || 0;
    const consumption = currentReading - previousReading;
    const averageConsumption = Number(readingInfo.averageConsumption) || 0;

    // Reutiliza exactamente la misma función que ReadingSummaryCards
    const visuals = calculateConsumptionVisuals(
      currentReadingInput !== '' ? consumption : null,
      averageConsumption || null
    );

    const isHighConsumption =
      visuals.level === 'orange' || visuals.level === 'red';

    return {
      previousReading,
      currentReading,
      consumption,
      averageConsumption,
      visuals,
      isHighConsumption
    };
  }, [readingInfo, currentReadingInput]);
};
