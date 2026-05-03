import type { InitializeAudit } from '../../../domain/models/ReadingAudit';
import type { ReadingAuditRepository } from '../../../domain/repositories/ReadingAuditRepository';

/**
 * InitializeMonthlyAuditUseCase
 *
 * Triggers the backend procedure that generates the audit rows
 * (auditoria_lectura_sector) for every sector in a given month.
 *
 * SRP: responsible only for the initialization action.
 * DIP: depends on the ReadingAuditRepository abstraction.
 */
export class InitializeMonthlyAuditUseCase {
  private readonly repository: ReadingAuditRepository;

  constructor(repository: ReadingAuditRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<InitializeAudit> {
    return this.repository.initializeMonthlyAudit(month);
  }
}
