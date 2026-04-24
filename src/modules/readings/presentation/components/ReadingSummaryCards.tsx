import React, { useState, useEffect } from 'react';
import '../styles/create-reading.css';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { calculateConsumptionVisuals } from '../utils/consumptionVisuals';
import { Card } from '@/shared/presentation/components/Card/Card';
import { FaPlug, FaTint, FaHistory } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/shared/presentation/components/Alert';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

interface PropTypes {
  info: ReadingInfo[];
  currentReadingInput?: number | '';
  method: 'create' | 'update';
}

export const ReadingSummaryCards: React.FC<PropTypes> = ({
  info,
  currentReadingInput,
  method
}) => {
  const { t } = useTranslation();

  // alertKey fuerza a la alerta a reiniciarse cuando info cambia de referencia (ej. nueva consulta a la misma clave)
  const [alertKey, setAlertKey] = useState(0);

  useEffect(() => {
    setAlertKey((prev) => prev + 1);
  }, [info]);

  const currentReadingInfoSelected = info[0];
  const previousReadingInfoSelected = info[1];

  const currentVal =
    currentReadingInput !== undefined && currentReadingInput !== ''
      ? Number(currentReadingInput)
      : null;

  const previousVal =
    method === 'create'
      ? Number(
          currentReadingInfoSelected?.currentReading !== null
            ? currentReadingInfoSelected?.currentReading
            : currentReadingInfoSelected?.previousReading
        ) || 0
      : Number(currentReadingInfoSelected?.previousReading) || 0;

  const currentConsumption =
    currentVal !== null ? currentVal - previousVal : null;

  const averageConsumption = currentReadingInfoSelected?.averageConsumption
    ? Number(currentReadingInfoSelected.averageConsumption)
    : null;

  // Reutiliza el helper compartido — mismos colores que el modal de confirmación
  const visuals = calculateConsumptionVisuals(
    currentConsumption,
    averageConsumption
  );

  return (
    <>
      <div className="cr-summary-cards">
        <Card className="cr-card cr-card-connection">
          <div className="cr-card-header">
            <span>{t('readings.summaryCards.connectionId')}</span>
            <FaPlug className="cr-icon-green" size={20} />
          </div>
          <div className="cr-card-body">
            <ColorChip
              label={currentReadingInfoSelected?.cadastralKey || '---'}
              status="info"
              variant="soft"
              size="lg"
              borderRadius="10px"
            />
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
            <ColorChip
              label={
                currentReadingInfoSelected?.averageConsumption != null
                  ? `${currentReadingInfoSelected.averageConsumption} m³`
                  : '---'
              }
              status="info"
              variant="soft"
              size="lg"
              borderRadius="10px"
            />
          </div>
          <div className="cr-description">
            {t('readings.summaryCards.avgDesc')}
          </div>
        </Card>

        {method === 'create' ? (
          <Card className="cr-card cr-card-average">
            <div className="cr-card-header">
              <span>{t('readings.summaryCards.prevConsumption')}</span>
              <FaHistory className="cr-icon-gray" size={20} />
            </div>
            <div className="cr-card-body">
              <ColorChip
                label={
                  previousReadingInfoSelected?.currentReading != null
                    ? `${Number(previousReadingInfoSelected.currentReading - previousReadingInfoSelected.previousReading).toFixed(2)} m³`
                    : '0.00 m³'
                }
                status="info"
                variant="soft"
                size="lg"
                borderRadius="10px"
              />
            </div>
            <div className="cr-card-footer">
              <div className="cr-description">
                {t('readings.summaryCards.date')}{' '}
                {previousReadingInfoSelected?.previousReadingDate
                  ? dateService.formatToLocaleString(
                      `${previousReadingInfoSelected.previousReadingDate}`
                    ) +
                    ' ' +
                    previousReadingInfoSelected.readingTime
                  : '---'}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="cr-card cr-card-average">
            <div className="cr-card-header">
              <span>{t('readings.summaryCards.prevConsumption')}</span>
              <FaHistory className="cr-icon-gray" size={20} />
            </div>
            <div className="cr-card-body">
              <ColorChip
                label={
                  currentReadingInfoSelected?.currentReading != null
                    ? `${Number(currentReadingInfoSelected.currentReading - currentReadingInfoSelected.previousReading).toFixed(2)} m³`
                    : '0.00 m³'
                }
                status="info"
                variant="soft"
                size="lg"
                borderRadius="10px"
              />
            </div>
            <div className="cr-card-footer">
              <div className="cr-description">
                {t('readings.summaryCards.date')}{' '}
                {currentReadingInfoSelected?.previousReadingDate
                  ? dateService.formatToLocaleString(
                      `${currentReadingInfoSelected.previousReadingDate}`
                    ) +
                    ' ' +
                    currentReadingInfoSelected.readingTime
                  : '---'}
              </div>
            </div>
          </Card>
        )}

        <Card className="cr-card cr-card-average">
          <div className="cr-card-header">
            <span>{t('readings.summaryCards.currentConsumption')}</span>
            <visuals.Icon className={visuals.iconClass} size={20} />
          </div>
          <div className="cr-card-body">
            <ColorChip
              label={
                currentConsumption !== null
                  ? `${currentConsumption.toFixed(2)} m³`
                  : '0.00 m³'
              }
              status={visuals.chipStatus}
              variant="soft"
              size="lg"
              borderRadius="10px"
            />
          </div>

          <div className="cr-card-footer">
            <div className="cr-description">
              <div className={`cr-date ${visuals.textClass}`}>
                {t('readings.summaryCards.date')}{' '}
                {dateService.formatToLocaleString(dateService.getCurrentDate())}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div>
        {method === 'create' ? (
          <>
            {!currentReadingInfoSelected?.hasCurrentReading ? (
              <Alert
                key={`info-${currentReadingInfoSelected?.cadastralKey}-${alertKey}`}
                type="info"
                message={`La lectura para este mes ya se ha registrado (Fecha: ${ConverDate(currentReadingInfoSelected.previousReadingDate)} - ${currentReadingInfoSelected.readingTime}). No se puede registrar otra lectura dentro del mismo mes.`}
              />
            ) : (
              <Alert
                key={`warn-${currentReadingInfoSelected?.cadastralKey}-${alertKey}`}
                type="warning"
                message="La lectura para este mes no se ha registrado. Por favor, registre la lectura."
              />
            )}
          </>
        ) : (
          <>
            <Alert
              key={`warn-${currentReadingInfoSelected?.cadastralKey}-${alertKey}`}
              type="warning"
              message={`Para realizar la actualizacion, asegurese de que la lectura actual sea correcta y no haya sido facturada.`}
            />
          </>
        )}
      </div>
    </>
  );
};
