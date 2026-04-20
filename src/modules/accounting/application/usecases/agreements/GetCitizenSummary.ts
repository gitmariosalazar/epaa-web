import type { DateRangeParams } from '@/modules/accounting/domain/dto/params/DataEntryParams';
import type { CitizenSummary } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetCitizenSummaryUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(params: DateRangeParams): Promise<CitizenSummary[]> {
    return this.repository.getCitizenSummary(params);
  }
}
