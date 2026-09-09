export interface ReadingUpdatedPayload {
  /** ID del sector afectado */
  sectorId: number;
  /** Mes en formato 'YYYY-MM' o 'YYYY-MM-DD' */
  month: string;
  type: 'created' | 'updated';
}

export interface AuditUpdatedPayload {
  sectorId: number;
  month: string;
  type: 'closed' | 'progress_changed';
}

declare module '@/shared/domain/services/IRealtimeService' {
  interface WsEventMap {
    'reading:updated': ReadingUpdatedPayload;
    'audit:updated': AuditUpdatedPayload;
  }
}
