import React from 'react';
import { X, Check, Download, Loader2 } from 'lucide-react';
import './ReportPreviewModal.css';
import { Button } from '../Button/Button';

export interface ExportColumn {
  id: string;      // Legacy/Internal ID
  columnId?: string; // Standardized ID (Accounting style)
  label: string;
  isDefault?: boolean;
}

interface ReportPreviewModalOptions {
  orientation: 'portrait' | 'landscape';
  selectedColumnIds: string[];
}

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (options: ReportPreviewModalOptions) => void;
  onApply: () => void;
  dataCount: number;
  reportTitle: string;
  availableColumns: ExportColumn[];
  loadingPreview: boolean;
  previewUrl: string | null;
  // Shared state from hook
  orientation: 'portrait' | 'landscape';
  setOrientation: (o: 'portrait' | 'landscape') => void;
  selectedColumnIds: string[];
  setSelectedColumnIds: (
    ids: string[] | ((prev: string[]) => string[])
  ) => void;
  hasError?: boolean;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  onApply,
  dataCount,
  reportTitle,
  availableColumns,
  loadingPreview,
  previewUrl,
  orientation,
  setOrientation,
  selectedColumnIds,
  setSelectedColumnIds,
  hasError
}) => {

  const selectAllColumns = () => {
    setSelectedColumnIds(availableColumns.map((c) => c.id));
  };

  const deselectAllColumns = () => {
    setSelectedColumnIds([]);
  };

  const toggleColumn = (id: string) => {
    setSelectedColumnIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((colId) => colId !== id);
      } else {
        const newSelection = [...prev, id];
        return availableColumns
          .filter((c) => newSelection.includes(c.id))
          .map((c) => c.id);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Descargar Reporte</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-preview-layout">
          <div className="sidebar-controls">
            <div className="sidebar-scrollable-content">
              <p className="modal-description">
                Estás a punto de descargar <strong>{reportTitle}</strong> con{' '}
                <strong>{dataCount}</strong> filas.
              </p>

              <div className="control-section">
                <h4 className="section-title">Orientación</h4>
                <div className="orientation-options vertical">
                  <div
                    className={`orientation-card ${
                      orientation === 'portrait' ? 'selected' : ''
                    }`}
                    onClick={() => setOrientation('portrait')}
                  >
                    <div className="preview-icon portrait">
                      <div className="preview-lines"></div>
                    </div>
                    <div className="option-label">
                      <span>Vertical</span>
                      {orientation === 'portrait' && (
                        <Check size={16} className="check-icon" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`orientation-card ${
                      orientation === 'landscape' ? 'selected' : ''
                    }`}
                    onClick={() => setOrientation('landscape')}
                  >
                    <div className="preview-icon landscape">
                      <div className="preview-lines"></div>
                    </div>
                    <div className="option-label">
                      <span>Horizontal</span>
                      {orientation === 'landscape' && (
                        <Check size={16} className="check-icon" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="control-section">
                <h4 className="section-title">Columnas</h4>
                <div className="section-header-row">
                  <div className="section-actions">
                    <button className="text-btn" onClick={selectAllColumns}>
                      Seleccionar Todo
                    </button>
                    <span className="separator">|</span>
                    <button className="text-btn" onClick={deselectAllColumns}>
                      Limpiar
                    </button>
                  </div>
                </div>
                <div className="columns-list">
                  {availableColumns.map((col) => (
                    <div
                      key={col.id}
                      className={`column-option ${
                        selectedColumnIds.includes(col.id) ? 'selected' : ''
                      }`}
                      onClick={() => toggleColumn(col.id)}
                    >
                      <div className="checkbox-custom">
                        {selectedColumnIds.includes(col.id) && (
                          <Check size={12} />
                        )}
                      </div>
                      <span className="column-label">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="apply-section">
              <Button
                className="btn-apply"
                onClick={onApply}
                disabled={selectedColumnIds.length === 0 || loadingPreview}
              >
                {loadingPreview ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                <span>Aplicar Cambios</span>
              </Button>
            </div>
          </div>

          <div className="preview-container">
            {loadingPreview ? (
              <div className="preview-loading">
                <Loader2 className="animate-spin text-accent" size={32} />
                <span>Generando previsualización...</span>
              </div>
            ) : previewUrl ? (
              <iframe
                key={previewUrl}
                src={`${previewUrl}#toolbar=0&view=FitH`}
                title="PDF Preview"
                className="pdf-preview-frame"
              />
            ) : hasError ? (
              <div className="preview-error">
                <p>Ocurrió un error al generar la previsualización.</p>
                <Button variant="outline" size="sm" onClick={onApply}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="preview-placeholder">
                Previsualización no disponible
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button
            className="btn-secondary"
            onClick={onClose}
            leftIcon={<X size={18} />}
          >
            Cancelar
          </Button>
          <Button
            className="btn-primary"
            onClick={() => onDownload({ orientation, selectedColumnIds })}
            leftIcon={<Download size={18} />}
            disabled={loadingPreview}
          >
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
