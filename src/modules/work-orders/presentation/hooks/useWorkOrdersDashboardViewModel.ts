/**
 * useWorkOrdersDashboardViewModel
 *
 * Presentation ViewModel — Clean Architecture.
 * Coordinates all data fetching and analytical state for the Work Orders Dashboard.
 *
 * SOLID:
 *   SRP: Manages UI state, tab routing, filters, and use-case coordination.
 *   DIP: Injects use cases, isolating React components from HTTP/data specifics.
 *   OCP: Allows adding new analytics without rewriting view components.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { WorkOrdersDashboardRepositoryImpl } from '../../infrastructure/repositories/WorkOrdersDashboardRepositoryImpl';
import {
  GetFunnelSummaryUseCase,
  GetStateMatrixUseCase,
  GetOriginChannelsUseCase,
  GetCategoryDepartmentsUseCase,
  GetSyncDiscrepanciesUseCase,
  GetDispatchControlUseCase,
  GetHeaderKpisUseCase,
  GetExecutiveOverviewUseCase,
  GetStatusDistributionUseCase,
  GetPriorityDistributionUseCase,
  GetWorkTypePerformanceUseCase,
  GetKeyStatisticsMatrixUseCase,
  GetTechnicianPerformanceUseCase,
  GetCrewAssignmentsUseCase,
  GetSlaMonitorUseCase,
  GetQualityIndicatorsUseCase,
  GetEscalationAuditUseCase,
  GetMaterialCostsUseCase,
  GetEconomicBalanceUseCase,
  GetDailyTrendUseCase,
  GetTerritorialConcentrationUseCase
} from '../../application/usecases/dashboard';
import type {
  CategoryDepartmentItem,
  CrewAssignmentItem,
  DailyTrendItem,
  DispatchControlItem,
  EconomicBalanceItem,
  EscalationAuditItem,
  ExecutiveOverview,
  FunnelSummary,
  HeaderKpis,
  MaterialCostItem,
  OriginChannelItem,
  QualityIndicatorItem,
  SlaMonitorItem,
  StateMatrixItem,
  SyncDiscrepancyItem,
  TechnicianPerformanceItem,
  TerritorialConcentrationItem,
  WorkOrderPriorityStatistic,
  WorkOrderStatusStatistic,
  WorkOrderTypeStatistic,
  WorkOrdersKeyStatistic
} from '../../domain/schemas/models/dashboard/work-order-dashboard.models';
import { WorkOrdersKeyStatisticsSummary } from '../../domain/schemas/models/dashboard/work-order-dashboard.models';

export type DashboardTabKey =
  | 'overview'
  | 'incidents-vs-ot'
  | 'technicians-sla'
  | 'finance-trends';

export type PeriodFilter = 'today' | '7days' | 'month' | 'year' | 'all';

export interface UseWorkOrdersDashboardViewModelReturn {
  // Navigation
  activeTab: DashboardTabKey;
  setActiveTab: (tab: DashboardTabKey) => void;

  // Global filters
  period: PeriodFilter;
  setPeriod: (period: PeriodFilter) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;

  // Status flags
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;

  // Data sets
  headerKpis: HeaderKpis | null;
  executiveOverview: ExecutiveOverview | null;
  statusStats: WorkOrderStatusStatistic[];
  priorityStats: WorkOrderPriorityStatistic[];
  workTypeStats: WorkOrderTypeStatistic[];
  keyStats: WorkOrdersKeyStatistic[];
  keySummary: WorkOrdersKeyStatisticsSummary | null;

  funnelSummary: FunnelSummary | null;
  stateMatrix: StateMatrixItem[];
  originChannels: OriginChannelItem[];
  categoryDepartments: CategoryDepartmentItem[];
  syncDiscrepancies: SyncDiscrepancyItem[];
  dispatchControl: DispatchControlItem[];

  technicianPerformance: TechnicianPerformanceItem[];
  crewAssignments: CrewAssignmentItem[];
  slaMonitor: SlaMonitorItem[];
  qualityIndicators: QualityIndicatorItem[];
  escalationAudit: EscalationAuditItem[];

  materialCosts: MaterialCostItem[];
  economicBalance: EconomicBalanceItem[];
  dailyTrend: DailyTrendItem[];
  territorialConcentration: TerritorialConcentrationItem[];
}

export const useWorkOrdersDashboardViewModel = (): UseWorkOrdersDashboardViewModelReturn => {
  // ── Dependency Injection (DIP) ──────────────────────────────────────────────
  const repo = useMemo(() => new WorkOrdersDashboardRepositoryImpl(), []);

  const useCases = useMemo(
    () => ({
      getFunnelSummary: new GetFunnelSummaryUseCase(repo),
      getStateMatrix: new GetStateMatrixUseCase(repo),
      getOriginChannels: new GetOriginChannelsUseCase(repo),
      getCategoryDepartments: new GetCategoryDepartmentsUseCase(repo),
      getSyncDiscrepancies: new GetSyncDiscrepanciesUseCase(repo),
      getDispatchControl: new GetDispatchControlUseCase(repo),
      getHeaderKpis: new GetHeaderKpisUseCase(repo),
      getExecutiveOverview: new GetExecutiveOverviewUseCase(repo),
      getStatusDistribution: new GetStatusDistributionUseCase(repo),
      getPriorityDistribution: new GetPriorityDistributionUseCase(repo),
      getWorkTypePerformance: new GetWorkTypePerformanceUseCase(repo),
      getKeyStatisticsMatrix: new GetKeyStatisticsMatrixUseCase(repo),
      getTechnicianPerformance: new GetTechnicianPerformanceUseCase(repo),
      getCrewAssignments: new GetCrewAssignmentsUseCase(repo),
      getSlaMonitor: new GetSlaMonitorUseCase(repo),
      getQualityIndicators: new GetQualityIndicatorsUseCase(repo),
      getEscalationAudit: new GetEscalationAuditUseCase(repo),
      getMaterialCosts: new GetMaterialCostsUseCase(repo),
      getEconomicBalance: new GetEconomicBalanceUseCase(repo),
      getDailyTrend: new GetDailyTrendUseCase(repo),
      getTerritorialConcentration: new GetTerritorialConcentrationUseCase(repo)
    }),
    [repo]
  );

  // ── State ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('overview');
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tab 1: Overview & KPIs
  const [headerKpis, setHeaderKpis] = useState<HeaderKpis | null>(null);
  const [executiveOverview, setExecutiveOverview] = useState<ExecutiveOverview | null>(null);
  const [statusStats, setStatusStats] = useState<WorkOrderStatusStatistic[]>([]);
  const [priorityStats, setPriorityStats] = useState<WorkOrderPriorityStatistic[]>([]);
  const [workTypeStats, setWorkTypeStats] = useState<WorkOrderTypeStatistic[]>([]);
  const [keyStats, setKeyStats] = useState<WorkOrdersKeyStatistic[]>([]);

  // Tab 2: Incidentes vs OTs
  const [funnelSummary, setFunnelSummary] = useState<FunnelSummary | null>(null);
  const [stateMatrix, setStateMatrix] = useState<StateMatrixItem[]>([]);
  const [originChannels, setOriginChannels] = useState<OriginChannelItem[]>([]);
  const [categoryDepartments, setCategoryDepartments] = useState<CategoryDepartmentItem[]>([]);
  const [syncDiscrepancies, setSyncDiscrepancies] = useState<SyncDiscrepancyItem[]>([]);
  const [dispatchControl, setDispatchControl] = useState<DispatchControlItem[]>([]);

  // Tab 3: Cuadrillas & SLA
  const [technicianPerformance, setTechnicianPerformance] = useState<TechnicianPerformanceItem[]>([]);
  const [crewAssignments, setCrewAssignments] = useState<CrewAssignmentItem[]>([]);
  const [slaMonitor, setSlaMonitor] = useState<SlaMonitorItem[]>([]);
  const [qualityIndicators, setQualityIndicators] = useState<QualityIndicatorItem[]>([]);
  const [escalationAudit, setEscalationAudit] = useState<EscalationAuditItem[]>([]);

  // Tab 4: Finanzas & Tendencias
  const [materialCosts, setMaterialCosts] = useState<MaterialCostItem[]>([]);
  const [economicBalance, setEconomicBalance] = useState<EconomicBalanceItem[]>([]);
  const [dailyTrend, setDailyTrend] = useState<DailyTrendItem[]>([]);
  const [territorialConcentration, setTerritorialConcentration] = useState<TerritorialConcentrationItem[]>([]);

  // Calculated summary
  const keySummary = useMemo(() => {
    return keyStats.length > 0 ? WorkOrdersKeyStatisticsSummary.fromRows(keyStats) : null;
  }, [keyStats]);

  // ── Tab-specific Loaders ────────────────────────────────────────────────────

  const loadOverviewData = useCallback(async () => {
    const [kpisRes, overviewRes, statusRes, priorityRes, typeRes, keyRes] =
      await Promise.allSettled([
        useCases.getHeaderKpis.execute(),
        useCases.getExecutiveOverview.execute(),
        useCases.getStatusDistribution.execute(),
        useCases.getPriorityDistribution.execute(),
        useCases.getWorkTypePerformance.execute(),
        useCases.getKeyStatisticsMatrix.execute()
      ]);

    if (kpisRes.status === 'fulfilled') setHeaderKpis(kpisRes.value);
    if (overviewRes.status === 'fulfilled') setExecutiveOverview(overviewRes.value);
    if (statusRes.status === 'fulfilled') setStatusStats(statusRes.value);
    if (priorityRes.status === 'fulfilled') setPriorityStats(priorityRes.value);
    if (typeRes.status === 'fulfilled') setWorkTypeStats(typeRes.value);
    if (keyRes.status === 'fulfilled') setKeyStats(keyRes.value);
  }, [useCases]);

  const loadIncidentsVsOtData = useCallback(async () => {
    const [funnelRes, matrixRes, channelsRes, catRes, syncRes, dispatchRes] =
      await Promise.allSettled([
        useCases.getFunnelSummary.execute(),
        useCases.getStateMatrix.execute(),
        useCases.getOriginChannels.execute(),
        useCases.getCategoryDepartments.execute(),
        useCases.getSyncDiscrepancies.execute(),
        useCases.getDispatchControl.execute(25)
      ]);

    if (funnelRes.status === 'fulfilled') setFunnelSummary(funnelRes.value);
    if (matrixRes.status === 'fulfilled') setStateMatrix(matrixRes.value);
    if (channelsRes.status === 'fulfilled') setOriginChannels(channelsRes.value);
    if (catRes.status === 'fulfilled') setCategoryDepartments(catRes.value);
    if (syncRes.status === 'fulfilled') setSyncDiscrepancies(syncRes.value);
    if (dispatchRes.status === 'fulfilled') setDispatchControl(dispatchRes.value);
  }, [useCases]);

  const loadTechniciansAndSlaData = useCallback(async () => {
    const [techRes, crewRes, slaRes, qualityRes, escRes] =
      await Promise.allSettled([
        useCases.getTechnicianPerformance.execute(),
        useCases.getCrewAssignments.execute(),
        useCases.getSlaMonitor.execute(),
        useCases.getQualityIndicators.execute(),
        useCases.getEscalationAudit.execute()
      ]);

    if (techRes.status === 'fulfilled') setTechnicianPerformance(techRes.value);
    if (crewRes.status === 'fulfilled') setCrewAssignments(crewRes.value);
    if (slaRes.status === 'fulfilled') setSlaMonitor(slaRes.value);
    if (qualityRes.status === 'fulfilled') setQualityIndicators(qualityRes.value);
    if (escRes.status === 'fulfilled') setEscalationAudit(escRes.value);
  }, [useCases]);

  const loadFinanceAndTrendsData = useCallback(async () => {
    const [costsRes, balanceRes, trendRes, geoRes] =
      await Promise.allSettled([
        useCases.getMaterialCosts.execute(),
        useCases.getEconomicBalance.execute(),
        useCases.getDailyTrend.execute(),
        useCases.getTerritorialConcentration.execute()
      ]);

    if (costsRes.status === 'fulfilled') setMaterialCosts(costsRes.value);
    if (balanceRes.status === 'fulfilled') setEconomicBalance(balanceRes.value);
    if (trendRes.status === 'fulfilled') setDailyTrend(trendRes.value);
    if (geoRes.status === 'fulfilled') setTerritorialConcentration(geoRes.value);
  }, [useCases]);

  // ── Unified Data Fetcher ────────────────────────────────────────────────────

  const fetchTabData = useCallback(
    async (tab: DashboardTabKey, isSilentRefresh = false) => {
      if (isSilentRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        switch (tab) {
          case 'overview':
            await loadOverviewData();
            break;
          case 'incidents-vs-ot':
            await loadIncidentsVsOtData();
            break;
          case 'technicians-sla':
            await loadTechniciansAndSlaData();
            break;
          case 'finance-trends':
            await loadFinanceAndTrendsData();
            break;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error inesperado al cargar métricas del dashboard';
        console.error('[useWorkOrdersDashboardViewModel] Error:', err);
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [loadOverviewData, loadIncidentsVsOtData, loadTechniciansAndSlaData, loadFinanceAndTrendsData]
  );

  // Fetch when tab changes
  useEffect(() => {
    let isCancelled = false;
    const runFetch = async () => {
      await Promise.resolve();
      if (!isCancelled) {
        await fetchTabData(activeTab, false);
      }
    };
    void runFetch();
    return () => {
      isCancelled = true;
    };
  }, [activeTab, fetchTabData]);

  // Global Refresh (fetches current tab fresh)
  const refresh = useCallback(async () => {
    await fetchTabData(activeTab, true);
  }, [activeTab, fetchTabData]);

  return {
    activeTab,
    setActiveTab,
    period,
    setPeriod,
    searchFilter,
    setSearchFilter,
    isLoading,
    isRefreshing,
    error,
    refresh,

    headerKpis,
    executiveOverview,
    statusStats,
    priorityStats,
    workTypeStats,
    keyStats,
    keySummary,

    funnelSummary,
    stateMatrix,
    originChannels,
    categoryDepartments,
    syncDiscrepancies,
    dispatchControl,

    technicianPerformance,
    crewAssignments,
    slaMonitor,
    qualityIndicators,
    escalationAudit,

    materialCosts,
    economicBalance,
    dailyTrend,
    territorialConcentration
  };
};
