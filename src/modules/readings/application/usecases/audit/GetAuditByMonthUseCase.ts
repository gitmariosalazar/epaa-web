import type { AuditSector } from '../../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../../domain/repositories/ReadingAuditRepository';

/**
 * GetAuditByMonthUseCase
 *
 * Retrieves all sector audit records for a specific month.
 * Used by the audit dashboard to display the global monthly progress table.
 *
 * SRP: only responsible for fetching audit data by month.
 * DIP: depends on the ReadingAuditRepository abstraction.
 */
export class GetAuditByMonthUseCase {
  private readonly repository: ReadingAuditRepository;

  constructor(repository: ReadingAuditRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<AuditSector[]> {
    return this.repository.getAuditByMonth(month);
  }
}
