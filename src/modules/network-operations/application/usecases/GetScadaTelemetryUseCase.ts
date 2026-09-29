import type { NetworkOperationsRepository } from '../../domain/repositories/NetworkOperationsRepository';
import type { ScadaTelemetryResponse } from '../../domain/models/ScadaTelemetry';

export class GetScadaTelemetryUseCase {
  private readonly networkOperationsRepository: NetworkOperationsRepository;

  constructor(networkOperationsRepository: NetworkOperationsRepository) {
    this.networkOperationsRepository = networkOperationsRepository;
  }
  async execute(): Promise<ScadaTelemetryResponse[]> {
    return this.networkOperationsRepository.getScadaTelemetry();
  }
}
