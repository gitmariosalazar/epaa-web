import type { FileRepository, FileCategory } from '../../domain/repositories/FileRepository';

/**
 * PreviewFileUseCase
 *
 * Application use case: retrieve a server-hosted file as a Blob for
 * inline previewing (iframe / img element).
 *
 * SRP: single responsibility — only orchestrates the preview fetch.
 * DIP: depends on the FileRepository interface (domain abstraction),
 *      never on the concrete HTTP implementation.
 *
 * @example
 * const useCase = new PreviewFileUseCase(new FileRepositoryImpl());
 * const blob    = await useCase.execute('incidents', 'photo.jpg');
 */
export class PreviewFileUseCase {
  private readonly repository: FileRepository;

  constructor(repository: FileRepository) {
    this.repository = repository;
  }

  /**
   * @param type     - File category (must match a key in backend FILE_TYPE_DIR_MAP).
   * @param filename - Filename with extension (e.g. 'photo.jpg', 'report.pdf').
   * @returns        Blob of the file with a resolved MIME type.
   */
  async execute(type: FileCategory, filename: string): Promise<Blob> {
    if (!type || !filename?.trim()) {
      throw new Error('File type and filename are required.');
    }
    return this.repository.preview(type, filename);
  }
}
