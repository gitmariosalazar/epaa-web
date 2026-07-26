import React from 'react';
import {
  Package,
  Wrench,
  ShieldCheck,
  FileText,
  Download
} from 'lucide-react';
import type {
  TrabajadorAsignado,
  MaterialUtilizado,
  CostoAdicional,
  AdjuntoEvidencia
} from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import './InspectionDetailsPanel.css';

interface InspectionDetailsPanelProps {
  materiales: MaterialUtilizado[];
  costosAdicionales: CostoAdicional[];
  personalAsignado: TrabajadorAsignado[];
  adjuntos: AdjuntoEvidencia[];
}

export const InspectionDetailsPanel: React.FC<InspectionDetailsPanelProps> = ({
  materiales,
  costosAdicionales,
  personalAsignado,
  adjuntos
}) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const totalMaterials = materiales.reduce((acc, m) => acc + (m.subtotal || 0), 0);
  const totalAdicionales = costosAdicionales.reduce((acc, c) => acc + (c.total || 0), 0);
  const grandTotal = totalMaterials + totalAdicionales;

  return (
    <div className="inspection-details-panel">

      {/* ── SECTION: MATERIALES Y COSTOS ── */}
      <div className="idp-section">
        <h4 className="idp-section__title">
          <Package size={16} />
          Materiales y Costos
        </h4>

        {materiales.length === 0 && costosAdicionales.length === 0 ? (
          <div className="idp-empty">No hay materiales ni costos registrados.</div>
        ) : (
          <div className="idp-list">
            {materiales.map((m) => (
              <div key={m.idDetalle} className="idp-item">
                <div className="idp-item__info">
                  <span className="idp-item__name">{m.nombreMaterial || 'Material Sin Nombre'}</span>
                  <span className="idp-item__sub">
                    {m.cantidad} ud(s) x {formatCurrency(m.costoUnitario)}
                  </span>
                </div>
                <div className="idp-item__value">{formatCurrency(m.subtotal)}</div>
              </div>
            ))}

            {costosAdicionales.map((c) => (
              <div key={c.idCosto} className="idp-item">
                <div className="idp-item__info">
                  <span className="idp-item__name">{c.concepto}</span>
                  <span className="idp-item__sub">
                    {c.cantidad} ud(s) x {formatCurrency(c.costoUnitario)}
                  </span>
                </div>
                <div className="idp-item__value">{formatCurrency(c.total)}</div>
              </div>
            ))}

            <div className="idp-total">
              <span className="idp-total__label">Total</span>
              <span className="idp-total__value">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION: PERSONAL ASIGNADO ── */}
      <div className="idp-section">
        <h4 className="idp-section__title">
          <Wrench size={16} />
          Personal Asignado
        </h4>

        {personalAsignado.length === 0 ? (
          <div className="idp-empty">No hay personal asignado.</div>
        ) : (
          <div className="idp-list">
            {personalAsignado.map((w) => (
              <div key={w.idTrabajador} className="idp-item idp-item--worker">
                <div className="idp-worker-icon">
                  {w.esResponsable ? (
                    <ShieldCheck size={18} style={{ color: '#6366f1' }} />
                  ) : (
                    <Wrench size={18} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <div className="idp-item__info">
                  <span className="idp-item__name">{w.nombreTrabajador}</span>
                  <span className="idp-item__sub">{w.rol || 'Sin Rol'}</span>
                </div>
                <div className="idp-item__action">
                  {w.esResponsable ? (
                    <ColorChip
                      color="var(--success, #10b981)"
                      label="Responsable"
                      size="xs"
                      variant="soft"
                    />
                  ) : (
                    <ColorChip
                      color="var(--neutral, #6b7280)"
                      label="Operativo"
                      size="xs"
                      variant="soft"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION: EVIDENCIA ── */}
      <div className="idp-section">
        <h4 className="idp-section__title">
          <FileText size={16} />
          Evidencia de Campo
        </h4>

        {adjuntos.length === 0 ? (
          <div className="idp-empty">No hay evidencias adjuntas.</div>
        ) : (
          <div className="idp-grid">
            {adjuntos.map((a) => (
              <a
                key={a.idAdjunto}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="idp-file-card"
              >
                <div className="idp-file-card__icon">
                  <FileText size={24} />
                </div>
                <div className="idp-file-card__info">
                  <span className="idp-file-card__name" title={a.nombreArchivo}>
                    {a.nombreArchivo}
                  </span>
                  <span className="idp-file-card__type">{a.mimeType}</span>
                </div>
                <Download size={14} className="idp-file-card__download" />
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
