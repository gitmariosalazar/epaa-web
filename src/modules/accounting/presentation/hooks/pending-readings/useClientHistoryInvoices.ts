import { useState, useCallback, useMemo } from 'react';
import { usePaymentsContext } from '../../context/payments/PaymentsContext';
import type { PendingReading } from '../../../domain/models/PendingReading';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import type { DateRangeParams } from '../../../domain/dto/params/DataEntryParams';
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const subMonths = (date: Date, months: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

export interface ClientHistoryInvoiceGroup {
  cadastralKey: string;
  address: string;
  rate: string;
  clientName: string;
  clientId: string;
  invoices: PendingReading[];
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number;
  totalPaid: number;
}

export const useClientHistoryInvoices = () => {
  const { findHistoryInvoicesByCadastralKeyOrCardId } = usePaymentsContext();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyInvoices, setHistoryInvoices] = useState<PendingReading[]>([]);

  // Default filter dates: Last 6 months (start of month to end of current month)
  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
  defaultEndDate.setDate(0); // Último día del mes actual

  const defaultStartDate = subMonths(defaultEndDate, 6);
  defaultStartDate.setDate(1); // Primer día del mes de inicio

  const [dateRange, setDateRange] = useState<DateRangeParams>({
    startDate: formatDate(defaultStartDate),
    endDate: formatDate(defaultEndDate)
  });

  const fetchHistoryInvoices = useCallback(
    async (clientId?: string, customPeriod?: DateRangeParams) => {
      const searchId = clientId || user?.cardId;
      if (!searchId) return;

      const periodToUse = customPeriod || dateRange;

      setIsLoading(true);
      setError(null);
      try {
        const results = await findHistoryInvoicesByCadastralKeyOrCardId.execute(
          searchId,
          periodToUse
        );
        setHistoryInvoices(results);
      } catch (err: any) {
        setError(err.message || 'Error fetching history invoices');
        setHistoryInvoices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [findHistoryInvoicesByCadastralKeyOrCardId, user?.cardId, dateRange]
  );

  const groupedInvoices = useMemo(() => {
    const groups = new Map<string, ClientHistoryInvoiceGroup>();

    historyInvoices.forEach((invoice) => {
      const key = invoice.cadastralKey || 'NO_KEY';
      if (!groups.has(key)) {
        groups.set(key, {
          cadastralKey: invoice.cadastralKey,
          address: invoice.address || 'Sin dirección',
          rate: invoice.rate || 'RESIDENCIAL',
          clientName: `${invoice.name || ''} ${invoice.lastName || ''}`.trim(),
          clientId: invoice.cardId,
          invoices: [],
          totalGeneral: 0,
          totalEpaa: 0,
          totalTrash: 0,
          totalImprovements: 0,
          totalPaid: 0
        });
      }

      const group = groups.get(key)!;
      group.invoices.push(invoice);

      // Calculations based on the domain model
      const totalGeneral = Number(invoice.total) || 0;
      const totalEpaa = Number(invoice.totalEpaaValue) || 0;
      const totalTrash = Number(invoice.totalTrashRate) || 0;
      const totalImprovements = 0;
      const totalPaid = Number(invoice.adjustedTotal) || 0;

      group.totalGeneral += totalGeneral;
      group.totalEpaa += totalEpaa;
      group.totalTrash += totalTrash;
      group.totalImprovements += totalImprovements;
      group.totalPaid += totalPaid;
    });

    return Array.from(groups.values());
  }, [historyInvoices]);

  return {
    isLoading,
    error,
    groupedInvoices,
    dateRange,
    setDateRange,
    fetchHistoryInvoices
  };
};
