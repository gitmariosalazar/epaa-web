import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type {
  AdvancedReportReadings,
  ConnectionLastReadingsReport,
  DailyReadingsReport,
  DailyStatsReport,
  DashboardMetrics,
  GlobalStatsReport,
  NoveltyStatsReport,
  SectorStatsReport,
  YearlyReadingsReport
} from '@/modules/dashboard/domain/models/report-dashboard.model';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class HttpReportDashboardRepository implements IReportDashboardRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getDashboardMetrics(date: string): Promise<DashboardMetrics> {
    const response = await this.client.get<ApiResponse<DashboardMetrics>>(
      `/Readings-Report-Dashboard/report/dashboard`,
      {
        params: { date }
      }
    );
    return response.data.data;
  }

  async getDailyReadingsReport(date: string): Promise<DailyReadingsReport[]> {
    const response = await this.client.get<ApiResponse<DailyReadingsReport[]>>(
      `/Readings-Report-Dashboard/report/daily/${date}`
    );
    return response.data.data;
  }

  async getYearlyReadingsReport(year: number): Promise<YearlyReadingsReport> {
    const response = await this.client.get<ApiResponse<YearlyReadingsReport>>(
      `/Readings-Report-Dashboard/report/yearly/${year}`
    );
    return response.data.data;
  }

  async getConnectionLastReadingsReport(
    cadastralKey: string,
    limit: number
  ): Promise<ConnectionLastReadingsReport[]> {
    const response = await this.client.get<
      ApiResponse<ConnectionLastReadingsReport[]>
    >(
      `/Readings-Report-Dashboard/report/connection-last-readings-10/${cadastralKey}`,
      {
        params: { limit }
      }
    );
    return response.data.data;
  }

  async getGlobalStatsReport(month: string): Promise<GlobalStatsReport> {
    const response = await this.client.get<ApiResponse<GlobalStatsReport>>(
      `/Readings-Report-Dashboard/report/stats/global/${month}`
    );
    return response.data.data;
  }

  async getDailyStatsReport(month: string): Promise<DailyStatsReport[]> {
    const response = await this.client.get<ApiResponse<DailyStatsReport[]>>(
      `/Readings-Report-Dashboard/report/stats/daily/${month}`
    );
    return response.data.data;
  }

  async getSectorStatsReport(month: string): Promise<SectorStatsReport[]> {
    const response = await this.client.get<ApiResponse<SectorStatsReport[]>>(
      `/Readings-Report-Dashboard/report/stats/sector/${month}`
    );
    return response.data.data;
  }

  async getNoveltyStatsReport(month: string): Promise<NoveltyStatsReport[]> {
    const response = await this.client.get<ApiResponse<NoveltyStatsReport[]>>(
      `/Readings-Report-Dashboard/report/stats/novelty/${month}`
    );
    return response.data.data;
  }

  async getAdvancedReportReadings(
    month: string
  ): Promise<AdvancedReportReadings[]> {
    const response = await this.client.get<
      ApiResponse<AdvancedReportReadings[]>
    >(`/Readings-Report-Dashboard/report/advanced-monthly/${month}`);
    return response.data.data;
  }
}
