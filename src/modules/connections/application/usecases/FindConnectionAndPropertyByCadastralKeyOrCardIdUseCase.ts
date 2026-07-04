import type { ConnectionAndPropertyResponse } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class FindConnectionAndPropertyByCadastralKeyOrCardIdUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(searchValue: string): Promise<ConnectionAndPropertyResponse[]> {
    return this.connectionRepository.findConnectionAndPropertyByCadastralKeyOrCardId(
      searchValue
    );
  }
}
