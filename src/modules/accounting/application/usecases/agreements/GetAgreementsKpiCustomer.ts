import type { AgreementsParams } from '@/modules/accounting/domain/dto/params/AgreementsParams';
import type { AgreementKPIsResponse } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetAgreementsKpiCustomerUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(
    cardId: string,
    params: AgreementsParams
  ): Promise<AgreementKPIsResponse[]> {
    return this.repository.getAgreementsKpiCustomer(cardId, params);
  }
}
