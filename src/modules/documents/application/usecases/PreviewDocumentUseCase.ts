import type { DocumentRepository } from '../../domain/repositories/DocumentRepository';

/**
 * PreviewDocumentUseCase
 *
 * Implements the Single Responsibility Principle (SRP) to perform a single
 * action: retrieving a document's Blob for inline previewing.
 *
 * Adheres to Dependency Inversion Principle (DIP) by depending on the
 * DocumentRepository interface rather than a concrete implementation.
 */
export class PreviewDocumentUseCase {
  private readonly repository: DocumentRepository;

  constructor(repository: DocumentRepository) {
    this.repository = repository;
  }

  /**
   * Executes the usecase to preview a document by its unique ID.
   *
   * @param documentId Unique identifier of the document to preview.
   * @param documentUrl Public/relative document URL when available.
   * @returns Resolves with the Blob representing the file inline.
   */
  async execute(documentId?: string, documentUrl?: string): Promise<Blob> {
    const hasId = !!documentId?.trim();
    const hasUrl = !!documentUrl?.trim();

    if (!hasId && !hasUrl) {
      throw new Error('Document ID or document URL is required');
    }

    return this.repository.preview(documentId, documentUrl);
  }
}
