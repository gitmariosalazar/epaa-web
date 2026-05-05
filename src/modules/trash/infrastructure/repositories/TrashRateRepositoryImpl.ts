import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { TrashRateAuditReportParams } from '../../domain/dto/params/TrashRateAuditParams';
import type {
  ClientTrashDetailRow,
  CreditNoteRow,
  TrashDashboardKpi,
  MissingValorRow,
  MonthlySummaryRow,
  TopDebtorRow,
  TrashRateAuditRow,
  CollectorPerformanceKPI,
  TrashRateKPI,
  DailyCollectorDetail
} from '../../domain/models/trash-rate-report.model';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class TrashRateRepositoryImpl implements InterfaceTrashRateReportRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getActiveCreditNotes(
    params: DateRangeParams
  ): Promise<CreditNoteRow[]> {
    const response = await this.client.get<ApiResponse<CreditNoteRow[]>>(
      '/trash-rate-report/credit-notes',
      { params }
    );
    return response.data.data;
  }

  async getClientDetailSearch(
    searchParams: string
  ): Promise<ClientTrashDetailRow[]> {
    const response = await this.client.get<ApiResponse<ClientTrashDetailRow[]>>(
      '/trash-rate-report/client-trash-detail',
      { params: { searchParams } }
    );
    return response.data.data;
  }

  async getDashboardKPITrashRate(
    params: DateRangeParams
  ): Promise<TrashDashboardKpi[]> {
    const response = await this.client.get<ApiResponse<TrashDashboardKpi[]>>(
      '/trash-rate-report/trash-dashboard-kpi',
      { params }
    );
    return response.data.data;
  }

  async getMissingValorBills(
    params: DateRangeParams
  ): Promise<MissingValorRow[]> {
    const response = await this.client.get<ApiResponse<MissingValorRow[]>>(
      '/trash-rate-report/missing-valor-records',
      { params }
    );
    return response.data.data;
  }

  async getMonthlySummaryReport(
    params: DateRangeParams
  ): Promise<MonthlySummaryRow[]> {
    const response = await this.client.get<ApiResponse<MonthlySummaryRow[]>>(
      '/trash-rate-report/monthly-summary',
      { params }
    );
    return response.data.data;
  }

  async getTopDebtorReport(params: DateRangeParams): Promise<TopDebtorRow[]> {
    const response = await this.client.get<ApiResponse<TopDebtorRow[]>>(
      '/trash-rate-report/top-debtors',
      { params }
    );
    return response.data.data;
  }

  async getTrashRateAuditReport(
    params: TrashRateAuditReportParams
  ): Promise<TrashRateAuditRow[]> {
    const response = await this.client.get<ApiResponse<TrashRateAuditRow[]>>(
      '/trash-rate-report/trash-rate-audit-report',
      { params }
    );
    return response.data.data;
  }

  async getCollectorPerformanceKPI(
    params: DateRangeParams
  ): Promise<CollectorPerformanceKPI[]> {
    const response = await this.client.get<
      ApiResponse<CollectorPerformanceKPI[]>
    >('/trash-rate-report/collector-performance-kpi', { params });
    return response.data.data;
  }

  async getDailyCollectorDetail(
    params: DateRangeParams
  ): Promise<DailyCollectorDetail[]> {
    const response = await this.client.get<ApiResponse<DailyCollectorDetail[]>>(
      '/trash-rate-report/daily-collector-detail',
      { params }
    );
    return response.data.data;
  }

  async getTrashRateKPI(params: DateRangeParams): Promise<TrashRateKPI[]> {
    const response = await this.client.get<ApiResponse<TrashRateKPI[]>>(
      '/trash-rate-report/trash-rate-kpi',
      { params }
    );
    return response.data.data;
  }
}
