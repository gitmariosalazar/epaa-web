import React, { useEffect, useState } from 'react';
import { UpdateReadingPage, type UpdateReadingPageProps } from './UpdateReadingPage';
import { useReadingImagesList } from '../hooks/useReadingImagesList';
import { useFilePreview } from '@/shared/files/presentation/hooks/useFilePreview';
import { Loader2, ImageOff, ChevronLeft, ChevronRight, Calendar, Droplet, AlertTriangle } from 'lucide-react';
import '../styles/UpdateReadingWithImagesPage.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { ReadingInfoPopoverContent } from '../components/ReadingInfoPopoverContent';
import { FaList, FaCamera, FaEdit } from 'react-icons/fa';
import { Tabs, TabPanel } from '@/shared/presentation/components/Tabs/Tabs';
import { ReadingDetailTabContent } from '../components/ReadingDetailTabContent';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { MdCable } from 'react-icons/md';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { ChangeMeterPage } from '@/modules/connections/presentation/pages/ChangeMeterPage';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';

const extractFilename = (filePath: string): string => {
  return filePath.split('/').pop() ?? filePath;
};

const ImagePreview: React.FC<{ filename: string }> = ({ filename }) => {
  const cleanFilename = extractFilename(filename);
  const { blobUrl, loading, error } = useFilePreview('readings', cleanFilename);


  if (loading) {
    return (
      <div className="urw-loading">
        <Loader2 className="animate-spin" size={48} style={{ color: 'white' }} />
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="urw-empty-state">
        <ImageOff size={64} style={{ marginBottom: '8px' }} />
        <p>No se pudo cargar la imagen</p>
      </div>
    );
  }

  return (
    <img
      src={blobUrl}
      alt="Evidencia fotográfica"
      className="urw-image-preview"
    />
  );
};

export const UpdateReadingWithImagesPage: React.FC<UpdateReadingPageProps> = ({
  initialCadastralKey,
  onSuccess,
  onCancel,
}) => {
  const { readingImages, fetchImages, isLoading } = useReadingImagesList();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'details'>('images');

  const [isOpenDetailInfo, setIsOpenDetailInfo] = useState(false);
  const [openUpdateMeterNumberModal, setOpenUpdateMeterNumberModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenDetailInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setIsOpenDetailInfo(true);
  };
  const handleCloseDetailInfo = () => {
    setIsOpenDetailInfo(false);
  };

  const handleOpenUpdateMeterNumberModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenUpdateMeterNumberModal(true);
  };
  const handleCloseUpdateMeterNumberModal = () => {
    setOpenUpdateMeterNumberModal(false);
  };

  useEffect(() => {
    if (initialCadastralKey) {
      fetchImages({ cadastralKey: initialCadastralKey });
    }
  }, [initialCadastralKey, fetchImages]);

  // Flatten images from the API response but keep their reading data context
  const imageItems = readingImages.flatMap((ri) =>
    (ri.images || []).map((img) => ({ filename: img, data: ri }))
  );

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageItems.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < imageItems.length - 1 ? prev + 1 : 0));
  };

  const currentItem = imageItems[currentImageIndex];

  return (
    <div className="urw-split-container">
      {/* Left Pane: Images */}
      <div className="urw-images-pane" style={{ justifyContent: 'flex-start', padding: 0 }}>
        <Tabs
          tabs={[
            { id: 'images', label: 'Imágenes', icon: <FaCamera size={16} /> },
            { id: 'details', label: 'Detalles', icon: <FaList size={16} /> }
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          className="urw-tabs"
        />

        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabPanel tabId="images" activeTab={activeTab} className="urw-tab-panel">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', position: 'relative', overflowY: 'auto' }}>
              {isLoading ? (
                <div className="urw-loading">
                  <Loader2 className="animate-spin" size={48} style={{ color: 'white' }} />
                </div>
              ) : imageItems.length > 0 ? (
                <>
                  <div className="urw-image-wrapper">
                    <ImagePreview filename={currentItem.filename} />

                    {imageItems.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="urw-nav-btn urw-nav-btn-left"
                          title="Anterior"
                        >
                          <ChevronLeft size={32} />
                        </button>
                        <button
                          onClick={handleNext}
                          className="urw-nav-btn urw-nav-btn-right"
                          title="Siguiente"
                        >
                          <ChevronRight size={32} />
                        </button>
                        <div className="urw-image-counter">
                          {currentImageIndex + 1} / {imageItems.length}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="urw-image-footer">
                    <div className="urw-footer-grid">
                      {/*Botones de accnoes abrir popovers con la informacion de la lectura*/}

                      <div className="urw-footer-item">
                        <span className="urw-footer-label">Período</span>
                        <ColorChip
                          label={`${currentItem.data.readingMonthName} ${currentItem.data.readingYear}`}
                          size='xs'
                          variant='soft'
                          color='#0891b2'
                          icon={<Calendar size='1em' />}
                          borderRadius={5}
                        />
                      </div>
                      <div className="urw-footer-item">
                        <span className="urw-footer-label">Consumo</span>
                        <ColorChip
                          label={(currentItem.data.consumption || 0).toString()}
                          size='xs'
                          variant='soft'
                          color={getNoveltyColor(currentItem.data.novelty)}
                          icon={<Droplet size='1em' />}
                          borderRadius={5}
                        />
                      </div>
                      <div className="urw-footer-item">
                        <span className="urw-footer-label">Novedad</span>
                        <ColorChip
                          label={currentItem.data.novelty || 'Ninguna'}
                          size='xs'
                          variant='soft'
                          color={getNoveltyColor(currentItem.data.novelty)}
                          icon={<AlertTriangle size='1em' />}
                          borderRadius={5}
                        />
                      </div>
                      <div className="urw-footer-item">
                        <span className="urw-footer-label">Clave catastral</span>
                        <ColorChip
                          label={currentItem.data.cadastralKey}
                          size='xs'
                          variant='soft'
                          color='#0868B2'
                          icon={<MdCable size='1em' />}
                          borderRadius={5}
                        />
                      </div>
                    </div>
                    <div className='urw-footer-actions-left'>
                      <Tooltip
                        content={'Ver información de la lectura'}
                        followCursor={false}
                      >
                        <Button
                          onClick={handleOpenDetailInfo}
                          variant='outline'
                          circle
                          size='sm'
                        >
                          <FaList size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                    <div className='urw-footer-actions-right'>
                      <Tooltip
                        content={'Actualizar Número de medidor'}
                        followCursor={false}
                      >
                        <Button
                          onClick={handleOpenUpdateMeterNumberModal}
                          variant='outline'
                          circle
                          color='orange'
                          size='sm'
                        >
                          <FaEdit size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState
                  description={isLoading ? 'Cargando...' : `No hay imágenes disponibles para la lectura con clave catastral ${initialCadastralKey}`}
                  message="Sin imágenes"
                  icon={<BsPatchQuestionFill size={48} style={{ marginBottom: '8px' }} />}
                />
              )}
            </div>
          </TabPanel>

          <TabPanel tabId="details" activeTab={activeTab} className="urw-tab-panel">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflowY: 'auto' }}>
              <ReadingDetailTabContent
                cadastralKey={initialCadastralKey || ''}
                yearAndMonth={
                  (currentItem?.data || readingImages[0])
                    ? String((currentItem?.data || readingImages[0]).readingMonth).includes('-')
                      ? String((currentItem?.data || readingImages[0]).readingMonth)
                      : `${(currentItem?.data || readingImages[0]).readingYear}-${String((currentItem?.data || readingImages[0]).readingMonth).padStart(2, '0')}`
                    : dateService.getCurrentMonthString()
                }
              />
            </div>
          </TabPanel>
        </div>
      </div>



      {/* Right Pane: Edit Form */}
      <div className="urw-form-pane">
        <UpdateReadingPage
          initialCadastralKey={initialCadastralKey}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>

      <PopoverModal
        isOpen={isOpenDetailInfo}
        onClose={handleCloseDetailInfo}
        anchorElement={anchorEl}
        title="Información de la lectura"
      >
        {currentItem?.data && (
          <ReadingInfoPopoverContent
            cadastralKey={currentItem.data.cadastralKey}
            yearAndMonth={String(currentItem.data.readingMonth).includes('-')
              ? currentItem.data.readingMonth
              : `${currentItem.data.readingYear}-${String(currentItem.data.readingMonth).padStart(2, '0')}`}
          />
        )}
      </PopoverModal>

      <PopoverModal
        isOpen={openUpdateMeterNumberModal}
        onClose={handleCloseUpdateMeterNumberModal}
        anchorElement={anchorEl}
        title="Actualizar número de medidor"
      >
        <ConnectionProvider>
          <ChangeMeterPage
            cadastralKeyProp={initialCadastralKey}
            onSuccess={handleCloseUpdateMeterNumberModal}
            onCancel={handleCloseUpdateMeterNumberModal}
          />
        </ConnectionProvider>
      </PopoverModal>

    </div>
  );
};
