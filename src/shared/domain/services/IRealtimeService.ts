// src/shared/domain/services/IRealtimeService.ts
//
// Contrato de dominio para el servicio de tiempo real.
// ─ DIP  : los módulos de negocio dependen de esta interfaz, nunca de socket.io.
// ─ OCP  : agregar un evento = solo ampliar WsEventMap, sin tocar consumidores.
// ─ ISP  : interfaz mínima — connect/disconnect/on. Nada más.

// ── Payloads — deben coincidir exactamente con RealtimeService del backend ────

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

// ── Mapa de eventos tipado ────────────────────────────────────────────────────
// Para añadir un nuevo evento: solo agregar una entrada aquí.
// Todos los consumidores (hooks, contextos) lo heredan automáticamente.
export type WsEventMap = {
  'reading:updated': ReadingUpdatedPayload;
  'audit:updated': AuditUpdatedPayload;
};

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
