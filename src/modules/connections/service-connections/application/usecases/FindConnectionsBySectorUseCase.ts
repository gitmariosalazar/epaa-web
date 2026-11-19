import type { Connection } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class FindConnectionsBySectorUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(
    sector: string,
    limit: number,
    offset: number
  ): Promise<Connection[]> {
    return this.connectionRepository.findConnectionsBySector(
      sector,
      limit,
      offset
    );
  }
}
