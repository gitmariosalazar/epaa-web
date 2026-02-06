import React, { useState, useEffect } from 'react';
import { X, Check, Download, Loader2 } from 'lucide-react';
import './ReportPreviewModal.css';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (orientation: 'portrait' | 'landscape') => void;
  dataCount: number;
  reportTitle: string;
  pdfGenerator?: (orientation: 'portrait' | 'landscape') => string;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  dataCount,
  reportTitle,
  pdfGenerator
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (isOpen && pdfGenerator) {
      setLoadingPreview(true);
      // Small timeout to allow UI to render before heavy PDF generation
      const timer = setTimeout(() => {
        const url = pdfGenerator(orientation);
        setPreviewUrl(url);
        setLoadingPreview(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, orientation, pdfGenerator]);

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
            <p className="modal-description">
              You are about to download <strong>{reportTitle}</strong> with{' '}
              <strong>{dataCount}</strong> rows.
            </p>

            <div className="orientation-selection">
              <h4 className="section-title">Select Orientation</h4>
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
              <p className="orientation-hint">
                {orientation === 'landscape'
                  ? 'Best for many columns.'
                  : 'Best for standard docs.'}
              </p>
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
            onClick={() => onDownload(orientation)}
          >
            <Download size={18} style={{ marginRight: '8px' }} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
