// src/shared/presentation/hooks/useRealtimeEvent.ts
//
// Hook genérico — suscribe a UN evento WebSocket tipado y limpia automáticamente.
//
// SRP : solo encapsula el ciclo suscripción/cleanup de un evento.
// DIP : depende de IRealtimeService a través del singleton, no de socket.io.
// OCP : soporta cualquier evento definido en WsEventMap sin modificación.

import { useEffect, useRef } from 'react';
import { realtimeService } from '@/shared/infrastructure/services/WebSocketService';
import type { WsEventMap } from '@/shared/domain/services/IRealtimeService';

/**
 * Suscribe el `handler` al evento WebSocket `event`.
 * El cleanup ocurre automáticamente al desmontar el componente o al cambiar `event`.
 * 
 * NOTA: Utiliza el patrón `useRef` internamente, por lo que SIEMPRE tendrás 
 * acceso al estado más reciente del componente sin sufrir "stale closures" y 
 * sin reconectar el WebSocket innecesariamente.
 */
export function useRealtimeEvent<K extends keyof WsEventMap>(
  event: K,
  handler: (payload: WsEventMap[K]) => void
): void {
  // Guardamos la referencia más reciente del handler
  const handlerRef = useRef(handler);

  // Actualizamos la ref cada vez que el componente renderiza con un nuevo handler
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // La función interna de suscripción siempre llamará a la versión más reciente
    const subscriptionCallback = (payload: WsEventMap[K]) => {
      handlerRef.current(payload);
    };

    const unsubscribe = realtimeService.on(event, subscriptionCallback);
    return unsubscribe;
  }, [event]);
}
