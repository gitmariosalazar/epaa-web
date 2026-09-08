import { useMemo } from 'react';
import { type ClientHistoryInvoiceGroup } from './useClientHistoryInvoices';

export interface HistoryConnectionSummary {
  cadastralKey: string;
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number;
  totalPaid: number;
  invoiceCount: number;
  totalConsumption: number;
  averageConsumption: number;
}

export interface HistoryGlobalSummary {
  totalConnections: number;
  totalInvoices: number;
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number;
  totalPaid: number;
  totalConsumption: number;
  averageConsumption: number;
}

export interface HistoryInvoicesSummary {
  connectionSummaries: HistoryConnectionSummary[];
  globalSummary: HistoryGlobalSummary;
}

function computeConnectionSummary(group: ClientHistoryInvoiceGroup): HistoryConnectionSummary {
  const totalConsumption = group.invoices.reduce(
    (sum, inv) => sum + (Number(inv.consumption) || 0),
    0,
  );

  return {
    cadastralKey: group.cadastralKey,
    totalGeneral: group.totalGeneral,
    totalEpaa: group.totalEpaa,
    totalTrash: group.totalTrash,
    totalImprovements: group.totalImprovements,
    totalPaid: group.totalPaid,
    invoiceCount: group.invoices.length,
    totalConsumption,
    averageConsumption: group.invoices.length > 0 ? totalConsumption / group.invoices.length : 0,
  };
}

function computeGlobalSummary(connections: HistoryConnectionSummary[]): HistoryGlobalSummary {
  const totalInvoices = connections.reduce((sum, c) => sum + c.invoiceCount, 0);
  const totalConsumption = connections.reduce((sum, c) => sum + c.totalConsumption, 0);

  return {
    totalConnections: connections.length,
    totalInvoices,
    totalGeneral: connections.reduce((sum, c) => sum + c.totalGeneral, 0),
    totalEpaa: connections.reduce((sum, c) => sum + c.totalEpaa, 0),
    totalTrash: connections.reduce((sum, c) => sum + c.totalTrash, 0),
    totalImprovements: connections.reduce((sum, c) => sum + c.totalImprovements, 0),
    totalPaid: connections.reduce((sum, c) => sum + c.totalPaid, 0),
    totalConsumption,
    averageConsumption: connections.length > 0 ? totalConsumption / connections.length : 0,
  };
}

export function useHistoryInvoicesSummary(groups: ClientHistoryInvoiceGroup[]): HistoryInvoicesSummary {
  return useMemo(() => {
    const connectionSummaries = groups.map(computeConnectionSummary);
    const globalSummary = computeGlobalSummary(connectionSummaries);
    return { connectionSummaries, globalSummary };
  }, [groups]);
}
