import type {
  OverduePayment,
  OverdueSummary,
  YearlyOverdueSummary
} from '../models/OverdueReading';
import type { Payment } from '../models/Payment';
import type { PaymentReading } from '../models/PaymentReading';
import type { PendingReading } from '../models/PendingReading';

export interface PaymentsRepository {
  findAllPaymentReadingPayrollsByDate(
    paymentDate: string
  ): Promise<PaymentReading[]>;

  findAllPaymentByDateAndOrderValue(
    paymentDate: string,
    orderValue: number
  ): Promise<Payment[]>;
  findAllPaymentsByDateRange(
    initDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<Payment[]>;

  findAllOverduePayments(
    limit?: number,
    offset?: number
  ): Promise<OverduePayment[]>;

  findPendingReadingsByCadastralKeyOrCardId(
    searchValue: string
  ): Promise<PendingReading[]>;

  findOverdueSummary(): Promise<OverdueSummary | null>;
  findYearlyOverdueSummary(): Promise<YearlyOverdueSummary[]>;
}
