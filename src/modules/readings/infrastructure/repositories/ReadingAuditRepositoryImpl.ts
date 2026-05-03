import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type {
  AuditSector,
  AuditSectorHistory,
  CloseAuditSector,
  InitializeAudit
} from '../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../domain/repositories/ReadingAuditRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/**
 * ReadingAuditRepositoryImpl
 *
 * Concrete implementation of ReadingAuditRepository that communicates with
 * the backend audit endpoints via HTTP.
 *
 * Routes verified against:
 *   reading-audit.gateway.controller.ts  (@Controller('readings/audit'))
 *
 * Clean Architecture: lives in the Infrastructure layer.
 * SOLID — DIP: depends on HttpClientInterface abstraction, not the concrete client.
 */
export class ReadingAuditRepositoryImpl implements ReadingAuditRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  /**
   * POST /readings/audit/initialize/:month
   * Triggers pr_generar_auditoria_mensual() for all sectors in the month.
   */
  async initializeMonthlyAudit(month: string): Promise<InitializeAudit> {
    const response = await this.client.post<ApiResponse<InitializeAudit>>(
      `/readings/audit/initialize/${month}`,
      {}
    );
    return response.data.data;
  }

  /**
   * GET /readings/audit/by-month/:month
   * Returns all sector audit records for the given month.
   */
  async getAuditByMonth(month: string): Promise<AuditSector[]> {
    const response = await this.client.get<ApiResponse<AuditSector[]>>(
      `/readings/audit/by-month/${month}`
    );
    return response.data.data;
  }

  /**
   * GET /readings/audit/by-sector/:sector/:month
   * Returns the audit detail for a single sector in the given month.
   */
  async getAuditBySectorAndMonth(
    sector: number,
    month: string
  ): Promise<AuditSector | null> {
    const response = await this.client.get<ApiResponse<AuditSector | null>>(
      `/readings/audit/by-sector/${sector}/${month}`
    );
    return response.data.data;
  }

  /**
   * POST /readings/audit/close/:sector/:month
   * Supervised closure of a sector audit for the given month.
   */
  async closeAuditSector(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string
  ): Promise<CloseAuditSector> {
    const response = await this.client.post<ApiResponse<CloseAuditSector>>(
      `/readings/audit/close/${sector}/${month}`,
      { supervisorId, observaciones }
    );
    return response.data.data;
  }

  /**
   * GET /readings/audit/history/:sector?months=N
   * Returns the audit history for a sector over the last N months (default 12).
   */
  async getAuditHistoryBySector(
    sector: number,
    months?: number
  ): Promise<AuditSectorHistory[]> {
    const query = months ? `?months=${months}` : '';
    const response = await this.client.get<ApiResponse<AuditSectorHistory[]>>(
      `/readings/audit/history/${sector}${query}`
    );
    return response.data.data;
  }
}
