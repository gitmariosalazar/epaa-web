import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { ResolveIncidentRequest } from '@/modules/incidents/domain/schemas/dtos/request/resolve-incident.request';
import type { IncidentResponse } from '@/modules/incidents/domain/schemas/dtos/response/incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class ResolveIncidentUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(
    incidentResolve: ResolveIncidentRequest
  ): Promise<ApiResponse<IncidentResponse> | null> {
    try {
      const incident =
        await this.incidentRepository.resolveIncident(incidentResolve);
      return incident;
    } catch (error) {
      throw error;
    }
  }
}
