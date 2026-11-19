export interface StateCatalogGatewayResponse {
  stateId: number;
  name: string;
  description: string;
  allowsBilling: boolean;
  requiresInspection: boolean;
  allowsReading: boolean;
}
