/**
 * WorkOrderMaterialsCard
 *
 * SRP: lista de materiales y costos adicionales usados en la OT.
 */
import React, { useState } from 'react';
import { Package, DollarSign, Plus } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type {
  MaterialUtilizado,
  CostoAdicional,
} from '../../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrderMaterialsCardProps {
  materiales: MaterialUtilizado[];
  costosAdicionales: CostoAdicional[];
  costoTotalMateriales: number;
  costoTotalAdicionales: number;
  costoTotalOrden: number;
  onAddMaterial?: (materialId: number, quantity: number, unitCost: number) => Promise<void>;
  onAddCost?: (concept: string, quantity: number, unitCost: number) => Promise<void>;
  isLoading?: boolean;
}

export const WorkOrderMaterialsCard: React.FC<WorkOrderMaterialsCardProps> = ({
  materiales,
  costosAdicionales,
  costoTotalMateriales,
  costoTotalAdicionales,
  costoTotalOrden,
  onAddMaterial,
  onAddCost,
  isLoading = false,
}) => {
  const mats  = materiales       ?? [];
  const costs = costosAdicionales ?? [];

  // Material inline form state
  const [materialId, setMaterialId] = useState('');
  const [materialQty, setMaterialQty] = useState('');
  const [materialCost, setMaterialCost] = useState('');

  // Cost inline form state
  const [costConcept, setCostConcept] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costUnit, setCostUnit] = useState('');

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddMaterial) return;
    const mid = parseInt(materialId, 10);
    const qty = parseFloat(materialQty);
    const uc  = parseFloat(materialCost);
    if (isNaN(mid) || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;
    try {
      await onAddMaterial(mid, qty, uc);
      setMaterialId('');
      setMaterialQty('');
      setMaterialCost('');
    } catch (err) {}
  };

  const handleCostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddCost) return;
    const qty = parseFloat(costQty);
    const uc  = parseFloat(costUnit);
    if (!costConcept.trim() || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;
    try {
      await onAddCost(costConcept.trim(), qty, uc);
      setCostConcept('');
      setCostQty('');
      setCostUnit('');
    } catch (err) {}
  };

  if (mats.length === 0 && costs.length === 0 && !onAddMaterial && !onAddCost) {
    return (
      <Card title="Materiales y Costos" className="wo-detail-card">
        <p className="wo-empty-text">No se registraron materiales para esta orden.</p>
      </Card>
    );
  }

  const matQtyNum = parseFloat(materialQty) || 0;
  const matCostNum = parseFloat(materialCost) || 0;
  const matSubtotal = matQtyNum * matCostNum;

  const costQtyNum = parseFloat(costQty) || 0;
  const costUnitNum = parseFloat(costUnit) || 0;
  const costSubtotal = costQtyNum * costUnitNum;

  return (
    <Card title="Materiales y Costos" className="wo-detail-card">

      {/* Materiales */}
      {(mats.length > 0 || onAddMaterial) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="wo-table-section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div className="wo-table-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Package size={14} /> Materiales Utilizados
            </div>
          </div>
          {mats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay materiales registrados.</p>
            </div>
          ) : (
            <div className="wo-table-wrapper" style={{ marginBottom: '1rem' }}>
              <table className="wo-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th className="wo-table__num">Cantidad</th>
                    <th className="wo-table__num">Costo Unit.</th>
                    <th className="wo-table__num">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {mats.map((m) => (
                    <tr key={m.idDetalle}>
                      <td>
                        <span className="wo-table__name">{m.nombreMaterial ?? `Material #${m.idMaterial}`}</span>
                        {m.descripcion && (
                          <span className="wo-table__sub">{m.descripcion}</span>
                        )}
                      </td>
                      <td className="wo-table__num">{m.cantidad}</td>
                      <td className="wo-table__num">${parseFloat(m.costoUnitario as any).toFixed(2)}</td>
                      <td className="wo-table__num wo-table__bold">${parseFloat(m.subtotal as any).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="wo-table__total-label">Total materiales</td>
                    <td className="wo-table__num wo-table__total">${(parseFloat(costoTotalMateriales as any) || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Formulario Inline para registrar material */}
          {onAddMaterial && (
            <div className="wo-materials-inline-form-box" style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <form onSubmit={handleMaterialSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>ID Material *</label>
                  <input
                    type="number"
                    min="1"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                    placeholder="Ej: 12"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Cant *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={materialQty}
                    onChange={(e) => setMaterialQty(e.target.value)}
                    placeholder="Ej: 2"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Costo Unit ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                    placeholder="Ej: 5.50"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Subtotal</label>
                  <div style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                    ${matSubtotal.toFixed(2)}
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="xs"
                  disabled={!materialId || !materialQty || !materialCost || isLoading}
                  leftIcon={<Plus size={12} />}
                  style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#f59e0b' }}
                >
                  Agregar
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Costos adicionales */}
      {(costs.length > 0 || onAddCost) && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="wo-table-section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
            <div className="wo-table-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <DollarSign size={14} /> Costos Adicionales
            </div>
          </div>
          {costs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay costos adicionales registrados.</p>
            </div>
          ) : (
            <div className="wo-table-wrapper" style={{ marginBottom: '1rem' }}>
              <table className="wo-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th className="wo-table__num">Cantidad</th>
                    <th className="wo-table__num">Costo Unit.</th>
                    <th className="wo-table__num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((c) => (
                    <tr key={c.idCosto}>
                      <td>{c.concepto}</td>
                      <td className="wo-table__num">{c.cantidad}</td>
                      <td className="wo-table__num">${parseFloat(c.costoUnitario as any).toFixed(2)}</td>
                      <td className="wo-table__num wo-table__bold">${parseFloat(c.total as any).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="wo-table__total-label">Total adicionales</td>
                    <td className="wo-table__num wo-table__total">${(parseFloat(costoTotalAdicionales as any) || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Formulario Inline para registrar costo adicional */}
          {onAddCost && (
            <div className="wo-costs-inline-form-box" style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <form onSubmit={handleCostSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Concepto *</label>
                  <input
                    type="text"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={costConcept}
                    onChange={(e) => setCostConcept(e.target.value)}
                    placeholder="Ej: Transporte, Horas extra..."
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Cant *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={costQty}
                    onChange={(e) => setCostQty(e.target.value)}
                    placeholder="Ej: 1"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Costo Unit ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={costUnit}
                    onChange={(e) => setCostUnit(e.target.value)}
                    placeholder="Ej: 15.00"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Total</label>
                  <div style={{ height: '32px', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                    ${costSubtotal.toFixed(2)}
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="xs"
                  disabled={!costConcept.trim() || !costQty || !costUnit || isLoading}
                  leftIcon={<Plus size={12} />}
                  style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#10b981' }}
                >
                  Agregar
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {(mats.length > 0 || costs.length > 0) && (
        <div className="wo-cost-total" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <span>Costo Total de la Orden</span>
          <span className="wo-cost-total__value">${(parseFloat(costoTotalOrden as any) || 0).toFixed(2)}</span>
        </div>
      )}

    </Card>
  );
};
