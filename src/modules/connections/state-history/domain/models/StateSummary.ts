export interface StateSummaryItem {
  stateId: number;
  stateName: string;
  description: string;
  totalConnections: number;
  percentage: number;
  allowsBilling: boolean;
  allowsReading: boolean;
  requiresInspection: boolean;
}
