import type {
  TrashRateAuditRow,
  MonthlySummaryRow,
  MissingValorRow,
  CreditNoteRow,
  ClientTrashDetailRow,
  TopDebtorRow,
  TrashDashboardKpi,
  CollectorPerformanceKPI,
  DailyCollectorDetail,
  TrashRateKPI
} from '../models/trash-rate-report.model';
import type { DateRangeParams } from '../dto/params/DateRangeParams';

export interface InterfaceTrashRateReportRepository {
  getTrashRateAuditReport(
    params: DateRangeParams
  ): Promise<TrashRateAuditRow[]>;

  getMonthlySummaryReport(
    params: DateRangeParams
  ): Promise<MonthlySummaryRow[]>;

  getMissingValorBills(params: DateRangeParams): Promise<MissingValorRow[]>;

  getActiveCreditNotes(params: DateRangeParams): Promise<CreditNoteRow[]>;

  getClientDetailSearch(searchParams: string): Promise<ClientTrashDetailRow[]>;

  getTopDebtorReport(params: DateRangeParams): Promise<TopDebtorRow[]>;

  getDashboardKPITrashRate(
    params: DateRangeParams
  ): Promise<TrashDashboardKpi[]>;

  getCollectorPerformanceKPI(
    params: DateRangeParams
  ): Promise<CollectorPerformanceKPI[]>;

  getDailyCollectorDetail(
    params: DateRangeParams
  ): Promise<DailyCollectorDetail[]>;

  getTrashRateKPI(params: DateRangeParams): Promise<TrashRateKPI[]>;
}
