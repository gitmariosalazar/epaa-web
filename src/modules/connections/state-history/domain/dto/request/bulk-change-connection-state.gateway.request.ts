export interface BulkChangeConnectionStateGatewayRequest {
  connectionIds: string[];
  newStateId: number;
  reason: string;
  userId?: string;
  origin?: string;
  supportDocument?: string;
  observations?: string;
}
