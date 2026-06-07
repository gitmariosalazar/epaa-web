/**
 * GenerateContractModal — Fase 10
 * SRP: gestiona la generación del contrato de servicio post-informe aprobado.
 */
import React, { useState } from 'react';
import { GenerateContractUseCase } from '../../application/usecases/GenerateContractUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FileSignature, X, DollarSign, Clock, Hash } from 'lucide-react';
import '../styles/ActionModal.css';

interface GenerateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  generatorId: string;
  /** Pre-fill from inspection report */
  defaultMaterialCost?: number;
  defaultLaborCost?: number;
  onSuccess: () => void;
}

const useCase = new GenerateContractUseCase(new SolicitudRepositoryImpl());

export const GenerateContractModal: React.FC<GenerateContractModalProps> = ({
  isOpen, onClose, solicitudId, solicitudNumero, generatorId,
  defaultMaterialCost, defaultLaborCost, onSuccess
}) => {
  const [contractNumber, setContractNumber] = useState('');
  const [materialCost, setMaterialCost] = useState(String(defaultMaterialCost ?? ''));
  const [laborCost, setLaborCost] = useState(String(defaultLaborCost ?? ''));
  const [connectionFee, setConnectionFee] = useState('');
  const [tariffId, setTariffId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractNumber.trim()) {
      MessageToastCustom('error', 'Campo requerido', 'Ingrese el número de contrato.');
      return;
    }
    if (!connectionFee || Number(connectionFee) < 0) {
      MessageToastCustom('error', 'Campo requerido', 'Ingrese la tarifa de conexión.');
      return;
    }
    setLoading(true);
    try {
      await useCase.execute({
        solicitudId,
        contractNumber: contractNumber.trim(),
        materialCost: Number(materialCost) || 0,
        laborCost: Number(laborCost) || 0,
        connectionFee: Number(connectionFee),
        tariffId: tariffId ? Number(tariffId) : undefined,
        generatorId
      });
      MessageToastCustom('success', 'Contrato Generado', 'El contrato de servicio fue generado exitosamente.');
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo generar el contrato.');
    } finally {
      setLoading(false);
    }
  };

  const total = (Number(materialCost) || 0) + (Number(laborCost) || 0) + (Number(connectionFee) || 0);

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal action-modal--wide" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--pink">
          <div className="action-modal__header-icon"><FileSignature size={20} /></div>
          <div>
            <h3 className="action-modal__title">Generar Contrato de Servicio</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 10</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__field">
            <label className="action-modal__label"><Hash size={13} /> N° de Contrato</label>
            <input
              type="text"
              className="action-modal__input"
              placeholder="Ej: CTR-2026-0042"
              value={contractNumber}
              onChange={e => setContractNumber(e.target.value)}
              autoFocus
            />
          </div>

          <div className="action-modal__section-title">Valores del Contrato</div>
          <div className="action-modal__row">
            <div className="action-modal__field">
              <label className="action-modal__label"><DollarSign size={13} /> Materiales ($)</label>
              <input
                type="number" min="0" step="0.01"
                className="action-modal__input"
                placeholder="0.00"
                value={materialCost}
                onChange={e => setMaterialCost(e.target.value)}
              />
            </div>
            <div className="action-modal__field">
              <label className="action-modal__label"><DollarSign size={13} /> Mano de Obra ($)</label>
              <input
                type="number" min="0" step="0.01"
                className="action-modal__input"
                placeholder="0.00"
                value={laborCost}
                onChange={e => setLaborCost(e.target.value)}
              />
            </div>
          </div>

          <div className="action-modal__row">
            <div className="action-modal__field">
              <label className="action-modal__label"><DollarSign size={13} /> Tarifa de Conexión ($) *</label>
              <input
                type="number" min="0" step="0.01"
                className="action-modal__input"
                placeholder="Ej: 150.00"
                value={connectionFee}
                onChange={e => setConnectionFee(e.target.value)}
              />
            </div>
            <div className="action-modal__field">
              <label className="action-modal__label">ID Tarifa (opcional)</label>
              <input
                type="number" min="1"
                className="action-modal__input"
                placeholder="Ej: 1"
                value={tariffId}
                onChange={e => setTariffId(e.target.value)}
              />
            </div>
          </div>

          {total > 0 && (
            <div className="action-modal__total-box">
              <span className="action-modal__total-box__label">Valor Total del Contrato</span>
              <span className="action-modal__total-box__value">${total.toFixed(2)}</span>
            </div>
          )}

          <div className="action-modal__actions">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : <FileSignature size={15} />}
            >
              {loading ? 'Generando...' : 'Generar Contrato'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
