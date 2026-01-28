export interface IExportService {
  exportToPdf(
    rows: any[][],
    columns: string[],
    fileName: string,
    title?: string
  ): void;
  exportToExcel<T>(data: T[], fileName: string): void;
}
