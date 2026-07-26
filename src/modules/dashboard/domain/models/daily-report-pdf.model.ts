import type { DailyReadingsReport } from './report-dashboard.model';
import type { ExportColumn } from '../../presentation/components/reports/ReportPreviewModal';
import type { Signature } from '@/shared/domain/services/IExportService';

export interface DailyReportPdfData {
  reportDate: string;
  readings: DailyReadingsReport[];
  
  // UI preferences passed from the Modal
  orientation: 'portrait' | 'landscape';
  selectedColumns: ExportColumn[];
  
  // Used to map the raw reading into the table array
  mapRowData: (row: DailyReadingsReport, selectedCols: ExportColumn[]) => any[];
  
  // Optional extras
  signatures?: Signature[];
  showSign?: boolean;
}
