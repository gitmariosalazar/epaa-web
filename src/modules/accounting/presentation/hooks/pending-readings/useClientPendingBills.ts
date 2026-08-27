import { useState, useCallback, useMemo, useEffect } from 'react';
import { usePaymentsContext } from '../../context/payments/PaymentsContext';
import type { PendingReading } from '../../../domain/models/PendingReading';
import { useAuth } from '@/shared/presentation/context/AuthContext';

export interface ClientPendingBillGroup {
  cadastralKey: string;
  address: string;
  rate: string;
  clientName: string;
  clientId: string;
  bills: PendingReading[];
  totalGeneral: number;
  totalEpaa: number;
  totalTrash: number;
  totalImprovements: number; // For future use/mocked for now
  totalToPay: number;
}

export const useClientPendingBills = () => {
  const { findPendingReadingsByCadastralKeyOrCardId } = usePaymentsContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);

  const fetchPendingBills = useCallback(
    async (clientId?: string) => {
      const searchId = clientId || user?.cardId;
      if (!searchId) return;
      setIsLoading(true);
      setError(null);
      try {
        const results = await findPendingReadingsByCadastralKeyOrCardId.execute(searchId);
        setPendingReadings(results);
      } catch (err: any) {
        setError(err.message || 'Error fetching pending bills');
        setPendingReadings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [findPendingReadingsByCadastralKeyOrCardId, user?.cardId]
  );

  // Auto fetch on mount or if user changes
  useEffect(() => {
    if (user?.cardId && pendingReadings.length === 0 && !isLoading) {
      fetchPendingBills();
    }
  }, [user?.cardId]);

  const groupedBills = useMemo(() => {
    const groups = new Map<string, ClientPendingBillGroup>();

    pendingReadings.forEach((bill) => {
      const key = bill.cadastralKey || 'NO_KEY';
      if (!groups.has(key)) {
        groups.set(key, {
          cadastralKey: bill.cadastralKey,
          address: bill.address || 'Sin dirección',
          rate: bill.rate || 'RESIDENCIAL', // fallback if empty
          clientName: `${bill.name || ''} ${bill.lastName || ''}`.trim(),
          clientId: bill.cardId,
          bills: [],
          totalGeneral: 0,
          totalEpaa: 0,
          totalTrash: 0,
          totalImprovements: 0,
          totalToPay: 0,
        });
      }

      const group = groups.get(key)!;
      group.bills.push(bill);

      // Calculations based on the domain model
      const totalGeneral = Number(bill.total) || 0; // The total without discounts (or total due)
      const totalEpaa = Number(bill.totalEpaaValue) || 0;
      const totalTrash = Number(bill.totalTrashRate) || 0;
      const totalImprovements = 0; // Hardcoded to 0 for now as per plan
      const totalToPay = Number(bill.adjustedTotal) || 0;

      group.totalGeneral += totalGeneral;
      group.totalEpaa += totalEpaa;
      group.totalTrash += totalTrash;
      group.totalImprovements += totalImprovements;
      group.totalToPay += totalToPay;
    });

    return Array.from(groups.values());
  }, [pendingReadings]);

  return {
    isLoading,
    error,
    groupedBills,
    fetchPendingBills,
  };
};
