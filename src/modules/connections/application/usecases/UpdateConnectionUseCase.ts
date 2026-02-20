import type { Connection } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class UpdateConnectionUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(
    id: string,
    connection: Partial<Connection>
  ): Promise<Connection> {
    return this.repository.updateConnection(id, connection);
  }
}
