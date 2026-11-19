/**
 * ConnectionState — Catalog of all valid connection state names as defined in
 * the `cat_estados_acometida` table.
 *
 * Uses a `const` object + derived union type instead of `enum` to comply with
 * the `erasableSyntaxOnly` TypeScript compiler option (TS 5.8+), which forbids
 * syntax that emits JavaScript (enums do, `as const` objects do not).
 *
 * Clean Architecture: pure domain concept, zero external dependencies.
 */
export const ConnectionState = {
  ACTIVA: 'ACTIVA',
  NUEVA_PENDIENTE: 'NUEVA_PENDIENTE',
  SUSPENDIDA_VOLUNTARIA: 'SUSPENDIDA_VOLUNTARIA',
  CORTADA_POR_MORA: 'CORTADA_POR_MORA',
  CLAUSURADA: 'CLAUSURADA',
  ANULADA_SOLICITUD: 'ANULADA_SOLICITUD',
  BAJA_ADMINISTRATIVA: 'BAJA_ADMINISTRATIVA',
  IRREGULAR_FRAUDE: 'IRREGULAR_FRAUDE',
  DAÑO_TECNICO: 'DAÑO_TECNICO',
  PAGO_PENDIENTE_RECONEXION: 'PAGO_PENDIENTE_RECONEXION',
  EN_REPARACION: 'EN_REPARACION',
  EN_REVISION_CATASTRAL: 'EN_REVISION_CATASTRAL'
} as const;

/** Union type of all valid state strings — replaces the enum type usage. */
export type ConnectionStateValue =
  (typeof ConnectionState)[keyof typeof ConnectionState];

/**
 * Groups of states for semantic classification.
 * Open/Closed Principle: extend by adding a new group without modifying existing ones.
 */

/** States where the connection is fully operational and readable. */
export const ACTIVE_STATES: ReadonlySet<string> = new Set([
  ConnectionState.ACTIVA
]);

/** States where reading is allowed but the connection has restrictions. */
export const READABLE_RESTRICTED_STATES: ReadonlySet<string> = new Set([
  ConnectionState.SUSPENDIDA_VOLUNTARIA,
  ConnectionState.CORTADA_POR_MORA,
  ConnectionState.IRREGULAR_FRAUDE,
  ConnectionState.DAÑO_TECNICO,
  ConnectionState.PAGO_PENDIENTE_RECONEXION,
  ConnectionState.EN_REPARACION
]);

/** States where the connection is permanently or definitively closed/blocked. */
export const CLOSED_STATES: ReadonlySet<string> = new Set([
  ConnectionState.CLAUSURADA,
  ConnectionState.ANULADA_SOLICITUD,
  ConnectionState.BAJA_ADMINISTRATIVA,
  ConnectionState.EN_REVISION_CATASTRAL,
  ConnectionState.NUEVA_PENDIENTE
]);
