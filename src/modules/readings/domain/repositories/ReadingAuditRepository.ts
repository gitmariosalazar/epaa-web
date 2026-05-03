import type {
  AuditSector,
  AuditSectorHistory,
  CloseAuditSector,
  InitializeAudit
} from '../models/ReadingAudit';

export interface ReadingAuditRepository {
  initializeMonthlyAudit(month: string): Promise<InitializeAudit>;
  getAuditByMonth(month: string): Promise<AuditSector[]>;
  getAuditBySectorAndMonth(
    sector: number,
    month: string
  ): Promise<AuditSector | null>;
  closeAuditSector(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string
  ): Promise<CloseAuditSector>;
  getAuditHistoryBySector(
    sector: number,
    months?: number
  ): Promise<AuditSectorHistory[]>;
}
