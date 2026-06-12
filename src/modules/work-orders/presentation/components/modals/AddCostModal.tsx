/**
 * AddCostModal — Fase 4 (Ejecución)
 *
 * SRP: formulario para registrar un costo adicional de la OT.
 * Command: AddAdditionalCostCommand { workOrderId, concept, quantity, unitCost, createdByUserId }
 */
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface AddCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (concept: string, quantity: number, unitCost: number) => Promise<void>;
  isLoading?: boolean;
}

export const AddCostModal: React.FC<AddCostModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [concept, setConcept]   = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    const uc  = parseFloat(unitCost);
    if (!concept.trim() || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;
    await onSubmit(concept.trim(), qty, uc);
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Costo Adicional"
      subtitle={`OT: ${workOrderId}`}
      color="#10b981"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <DollarSign size={13} /> Concepto <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-cost-concept"
            className="wo-modal-input"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ej: Horas extra, Transporte..."
            required
            autoFocus
          />
        </div>
        <div className="wo-modal-row">
          <div className="wo-modal-field">
            <label className="wo-modal-label">Cantidad <span className="wo-modal-required">*</span></label>
            <input
              id="wo-cost-qty"
              type="number"
              min="1"
              step="1"
              className="wo-modal-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ej: 3"
              required
            />
          </div>
          <div className="wo-modal-field">
            <label className="wo-modal-label">Costo Unitario ($) <span className="wo-modal-required">*</span></label>
            <input
              id="wo-cost-unit"
              type="number"
              min="0"
              step="0.01"
              className="wo-modal-input"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="Ej: 15.00"
              required
            />
          </div>
        </div>
        {quantity && unitCost && (
          <div className="wo-modal-subtotal">
            Total: <strong>${(parseFloat(quantity || '0') * parseFloat(unitCost || '0')).toFixed(2)}</strong>
          </div>
        )}
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#10b981' } as React.CSSProperties}
            disabled={!concept.trim() || !quantity || !unitCost || isLoading}
          >
            {isLoading ? 'Guardando...' : 'Registrar Costo'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
