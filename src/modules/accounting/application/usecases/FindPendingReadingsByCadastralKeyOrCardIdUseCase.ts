import type { PendingReading } from '../../domain/models/PendingReading';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindPendingReadingsByCadastralKeyOrCardIdUseCase {
  private paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(searchValue: string): Promise<PendingReading[]> {
    return this.paymentsRepository.findPendingReadingsByCadastralKeyOrCardId(
      searchValue
    );
  }
}
