import type { RouteAssignment } from '../models/RouteAssignment';
import type {
  AssignSingleRouteRequest,
  BatchMorningDispatchRequest,
  ReassignRouteSegmentRequest,
} from '../dto/request/route-requests.dto';
import type {
  BatchDispatchResponse,
  ReassignSegmentResponse,
} from '../dto/response/route-responses.dto';

export interface RouteDispatchRepository {
  executeBatchMorningDispatch(
    request: BatchMorningDispatchRequest,
  ): Promise<BatchDispatchResponse>;

  assignSingleRoute(
    request: AssignSingleRouteRequest,
  ): Promise<{ idAsignacion: number; message: string }>;

  reassignRouteSegment(
    request: ReassignRouteSegmentRequest,
  ): Promise<ReassignSegmentResponse>;

  getLiveTracking(periodo?: string, fecha?: string): Promise<RouteAssignment[]>;

  cancelAssignment(
    idAsignacion: number,
    motivo?: string,
  ): Promise<{ success: boolean; message: string }>;

  resumeAssignment(
    idAsignacion: number,
    motivo?: string,
  ): Promise<{ success: boolean; message: string; nuevoEstado?: string }>;
}
