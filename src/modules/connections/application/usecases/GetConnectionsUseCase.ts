import type { Connection } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetConnectionsUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(limit: number, offset: number): Promise<Connection[]> {
    return this.connectionRepository.getConnections(limit, offset);
  }
}
