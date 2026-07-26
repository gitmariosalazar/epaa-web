import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import type { DailyReportPdfData } from '../../domain/models/daily-report-pdf.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';

/**
 * Plantilla concreta para el Reporte Diario.
 * Responsabilidad: Definir la estructura visual, mapeo de columnas y totales
 * específicamente para el caso de uso del Reporte Diario.
 */
export class DailyReportPdfTemplate implements IPdfDocumentGenerator<DailyReportPdfData> {
  private exportService: ExportService;

  constructor() {
    // Invertimos la dependencia de generación cruda de PDF
    this.exportService = new ExportService();
  }

  private prepareReportOptions(data: DailyReportPdfData) {
    const { reportDate, readings, orientation, selectedColumns, mapRowData, signatures, showSign } = data;
    
    // 1. Extraer nombres de las columnas
    const colLabels = selectedColumns.map((c) => c.label);
    
    // 2. Mapear cada fila a un arreglo de strings usando las columnas seleccionadas
    const rows = readings.map((d) => mapRowData(d, selectedColumns));

    // 3. Calcular totales específicos del Reporte Diario
    const totalValue = readings.reduce((acc, item) => acc + Number(item.readingValue || 0), 0);
    const totalConsumption = readings.reduce((acc, item) => acc + Number(item.consumption || 0), 0);

    const totalsRow = selectedColumns.map((col, index) => {
      if (index === 0) return 'TOTAL';
      // Identificamos las columnas numéricas para poner sus totales
      if (col.id === 'value' || col.columnId === 'value') return `$ ${totalValue.toFixed(2)}`;
      if (col.id === 'consumption' || col.columnId === 'consumption') return `${totalConsumption.toFixed(2)} m³`;
      return '';
    });

    const fileName = `reporte_diario_${reportDate.replace(/\//g, '-')}_${Date.now()}`;

    return {
      fileName,
      title: 'REPORTE DIARIO DE LECTURAS',
      description: 'Detalle de lecturas correspondientes al día seleccionado',
      orientation,
      columns: colLabels,
      rows,
      totals: totalsRow,
      signatures,
      showSign,
      labelsHorizontal: {
        'Fecha': reportDate,
        'Fecha de Exportación': new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      }
    };
  }

  generateBlobUrl(data: DailyReportPdfData): string {
    const options = this.prepareReportOptions(data);
    return this.exportService.generatePdfBlobUrl(options);
  }

  downloadPdf(data: DailyReportPdfData): void {
    const options = this.prepareReportOptions(data);
    this.exportService.exportToPdf(options);
  }
}
