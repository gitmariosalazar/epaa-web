/**
 * Estrategias de pre-cierre de una OT según su ORIGEN.
 *
 * Espejo de order_completion_handlers.dart (Mobile).
 *
 *  - SRP: cada estrategia decide sólo para su origen.
 *  - OCP: nuevo origen ⇒ nueva estrategia + registro en `DEFAULT_STRATEGIES`
 *         y (si requiere UI) un renderer en `CompletionPreStepHost`.
 *  - LSP/ISP: todas cumplen la misma interfaz mínima.
 *  - DIP: la página consume `resolveCompletionPreStep`, no estrategias concretas.
 */
import type { OrdenTrabajoDetalle } from '../../domain/schemas/dto/response/work-orders.get.response';

/** Paso previo al cierre (unión discriminada, extensible). */
export type CompletionPreStep =
  | { type: 'NONE' }
  | { type: 'BLOCKED'; reason: string }
  | {
      type: 'RESOLVE_INCIDENT';
      incidentId: string;
      incidentCode: string | null;
      orderCode: string;
    }
  | {
      type: 'COMPLETION_DESCRIPTION';
      orderCode: string;
      workOrderId: string;
    };

export interface OrderCompletionStrategy {
  supports(orden: OrdenTrabajoDetalle): boolean;
  build(orden: OrdenTrabajoDetalle): CompletionPreStep;
}

const normalize = (v?: unknown) => String(v ?? '').trim().toUpperCase();

/** Lee un campo tolerando camelCase / snake_case / metadata. */
const pick = (o: OrdenTrabajoDetalle, ...keys: string[]): string | null => {
  const data = o as unknown as Record<string, unknown>;
  const meta = (data.metadata && typeof data.metadata === 'object'
    ? data.metadata
    : {}) as Record<string, unknown>;
  for (const k of keys) {
    for (const v of [data[k], meta[k]]) {
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    }
  }
  return null;
};

/** Origen INCIDENTE: resolver el incidente y completar la OT juntos. */
export const incidentCompletionStrategy: OrderCompletionStrategy = {
  supports: (o) => {
    const raw = o as unknown as Record<string, unknown>;
    return [o.origen, o.origenLabel, raw.origen_label, raw.tipoOrigen].some((v) =>
      normalize(v).includes('INCIDEN')
    );
  },
  build: (o) => {
    const incidentId = pick(
      o,
      'idEntidadOrigen',
      'id_entidad_origen',
      'incidentId',
      'idIncidente'
    );
    if (!incidentId) {
      return {
        type: 'BLOCKED',
        reason:
          'La OT proviene de un incidente pero no tiene el ID del incidente asociado.',
      };
    }
    return {
      type: 'RESOLVE_INCIDENT',
      incidentId,
      incidentCode: pick(
        o,
        'codigoEntidadOrigen',
        'codigo_entidad_origen',
        'incidentCode'
      ),
      orderCode: o.codigoOrden,
    };
  },
};

/** Estrategia por defecto (Null Object / Fallback): ingresar descripción y evidencias de cierre. */
export const defaultCompletionStrategy: OrderCompletionStrategy = {
  supports: () => true,
  build: (o) => ({
    type: 'COMPLETION_DESCRIPTION',
    orderCode: o.codigoOrden,
    workOrderId: o.idOrdenTrabajo,
  }),
};

export const DEFAULT_STRATEGIES: readonly OrderCompletionStrategy[] = [
  incidentCompletionStrategy,
  defaultCompletionStrategy,
  // Registrar aquí nuevos orígenes (RECLAMO, SOLICITUD, ...).
];

/** Devuelve el paso previo requerido; si ninguna aplica devuelve `COMPLETION_DESCRIPTION` por defecto. */
export const resolveCompletionPreStep = (
  orden: OrdenTrabajoDetalle,
  strategies: readonly OrderCompletionStrategy[] = DEFAULT_STRATEGIES
): CompletionPreStep =>
  strategies.find((s) => s.supports(orden))?.build(orden) ?? {
    type: 'COMPLETION_DESCRIPTION',
    orderCode: orden.codigoOrden,
    workOrderId: orden.idOrdenTrabajo,
  };
