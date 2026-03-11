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
      signatures
    });
  };

  const handleDownloadPdf = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = availableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.map((d) => mapRowData(d, selectedCols));

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
      signatures
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
