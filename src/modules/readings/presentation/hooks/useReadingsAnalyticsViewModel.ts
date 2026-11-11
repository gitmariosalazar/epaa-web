import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  AnnualTrendAnalytics,
  ExecutiveDashboardAnalytics,
  InterannualComparisonAnalytics,
  MonthlyConnectionGrowthAnalytics,
  MonthlyTrendAnalytics,
  NoveltyEconomicImpactAnalytics,
  SectorPerformanceAnalytics,
  TopConsumerAnalytics,
} from '../../domain/models/readings-analytics';
import { cachedReadingsAnalyticsRepository } from '../../infrastructure/repositories/CachedReadingsAnalyticsRepository';
import { readingsAnalyticsCacheService } from '../../infrastructure/cache/ReadingsAnalyticsCacheService';
import {
  GetExecutiveDashboardAnalyticsUseCase,
  GetSectorPerformanceAnalyticsUseCase,
  GetMonthlyTrendAnalyticsUseCase,
  GetNoveltyEconomicImpactAnalyticsUseCase,
  GetTopConsumersAnalyticsUseCase,
  GetInterannualComparisonAnalyticsUseCase,
  GetMonthlyConnectionGrowthAnalyticsUseCase,
  GetAnnualTrendAnalyticsUseCase,
} from '../../application/usecases/analytics';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export type AnalyticsTabType =
  | 'executive'
  | 'sectors'
  | 'trend'
  | 'novelties'
  | 'consumers'
  | 'interannual'
  | 'connection-growth'
  | 'annual-trend';

export const useReadingsAnalyticsViewModel = () => {
  const repository = useMemo(() => cachedReadingsAnalyticsRepository, []);

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
  const connectionGrowthUseCase = useMemo(
    () => new GetMonthlyConnectionGrowthAnalyticsUseCase(repository),
    [repository],
  );
  const annualTrendUseCase = useMemo(
    () => new GetAnnualTrendAnalyticsUseCase(repository),
    [repository],
  );

  // Tab & Engine System
  const [system, setSystem] = useState<AnalyticsSystemType>('legacy');
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
  const [annualLimitYears, setAnnualLimitYears] = useState<number>(5);
  const [annualStartYear, setAnnualStartYear] = useState<number>(2022);
  const [annualEndYear, setAnnualEndYear] = useState<number>(2026);

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
  const [connectionGrowthData, setConnectionGrowthData] = useState<
    MonthlyConnectionGrowthAnalytics[] | null
  >(null);
  const [annualTrendData, setAnnualTrendData] = useState<
    AnnualTrendAnalytics[] | null
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
      startYear: annualStartYear,
      endYear: annualEndYear,
      limitYears: annualLimitYears,
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
    annualStartYear,
    annualEndYear,
    annualLimitYears,
  ]);

  const fetchExecutiveDashboard = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'executive-dashboard',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await executiveUseCase.execute(filter, system);
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
    },
    [executiveUseCase, buildCurrentFilter, system],
  );

  const fetchSectorPerformance = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'sector-performance',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await sectorUseCase.execute(filter, system);
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
    },
    [sectorUseCase, buildCurrentFilter, system],
  );

  const fetchMonthlyTrend = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'monthly-trend',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await trendUseCase.execute(filter, system);
        setTrendData(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar tendencia mensual';
        setError(message);
        MessageToastCustom('error', message, 'Error Analítica');
      } finally {
        setIsLoading(false);
      }
    },
    [trendUseCase, buildCurrentFilter, system],
  );

  const fetchNoveltiesEconomicImpact = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'novelty-economic-impact',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await noveltyUseCase.execute(filter, system);
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
    },
    [noveltyUseCase, buildCurrentFilter, system],
  );

  const fetchTopConsumers = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'top-consumers',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await topConsumersUseCase.execute(filter, system);
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
    },
    [topConsumersUseCase, buildCurrentFilter, system],
  );

  const fetchInterannualComparison = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'interannual-comparison',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await interannualUseCase.execute(filter, system);
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
    },
    [interannualUseCase, buildCurrentFilter, system],
  );

  const fetchMonthlyConnectionGrowth = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'monthly-connection-growth',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await connectionGrowthUseCase.execute(filter, system);
        setConnectionGrowthData(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar crecimiento de acometidas';
        setError(message);
        MessageToastCustom('error', message, 'Error Analítica');
      } finally {
        setIsLoading(false);
      }
    },
    [connectionGrowthUseCase, buildCurrentFilter, system],
  );

  const fetchAnnualTrend = useCallback(
    async (forceRefresh = false) => {
      const filter = { ...buildCurrentFilter(), forceRefresh };
      const key = readingsAnalyticsCacheService.generateKey(
        'annual-trend',
        filter,
        system,
      );
      if (forceRefresh || !readingsAnalyticsCacheService.has(key)) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await annualTrendUseCase.execute(filter, system);
        setAnnualTrendData(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar tendencia anual';
        setError(message);
        MessageToastCustom('error', message, 'Error Analítica');
      } finally {
        setIsLoading(false);
      }
    },
    [annualTrendUseCase, buildCurrentFilter, system],
  );

  const refreshActiveTab = useCallback(
    (forceRefresh = false) => {
      switch (activeTab) {
        case 'executive':
          fetchExecutiveDashboard(forceRefresh);
          break;
        case 'sectors':
          fetchSectorPerformance(forceRefresh);
          break;
        case 'trend':
          fetchMonthlyTrend(forceRefresh);
          break;
        case 'novelties':
          fetchNoveltiesEconomicImpact(forceRefresh);
          break;
        case 'consumers':
          fetchTopConsumers(forceRefresh);
          break;
        case 'interannual':
          fetchInterannualComparison(forceRefresh);
          break;
        case 'connection-growth':
          fetchMonthlyConnectionGrowth(forceRefresh);
          break;
        case 'annual-trend':
          fetchAnnualTrend(forceRefresh);
          break;
      }
    },
    [
      activeTab,
      fetchExecutiveDashboard,
      fetchSectorPerformance,
      fetchMonthlyTrend,
      fetchNoveltiesEconomicImpact,
      fetchTopConsumers,
      fetchInterannualComparison,
      fetchMonthlyConnectionGrowth,
      fetchAnnualTrend,
    ],
  );

  // Trigger fetch when tab or critical filter changes
  useEffect(() => {
    refreshActiveTab(false);
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
    annualLimitYears,
    annualStartYear,
    annualEndYear,
    refreshActiveTab,
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
    annualLimitYears,
    setAnnualLimitYears,
    annualStartYear,
    setAnnualStartYear,
    annualEndYear,
    setAnnualEndYear,

    // Data
    executiveData,
    sectorData,
    trendData,
    noveltiesData,
    topConsumersData,
    interannualData,
    connectionGrowthData,
    annualTrendData,

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
    fetchMonthlyConnectionGrowth,
    fetchAnnualTrend,
  };
};
