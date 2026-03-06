import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import { useTrashRateReportContext } from '../context/TrashRateReportContext';
import { useCallback, useState } from 'react';
import type { TrashRateAuditRow } from '../../domain/models/trash-rate-report.model';
import type { MonthlySummaryRow } from '../../domain/models/trash-rate-report.model';
import type { MissingValorRow } from '../../domain/models/trash-rate-report.model';
import type { CreditNoteRow } from '../../domain/models/trash-rate-report.model';
import type { ClientTrashDetailRow } from '../../domain/models/trash-rate-report.model';
import type { TopDebtorRow } from '../../domain/models/trash-rate-report.model';
import type { TrashDashboardKpi } from '../../domain/models/trash-rate-report.model';

export const useTrashRateReport = () => {
  const context = useTrashRateReportContext();

  const [trashRateAuditReport, setTrashRateAuditReport] = useState<
    TrashRateAuditRow[]
  >([]);
  const [monthlySummaryReport, setMonthlySummaryReport] = useState<
    MonthlySummaryRow[]
  >([]);
  const [missingValorBills, setMissingValorBills] = useState<MissingValorRow[]>(
    []
  );
  const [activeCreditNotes, setActiveCreditNotes] = useState<CreditNoteRow[]>(
    []
  );
  const [clientDetailSearch, setClientDetailSearch] = useState<
    ClientTrashDetailRow[]
  >([]);
  const [topDebtorReport, setTopDebtorReport] = useState<TopDebtorRow[]>([]);
  const [dashboardKPITrashRate, setDashboardKPITrashRate] = useState<
    TrashDashboardKpi[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrashRateAuditReport = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getTrashRateAuditReport.execute(params);
        setTrashRateAuditReport(result);
      });
    },
    [context.getTrashRateAuditReport, withLoading]
  );

  const getMonthlySummaryReport = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getMonthlySummaryReport.execute(params);
        setMonthlySummaryReport(result);
      });
    },
    [context.getMonthlySummaryReport, withLoading]
  );

  const getMissingValorBills = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getMissingValorBills.execute(params);
        setMissingValorBills(result);
      });
    },
    [context.getMissingValorBills, withLoading]
  );

  const getActiveCreditNotes = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getActiveCreditNotes.execute(params);
        setActiveCreditNotes(result);
      });
    },
    [context.getActiveCreditNotes, withLoading]
  );

  const getClientDetailSearch = useCallback(
    async (searchParams: string) => {
      await withLoading(async () => {
        const result =
          await context.getClientDetailSearch.execute(searchParams);
        setClientDetailSearch(result);
      });
    },
    [context.getClientDetailSearch, withLoading]
  );

  const getTopDebtorReport = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getTopDebtorReport.execute(params);
        setTopDebtorReport(result);
      });
    },
    [context.getTopDebtorReport, withLoading]
  );

  const getDashboardKPITrashRate = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getDashboardKPITrashRate.execute(params);
        setDashboardKPITrashRate(result);
      });
    },
    [context.getDashboardKPITrashRate, withLoading]
  );

  return {
    //Data
    trashRateAuditReport,
    monthlySummaryReport,
    missingValorBills,
    activeCreditNotes,
    clientDetailSearch,
    topDebtorReport,
    dashboardKPITrashRate,
    //Methods Actions
    getTrashRateAuditReport,
    getMonthlySummaryReport,
    getMissingValorBills,
    getActiveCreditNotes,
    getClientDetailSearch,
    getTopDebtorReport,
    getDashboardKPITrashRate,
    //State
    loading,
    error,
    clearError
  };
};
