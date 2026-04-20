import type { MonthlyCollectionSummary } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetMonthlyCollectionSummaryUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(): Promise<MonthlyCollectionSummary[]> {
    return this.repository.getMonthlyCollectionSummary(12);
  }
}
