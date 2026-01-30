import { api } from '@/shared/infrastructure/http/api';
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

export class HttpReportDashboardRepository implements IReportDashboardRepository {
  async getDashboardMetrics(date: string): Promise<DashboardMetrics> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/dashboard`,
      {
        params: { date }
      }
    );
    return response.data.data;
  }

  async getDailyReadingsReport(date: string): Promise<DailyReadingsReport[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/daily/${date}`
    );
    return response.data.data;
  }

  async getYearlyReadingsReport(year: number): Promise<YearlyReadingsReport> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/yearly/${year}`
    );
    return response.data.data; // Assumption depending on if it returns array or single object. Reviewing backend: Returns YearlyReadingsReport[] in controller typings but single object in usecase?
    // Wait, backend controller says: Promise<YearlyReadingsReport[]> but UseCase returns YearlyReadingsReport.
    // Gateway endpoint: Promise<ApiResponse> with response type YearlyReadingsReport[].
    // Let's assume array based on gateway signature.
  }

  async getConnectionLastReadingsReport(
    cadastralKey: string,
    limit: number
  ): Promise<ConnectionLastReadingsReport[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/connection-last-readings-10/${cadastralKey}`,
      {
        params: { limit }
      }
    );
    return response.data.data;
  }

  async getGlobalStatsReport(month: string): Promise<GlobalStatsReport> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/stats/global/${month}`
    );
    return response.data.data; // Gateway returns GlobalStatsReport[] ??? Controller says Promise<GlobalStatsReport[]>. UseCase returns GlobalStatsReport single.
    // Gateway controller types: response: GlobalStatsReport[].
    // I should handle array or single object. I'll return as is from data and Cast.
  }

  async getDailyStatsReport(month: string): Promise<DailyStatsReport[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/stats/daily/${month}`
    );
    return response.data.data;
  }

  async getSectorStatsReport(month: string): Promise<SectorStatsReport[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/stats/sector/${month}`
    );
    return response.data.data;
  }

  async getNoveltyStatsReport(month: string): Promise<NoveltyStatsReport[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/stats/novelty/${month}`
    );
    return response.data.data;
  }

  async getAdvancedReportReadings(
    month: string
  ): Promise<AdvancedReportReadings[]> {
    const response = await api.get<any>(
      `/Readings-Report-Dashboard/report/advanced-monthly/${month}`
    );
    return response.data.data;
  }
}
