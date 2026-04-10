import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { GeneralCollectionRepository } from '../../domain/repositories/GeneralCollectionRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type {
  GeneralCollectionsParams,
  GeneralTrendCollectionsParams
} from '../../domain/dto/params/DataEntryParams';
import type {
  GeneralCollectionResponse,
  GeneralDailyGroupedReportResponse,
  GeneralKPIResponse,
  GeneralMonthlyGroupedReportResponse,
  GeneralMonthlyKPIResponse,
  GeneralYearlyGroupedReportResponse,
  GeneralYearlyKPIResponse
} from '../../domain/models/GenelarCollection';

export class GeneralCollectionRepositoryImpl implements GeneralCollectionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  private handleResponse<T>(data: any): T {
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data as T;
  }

  async getGeneralCollectionKPI(
    params: GeneralCollectionsParams
  ): Promise<GeneralKPIResponse | null> {
    const response = await this.client.get<ApiResponse<GeneralKPIResponse>>(
      `/accounting/get-general-collection-kpi`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralCollectionReport(
    params: GeneralCollectionsParams
  ): Promise<GeneralCollectionResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralCollectionResponse[]>>(
      `/accounting/get-general-collection-report`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralDailyCollectionGroupedReport(
    params: GeneralCollectionsParams
  ): Promise<GeneralDailyGroupedReportResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralDailyGroupedReportResponse[]>>(
      `/accounting/get-general-daily-collection-grouped-report`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralYearlyCollectionGroupedReport(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralYearlyGroupedReportResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralYearlyGroupedReportResponse[]>>(
      `/accounting/get-general-yearly-collection-grouped-report`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralMonthlyCollectionGroupedReport(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralMonthlyGroupedReportResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralMonthlyGroupedReportResponse[]>>(
      `/accounting/get-general-monthly-collection-grouped-report`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralYearlyCollectionKPI(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralYearlyKPIResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralYearlyKPIResponse[]>>(
      `/accounting/get-general-yearly-collection-kpi`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getGeneralMonthlyCollectionKPI(
    params: GeneralTrendCollectionsParams
  ): Promise<GeneralMonthlyKPIResponse[]> {
    const response = await this.client.get<ApiResponse<GeneralMonthlyKPIResponse[]>>(
      `/accounting/get-general-monthly-collection-kpi`,
      { params }
    );
    return this.handleResponse(response.data);
  }
}
