import type { LecturasReconciliationRepository } from '../../../domain/repositories/lecturas-reconciliation.repository';

export class CompareLecturasUseCase {
  private readonly readingsReconciliationRepository: LecturasReconciliationRepository;

  constructor(readingsReconciliationRepository: LecturasReconciliationRepository) {
    this.readingsReconciliationRepository = readingsReconciliationRepository;
  }

  async execute(months?: string[]): Promise<any> {
    return this.readingsReconciliationRepository.compareLecturas(months);
  }
}
