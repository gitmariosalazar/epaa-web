// ============================================================
// APPLICATION — ValidateDocumentoUseCase (SRP)
// Single responsibility: validate a file before attaching it
// to a requisito. Business rules live here, not in the UI.
// ============================================================

import type { DocumentoValidation } from '../../domain/models/DocumentoAdjunto';

/** Supported MIME types */
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

/** Max file size: 10 MB */
const MAX_BYTES = 10 * 1024 * 1024;

export class ValidateDocumentoUseCase {
  execute(file: File): DocumentoValidation {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato no permitido. Use PDF, JPG, PNG o WEBP.'
      };
    }

    if (file.size > MAX_BYTES) {
      return {
        valid: false,
        error: `El archivo supera el límite de ${MAX_BYTES / 1024 / 1024} MB.`
      };
    }

    if (file.size === 0) {
      return { valid: false, error: 'El archivo está vacío.' };
    }

    return { valid: true };
  }
}
