import type {
  ReadingRoute,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection,
} from '../models/ReadingRoute';
import type { RouteConnection } from '../models/RouteConnection';
import type {
  FindReadingRoutesQuery,
  OptimizeRouteSequenceRequest,
} from '../dto/request/route-requests.dto';
import type {
  OptimizeSequenceResponse,
  PaginatedRoutesResponse,
} from '../dto/response/route-responses.dto';

export interface ReadingRouteCatalogRepository {
  getRoutes(query?: FindReadingRoutesQuery): Promise<PaginatedRoutesResponse>;
  getRouteById(id: number): Promise<ReadingRoute>;
  getRoutesGeoJson(
    sectorId?: number,
    activa?: boolean,
  ): Promise<RouteGeoJsonFeatureCollection>;
  getRouteCentroids(
    activaOnly?: boolean,
  ): Promise<RouteCentroidFeatureCollection>;
  getRouteConnections(idRuta: number): Promise<RouteConnection[]>;
  optimizeRouteSequence(
    idRuta: number,
    request?: OptimizeRouteSequenceRequest,
  ): Promise<OptimizeSequenceResponse>;
}
