/**
 * DocumentRepository
 *
 * Interface representing the domain model for Document Operations.
 * Clean Architecture: Domain concerns only.
 */
export interface DocumentRepository {
  /**
   * Fetches the document as a Blob to be previewed inline.
   * Prefer direct document URL when available.
   * Fallback: GET /connection-documents/:documentId/preview
   */
  preview(documentId?: string, documentUrl?: string): Promise<Blob>;

  /**
   * Downloads the document as a Blob (attachment content disposition).
   * Prefer direct document URL when available.
   * Fallback: GET /connection-documents/:documentId/download-file
   */
  download(documentId?: string, documentUrl?: string): Promise<Blob>;
}
