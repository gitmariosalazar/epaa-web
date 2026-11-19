export interface RevertStateHistoryGatewayRequest {
  historialId: number;
  reason: string;
  userId?: string;
  supportDocument?: string;
  observations?: string;
  origin?: 'WEB' | 'APP_MOVIL' | 'SISTEMA' | 'CUADRILLA' | string;
  latitude?: number;
  longitude?: number;
  file?: File | Blob | null;
}
