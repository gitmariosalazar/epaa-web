import type { AuditSector } from '../../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../../domain/repositories/ReadingAuditRepository';

/**
 * GetAuditBySectorAndMonthUseCase
 *
 * Retrieves the audit record for a single sector in a specific month.
 * Used by sector-detail views and the reading assignment flow.
 *
 * SRP: only responsible for fetching a single sector audit record.
 * DIP: depends on the ReadingAuditRepository abstraction.
 */
export class GetAuditBySectorAndMonthUseCase {
  private readonly repository: ReadingAuditRepository;

  constructor(repository: ReadingAuditRepository) {
    this.repository = repository;
  }

  async execute(sector: number, month: string): Promise<AuditSector | null> {
    return this.repository.getAuditBySectorAndMonth(sector, month);
  }
}
