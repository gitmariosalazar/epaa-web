import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class DeleteConnectionUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.deleteConnection(id);
  }
}
