import type {
  ReconciliationPeriod,
  ResumenAuditoriaResponse,
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class GetReconciliationKpisUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(
    params: ReconciliationPeriod
  ): Promise<ResumenAuditoriaResponse> {
    return this.reconciliationRepository.getReconciliationKpis(params);
  }
}
