export interface ConnectionUpdatedOrUpdatedPayload {
  connectionId: number;
  sector: number;
  action: 'created' | 'updated';
}

declare module '@/shared/domain/services/IRealtimeService' {
  interface WsEventMap {
    'connection.created': ConnectionUpdatedOrUpdatedPayload;
    'connection.updated': ConnectionUpdatedOrUpdatedPayload;
  }
}
