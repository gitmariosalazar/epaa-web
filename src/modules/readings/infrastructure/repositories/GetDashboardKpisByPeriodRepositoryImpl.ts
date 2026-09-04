import type { DashboardKpiResponse } from '../../domain/models/reading-kpi';
import type { GetDashboardKpisByPeriodRepository } from '../../domain/repositories/GetDashboardKpisByPeriodRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetDashboardKpisByPeriodRepositoryImpl implements GetDashboardKpisByPeriodRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getDashboardKpisByPeriod(
    year: number,
    month: string
  ): Promise<DashboardKpiResponse[]> {
    const response = await this.client.get<ApiResponse<DashboardKpiResponse[]>>(
      `/Readings/get-dashboard-kpis-by-period?year=${year}&month=${month}`
    );
    return response.data.data;
  }
}
