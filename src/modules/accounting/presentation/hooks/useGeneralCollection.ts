import { useState, useCallback } from 'react';
import { useGeneralCollectionContext } from '../context/GeneralCollectionContext';
import type {
  GeneralCollectionResponse,
  GeneralDailyGroupedReportResponse,
  GeneralYearlyGroupedReportResponse,
  GeneralMonthlyGroupedReportResponse,
  GeneralKPIResponse,
  GeneralYearlyKPIResponse,
  GeneralMonthlyKPIResponse
} from '../../domain/models/GenelarCollection';
import type {
  GeneralCollectionsParams,
  GeneralTrendCollectionsParams
} from '../../domain/dto/params/DataEntryParams';

export const useGeneralCollection = () => {
  const context = useGeneralCollectionContext();

  const [report, setReport] = useState<GeneralCollectionResponse[]>([]);
  const [dailyReport, setDailyReport] = useState<GeneralDailyGroupedReportResponse[]>([]);
  const [yearlyReport, setYearlyReport] = useState<GeneralYearlyGroupedReportResponse[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<GeneralMonthlyGroupedReportResponse[]>([]);

  const [kpi, setKpi] = useState<GeneralKPIResponse | null>(null);
  const [yearlyKpi, setYearlyKpi] = useState<GeneralYearlyKPIResponse[]>([]);
  const [monthlyKpi, setMonthlyKpi] = useState<GeneralMonthlyKPIResponse[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (params: GeneralCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const [reportResult, kpiResult] = await Promise.all([
          context.getGeneralCollectionReport.execute(params),
          context.getGeneralCollectionKPI.execute(params)
        ]);
        setReport(reportResult || []);
        setKpi(kpiResult || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch general collection report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralCollectionReport, context.getGeneralCollectionKPI]
  );

  const fetchDailyReport = useCallback(
    async (params: GeneralCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const [dailyResult, kpiResult] = await Promise.all([
          context.getGeneralDailyCollectionGroupedReport.execute(params),
          context.getGeneralCollectionKPI.execute(params)
        ]);
        setDailyReport(dailyResult || []);
        setKpi(kpiResult || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch daily general collection report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralDailyCollectionGroupedReport, context.getGeneralCollectionKPI]
  );

  const fetchMonthlyReport = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const [monthlyResult, monthlyKpiResult] = await Promise.all([
          context.getGeneralMonthlyCollectionGroupedReport.execute(params),
          context.getGeneralMonthlyCollectionKPI.execute(params)
        ]);
        setMonthlyReport(monthlyResult || []);
        setMonthlyKpi(monthlyKpiResult || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch monthly general collection report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralMonthlyCollectionGroupedReport, context.getGeneralMonthlyCollectionKPI]
  );

  const fetchYearlyReport = useCallback(
    async (params: GeneralTrendCollectionsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const [yearlyResult, yearlyKpiResult] = await Promise.all([
          context.getGeneralYearlyCollectionGroupedReport.execute(params),
          context.getGeneralYearlyCollectionKPI.execute(params)
        ]);
        setYearlyReport(yearlyResult || []);
        setYearlyKpi(yearlyKpiResult || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch yearly general collection report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getGeneralYearlyCollectionGroupedReport, context.getGeneralYearlyCollectionKPI]
  );

  return {
    report,
    dailyReport,
    yearlyReport,
    monthlyReport,
    kpi,
    yearlyKpi,
    monthlyKpi,
    isLoading,
    error,
    fetchReport,
    fetchDailyReport,
    fetchMonthlyReport,
    fetchYearlyReport
  };
};
