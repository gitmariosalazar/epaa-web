// src/shared/presentation/hooks/useRealtimeEvent.ts
//
// Hook genérico — suscribe a UN evento WebSocket tipado y limpia automáticamente.
//
// SRP : solo encapsula el ciclo suscripción/cleanup de un evento.
// DIP : depende de IRealtimeService a través del singleton, no de socket.io.
// OCP : soporta cualquier evento definido en WsEventMap sin modificación.

import { useEffect, useCallback } from 'react';
import { realtimeService } from '@/shared/infrastructure/services/WebSocketService';
import type { WsEventMap } from '@/shared/domain/services/IRealtimeService';

/**
 * Suscribe el `handler` al evento WebSocket `event`.
 * El cleanup ocurre automáticamente al desmontar el componente o al cambiar `event`.
 *
 * ⚠️ Envuelve el handler en `useCallback` en el componente llamador si necesitas
 *    que responda a cambios de estado (ver ejemplo 2).
 *
 * @example 1 — Handler estático
 * useRealtimeEvent('reading:updated', (payload) => {
 *   if (payload.month === currentMonth) refetch();
 * });
 *
 * @example 2 — Handler que depende de estado (estabilizado con useCallback)
 * const handleAudit = useCallback((payload: AuditUpdatedPayload) => {
 *   if (payload.sectorId === activeSector) refreshAudit();
 * }, [activeSector, refreshAudit]);
 * useRealtimeEvent('audit:updated', handleAudit);
 */
export function useRealtimeEvent<K extends keyof WsEventMap>(
  event: K,
  handler: (payload: WsEventMap[K]) => void
): void {
  // Estabilizamos la referencia del handler para que el efecto no se re-ejecute
  // en cada render, incluso si el caller no usó useCallback.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableHandler = useCallback(handler, []);

  useEffect(() => {
    const unsubscribe = realtimeService.on(event, stableHandler);
    return unsubscribe;
  }, [event, stableHandler]);
}
