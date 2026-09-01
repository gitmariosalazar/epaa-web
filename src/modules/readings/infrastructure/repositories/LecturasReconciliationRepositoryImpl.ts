import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { LecturasReconciliationRepository } from '../../domain/repositories/lecturas-reconciliation.repository';
import type {
  ConsultarDetalleAuditoriaParams,
  DetalleAuditoriaResponse,
  DuplicateReconciliationRecord,
  ReconciliationMismatchRecord,
  ReconciliationPeriod,
  ReconciliationSummary,
  ResumenAuditoriaResponse
} from '../../domain/models/lecturas-reconciliation';

export class LecturasReconciliationRepositoryImpl implements LecturasReconciliationRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async migrateLecturas(months?: string[]): Promise<any> {
    const params = months && months.length > 0 ? `?months=${months.join(',')}` : '';
    const response = await this.client.post<ApiResponse<any>>(
      `/migration/lecturas/migrate${params}`,
      {}
    );
    return response.data.data;
  }

  async compareLecturas(months?: string[]): Promise<any> {
    const params = months && months.length > 0 ? `?months=${months.join(',')}` : '';
    const response = await this.client.post<ApiResponse<any>>(
      `/migration/lecturas/compare${params}`,
      {}
    );
    return response.data.data;
  }

  async getSummary(period: ReconciliationPeriod): Promise<ReconciliationSummary> {
    const response = await this.client.get<ApiResponse<ReconciliationSummary>>(
      `/migration/lecturas/reconciliation/summary?mesLectura=${period.mesLectura}`
    );
    return response.data.data;
  }

  async getDuplicates(
    period: ReconciliationPeriod
  ): Promise<DuplicateReconciliationRecord[]> {
    const response = await this.client.get<ApiResponse<DuplicateReconciliationRecord[]>>(
      `/migration/lecturas/reconciliation/duplicates?mesLectura=${period.mesLectura}`
    );
    return response.data.data;
  }

  async getMismatches(
    period: ReconciliationPeriod
  ): Promise<ReconciliationMismatchRecord[]> {
    const response = await this.client.get<ApiResponse<ReconciliationMismatchRecord[]>>(
      `/migration/lecturas/reconciliation/mismatches?mesLectura=${period.mesLectura}`
    );
    return response.data.data;
  }

  async getReconciliationKpis(
    params: ReconciliationPeriod
  ): Promise<ResumenAuditoriaResponse> {
    const response = await this.client.get<ApiResponse<ResumenAuditoriaResponse>>(
      `/migration/lecturas/reconciliation/kpis?mesLectura=${params.mesLectura}`
    );
    return response.data.data;
  }

  async getDiscrepanciesDetail(
    params: ConsultarDetalleAuditoriaParams
  ): Promise<DetalleAuditoriaResponse> {
    const response = await this.client.get<ApiResponse<DetalleAuditoriaResponse>>(
      `/migration/lecturas/reconciliation/discrepancies-detail?mesLectura=${params.periodo.mesLectura}&tipo_filtro=${params.tipo_filtro}`
    );
    return response.data.data;
  }
}
