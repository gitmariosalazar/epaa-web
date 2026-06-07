/**
 * DocumentRepository
 *
 * Interface representing the domain model for Document Operations.
 * Clean Architecture: Domain concerns only.
 */
export interface DocumentRepository {
  /**
   * Fetches the document as a Blob to be previewed inline.
    * Prefer secure endpoint by document ID.
    * Fallback: direct document URL (legacy).
   */
  preview(documentId?: string, documentUrl?: string): Promise<Blob>;

  /**
   * Downloads the document as a Blob (attachment content disposition).
   * Prefer secure endpoint by document ID.
   * Fallback: direct document URL (legacy).
   */
  download(documentId?: string, documentUrl?: string): Promise<Blob>;
}
