import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type {
  IExportService,
  ReportOptions
} from '@/shared/domain/services/IExportService';

export class ExportService implements IExportService {
  exportToPdf(options: ReportOptions): void {
    const { fileName, title, columns, rows, clientInfo } = options;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header Section ---
    // Company Logo
    const logoUrl = '/src/assets/images/epaa.png';
    const img = new Image();
    img.src = logoUrl;
    // We'll load the image synchronously-ish by letting the browser cache it or just try drawing it.
    // Since this is client-side, we might need to handle async loading or assume it's available.
    // For simplicity in this synchronous method, we'll try to add it.
    // A better approach for production is pre-loading or using base64.
    // Here we will use a try-catch to add the image if it exists in the bundle/public folder.
    try {
      doc.addImage(img, 'PNG', 14, 10, 25, 25);
    } catch (e) {
      console.warn('Logo could not be loaded', e);
    }

    // Company Name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPRESA PÚBLICA DE AGUA POTABLE Y ALCANTARILLADO', 45, 20);

    // Report Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 45, 28);

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth - 14,
      15,
      { align: 'right' }
    );

    let currentY = 45;

    // --- Client Info Section ---
    if (clientInfo) {
      doc.setFontSize(11);
      doc.text('Client Details:', 14, currentY);
      currentY += 6;

      doc.setFontSize(10);
      Object.entries(clientInfo).forEach(([key, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}:`, 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 50, currentY);
        currentY += 5;
      });
      currentY += 5; // Extra spacing after client info
    }

    // --- Table Section ---
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: currentY,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185], // Professional Blue
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { top: 20 }
    });

    // --- Signature Section ---
    // Calculate Y position for signature (at bottom or after table)
    // We'll place it near the bottom of the last page
    const finalY = (doc as any).lastAutoTable.finalY + 40;

    // Check if we need a new page
    if (finalY > doc.internal.pageSize.height - 30) {
      doc.addPage();
    }

    const signatureY = finalY > doc.internal.pageSize.height - 30 ? 40 : finalY;

    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);

    doc.setFontSize(10);
    doc.text('Firma del Responsable', pageWidth / 2, signatureY + 5, {
      align: 'center'
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
