import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { EntryDataRepository } from '../../domain/repositories/EntryDataRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type {
  DailyCollectorSummary,
  DailyGroupedReport,
  DailyPaymentMethodReport,
  FullBreakdownReport
} from '../../domain/models/EntryData';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class EntryDataRepositoryImpl implements EntryDataRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getDailyCollectorSummary(
    params: DateRangeParams
  ): Promise<DailyCollectorSummary[]> {
    const response = await this.client.get<
      ApiResponse<DailyCollectorSummary[]>
    >(
      `/readings/get-daily-collector-summary/${params.startDate}/${params.endDate}`
    );
    return response.data.data;
  }

  async getDailyGroupedReport(
    params: DateRangeParams
  ): Promise<DailyGroupedReport[]> {
    const response = await this.client.get<ApiResponse<DailyGroupedReport[]>>(
      `/readings/get-daily-grouped-report/${params.startDate}/${params.endDate}`
    );
    return response.data.data;
  }

  async getDailyPaymentMethodReport(
    params: DateRangeParams
  ): Promise<DailyPaymentMethodReport[]> {
    const response = await this.client.get<
      ApiResponse<DailyPaymentMethodReport[]>
    >(
      `/readings/get-daily-payment-method-report/${params.startDate}/${params.endDate}`
    );
    return response.data.data;
  }

  async getFullBreakdownReport(
    params: DateRangeParams
  ): Promise<FullBreakdownReport[]> {
    const response = await this.client.get<ApiResponse<FullBreakdownReport[]>>(
      `/readings/get-full-breakdown-report/${params.startDate}/${params.endDate}`
    );
    return response.data.data;
  }
}
