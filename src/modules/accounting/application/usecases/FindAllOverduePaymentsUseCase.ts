import type { OverduePayment } from '../../domain/models/OverdueReading';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindAllOverduePaymentsUseCase {
  private paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(limit?: number, offset?: number): Promise<OverduePayment[]> {
    return this.paymentsRepository.findAllOverduePayments(limit, offset);
  }
}
