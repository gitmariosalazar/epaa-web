/**
 * Data Transfer Object representing the response of an Incident.
 */
export class IncidentResponse {
  incidentId!: number;
  connectionId!: string | null;
  readingId!: number | null;
  incidentTypeId!: number;
  reportDescription!: string;
  referenceAddress!: string | null;
  status!: string;
  reportOrigin!: string;
  priority!: string;
  reportDate!: Date;
  reporterUserId!: string | null;
  clienteUsuarioReportaId!: string | null;
  latitude!: number | null;
  longitude!: number | null;
  resolutionDate!: Date | null;
  resolverUserId!: string | null;
  resolutionDescription!: string | null;
  chargeToUser!: boolean;
  repairCost!: number;

  categoryName?: string | null;
  categoryCode?: string | null;
  incidentTypeName?: string | null;
  suggestedPriority?: string | null;
  reportedBy?: string | null;
  evidencePhotos?: Array<{
    photoId: number;
    filePath: string;
    type: string;
  }> | null;
  statusHistory?: Array<{
    changeDate: string | Date;
    previousStatus: string | null;
    newStatus: string;
    managedBy: string | null;
    observation: string | null;
  }> | null;
}
