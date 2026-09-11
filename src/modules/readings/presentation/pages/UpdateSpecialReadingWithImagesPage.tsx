import React, { useEffect, useState } from 'react';
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
import { UpdateSpecialReadingPage, type UpdateReadingPageProps } from './UpdateSpecialReadingPage';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ChangeMeterPage } from '@/modules/connections/presentation/pages/ChangeMeterPage';
import { useReading } from '../hooks/useReading';
import type { ReadingDetailed } from '../../domain/models/ReadingInfoResponse';
import { truncateText } from '@/shared/utils/text/truncate-text';

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
      <EmptyState
        message="No se pudo cargar la imagen"
        description="Por favor, recargue la página e intente nuevamente"
        icon={<ImageOff size={64} style={{ marginBottom: '8px' }} />}
      />
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

export const UpdateSpecialReadingWithImagesPage: React.FC<UpdateReadingPageProps> = ({
  initialCadastralKey,
  initialMonth,
  onSuccess,
  onCancel,
}) => {
  const { readingImages, fetchImages, isLoading } = useReadingImagesList();
  const { readingDetailed, fetchReadingData } = useReading()
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'details'>('images');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  const handleSuccessUpdateMeterNumberModal = () => {
    setOpenUpdateMeterNumberModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (initialCadastralKey) {
      fetchImages({ cadastralKey: initialCadastralKey });
      fetchReadingData(initialCadastralKey, initialMonth);
    }
  }, [initialCadastralKey, initialMonth, fetchImages, refreshTrigger]);

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
  const displayData: ReadingDetailed = readingDetailed!;

  console.log("currentItem", readingDetailed);

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
                  <Loader2 className="animate-spin" size={56} style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }} />
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
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
                  <EmptyState
                    description={isLoading ? 'Cargando...' : `No hay imágenes disponibles para la lectura con clave catastral ${initialCadastralKey}`}
                    message="Sin imágenes"
                    icon={<BsPatchQuestionFill size={56} style={{ marginBottom: '12px', color: '#818cf8', filter: 'drop-shadow(0 0 10px rgba(129,140,248,0.4))' }} />}
                  />
                </div>
              )}
              <div className="urw-image-footer">
                <div className="urw-footer-grid">
                  {/*Botones de accnoes abrir popovers con la informacion de la lectura*/}

                  <div className="urw-footer-item">
                    <span className="urw-footer-label">Período</span>
                    <ColorChip
                      label={`${displayData?.readingMonthName || ''}`}
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
                      label={(displayData?.currentReading! - displayData?.previousReading || 0).toString() + ' m³'}
                      size='xs'
                      variant='soft'
                      color={getNoveltyColor(displayData?.novelty || '')}
                      icon={<Droplet size='1em' />}
                      borderRadius={5}
                    />
                  </div>
                  <div className="urw-footer-item">
                    <span className="urw-footer-label">Novedad</span>
                    <ColorChip
                      label={truncateText(displayData?.novelty!, 10) || 'Ninguna'}
                      size='xs'
                      variant='soft'
                      color={getNoveltyColor(displayData?.novelty)}
                      icon={<AlertTriangle size='1em' />}
                      borderRadius={5}
                    />
                  </div>
                  <div className="urw-footer-item">
                    <span className="urw-footer-label">C. catastral</span>
                    <ColorChip
                      label={displayData?.cadastralKey || initialCadastralKey}
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
            </div>
          </TabPanel>

          <TabPanel tabId="details" activeTab={activeTab} className="urw-tab-panel">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflowY: 'auto' }}>
              <ReadingDetailTabContent
                cadastralKey={initialCadastralKey || ''}
                yearAndMonth={
                  displayData
                    ? String(displayData.readingMonth).includes('-')
                      ? String(displayData.readingMonth)
                      : `${displayData.readingMonth.split('-')[0]}-${String(displayData.readingMonth).padStart(2, '0')}`
                    : (initialMonth || dateService.getCurrentMonthString())
                }
              />
            </div>
          </TabPanel>
        </div>
      </div>



      {/* Right Pane: Edit Form */}
      <div className="urw-form-pane">
        <UpdateSpecialReadingPage
          initialCadastralKey={initialCadastralKey}
          initialMonth={initialMonth}
          onSuccess={onSuccess}
          onCancel={onCancel}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <PopoverModal
        isOpen={isOpenDetailInfo}
        onClose={handleCloseDetailInfo}
        anchorElement={anchorEl}
        title="Información de la lectura"
      >
        <ReadingInfoPopoverContent
          cadastralKey={displayData?.cadastralKey || initialCadastralKey || ''}
          yearAndMonth={
            displayData
              ? String(displayData.readingMonth).includes('-')
                ? String(displayData.readingMonth)
                : `${displayData.readingMonth.split('-')[0]}-${String(displayData.readingMonth).padStart(2, '0')}`
              : (initialMonth || dateService.getCurrentMonthString())
          }
        />
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
            onSuccess={handleSuccessUpdateMeterNumberModal}
            onCancel={handleCloseUpdateMeterNumberModal}
          />
        </ConnectionProvider>
      </PopoverModal>

    </div>
  );
};
