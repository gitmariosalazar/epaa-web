export interface Signature {
  label: string;
  name?: string;
  idNumber?: string;
}

export interface ReportOptions {
  fileName: string;
  title: string;
  columns: string[];
  rows: any[][];
  description?: string;
  labelsHorizontal?: Record<string, string>;
  labelsVertical?: Record<string, string>;
  clientInfo?: Record<string, string>;
  orientation?: 'portrait' | 'landscape';
  signatures?: Signature[];
  totals?: string[];
}

export interface IExportService {
  exportToPdf(options: ReportOptions): void;
  exportToExcel(options: ReportOptions): void;
  exportToExcelRaw<T>(data: T[], fileName: string): void;
  generatePdfBlobUrl(options: ReportOptions): string;
}
