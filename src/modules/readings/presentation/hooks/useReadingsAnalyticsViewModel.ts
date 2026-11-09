import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  ExecutiveDashboardAnalytics,
  InterannualComparisonAnalytics,
  MonthlyTrendAnalytics,
  NoveltyEconomicImpactAnalytics,
  SectorPerformanceAnalytics,
  TopConsumerAnalytics,
} from '../../domain/models/readings-analytics';
import { ReadingsAnalyticsRepositoryImpl } from '../../infrastructure/repositories/ReadingsAnalyticsRepositoryImpl';
import {
  GetExecutiveDashboardAnalyticsUseCase,
  GetSectorPerformanceAnalyticsUseCase,
  GetMonthlyTrendAnalyticsUseCase,
  GetNoveltyEconomicImpactAnalyticsUseCase,
  GetTopConsumersAnalyticsUseCase,
  GetInterannualComparisonAnalyticsUseCase,
} from '../../application/usecases/analytics';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export type AnalyticsTabType =
  | 'executive'
  | 'sectors'
  | 'trend'
  | 'novelties'
  | 'consumers'
  | 'interannual';

export const useReadingsAnalyticsViewModel = () => {
  const repository = useMemo(() => new ReadingsAnalyticsRepositoryImpl(), []);

  const executiveUseCase = useMemo(
    () => new GetExecutiveDashboardAnalyticsUseCase(repository),
    [repository],
  );
  const sectorUseCase = useMemo(
    () => new GetSectorPerformanceAnalyticsUseCase(repository),
    [repository],
  );
  const trendUseCase = useMemo(
    () => new GetMonthlyTrendAnalyticsUseCase(repository),
    [repository],
  );
  const noveltyUseCase = useMemo(
    () => new GetNoveltyEconomicImpactAnalyticsUseCase(repository),
    [repository],
  );
  const topConsumersUseCase = useMemo(
    () => new GetTopConsumersAnalyticsUseCase(repository),
    [repository],
  );
  const interannualUseCase = useMemo(
    () => new GetInterannualComparisonAnalyticsUseCase(repository),
    [repository],
  );

  // Tab & Engine System
  const [system, setSystem] = useState<AnalyticsSystemType>('modern');
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>('executive');

  // Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('10');
  const [selectedSector, setSelectedSector] = useState<string>(''); // empty = all
  const [selectedSortBy, setSelectedSortBy] = useState<
    'revenue' | 'volume' | 'readings' | 'sector'
  >('revenue');
  const [topConsumersLimit, setTopConsumersLimit] = useState<number>(50);
  const [minConsumptionM3, setMinConsumptionM3] = useState<number>(50);
  const [noveltyFilter, setNoveltyFilter] = useState<string>('');
  const [baseYear, setBaseYear] = useState<number>(2025);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [onlyHomologous, setOnlyHomologous] = useState<boolean>(true);

  // Data
  const [executiveData, setExecutiveData] =
    useState<ExecutiveDashboardAnalytics | null>(null);
  const [sectorData, setSectorData] = useState<
    SectorPerformanceAnalytics[] | null
  >(null);
  const [trendData, setTrendData] = useState<MonthlyTrendAnalytics[] | null>(
    null,
  );
  const [noveltiesData, setNoveltiesData] = useState<
    NoveltyEconomicImpactAnalytics[] | null
  >(null);
  const [topConsumersData, setTopConsumersData] = useState<
    TopConsumerAnalytics[] | null
  >(null);
  const [interannualData, setInterannualData] = useState<
    InterannualComparisonAnalytics[] | null
  >(null);

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buildCurrentFilter = useCallback((): AnalyticsFilterParams => {
    const sectorNumber =
      selectedSector && selectedSector.trim() !== ''
        ? parseInt(selectedSector, 10)
        : undefined;

    return {
      year: selectedYear,
      month: selectedMonth,
      sector: Number.isNaN(sectorNumber) ? undefined : sectorNumber,
      sortBy: selectedSortBy,
      limit: topConsumersLimit,
      minConsumptionM3,
      novelty: noveltyFilter || undefined,
      baseYear,
      targetYear,
      onlyHomologous,
    };
  }, [
    selectedYear,
    selectedMonth,
    selectedSector,
    selectedSortBy,
    topConsumersLimit,
    minConsumptionM3,
    noveltyFilter,
    baseYear,
    targetYear,
    onlyHomologous,
  ]);

  const fetchExecutiveDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await executiveUseCase.execute(buildCurrentFilter(), system);
      setExecutiveData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el tablero ejecutivo';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [executiveUseCase, buildCurrentFilter, system]);

  const fetchSectorPerformance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sectorUseCase.execute(buildCurrentFilter(), system);
      setSectorData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar matriz de sectores';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [sectorUseCase, buildCurrentFilter, system]);

  const fetchMonthlyTrend = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await trendUseCase.execute(buildCurrentFilter(), system);
      setTrendData(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar tendencia mensual';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [trendUseCase, buildCurrentFilter, system]);

  const fetchNoveltiesEconomicImpact = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noveltyUseCase.execute(buildCurrentFilter(), system);
      setNoveltiesData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar impacto de novedades';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [noveltyUseCase, buildCurrentFilter, system]);

  const fetchTopConsumers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await topConsumersUseCase.execute(buildCurrentFilter(), system);
      setTopConsumersData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar mayores consumidores';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [topConsumersUseCase, buildCurrentFilter, system]);

  const fetchInterannualComparison = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await interannualUseCase.execute(buildCurrentFilter(), system);
      setInterannualData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar comparativa interanual';
      setError(message);
      MessageToastCustom('error', message, 'Error Analítica');
    } finally {
      setIsLoading(false);
    }
  }, [interannualUseCase, buildCurrentFilter, system]);

  const refreshActiveTab = useCallback(() => {
    switch (activeTab) {
      case 'executive':
        fetchExecutiveDashboard();
        break;
      case 'sectors':
        fetchSectorPerformance();
        break;
      case 'trend':
        fetchMonthlyTrend();
        break;
      case 'novelties':
        fetchNoveltiesEconomicImpact();
        break;
      case 'consumers':
        fetchTopConsumers();
        break;
      case 'interannual':
        fetchInterannualComparison();
        break;
    }
  }, [
    activeTab,
    fetchExecutiveDashboard,
    fetchSectorPerformance,
    fetchMonthlyTrend,
    fetchNoveltiesEconomicImpact,
    fetchTopConsumers,
    fetchInterannualComparison,
  ]);

  // Trigger fetch when tab or critical filter changes
  useEffect(() => {
    refreshActiveTab();
  }, [
    activeTab,
    system,
    selectedYear,
    selectedMonth,
    selectedSector,
    selectedSortBy,
    baseYear,
    targetYear,
    onlyHomologous,
  ]);

  return {
    // System & Navigation
    system,
    setSystem,
    activeTab,
    setActiveTab,

    // Filter controls
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedSector,
    setSelectedSector,
    selectedSortBy,
    setSelectedSortBy,
    topConsumersLimit,
    setTopConsumersLimit,
    minConsumptionM3,
    setMinConsumptionM3,
    noveltyFilter,
    setNoveltyFilter,
    baseYear,
    setBaseYear,
    targetYear,
    setTargetYear,
    onlyHomologous,
    setOnlyHomologous,

    // Data
    executiveData,
    sectorData,
    trendData,
    noveltiesData,
    topConsumersData,
    interannualData,

    // Status & Actions
    isLoading,
    error,
    refreshActiveTab,
    fetchExecutiveDashboard,
    fetchSectorPerformance,
    fetchMonthlyTrend,
    fetchNoveltiesEconomicImpact,
    fetchTopConsumers,
    fetchInterannualComparison,
  };
};
