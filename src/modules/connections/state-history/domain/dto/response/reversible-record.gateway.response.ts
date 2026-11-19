import type { StateHistoryGatewayResponse } from './state-history.gateway.response';

export interface ReversibleRecordGatewayResponse {
  connectionId: string;
  isReversible: boolean;
  message: string;
  record: StateHistoryGatewayResponse | null;
}
