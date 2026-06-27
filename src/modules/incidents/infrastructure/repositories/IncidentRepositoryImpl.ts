import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { InterfaceIncidentRepository } from '../../domain/repositories/incident.interface.repository';
import type { CreateIncidentRequest } from '../../domain/schemas/dtos/request/create-incident.request';
import type { ResolveIncidentRequest } from '../../domain/schemas/dtos/request/resolve-incident.request';
import type { IncidentResponse } from '../../domain/schemas/dtos/response/incident.response';
import type { IncidentCategoryResponse } from '../../domain/schemas/dtos/response/incident-category-type.response';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1] || arr[0]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Implementation of InterfaceIncidentRepository using HTTP client.
 */
export class IncidentRepositoryImpl implements InterfaceIncidentRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async createIncident(
    incident: CreateIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null> {
    console.log('DEBUG [Create Incident Request]:', incident);
    const formData = new FormData();

    if (incident.connectionId !== undefined && incident.connectionId !== null) {
      formData.append('connectionId', incident.connectionId);
    }
    if (incident.readingId !== undefined && incident.readingId !== null) {
      formData.append('readingId', String(incident.readingId));
    }
    formData.append('incidentTypeId', String(incident.incidentTypeId));
    formData.append('reportDescription', incident.reportDescription);
    if (
      incident.referenceAddress !== undefined &&
      incident.referenceAddress !== null
    ) {
      formData.append('referenceAddress', incident.referenceAddress);
    }
    formData.append('reportOrigin', incident.reportOrigin);
    if (incident.priority) {
      formData.append('priority', incident.priority);
    }
    if (incident.latitude !== undefined && incident.latitude !== null) {
      formData.append('latitude', String(incident.latitude));
    }
    if (incident.longitude !== undefined && incident.longitude !== null) {
      formData.append('longitude', String(incident.longitude));
    }

    if (incident.images && incident.images.length > 0) {
      incident.images.forEach((imgBase64, idx) => {
        try {
          if (imgBase64.startsWith('data:')) {
            const file = dataURLtoFile(imgBase64, `image-${idx}.jpg`);
            formData.append('images', file);
          } else {
            formData.append('images', imgBase64);
          }
        } catch (e) {
          console.error('Error parsing base64 image in repository:', e);
        }
      });
    }

    const response = await this.client.post<ApiResponse<IncidentResponse>>(
      '/incidents/create-incident',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  async resolveIncident(
    incidentResolve: ResolveIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null> {
    const formData = new FormData();
    formData.append('incidentId', String(incidentResolve.incidentId));
    formData.append('resolverUserId', incidentResolve.resolverUserId);
    formData.append('description', incidentResolve.description);
    formData.append('repairCost', String(incidentResolve.repairCost));
    formData.append('chargeToUser', String(incidentResolve.chargeToUser));

    if (incidentResolve.images && incidentResolve.images.length > 0) {
      incidentResolve.images.forEach((imgBase64, idx) => {
        try {
          if (imgBase64.startsWith('data:')) {
            const file = dataURLtoFile(imgBase64, `image-${idx}.jpg`);
            formData.append('images', file);
          } else {
            formData.append('images', imgBase64);
          }
        } catch (e) {
          console.error('Error parsing base64 image in repository:', e);
        }
      });
    }

    const response = await this.client.put<ApiResponse<IncidentResponse>>(
      `/incidents/resolve-incident/${incidentResolve.incidentId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  async findIncidentsByConnection(
    connectionId: string
  ): Promise<ApiResponse<IncidentDetailRowResponse[]>> {
    const response = await this.client.get<
      ApiResponse<IncidentDetailRowResponse[]>
    >(`/incidents/find-by-connection/${connectionId}`);
    return response.data;
  }

  async findById(
    _incidentId: number
  ): Promise<ApiResponse<IncidentDetailRowResponse> | null> {
    throw new Error(
      'Method not implemented because the backend gateway does not expose a find-by-id endpoint.'
    );
  }

  async findIncidents(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    incidentTypeId?: number | null;
  }): Promise<ApiResponse<IncidentDetailRowResponse[]>> {
    const response = await this.client.get<
      ApiResponse<IncidentDetailRowResponse[]>
    >('/incidents/search', { params: filters });
    return response.data;
  }

  async findIncidentCategories(): Promise<
    ApiResponse<IncidentCategoryResponse[]>
  > {
    const response = await this.client.get<
      ApiResponse<IncidentCategoryResponse[]>
    >('/incidents/categories');
    return response.data;
  }
}
