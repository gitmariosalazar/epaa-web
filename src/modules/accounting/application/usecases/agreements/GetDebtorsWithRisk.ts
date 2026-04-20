import type { Debtor } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetDebtorsWithRiskUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Debtor[]> {
    return this.repository.getDebtorsWithRisk();
  }
}
