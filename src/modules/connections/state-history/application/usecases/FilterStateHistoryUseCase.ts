import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { FilterStateHistoryGatewayRequest } from '../../domain/dto/request/filter-state-history.gateway.request';
import type { StateHistory } from '../../domain/models/StateHistory';

export class FilterStateHistoryUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(request: FilterStateHistoryGatewayRequest): Promise<StateHistory[]> {
    return this.repository.filterStateHistory(request);
  }
}
