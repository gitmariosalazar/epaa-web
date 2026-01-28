import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { IExportService } from '@/shared/domain/services/IExportService';

export class ExportService implements IExportService {
  exportToPdf(
    rows: any[][],
    columns: string[],
    fileName: string,
    title?: string
  ): void {
    const doc = new jsPDF();

    if (title) {
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    }

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: title ? 40 : 20,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246] // Blue 500 match
      }
    });

    doc.save(`${fileName}.pdf`);
  }

  exportToExcel<T>(data: T[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
