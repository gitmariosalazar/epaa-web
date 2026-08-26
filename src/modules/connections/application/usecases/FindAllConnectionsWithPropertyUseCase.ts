import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';
import type { ConnectionWithoutProperty } from '../../domain/models/Connection';

export class FindAllConnectionsWithPropertyUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(params: {
    limit: number;
    offset: number;
    query?: string;
  }): Promise<ConnectionWithoutProperty[]> {
    return await this.connectionRepository.findAllConnectionsWithProperty(
      params
    );
  }
}
