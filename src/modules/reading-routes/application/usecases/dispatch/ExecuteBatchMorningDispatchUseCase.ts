import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';
import type { BatchMorningDispatchRequest } from '../../../domain/dto/request/route-requests.dto';
import type { BatchDispatchResponse } from '../../../domain/dto/response/route-responses.dto';

export class ExecuteBatchMorningDispatchUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(request: BatchMorningDispatchRequest): Promise<BatchDispatchResponse> {
    return this.repository.executeBatchMorningDispatch(request);
  }
}
