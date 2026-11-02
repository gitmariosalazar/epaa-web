import type { ResolvedRoute } from '../models/RouteResolution';
import type {
  InsertConnectionIntoRouteRequest,
  ResolveRouteRequest,
} from '../dto/request/route-requests.dto';
import type { InsertConnectionIntoRouteResponse } from '../dto/response/route-responses.dto';

export interface RouteResolutionRepository {
  resolveRoute(request: ResolveRouteRequest): Promise<ResolvedRoute>;
  insertConnection(
    request: InsertConnectionIntoRouteRequest,
  ): Promise<InsertConnectionIntoRouteResponse>;
}
