export const ConnectionStateEnum = {
  ACTIVE: 1,
  NEW_PENDING: 2,
  VOLUNTARY_SUSPENDED: 3,
  CUT_FOR_ARREARS: 4,
  CLOSED: 5,
  CANCELLED_REQUEST: 6,
  ADMINISTRATIVE_DISCHARGE: 7,
  IRREGULAR_FRAUD: 8,
  TECHNICAL_DAMAGE: 9,
  PAYMENT_PENDING_RECONNECTION: 10,
  UNDER_REPAIR: 11,
  UNDER_CADASTRAL_REVIEW: 12,
  SUSPENDED_GENERAL: 13,
  INACTIVE: 14,
  REMOVED: 15
} as const;

export type ConnectionStateEnum = (typeof ConnectionStateEnum)[keyof typeof ConnectionStateEnum];

export interface StateCatalogItem {
  stateId: number;
  name: string;
  description: string;
  allowsBilling: boolean;
  requiresInspection: boolean;
  allowsReading: boolean;
}
