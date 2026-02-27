import { useState, useCallback } from 'react';
import { useEntryDataContext } from '../context/EntryDataContext';
import { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type {
  DailyGroupedReport,
  DailyCollectorSummary,
  DailyPaymentMethodReport,
  FullBreakdownReport
} from '../../domain/models/EntryData';

// ── Hook (SRP: manages EntryData remote state) ────────────────────────────────
export const useEntryData = () => {
  const context = useEntryDataContext();

  const [dailyGrouped, setDailyGrouped] = useState<DailyGroupedReport[]>([]);
  const [collectorSummary, setCollectorSummary] = useState<
    DailyCollectorSummary[]
  >([]);
  const [paymentMethodReport, setPaymentMethodReport] = useState<
    DailyPaymentMethodReport[]
  >([]);
  const [fullBreakdown, setFullBreakdown] = useState<FullBreakdownReport[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Shared fetch wrapper ────────────────────────────────────────────────────
  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await fn();
    } catch (err: any) {
      setError(err.message || 'Error fetching entry data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch callbacks ─────────────────────────────────────────────────────────
  const fetchDailyGrouped = useCallback(
    (startDate: string, endDate: string) =>
      withLoading(async () => {
        const params = new DateRangeParams(startDate, endDate);
        const result = await context.getDailyGroupedReport.execute(params);
        setDailyGrouped(result || []);
      }),
    [context.getDailyGroupedReport, withLoading]
  );

  const fetchCollectorSummary = useCallback(
    (startDate: string, endDate: string) =>
      withLoading(async () => {
        const params = new DateRangeParams(startDate, endDate);
        const result = await context.getDailyCollectorSummary.execute(params);
        setCollectorSummary(result || []);
      }),
    [context.getDailyCollectorSummary, withLoading]
  );

  const fetchPaymentMethodReport = useCallback(
    (startDate: string, endDate: string) =>
      withLoading(async () => {
        const params = new DateRangeParams(startDate, endDate);
        const result =
          await context.getDailyPaymentMethodReport.execute(params);
        setPaymentMethodReport(result || []);
      }),
    [context.getDailyPaymentMethodReport, withLoading]
  );

  const fetchFullBreakdown = useCallback(
    (startDate: string, endDate: string) =>
      withLoading(async () => {
        const params = new DateRangeParams(startDate, endDate);
        const result = await context.getFullBreakdownReport.execute(params);
        setFullBreakdown(result || []);
      }),
    [context.getFullBreakdownReport, withLoading]
  );

  return {
    // Data
    dailyGrouped,
    collectorSummary,
    paymentMethodReport,
    fullBreakdown,
    // State
    isLoading,
    error,
    // Actions
    fetchDailyGrouped,
    fetchCollectorSummary,
    fetchPaymentMethodReport,
    fetchFullBreakdown
  };
};
