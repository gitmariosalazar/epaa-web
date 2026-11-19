import type { Connection } from '../../domain/models/Connection';
import type {
  ConnectionRepository,
  CreateConnectionRequest
} from '../../domain/repositories/ConnectionRepository';

export class CreateConnectionUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(connection: CreateConnectionRequest): Promise<Connection> {
    return this.repository.createConnection(connection);
  }
}
