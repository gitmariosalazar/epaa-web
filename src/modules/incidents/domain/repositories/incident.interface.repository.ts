import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { CreateIncidentRequest } from '../schemas/dtos/request/create-incident.request';
import type { ResolveIncidentRequest } from '../schemas/dtos/request/resolve-incident.request';
import type { IncidentCategoryResponse } from '../schemas/dtos/response/incident-category-type.response';
import type { IncidentResponse } from '../schemas/dtos/response/incident.response';
import type { IncidentDetailRowResponse } from '../schemas/dtos/response/view_incident.response';

/**
 * Repository interface for Incident operations.
 */
export interface InterfaceIncidentRepository {
  createIncident(
    incident: CreateIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null>;

  resolveIncident(
    incidentResolve: ResolveIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null>;

  findIncidentsByConnection(
    connectionId: string
  ): Promise<ApiResponse<IncidentDetailRowResponse[]>>;
  findById(
    incidentId: number
  ): Promise<ApiResponse<IncidentDetailRowResponse> | null>;
  findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
  }): Promise<ApiResponse<IncidentDetailRowResponse[]>>;
  findIncidentCategories(): Promise<ApiResponse<IncidentCategoryResponse[]>>;
}
