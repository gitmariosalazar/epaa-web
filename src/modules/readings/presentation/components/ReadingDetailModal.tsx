import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { useReadingDetailViewModel } from '../hooks/useReadingDetailViewModel';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaUser, FaCamera, FaClipboardList, FaTint, FaInfoCircle, FaList, FaEdit } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import './ReadingDetailModal.css';
import { Label } from '@/shared/presentation/components/label/Label';
import {
  User,
  IdCard,
  MapPin,
  Map,
  Gauge,
  Coins,
  CalendarDays,
  CalendarClock,
  History,
  ClipboardCheck,
  Droplets,
  AlertTriangle,
  Clock,
  Calendar,
  Droplet
} from 'lucide-react';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { TbCurrencyDollarCanadian } from 'react-icons/tb';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EvidenceFiles } from '@/shared/files/presentation/components/EvidenceFiles/EvidenceFile';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { UserReadingActionPopoverModal } from './UserReadingActionPopoverModal';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ChangeMeterPage } from '@/modules/connections/presentation/pages/ChangeMeterPage';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { MdCable } from 'react-icons/md';

interface ReadingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cadastralKey: string | null;
  yearAndMonth: string | null;
}

export const ReadingDetailModal: React.FC<ReadingDetailModalProps> = ({
  isOpen,
  onClose,
  cadastralKey,
  yearAndMonth
}) => {
  const { t } = useTranslation();
  const { readingDetail, isLoading, error, refetch } = useReadingDetailViewModel(cadastralKey, yearAndMonth);
  const loadingProgress = useSimulatedProgress(isLoading);

  const [openUpdateMeterNumberModal, setOpenUpdateMeterNumberModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenUpdateMeterNumberModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenUpdateMeterNumberModal(true);
  };
  const handleCloseUpdateMeterNumberModal = () => {
    setOpenUpdateMeterNumberModal(false);
  };
  const handleSuccessUpdateMeterNumberModal = () => {
    setOpenUpdateMeterNumberModal(false);
    refetch();
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('readings.details.title', 'Detalle de Lectura')}
      size="xl"
      icon={<FaInfoCircle size={20} color="var(--info)" />}
    >
      <div className="reading-detail-modal-content">
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <CircularProgress
              progress={loadingProgress}
              size={64}
              strokeWidth={6}
              label={t('common.loading', 'Cargando datos...')}
            />
          </div>
        )}

        {error && !isLoading && (
          <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '20px' }}>
            {error}
          </div>
        )}

        {!isLoading && !error && readingDetail && (
          <>
            {/* Información del Cliente */}
            <div className="reading-detail-section">
              <h4>
                <FaUser /> {t('readings.details.clientInfo', 'Información del Cliente')}
              </h4>
              <div className="reading-detail-grid">
                <div className="reading-detail-item">
                  <Label
                    text="Nombre"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<User size="1em" />}
                  />

                  <span className="reading-detail-value">{readingDetail.clientName}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Cédula / RUC"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<IdCard size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.cardId}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Clave Catastral"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<MapPin size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.cadastralKey}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Dirección"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Map size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.address || '-'}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Medidor"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Gauge size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.meterNumber || '-'}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Tarifa"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Coins size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.rateName}</span>
                </div>
              </div>
            </div>

            {/* Detalles de la Lectura */}
            <div className="reading-detail-section">
              <div className="view-user-actions">
                <UserReadingActionPopoverModal
                  userActions={readingDetail.userActions}
                  trigger={
                    <div style={{ display: 'inline-block' }}>
                      <Tooltip followCursor={false} themeColor="info" content="Ver Cambios en la Lectura">
                        <Button
                          size="sm"
                          variant="ghost"
                          circle
                        >
                          <FaList size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  }
                />
              </div>
              <h4>
                <FaTint /> {t('readings.details.readingInfo', 'Datos de la Lectura')}
              </h4>
              <div className="reading-detail-grid">
                <div className="reading-detail-item">
                  <Label
                    text="Mes de Lectura"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<CalendarDays size="1em" />}
                  />
                  <span className="reading-detail-value">
                    <ColorChip label={`${readingDetail.readingMonth} (${readingDetail.readingMonthName})`} size="xs" variant="soft" color="info" />
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Fecha de Lectura"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<CalendarClock size="1em" />}
                  />
                  <span className="reading-detail-value">
                    {readingDetail.readingDate
                      ? dateService.formatToLocaleString(new Date(readingDetail.readingDate))
                      : '-'}
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Hora de Lectura"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Clock size="1em" />}
                  />
                  <span className="reading-detail-value">
                    {readingDetail.readingTime
                      ? readingDetail.readingTime
                      : '-'}
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Lectura Anterior"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<History size="1em" />}
                  />
                  <span className="reading-detail-value">{NumberFormatter.format(readingDetail.previousReading, 2)}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Lectura Actual"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<ClipboardCheck size="1em" />}
                  />
                  <span className="reading-detail-value">
                    {readingDetail.currentReading !== null
                      ? NumberFormatter.format(readingDetail.currentReading, 2)
                      : '-'}
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Consumo"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Droplets size="1em" />}
                  />
                  <span className="reading-detail-value" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                    {NumberFormatter.format(readingDetail.consumption, 2)} m³
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Novedad"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<AlertTriangle size="1em" />}
                  />
                  <span className="reading-detail-value">
                    <ColorChip label={readingDetail.novelty || 'SIN NOVEDAD'} size="xs" variant="soft" color={getNoveltyColor(readingDetail.novelty)} />
                  </span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Valor Consumo"
                    size="small"
                    variant="default"
                    weight="semibold"
                    leftIcon={<TbCurrencyDollarCanadian size="1em" />}
                  />
                  <span className="reading-detail-value">
                    {CurrencyFormatter.format(readingDetail.readingValue || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fotografías */}
            <div className="reading-detail-section">
              <h4>
                <FaCamera /> {t('readings.details.photos', 'Fotografías de la Lectura')}
              </h4>
              {readingDetail.images && readingDetail.images.length > 0 ? (
                <div className="reading-detail-images">
                  {readingDetail.images.map((img) => (
                    <EvidenceFiles
                      key={img.id}
                      fileId={img.id}
                      filePath={img.path}
                      category="readings"
                      type={img.novelty}
                    />
                  ))}
                </div>
              ) : (
                <span className="reading-detail-empty">No se registraron fotografías para esta lectura.</span>
              )}
            </div>

            {/* Observaciones */}
            <div className="reading-detail-section">
              <h4>
                <FaClipboardList /> {t('readings.details.observations', 'Observaciones / Notas')}
              </h4>
              {readingDetail.observations && readingDetail.observations.length > 0 ? (
                <div className="reading-detail-observations">
                  {readingDetail.observations.map((obs) => (
                    <div key={obs.id} className="reading-detail-obs-card">
                      <h5>{obs.title}</h5>
                      <p>{obs.observation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="reading-detail-empty">No hay observaciones adicionales.</span>
              )}
            </div>

            <div className="urw-detail-footer">
              <div className="urw-footer-grid">
                {/*Botones de accnoes abrir popovers con la informacion de la lectura*/}

                <div className="urw-footer-item">
                  <span className="urw-footer-label">Período</span>
                  <ColorChip
                    label={`${readingDetail?.readingMonthName || ''}`}
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
                    label={(readingDetail?.currentReading! - readingDetail?.previousReading || 0).toString() + ' m³'}
                    size='xs'
                    variant='soft'
                    color={getNoveltyColor(readingDetail?.novelty || '')}
                    icon={<Droplet size='1em' />}
                    borderRadius={5}
                  />
                </div>
                <div className="urw-footer-item">
                  <span className="urw-footer-label">Novedad</span>
                  <ColorChip
                    label={truncateText(readingDetail?.novelty!, 10) || 'Ninguna'}
                    size='xs'
                    variant='soft'
                    color={getNoveltyColor(readingDetail?.novelty)}
                    icon={<AlertTriangle size='1em' />}
                    borderRadius={5}
                  />
                </div>
                <div className="urw-footer-item">
                  <span className="urw-footer-label">C. catastral</span>
                  <ColorChip
                    label={truncateText(cadastralKey || '', 10)}
                    size='xs'
                    variant='soft'
                    color='#0868B2'
                    icon={<MdCable size='1em' />}
                    borderRadius={5}
                  />
                </div>
              </div>
              <div className='urw-detail-footer-actions-right'>
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
        )}

        <PopoverModal
          isOpen={openUpdateMeterNumberModal}
          onClose={handleCloseUpdateMeterNumberModal}
          anchorElement={anchorEl}
          title="Actualizar número de medidor"
        >
          <ConnectionProvider>
            <ChangeMeterPage
              cadastralKeyProp={cadastralKey!}
              onSuccess={handleSuccessUpdateMeterNumberModal}
              onCancel={handleCloseUpdateMeterNumberModal}
            />
          </ConnectionProvider>
        </PopoverModal>
      </div>
    </Modal>
  );
};
