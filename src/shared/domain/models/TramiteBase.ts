// ============================================================
// SHARED DOMAIN — TramiteBase types
//
// These primitives are shared across ALL trámite modules.
// No module may depend on another module's domain — only on this file.
// SRP: each type has exactly one conceptual responsibility.
// ============================================================

/** Classifies what kind of requirement an item is */
export type RequisitoTipo =
  | 'documento'   // A physical document to present
  | 'pago'        // A payment / fee
  | 'formulario'; // An official form to fill

/** Describes a single requirement for any tramite */
export interface Requisito {
  id: string;
  descripcion: string;
  tipo: RequisitoTipo;
  /** Cost in USD if applicable */
  costo?: number;
  /** Extra note or clarification */
  nota?: string;
  obligatorio: boolean;
  /** DB document type ID for backend mapping */
  documentTypeId?: number;
}

/** Who can apply for a tramite */
export type TipoPersona = 'natural' | 'juridica' | 'ambas';
