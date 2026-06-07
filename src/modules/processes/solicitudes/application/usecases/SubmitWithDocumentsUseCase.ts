import type { SubmitWithDocumentsRequest, SubmitWithDocumentsResponse } from '../../domain/dto/submit-with-documents.request';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class SubmitWithDocumentsUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(dto: SubmitWithDocumentsRequest): Promise<SubmitWithDocumentsResponse> {
    return this.solicitudRepository.submitWithDocuments(dto);
  }
}