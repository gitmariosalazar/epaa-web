export interface ChangeConnectionStateGatewayRequest {
  connectionId: string;
  newStateId: number;
  reason: string;
  userId?: string;
  origin?: 'WEB' | 'APP_MOVIL' | 'CUADRILLA' | 'SISTEMA' | 'INTEGRACION' | 'MIGRACION';
  supportDocument?: string;
  observations?: string;
  latitude?: number;
  longitude?: number;
  effectiveDate?: string;
  file?: File | Blob | null;
}
