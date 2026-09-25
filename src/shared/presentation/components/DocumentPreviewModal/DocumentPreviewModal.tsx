import React, { useState } from 'react';
import { Download, FileText, AlertCircle, Loader2, X } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import './DocumentPreviewModal.css';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  title?: string;
  fileName?: string;
  onDownload?: () => void;
  isLoading?: boolean;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  title = 'Vista previa de documento',
  fileName = 'DOCUMENTO.pdf',
  onDownload,
  isLoading = false
}) => {
  const [iframeError, setIframeError] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={<FileText size={20} />}
      size="xl"
      headerColor="indigo"
      footer={
        <div className="document-preview-footer">
          <Button variant="dashed" onClick={onClose}
            color='error'
            size='xs'
            leftIcon={<X size={16} />}
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            size='xs'
            onClick={handleDownload}
            disabled={!documentUrl || isLoading}
            leftIcon={<Download size={16} />}
          >
            Descargar
          </Button>
        </div>
      }
    >
      <div className="document-preview-container">
        {isLoading ? (
          <div className="document-preview-state">
            <Loader2 className="document-preview-spinner" size={48} />
            <p>Generando documento...</p>
          </div>
        ) : !documentUrl ? (
          <div className="document-preview-state error">
            <AlertCircle size={48} />
            <p>No se pudo cargar el documento.</p>
          </div>
        ) : iframeError ? (
          <div className="document-preview-state error">
            <AlertCircle size={48} />
            <p>El navegador bloqueó la previsualización.</p>
            <Button variant="outline" onClick={handleDownload} leftIcon={<Download size={16} />}>
              Descargar para ver
            </Button>
          </div>
        ) : (
          <iframe
            src={documentUrl}
            className="document-preview-iframe"
            title={title}
            onError={() => setIframeError(true)}
          />
        )}
      </div>
    </Modal>
  );
};
