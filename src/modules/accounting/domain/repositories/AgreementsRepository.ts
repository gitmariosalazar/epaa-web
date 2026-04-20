import type {
  AgreementsParams,
  AgreementsCustomerParams
} from '../dto/params/AgreementsParams';
import type { DateRangeParams } from '../dto/params/DataEntryParams';
import type {
  AgreementKPIsResponse,
  AgreementKPIsCustomerResponse,
  PaymentMethodSummary,
  CollectorPerformance,
  MonthlyCollectionSummary,
  Debtor,
  CitizenSummary,
  AgreementInstallmentResponse
} from '../models/Agreements';

export interface AgreementsRepository {
  getAgreementsKpi(params: AgreementsParams): Promise<AgreementKPIsResponse[]>;
  getAgreementsKpiCustomer(
    cardId: string,
    params: AgreementsCustomerParams
  ): Promise<AgreementKPIsCustomerResponse[]>;
  getAgreementInstallmentDetails(
    cardId: string,
    params: DateRangeParams
  ): Promise<AgreementInstallmentResponse[]>;
  getMonthlyCollectionSummary(
    monthsBack: number
  ): Promise<MonthlyCollectionSummary[]>;
  getDebtorsWithRisk(): Promise<Debtor[]>;
  getCollectorPerformance(
    params: DateRangeParams
  ): Promise<CollectorPerformance[]>;
  getPaymentMethodSummary(
    params: DateRangeParams
  ): Promise<PaymentMethodSummary[]>;
  getCitizenSummary(params: DateRangeParams): Promise<CitizenSummary[]>;
}
