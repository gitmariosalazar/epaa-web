import type { CloseAuditSector } from '../../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../../domain/repositories/ReadingAuditRepository';

/**
 * CloseAuditSectorUseCase
 *
 * Marks a sector audit as complete for a given month, recording the
 * supervisor ID, closure date, and optional observations.
 *
 * SRP: only responsible for the closure action.
 * DIP: depends on the ReadingAuditRepository abstraction.
 */
export class CloseAuditSectorUseCase {
  private readonly repository: ReadingAuditRepository;

  constructor(repository: ReadingAuditRepository) {
    this.repository = repository;
  }

  async execute(
    sector: number,
    month: string,
    supervisorId: string,
    observaciones?: string
  ): Promise<CloseAuditSector> {
    return this.repository.closeAuditSector(
      sector,
      month,
      supervisorId,
      observaciones
    );
  }
}
