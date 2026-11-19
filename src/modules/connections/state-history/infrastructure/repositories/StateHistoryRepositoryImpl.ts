import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateHistory, BulkStateChangeResult } from '../../domain/models/StateHistory';
import type { StateCatalogItem } from '../../domain/models/StateCatalog';
import type { StateSummaryItem } from '../../domain/models/StateSummary';
import type { CurrentConnectionState } from '../../domain/models/CurrentConnectionState';
import type { AllowedTransitions } from '../../domain/models/AllowedTransitions';
import type { ReversibleRecord } from '../../domain/models/ReversibleRecord';
import type { StateEventsGeoJSON } from '../../domain/models/GeoEvents';
import type { ChangeConnectionStateGatewayRequest } from '../../domain/dto/request/change-connection-state.gateway.request';
import type { BulkChangeConnectionStateGatewayRequest } from '../../domain/dto/request/bulk-change-connection-state.gateway.request';
import type { RevertStateHistoryGatewayRequest } from '../../domain/dto/request/revert-state-history.gateway.request';
import type { FilterStateHistoryGatewayRequest } from '../../domain/dto/request/filter-state-history.gateway.request';

export class StateHistoryRepositoryImpl implements StateHistoryRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async changeConnectionState(
    request: ChangeConnectionStateGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory> {
    if (file) {
      const formData = new FormData();
      formData.append('connectionId', request.connectionId);
      formData.append('newStateId', String(request.newStateId));
      formData.append('reason', request.reason);
      if (request.origin) formData.append('origin', request.origin);
      if (request.supportDocument) formData.append('supportDocument', request.supportDocument);
      if (request.observations) formData.append('observations', request.observations);
      if (request.latitude !== undefined && request.latitude !== null && !isNaN(Number(request.latitude))) {
        formData.append('latitude', String(request.latitude));
      }
      if (request.longitude !== undefined && request.longitude !== null && !isNaN(Number(request.longitude))) {
        formData.append('longitude', String(request.longitude));
      }
      if (request.effectiveDate) formData.append('effectiveDate', request.effectiveDate);
      formData.append('file', file);

      const response = await this.client.post<ApiResponse<StateHistory>>(
        '/state-history/change',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data;
    }

    const response = await this.client.post<ApiResponse<StateHistory>>(
      '/state-history/change',
      request
    );
    return response.data.data;
  }

  async bulkChangeConnectionState(
    request: BulkChangeConnectionStateGatewayRequest
  ): Promise<BulkStateChangeResult> {
    const response = await this.client.post<ApiResponse<BulkStateChangeResult>>(
      '/state-history/bulk-change',
      request
    );
    return response.data.data;
  }

  async revertStateHistory(
    request: RevertStateHistoryGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory> {
    if (file) {
      const formData = new FormData();
      formData.append('historialId', String(request.historialId));
      formData.append('reason', request.reason);
      if (request.supportDocument) formData.append('supportDocument', request.supportDocument);
      if (request.observations) formData.append('observations', request.observations);
      if (request.origin) formData.append('origin', request.origin);
      if (request.latitude !== undefined && request.latitude !== null && !isNaN(Number(request.latitude))) {
        formData.append('latitude', String(request.latitude));
      }
      if (request.longitude !== undefined && request.longitude !== null && !isNaN(Number(request.longitude))) {
        formData.append('longitude', String(request.longitude));
      }
      formData.append('file', file);

      const response = await this.client.post<ApiResponse<StateHistory>>(
        '/state-history/revert',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data;
    }

    const response = await this.client.post<ApiResponse<StateHistory>>(
      '/state-history/revert',
      request
    );
    return response.data.data;
  }

  private extractArray<T>(data: any): T[] {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.records)) return data.records;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  }

  async getConnectionHistory(
    connectionId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<StateHistory[]> {
    const response = await this.client.get<ApiResponse<any>>(
      `/state-history/connection/${encodeURIComponent(connectionId)}`,
      {
        params: { limit, offset }
      }
    );
    return this.extractArray<StateHistory>(response.data?.data);
  }

  async getCurrentConnectionState(
    connectionId: string
  ): Promise<CurrentConnectionState> {
    const response = await this.client.get<ApiResponse<CurrentConnectionState>>(
      `/state-history/connection/${encodeURIComponent(connectionId)}/current`
    );
    return response.data.data;
  }

  async getStateHistoryById(historialId: number): Promise<StateHistory> {
    const response = await this.client.get<ApiResponse<StateHistory>>(
      `/state-history/detail/${historialId}`
    );
    return response.data.data;
  }

  async getConnectionsByState(
    stateId: number,
    sectorId?: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(
      `/state-history/by-state/${stateId}`,
      {
        params: {
          ...(sectorId !== undefined ? { sectorId } : {}),
          limit,
          offset
        }
      }
    );
    const data = response.data?.data;
    return Array.isArray(data) ? data : data?.items || data?.records || data || [];
  }

  async getStateCatalog(): Promise<StateCatalogItem[]> {
    const response = await this.client.get<ApiResponse<any>>(
      '/state-history/catalog'
    );
    return this.extractArray<StateCatalogItem>(response.data?.data);
  }

  async getStateCatalogById(stateId: number): Promise<StateCatalogItem> {
    const response = await this.client.get<ApiResponse<StateCatalogItem>>(
      `/state-history/catalog/${stateId}`
    );
    return response.data.data;
  }

  async getStateSummary(): Promise<StateSummaryItem[]> {
    const response = await this.client.get<ApiResponse<any>>(
      '/state-history/summary'
    );
    return this.extractArray<StateSummaryItem>(response.data?.data);
  }

  async filterStateHistory(
    request: FilterStateHistoryGatewayRequest
  ): Promise<StateHistory[]> {
    const response = await this.client.post<ApiResponse<any>>(
      '/state-history/filter',
      request
    );
    return this.extractArray<StateHistory>(response.data?.data);
  }

  async getAllowedTransitions(connectionId: string): Promise<AllowedTransitions> {
    const response = await this.client.get<ApiResponse<AllowedTransitions>>(
      `/state-history/allowed-transitions/${encodeURIComponent(connectionId)}`
    );
    return response.data.data;
  }

  async getReversibleHistory(connectionId: string): Promise<ReversibleRecord> {
    const response = await this.client.get<ApiResponse<ReversibleRecord>>(
      `/state-history/reversible/${encodeURIComponent(connectionId)}`
    );
    return response.data.data;
  }

  async getStateEventsGeoJSON(params?: {
    stateId?: number;
    sectorId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<StateEventsGeoJSON> {
    const response = await this.client.get<ApiResponse<StateEventsGeoJSON>>(
      '/state-history/geo-events',
      {
        params: {
          ...(params?.stateId !== undefined ? { stateId: params.stateId } : {}),
          ...(params?.sectorId !== undefined ? { sectorId: params.sectorId } : {}),
          ...(params?.startDate ? { startDate: params.startDate } : {}),
          ...(params?.endDate ? { endDate: params.endDate } : {})
        }
      }
    );
    return response.data.data;
  }
}
