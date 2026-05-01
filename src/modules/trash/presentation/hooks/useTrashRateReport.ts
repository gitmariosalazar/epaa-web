import type {
  DateRangeParams,
  ParamsTrashRateAudit
} from '../../domain/dto/params/DateRangeParams';
import { useTrashRateReportContext } from '../context/TrashRateReportContext';
import { useCallback, useState } from 'react';
import type {
  CollectorPerformanceKPI,
  DailyCollectorDetail,
  TrashRateAuditRow,
  TrashRateKPI
} from '../../domain/models/trash-rate-report.model';
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
  const [collectorPerformanceKPI, setCollectorPerformanceKPI] = useState<
    CollectorPerformanceKPI[]
  >([]);
  const [dailyCollectorDetail, setDailyCollectorDetail] = useState<
    DailyCollectorDetail[]
  >([]);
  const [trashRateKPI, setTrashRateKPI] = useState<TrashRateKPI[]>([]);

  const [loadingCount, setLoadingCount] = useState(0);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [loadingMissing, setLoadingMissing] = useState(false);

  const loading = loadingCount > 0;
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoadingCount((prev) => prev + 1);
    setError(null);
    try {
      await fn();
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const getTrashRateAuditReport = useCallback(
    async (params: ParamsTrashRateAudit) => {
      setLoadingAudit(true);
      setTrashRateAuditReport([]);
      try {
        const result = await context.getTrashRateAuditReport.execute(params);
        setTrashRateAuditReport(result);
      } catch (err) {
        console.error('Error fetching Audit Report:', err);
        setTrashRateAuditReport([]);
      } finally {
        setLoadingAudit(false);
      }
    },
    [context.getTrashRateAuditReport]
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
      setLoadingMissing(true);
      setMissingValorBills([]);
      try {
        const result = await context.getMissingValorBills.execute(params);
        setMissingValorBills(result);
      } catch (err) {
        console.error('Error fetching Missing Valor Bills:', err);
        setMissingValorBills([]);
      } finally {
        setLoadingMissing(false);
      }
    },
    [context.getMissingValorBills]
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

  const getCollectorPerformanceKPI = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getCollectorPerformanceKPI.execute(params);
        setCollectorPerformanceKPI(result);
      });
    },
    [context.getCollectorPerformanceKPI, withLoading]
  );

  const getDailyCollectorDetail = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getDailyCollectorDetail.execute(params);
        setDailyCollectorDetail(result);
      });
    },
    [context.getDailyCollectorDetail, withLoading]
  );

  const getTrashRateKPI = useCallback(
    async (params: DateRangeParams) => {
      await withLoading(async () => {
        const result = await context.getTrashRateKPI.execute(params);
        setTrashRateKPI(result);
      });
    },
    [context.getTrashRateKPI, withLoading]
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
    collectorPerformanceKPI,
    dailyCollectorDetail,
    trashRateKPI,
    //Methods Actions
    getTrashRateAuditReport,
    getMonthlySummaryReport,
    getMissingValorBills,
    getActiveCreditNotes,
    getClientDetailSearch,
    getTopDebtorReport,
    getDashboardKPITrashRate,
    getCollectorPerformanceKPI,
    getDailyCollectorDetail,
    getTrashRateKPI,
    //State
    loading,
    loadingAudit,
    loadingMissing,
    error,
    clearError
  };
};
