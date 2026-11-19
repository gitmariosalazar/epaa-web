export interface StateHistoryGatewayResponse {
  historialId: number;
  connectionId: string;
  previousStateId: number | null;
  previousStateName: string | null;
  newStateId: number;
  newStateName: string;
  allowsBilling: boolean;
  allowsReading: boolean;
  requiresInspection: boolean;
  changeDate: string;
  effectiveDate: string;
  reason: string | null;
  supportDocument: string | null;
  observations: string | null;
  userId: string;
  userEmail: string | null;
  userFullName: string | null;
  origin: string;
  ipAddress: string | null;
  deviceId: string | null;
  latitude: number | null;
  longitude: number | null;
  isReversal: boolean;
  originHistoryId: number | null;
  createdAt: string;
}

export interface BulkStateChangeGatewayResponse {
  totalRequested: number;
  totalUpdated: number;
  newStateId: number;
  newStateName: string;
  updatedConnectionIds: string[];
  failedConnectionIds: Array<{ connectionId: string; errorMessage: string }>;
}
