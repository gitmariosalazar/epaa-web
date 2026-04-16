import React, { useState } from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import {
  FaChevronDown,
  FaChevronUp,
  FaIdCard,
  FaUser,
  FaMapMarkerAlt,
  FaHome
} from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';

interface PropTypes {
  info: ReadingInfo | null;
}

export const AdditionalInfoAccordion: React.FC<PropTypes> = ({ info }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="cr-accordion">
      <div className="cr-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{t('readings.additionalInfo.viewMore')}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isOpen && (
        <div className="cr-accordion-body">
          <div className="cr-form-section">
            <Input
              label={t('readings.additionalInfo.cardId')}
              leftIcon={<FaIdCard color="var(--text-muted)" />}
              type="text"
              value={info?.cardId || ''}
              readOnly
              disabled
            />
            <Input
              label={t('readings.additionalInfo.meterNumber')}
              leftIcon={<FaHome color="var(--text-muted)" />}
              type="text"
              value={info?.meterNumber || ''}
              readOnly
              disabled
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <Input
              label={t('readings.additionalInfo.owner')}
              leftIcon={<FaUser color="var(--text-muted)" />}
              type="text"
              value={info?.clientName || ''}
              readOnly
              disabled
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <Input
              label={t('readings.additionalInfo.address')}
              leftIcon={<FaMapMarkerAlt color="var(--text-muted)" />}
              type="text"
              value={info?.address || ''}
              readOnly
              disabled
            />
          </div>

          <div className="cr-period-box">
            <h4>{t('readings.additionalInfo.period')}</h4>
            <div className="cr-period-dates">
              <div className="cr-date-badge cr-date-start">
                <div className="cr-date-value">
                  {info?.startDatePeriod
                    ? dateService.toISODateStringWithOffset(
                        info.startDatePeriod
                      )
                    : '---'}
                </div>
                <div className="cr-date-label">
                  {t('readings.additionalInfo.start')}
                </div>
              </div>
              <div className="cr-period-line"></div>
              <div className="cr-date-badge cr-date-end">
                <div className="cr-date-value">
                  {info?.endDatePeriod
                    ? dateService.toISODateStringWithOffset(info.endDatePeriod)
                    : '---'}
                </div>
                <div className="cr-date-label">
                  {t('readings.additionalInfo.end')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
