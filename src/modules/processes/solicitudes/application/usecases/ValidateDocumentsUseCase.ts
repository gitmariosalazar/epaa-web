import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export interface DocumentDecision {
  documentId: string;
  validationStatus: 'APROBADO' | 'RECHAZADO';
  observation?: string;
}

export class ValidateDocumentsUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(
    solicitudId: string,
    decisions: DocumentDecision[],
    validatorId: string
  ): Promise<void> {
    if (!solicitudId) {
      throw new Error('El ID de la solicitud es requerido');
    }
    if (!decisions || decisions.length === 0) {
      throw new Error('Debe proveer al menos una decisión de validación');
    }
    if (!validatorId) {
      throw new Error('El ID del validador es requerido');
    }
    await this.solicitudRepository.validateDocuments(
      solicitudId,
      decisions,
      validatorId
    );
  }
}
