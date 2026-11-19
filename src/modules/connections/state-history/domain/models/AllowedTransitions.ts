export type TransitionMatrixStatus = 'ALLOWED' | 'RESTRICTED' | 'FORBIDDEN';

export interface AllowedTransitionOption {
  targetStateId: number;
  targetStateName: string;
  status: TransitionMatrixStatus;
  note?: string;
}

export interface AllowedTransitions {
  connectionId: string;
  currentStateId: number | null;
  currentStateName: string;
  allowedTransitions: AllowedTransitionOption[];
}
