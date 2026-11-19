export interface AllowedTransitionOptionGatewayResponse {
  targetStateId: number;
  targetStateName: string;
  status: 'ALLOWED' | 'RESTRICTED' | 'FORBIDDEN';
  note?: string;
}

export interface AllowedTransitionsGatewayResponse {
  connectionId: string;
  currentStateId: number | null;
  currentStateName: string;
  allowedTransitions: AllowedTransitionOptionGatewayResponse[];
}
