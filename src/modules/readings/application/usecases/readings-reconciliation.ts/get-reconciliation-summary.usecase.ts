import type {
  ReconciliationPeriod,
  ReconciliationSummary
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class GetReconciliationSummaryUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(
    period: ReconciliationPeriod
  ): Promise<ReconciliationSummary> {
    try {
      return await this.reconciliationRepository.getSummary(period);
    } catch (error) {
      console.error('Error obteniendo el resumen de reconciliación', error);
      throw new Error((error as Error).message);
    }
  }
}
