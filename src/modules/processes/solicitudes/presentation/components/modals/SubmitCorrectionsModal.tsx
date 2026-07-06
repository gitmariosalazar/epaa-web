import React, { useState } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';

interface SubmitCorrectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectedDocuments: DocumentoAdjuntoResponse[];
  onSubmitCorrections: (files: File[], documentIds: string[]) => Promise<void>;
  isSubmitting: boolean;
}

export const SubmitCorrectionsModal: React.FC<SubmitCorrectionsModalProps> = ({
  isOpen,
  onClose,
  rejectedDocuments,
  onSubmitCorrections,
  isSubmitting,
}) => {
  // State maps documentId to File
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  const handleFileChange = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setSelectedFiles((prev) => ({
        ...prev,
        [documentId]: newFile,
      }));
    }
  };

  const removeFile = (documentId: string) => {
    setSelectedFiles((prev) => {
      const next = { ...prev };
      delete next[documentId];
      return next;
    });
  };

  const handleSubmit = async () => {
    const filesArray: File[] = [];
    const documentIdsArray: string[] = [];

    rejectedDocuments.forEach((doc) => {
      if (selectedFiles[doc.id]) {
        filesArray.push(selectedFiles[doc.id]);
        documentIdsArray.push(doc.id);
      }
    });

    await onSubmitCorrections(filesArray, documentIdsArray);
  };

  const isFormValid = rejectedDocuments.every((doc) => !!selectedFiles[doc.id]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subir Correcciones Pendientes"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            isLoading={isSubmitting} 
            disabled={!isFormValid || isSubmitting}
          >
            Enviar Todas las Correcciones
          </Button>
        </>
      }
    >
      <div className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: 'var(--text-primary)'
        }}>
          <AlertCircle size={20} color="var(--danger-color, #ef4444)" />
          <span style={{ fontSize: '0.875rem' }}>
            Por favor suba la corrección para cada uno de los siguientes documentos.
            Una vez que todos estén listos, podrá enviarlos a revisión.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rejectedDocuments.map((doc) => (
            <div 
              key={doc.id}
              style={{
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} color="var(--primary-color)" />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    Requisito #{doc.tipodocumento}
                  </span>
                </div>
                {doc.observacion && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--danger-color, #ef4444)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    Obs: {doc.observacion}
                  </span>
                )}
              </div>

              {selectedFiles[doc.id] ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--primary-color)',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFiles[doc.id].name}
                  </span>
                  <Button
                    variant="ghost"
                    size="compact"
                    color="error"
                    onClick={() => removeFile(doc.id)}
                    iconOnly
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '6px',
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'var(--surface)'
                }}>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(doc.id, e)}
                    accept=".pdf,.png,.jpg,.jpeg"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <Upload size={24} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Haz clic o arrastra para subir la corrección</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
