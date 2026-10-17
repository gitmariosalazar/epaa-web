import React, { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import {
  MAX_EVIDENCE_FILES,
  MAX_EVIDENCE_FILE_SIZE_BYTES,
} from '../../../domain/constants/evidence-stage';
import { compressImageFile } from './imageCompression';
import { useObjectUrls } from './useObjectUrls';

interface EvidenceUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  onError?: (message: string | null) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  files,
  onChange,
  onError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useObjectUrls(files);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;
    onError?.(null);

    const available = MAX_EVIDENCE_FILES - files.length;
    if (selected.length > available) {
      onError?.(`Máximo ${MAX_EVIDENCE_FILES} imágenes por orden.`);
    }

    const accepted: File[] = [];
    for (const file of selected.slice(0, Math.max(available, 0))) {
      if (!file.type.startsWith('image/')) {
        onError?.('Solo se permiten imágenes.');
        continue;
      }
      try {
        const compressed = await compressImageFile(file);
        if (compressed.size > MAX_EVIDENCE_FILE_SIZE_BYTES) {
          onError?.('Una imagen supera el tamaño máximo de 10 MB.');
          continue;
        }
        accepted.push(compressed);
      } catch {
        onError?.('No se pudo procesar una de las imágenes.');
      }
    }
    if (accepted.length > 0) onChange([...files, ...accepted]);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        style={{ display: 'none' }}
      />
      <div className="evidence-upload-container">
        <div
          className="evidence-upload-trigger-box"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud size={20} className="upload-trigger-icon" />
          <span className="upload-trigger-text">Cargar</span>
        </div>

        {previews.map((src, idx) => (
          <div key={src} className="evidence-image-preview-wrapper">
            <img src={src} alt={`evidencia-${idx}`} className="evidence-image-preview" />
            <button
              type="button"
              className="evidence-image-remove-btn"
              onClick={() => onChange(files.filter((_, i) => i !== idx))}
              title="Eliminar imagen"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
