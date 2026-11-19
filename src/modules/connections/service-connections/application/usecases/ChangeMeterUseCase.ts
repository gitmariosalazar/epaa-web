import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';
import type { ChangeMeterRequest } from '../../domain/models/MeterChange';

export class ChangeMeterUseCase {
  private readonly repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(request: ChangeMeterRequest): Promise<void> {
    return this.repository.changeMeter(request);
  }
}
