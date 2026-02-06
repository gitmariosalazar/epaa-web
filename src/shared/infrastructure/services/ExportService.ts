import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type {
  IExportService,
  ReportOptions
} from '@/shared/domain/services/IExportService';

export class ExportService implements IExportService {
  exportToPdf(options: ReportOptions): void {
    const doc = this.createPdfDoc(options);
    doc.save(`${options.fileName}.pdf`);
  }

  generatePdfBlobUrl(options: ReportOptions): string {
    const doc = this.createPdfDoc(options);
    return doc.output('bloburl') as unknown as string;
  }

  private createPdfDoc(options: ReportOptions): jsPDF {
    const {
      title,
      columns,
      rows,
      clientInfo,
      orientation = 'portrait'
    } = options;
    const doc = new jsPDF(orientation);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    // Define colors
    const primaryColor = [41, 128, 185]; // #2980b9
    const secondaryColor = [127, 140, 141]; // #7f8c8d
    const textColor = [44, 62, 80]; // #2c3e50

    // --- Header Section ---

    // 1. Top Bar Accent
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // 2. Company Logo & Name Area
    const logoUrl = '/src/assets/images/epaa.png';
    const img = new Image();
    img.src = logoUrl;

    // Logo padding and size
    const logoSize = 24;
    const logoY = 12;

    try {
      // Try adding image if available
      doc.addImage(img, 'PNG', margin, logoY, logoSize, logoSize);
    } catch (e) {
      console.warn('Logo could not be loaded', e);
      // Fallback placeholder if logo fails
      doc.setFillColor(240, 240, 240);
      doc.circle(
        margin + logoSize / 2,
        logoY + logoSize / 2,
        logoSize / 2,
        'F'
      );
    }

    // Company Name (Right of logo)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(
      'EMPRESA PÚBLICA DE AGUA POTABLE',
      margin + logoSize + 8,
      logoY + 8
    );
    doc.text('Y ALCANTARILLADO', margin + logoSize + 8, logoY + 16);

    // 3. Report Info (Top Right)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

    const dateStr = new Date().toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Align right
    const dateText = `Generado: ${dateStr}`;
    doc.text(dateText, pageWidth - margin, 12, { align: 'right' });

    // 4. Report Title (Prominent, below header)
    const titleY = logoY + logoSize + 15;

    // Divider Line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, titleY - 5, pageWidth - margin, titleY - 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(title.toUpperCase(), margin, titleY);

    let currentY = titleY + 10;

    // --- Client Info Section (Styled Box) ---
    if (clientInfo) {
      // Background box for client info
      const boxPadding = 5;
      const boxHeight = Object.keys(clientInfo).length * 6 + boxPadding * 2;

      doc.setFillColor(248, 250, 252); // Very light gray/blue
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(
        margin,
        currentY,
        pageWidth - margin * 2,
        boxHeight,
        2,
        2,
        'FD'
      );

      currentY += boxPadding + 4;

      doc.setFontSize(9);

      Object.entries(clientInfo).forEach(([key, value]) => {
        const yPos = currentY;

        // Label
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${key}:`, margin + boxPadding, yPos);

        // Value
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(String(value), margin + boxPadding + 40, yPos);

        currentY += 6;
      });

      currentY += 8; // Extra spacing after box
    }

    // --- Table Section ---
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 9,
        font: 'helvetica',
        cellPadding: 4,
        valign: 'middle',
        lineColor: [230, 230, 230],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        // Adjust known columns if necessary, e.g. 0: { cellWidth: 30 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: margin, right: margin, bottom: margin, left: margin },
      didDrawPage: (data) => {
        // Add footer on each page
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height - 10;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${data.pageNumber}`,
          data.settings.margin.left,
          pageHeight
        );
      }
    });

    // --- Signature Section ---
    const finalY = (doc as any).lastAutoTable.finalY + 40;

    // Check if we need a new page for signature
    const signatureNeededHeight = 40;
    let signatureY = finalY;

    if (finalY + signatureNeededHeight > pageHeight - margin) {
      doc.addPage();
      signatureY = 40;
    }

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, signatureY, pageWidth / 2 + 40, signatureY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('FIRMA RESPONSABLE', pageWidth / 2, signatureY + 6, {
      align: 'center'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('EPAA - Antonio Ante', pageWidth / 2, signatureY + 11, {
      align: 'center'
    });

    return doc;
  }

  exportToExcel<T>(data: T[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
