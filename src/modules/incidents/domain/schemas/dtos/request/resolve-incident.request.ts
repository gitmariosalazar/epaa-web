export class ResolveIncidentRequest {
  incidentId!: string;
  resolverUserId!: string;
  description!: string;
  repairCost!: number;
  chargeToUser!: boolean;
  images!: string[];
}
