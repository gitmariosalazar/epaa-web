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
} from '../models/report-dashboard.model';

export interface IReportDashboardRepository {
  getDashboardMetrics(date: string): Promise<DashboardMetrics>;
  getDailyReadingsReport(date: string): Promise<DailyReadingsReport[]>;
  getYearlyReadingsReport(year: number): Promise<YearlyReadingsReport>;
  getConnectionLastReadingsReport(
    cadastralKey: string,
    limit: number
  ): Promise<ConnectionLastReadingsReport[]>;
  getGlobalStatsReport(month: string): Promise<GlobalStatsReport>;
  getDailyStatsReport(month: string): Promise<DailyStatsReport[]>;
  getSectorStatsReport(month: string): Promise<SectorStatsReport[]>;
  getNoveltyStatsReport(month: string): Promise<NoveltyStatsReport[]>;
  getAdvancedReportReadings(month: string): Promise<AdvancedReportReadings[]>;
}
