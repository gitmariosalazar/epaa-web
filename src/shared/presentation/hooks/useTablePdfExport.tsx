import { useState, useMemo } from 'react';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { Signature } from '@/shared/domain/services/IExportService';

export interface UseTablePdfExportOptions<T> {
  data: T[];
  availableColumns: ExportColumn[];
  reportTitle: string;
  reportDescription?: string;
  labelsHorizontal?: Record<string, string>;
  labelsVertical?: Record<string, string>;
  clientInfo?: Record<string, string>;
  signatures?: Signature[];
  totalRows?: {
    label: string;
    value: string | number;
    highlight?: boolean;
    columnId?: string;
  }[];
  mapRowData: (row: T, selectedCols: ExportColumn[]) => any[];
}

export const useTablePdfExport = <T,>({
  data,
  availableColumns,
  reportTitle,
  reportDescription,
  labelsHorizontal,
  labelsVertical,
  clientInfo,
  signatures,
  totalRows,
  mapRowData
}: UseTablePdfExportOptions<T>) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const exportService = useMemo(() => new ExportService(), []);

  const handlePdfGenerator = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = availableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.map((d) => mapRowData(d, selectedCols));

    let totals: string[] | undefined;
    if (totalRows && totalRows.length > 0) {
      totals = selectedCols.map((col, colIndex) => {
        if (colIndex === 0) return 'TOTAL';
        const matchingTotal =
          totalRows.find((r) => r.columnId && r.columnId === col.id) ||
          totalRows.find((r) => r.label === col.label) ||
          totalRows.find(
            (r) =>
              r.label.toLowerCase().includes(col.label.toLowerCase()) ||
              r.label
                .toLowerCase()
                .includes(col.label.toLowerCase().replace('total', '').trim())
          );
        
        if (matchingTotal) {
           return typeof matchingTotal.value === 'number' 
             ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(matchingTotal.value)
             : String(matchingTotal.value);
        }
        return '';
      });
    }

    return exportService.generatePdfBlobUrl({
      rows,
      columns: colLabels,
      fileName: `reporte_${Date.now()}`,
      title: reportTitle,
      orientation,
      description: reportDescription,
      labelsHorizontal,
      labelsVertical,
      clientInfo,
      signatures,
      totals
    });
  };

  const handleDownloadPdf = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = availableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.map((d) => mapRowData(d, selectedCols));

    let totals: string[] | undefined;
    if (totalRows && totalRows.length > 0) {
      totals = selectedCols.map((col, colIndex) => {
        if (colIndex === 0) return 'TOTAL';
        const matchingTotal =
          totalRows.find((r) => r.columnId && r.columnId === col.id) ||
          totalRows.find((r) => r.label === col.label) ||
          totalRows.find(
            (r) =>
              r.label.toLowerCase().includes(col.label.toLowerCase()) ||
              r.label
                .toLowerCase()
                .includes(col.label.toLowerCase().replace('total', '').trim())
          );
        
        if (matchingTotal) {
           return typeof matchingTotal.value === 'number' 
             ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(matchingTotal.value)
             : String(matchingTotal.value);
        }
        return '';
      });
    }

    exportService.exportToPdf({
      rows,
      columns: colLabels,
      fileName: `reporte_${Date.now()}`,
      title: reportTitle,
      orientation,
      description: reportDescription,
      labelsHorizontal,
      labelsVertical,
      clientInfo,
      signatures,
      totals
    });
    setShowPdfPreview(false);
  };

  const PdfPreviewModal = (
    <ReportPreviewModal
      isOpen={showPdfPreview}
      onClose={() => setShowPdfPreview(false)}
      dataCount={data.length}
      reportTitle={reportTitle}
      availableColumns={availableColumns}
      pdfGenerator={handlePdfGenerator}
      onDownload={handleDownloadPdf}
    />
  );

  return {
    showPdfPreview,
    setShowPdfPreview,
    PdfPreviewModal
  };
};
