import type {
  ReconciliationPeriod,
  DuplicateReconciliationRecord
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class GetReconciliationDuplicatesUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(
    period: ReconciliationPeriod
  ): Promise<DuplicateReconciliationRecord[]> {
    try {
      return await this.reconciliationRepository.getDuplicates(period);
    } catch (error) {
      console.error('Error obteniendo los duplicados de reconciliación', error);
      throw new Error((error as Error).message);
    }
  }
}
