/**
 * PreviousMonthWarningModal
 *
 * Capa:   Presentation (Clean Architecture)
 * Patrón: Atomic sub-components → Container principal
 *
 * Principios SOLID aplicados:
 *  SRP – Responsabilidad única: advertir que la lectura es de un mes anterior
 *         y puede haber sido facturada. Cada subcomponente tiene su propia
 *         responsabilidad visual.
 *  OCP – Nuevas secciones de información se añaden sin modificar las existentes.
 *  LSP – Todos los subcomponentes son intercambiables por versiones extendidas.
 *  ISP – Cada subcomponente recibe únicamente las props que necesita.
 *  DIP – Depende de la abstracción `Modal`, no de su implementación interna.
 */

import React from 'react';
import {
  AlertTriangle,
  Calendar,
  FileText,
  ShieldAlert,
  User,
  CreditCard,
  MapPin,
  XCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { formatReadingMonth } from '../../application/usecases/CheckReadingMonthUseCase';
import '../styles/previous-month-warning-modal.css';

// ── Interfaces de props ───────────────────────────────────────────────────────

export interface PreviousMonthWarningModalProps {
  isOpen: boolean;
  readingInfo: ReadingInfo;
  onCancel: () => void;
  onContinue: () => void;
}

// ── Subcomponentes atómicos (ISP: reciben solo lo necesario) ──────────────────

/**
 * Cabecera de advertencia — comunica el riesgo con iconografía y gradiente.
 */
interface WarningHeaderProps {
  readingMonth: string;
}

const WarningHeader: React.FC<WarningHeaderProps> = ({ readingMonth }) => (
  <div className="pmw-header">
    <div className="pmw-header-icon-ring">
      <AlertTriangle className="pmw-header-icon" strokeWidth={2.2} />
    </div>
    <div className="pmw-header-text">
      <span className="pmw-header-title">Lectura de Mes Anterior</span>
      <span className="pmw-header-subtitle">
        <Calendar size={13} style={{ marginRight: 5, flexShrink: 0 }} />
        Período registrado:{' '}
        <strong>{formatReadingMonth(readingMonth)}</strong>
      </span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Banner de alerta principal — mensaje claro sobre posible facturación.
 */
const BillingWarningBanner: React.FC = () => (
  <div className="pmw-billing-banner">
    <div className="pmw-billing-banner-icon">
      <ShieldAlert size={22} />
    </div>
    <div className="pmw-billing-banner-content">
      <p className="pmw-billing-banner-title">
        Esta lectura posiblemente ya fue facturada
      </p>
      <p className="pmw-billing-banner-body">
        Las lecturas de meses anteriores generalmente ya han sido procesadas en
        el ciclo de facturación correspondiente. Modificar esta lectura puede
        generar <strong>inconsistencias en los registros contables</strong> y
        afectar el historial del cliente.
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tarjeta de información del cliente y datos de la lectura.
 */
interface ClientReadingInfoCardProps {
  readingInfo: ReadingInfo;
}

const ClientReadingInfoCard: React.FC<ClientReadingInfoCardProps> = ({
  readingInfo
}) => (
  <div className="pmw-info-card">
    <div className="pmw-info-card-header">
      <Info size={14} />
      <span>Datos de la lectura a modificar</span>
    </div>
    <div className="pmw-info-grid">
      <div className="pmw-info-item">
        <User size={14} className="pmw-info-icon" />
        <div>
          <span className="pmw-info-label">Cliente</span>
          <span className="pmw-info-value">{readingInfo.clientName}</span>
        </div>
      </div>

      <div className="pmw-info-item">
        <CreditCard size={14} className="pmw-info-icon" />
        <div>
          <span className="pmw-info-label">C.I / RUC</span>
          <span className="pmw-info-value">{readingInfo.cardId}</span>
        </div>
      </div>

      <div className="pmw-info-item">
        <MapPin size={14} className="pmw-info-icon" />
        <div>
          <span className="pmw-info-label">Clave Catastral</span>
          <span className="pmw-info-value pmw-info-value--mono">
            {readingInfo.cadastralKey}
          </span>
        </div>
      </div>

      <div className="pmw-info-item">
        <Calendar size={14} className="pmw-info-icon pmw-info-icon--warn" />
        <div>
          <span className="pmw-info-label">Período de la lectura</span>
          <span className="pmw-info-value pmw-info-value--warn">
            {formatReadingMonth(readingInfo.monthReading)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Nota de riesgo con los puntos críticos a considerar.
 */
const RiskNotice: React.FC = () => (
  <div className="pmw-risk-notice">
    <div className="pmw-risk-notice-title">
      <FileText size={14} />
      <span>Consideraciones importantes</span>
    </div>
    <ul className="pmw-risk-list">
      <li>
        La lectura puede estar vinculada a una factura ya emitida y cobrada.
      </li>
      <li>
        Cambiar el valor podría requerir una nota de crédito o ajuste contable.
      </li>
      <li>
        Se recomienda coordinar con el área de facturación antes de continuar.
      </li>
      <li>
        Esta acción quedará registrada en el historial de auditoría del sistema.
      </li>
    </ul>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Footer con las acciones: Cancelar (seguro) y Continuar de todas formas (riesgo).
 */
interface WarningFooterActionsProps {
  onCancel: () => void;
  onContinue: () => void;
}

const WarningFooterActions: React.FC<WarningFooterActionsProps> = ({
  onCancel,
  onContinue
}) => (
  <div className="pmw-footer-actions">
    <Button
      variant="outline"
      onClick={onCancel}
      leftIcon={<XCircle size={16} />}
      size="sm"
    >
      Cancelar — No modificar
    </Button>
    <Button
      variant="warning"
      onClick={onContinue}
      leftIcon={<CheckCircle2 size={16} />}
      size="sm"
    >
      Entiendo el riesgo — Continuar
    </Button>
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────

export const PreviousMonthWarningModal: React.FC<
  PreviousMonthWarningModalProps
> = ({ isOpen, readingInfo, onCancel, onContinue }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Advertencia de Facturación"
      description="Esta lectura es de un mes anterior al período actual"
      size="md"
      footer={
        <WarningFooterActions onCancel={onCancel} onContinue={onContinue} />
      }
    >
      <div className="pmw-modal-body">
        {/* 1. Cabecera visual de alerta */}
        <WarningHeader readingMonth={readingInfo.monthReading} />

        {/* 2. Banner de advertencia de facturación */}
        <BillingWarningBanner />

        {/* 3. Info del cliente y lectura */}
        <ClientReadingInfoCard readingInfo={readingInfo} />

        {/* 4. Consideraciones de riesgo */}
        <RiskNotice />
      </div>
    </Modal>
  );
};
