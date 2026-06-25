import type { InterfaceIncidentRepository } from "@/modules/incidents/domain/repositories/incident.interface.repository";
import type { IncidentCategoryResponse } from "@/modules/incidents/domain/schemas/dtos/response/incident-category-type.response";
import type { ApiResponse } from "@/shared/infrastructure/api/response/ApiResponse";

export class FindIncidentCategoriesUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }
  async execute(): Promise<ApiResponse<IncidentCategoryResponse[]>> {
    try {
      const incidentCategories = await this.incidentRepository.findIncidentCategories();
      return incidentCategories;
    } catch (error) {
      throw error;
    }
  }
}
