import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateEventsGeoJSON } from '../../domain/models/GeoEvents';

export class GetStateEventsGeoJSONUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(params?: {
    stateId?: number;
    sectorId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<StateEventsGeoJSON> {
    return this.repository.getStateEventsGeoJSON(params);
  }
}
