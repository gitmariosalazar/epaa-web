export type StateHistoryOrigin =
  | 'WEB'
  | 'APP_MOVIL'
  | 'CUADRILLA'
  | 'SISTEMA'
  | 'INTEGRACION'
  | 'MIGRACION'
  | string;

export interface StateHistory {
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
  origin: StateHistoryOrigin;
  ipAddress: string | null;
  deviceId: string | null;
  latitude: number | null;
  longitude: number | null;
  isReversal: boolean;
  originHistoryId: number | null;
  createdAt: string;
}

export interface BulkStateChangeResult {
  totalRequested: number;
  totalUpdated: number;
  newStateId: number;
  newStateName: string;
  updatedConnectionIds: string[];
  failedConnectionIds: Array<{ connectionId: string; errorMessage: string }>;
}
