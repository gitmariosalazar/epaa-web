import { useMemo } from 'react';
import { type ClientPendingBillGroup } from './useClientPendingBills';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';

// ── Domain types ─────────────────────────────────────────────────────────────

/** Totales calculados para una sola acometida (clave catastral). */
export interface ConnectionSummary {
  cadastralKey: string;
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number;
  totalToPay: number;
  billCount: number;
  totalConsumption: number;
  averageConsumption: number;
}

/** Totales globales que agregan todas las acometidas. */
export interface GlobalSummary {
  totalConnections: number;
  totalBills: number;
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number;
  totalToPay: number;
  totalConsumption: number;
  averageConsumption: number;
}

export interface PendingBillsSummary {
  connectionSummaries: ConnectionSummary[];
  globalSummary: GlobalSummary;
}

// ── Helper (puro, sin efectos secundarios) ───────────────────────────────────

function computeConnectionSummary(group: ClientPendingBillGroup): ConnectionSummary {
  const totalConsumption = group.bills.reduce(
    (sum, bill) => sum + (Number(bill.consumption) || 0),
    0,
  );

  return {
    cadastralKey: group.cadastralKey,
    totalGeneral: group.totalGeneral,
    totalEpaa: group.totalEpaa,
    totalTrash: group.totalTrash,
    totalImprovements: group.totalImprovements,
    totalToPay: group.totalToPay,
    billCount: group.bills.length,
    totalConsumption,
    averageConsumption: group.bills.length > 0 ? totalConsumption / group.bills.length : 0,
  };
}

function computeGlobalSummary(connections: ConnectionSummary[]): GlobalSummary {
  const totalBills = connections.reduce((sum, c) => sum + c.billCount, 0);
  const totalConsumption = connections.reduce((sum, c) => sum + c.totalConsumption, 0);

  return {
    totalConnections: connections.length,
    totalBills,
    totalGeneral: connections.reduce((sum, c) => sum + c.totalGeneral, 0),
    totalEpaa: connections.reduce((sum, c) => sum + c.totalEpaa, 0),
    totalTrash: connections.reduce((sum, c) => sum + c.totalTrash, 0),
    totalImprovements: connections.reduce((sum, c) => sum + c.totalImprovements, 0),
    totalToPay: connections.reduce((sum, c) => sum + c.totalToPay, 0),
    totalConsumption,
    averageConsumption: connections.length > 0 ? totalConsumption / connections.length : 0,
  };
}

// ── Hook público ──────────────────────────────────────────────────────────────

/**
 * Calcula el resumen de planillas pendientes:
 *  - `connectionSummaries`: totales individuales por acometida.
 *  - `globalSummary`: totales globales de todas las acometidas.
 *
 * Cumple SRP: sólo realiza cálculos, no maneja estado ni efectos.
 */
export function usePendingBillsSummary(groups: ClientPendingBillGroup[]): PendingBillsSummary {
  return useMemo(() => {
    const connectionSummaries = groups.map(computeConnectionSummary);
    const globalSummary = computeGlobalSummary(connectionSummaries);
    return { connectionSummaries, globalSummary };
  }, [groups]);
}

// ── Formatters reutilizables ─────────────────────────────────────────────────

export const formatCurrency = (value: number): string => CurrencyFormatter.format(value);
export const formatConsumption = (value: number): string =>
  `${value.toLocaleString('es-EC', { maximumFractionDigits: 2 })} m³`;
