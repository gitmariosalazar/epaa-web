import type {
  GeneralCollectionsParams,
  GeneralTrendCollectionsParams
} from '../dto/params/DataEntryParams';
import type {
  GeneralCollectionResponse,
  GeneralDailyGroupedReportResponse,
  GeneralKPIResponse,
  GeneralMonthlyGroupedReportResponse,
  GeneralMonthlyKPIResponse,
  GeneralYearlyGroupedReportResponse,
  GeneralYearlyKPIResponse
} from '../models/GenelarCollection';

export interface GeneralCollectionRepository {
  getGeneralCollectionKPI(
    params: GeneralCollectionsParams
  ): Promise<GeneralKPIResponse | null>;

  getGeneralCollectionReport(
    params: GeneralCollectionsParams
  ): Promise<GeneralCollectionResponse[]>;

  getGeneralDailyCollectionGroupedReport(
    params: GeneralCollectionsParams
  ): Promise<GeneralDailyGroupedReportResponse[]>;

  getGeneralYearlyCollectionGroupedReport(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralYearlyGroupedReportResponse[]>;

  getGeneralMonthlyCollectionGroupedReport(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralMonthlyGroupedReportResponse[]>;

  getGeneralYearlyCollectionKPI(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralYearlyKPIResponse[]>;

  getGeneralMonthlyCollectionKPI(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralMonthlyKPIResponse[]>;
}
