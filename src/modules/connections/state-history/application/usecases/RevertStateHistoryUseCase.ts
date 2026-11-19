import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { RevertStateHistoryGatewayRequest } from '../../domain/dto/request/revert-state-history.gateway.request';
import type { StateHistory } from '../../domain/models/StateHistory';

export class RevertStateHistoryUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(
    request: RevertStateHistoryGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory> {
    if (!request.historialId || isNaN(Number(request.historialId))) {
      throw new Error('El ID de historial a revertir es obligatorio.');
    }
    if (!request.reason?.trim()) {
      throw new Error('La justificación o motivo de la reversión es obligatoria.');
    }

    return this.repository.revertStateHistory(request, file);
  }
}
