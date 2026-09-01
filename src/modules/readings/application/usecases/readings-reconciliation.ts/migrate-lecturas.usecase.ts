import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

const DEFAULT_MONTHS = ['2026-07', '2026-06', '2026-05', '2026-04', '2026-03'];

export class MigrateLecturasUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(months: string[] = DEFAULT_MONTHS): Promise<any> {
    try {
      return await this.reconciliationRepository.migrateLecturas(months);
    } catch (error) {
      console.error('Error durante la migración de lecturas', error);
      throw new Error((error as Error).message);
    }
  }
}
