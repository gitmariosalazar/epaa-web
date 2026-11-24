import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { EvidenceFiles } from '@/shared/files';
import { PhotoLightbox } from '@/modules/incidents/presentation/components/PhotoLightbox';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { MdPhotoLibrary } from 'react-icons/md';
import { IoMdPhotos } from 'react-icons/io';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { PhotoResponse } from '../../domain/models/Connection';
import { useConnectionPhotos } from '../hooks/useConnectionPhotos';
import './ConnectionPhotosPopoverModal.css';

export interface ConnectionPhotosPopoverModalProps {
  /**
   * Clave catastral de la acometida para consultar fotos anteriores.
   */
  cadastralKey?: string | null;
  /**
   * Identificador alternativo de la acometida.
   */
  connectionId?: string | null;
  /**
   * Fotos de fachada precargadas (opcional para evitar refetch).
   */
  photosFacade?: PhotoResponse[] | null;
  /**
   * Fotos de medidor precargadas (opcional para evitar refetch).
   */
  photosMeter?: PhotoResponse[] | null;
  /**
   * Disparador personalizado para abrir el PopoverModal.
   * Si no se proporciona, se renderiza un botón predeterminado con tooltip.
   */
  trigger?: React.ReactElement<any>;
  /**
   * Modo controlado: si el modal está abierto.
   */
  isOpen?: boolean;
  /**
   * Modo controlado: callback para cerrar el modal.
   */
  onClose?: () => void;
  /**
   * Modo controlado: elemento de anclaje para posicionar el popover.
   */
  anchorElement?: HTMLElement | null;
  /**
   * Tamaño del modal popover (default: 'xl').
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
  /**
   * Título personalizado para el encabezado del popover.
   */
  title?: string;
  /**
   * Descripción del encabezado del popover.
   */
  description?: string;
}

interface ConnectionPhotosContentProps {
  cadastralKey?: string | null;
  connectionId?: string | null;
  initialPhotosFacade?: PhotoResponse[] | null;
  initialPhotosMeter?: PhotoResponse[] | null;
  onClose: () => void;
}

/**
 * Inner content component mounted when the popover is opened.
 * Separated to ensure lazy data-fetching and isolation of lightbox states (SRP).
 */
const ConnectionPhotosContent: React.FC<ConnectionPhotosContentProps> = ({
  cadastralKey,
  connectionId,
  initialPhotosFacade,
  initialPhotosMeter
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'facade' | 'meter'>('all');

  const {
    photosFacade,
    photosMeter,
    totalPhotos,
    loading,
    error,
    refetch,
    lightboxFacadeIndex,
    setLightboxFacadeIndex,
    lightboxMeterIndex,
    setLightboxMeterIndex
  } = useConnectionPhotos({
    cadastralKey,
    connectionId,
    initialPhotosFacade,
    initialPhotosMeter,
    autoFetch: true
  });

  const loadingProgress = useSimulatedProgress(loading);

  return (
    <div className="connection-photos-popover">
      {/* Tabs Filter */}
      <div className="connection-photos-tabs">
        <button
          type="button"
          className={`connection-photos-tab ${activeTab === 'all' ? 'connection-photos-tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>{t('connections.photosPopover.tabAll', 'Todas')}</span>
          <span className="connection-photos-tab-badge">{totalPhotos}</span>
        </button>
        <button
          type="button"
          className={`connection-photos-tab ${activeTab === 'facade' ? 'connection-photos-tab--active' : ''}`}
          onClick={() => setActiveTab('facade')}
        >
          <MdPhotoLibrary size={15} />
          <span>{t('connections.photosPopover.tabFacade', 'Fachada')}</span>
          <span className="connection-photos-tab-badge">
            {photosFacade.length}
          </span>
        </button>
        <button
          type="button"
          className={`connection-photos-tab ${activeTab === 'meter' ? 'connection-photos-tab--active' : ''}`}
          onClick={() => setActiveTab('meter')}
        >
          <IoMdPhotos size={15} />
          <span>{t('connections.photosPopover.tabMeter', 'Medidor')}</span>
          <span className="connection-photos-tab-badge">
            {photosMeter.length}
          </span>
        </button>
      </div>

      <div className="connection-photos-body custom-scrollbar">
        {loading ? (
          <div className="connection-photos-loading">
            <CircularProgress
              progress={loadingProgress}
              size={64}
              strokeWidth={5}
              label={t('common.loading', 'Cargando fotos...')}
            />
          </div>
        ) : error ? (
          <div className="connection-photos-error">
            <AlertTriangle size={36} />
            <p>{error}</p>
            <Button
              size="xs"
              variant="outline"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => refetch()}
            >
              {t('common.retry', 'Reintentar')}
            </Button>
          </div>
        ) : totalPhotos === 0 ? (
          <div className="connection-photos-empty">
            <EmptyState
              message={t(
                'connections.photosPopover.noPhotosTitle',
                'Sin evidencias fotográficas'
              )}
              description={t(
                'connections.photosPopover.noPhotosDesc',
                'No se han registrado evidencias fotográficas para esta acometida.'
              )}
              icon={<MdPhotoLibrary size={38} className="icon-error-color" />}
              variant="warning"
            />
          </div>
        ) : (
          <>
            {/* Facade Photos Section */}
            {(activeTab === 'all' || activeTab === 'facade') && (
              <div className="connection-photos-section">
                <div className="connection-photos-section-title">
                  <div className="connection-photos-icon-wrap">
                    <MdPhotoLibrary size={16} />
                  </div>
                  <span>
                    {t(
                      'connections.detail.photosFacade',
                      'Evidencias – Fotos de Fachada'
                    )}
                  </span>
                  <span className="connection-photos-count-badge">
                    {photosFacade.length}
                  </span>
                </div>
                {photosFacade.length > 0 ? (
                  <div className="connection-photos-gallery">
                    {photosFacade.map((photo, idx) => (
                      <EvidenceFiles
                        key={photo.id}
                        fileId={photo.id}
                        filePath={photo.imagePath}
                        type={photo.photoType}
                        category="connection_documents"
                        onClick={() => setLightboxFacadeIndex(idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="connection-photos-empty">
                    <EmptyState
                      message={t(
                        'connections.detail.noFacadeEvidence',
                        'Sin evidencia de fachada'
                      )}
                      description={t(
                        'connections.detail.noEvidenceAdded',
                        'No se ha agregado evidencia.'
                      )}
                      icon={
                        <MdPhotoLibrary
                          size={30}
                          className="icon-error-color"
                        />
                      }
                      variant="warning"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Meter Photos Section */}
            {(activeTab === 'all' || activeTab === 'meter') && (
              <div className="connection-photos-section">
                <div className="connection-photos-section-title">
                  <div className="connection-photos-icon-wrap">
                    <IoMdPhotos size={16} />
                  </div>
                  <span>
                    {t(
                      'connections.detail.photosMeter',
                      'Evidencias – Fotos de Medidor'
                    )}
                  </span>
                  <span className="connection-photos-count-badge">
                    {photosMeter.length}
                  </span>
                </div>
                {photosMeter.length > 0 ? (
                  <div className="connection-photos-gallery">
                    {photosMeter.map((photo, idx) => (
                      <EvidenceFiles
                        key={photo.id}
                        fileId={photo.id}
                        filePath={photo.imagePath}
                        type={photo.photoType}
                        category="connection_documents"
                        onClick={() => setLightboxMeterIndex(idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="connection-photos-empty">
                    <EmptyState
                      message={t(
                        'connections.detail.noMeterEvidence',
                        'Sin evidencia de medidor'
                      )}
                      description={t(
                        'connections.detail.noEvidenceAdded',
                        'No se ha agregado evidencia.'
                      )}
                      icon={
                        <IoMdPhotos size={30} className="icon-error-color" />
                      }
                      variant="warning"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox for Facade Photos */}
      {lightboxFacadeIndex !== null && photosFacade.length > 0 && (
        <PhotoLightbox
          photos={photosFacade.map((p) => ({
            photoId: p.id,
            filePath: p.imagePath,
            type: p.photoType
          }))}
          activeIndex={lightboxFacadeIndex}
          category="connection_documents"
          onClose={() => setLightboxFacadeIndex(null)}
          onIndexChange={setLightboxFacadeIndex}
        />
      )}

      {/* Lightbox for Meter Photos */}
      {lightboxMeterIndex !== null && photosMeter.length > 0 && (
        <PhotoLightbox
          photos={photosMeter.map((p) => ({
            photoId: p.id,
            filePath: p.imagePath,
            type: p.photoType
          }))}
          activeIndex={lightboxMeterIndex}
          category="connection_documents"
          onClose={() => setLightboxMeterIndex(null)}
          onIndexChange={setLightboxMeterIndex}
        />
      )}
    </div>
  );
};

/**
 * ConnectionPhotosPopoverModal
 *
 * Popover modal adhering to Clean Architecture & SOLID:
 * - Single Responsibility Principle (SRP): Focuses exclusively on displaying
 *   the photographic evidence (fachada & medidor) of a connection in a Popover modal.
 * - Open/Closed Principle (OCP): Supports custom trigger or controlled state,
 *   optional preloaded photos, configurable sizing, and labels.
 * - Liskov Substitution Principle (LSP): Fully compatible with PopoverModal / Modal contracts.
 * - Interface Segregation Principle (ISP): Clean, optional parameters in ConnectionPhotosPopoverModalProps.
 * - Dependency Inversion Principle (DIP): Uses useConnectionPhotos hook for domain and use-case integration.
 */
export const ConnectionPhotosPopoverModal: React.FC<
  ConnectionPhotosPopoverModalProps
> = ({
  cadastralKey,
  connectionId,
  photosFacade: initialPhotosFacade,
  photosMeter: initialPhotosMeter,
  trigger,
  isOpen,
  onClose,
  anchorElement,
  size = 'xl',
  title,
  description
}) => {
  const { t } = useTranslation();

  const resolvedKey = cadastralKey || connectionId || '';
  const modalTitle =
    title ||
    `${t('connections.photosPopover.title', 'Evidencias Fotográficas')}${
      resolvedKey ? `: ${resolvedKey}` : ''
    }`;

  const defaultTrigger = (
    <Tooltip
      content={t(
        'connections.wizard.basicUpdate.viewPreviousPhotos',
        'Ver fotos anteriores'
      )}
      position="top"
    >
      <Button
        type="button"
        size="sm"
        variant="ghost"
        circle
        style={{ color: 'var(--success)' }}
        aria-label={t(
          'connections.wizard.basicUpdate.viewPreviousPhotos',
          'Ver fotos anteriores'
        )}
      >
        <MdPhotoLibrary size={16} />
      </Button>
    </Tooltip>
  );

  return (
    <PopoverModal
      trigger={trigger || defaultTrigger}
      isOpen={isOpen}
      onClose={onClose}
      anchorElement={anchorElement}
      size={size}
      icon={<MdPhotoLibrary size={18} />}
      headerColor="indigo"
      title={modalTitle}
      description={
        description ||
        t(
          'connections.photosPopover.description',
          'Fotografías registradas de fachada y medidor para esta acometida.'
        )
      }
    >
      {({ close }) => (
        <ConnectionPhotosContent
          cadastralKey={cadastralKey}
          connectionId={connectionId}
          initialPhotosFacade={initialPhotosFacade}
          initialPhotosMeter={initialPhotosMeter}
          onClose={close}
        />
      )}
    </PopoverModal>
  );
};
