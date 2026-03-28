import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [hasGenerationError, setHasGenerationError] = useState(false);
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string>('');
  const isGeneratingRef = useRef(false);
  const exportService = useMemo(() => new ExportService(), []);

  // Sync selection with available columns
  useEffect(() => {
    if (availableColumns.length > 0) {
      setSelectedColumnIds((prev) => {
        // Filter out columns that are no longer available
        const nextValidIds = prev.filter((id) =>
          availableColumns.some((col) => col.id === id)
        );

        // If no valid previous columns or first run, use defaults
        let finalIds: string[];
        if (nextValidIds.length === 0) {
          finalIds = availableColumns
            .filter((c) => c.isDefault !== false)
            .map((c) => c.id);
        } else {
          finalIds = nextValidIds;
        }

        // BAIL OUT if content is exactly the same to avoid infinite re-render loop
        if (
          prev.length === finalIds.length &&
          prev.every((id, idx) => id === finalIds[idx])
        ) {
          return prev;
        }

        return finalIds;
      });
    }
  }, [availableColumns]);

  const revokeOldUrl = (url: string | null) => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Error revoking URL:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      revokeOldUrl(previewUrl);
    };
  }, [previewUrl]);

  const generatePreview = useCallback(
    (currentOrientation: 'portrait' | 'landscape', currentColumns: string[]) => {
      if (!showPdfPreview || currentColumns.length === 0) return;

      if (isGeneratingRef.current) return;

      setLoadingPreview(true);
      setHasGenerationError(false);
      isGeneratingRef.current = true;

      // Small timeout to allow the spinner UI to render
      setTimeout(() => {
        try {
          const selectedCols = availableColumns.filter((col) =>
            currentColumns.includes(col.id) || (col.columnId && currentColumns.includes(col.columnId))
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
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(matchingTotal.value)
                  : String(matchingTotal.value);
              }
              return '';
            });
          }

          const url = exportService.generatePdfBlobUrl({
            rows,
            columns: colLabels,
            fileName: `reporte_${Date.now()}`,
            title: reportTitle,
            orientation: currentOrientation,
            description: reportDescription,
            labelsHorizontal,
            labelsVertical,
            clientInfo,
            signatures,
            totals
          });

          setPreviewUrl((old) => {
            revokeOldUrl(old);
            return url;
          });
          setHasGenerationError(false);
          setLastGeneratedKey(`${currentOrientation}-${currentColumns.join(',')}`);
        } catch (error) {
          console.error('Preview generation failed:', error);
          setHasGenerationError(true);
          setLastGeneratedKey(`${currentOrientation}-${currentColumns.join(',')}`);
        } finally {
          setLoadingPreview(false);
          isGeneratingRef.current = false;
        }
      }, 50); // Reduced delay to prevent race conditions during multiple renders
    },
    [
      showPdfPreview,
      availableColumns,
      data,
      mapRowData,
      totalRows,
      exportService,
      reportTitle,
      reportDescription,
      labelsHorizontal,
      labelsVertical,
      clientInfo,
      signatures
    ]
  );

  // Auto-generate on open IF no preview exists or parameters changed
  useEffect(() => {
    const currentKey = `${orientation}-${selectedColumnIds.join(',')}`;
    if (
      showPdfPreview && 
      !previewUrl && 
      !loadingPreview && 
      !hasGenerationError && 
      currentKey !== lastGeneratedKey
    ) {
      generatePreview(orientation, selectedColumnIds);
    }
  }, [showPdfPreview, previewUrl, loadingPreview, hasGenerationError, orientation, selectedColumnIds, lastGeneratedKey, generatePreview]);

  // Reset error when parameters change, to allow retrying
  useEffect(() => {
    setHasGenerationError(false);
    setLastGeneratedKey('');
  }, [orientation, selectedColumnIds, data, availableColumns]);

  // Clean up preview when closed to ensure a fresh starts next time (optional, but safer for now)
  useEffect(() => {
    if (!showPdfPreview) {
      setPreviewUrl((old) => {
        revokeOldUrl(old);
        return null;
      });
      setLoadingPreview(false);
      setHasGenerationError(false);
      setLastGeneratedKey('');
    }
  }, [showPdfPreview]);

  const handleDownloadPdf = useCallback(
    ({ orientation: currentOrientation, selectedColumnIds: currentColumns }: any) => {
      const selectedCols = availableColumns.filter((col) =>
        currentColumns.includes(col.id) || (col.columnId && currentColumns.includes(col.columnId))
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
              ? new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(matchingTotal.value)
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
        orientation: currentOrientation,
        description: reportDescription,
        labelsHorizontal,
        labelsVertical,
        clientInfo,
        signatures,
        totals
      });
      setShowPdfPreview(false);
    },
    [
      availableColumns,
      data,
      mapRowData,
      totalRows,
      exportService,
      reportTitle,
      reportDescription,
      labelsHorizontal,
      labelsVertical,
      clientInfo,
      signatures
    ]
  );

  const PdfPreviewModal = useMemo(() => {
    if (!showPdfPreview) return null;

    return (
      <ReportPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        dataCount={data.length}
        reportTitle={reportTitle}
        availableColumns={availableColumns}
        onDownload={handleDownloadPdf}
        onApply={() => {
          generatePreview(orientation, selectedColumnIds);
        }}
        loadingPreview={loadingPreview}
        previewUrl={previewUrl}
        orientation={orientation}
        setOrientation={setOrientation}
        selectedColumnIds={selectedColumnIds}
        setSelectedColumnIds={setSelectedColumnIds}
        hasError={hasGenerationError}
      />
    );
  }, [
    showPdfPreview,
    data.length,
    reportTitle,
    availableColumns,
    loadingPreview,
    previewUrl,
    handleDownloadPdf,
    orientation,
    selectedColumnIds
  ]);

  return {
    showPdfPreview,
    setShowPdfPreview,
    PdfPreviewModal
  };
};
