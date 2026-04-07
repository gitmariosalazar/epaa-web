import type { AuditRepository } from '../../domain/repositories/AuditRepository';
import { AuditClient } from '../api/AuditClient';
import type { GetAuditLogsParams, GetSessionLogsParams, AuditRegistroResponse, AuditSessionResponse } from '../../domain/models/AuditModels';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class ApiAuditRepository implements AuditRepository {
  private apiClient: AuditClient;

  constructor() {
    this.apiClient = new AuditClient();
  }

  async getAuditLogs(params: GetAuditLogsParams): Promise<ApiResponse<AuditRegistroResponse[]>> {
    return this.apiClient.getAuditLogs(params);
  }

  async getSessionLogs(params: GetSessionLogsParams): Promise<ApiResponse<AuditSessionResponse[]>> {
    return this.apiClient.getSessionLogs(params);
  }
}
