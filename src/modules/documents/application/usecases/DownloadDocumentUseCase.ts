import type { DocumentRepository } from '../../domain/repositories/DocumentRepository';

/**
 * DownloadDocumentUseCase
 *
 * Implements the Single Responsibility Principle (SRP) to perform a single
 * action: downloading a document as a Blob (attachment mode).
 *
 * Adheres to Dependency Inversion Principle (DIP) by depending on the
 * DocumentRepository interface rather than a concrete implementation.
 */
export class DownloadDocumentUseCase {
  private readonly repository: DocumentRepository;

  constructor(repository: DocumentRepository) {
    this.repository = repository;
  }

  /**
   * Executes the usecase to download a document as a file attachment by its unique ID.
   *
   * @param documentId Unique identifier of the document to download.
   * @param documentUrl Public/relative document URL when available.
   * @returns Resolves with the Blob representing the downloaded file.
   */
  async execute(documentId?: string, documentUrl?: string): Promise<Blob> {
    const hasId = !!documentId?.trim();
    const hasUrl = !!documentUrl?.trim();

    if (!hasId && !hasUrl) {
      throw new Error('Document ID or document URL is required');
    }

    return this.repository.download(documentId, documentUrl);
  }
}
