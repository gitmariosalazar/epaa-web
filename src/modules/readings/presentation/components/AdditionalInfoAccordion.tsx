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

interface PropTypes {
  info: ReadingInfo | null;
}

export const AdditionalInfoAccordion: React.FC<PropTypes> = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cr-accordion">
      <div className="cr-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>Ver Información Adicional</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isOpen && (
        <div className="cr-accordion-body">
          <div className="cr-form-section">
            <Input
              label="Cédula de Ciudadanía"
              leftIcon={<FaIdCard color="var(--text-muted)" />}
              type="text"
              value={info?.cardId || ''}
              readOnly
              disabled
            />
            <Input
              label="Número de Medidor"
              leftIcon={<FaHome color="var(--text-muted)" />}
              type="text"
              value={info?.meterNumber || ''}
              readOnly
              disabled
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <Input
              label="Propietario de la Conexión"
              leftIcon={<FaUser color="var(--text-muted)" />}
              type="text"
              value={info?.clientName || ''}
              readOnly
              disabled
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <Input
              label="Dirección de la Conexión"
              leftIcon={<FaMapMarkerAlt color="var(--text-muted)" />}
              type="text"
              value={info?.address || ''}
              readOnly
              disabled
            />
          </div>

          <div className="cr-period-box">
            <h4>Periodo de Lectura</h4>
            <div className="cr-period-dates">
              <div className="cr-date-badge cr-date-start">
                <div className="cr-date-value">
                  {info?.startDatePeriod
                    ? new Date(info.startDatePeriod).toLocaleDateString()
                    : '---'}
                </div>
                <div className="cr-date-label">Inicio</div>
              </div>
              <div className="cr-period-line"></div>
              <div className="cr-date-badge cr-date-end">
                <div className="cr-date-value">
                  {info?.endDatePeriod
                    ? new Date(info.endDatePeriod).toLocaleDateString()
                    : '---'}
                </div>
                <div className="cr-date-label">Fin</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
