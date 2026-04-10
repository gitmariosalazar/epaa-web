import { useState, useCallback } from 'react';
import { usePaymentsContext } from '../../context/payments/PaymentsContext';
import type { Payment } from '../../../domain/models/Payment';
import type { PaymentReading } from '../../../domain/models/PaymentReading';
import type { OverduePayment } from '../../../domain/models/OverdueReading';
import type { PendingReading } from '../../../domain/models/PendingReading';

export const usePayments = () => {
  const context = usePaymentsContext();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentReadings, setPaymentReadings] = useState<PaymentReading[]>([]);
  const [paymentsByRange, setPaymentsByRange] = useState<Payment[]>([]);
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingReadings = useCallback(
    async (searchValue: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result =
          await context.findPendingReadingsByCadastralKeyOrCardId.execute(
            searchValue
          );
        setPendingReadings(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch pending readings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.findPendingReadingsByCadastralKeyOrCardId]
  );

  const fetchPayments = useCallback(
    async (date: string, orderValue: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.findAllPaymentByDateAndOrderValue.execute(
          date,
          orderValue
        );
        setPayments(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch general payments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.findAllPaymentByDateAndOrderValue]
  );

  const fetchPaymentReadings = useCallback(
    async (date: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result =
          await context.findAllPaymentReadingPayrollsByDate.execute(date);
        setPaymentReadings(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payment readings payrolls');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.findAllPaymentReadingPayrollsByDate]
  );

  const fetchPaymentsByDateRange = useCallback(
    async (
      initDate: string,
      endDate: string,
      limit: number,
      offset: number
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.findAllPaymentsByDateRange.execute(
          initDate,
          endDate,
          limit,
          offset
        );
        setPaymentsByRange(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payments by date range');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.findAllPaymentsByDateRange]
  );

  const fetchOverduePayments = useCallback(
    async (limit?: number, offset?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.findAllOverduePayments.execute(
          limit,
          offset
        );
        setOverduePayments(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch overdue payments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.findAllOverduePayments]
  );

  return {
    payments,
    paymentReadings,
    paymentsByRange,
    overduePayments,
    pendingReadings,
    isLoading,
    error,
    fetchPayments,
    fetchPaymentReadings,
    fetchPaymentsByDateRange,
    setPayments,
    setPaymentReadings,
    setPaymentsByRange,
    fetchOverduePayments,
    setOverduePayments,
    fetchPendingReadings,
    setPendingReadings
  };
};
