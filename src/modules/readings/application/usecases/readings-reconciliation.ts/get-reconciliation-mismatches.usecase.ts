import type {
  ReconciliationPeriod,
  ReconciliationMismatchRecord
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class GetReconciliationMismatchesUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(
    period: ReconciliationPeriod
  ): Promise<ReconciliationMismatchRecord[]> {
    try {
      return await this.reconciliationRepository.getMismatches(period);
    } catch (error) {
      console.error('Error obteniendo las diferencias de reconciliación', error);
      throw new Error((error as Error).message);
    }
  }
}
