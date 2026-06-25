import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  IdCard,
  User,
  MapPin,
  Gauge,
  Hash,
  Phone,
  Mail,
  Info,
  Layers,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConnectionStateChip } from '@/shared/presentation/components/chip/ConnectionStateChip';
import { GrStatusUnknown } from 'react-icons/gr';
import type { ReadingInfo } from '@/modules/readings/domain/models/ReadingInfoResponse';

interface PropTypes {
  info: ReadingInfo | null;
}

export const AdditionalInfoAccordion: React.FC<PropTypes> = ({ info }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  if (!info) return null;

  const phones = info.clientPhones?.map((p) => p.numero).join(', ') || '—';
  const emails = info.clientEmails?.map((e) => e.email).join(', ') || '—';



  console.log(info);

  return (
    <div className="ai-wrapper">
      {/* ── Header ── */}
      <div className="ai-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="ai-header-left">
          <span className="ai-header-icon-wrap">
            <Info size={15} />
          </span>
          <span className="ai-header-title">
            {t(`Información adicional de la acometida (Usuario: ${info.clientName || '—'})`)}
          </span>
        </div>
        <span className="ai-chevron">
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </div>

      {/* ── Body ── */}
      {isOpen && (
        <div className="ai-body" >
          {/* Info grid */}
          <div className="ai-info-grid">
            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <IdCard size={14} />
                </span>
                <span className="ai-info-label">
                  {t('readings.additionalInfo.cardId', 'Cédula / RUC')}
                </span>
              </div>
              <span className="ai-info-value">{info.cardId || '—'}</span>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <Gauge size={14} />
                </span>
                <span className="ai-info-label">
                  {t('readings.additionalInfo.meterNumber', 'N.° Medidor')}
                </span>
              </div>
              <span className="ai-info-value">{info.meterNumber || '—'}</span>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <User size={14} />
                </span>
                <span className="ai-info-label">
                  {t('readings.additionalInfo.owner', 'Titular')}
                </span>
              </div>
              <span className="ai-info-value">{info.clientName || '—'}</span>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <MapPin size={14} />
                </span>
                <span className="ai-info-label">
                  {t('readings.additionalInfo.address', 'Dirección')}
                </span>
              </div>
              <span className="ai-info-value">{info.address || '—'}</span>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <Hash size={14} />
                </span>
                <span className="ai-info-label">Tarifa</span>
              </div>
              <span className="ai-info-value">{info.rateName || '—'}</span>
            </div>

            {/* Sector + Cuenta en una sola celda */}
            <div className="ai-info-cell ai-info-cell--split">
              <div className="ai-split-col">
                <div className="ai-period-title">
                  <span className="ai-info-icon">
                    <Layers size={14} />
                  </span>
                  <span className="ai-info-label">Sector</span>
                </div>
                <span className="ai-info-value">{info.sector ?? '—'}</span>
              </div>
              <div className="ai-split-divider" />
              <div className="ai-split-col">
                <div className="ai-period-title">
                  <span className="ai-info-icon">
                    <BookOpen size={14} />
                  </span>
                  <span className="ai-info-label">Cuenta</span>
                </div>
                <span className="ai-info-value">{info.account ?? '—'}</span>
              </div>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <Phone size={14} />
                </span>
                <span className="ai-info-label">Teléfonos</span>
              </div>
              <span className="ai-info-value">
                {phones.toString().trim().length > 5 && phones !== '—'
                  ? phones
                  : 'No registrado'}
              </span>
            </div>

            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <Mail size={14} />
                </span>
                <span className="ai-info-label">Correos</span>
              </div>
              <span className="ai-info-value">
                {emails.toString().trim().length > 5 && emails !== '—'
                  ? emails
                  : 'No registrado'}
              </span>
            </div>
            <div className="ai-info-cell">
              <div className="ai-period-title">
                <span className="ai-info-icon">
                  <GrStatusUnknown size={14} />
                </span>
                <span className="ai-info-label">Estado acometida</span>
              </div>
              <div className="ai-info-value">
                {info.connectionStateName ? (
                  <ConnectionStateChip statusName={info.connectionStateName} size="sm" variant="soft" />
                ) : (
                  '—'
                )}
              </div>
            </div>
          </div>

          {/* Period banner
          <div className="ai-period-banner">
            <div className="ai-period-title">
              <span className="ai-period-icon-wrap">
                <CalendarRange size={14} />
              </span>
              {t('readings.additionalInfo.period', 'Período de facturación')}
            </div>
            <div className="ai-period-dates">
              <div className="ai-date-badge ai-date-start">
                <span className="ai-date-dot ai-date-dot--start" />
                <span className="ai-date-val">{startDate}</span>
                <span className="ai-date-lbl">
                  {t('readings.additionalInfo.start', 'Inicio')}
                </span>
              </div>
              <div className="ai-period-line" />
              <div className="ai-date-badge ai-date-end">
                <span className="ai-date-dot ai-date-dot--end" />
                <span className="ai-date-val">{endDate}</span>
                <span className="ai-date-lbl">
                  {t('readings.additionalInfo.end', 'Fin')}
                </span>
              </div>
            </div>
          </div>
           */}
        </div>
      )}
    </div>
  );
};
