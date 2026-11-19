import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { BulkChangeConnectionStateGatewayRequest } from '../../domain/dto/request/bulk-change-connection-state.gateway.request';
import type { BulkStateChangeResult } from '../../domain/models/StateHistory';

export class BulkChangeConnectionStateUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(
    request: BulkChangeConnectionStateGatewayRequest
  ): Promise<BulkStateChangeResult> {
    if (!request.connectionIds || request.connectionIds.length === 0) {
      throw new Error('Debe proporcionar al menos una acometida para la transición masiva.');
    }
    if (!request.newStateId || isNaN(Number(request.newStateId))) {
      throw new Error('El estado destino es obligatorio.');
    }
    if (!request.reason?.trim()) {
      throw new Error('La justificación de la transición masiva es obligatoria.');
    }

    return this.repository.bulkChangeConnectionState(request);
  }
}
