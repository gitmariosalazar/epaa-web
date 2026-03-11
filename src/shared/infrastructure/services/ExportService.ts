import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type {
  IExportService,
  ReportOptions,
  Signature
} from '@/shared/domain/services/IExportService';
import logoEpaa from '@/assets/images/epaa.png';

/**
 * Centered configuration for PDF report styles (Visual Tokens)
 */
const PDF_THEME = {
  colors: {
    primary: [41, 128, 185] as [number, number, number], // #2980b9
    secondary: [127, 140, 141] as [number, number, number], // #7f8c8d
    text: [44, 62, 80] as [number, number, number], // #2c3e50
    divider: [230, 230, 230] as [number, number, number],
    background: [248, 250, 252] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],
    footer: [150, 150, 150] as [number, number, number]
  },
  fonts: {
    base: 'helvetica',
    sizes: {
      companyName: 13,
      reportInfo: 7,
      title: 12,
      label: 8,
      table: 8,
      footer: 7
    }
  },
  margins: {
    default: 14,
    logoSize: 18,
    logoY: 8,
    signaturePadding: 10, // Gap between line and text
    signatureBlockHeight: 30 // Total reserved height for signatures
  }
};

export class ExportService implements IExportService {
  /**
   * Public API to export data to PDF
   */
  exportToPdf(options: ReportOptions): void {
    const doc = this.createPdfDoc(options);
    doc.save(`${options.fileName}.pdf`);
  }

  /**
   * Public API to generate a temporary PDF URL
   */
  generatePdfBlobUrl(options: ReportOptions): string {
    const doc = this.createPdfDoc(options);
    return doc.output('bloburl') as unknown as string;
  }

  /**
   * Public API to export data to Excel
   */
  exportToExcel<T>(data: T[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  /**
   * Internal PDF generation orchestration
   */
  private createPdfDoc(options: ReportOptions): jsPDF {
    const { orientation = 'portrait' } = options;
    const doc = new jsPDF(orientation);

    // 1. Initial Styles and Header
    this.renderHeaderAccent(doc);
    let currentY = this.renderBranding(doc);

    // 2. Metadata and Title
    currentY = this.renderTitleSection(doc, options.title, currentY);

    // 2.1 Description
    if (options.description) {
      currentY = this.renderDescriptionSection(
        doc,
        options.description,
        currentY
      );
    }

    // 2.2 Labels Horizontal
    console.log('[ExportService] Received labelsHorizontal:', options.labelsHorizontal);
    if (options.labelsHorizontal) {
      currentY = this.renderLabelsHorizontal(
        doc,
        options.labelsHorizontal,
        currentY
      );
    }

    // 2.3 Labels Vertical
    if (options.labelsVertical) {
      currentY = this.renderLabelsVertical(
        doc,
        options.labelsVertical,
        currentY
      );
    }

    // 3. Client Information (if provided)
    if (options.clientInfo) {
      // Small spacing after previous sections
      currentY = this.renderClientInfoBox(doc, options.clientInfo, currentY);
    }

    // 4. Data Table
    currentY = this.renderDataTable(doc, options, currentY);

    // 5. Signatures (Always at the bottom)
    this.renderSignatureSection(doc, options.signatures);

    return doc;
  }

  // --- Specialized Rendering Methods (SRP) ---

  private renderHeaderAccent(doc: jsPDF): void {
    const pageWidth = doc.internal.pageSize.width;
    const { primary } = PDF_THEME.colors;
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, pageWidth, 3, 'F'); // Slightly thinner accent
  }

  private renderBranding(doc: jsPDF): number {
    const { default: margin, logoSize, logoY } = PDF_THEME.margins;
    const { primary, secondary } = PDF_THEME.colors;
    const { base: font, sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;

    // Logo
    const img = new Image();
    img.src = logoEpaa;
    try {
      doc.addImage(img, 'PNG', margin, logoY, logoSize, logoSize);
    } catch {
      doc.setFillColor(240, 240, 240);
      doc.circle(
        margin + logoSize / 2,
        logoY + logoSize / 2,
        logoSize / 2,
        'F'
      );
    }

    // Company Name (Dynamic font size based on available width)
    const companyName =
      'EMPRESA PÚBLICA DE AGUA POTABLE Y ALCANTARILLADO DE ANTONIO ANTE';
    const availableTextWidth = pageWidth - margin * 2 - logoSize - 10;

    doc.setFont(font, 'normal');
    let dynamicFontSize = sizes.companyName;
    doc.setFontSize(dynamicFontSize);

    // Simple scaling logic: if name is too wide, shrink it
    while (
      doc.getTextWidth(companyName) > availableTextWidth &&
      dynamicFontSize > 8
    ) {
      dynamicFontSize -= 0.5;
      doc.setFontSize(dynamicFontSize);
    }

    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.text(companyName, margin + logoSize + 6, logoY + logoSize / 2 + 2);

    // Generated Date (Right align)
    const dateStr = new Date().toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(sizes.reportInfo);
    doc.setTextColor(secondary[0], secondary[1], secondary[2]);
    doc.text(`Generado: ${dateStr}`, pageWidth - margin, logoY + 4, {
      align: 'right'
    });

    return logoY + logoSize + 10;
  }

  private renderTitleSection(
    doc: jsPDF,
    title: string,
    startY: number
  ): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;

    // Title (Centered)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(sizes.title);
    doc.setTextColor(text[0], text[1], text[2]);
    doc.text(title.toUpperCase(), pageWidth / 2, startY, { align: 'center' });

    return startY + 8;
  }

  private renderDescriptionSection(
    doc: jsPDF,
    description: string,
    startY: number
  ): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const { default: margin } = PDF_THEME.margins;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.label);
    doc.setTextColor(text[0], text[1], text[2]);

    // Handle long descriptions with wrapping
    const maxWidth = pageWidth - margin * 2;
    const lines = doc.splitTextToSize(description, maxWidth);

    doc.text(lines, pageWidth / 2, startY, { align: 'center' });

    return startY + lines.length * 5;
  }

  private renderLabelsHorizontal(
    doc: jsPDF,
    labelsHorizontal: Record<string, string>,
    startY: number
  ): number {
    const { background, border, primary, text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const { default: margin } = PDF_THEME.margins;
    const pageWidth = doc.internal.pageSize.width;

    const entries = Object.entries(labelsHorizontal);
    if (entries.length === 0) return startY;

    // Box Configuration (matching clientInfo style)
    const boxPadding = 4;
    const lineHeight = 5;
    const midPoint = Math.ceil(entries.length / 2);
    const boxHeight = midPoint * lineHeight + boxPadding * 2;

    // Drawing the container box
    doc.setFillColor(background[0], background[1], background[2]);
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.roundedRect(
      margin,
      startY,
      pageWidth - margin * 2,
      boxHeight,
      1.5,
      1.5,
      'FD'
    );

    doc.setFontSize(sizes.label - 1);
    const col1X = margin + boxPadding;
    const col2X = pageWidth / 2 + 5;
    const labelOffset = 30; // Offset for the value after the label
    let currentY = startY + boxPadding + 3.5;

    const col1Entries = entries.slice(0, midPoint);
    const col2Entries = entries.slice(midPoint);

    // Render both columns inside the box
    for (let i = 0; i < midPoint; i++) {
      // Column 1
      if (col1Entries[i]) {
        const [key, value] = col1Entries[i];
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primary[0], primary[1], primary[2]);
        doc.text(`${key}:`, col1X, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(text[0], text[1], text[2]);
        doc.text(String(value), col1X + labelOffset, currentY);
      }

      // Column 2
      if (col2Entries[i]) {
        const [key, value] = col2Entries[i];
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primary[0], primary[1], primary[2]);
        doc.text(`${key}:`, col2X, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(text[0], text[1], text[2]);
        doc.text(String(value), col2X + labelOffset, currentY);
      }

      currentY += lineHeight;
    }

    return startY + boxHeight + 2;
  }

  private renderLabelsVertical(
    doc: jsPDF,
    labelsVertical: Record<string, string>,
    startY: number
  ): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.label - 1);
    doc.setTextColor(text[0], text[1], text[2]);

    let currentY = startY;
    Object.entries(labelsVertical).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, pageWidth / 2, currentY, {
        align: 'center'
      });
      currentY += 5;
    });

    return currentY + 2;
  }

  private renderClientInfoBox(
    doc: jsPDF,
    clientInfo: Record<string, any>,
    startY: number
  ): number {
    const { default: margin } = PDF_THEME.margins;
    const { background, border, primary, text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;

    const entries = Object.entries(clientInfo);
    const boxPadding = 4;
    const lineHeight = 5;
    const boxHeight = entries.length * lineHeight + boxPadding * 2;

    // Styling the box
    doc.setFillColor(background[0], background[1], background[2]);
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.roundedRect(
      margin,
      startY,
      pageWidth - margin * 2,
      boxHeight,
      1.5,
      1.5,
      'FD'
    );

    let currentY = startY + boxPadding + 3.5;
    doc.setFontSize(sizes.label);

    entries.forEach(([key, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primary[0], primary[1], primary[2]);
      doc.text(`${key}:`, margin + boxPadding, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(text[0], text[1], text[2]);
      doc.text(String(value), margin + boxPadding + 35, currentY);
      currentY += lineHeight;
    });

    return startY + boxHeight + 8;
  }

  private renderDataTable(
    doc: jsPDF,
    options: ReportOptions,
    startY: number
  ): number {
    const { default: margin } = PDF_THEME.margins;
    const { primary, footer } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;

    autoTable(doc, {
      head: [options.columns],
      body: options.rows,
      startY,
      theme: 'grid',
      styles: {
        fontSize: sizes.table,
        cellPadding: 3,
        valign: 'middle',
        lineColor: [230, 230, 230],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        // Footer (Page numbers)
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(sizes.footer);
        doc.setTextColor(footer[0], footer[1], footer[2]);
        doc.text(`Página ${data.pageNumber}`, margin, pageHeight - 8);
      }
    });

    return (doc as any).lastAutoTable.finalY;
  }

  private renderSignatureSection(doc: jsPDF, signatures?: Signature[]): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const {
      default: margin,
      signaturePadding: padding,
      signatureBlockHeight: blockHeight
    } = PDF_THEME.margins;
    const { text, secondary } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;

    // Default signature if none provided
    const signaturesToRender =
      signatures && signatures.length > 0
        ? signatures
        : [{ label: 'FIRMA RESPONSABLE', name: 'EPAA - Antonio Ante' }];

    const signatureCount = signaturesToRender.length;

    // Position ALWAYS at the bottom of the page, but closer to the edge
    let signatureY = pageHeight - margin - blockHeight + 8;

    // If the table crashed into this area, force a new page
    const lastAutoTable = (doc as any).lastAutoTable;
    // signatureY is the start of the signatures. If table ends below the start, we break.
    // Use a very small buffer to maximize space.
    if (lastAutoTable && lastAutoTable.finalY > signatureY - 5) {
      doc.addPage();
    }

    // Calculate horizontal spacing
    const totalWidth = pageWidth - margin * 2;
    const spacing = totalWidth / signatureCount;

    signaturesToRender.forEach((sig, index) => {
      const centerX = margin + spacing * index + spacing / 2;

      // Line (More space for physical signature above)
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.04);
      doc.line(centerX - 28, signatureY + 5, centerX + 28, signatureY + 5);

      // Label (Uppercase, Bold)
      doc.setFontSize(sizes.label);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(text[0], text[1], text[2]);
      doc.text(sig.label.toUpperCase(), centerX, signatureY + padding, {
        align: 'center'
      });

      // Name (Optional)
      let currentSubY = signatureY + padding + 4.5;
      if (sig.name) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(sizes.footer);
        doc.setTextColor(secondary[0], secondary[1], secondary[2]);
        doc.text(sig.name, centerX, currentSubY, { align: 'center' });
        currentSubY += 4.5;
      }

      // ID/Cedula (Optional)
      if (sig.idNumber) {
        doc.setFontSize(sizes.footer - 1);
        doc.text(`C.I: ${sig.idNumber}`, centerX, currentSubY, {
          align: 'center'
        });
      }
    });
  }
}
