// src/shared/infrastructure/services/WebSocketService.ts
//
// Implementación de IRealtimeService usando socket.io-client.
// El backend usa @nestjs/platform-socket.io → REQUIERE socket.io-client
// (no WebSocket nativo — protocolos incompatibles).
//
// SRP : solo gestiona conexión y delegación de eventos.
// OCP : nuevos eventos se añaden en WsEventMap (dominio), sin tocar esta clase.
// DIP : exporta el singleton como IRealtimeService — los consumidores nunca
//       importan SocketIORealtimeService directamente.

import { io, Socket } from 'socket.io-client';
import type { IRealtimeService, WsEventMap } from '@/shared/domain/services/IRealtimeService';

// Re-exportamos desde dominio para que los consumers solo necesiten un import.
export type { IRealtimeService, WsEventMap, ReadingUpdatedPayload, AuditUpdatedPayload }
  from '@/shared/domain/services/IRealtimeService';

// ── Implementación interna (no se exporta la clase, solo el singleton) ────────
type AnyHandler = (payload: unknown) => void;

class SocketIORealtimeService implements IRealtimeService {
  private socket: Socket | null = null;
  private _connected = false;

  /**
   * Almacena los handlers activos para re-registrarlos tras una reconexión.
   * La clave es el nombre del evento; el valor es el Set de handlers.
   */
  private readonly listeners = new Map<string, Set<AnyHandler>>();

  get isConnected(): boolean {
    return this._connected;
  }

  connect(baseUrl: string, token?: string): void {
    if (this.socket?.connected) return; // idempotente

    try {
      this.socket = io(`${baseUrl}/realtime`, {
        // Socket.IO necesita polling para el handshake inicial (HTTPS/WSS).
        // Luego hace upgrade automático a WebSocket.
        transports: ['polling', 'websocket'],
        auth: token ? { token } : {},
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 30_000,
        reconnectionAttempts: Infinity,
      });

      this.socket.on('connect', () => {
        this._connected = true;
        console.log('[Realtime] ✅ Conectado a', baseUrl, '/realtime');
        // Re-registrar handlers activos tras reconexión automática
        this.listeners.forEach((handlers, event) => {
          handlers.forEach((h) => this.socket?.on(event, h as any));
        });
      });

      this.socket.on('disconnect', (reason) => {
        this._connected = false;
        console.log('[Realtime] ❌ Desconectado:', reason);
      });

      this.socket.on('connect_error', (err) => {
        this._connected = false;
        console.warn('[Realtime] ⚠️ Error de conexión:', err.message);
      });
    } catch (err) {
      console.warn('[Realtime] ⚠️ No se pudo inicializar socket:', err);
    }
  }

  on<K extends keyof WsEventMap>(
    event: K,
    handler: (payload: WsEventMap[K]) => void
  ): () => void {
    const h = handler as AnyHandler;

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(h);

    // Registrar en el socket activo si ya está conectado
    this.socket?.on(event as string, h as any);

    // Cleanup — usado por useEffect al desmontar o por useRealtimeEvent
    return () => {
      this.listeners.get(event)?.delete(h);
      this.socket?.off(event as string, h as any);
    };
  }

  disconnect(): void {
    if (this.socket) {
      // Desactivar reconexión automática ANTES de desconectar.
      // Sin esto, socket.io reconecta solo en background sin token
      // mostrando "Client connected without authentication".
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
      this.socket = null;
    }
    this._connected = false;
    this.listeners.clear();
  }
}

// ── Singleton global: una única conexión socket para toda la app ──────────────
// Tipado como IRealtimeService (abstracción de dominio) — no como la clase concreta.
export const realtimeService: IRealtimeService = new SocketIORealtimeService();

// Alias de compatibilidad — preserva imports existentes sin romper nada
/** @deprecated Usa `realtimeService` en nuevos archivos */
export const webSocketService = realtimeService;
