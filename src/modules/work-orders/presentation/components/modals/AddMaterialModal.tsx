/**
 * AddMaterialModal — Fase 4 (Ejecución)
 *
 * SRP: formulario para registrar material utilizado en la OT.
 * Command: AddWorkOrderMaterialCommand {
 *   workOrderId, materialId, quantity, unitCost, createdByUserId
 * }
 */
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (materialId: number, quantity: number, unitCost: number) => Promise<void>;
  isLoading?: boolean;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity]     = useState('');
  const [unitCost, setUnitCost]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mid = parseInt(materialId, 10);
    const qty = parseFloat(quantity);
    const uc  = parseFloat(unitCost);
    if (isNaN(mid) || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;
    await onSubmit(mid, qty, uc);
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Material Utilizado"
      subtitle={`OT: ${workOrderId}`}
      color="#f59e0b"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <Package size={13} /> ID del Material <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-material-id"
            type="number"
            min="1"
            className="wo-modal-input"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            placeholder="Ej: 12"
            required
            autoFocus
          />
        </div>
        <div className="wo-modal-row">
          <div className="wo-modal-field">
            <label className="wo-modal-label">Cantidad <span className="wo-modal-required">*</span></label>
            <input
              id="wo-material-qty"
              type="number"
              min="0.01"
              step="0.01"
              className="wo-modal-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ej: 2"
              required
            />
          </div>
          <div className="wo-modal-field">
            <label className="wo-modal-label">Costo Unitario ($) <span className="wo-modal-required">*</span></label>
            <input
              id="wo-material-cost"
              type="number"
              min="0"
              step="0.01"
              className="wo-modal-input"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="Ej: 5.50"
              required
            />
          </div>
        </div>
        {quantity && unitCost && (
          <div className="wo-modal-subtotal">
            Subtotal: <strong>${(parseFloat(quantity || '0') * parseFloat(unitCost || '0')).toFixed(2)}</strong>
          </div>
        )}
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#f59e0b' } as React.CSSProperties}
            disabled={!materialId || !quantity || !unitCost || isLoading}
          >
            {isLoading ? 'Guardando...' : 'Registrar Material'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
