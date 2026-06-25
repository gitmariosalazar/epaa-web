export class ResolveIncidentRequest {
  incidentId!: number;
  resolverUserId!: string;
  description!: string;
  repairCost!: number;
  chargeToUser!: boolean;
  images!: string[];
}
