import React, { useState, useEffect } from 'react';
import { X, Check, Download, Loader2 } from 'lucide-react';
import './ReportPreviewModal.css';

export interface ExportColumn {
  id: string;
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
  dataCount: number;
  reportTitle: string;
  pdfGenerator?: (options: ReportPreviewModalOptions) => string;
  availableColumns: ExportColumn[];
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  dataCount,
  reportTitle,
  pdfGenerator,
  availableColumns
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Initial load
  useEffect(() => {
    if (isOpen && pdfGenerator && selectedColumnIds.length === 0 && availableColumns.length > 0) {
      const defaults = availableColumns
        .filter((c) => c.isDefault !== false)
        .map((c) => c.id);
      setSelectedColumnIds(defaults);
      
      // Auto-generate first time
      setLoadingPreview(true);
      const timer = setTimeout(() => {
        const url = pdfGenerator({ orientation, selectedColumnIds: defaults });
        setPreviewUrl(url);
        setLoadingPreview(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleApply = () => {
    if (!pdfGenerator || selectedColumnIds.length === 0) return;
    setLoadingPreview(true);
    // Small timeout to show loader
    setTimeout(() => {
      const url = pdfGenerator({ orientation, selectedColumnIds });
      setPreviewUrl(url);
      setLoadingPreview(false);
    }, 200);
  };

  const selectAllColumns = () => {
    setSelectedColumnIds(availableColumns.map((c) => c.id));
  };

  const deselectAllColumns = () => {
    // Keep at least one or none? The UI currently prevents unchecking last.
    // Let's just leave it empty and valid check happens in handleApply.
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
          <h3>Download Report</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-preview-layout">
          <div className="sidebar-controls">
            <div className="sidebar-scrollable-content">
              <p className="modal-description">
                You are about to download <strong>{reportTitle}</strong> with{' '}
                <strong>{dataCount}</strong> rows.
              </p>

              <div className="control-section">
                <h4 className="section-title">Orientation</h4>
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
                      <span>Portrait</span>
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
                      <span>Landscape</span>
                      {orientation === 'landscape' && (
                        <Check size={16} className="check-icon" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="control-section">
                <div className="section-header-row">
                  <h4 className="section-title">Columns</h4>
                  <div className="section-actions">
                    <button className="text-btn" onClick={selectAllColumns}>Select All</button>
                    <span className="separator">|</span>
                    <button className="text-btn" onClick={deselectAllColumns}>Clear</button>
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
               <button 
                 className="btn-apply" 
                 onClick={handleApply}
                 disabled={selectedColumnIds.length === 0 || loadingPreview}
               >
                 {loadingPreview ? (
                   <Loader2 size={18} className="animate-spin" />
                 ) : (
                   <Check size={18} />
                 )}
                 <span>Aplicar Cambios</span>
               </button>
            </div>
          </div>

          <div className="preview-container">
            {loadingPreview ? (
              <div className="preview-loading">
                <Loader2 className="animate-spin text-accent" size={32} />
                <span>Generating Preview...</span>
              </div>
            ) : previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=0&view=FitH`}
                title="PDF Preview"
                className="pdf-preview-frame"
              />
            ) : (
              <div className="preview-placeholder">Preview not available</div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => onDownload({ orientation, selectedColumnIds })}
          >
            <Download size={18} style={{ marginRight: '8px' }} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
