export interface ReportOptions {
  fileName: string;
  title: string;
  columns: string[];
  rows: any[][];
  clientInfo?: Record<string, string>;
  orientation?: 'portrait' | 'landscape';
}

export interface IExportService {
  exportToPdf(options: ReportOptions): void;
  exportToExcel<T>(data: T[], fileName: string): void;
  generatePdfBlobUrl(options: ReportOptions): string;
}
