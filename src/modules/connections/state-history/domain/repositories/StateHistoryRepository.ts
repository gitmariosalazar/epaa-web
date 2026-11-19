import type { StateHistory, BulkStateChangeResult } from '../models/StateHistory';
import type { StateCatalogItem } from '../models/StateCatalog';
import type { StateSummaryItem } from '../models/StateSummary';
import type { CurrentConnectionState } from '../models/CurrentConnectionState';
import type { AllowedTransitions } from '../models/AllowedTransitions';
import type { ReversibleRecord } from '../models/ReversibleRecord';
import type { StateEventsGeoJSON } from '../models/GeoEvents';
import type { ChangeConnectionStateGatewayRequest } from '../dto/request/change-connection-state.gateway.request';
import type { BulkChangeConnectionStateGatewayRequest } from '../dto/request/bulk-change-connection-state.gateway.request';
import type { RevertStateHistoryGatewayRequest } from '../dto/request/revert-state-history.gateway.request';
import type { FilterStateHistoryGatewayRequest } from '../dto/request/filter-state-history.gateway.request';

export interface StateHistoryRepository {
  changeConnectionState(
    request: ChangeConnectionStateGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory>;

  bulkChangeConnectionState(
    request: BulkChangeConnectionStateGatewayRequest
  ): Promise<BulkStateChangeResult>;

  revertStateHistory(
    request: RevertStateHistoryGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory>;

  getConnectionHistory(
    connectionId: string,
    limit?: number,
    offset?: number
  ): Promise<StateHistory[]>;

  getCurrentConnectionState(
    connectionId: string
  ): Promise<CurrentConnectionState>;

  getStateHistoryById(historialId: number): Promise<StateHistory>;

  getConnectionsByState(
    stateId: number,
    sectorId?: number,
    limit?: number,
    offset?: number
  ): Promise<any>;

  getStateCatalog(): Promise<StateCatalogItem[]>;

  getStateCatalogById(stateId: number): Promise<StateCatalogItem>;

  getStateSummary(): Promise<StateSummaryItem[]>;

  filterStateHistory(
    request: FilterStateHistoryGatewayRequest
  ): Promise<StateHistory[]>;

  getAllowedTransitions(connectionId: string): Promise<AllowedTransitions>;

  getReversibleHistory(connectionId: string): Promise<ReversibleRecord>;

  getStateEventsGeoJSON(params?: {
    stateId?: number;
    sectorId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<StateEventsGeoJSON>;
}
