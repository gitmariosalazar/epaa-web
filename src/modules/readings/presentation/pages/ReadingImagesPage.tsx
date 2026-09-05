import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageIcon, AlertCircle, Droplet, MapPin, FileText } from 'lucide-react';

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
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { FaEdit } from 'react-icons/fa';

import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { CreateReadingPage } from './CreateReadingPage';
import { UpdateReadingWithImagesPage } from './UpdateReadingWithImagesPage';
import { ReadingDetailModal } from '../components/ReadingDetailModal';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ConnectionDetailModal } from '@/modules/connections/presentation/components/ConnectionDetailModal';

export const ReadingImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { readingImages, isLoading, error, fetchImages } =
    useReadingImagesList();
  const loadingProgress = useSimulatedProgress(isLoading);

  // State for the image viewer
  const [selectedReading, setSelectedReading] = useState<ReadingImages | null>(
    null
  );

  const [detailCadastralKey, setDetailCadastralKey] = useState<string | null>(null);



  const [readingModalState, setReadingModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'update';
    cadastralKey: string;
  } | null>(null);

  // Detail Modal State for Readings
  const [detailModalState, setDetailModalState] = useState<{ isOpen: boolean; cadastralKey: string | null; yearAndMonth: string | null }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null,
  });

  const handleViewDetails = (cadastralKey: string, yearAndMonth: string) => {
    setDetailModalState({ isOpen: true, cadastralKey, yearAndMonth });
  };

  const handleAction = (mode: 'create' | 'update', cadastralKey: string) => {
    setReadingModalState({ isOpen: true, mode, cadastralKey });
  };

  const [currentFilters, setCurrentFilters] = useState<{
    monthIso?: string;
    sector?: string;
    cadastralKey?: string;
    novelty?: string;
  }>({});

  const handleFetch = (filters: {
    monthIso?: string;
    sector?: string;
    cadastralKey?: string;
    novelty?: string;
  }) => {
    setCurrentFilters(filters);
    fetchImages({
      month: filters.monthIso,
      sector: filters.sector,
      cadastralKey: filters.cadastralKey,
      novelty: filters.novelty
    });
  };

  const handleModalSuccess = () => {
    setReadingModalState(null);
    fetchImages({
      month: currentFilters.monthIso,
      sector: currentFilters.sector,
      cadastralKey: currentFilters.cadastralKey,
      novelty: currentFilters.novelty
    });
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
      accessor: (r) => {
        const color: string = getNoveltyColor(r.novelty);
        return (
          <ColorChip label={r.novelty} color={color} size="xs" variant="soft" />
        );
      }
    },
    {
      header: 'IMÁGENES',
      accessor: (r) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {r.images && r.images.length > 0 ? (
            <Button
              variant="dashed"
              size="xs"
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
    },
    {
      header: t('common.actions', 'Acciones'),
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip followCursor={false} themeColor="warning" content={t('common.edit', 'Editar')}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAction('update', row.cadastralKey)}
              color="warning"
              circle
            >
              <FaEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip followCursor={false}
            themeColor="cyan"
            content={
              <>
                <div> Ver Detalles de la Acometida </div>
                <div> Acometida ID: {row.cadastralKey} </div>
              </>
            }
          >
            <Button color="cyan" size="sm" variant="ghost" onClick={() => setDetailCadastralKey(row.cadastralKey)} circle>
              <MapPin size={16} />
            </Button>
          </Tooltip>

          <Tooltip followCursor={false}
            themeColor="info"
            content={
              <>
                <div> Ver Detalles de la Lectura </div>
                <div> Lectura ID: {row.readingId} </div>
              </>
            }
          >
            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(row.cadastralKey, row.readingMonth)} circle>
              <FileText size={16} />
            </Button>
          </Tooltip>

        </div>
      ),
      id: 'actions'
    }
  ];

  return (
    <div className="reading-images-page">
      <div className="reading-images-header">
        <h2 className="reading-images-header__title">
          <ImageIcon size={22} className="reading-images-header__icon" />
          {t('readings.imagesTitle', 'Registro Fotográfico de Lecturas')}
        </h2>
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
            pageSize={15}
            getRowColor={(row) => {
              if (row.updatedStatus === false) {
                return 'error';
              }
              return 'success';
            }}
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

      {/* Connection Detail Modal */}
      <ConnectionProvider>
        <ConnectionDetailModal
          isOpen={detailCadastralKey !== null}
          onClose={() => setDetailCadastralKey(null)}
          cadastralKey={detailCadastralKey}
        />
      </ConnectionProvider>

      {/* Reading Detail Modal (No extra provider needed as page is already under ReadingsProvider) */}
      <ReadingDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
        cadastralKey={detailModalState.cadastralKey}
        yearAndMonth={detailModalState.yearAndMonth}
      />

      {/* Modal de Creación/Edición de Lectura */}
      <Modal
        isOpen={!!readingModalState?.isOpen}
        onClose={() => setReadingModalState(null)}
        title={
          readingModalState?.mode === 'create'
            ? 'Nueva Lectura'
            : 'Editar Lectura'
        }
        size="full"
      >
        <div style={{ padding: '0px 10px', height: '100%' }}>
          {readingModalState?.mode === 'create' && (
            <CreateReadingPage
              initialCadastralKey={readingModalState?.cadastralKey}
              onSuccess={handleModalSuccess}
              onCancel={() => setReadingModalState(null)}
            />
          )}
          {readingModalState?.mode === 'update' && (
            <UpdateReadingWithImagesPage
              initialCadastralKey={readingModalState?.cadastralKey}
              onSuccess={handleModalSuccess}
              onCancel={() => setReadingModalState(null)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
