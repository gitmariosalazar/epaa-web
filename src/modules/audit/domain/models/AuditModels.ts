export interface AuditRegistroResponse {
  auditId: number;
  auditTimestamp: Date;
  userId?: string;
  username?: string;
  ipAddress?: string;
  appName: string;
  sessionId?: string;
  schemaName: string;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  pkValue: Record<string, any>;
  dataBefore?: Record<string, any>;
  dataAfter?: Record<string, any>;
  changedFields: string[];
  diffJsonb?: Record<string, any>;
  queryHash?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export interface AuditSessionResponse {
  sessionLogId: number;
  auditTimestamp: Date;
  userId?: string;
  username?: string;
  event: string;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export interface GetAuditLogsParams {
  limit?: number;
  offset?: number;
  tableName?: string;
  operation?: string;
  userId?: string;
  username?: string;
  searchQuery?: string;
  searchField?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetSessionLogsParams {
  limit?: number;
  offset?: number;
  userId?: string;
  username?: string;
  event?: string;
  searchQuery?: string;
  searchField?: string;
  startDate?: string;
  endDate?: string;
}
