import React from 'react';
import '../styles/create-reading.css';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { calculateConsumptionVisuals } from '../utils/consumptionVisuals';
import { Card } from '@/shared/presentation/components/Card/Card';
import { FaPlug, FaTint, FaHistory } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';

interface PropTypes {
  info: ReadingInfo | null;
  currentReadingInput?: number | '';
}

export const ReadingSummaryCards: React.FC<PropTypes> = ({
  info,
  currentReadingInput
}) => {
  const { t } = useTranslation();

  const currentVal =
    currentReadingInput !== undefined && currentReadingInput !== ''
      ? Number(currentReadingInput)
      : null;

  const previousVal =
    Number(
      info?.currentReading !== null
        ? info?.currentReading
        : info?.previousReading
    ) || 0;

  const currentConsumption =
    currentVal !== null ? currentVal - previousVal : null;

  const averageConsumption = info?.averageConsumption
    ? Number(info.averageConsumption)
    : null;

  // Reutiliza el helper compartido — mismos colores que el modal de confirmación
  const visuals = calculateConsumptionVisuals(
    currentConsumption,
    averageConsumption
  );

  return (
    <div className="cr-summary-cards">
      <Card className="cr-card cr-card-connection">
        <div className="cr-card-header">
          <span>{t('readings.summaryCards.connectionId')}</span>
          <FaPlug className="cr-icon-green" size={20} />
        </div>
        <div className="cr-card-body">
          <div className="cr-card-value">{info?.cadastralKey || '---'}</div>
        </div>
        <div className="cr-card-footer">
          <div className="cr-description">
            {t('readings.summaryCards.cadastralDesc')}
          </div>
        </div>
      </Card>

      <Card className="cr-card cr-card-average">
        <div className="cr-card-header">
          <span>{t('readings.summaryCards.avgConsumption')}</span>
          <FaTint className="cr-icon-blue" size={20} />
        </div>
        <div className="cr-card-body">
          <div className="cr-card-value">
            {info?.averageConsumption != null
              ? `${info.averageConsumption} m³`
              : '---'}
          </div>
        </div>
        <div className="cr-description">
          {t('readings.summaryCards.avgDesc')}
        </div>
      </Card>

      <Card className="cr-card cr-card-previous">
        <div className="cr-card-header">
          <span>{t('readings.summaryCards.prevConsumption')}</span>
          <FaHistory className="cr-icon-gray" size={20} />
        </div>
        <div className="cr-card-body">
          <div className="cr-value cr-badge-gray">
            {info?.currentReading != null
              ? `${Number(info.currentReading - info.previousReading).toFixed(2)} m³`
              : '0.00 m³'}
          </div>
          <div className="cr-date">
            {t('readings.summaryCards.date')}{' '}
            {info?.previousReadingDate
              ? dateService.formatToLocaleString(info.previousReadingDate)
              : '---'}
          </div>
        </div>
      </Card>

      <Card className="cr-card cr-card-current">
        <div className="cr-card-header">
          <span>{t('readings.summaryCards.currentConsumption')}</span>
          <visuals.Icon className={visuals.iconClass} size={20} />
        </div>
        <div className="cr-card-body">
          <div
            className={`cr-value ${visuals.textClass} ${visuals.badgeClass}`}
          >
            {currentConsumption !== null
              ? `${currentConsumption.toFixed(2)} m³`
              : '0.00 m³'}
          </div>
          <div className={`cr-date ${visuals.textClass}`}>
            Fecha:{' '}
            {dateService.formatToLocaleString(dateService.getCurrentDate())}
          </div>
        </div>
      </Card>
    </div>
  );
};
