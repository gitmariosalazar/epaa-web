import type { Connection } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class FindAllConnectionsByClientIdUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Connection[]> {
    return this.connectionRepository.findAllConnectionsByClientId(
      clientId,
      limit,
      offset
    );
  }
}
