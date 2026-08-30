import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReadingDetailViewModel } from '../hooks/useReadingDetailViewModel';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaTint, FaClipboardList } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import { Label } from '@/shared/presentation/components/label/Label';
import {
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
import './ReadingDetailModal.css'; // Reuse the existing styles
import { MdCable } from 'react-icons/md';

interface ReadingInfoPopoverContentProps {
  cadastralKey: string | null;
  yearAndMonth: string | null;
}

export const ReadingInfoPopoverContent: React.FC<ReadingInfoPopoverContentProps> = ({
  cadastralKey,
  yearAndMonth
}) => {
  const { t } = useTranslation();
  const { readingDetail, isLoading, error } = useReadingDetailViewModel(cadastralKey, yearAndMonth);
  const loadingProgress = useSimulatedProgress(isLoading);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', minWidth: '400px' }}>
        <CircularProgress
          progress={loadingProgress}
          size={48}
          strokeWidth={4}
          label={t('common.loading', 'Cargando datos...')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--danger-color)', textAlign: 'center', padding: '20px', minWidth: '400px' }}>
        {error}
      </div>
    );
  }

  if (!readingDetail) {
    return null;
  }

  return (
    <div className="reading-detail-modal-content" style={{ padding: 0, minWidth: '450px', maxWidth: '600px' }}>
      {/* Detalles de la Lectura */}
      <div className="reading-detail-section">
        <h4>
          <FaTint /> {t('readings.details.readingInfo', 'Datos de la Lectura')}
          <ColorChip label={readingDetail.cadastralKey} size='xs' variant='soft' color='#2664c7ff' icon={<MdCable size='1em' />} />
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
    </div>
  );
};
