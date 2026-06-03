// ============================================================
// DOMAIN — Tramite Entities
// Core business models — no framework or infrastructure deps.
// ============================================================

/** Classification of a requirement item */
export type RequisitoTipo =
  | 'documento'    // A physical document to present
  | 'pago'         // A payment/fee
  | 'formulario';  // An official form to fill

/** Describes a single requirement for a tramite */
export interface Requisito {
  id: string;
  descripcion: string;
  tipo: RequisitoTipo;
  /** Cost in USD, if applicable */
  costo?: number;
  /** Extra clarification / note */
  nota?: string;
  obligatorio: boolean;
  /** DB document type ID for backend mapping */
  documentTypeId?: number;
}

/** Who can apply for this tramite */
export type TipoPersona = 'natural' | 'juridica' | 'ambas';

/** Top-level category of tramite */
export type CategoriaTramite =
  | 'nueva_acometida'
  | 'cambio_titular'
  | 'suspension'
  | 'beneficio'
  | 'alcantarillado'
  | 'medidor'
  | 'rehabilitacion'
  | 'certificado';

/** Full definition of a tramite type */
export interface Tramite {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaTramite;
  tipoPersona: TipoPersona;
  requisitos: Requisito[];
  /** Total indicative cost (sum of fees) */
  costoTotal: number;
  /** Approximate processing time in business days */
  tiempoEstimadoDias?: number;
  icono: string;          // Lucide icon name or emoji key
  color: string;          // CSS color for theming
  activo: boolean;
}

/** A citizen's submitted tramite request */
export interface SolicitudTramite {
  id: string;
  tramiteId: string;
  tramiteNombre: string;
  fechaSolicitud: string;   // ISO date
  estado: EstadoSolicitud;
  titularNombre: string;
  titularCedula: string;
  titularEmail: string;
  observaciones?: string;
}

export type EstadoSolicitud =
  | 'pendiente'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'en_proceso'
  | 'completada';
