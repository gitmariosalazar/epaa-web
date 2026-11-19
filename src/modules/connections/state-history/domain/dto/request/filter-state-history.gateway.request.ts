export interface FilterStateHistoryGatewayRequest {
  connectionId?: string;
  stateId?: number;
  userId?: string;
  origin?: string;
  isReversal?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
