import type { DashboardKpiResponse } from '../../domain/models/reading-kpi';
import type { GetDashboardKpisByPeriodRepository } from '../../domain/repositories/GetDashboardKpisByPeriodRepository';

export class GetDashboardKpisByPeriodUseCase {
  private readonly getDashboardKpisByPeriodRepository: GetDashboardKpisByPeriodRepository;

  constructor(
    getDashboardKpisByPeriodRepository: GetDashboardKpisByPeriodRepository
  ) {
    this.getDashboardKpisByPeriodRepository =
      getDashboardKpisByPeriodRepository;
  }

  async execute(year: number, month: string): Promise<DashboardKpiResponse[]> {
    return this.getDashboardKpisByPeriodRepository.getDashboardKpisByPeriod(
      year,
      month
    );
  }
}
