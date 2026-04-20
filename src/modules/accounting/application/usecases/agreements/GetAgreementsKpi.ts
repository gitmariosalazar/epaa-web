import { AgreementsParams } from '@/modules/accounting/domain/dto/params/AgreementsParams';
import type { AgreementKPIsResponse } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetAgreementsKpiUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(params: AgreementsParams): Promise<AgreementKPIsResponse[]> {
    return this.repository.getAgreementsKpi(params);
  }
}
