import { useState, useCallback } from 'react';
import { usePaymentsContext } from '../context/PaymentsContext';
import type { Payment } from '../../domain/models/Payment';
import type { PaymentReading } from '../../domain/models/PaymentReading';

export const usePayments = () => {
  const context = usePaymentsContext();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentReadings, setPaymentReadings] = useState<PaymentReading[]>([]);
  const [paymentsByRange, setPaymentsByRange] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    payments,
    paymentReadings,
    paymentsByRange,
    isLoading,
    error,
    fetchPayments,
    fetchPaymentReadings,
    fetchPaymentsByDateRange,
    setPayments,
    setPaymentReadings,
    setPaymentsByRange
  };
};
