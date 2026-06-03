// ============================================================
// DOMAIN — DocumentoAdjunto
// Represents a file attached to a specific requisito.
// Immutable value object — no identity, only structure.
// ============================================================

export interface DocumentoAdjunto {
  /** ID del requisito al que pertenece */
  requisitoId: string;
  /** Archivo seleccionado (client-side) */
  file: File;
  /** Estado del adjunto */
  estado: 'pendiente' | 'subiendo' | 'subido' | 'error';
  /** URL devuelta por el servidor (available after upload) */
  url?: string;
  /** Mensaje de error si aplica */
  errorMsg?: string;
}

/** Map: requisitoId → DocumentoAdjunto */
export type DocumentosMap = Record<string, DocumentoAdjunto>;

/** Validation result for a single document */
export interface DocumentoValidation {
  valid: boolean;
  error?: string;
}
