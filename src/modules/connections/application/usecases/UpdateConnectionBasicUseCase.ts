import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';
import type { UpdateConnectionBasicRequest } from '../../domain/models/UpdateConnectionBasic';

export class UpdateConnectionBasicUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(request: UpdateConnectionBasicRequest): Promise<void> {
    return this.repository.updateConnectionBasic(request);
  }
}
