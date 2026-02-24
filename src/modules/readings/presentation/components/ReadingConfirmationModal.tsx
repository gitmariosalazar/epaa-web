/**
 * ReadingConfirmationModal
 *
 * Capa:  Presentation (Clean Architecture)
 * Patrón: Container → Subcomponents puros
 *
 * Principios SOLID aplicados:
 *  SRP – La lógica de cálculo vive en `useReadingConfirmationModal`;
 *         cada sección visual es su propio subcomponente.
 *  OCP – Nuevas secciones se añaden sin modificar las existentes.
 *  LSP – Todos los subcomponentes son sustituibles por versiones extendidas.
 *  ISP – Cada subcomponente recibe sólo las props que necesita.
 *  DIP – El componente principal depende de abstracciones (interfaces de props),
 *         no de implementaciones concretas.
 *
 * Los colores e iconos son 100 % consistentes con ReadingSummaryCards porque
 * ambos componentes usan `calculateConsumptionVisuals` del helper compartido.
 */

import React from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaKey,
  FaTachometerAlt,
  FaStickyNote
} from 'react-icons/fa';

import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { useReadingConfirmationModal } from '../hooks/useReadingConfirmationModal';
import type { ReadingConfirmationViewModel } from '../hooks/useReadingConfirmationModal';
import '../styles/create-reading.css';

// ── Interfaces de props ───────────────────────────────────────────────────────

interface ReadingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  readingInfo: ReadingInfo;
  currentReadingInput: number | '';
  observationInput: string;
  isSubmitting: boolean;
}

// ── Sub-componentes atómicos (ISP: cada uno recibe sólo lo que necesita) ─────

/**
 * Alerta de cabecera — usa el icono del nivel de consumo para que sea
 * consistente con las tarjetas de resumen.
 */
interface ConfirmationHeaderAlertProps {
  viewModel: ReadingConfirmationViewModel;
}

const ConfirmationHeaderAlert: React.FC<ConfirmationHeaderAlertProps> = ({
  viewModel
}) => {
  const { isHighConsumption, visuals } = viewModel;
  const AlertIcon = visuals.Icon;

  return (
    <div
      className={`cr-confirm-header-alert ${isHighConsumption ? 'cr-confirm-header-alert--warn' : ''}`}
    >
      <AlertIcon
        size={35}
        className={
          isHighConsumption ? 'cr-confirm-icon-warn' : 'cr-confirm-icon-info'
        }
      />
      <div className="cr-confirm-header-alert-text">
        <strong>
          {isHighConsumption
            ? 'Consumo inusualmente alto — verifica la lectura'
            : 'Revisa los datos antes de guardar'}
        </strong>
        <p className="cr-confirm-header-alert-text-p">
          {isHighConsumption
            ? 'El consumo registrado supera el rango normal del historial del cliente.'
            : 'Asegúrate de que la lectura ingresada sea la correcta para el cliente.'}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tarjeta con la información del cliente.
 */
interface ClientInfoCardProps {
  clientName: string;
  cardId: string;
  cadastralKey: string;
  address: string;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  clientName,
  cardId,
  cadastralKey,
  address
}) => (
  <div className="cr-confirm-client-card">
    <h4>
      <FaUser style={{ marginRight: 8 }} />
      {clientName}
    </h4>
    <p>
      <FaIdCard style={{ marginRight: 6, color: 'var(--info)' }} />
      <strong>C.I / RUC:</strong>&nbsp;{cardId}
    </p>
    <p>
      <FaKey style={{ marginRight: 6, color: 'var(--info)' }} />
      <strong>Clave Catastral:</strong>&nbsp;{cadastralKey}
    </p>
    <p>
      <FaMapMarkerAlt style={{ marginRight: 6, color: 'var(--info)' }} />
      <strong>Dirección:</strong>&nbsp;{address || 'No registrada'}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Grid con las tres estadísticas: lectura anterior, actual y consumo.
 * El la caja de consumo usa los mismos colores que la tarjeta "Consumo Actual"
 * de ReadingSummaryCards (badgeClass, textClass, iconClass del helper compartido).
 */
interface ReadingStatsGridProps {
  viewModel: ReadingConfirmationViewModel;
}

const ReadingStatsGrid: React.FC<ReadingStatsGridProps> = ({ viewModel }) => {
  const { previousReading, currentReading, consumption, visuals } = viewModel;
  const ConsumptionIcon = visuals.Icon;

  return (
    <div className="cr-confirm-stats-grid">
      {/* Lectura Anterior */}
      <div className="cr-confirm-stat-box">
        <span>Lectura Anterior</span>
        <span className="cr-confirm-val">
          {previousReading} <small>m³</small>
        </span>
      </div>

      {/* Lectura Actual */}
      <div className="cr-confirm-stat-box">
        <span>Lectura Actual</span>
        <span className="cr-confirm-val">
          {currentReading} <small>m³</small>
        </span>
      </div>

      {/* Consumo — colores e icono alineados con ReadingSummaryCards */}
      <div className={`cr-confirm-stat-box ${visuals.statBoxClass}`}>
        <span>Consumo Mensual</span>
        <ConsumptionIcon
          size={22}
          className={visuals.iconClass}
          style={{ marginBottom: 4 }}
        />
        <span
          className={`cr-confirm-val ${visuals.textClass} ${visuals.badgeClass} cr-confirm-val-badge`}
        >
          {consumption.toFixed(2)} <small>m³</small>
        </span>
        {visuals.warningText && (
          <span className="cr-confirm-warn-text">{visuals.warningText}</span>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sección de observaciones/novedades, renderizada condicionalmente.
 */
interface ObservationSectionProps {
  observation: string;
}

const ObservationSection: React.FC<ObservationSectionProps> = ({
  observation
}) => {
  if (!observation) return null;

  return (
    <div className="cr-confirm-observation">
      <strong>
        <FaStickyNote style={{ marginRight: 6 }} />
        Novedades / Observación:
      </strong>
      <p>{observation}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nota del promedio histórico — sólo visible cuando el consumo es anormal.
 */
interface AverageConsumptionNoteProps {
  averageConsumption: number;
  isHighConsumption: boolean;
}

const AverageConsumptionNote: React.FC<AverageConsumptionNoteProps> = ({
  averageConsumption,
  isHighConsumption
}) => {
  if (!isHighConsumption || averageConsumption === 0) return null;

  return (
    <div className="cr-confirm-avg-note">
      <FaTachometerAlt style={{ marginRight: 6, color: 'var(--warning)' }} />
      <span>
        Promedio histórico del cliente: <strong>{averageConsumption} m³</strong>
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Footer del modal con los botones de acción.
 */
interface ModalFooterActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalFooterActions: React.FC<ModalFooterActionsProps> = ({
  isSubmitting,
  onClose,
  onConfirm
}) => (
  <div className="cr-confirm-footer-actions">
    <Button
      variant="danger"
      disabled={isSubmitting}
      onClick={onClose}
      leftIcon={<FaTimesCircle />}
    >
      Cancelar
    </Button>
    <Button
      variant="success"
      isLoading={isSubmitting}
      disabled={isSubmitting}
      onClick={onConfirm}
      leftIcon={<FaCheckCircle />}
    >
      {isSubmitting ? 'Guardando...' : 'Confirmar y Guardar'}
    </Button>
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────

export const ReadingConfirmationModal: React.FC<
  ReadingConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  readingInfo,
  currentReadingInput,
  observationInput,
  isSubmitting
}) => {
  const viewModel = useReadingConfirmationModal(
    readingInfo,
    currentReadingInput
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Lectura"
      size="md"
      footer={
        <ModalFooterActions
          isSubmitting={isSubmitting}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      }
    >
      <div className="cr-confirm-modal-body">
        {/* 1. Alerta de cabecera — icono según nivel de consumo */}
        <ConfirmationHeaderAlert viewModel={viewModel} />

        {/* 2. Datos del cliente */}
        <ClientInfoCard
          clientName={readingInfo.clientName}
          cardId={readingInfo.cardId}
          cadastralKey={readingInfo.cadastralKey}
          address={readingInfo.address}
        />

        {/* 3. Grid: lecturas + consumo con colores sincronizados */}
        <ReadingStatsGrid viewModel={viewModel} />

        {/* 4. Nota de promedio (sólo si consumo es anormal) */}
        <AverageConsumptionNote
          averageConsumption={viewModel.averageConsumption}
          isHighConsumption={viewModel.isHighConsumption}
        />

        {/* 5. Observaciones */}
        <ObservationSection observation={observationInput} />
      </div>
    </Modal>
  );
};
