/**
 * Use Cases for Work Orders Dashboard
 *
 * Clean Architecture — Application Layer.
 *
 * SOLID:
 *   SRP: Each use case represents a single analytical query operation.
 *   DIP: Depends only on repository interfaces from the domain layer.
 */

import type {
  IncidentsVsWorkOrdersRepository,
  TechnicianDashboardRepository,
  QualityAndSlaDashboardRepository,
  FinancialDashboardRepository,
  TrendsAndGeospatialDashboardRepository,
  ExecutiveDashboardRepository,
  WorkOrderStatisticsDirectRepository
} from '../../../domain/repositories/work-orders-dashboard.interface.repository';
import type {
  FunnelSummary,
  StateMatrixItem,
  OriginChannelItem,
  CategoryDepartmentItem,
  SyncDiscrepancyItem,
  DispatchControlItem,
  HeaderKpis,
  ExecutiveOverview,
  WorkOrderStatusStatistic,
  WorkOrderPriorityStatistic,
  WorkOrderTypeStatistic,
  WorkOrdersKeyStatistic,
  TechnicianPerformanceItem,
  TechnicianDailyFeedItem,
  CrewAssignmentItem,
  SlaMonitorItem,
  QualityIndicatorItem,
  EscalationAuditItem,
  MaterialCostItem,
  EconomicBalanceItem,
  DailyTrendItem,
  TerritorialConcentrationItem
} from '../../../domain/schemas/models/dashboard/work-order-dashboard.models';

// ── 1. Incidentes vs Órdenes de Trabajo ─────────────────────────────────────

export class GetFunnelSummaryUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(): Promise<FunnelSummary> {
    return this.repository.getFunnelSummary();
  }
}

export class GetStateMatrixUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(): Promise<StateMatrixItem[]> {
    return this.repository.getStateMatrix();
  }
}

export class GetOriginChannelsUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(): Promise<OriginChannelItem[]> {
    return this.repository.getOriginChannels();
  }
}

export class GetCategoryDepartmentsUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(): Promise<CategoryDepartmentItem[]> {
    return this.repository.getCategoryDepartments();
  }
}

export class GetSyncDiscrepanciesUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(): Promise<SyncDiscrepancyItem[]> {
    return this.repository.getSyncDiscrepancies();
  }
}

export class GetDispatchControlUseCase {
  private readonly repository: IncidentsVsWorkOrdersRepository;
  constructor(repository: IncidentsVsWorkOrdersRepository) {
    this.repository = repository;
  }
  async execute(limit?: number): Promise<DispatchControlItem[]> {
    return this.repository.getDispatchControl(limit);
  }
}

// ── 2. Cuadrillas & Técnicos ────────────────────────────────────────────────

export class GetTechnicianPerformanceUseCase {
  private readonly repository: TechnicianDashboardRepository;
  constructor(repository: TechnicianDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<TechnicianPerformanceItem[]> {
    return this.repository.getTechnicianPerformance();
  }
}

export class GetTechnicianDailyFeedUseCase {
  private readonly repository: TechnicianDashboardRepository;
  constructor(repository: TechnicianDashboardRepository) {
    this.repository = repository;
  }
  async execute(technicianId?: string): Promise<TechnicianDailyFeedItem[]> {
    return this.repository.getTechnicianDailyFeed(technicianId);
  }
}

export class GetCrewAssignmentsUseCase {
  private readonly repository: TechnicianDashboardRepository;
  constructor(repository: TechnicianDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<CrewAssignmentItem[]> {
    return this.repository.getCrewAssignments();
  }
}

// ── 3. SLA y Calidad ────────────────────────────────────────────────────────

export class GetSlaMonitorUseCase {
  private readonly repository: QualityAndSlaDashboardRepository;
  constructor(repository: QualityAndSlaDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<SlaMonitorItem[]> {
    return this.repository.getSlaMonitor();
  }
}

export class GetQualityIndicatorsUseCase {
  private readonly repository: QualityAndSlaDashboardRepository;
  constructor(repository: QualityAndSlaDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<QualityIndicatorItem[]> {
    return this.repository.getQualityIndicators();
  }
}

export class GetEscalationAuditUseCase {
  private readonly repository: QualityAndSlaDashboardRepository;
  constructor(repository: QualityAndSlaDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<EscalationAuditItem[]> {
    return this.repository.getEscalationAudit();
  }
}

// ── 4. Financiero ───────────────────────────────────────────────────────────

export class GetMaterialCostsUseCase {
  private readonly repository: FinancialDashboardRepository;
  constructor(repository: FinancialDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<MaterialCostItem[]> {
    return this.repository.getMaterialCosts();
  }
}

export class GetEconomicBalanceUseCase {
  private readonly repository: FinancialDashboardRepository;
  constructor(repository: FinancialDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<EconomicBalanceItem[]> {
    return this.repository.getEconomicBalance();
  }
}

// ── 5. Tendencias & Geoespacial ─────────────────────────────────────────────

export class GetDailyTrendUseCase {
  private readonly repository: TrendsAndGeospatialDashboardRepository;
  constructor(repository: TrendsAndGeospatialDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<DailyTrendItem[]> {
    return this.repository.getDailyTrend();
  }
}

export class GetTerritorialConcentrationUseCase {
  private readonly repository: TrendsAndGeospatialDashboardRepository;
  constructor(repository: TrendsAndGeospatialDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<TerritorialConcentrationItem[]> {
    return this.repository.getTerritorialConcentration();
  }
}

// ── 6. Resumen Ejecutivo & KPIs ─────────────────────────────────────────────

export class GetHeaderKpisUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<HeaderKpis> {
    return this.repository.getHeaderKpis();
  }
}

export class GetExecutiveOverviewUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<ExecutiveOverview> {
    return this.repository.getExecutiveOverview();
  }
}

export class GetStatusDistributionUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderStatusStatistic[]> {
    return this.repository.getStatusDistribution();
  }
}

export class GetPriorityDistributionUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderPriorityStatistic[]> {
    return this.repository.getPriorityDistribution();
  }
}

export class GetWorkTypePerformanceUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderTypeStatistic[]> {
    return this.repository.getWorkTypePerformance();
  }
}

export class GetKeyStatisticsMatrixUseCase {
  private readonly repository: ExecutiveDashboardRepository;
  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrdersKeyStatistic[]> {
    return this.repository.getKeyStatisticsMatrix();
  }
}

// ── 7. Direct Work Orders Statistics ────────────────────────────────────────

export class GetWorkOrderPriorityStatisticsUseCase {
  private readonly repository: WorkOrderStatisticsDirectRepository;
  constructor(repository: WorkOrderStatisticsDirectRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderPriorityStatistic[]> {
    return this.repository.getPriorityStatistics();
  }
}

export class GetWorkOrderStatusStatisticsUseCase {
  private readonly repository: WorkOrderStatisticsDirectRepository;
  constructor(repository: WorkOrderStatisticsDirectRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderStatusStatistic[]> {
    return this.repository.getStatusStatistics();
  }
}

export class GetWorkOrderTypeStatisticsUseCase {
  private readonly repository: WorkOrderStatisticsDirectRepository;
  constructor(repository: WorkOrderStatisticsDirectRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrderTypeStatistic[]> {
    return this.repository.getTypeStatistics();
  }
}

export class GetWorkOrdersKeyStatisticsUseCase {
  private readonly repository: WorkOrderStatisticsDirectRepository;
  constructor(repository: WorkOrderStatisticsDirectRepository) {
    this.repository = repository;
  }
  async execute(): Promise<WorkOrdersKeyStatistic[]> {
    return this.repository.getKeyStatistics();
  }
}
