import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { useReadingDetailViewModel } from '../hooks/useReadingDetailViewModel';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaUser, FaCamera, FaClipboardList, FaTint, FaInfoCircle } from 'react-icons/fa';
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
  Clock
} from 'lucide-react';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { TbCurrencyDollarCanadian } from 'react-icons/tb';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EvidenceFiles } from '@/shared/files/presentation/components/EvidenceFiles/EvidenceFile';

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
  const { readingDetail, isLoading, error } = useReadingDetailViewModel(cadastralKey, yearAndMonth);
  const loadingProgress = useSimulatedProgress(isLoading);


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
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<User size="1em" />}
                  />

                  <span className="reading-detail-value">{readingDetail.clientName}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Cédula / RUC"
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<IdCard size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.cardId}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Clave Catastral"
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<MapPin size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.cadastralKey}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Dirección"
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Map size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.address || '-'}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Medidor"
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<Gauge size="1em" />}
                  />
                  <span className="reading-detail-value">{readingDetail.meterNumber || '-'}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Tarifa"
                    size="compact"
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
              <h4>
                <FaTint /> {t('readings.details.readingInfo', 'Datos de la Lectura')}
              </h4>
              <div className="reading-detail-grid">
                <div className="reading-detail-item">
                  <Label
                    text="Mes de Lectura"
                    size="compact"
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
                    size="compact"
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
                    size="compact"
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
                    size="compact"
                    variant="default"
                    weight="semibold"
                    leftIcon={<History size="1em" />}
                  />
                  <span className="reading-detail-value">{NumberFormatter.format(readingDetail.previousReading, 2)}</span>
                </div>
                <div className="reading-detail-item">
                  <Label
                    text="Lectura Actual"
                    size="compact"
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
                    size="compact"
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
                    size="compact"
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
                    size="compact"
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
          </>
        )}
      </div>
    </Modal>
  );
};
