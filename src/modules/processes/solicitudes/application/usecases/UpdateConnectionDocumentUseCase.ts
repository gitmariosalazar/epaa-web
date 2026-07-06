import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class UpdateConnectionDocumentUseCase {
  private readonly repository: SolicitudRepository;

  constructor(repository: SolicitudRepository) {
    this.repository = repository;
  }

  async execute(
    documentId: string,
    file: File,
    userId: string,
    requestId: string,
    documentTypeId: number
  ): Promise<boolean> {
    if (!documentId) throw new Error('El ID del documento es requerido');
    if (!file) throw new Error('El archivo es requerido');
    if (!userId) throw new Error('El ID de usuario es requerido');
    if (!requestId) throw new Error('El ID de solicitud es requerido');
    if (!documentTypeId) throw new Error('El tipo de documento es requerido');

    return await this.repository.updateConnectionDocument(
      documentId,
      file,
      userId,
      requestId,
      documentTypeId
    );
  }
}
