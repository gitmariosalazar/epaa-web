import type { AuditSectorHistory } from '../../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../../domain/repositories/ReadingAuditRepository';

/**
 * GetAuditHistoryBySectorUseCase
 *
 * Retrieves the historical audit progression for a sector over N months.
 * Used to render trend charts and progress timelines on the audit dashboard.
 *
 * SRP: only responsible for fetching historical audit data.
 * DIP: depends on the ReadingAuditRepository abstraction.
 */
export class GetAuditHistoryBySectorUseCase {
  private readonly repository: ReadingAuditRepository;

  constructor(repository: ReadingAuditRepository) {
    this.repository = repository;
  }

  async execute(sector: number, months?: number): Promise<AuditSectorHistory[]> {
    return this.repository.getAuditHistoryBySector(sector, months);
  }
}
