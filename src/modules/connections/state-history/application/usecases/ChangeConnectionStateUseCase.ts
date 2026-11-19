import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { ChangeConnectionStateGatewayRequest } from '../../domain/dto/request/change-connection-state.gateway.request';
import type { StateHistory } from '../../domain/models/StateHistory';

export class ChangeConnectionStateUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(
    request: ChangeConnectionStateGatewayRequest,
    file?: File | Blob | null
  ): Promise<StateHistory> {
    if (!request.connectionId?.trim()) {
      throw new Error('El identificador de la acometida es obligatorio.');
    }
    if (!request.newStateId || isNaN(Number(request.newStateId))) {
      throw new Error('El estado destino es obligatorio.');
    }
    if (!request.reason?.trim()) {
      throw new Error('La justificación o motivo del cambio de estado es obligatoria.');
    }

    return this.repository.changeConnectionState(request, file);
  }
}
