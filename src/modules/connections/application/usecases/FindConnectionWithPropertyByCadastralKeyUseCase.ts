import type { ConnectionWithProperty } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class FindConnectionWithPropertyByCadastralKeyUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(cadastralKey: string): Promise<ConnectionWithProperty | null> {
    return this.connectionRepository.findConnectionWithPropertyByCadastralKey(
      cadastralKey
    );
  }
}
