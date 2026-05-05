// src/shared/presentation/hooks/useRealtimeEvent.ts
//
// Hook genérico para suscribirse a eventos WebSocket.
// Encapsula la lógica de suscripción/cleanup — SRP.
// Los componentes nunca importan webSocketService directamente — DIP.

import { useEffect } from 'react';
import { webSocketService } from '@/shared/infrastructure/services/WebSocketService';
import type { WsEventMap } from '@/shared/infrastructure/services/WebSocketService';

/**
 * Escucha un evento WebSocket y ejecuta el handler cada vez que llega.
 * El cleanup se hace automáticamente al desmontar el componente.
 *
 * @example
 * useRealtimeEvent('reading:updated', (payload) => {
 *   if (payload.month === currentMonth) refetch();
 * });
 */
export function useRealtimeEvent<K extends keyof WsEventMap>(
  event: K,
  handler: (payload: WsEventMap[K]) => void
): void {
  useEffect(() => {
    const unsubscribe = webSocketService.on(event, handler);
    return unsubscribe; // cleanup automático al desmontar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]); // handler puede cambiar — usar useCallback en el caller si es necesario
}
