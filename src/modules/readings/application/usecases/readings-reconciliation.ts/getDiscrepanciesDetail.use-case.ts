import type {
  ConsultarDetalleAuditoriaParams,
  DetalleAuditoriaResponse,
} from '../../../domain/models/lecturas-reconciliation';
import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class GetDiscrepanciesDetailUseCase {
  private readonly reconciliationRepository: LecturasReconciliationRepository;

  constructor(reconciliationRepository: LecturasReconciliationRepository) {
    this.reconciliationRepository = reconciliationRepository;
  }

  async execute(
    params: ConsultarDetalleAuditoriaParams
  ): Promise<DetalleAuditoriaResponse> {
    return this.reconciliationRepository.getDiscrepanciesDetail(params);
  }
}
