import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Calendar,
  Camera,
  Droplet,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingImages } from '../../domain/models/ReadingImages';
import '../styles/ReadingImagesViewer.css';

interface ReadingImagesViewerProps {
  isOpen: boolean;
  onClose: () => void;
  readingData: ReadingImages | null;
}

export const ReadingImagesViewer: React.FC<ReadingImagesViewerProps> = ({
  isOpen,
  onClose,
  readingData
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = readingData?.images || [];

  // Reset index and zoom when newly opened
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, images]);

  if (!readingData || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed((prev) => !prev);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsZoomed(false);
        onClose();
      }}
      title={t('readings.photoEvidence', 'Evidencias Fotográficas')}
      size="lg"
    >
      <div className="reading-images-viewer-layout">
        <div className="reading-images-viewer">
          {images.length > 1 && !isZoomed && (
            <Button
              variant="outline"
              circle
              className="reading-images-viewer__btn-prev"
              onClick={handlePrev}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </Button>
          )}

          <div
            className={`reading-images-viewer__image-container ${
              isZoomed ? 'reading-images-viewer__image-container--zoomed' : ''
            }`}
            key={currentImageIndex}
            onClick={isZoomed ? toggleZoom : undefined}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Evidencia ampliada ${currentImageIndex + 1}`}
              className={`reading-images-viewer__image reading-images-viewer__image--clickable ${
                isZoomed ? 'reading-images-viewer__image--zoomed' : ''
              }`}
              onClick={!isZoomed ? toggleZoom : undefined}
            />
          </div>

          {images.length > 1 && (
            <Button
              variant="outline"
              circle
              className="reading-images-viewer__btn-next"
              onClick={handleNext}
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </Button>
          )}

          {images.length > 1 && (
            <div className="reading-images-viewer__badge">
              {currentImageIndex + 1} de {images.length}
            </div>
          )}
        </div>

        {/* Data Context Panel */}
        <div className="reading-images-context">
          <div className="reading-images-context__header">
            <Camera size={18} className="reading-images-context__icon" />
            <h3>Detalles de la Lectura</h3>
          </div>

          <div className="reading-images-context__grid">
            <div className="reading-images-context__item">
              <span className="reading-images-context__label">
                Clave Catastral
              </span>
              <span className="reading-images-context__value highlight-blue">
                <Hash size={14} /> {readingData.cadastralKey}
              </span>
            </div>

            <div className="reading-images-context__item">
              <span className="reading-images-context__label">Período</span>
              <span className="reading-images-context__value">
                <Calendar size={14} /> {readingData.readingMonthName}{' '}
                {readingData.readingYear}
              </span>
            </div>

            <div className="reading-images-context__item">
              <span className="reading-images-context__label">Consumo</span>
              <span className="reading-images-context__value highlight-green">
                <Droplet size={14} /> {readingData.consumption || 0} m³
              </span>
            </div>

            <div className="reading-images-context__item">
              <span className="reading-images-context__label">Novedad</span>
              <span
                className={`reading-images-context__value ${readingData.novelty && readingData.novelty !== 'Ninguna' ? 'highlight-orange' : ''}`}
              >
                <AlertTriangle size={14} /> {readingData.novelty || 'Ninguna'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
