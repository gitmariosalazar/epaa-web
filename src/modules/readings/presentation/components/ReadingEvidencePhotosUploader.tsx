import React, { useRef, useState } from 'react';
import type { PhotoInputDto } from '../../domain/dto/request/UpdateSpecialReadingRequest';
import { Camera, UploadCloud, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import '../styles/ReadingEvidencePhotosUploader.css';

interface ReadingEvidencePhotosUploaderProps {
  photos: PhotoInputDto[];
  onChange: (photos: PhotoInputDto[]) => void;
}

// Client-side image compression helper for optimal payload size
const compressImage = (
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas 2D context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ReadingEvidencePhotosUploader: React.FC<ReadingEvidencePhotosUploaderProps> = ({
  photos,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newPhotos: PhotoInputDto[] = [...photos];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressedBase64 = await compressImage(file);
        newPhotos.push({
          photoUrl: compressedBase64,
          description: file.name ? `Evidencia: ${file.name}` : 'Foto de evidencia del ajuste',
        });
      }
      onChange(newPhotos);
    } catch (err) {
      console.error('Error procesando imagen de evidencia:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrlPhoto = () => {
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim().slice(0, 250);
    const newPhoto: PhotoInputDto = {
      photoUrl: cleanUrl,
      description: descriptionInput.trim().slice(0, 250) || undefined,
    };
    onChange([...photos, newPhoto]);
    setUrlInput('');
    setDescriptionInput('');
    setShowUrlInput(false);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDescriptionChange = (index: number, newDesc: string) => {
    const truncated = newDesc.slice(0, 250);
    const updated = photos.map((p, i) =>
      i === index ? { ...p, description: truncated } : p
    );
    onChange(updated);
  };

  return (
    <div className="evidence-uploader-container">
      <div className="evidence-uploader-header">
        <span className="evidence-uploader-title">
          <Camera size={15} style={{ marginRight: 6 }} />
          Fotos de Evidencia ({photos.length})
        </span>

        <div className="evidence-uploader-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />

          <Button
            type="button"
            variant="outline"
            size="xs"
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            leftIcon={<UploadCloud size={13} />}
          >
            Subir Foto
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            color="neutral"
            onClick={() => setShowUrlInput(!showUrlInput)}
            leftIcon={<Plus size={13} />}
            disabled={true}
          >
            {showUrlInput ? 'Cancelar URL' : 'Agregar por URL'}
          </Button>
        </div>
      </div>

      {showUrlInput && (
        <div className="evidence-url-box">
          <Input
            label="URL de la Foto"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            size="small"
          />
          <Input
            label="Descripción (Opcional)"
            placeholder="Ej: Foto del medidor ajustado"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            size="small"
          />
          <Button
            type="button"
            variant="dashed"
            size="xs"
            color="primary"
            onClick={handleAddUrlPhoto}
            disabled={!urlInput.trim()}
          >
            Agregar Foto
          </Button>
        </div>
      )}

      {photos.length > 0 ? (
        <div className="evidence-photos-list">
          {photos.map((item, idx) => (
            <div key={idx} className="evidence-photo-card">
              <div className="evidence-photo-thumb-wrapper">
                {item.photoUrl.startsWith('http') || item.photoUrl.startsWith('data:') || item.photoUrl.startsWith('blob:') ? (
                  <img src={item.photoUrl} alt={`Evidencia ${idx + 1}`} className="evidence-photo-thumb" />
                ) : (
                  <div className="evidence-photo-thumb-placeholder">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <div className="evidence-photo-details">
                <Input
                  label={`Descripción Foto ${idx + 1}`}
                  value={item.description || ''}
                  onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                  placeholder="Descripción opcional..."
                  size="small"
                />
              </div>
              <button
                type="button"
                className="evidence-photo-remove-btn"
                onClick={() => handleRemovePhoto(idx)}
                title="Eliminar foto"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="evidence-photos-empty">
          <span>Sin fotos de evidencia adjuntas para este ajuste.</span>
        </div>
      )}
    </div>
  );
};
