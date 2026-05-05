// src/shared/infrastructure/services/WebSocketService.ts
//
// Servicio WebSocket usando socket.io-client — mismo protocolo que el backend NestJS.
// El backend usa @nestjs/platform-socket.io, por lo que REQUIERE socket.io-client
// (no WebSocket nativo — son protocolos incompatibles).
//
// SRP : solo gestiona conexión y eventos
// OCP : nuevos eventos se añaden sin modificar esta clase
// DIP : los consumers dependen de IWebSocketService, no de socket.io directamente

import { io, Socket } from 'socket.io-client';

// ── Tipos de eventos — deben coincidir exactamente con el backend NestJS ─────
export interface ReadingUpdatedPayload {
  sectorId: number;
  month: string;
  type: 'created' | 'updated';
}

export interface AuditUpdatedPayload {
  sectorId: number;
  month: string;
  type: 'closed' | 'progress_changed';
}

export type WsEventMap = {
  'reading:updated': ReadingUpdatedPayload;
  'audit:updated': AuditUpdatedPayload;
};

// ── Interfaz abstracta (DIP) ─────────────────────────────────────────────────
export interface IWebSocketService {
  connect(baseUrl: string, token?: string): void;
  disconnect(): void;
  on<K extends keyof WsEventMap>(
    event: K,
    handler: (payload: WsEventMap[K]) => void
  ): () => void; // retorna función de limpieza (unsubscribe)
  get isConnected(): boolean;
}

// ── Implementación con socket.io-client ──────────────────────────────────────
type AnyHandler = (payload: unknown) => void;

class SocketIOWebSocketService implements IWebSocketService {
  private socket: Socket | null = null;
  private _connected = false;
  // Guardamos los handlers para poder limpiarlos en off()
  private readonly listeners = new Map<string, Set<AnyHandler>>();

  get isConnected() {
    return this._connected;
  }

  connect(baseUrl: string, token?: string): void {
    if (this.socket?.connected) return; // idempotente

    try {
      this.socket = io(`${baseUrl}/realtime`, {
        // Socket.IO REQUIERE polling primero para el handshake HTTP,
        // luego hace upgrade automático a websocket.
        // Usar solo 'websocket' sin polling inicial causa rechazo en servidores
        // HTTPS/WSS porque no hay sesión negociada previamente.
        transports: ['polling', 'websocket'],
        // Autenticación via auth object (más seguro que query params)
        auth: token ? { token } : {},
        // Reconexión automática con backoff
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 30000,
        reconnectionAttempts: Infinity, // reconectar indefinidamente
      });

      this.socket.on('connect', () => {
        this._connected = true;
        console.log('[WS] ✅ Conectado a', baseUrl, '/realtime');
        // Re-registrar handlers que estaban activos antes de la reconexión
        this.listeners.forEach((handlers, event) => {
          handlers.forEach((h) => this.socket?.on(event as string, h as any));
        });
      });

      this.socket.on('disconnect', (reason) => {
        this._connected = false;
        console.log('[WS] ❌ Desconectado:', reason);
      });

      this.socket.on('connect_error', (err) => {
        this._connected = false;
        console.warn('[WS] ⚠️ Error de conexión (polling de respaldo activo):', err.message);
      });
    } catch (err) {
      console.warn('[WS] ⚠️ No se pudo inicializar socket:', err);
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

    // Registrar en el socket si ya está conectado
    this.socket?.on(event as string, h as any);

    // Retorna función de cleanup — usada por useEffect al desmontar
    return () => {
      this.listeners.get(event)?.delete(h);
      this.socket?.off(event as string, h as any);
    };
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this._connected = false;
    this.listeners.clear();
  }
}

// ── Singleton global: una conexión compartida por toda la app ─────────────────
export const webSocketService: IWebSocketService = new SocketIOWebSocketService();
