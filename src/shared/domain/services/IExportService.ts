export interface ReportOptions {
  fileName: string;
  title: string;
  columns: string[];
  rows: string[][];
  clientInfo?: Record<string, string>;
}

export interface IExportService {
  exportToPdf(options: ReportOptions): void;
  exportToExcel<T>(data: T[], fileName: string): void;
}
