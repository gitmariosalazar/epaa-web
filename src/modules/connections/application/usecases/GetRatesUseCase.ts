import type { Rate } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetRatesUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Rate[]> {
    return this.repository.getRates();
  }
}
