import { useState, useCallback } from 'react';
import { useGeneralCollectionContext } from '../../context/general-collection/GeneralCollectionContext';
import type {
  GeneralCollectionResponse,
  GeneralDailyGroupedReportResponse,
  GeneralYearlyGroupedReportResponse,
  GeneralMonthlyGroupedReportResponse,
  GeneralKPIResponse,
  GeneralYearlyKPIResponse,
  GeneralMonthlyKPIResponse
} from '../../../domain/models/GenelarCollection';
import type {
  GeneralCollectionsParams,
  GeneralTrendCollectionsParams
} from '../../../domain/dto/params/DataEntryParams';

export const useGeneralCollection = () => {
  const context = useGeneralCollectionContext();

  const [report, setReport] = useState<GeneralCollectionResponse[]>([]);
  const [dailyReport, setDailyReport] = useState<
    GeneralDailyGroupedReportResponse[]
  >([]);
  const [yearlyReport, setYearlyReport] = useState<
    GeneralYearlyGroupedReportResponse[]
  >([]);
  const [monthlyReport, setMonthlyReport] = useState<
    GeneralMonthlyGroupedReportResponse[]
  >([]);

  const [kpi, setKpi] = useState<GeneralKPIResponse | null>(null);
  const [yearlyKpi, setYearlyKpi] = useState<GeneralYearlyKPIResponse[]>([]);
  const [monthlyKpi, setMonthlyKpi] = useState<GeneralMonthlyKPIResponse[]>([]);
  /** Base dataset: auto-fetched last-10-years, never overwritten by manual Consultar */
  const [monthlyKpiBase, setMonthlyKpiBase] = useState<GeneralMonthlyKPIResponse[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isLoadingKPI, setIsLoadingKPI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (params: GeneralCollectionsParams, append = true) => {
      setIsLoadingReport(true);
      setError(null);
      try {
        const result = await context.getGeneralCollectionReport.execute(params);
        setReport((prev) => (append ? [...prev, ...(result || [])] : (result || [])));
        return result;
      } catch (err: any) {
        setError(err.message || 'Failed to fetch general collection report');
        console.error(err);
        return [];
      } finally {
        setIsLoadingReport(false);
      }
    },
    [context.getGeneralCollectionReport]
  );

  const fetchDailyReport = useCallback(
    async (params: GeneralCollectionsParams) => {
      setIsLoadingReport(true);
      setError(null);
      try {
        const result =
          await context.getGeneralDailyCollectionGroupedReport.execute(params);
        setDailyReport(result || []);
      } catch (err: any) {
        setError(
          err.message || 'Failed to fetch daily general collection report'
        );
        console.error(err);
      } finally {
        setIsLoadingReport(false);
      }
    },
    [context.getGeneralDailyCollectionGroupedReport]
  );

  const fetchMonthlyReport = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoadingReport(true);
      setError(null);
      try {
        const result =
          await context.getGeneralMonthlyCollectionGroupedReport.execute(
            params
          );
        setMonthlyReport(result || []);
      } catch (err: any) {
        setError(
          err.message || 'Failed to fetch monthly general collection report'
        );
        console.error(err);
      } finally {
        setIsLoadingReport(false);
      }
    },
    [context.getGeneralMonthlyCollectionGroupedReport]
  );

  const fetchYearlyReport = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoadingReport(true);
      setError(null);
      try {
        const result =
          await context.getGeneralYearlyCollectionGroupedReport.execute(params);
        setYearlyReport(result || []);
      } catch (err: any) {
        setError(
          err.message || 'Failed to fetch yearly general collection report'
        );
        console.error(err);
      } finally {
        setIsLoadingReport(false);
      }
    },
    [context.getGeneralYearlyCollectionGroupedReport]
  );

  const fetchYearlyKpi = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const yearlyKpiResult =
          await context.getGeneralYearlyCollectionKPI.execute(params);
        setYearlyKpi(yearlyKpiResult || []);
      } catch (err: any) {
        setError(
          err.message || 'Failed to fetch yearly general collection KPI'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralYearlyCollectionKPI]
  );

  const fetchMonthlyKpi = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const monthlyKpiResult =
          await context.getGeneralMonthlyCollectionKPI.execute(params);
        setMonthlyKpi(monthlyKpiResult || []);
      } catch (err: any) {
        setError(
          err.message || 'Failed to fetch monthly general collection KPI'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralMonthlyCollectionKPI]
  );

  /** Auto-fetch variant: writes to monthlyKpiBase (last 10 years) without touching monthlyKpi */
  const fetchMonthlyKpiBase = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getGeneralMonthlyCollectionKPI.execute(params);
        setMonthlyKpiBase(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch base monthly KPI');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralMonthlyCollectionKPI]
  );

  const fetchKpi = useCallback(
    async (params: GeneralCollectionsParams) => {
      setIsLoadingKPI(true);
      setError(null);
      try {
        const kpiResult = await context.getGeneralCollectionKPI.execute(params);
        setKpi(kpiResult || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch general collection KPI');
        console.error(err);
      } finally {
        setIsLoadingKPI(false);
      }
    },
    [context.getGeneralCollectionKPI]
  );

  return {
    report,
    dailyReport,
    yearlyReport,
    monthlyReport,
    kpi,
    yearlyKpi,
    monthlyKpi,
    monthlyKpiBase,
    isLoading,
    isLoadingReport,
    isLoadingKPI,
    error,
    fetchReport,
    fetchDailyReport,
    fetchMonthlyReport,
    fetchYearlyReport,
    fetchYearlyKpi,
    fetchMonthlyKpi,
    fetchMonthlyKpiBase,
    fetchKpi
  };
};
