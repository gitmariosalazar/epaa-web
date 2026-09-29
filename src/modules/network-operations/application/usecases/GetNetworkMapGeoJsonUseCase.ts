import type { NetworkOperationsRepository } from '../../domain/repositories/NetworkOperationsRepository';
import type { MapGeojsonResponse } from '../../domain/models/GeoJsonFeature';

export class GetNetworkMapGeoJsonUseCase {
  private readonly networkOperationsRepository: NetworkOperationsRepository;

  constructor(networkOperationsRepository: NetworkOperationsRepository) {
    this.networkOperationsRepository = networkOperationsRepository;
  }

  async execute(): Promise<MapGeojsonResponse> {
    return this.networkOperationsRepository.getNetworkMapGeoJson();
  }
}
