import type { MapRouteFeatureCollection } from '../models/map-geojson';

export interface GetMapGeojsonByDayAndByUser {
  getMapGeojsonByDayAndByUser(
    date: string,
    userId?: string
  ): Promise<MapRouteFeatureCollection>;
}
