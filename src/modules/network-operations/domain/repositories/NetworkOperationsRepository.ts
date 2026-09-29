import type { MapGeojsonResponse } from '../models/GeoJsonFeature';

export interface NetworkOperationsRepository {
  getNetworkMapGeoJson(): Promise<MapGeojsonResponse>;
}
