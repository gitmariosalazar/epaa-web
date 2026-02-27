import type { Payment } from '../../domain/models/Payment';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindAllPaymentByDateAndOrderValueUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  execute(paymentDate: string, orderValue: number): Promise<Payment[]> {
    return this.paymentsRepository.findAllPaymentByDateAndOrderValue(
      paymentDate,
      orderValue
    );
  }
}
