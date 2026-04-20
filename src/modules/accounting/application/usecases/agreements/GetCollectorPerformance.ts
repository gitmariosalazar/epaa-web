import type { DateRangeParams } from '@/modules/accounting/domain/dto/params/DataEntryParams';
import type { CollectorPerformance } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetCollectorPerformanceUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(params: DateRangeParams): Promise<CollectorPerformance[]> {
    return this.repository.getCollectorPerformance(params);
  }
}
