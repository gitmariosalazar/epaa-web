import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class SubmitCorrectionsUseCase {
  private readonly repository: SolicitudRepository;

  constructor(repository: SolicitudRepository) {
    this.repository = repository;
  }

  async execute(
    solicitudId: string,
    userId: string,
    files: File[],
    documentIds: string[]
  ): Promise<boolean> {
    if (!solicitudId) throw new Error('El ID de la solicitud es requerido');
    if (!userId) throw new Error('El ID de usuario es requerido');
    if (!files || files.length === 0) throw new Error('Debe proveer al menos un archivo');
    if (!documentIds || documentIds.length === 0) throw new Error('Debe proveer los IDs de los documentos');
    if (files.length !== documentIds.length) {
      throw new Error('La cantidad de archivos no coincide con la cantidad de documentos a corregir');
    }

    return await this.repository.submitCorrections(
      solicitudId,
      userId,
      files,
      documentIds
    );
  }
}
