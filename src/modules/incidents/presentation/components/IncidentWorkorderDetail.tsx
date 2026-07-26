/**
 * WorkOrderInfoCard
 *
 * SRP: información general de la OT (tipo, departamento, dirección, cliente).
 */
import React from 'react';
import { MapPin, Building2, Wrench, User, Hash, Users, Package, ShieldCheck, FileText } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { AdjuntoEvidencia, CostoAdicional, MaterialUtilizado, OrdenTrabajoDetalle, TrabajadorAsignado } from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import { TIPO_ASIGNACION_LABELS } from '@/modules/work-orders/presentation/components/WorkOrderConfig';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

import { EvidenceFiles } from '@/shared/files';

interface IncidentWorkorderDetailProps {
  orden: OrdenTrabajoDetalle;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="wo-info-row">
    <span className="wo-info-row__icon">{icon}</span>
    <span className="wo-info-row__label">{label}</span>
    <span className="wo-info-row__value">{value || '—'}</span>
  </div>
);

// Helper to extract true filename from backend URLs that might end in /preview or /download
const getFilenameFromUrl = (url: string, fallback: string) => {
  if (!url) return fallback;
  try {
    const parts = url.split('?')[0].split('/').filter(Boolean);
    if (parts[parts.length - 1] === 'preview' || parts[parts.length - 1] === 'download') {
      parts.pop();
    }
    return parts.pop() || fallback;
  } catch {
    return fallback;
  }
};

export const IncidentWorkorderDetail: React.FC<IncidentWorkorderDetailProps> = ({ orden }) => {
  const tipoAsignacionLabel =
    TIPO_ASIGNACION_LABELS[orden.tipoAsignacion] ?? orden.tipoAsignacion;

  const ejecutorLabel =
    false
      ? orden.inspectorNombre ?? '—'
      : orden.inspectorNombre
        ? `${orden.inspectorNombre} (${orden.inspectorUsername ?? '—'})`
        : 'Sin asignar';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const materiales: MaterialUtilizado[] = orden.materiales;
  const costosAdicionales: CostoAdicional[] = orden.costosAdicionales;
  const personalAsignado: TrabajadorAsignado[] = orden.personalAsignado;
  const adjuntos: AdjuntoEvidencia[] = orden.adjuntos;

  const totalMaterials = materiales.reduce((acc, m) => acc + (m.subtotal || 0), 0);
  const totalAdicionales = costosAdicionales.reduce((acc, c) => acc + (c.total || 0), 0);
  const grandTotal = totalMaterials + totalAdicionales;

  return (
    <div className="incident-modal-left-inner">
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={14} />
            Información General
          </span>
          <div className="order-code">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              N° Orden: <strong style={{ marginLeft: '0.5rem', color: '#6366f1' }}>{orden.codigoOrden}</strong>
            </span>
          </div>
        </div>
      } className="wo-detail-card">
        <div className="wo-info-grid">
          <InfoRow
            icon={<Wrench size={14} />}
            label="Tipo de Trabajo"
            value={orden.tipoTrabajoDescripcion ?? orden.tipoTrabajo}
          />
          <InfoRow
            icon={<Building2 size={14} />}
            label="Departamento"
            value={orden.departamento}
          />
          <InfoRow
            icon={<Hash size={14} />}
            label="Origen"
            value={orden.origenLabel ?? orden.origen}
          />
          {orden.descripcion && (
            <InfoRow
              icon={<Hash size={14} />}
              label="Descripción"
              value={orden.descripcion}
            />
          )}

          <div className="wo-info-section-title">Ubicación</div>

          {orden.direccion && (
            <InfoRow
              icon={<MapPin size={14} />}
              label="Dirección"
              value={orden.direccion}
            />
          )}
          {orden.claveCatastral && (
            <InfoRow
              icon={<Hash size={14} />}
              label="Clave Catastral"
              value={orden.claveCatastral}
            />
          )}
          {orden.latitud != null && orden.longitud != null && (
            <InfoRow
              icon={<MapPin size={14} />}
              label="Coordenadas"
              value={`${orden.latitud.toFixed(6)}, ${orden.longitud.toFixed(6)}`}
            />
          )}
          {orden.ubicacionDetalles && (
            <InfoRow
              icon={<MapPin size={14} />}
              label="Detalles Ubicación"
              value={orden.ubicacionDetalles}
            />
          )}

          <InfoRow
            icon={<User size={14} />}
            label="Tipo Asignación"
            value={tipoAsignacionLabel}
          />
          <InfoRow
            icon={<User size={14} />}
            label="Ejecutor"
            value={ejecutorLabel}
          />
          {orden.personalAsignado && orden.personalAsignado.length > 0 && (
            <InfoRow
              icon={<Users size={14} />}
              label="Personal Asignado"
              value={
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.15rem' }}>
                  {orden.personalAsignado.map((w) => (
                    <span
                      key={w.idTrabajador}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: '#6366f1',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 500,
                      }}
                    >
                      {w.nombreTrabajador}
                      {w.esResponsable && (
                        <span style={{ fontSize: '0.62rem', marginLeft: '0.25rem', opacity: 0.8 }}>
                          (Resp.)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              }
            />
          )}
          {orden.idCliente && (
            <InfoRow
              icon={<User size={14} />}
              label="Cliente"
              value={orden.idCliente}
            />
          )}
        </div>



      </Card>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
            {adjuntos.map((a) => {
              const realFilename = getFilenameFromUrl(a.url, a.nombreArchivo);
              return (
                <div key={a.idAdjunto} style={{ width: 90, height: 90, position: 'relative', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <EvidenceFiles
                    fileId={a.idAdjunto}
                    filePath={realFilename}
                    category="work_orders"
                    type="OT"
                    allowDownload={true}
                    className="incident-evidence-thumb"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
