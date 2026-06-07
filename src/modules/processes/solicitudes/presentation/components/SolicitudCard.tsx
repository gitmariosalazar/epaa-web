/**
 * SolicitudCard — expandable card with document preview.
 *
 * SRP: renders one solicitud. Expand state is local (no context).
 * DIP: receives onView and document preview handler as props.
 * OCP: new expand fields → extend render; no parent changes needed.
 */
import React, { useState } from 'react';
import type { Solicitud } from '../../domain/models/Solicitud';
import {
  getEstadoConfig,
  TIPO_ACOMETIDA_LABELS,
  TIPO_PERSONA_LABELS,
  USO_PREDIO_LABELS
} from './SolicitudConfig';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { SolicitudDocumentPreviewModal } from './SolicitudDocumentPreviewModal';
import { SolicitudDocRow } from './detail/SolicitudDocRow';
import {
  Droplets,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  User,
  FileText,
  Eye,
  Timer,
  ChevronDown,
  ChevronUp,
  Building,
  Hash,
  Navigation,
  Layers,
  FolderOpen,
  Info,
  Home,
  LucideClipboardType,
  Mail,
  Phone,
  ListIcon
} from 'lucide-react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { RiKey2Fill } from 'react-icons/ri';
import { Button } from '@/shared/presentation/components/Button/Button';

// ── Icon per tipo acometida ────────────────────────────────────────────────
const TIPO_ICON: Record<string, React.ReactNode> = {
  AGUA_POTABLE: <Droplets size={20} />,
  ALCANTARILLADO: <Droplets size={20} />,
  NUEVA_ACOMETIDA: <Droplets size={20} />,
  CAMBIO_TITULAR: <User size={20} />,
  SUSPENSION_SERVICIO: <XCircle size={20} />,
  SUSPENSION_SERVICIO_POTABLE: <XCircle size={20} />,
  BENEFICIO_TERCERA_EDAD: <CheckCircle size={20} />,
  BENEFICIO_DISCAPACIDAD: <CheckCircle size={20} />
};

const ESTADO_ICON: Record<string, React.ReactNode> = {
  en_proceso: <Clock size={11} />,
  aprobada: <CheckCircle size={11} />,
  rechazada: <XCircle size={11} />,
  completada: <CheckCircle size={11} />,
  pendiente: <Timer size={11} />
};



interface SolicitudCardProps {
  solicitud: Solicitud;
  onView: (id: string) => void;
  style?: React.CSSProperties;
}

export const SolicitudCard: React.FC<SolicitudCardProps> = ({
  solicitud,
  onView,
  style
}) => {
  const [expanded, setExpanded] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  const estado = getEstadoConfig(solicitud.estado);
  const tipoLabel =
    TIPO_ACOMETIDA_LABELS[solicitud.tipoAcometida] ?? solicitud.tipoAcometida;
  const personaLabel =
    TIPO_PERSONA_LABELS[solicitud.tipoPersona] ?? solicitud.tipoPersona;
  const usoLabel =
    USO_PREDIO_LABELS[solicitud.usoPredio] ?? solicitud.usoPredio;
  const tipoIcon = TIPO_ICON[solicitud.tipoAcometida] ?? <FileText size={20} />;
  const estadoIcon = ESTADO_ICON[solicitud.estado] ?? <Clock size={11} />;

  const fechaStr = solicitud.fechaSolicitud
    ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    : '—';

  const updatedStr = solicitud.updatedAt
    ? new Date(solicitud.updatedAt).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '—';

  const titular =
    solicitud.datosAdicionales?.nombres && solicitud.datosAdicionales?.apellidos
      ? `${solicitud.datosAdicionales.nombres} ${solicitud.datosAdicionales.apellidos}`
      : solicitud.clienteId;

  // datosAdicionales pills (only non-null, non-empty)
  const datosExtra = Object.entries(solicitud.datosAdicionales ?? {})
    .filter(([k]) => !['nombres', 'apellidos'].includes(k))
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${String(v)}`);

  const hasDocuments = solicitud.documentos?.length > 0;

  const toggleExpand = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <div
        className={`sol-card sol-card--expandable${expanded ? ' sol-card--open' : ''}`}
        style={
          {
            '--sol-accent': estado.cardAccent,
            '--sol-icon-bg': estado.iconBg,
            '--sol-icon-color': estado.iconColor,
            ...style
          } as React.CSSProperties
        }
        role="article"
        aria-label={`Solicitud ${solicitud.solicitudNumero}`}
      >
        {/* ══ MAIN ROW ══ */}
        <div
          className="sol-card__main-row"
          onClick={toggleExpand}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleExpand(e)}
        >
          {/* Left icon */}
          <div className="sol-card__icon">{tipoIcon}</div>

          {/* Body */}
          <div className="sol-card__body">
            {/* Row 1: number + chips */}
            <div className="sol-card__top">
              <span className="sol-card__num">{solicitud.solicitudNumero}</span>

              <Tooltip
                content='Estado de la Solicitud'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  color={estado.color}
                  label={estado.label}
                  icon={estadoIcon}
                  variant="soft"
                  size="xs"
                  borderRadius={5}
                />
              </Tooltip>

              <Tooltip
                content='Tipo de Solicitud'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  label={tipoLabel}
                  variant="soft"
                  size="xs"
                  color="var(--text-secondary)"
                  borderRadius={5}
                  icon={<LucideClipboardType size={12} color="#0893b2ff" />}
                />
              </Tooltip>

              <Tooltip
                content='Tipo de Cliente'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  label={personaLabel}
                  variant="soft"
                  size="xs"
                  color="var(--text-muted)"
                  borderRadius={5}
                  icon={<User size={10} />}
                />
              </Tooltip>

              {solicitud.diasEnProceso != null && (
                <Tooltip
                  content='Días en Proceso'
                  position='bottom'
                  themeColor='info'
                >
                  <ColorChip
                    label={(solicitud.diasEnProceso ?? 0) > 1 ? `${solicitud.diasEnProceso} días` : '1 día'}
                    icon={<Timer size={10} color="#0893b2ff" />}
                    variant="soft"
                    size="xs"
                    color="var(--text-muted)"
                    borderRadius={5}
                  />
                </Tooltip>
              )}
            </div>

            {/* Row 2: meta */}
            <div className="sol-card__meta">
              <Tooltip
                content='Titular de la Solicitud'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  label={<strong>{titular}</strong>}
                  icon={<User size={12} color="#65a30d" />}
                  variant="ghost"
                  size="xs"
                  color="var(--text-main)"
                  borderRadius={5}
                />
              </Tooltip>
              {solicitud.direccion && (
                <Tooltip
                  content='Dirección'
                  position='bottom'
                  themeColor='info'
                  followCursor
                >
                  <ColorChip
                    label={solicitud.direccion === 'null' || solicitud.direccion === null || solicitud.direccion.trim() === '' ? 'Sin Asignar' : solicitud.direccion}
                    icon={<MapPin size={12} color="#b23808ff" />}
                    variant="soft"
                    size="xs"
                    color="var(--text-secondary)"
                    borderRadius={5}
                  />
                </Tooltip>
              )}
              {solicitud.claveCatastral && (
                <Tooltip
                  content='Clave Catastral'
                  position='bottom'
                  themeColor='info'
                >
                  <ColorChip
                    label={solicitud.claveCatastral === 'null' || solicitud.claveCatastral === null || solicitud.claveCatastral.trim() === '' ? 'Sin Asignar' : solicitud.claveCatastral}
                    icon={<RiKey2Fill size={12} color="#0860b2ff" />}
                    variant="soft"
                    size="xs"
                    color="var(--text-secondary)"
                    borderRadius={5}

                  />
                </Tooltip>
              )}

              <Tooltip
                content='Fecha de Solicitud'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  label={fechaStr}
                  icon={<Calendar size={12} color="#0891b2" />}
                  variant="ghost"
                  size="xs"
                  color="var(--text-secondary)"
                  borderRadius={5}
                />
              </Tooltip>

              <Tooltip
                content='Tarifa (Uso)'
                position='bottom'
                themeColor='info'
              >
                <ColorChip
                  label={usoLabel}
                  variant="soft"
                  size="xs"
                  color="var(--text-muted)"
                  borderRadius={5}
                  icon={<Hash size={12} color="#0891b2" />}
                />
              </Tooltip>
            </div>
          </div>

          {/* Actions */}
          <div
            className="sol-card__actions"
            onClick={(e) => e.stopPropagation()}
          >
            {hasDocuments && (
              <Button
                variant="outline"
                color='green'
                onClick={() => setDocsOpen(true)}
                leftIcon={<FolderOpen size={14} />}
                size='xs'
              >
                Documentos ({solicitud.documentos.length})
              </Button>
            )}

            <Button
              onClick={() => onView(solicitud.solicitudId)}
              id={`btn-ver-sol-${solicitud.solicitudId}`}
              variant="dashed"
              leftIcon={<Eye size={14} />}
              size='xs'
            > Ver Expediente
            </Button>

            {/* Expand toggle */}
            <Button
              className={`sol-card__expand-btn${expanded ? ' sol-card__expand-btn--open' : ''}`}
              onClick={toggleExpand}
              title={expanded ? 'Colapsar' : 'Expandir información'}
              aria-expanded={expanded}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>

        {/* ══ EXPAND PANEL ══ */}
        <div
          className={`sol-card__expand-panel${expanded ? ' sol-card__expand-panel--open' : ''}`}
        >
          <div className="sol-card__expand-inner">
            {/* Col 1: Ubicación */}
            <div className="sol-expand__group">
              <span className="sol-expand__label">
                <MapPin
                  size={10}
                  style={{ display: 'inline', marginRight: 3 }}
                />
                Ubicación
              </span>
              {solicitud.direccion && (
                <span className="sol-expand__value">{solicitud.direccion}</span>
              )}
              {solicitud.claveCatastral && (
                <span className="sol-expand__value">
                  <FileText
                    size={10}
                    style={{ display: 'inline', marginRight: 3 }}
                  />
                  Clave Catastral: <strong>{solicitud.claveCatastral}</strong>
                </span>
              )}
              {solicitud.coordenadas && (
                <span
                  className="sol-expand__value"
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                >
                  <Navigation
                    size={10}
                    style={{ display: 'inline', marginRight: 3 }}
                  />
                  {solicitud.coordenadas}
                </span>
              )}
            </div>

            {/* Col 2: Trámite */}
            <div className="sol-expand__group">
              <span className="sol-expand__label">
                <Info size={10} style={{ display: 'inline', marginRight: 3 }} />
                Trámite
              </span>
              <span className="sol-expand__value">{tipoLabel}</span>
              <span className="sol-expand__value">
                <Home size={10} style={{ display: 'inline', marginRight: 3 }} />
                Uso: <strong>{usoLabel}</strong>
              </span>
              <span className="sol-expand__value">
                <Building
                  size={10}
                  style={{ display: 'inline', marginRight: 3 }}
                />
                Tipo persona: <strong>{personaLabel}</strong>
              </span>
              {solicitud.analistaUsername && (
                <span className="sol-expand__value">
                  <User
                    size={10}
                    style={{ display: 'inline', marginRight: 3 }}
                  />
                  Analista: <strong>{solicitud.analistaNombre?.toUpperCase()}</strong>
                </span>
              )}
            </div>

            {/* Col 3: Fechas + datos adicionales */}
            <div className="sol-expand__group">
              <span className="sol-expand__label">
                <Calendar
                  size={10}
                  style={{ display: 'inline', marginRight: 3 }}
                />
                Fechas
              </span>
              <span className="sol-expand__value">
                Solicitud: <strong>{fechaStr}</strong>
              </span>
              <span className="sol-expand__value">
                Actualización: <strong>{updatedStr}</strong>
              </span>

              {datosExtra.length > 0 && (
                <>
                  <span
                    className="sol-expand__label"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Layers
                      size={10}
                      style={{ display: 'inline', marginRight: 3 }}
                    />
                    Datos adicionales
                  </span>
                  <div className="sol-expand__pills">
                    {datosExtra.map((dato, i) => (
                      <ColorChip
                        label={dato}
                        variant="soft"
                        size="xs"
                        key={i}
                        color={
                          dato.includes('email')
                            ? '#3b82f6'
                            : dato.includes('telefono')
                              ? 'teal'
                              : dato.includes('referencia')
                                ? 'cyan'
                                : 'var(--text-muted)'
                        }
                        borderRadius={5}
                        icon={
                          dato.includes('email') ? (
                            <Mail size={12} />
                          ) : dato.includes('telefono') ? (
                            <Phone size={12} />
                          ) : dato.includes('referencia') ? (
                            <ListIcon size={12} />
                          ) : null
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Col 4: Documentos mini-list (full width if 3 cols + spans) */}
            {hasDocuments && (
              <div
                className="sol-expand__group"
                style={{ gridColumn: '1 / -1' }}
              >
                <span className="sol-expand__label">
                  <FileText
                    size={10}
                    style={{ display: 'inline', marginRight: 3 }}
                  />
                  Documentos adjuntos ({solicitud.documentos.length})
                </span>
                <div className="sol-expand__docs">
                  {solicitud.documentos.map((doc) => (
                    <SolicitudDocRow
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setDocsOpen(true);
                      }}
                    />
                  ))}
                </div>
                <button
                  className="sol-expand__docs-btn"
                  onClick={() => {
                    setSelectedDocId(undefined);
                    setDocsOpen(true);
                  }}
                >
                  <FolderOpen size={14} /> Ver documentos en pantalla completa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ DOCUMENT PREVIEW MODAL ══ */}
      {docsOpen && (
        <SolicitudDocumentPreviewModal
          isOpen={docsOpen}
          onClose={() => {
            setDocsOpen(false);
            setSelectedDocId(undefined);
          }}
          documentos={solicitud.documentos}
          solicitudNumero={solicitud.solicitudNumero}
          solicitudId={solicitud.solicitudId}
          initialActiveId={selectedDocId}
        />
      )}
    </>
  );
};
