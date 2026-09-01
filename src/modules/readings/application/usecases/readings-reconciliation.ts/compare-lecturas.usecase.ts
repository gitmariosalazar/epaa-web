import type {
  ReconciliationPeriod,
  ResumenAuditoriaResponse
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class CompareLecturasUseCase {
  private readonly readingsReconciliationRepository: LecturasReconciliationRepository;

  constructor(readingsReconciliationRepository: LecturasReconciliationRepository) {
    this.readingsReconciliationRepository = readingsReconciliationRepository;
  }

  async execute(
    params: ReconciliationPeriod
  ): Promise<ResumenAuditoriaResponse> {
    return this.readingsReconciliationRepository.getReconciliationKpis(params);
  }
}
