import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Droplet
} from 'lucide-react';

import { ReadingImagesFilters } from '../components/ReadingImagesFilters';
import { useReadingImagesList } from '../hooks/useReadingImagesList';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { ReadingImages } from '../../domain/models/ReadingImages';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ReadingImagesViewer } from '../components/ReadingImagesViewer';
import '../styles/ReadingImagesPage.css';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

export const ReadingImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { readingImages, isLoading, error, fetchImages } =
    useReadingImagesList();
  const loadingProgress = useSimulatedProgress(isLoading);

  // State for the image viewer
  const [selectedReading, setSelectedReading] = useState<ReadingImages | null>(
    null
  );

  const handleFetch = (filters: {
    monthIso?: string;
    sector?: string;
    cadastralKey?: string;
  }) => {
    fetchImages({
      month: filters.monthIso,
      sector: filters.sector,
      cadastralKey: filters.cadastralKey
    });
  };

  const getNoveltyBadge = (novelty?: string) => {
    if (!novelty || novelty.toLowerCase() === 'ninguna') {
      return (
        <span className="badge-novelty badge-novelty--none">
          <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
          Ninguna
        </span>
      );
    }
    // Simplistic logic: assume anything else is an alert/danger for visual difference
    return (
      <span className="badge-novelty badge-novelty--alert">
        <AlertTriangle size={12} style={{ marginRight: '4px' }} />
        {novelty}
      </span>
    );
  };

  const IMAGES_COLUMNS: Column<ReadingImages>[] = [
    { header: 'CLAVE CATASTRAL', accessor: 'cadastralKey' },
    { header: 'MES', accessor: 'readingMonthName' },
    { header: 'AÑO', accessor: 'readingYear' },
    { header: 'LECT. ANTERIOR', accessor: 'previewsReading' },
    { header: 'LECT. ACTUAL', accessor: 'currentReading' },
    {
      header: 'CONSUMO',
      accessor: (r) => (
        <span className="badge-consumption">
          <Droplet size={12} style={{ marginRight: '4px' }} />
          {r.consumption || 0} m³
        </span>
      )
    },
    {
      header: 'NOVEDAD',
      accessor: (r) => getNoveltyBadge(r.novelty)
    },
    {
      header: 'IMÁGENES',
      accessor: (r) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {r.images && r.images.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedReading(r)}
            >
              <ImageIcon size={16} />
              Ver ({r.images.length})
            </Button>
          ) : (
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontStyle: 'italic',
                fontSize: '0.8125rem'
              }}
            >
              Sin evidencia
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="reading-images-page">
      <div className="reading-images-header">
        <h2 className="reading-images-header__title">
          <ImageIcon size={22} className="reading-images-header__icon" />
          {t('readings.imagesTitle', 'Registro Fotográfico de Lecturas')}
        </h2>
        <p className="reading-images-header__subtitle">
          Visualiza las evidencias fotográficas capturadas en campo de manera
          rápida y profesional.
        </p>
      </div>

      <ReadingImagesFilters isLoading={isLoading} onFetch={handleFetch} />

      {error ? (
        <div className="reading-images-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : isLoading ? (
        <div className="reading-images-loading">
          <CircularProgress
            progress={loadingProgress}
            size={90}
            strokeWidth={8}
            label={t('common.loading', 'Cargando datos...')}
          />
        </div>
      ) : (
        <div className="fade-in-section">
          <Table<ReadingImages>
            data={readingImages}
            columns={IMAGES_COLUMNS}
            isLoading={isLoading}
            pagination
            pageSize={10}
            emptyState={
              <EmptyState
                message="No se encontraron imágenes de lecturas."
                description="Intenta ajustar los filtros de búsqueda para ver los resultados."
                icon={ImageIcon}
                variant="info"
              />
            }
          />
        </div>
      )}

      {/* Extracted professional Image Viewer Component */}
      <ReadingImagesViewer
        isOpen={!!selectedReading}
        onClose={() => setSelectedReading(null)}
        readingData={selectedReading}
      />
    </div>
  );
};
