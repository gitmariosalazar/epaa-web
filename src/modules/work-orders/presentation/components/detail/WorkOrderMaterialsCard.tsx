import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { SearchableSelect } from '@/shared/presentation/components/Input/SearchableSelect';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { InventoryProvider } from '@/modules/products/presentation/context/InventoryContext';
import { useInventoryViewModel } from '@/modules/products/presentation/hooks/useInventoryViewModel';
import type {
  MaterialUtilizado,
  CostoAdicional,
} from '../../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrderMaterialsCardProps {
  materiales: MaterialUtilizado[];
  costosAdicionales: CostoAdicional[];
  onSaveMaterialsBatch?: (materials: { materialId: number; quantity: number; unitCost: number }[]) => Promise<void>;
  onRemoveMaterial?: (detalleId: string | number) => Promise<void>;
  onSaveCostsBatch?: (costs: { concept: string; quantity: number; unitCost: number }[]) => Promise<void>;
  onRemoveCost?: (costoId: string | number) => Promise<void>;
  isLoading?: boolean;
}

const WorkOrderMaterialsCardInner: React.FC<WorkOrderMaterialsCardProps> = ({
  materiales,
  costosAdicionales,
  onSaveMaterialsBatch,
  onRemoveMaterial,
  onSaveCostsBatch,
  onRemoveCost,
  isLoading = false,
}) => {
  const mats = materiales ?? [];
  const costs = costosAdicionales ?? [];

  const { state, loadInitialData } = useInventoryViewModel();

  useEffect(() => {
    if (onSaveMaterialsBatch) {
      loadInitialData();
    }
  }, [loadInitialData, onSaveMaterialsBatch]);

  const inventoryOptions = state.inventories.map(inv => ({
    value: inv.inventoryId,
    label: `${inv.itemCode || ''} - ${inv.itemName || ''}`.replace(/^- | -$/, '')
  }));

  const [materialId, setMaterialId] = useState<string | number>('');
  const [materialQty, setMaterialQty] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [removingMaterialId, setRemovingMaterialId] = useState<string | number | null>(null);
  const [pendingMats, setPendingMats] = useState<MaterialUtilizado[]>([]);

  // Cost inline form state
  const [costConcept, setCostConcept] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costUnit, setCostUnit] = useState('');
  const [removingCostId, setRemovingCostId] = useState<string | number | null>(null);
  const [pendingCosts, setPendingCosts] = useState<CostoAdicional[]>([]);

  const handleMaterialChange = (val: string | number) => {
    setMaterialId(val);
    const selected = state.inventories.find(inv => inv.inventoryId === val);
    if (selected) {
      setMaterialCost(String(selected.avgCostValue || 0));
    } else {
      setMaterialCost('');
    }
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveMaterialsBatch) return;
    const mid = typeof materialId === 'string' ? parseInt(materialId, 10) : materialId;
    const qty = parseFloat(materialQty);
    const uc = parseFloat(materialCost);
    if (isNaN(mid) || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;

    const selected = state.inventories.find(inv => inv.inventoryId === mid);
    const newMat: MaterialUtilizado = {
      idDetalle: `temp_${Date.now()}_${Math.random()}`,
      idOrdenTrabajo: '',
      idMaterial: mid,
      codigoMaterial: selected?.itemCode || '',
      nombreMaterial: selected?.itemName || '',
      cantidad: qty,
      costoUnitario: uc,
      subtotal: qty * uc,
      fechaRegistro: new Date().toISOString()
    } as any;

    setPendingMats([...pendingMats, newMat]);
    setMaterialId('');
    setMaterialQty('');
    setMaterialCost('');
  };

  const handleSaveMaterials = async () => {
    if (!onSaveMaterialsBatch || pendingMats.length === 0) return;
    const batch = pendingMats.map(m => ({
      materialId: Number(m.idMaterial),
      quantity: m.cantidad,
      unitCost: m.costoUnitario,
      codigoMaterial: m.codigoMaterial,
      nombreMaterial: m.nombreMaterial
    }));
    await onSaveMaterialsBatch(batch);
    setPendingMats([]);
  };

  const handleRemoveMaterialAction = async (idDetalle: string | number) => {
    if (String(idDetalle).startsWith('temp_')) {
      setPendingMats(pendingMats.filter(m => m.idDetalle !== idDetalle));
      return;
    }
    if (!onRemoveMaterial) return;
    setRemovingMaterialId(idDetalle);
    try {
      await onRemoveMaterial(idDetalle);
    } finally {
      setRemovingMaterialId(null);
    }
  };

  const handleCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveCostsBatch) return;
    const qty = parseFloat(costQty);
    const uc = parseFloat(costUnit);
    if (!costConcept.trim() || isNaN(qty) || isNaN(uc) || qty <= 0 || uc < 0) return;

    const newCost: CostoAdicional = {
      idCosto: `temp_${Date.now()}_${Math.random()}`,
      idOrdenTrabajo: '',
      concepto: costConcept.trim(),
      cantidad: qty,
      costoUnitario: uc,
      total: qty * uc,
      fechaRegistro: new Date().toISOString()
    } as any;

    setPendingCosts([...pendingCosts, newCost]);
    setCostConcept('');
    setCostQty('');
    setCostUnit('');
  };

  const handleSaveCosts = async () => {
    if (!onSaveCostsBatch || pendingCosts.length === 0) return;
    const batch = pendingCosts.map(c => ({
      concept: c.concepto,
      quantity: c.cantidad,
      unitCost: c.costoUnitario
    }));
    await onSaveCostsBatch(batch);
    setPendingCosts([]);
  };

  const handleRemoveCostAction = async (idCosto: string | number) => {
    if (String(idCosto).startsWith('temp_')) {
      setPendingCosts(pendingCosts.filter(c => c.idCosto !== idCosto));
      return;
    }
    if (!onRemoveCost) return;
    setRemovingCostId(idCosto);
    try {
      await onRemoveCost(idCosto);
    } finally {
      setRemovingCostId(null);
    }
  };

  if (mats.length === 0 && costs.length === 0 && !onSaveMaterialsBatch && !onSaveCostsBatch) {
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

  const combinedMats = [...mats, ...pendingMats];
  const combinedCosts = [...costs, ...pendingCosts];

  const calculatedTotalMateriales = combinedMats.reduce(
    (sum, m) => sum + (parseFloat(m.cantidad as any) * parseFloat(m.costoUnitario as any) || 0), 0
  );
  const calculatedTotalAdicionales = combinedCosts.reduce(
    (sum, c) => sum + (parseFloat(c.cantidad as any) * parseFloat(c.costoUnitario as any) || 0), 0
  );
  const calculatedTotalOrden = calculatedTotalMateriales + calculatedTotalAdicionales;
  console.log(mats, costs)
  const matColumns: Column<MaterialUtilizado>[] = [
    {
      header: 'Material',
      id: 'material',
      accessor: (m) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="wo-table__name">{m.codigoMaterial}</span>
          <span className="wo-table__sub" style={{ fontSize: '0.75rem', opacity: 0.7 }}>{m.nombreMaterial}</span>
        </div>
      ),
    },
    {
      header: 'Cantidad',
      accessor: 'cantidad',
      isNumeric: true,
      id: 'cantidad'
    },
    {
      header: 'Costo Unit.',
      id: 'costoUnitario',
      accessor: (m) => `S/ ${parseFloat(m.costoUnitario as any).toFixed(2)}`,
      isNumeric: true,
    },
    {
      header: 'Subtotal',
      id: 'subtotal',
      accessor: (m) => (
        <span style={{
          color: String(m.idDetalle).startsWith('temp_') ? 'var(--warning, #f59e0b)' : 'inherit'
        }}>
          S/ ${parseFloat(m.subtotal as any).toFixed(2)}
        </span>
      ),
      isNumeric: true,
      className: 'wo-table__bold',
    },
    ...(onRemoveMaterial ? [{
      header: 'Acciones',
      id: 'acciones',
      accessor: (m: MaterialUtilizado) => (
        <button
          type="button"
          onClick={() => handleRemoveMaterialAction(m.idDetalle)}
          disabled={isLoading || removingMaterialId === m.idDetalle}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--error, #ef4444)',
            padding: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            opacity: removingMaterialId === m.idDetalle ? 0.5 : 1
          }}
          title="Remover material"
        >
          <Trash2 size={15} />
        </button>
      )
    }] : [])
  ];

  const costColumns: Column<CostoAdicional>[] = [
    {
      header: 'Concepto',
      accessor: 'concepto',
      id: 'concepto'
    },
    {
      header: 'Cantidad',
      accessor: 'cantidad',
      isNumeric: true,
      id: 'cantidad'
    },
    {
      header: 'Costo Unit.',
      id: 'costoUnitario',
      accessor: (c) => `$${parseFloat(c.costoUnitario as any).toFixed(2)}`,
      isNumeric: true,
    },
    {
      header: 'Total',
      id: 'total',
      accessor: (c) => (
        <span style={{
          color: String(c.idCosto).startsWith('temp_') ? 'var(--warning, #f59e0b)' : 'inherit'
        }}>
          ${parseFloat(c.total as any).toFixed(2)}
        </span>
      ),
      isNumeric: true,
      className: 'wo-table__bold',
    },
    ...(onRemoveCost ? [{
      header: 'Acciones',
      id: 'acciones',
      accessor: (c: CostoAdicional) => (
        <button
          type="button"
          onClick={() => handleRemoveCostAction(c.idCosto)}
          disabled={isLoading || removingCostId === c.idCosto}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--error, #ef4444)',
            padding: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            opacity: removingCostId === c.idCosto ? 0.5 : 1
          }}
          title="Remover costo"
        >
          <Trash2 size={15} />
        </button>
      )
    }] : [])
  ];

  return (
    <Card title="Materiales y Costos" className="wo-detail-card">

      {/* Materiales */}
      {(combinedMats.length > 0 || onSaveMaterialsBatch) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="wo-table-section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div className="wo-table-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Package size={14} /> Materiales Utilizados
            </div>
            {pendingMats.length > 0 && onSaveMaterialsBatch && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveMaterials}
                disabled={isLoading}
                style={{ background: '#3b82f6' }}
              >
                Guardar {pendingMats.length} Material(es)
              </Button>
            )}
          </div>
          {combinedMats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay materiales registrados.</p>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <Table
                data={combinedMats}
                columns={matColumns}
                pagination={false}
                showColumnModal={false}
                showTotalRecords={false}
                showRowsPerPage={false}
                totalRows={[
                  { label: 'Total materiales', value: `$${calculatedTotalMateriales.toFixed(2)}`, columnId: 'subtotal' }
                ]}
              />
            </div>
          )}

          {/* Formulario Inline para registrar material */}
          {onSaveMaterialsBatch && (
            <div className="wo-materials-inline-form-box" style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <form onSubmit={handleMaterialSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Material *</label>
                  <SearchableSelect
                    value={materialId}
                    onChange={handleMaterialChange}
                    options={inventoryOptions}
                    placeholder={state.isLoading ? "Cargando inventario..." : "Buscar material..."}
                    disabled={isLoading || state.isLoading}
                    size="compact"
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Cant *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="wo-modal-input"
                    style={{ height: '34px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
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
                    style={{ height: '34px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                    placeholder="Ej: 5.50"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Subtotal</label>
                  <div style={{ height: '34px', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                    ${matSubtotal.toFixed(2)}
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="xs"
                  disabled={!materialId || !materialQty || !materialCost || isLoading}
                  leftIcon={<Plus size={12} />}
                  style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#f59e0b' }}
                >
                  Agregar
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Costos adicionales */}
      {(combinedCosts.length > 0 || onSaveCostsBatch) && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="wo-table-section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
            <div className="wo-table-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <DollarSign size={14} /> Costos Adicionales
            </div>
            {pendingCosts.length > 0 && onSaveCostsBatch && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveCosts}
                disabled={isLoading}
                style={{ background: '#10b981' }}
              >
                Guardar {pendingCosts.length} Costo(s)
              </Button>
            )}
          </div>
          {combinedCosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay costos adicionales registrados.</p>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <Table
                data={combinedCosts}
                columns={costColumns}
                pagination={false}
                showColumnModal={false}
                showTotalRecords={false}
                showRowsPerPage={false}
                totalRows={[
                  { label: 'Total adicionales', value: `$${calculatedTotalAdicionales.toFixed(2)}`, columnId: 'total' }
                ]}
              />
            </div>
          )}

          {/* Formulario Inline para registrar costo adicional */}
          {onSaveCostsBatch && (
            <div className="wo-costs-inline-form-box" style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <form onSubmit={handleCostSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1fr 1fr auto', gap: '0.6rem', alignItems: 'end' }}>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Concepto *</label>
                  <input
                    type="text"
                    className="wo-modal-input"
                    style={{ height: '34px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
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
                    style={{ height: '34px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
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
                    style={{ height: '34px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={costUnit}
                    onChange={(e) => setCostUnit(e.target.value)}
                    placeholder="Ej: 15.00"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Total</label>
                  <div style={{ height: '34px', display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                    ${costSubtotal.toFixed(2)}
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="xs"
                  disabled={!costConcept.trim() || !costQty || !costUnit || isLoading}
                  leftIcon={<Plus size={12} />}
                  style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#10b981' }}
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
          <span className="wo-cost-total__value">${calculatedTotalOrden.toFixed(2)}</span>
        </div>
      )}

    </Card>
  );
};

export const WorkOrderMaterialsCard: React.FC<WorkOrderMaterialsCardProps> = (props) => {
  return (
    <InventoryProvider>
      <WorkOrderMaterialsCardInner {...props} />
    </InventoryProvider>
  );
};
