import type { DateRangeParams } from '../../../domain/dto/params/DataEntryParams';
import type { AgreementInstallmentResponse } from '../../../domain/models/Agreements';
import type { AgreementsRepository } from '../../../domain/repositories/AgreementsRepository';

export class GetAgreementInstallmentDetailsUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(
    cardId: string,
    params: DateRangeParams
  ): Promise<AgreementInstallmentResponse[]> {
    return this.repository.getAgreementInstallmentDetails(cardId, params);
  }
}
