// src/shared/infrastructure/services/realtime/index.ts
//
// Barrel público del módulo realtime.
// Los módulos de la app solo importan desde aquí — nunca de rutas internas.
//
// Uso:
//   import { realtimeService } from '@/shared/infrastructure/services/realtime';
//   import type { WsEventMap, ReadingUpdatedPayload } from '@/shared/infrastructure/services/realtime';

export { realtimeService, webSocketService } from '../WebSocketService';
export type {
  IRealtimeService,
  WsEventMap,
  ReadingUpdatedPayload,
  AuditUpdatedPayload,
} from '@/shared/domain/services/IRealtimeService';
