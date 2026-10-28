/**
 * Work Orders Dashboard Repository Interfaces
 *
 * Clean Architecture — Domain Layer.
 *
 * SOLID:
 *   ISP (Interface Segregation Principle): Distinct interfaces for each analytical sub-domain
 *   so consumers only depend on what they need.
 *   DIP (Dependency Inversion Principle): Concrete implementations in the infrastructure layer
 *   depend upon these high-level domain abstractions.
 */

import type {
  FunnelSummary,
  StateMatrixItem,
  OriginChannelItem,
  CategoryDepartmentItem,
  SyncDiscrepancyItem,
  DispatchControlItem,
  HeaderKpis,
  WorkOrderStatusStatistic,
  WorkOrderPriorityStatistic,
  WorkOrderTypeStatistic,
  WorkOrdersKeyStatistic,
  ExecutiveOverview,
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
} from '../schemas/models/dashboard/work-order-dashboard.models';

/**
 * 1. Comparativa de Incidentes vs Órdenes de Trabajo (ISP)
 */
export interface IncidentsVsWorkOrdersRepository {
  getFunnelSummary(): Promise<FunnelSummary>;
  getStateMatrix(): Promise<StateMatrixItem[]>;
  getOriginChannels(): Promise<OriginChannelItem[]>;
  getCategoryDepartments(): Promise<CategoryDepartmentItem[]>;
  getSyncDiscrepancies(): Promise<SyncDiscrepancyItem[]>;
  getDispatchControl(limit?: number): Promise<DispatchControlItem[]>;
}

/**
 * 2. Cuadrillas y Técnicos de Campo (ISP)
 */
export interface TechnicianDashboardRepository {
  getTechnicianPerformance(): Promise<TechnicianPerformanceItem[]>;
  getTechnicianDailyFeed(technicianId?: string): Promise<TechnicianDailyFeedItem[]>;
  getCrewAssignments(): Promise<CrewAssignmentItem[]>;
}

/**
 * 3. SLA, Control de Calidad y Auditoría (ISP)
 */
export interface QualityAndSlaDashboardRepository {
  getSlaMonitor(): Promise<SlaMonitorItem[]>;
  getQualityIndicators(): Promise<QualityIndicatorItem[]>;
  getEscalationAudit(): Promise<EscalationAuditItem[]>;
}

/**
 * 4. Costos de Materiales y Balance Económico (ISP)
 */
export interface FinancialDashboardRepository {
  getMaterialCosts(): Promise<MaterialCostItem[]>;
  getEconomicBalance(): Promise<EconomicBalanceItem[]>;
}

/**
 * 5. Tendencias Diarias y Concentración Territorial (ISP)
 */
export interface TrendsAndGeospatialDashboardRepository {
  getDailyTrend(): Promise<DailyTrendItem[]>;
  getTerritorialConcentration(): Promise<TerritorialConcentrationItem[]>;
}

/**
 * 6. KPIs y Resumen Ejecutivo de Órdenes de Trabajo (ISP)
 */
export interface ExecutiveDashboardRepository {
  getHeaderKpis(): Promise<HeaderKpis>;
  getExecutiveOverview(): Promise<ExecutiveOverview>;
  getStatusDistribution(): Promise<WorkOrderStatusStatistic[]>;
  getPriorityDistribution(): Promise<WorkOrderPriorityStatistic[]>;
  getWorkTypePerformance(): Promise<WorkOrderTypeStatistic[]>;
  getKeyStatisticsMatrix(): Promise<WorkOrdersKeyStatistic[]>;
}

/**
 * 7. Estadísticas Directas de Órdenes (Compatibilidad Paritaria)
 */
export interface WorkOrderStatisticsDirectRepository {
  getPriorityStatistics(): Promise<WorkOrderPriorityStatistic[]>;
  getStatusStatistics(): Promise<WorkOrderStatusStatistic[]>;
  getTypeStatistics(): Promise<WorkOrderTypeStatistic[]>;
  getKeyStatistics(): Promise<WorkOrdersKeyStatistic[]>;
}

/**
 * Unified Work Orders Dashboard Repository (Facade interface)
 */
export interface WorkOrdersDashboardRepository
  extends IncidentsVsWorkOrdersRepository,
    TechnicianDashboardRepository,
    QualityAndSlaDashboardRepository,
    FinancialDashboardRepository,
    TrendsAndGeospatialDashboardRepository,
    ExecutiveDashboardRepository,
    WorkOrderStatisticsDirectRepository {}
