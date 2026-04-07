import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { GetAuditLogsParams, GetSessionLogsParams, AuditRegistroResponse, AuditSessionResponse } from '../../domain/models/AuditModels';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class AuditClient {
  private client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getAuditLogs(params: GetAuditLogsParams): Promise<ApiResponse<AuditRegistroResponse[]>> {
    // Map camelCase frontend params to snake_case backend params
    const apiParams = {
      limit: params.limit,
      offset: params.offset,
      table_name: params.tableName,
      operation: params.operation,
      user_id: params.userId,
      user_name: params.username,
      search_query: params.searchQuery,
      search_field: params.searchField,
      start_date: params.startDate,
      end_date: params.endDate,
    };
    const response = await this.client.get<ApiResponse<AuditRegistroResponse[]>>('/audit-gateway/get-logs', { params: apiParams });
    return response.data;
  }

  async getSessionLogs(params: GetSessionLogsParams): Promise<ApiResponse<AuditSessionResponse[]>> {
    // Map camelCase frontend params to snake_case backend params
    const apiParams = {
      limit: params.limit,
      offset: params.offset,
      user_id: params.userId,
      user_name: params.username,
      event: params.event,
      search_query: params.searchQuery,
      search_field: params.searchField,
      start_date: params.startDate,
      end_date: params.endDate,
    };
    const response = await this.client.get<ApiResponse<AuditSessionResponse[]>>('/audit-gateway/get-session-logs', { params: apiParams });
    return response.data;
  }
}
