import type { DashboardKpiResponse } from '../models/reading-kpi';

export interface GetDashboardKpisByPeriodRepository {
  getDashboardKpisByPeriod(
    year: number,
    month: string
  ): Promise<DashboardKpiResponse[]>;
}
