// src/shared/domain/services/IRealtimeService.ts
//
// Contrato de dominio para el servicio de tiempo real.
// ─ DIP  : los módulos de negocio dependen de esta interfaz, nunca de socket.io.
// ─ OCP  : agregar un evento = solo ampliar WsEventMap, sin tocar consumidores.
// ─ ISP  : interfaz mínima — connect/disconnect/on. Nada más.

export interface PermissionsUpdatedEventPayload {
  userId?: string;
  roleId?: number;
}

// ── Mapa de eventos tipado (Abierto a extensión) ─────────────────────────────
// Usa Declaration Merging: cada módulo puede extender esta interfaz para
// agregar sus propios eventos.
export interface WsEventMap {
  permissions_updated: PermissionsUpdatedEventPayload;
}

// ── Interfaz pública del servicio ─────────────────────────────────────────────
export interface IRealtimeService {
  /** Establece (o restablece) la conexión al namespace /realtime del backend. */
  connect(baseUrl: string, token?: string): void;

  /** Cierra la conexión y limpia todos los listeners. */
  disconnect(): void;

  /**
   * Suscribe un handler a un evento tipado.
   * @returns función de limpieza — llámala en el cleanup de useEffect.
   */
  on<K extends keyof WsEventMap>(
    event: K,
    handler: (payload: WsEventMap[K]) => void
  ): () => void;

  /** Indica si la conexión con el servidor está activa. */
  get isConnected(): boolean;
}
