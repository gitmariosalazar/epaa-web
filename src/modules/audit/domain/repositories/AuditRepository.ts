import type { AuditRegistroResponse, AuditSessionResponse, GetAuditLogsParams, GetSessionLogsParams } from '../models/AuditModels';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export interface AuditRepository {
  getAuditLogs(params: GetAuditLogsParams): Promise<ApiResponse<AuditRegistroResponse[]>>;
  getSessionLogs(params: GetSessionLogsParams): Promise<ApiResponse<AuditSessionResponse[]>>;
}
