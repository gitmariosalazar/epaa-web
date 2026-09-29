import type { MapGeojsonResponse } from '../models/GeoJsonFeature';
import type { ScadaTelemetryResponse } from '../models/ScadaTelemetry';

export interface NetworkOperationsRepository {
  getNetworkMapGeoJson(): Promise<MapGeojsonResponse>;
  getScadaTelemetry(): Promise<ScadaTelemetryResponse[]>;
}
