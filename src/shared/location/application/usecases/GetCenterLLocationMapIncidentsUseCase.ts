import type { CenterLocationResponse } from '../../domain/schemas/dto/response/location.response';
import type { ILocationRepository } from '../../domain/repositories/location.interface.repository';

export class GetCenterLLocationMapIncidentsUseCase {
  private readonly locationRepository: ILocationRepository;

  constructor(locationRepository: ILocationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(): Promise<CenterLocationResponse> {
    return await this.locationRepository.getCenterLLocationMapIncidents();
  }
}
