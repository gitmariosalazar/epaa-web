export interface IncidentCategoryResponse {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  categoryDescription: string;
  incidentTypes: IncidentTypeResponse[];
}

export interface IncidentTypeResponse {
  typeCode: string;
  typeName: string;
  typeDescription: string;
  suggestedPriority: boolean;
}
