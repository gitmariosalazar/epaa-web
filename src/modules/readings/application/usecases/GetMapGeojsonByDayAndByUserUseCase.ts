import type { MapRouteFeatureCollection } from '../../domain/models/map-geojson';
import type { GetMapGeojsonByDayAndByUser } from '../../domain/repositories/GetMapGeojsonByDayAndByUser';

export class GetMapGeojsonByDayAndByUserUseCase {
  private readonly readingHistoryRepository: GetMapGeojsonByDayAndByUser;

  constructor(readingHistoryRepository: GetMapGeojsonByDayAndByUser) {
    this.readingHistoryRepository = readingHistoryRepository;
  }

  async execute(
    date: string,
    userId?: string
  ): Promise<MapRouteFeatureCollection> {
    return this.readingHistoryRepository.getMapGeojsonByDayAndByUser(
      date,
      userId
    );
  }
}
