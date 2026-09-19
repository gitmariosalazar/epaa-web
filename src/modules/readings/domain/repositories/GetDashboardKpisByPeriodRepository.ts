import type {
  DashboardKpiAnnualSqlResponse,
  DashboardKpiResponse
} from '../models/reading-kpi';

export interface GetDashboardKpisByPeriodRepository {
  getDashboardKpisByPeriod(
    year: number,
    month: string
  ): Promise<DashboardKpiResponse[]>;

  getDashboardKpisByYear(
    year: number
  ): Promise<DashboardKpiAnnualSqlResponse[]>;
}
