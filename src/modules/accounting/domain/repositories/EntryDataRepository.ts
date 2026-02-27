import type { DateRangeParams } from '../dto/params/DataEntryParams';
import type {
  DailyGroupedReport,
  DailyCollectorSummary,
  DailyPaymentMethodReport,
  FullBreakdownReport
} from '../models/EntryData';

export interface EntryDataRepository {
  getDailyGroupedReport(params: DateRangeParams): Promise<DailyGroupedReport[]>;
  getDailyCollectorSummary(
    params: DateRangeParams
  ): Promise<DailyCollectorSummary[]>;
  getDailyPaymentMethodReport(
    params: DateRangeParams
  ): Promise<DailyPaymentMethodReport[]>;
  getFullBreakdownReport(
    params: DateRangeParams
  ): Promise<FullBreakdownReport[]>;
}
