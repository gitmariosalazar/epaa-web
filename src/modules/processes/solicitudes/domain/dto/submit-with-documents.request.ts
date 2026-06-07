/**
 * DTO para la operación atómica de creación + carga de documentos + envío.
 * Se ejecuta en una sola transacción PostgreSQL:
 *   1. INSERT INTO acometidas.solicitud  → id_solicitud
 *   2. INSERT INTO acometidas.documento_adjunto (batch)
 *   3. fn_cambiar_estado_solicitud(id, 'DOCS_SUBMITTED', ...)
 */
export interface SubmitWithDocumentsRequest {
  clientId: string;
  userId: string;
  personType: string;
  connectionType: string;
  propertyUse: string;
  address: string;
  cadastralKey: string;
  longitude: number | null;
  latitude: number | null;
  additionalInfo: Record<string, any>;
  documents: SubmitDocumentItem[];
}

export interface SubmitDocumentItem {
  documentTypeId: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeInBytes: number;
  file?: File;
}

export interface SubmitWithDocumentsResponse {
  solicitudId:          string;
  /** Número legible generado por el trigger: SOL-EPAA-2026-0000035 */
  numeroSolicitud:      string;
  estado:               string;
  documentosInsertados: number;
  /** UUID del analista asignado por round-robin. null si no hay analistas activos. */
  analistaId:           string | null;
}
