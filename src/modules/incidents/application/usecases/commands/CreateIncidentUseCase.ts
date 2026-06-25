import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { CreateIncidentRequest } from '@/modules/incidents/domain/schemas/dtos/request/create-incident.request';
import type { IncidentResponse } from '@/modules/incidents/domain/schemas/dtos/response/incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class CreateIncidentUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(
    request: CreateIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null> {
    try {
      const incident = await this.incidentRepository.createIncident(request);
      return incident;
    } catch (error) {
      throw error;
    }
  }
}
