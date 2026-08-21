import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdMyLocation } from 'react-icons/md';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { RADIUS_STATUS_CONFIG, getRadiusStatus } from './ReadingMapInstantTooltip';
import './ReadingMapSidePanel.css';

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReadingMapSidePanelProps {
  /** Lista de lecturas a mostrar. Cuando esté vacío muestra empty state. */
  readings: TakenReadingConnection[];
  /** Lectura actualmente seleccionada */
  selectedReading: TakenReadingConnection | null;
  /** Callback al seleccionar una lectura (para centrar mapa) */
  onSelect: (reading: TakenReadingConnection) => void;
  /** Callback para abrir el detalle de la lectura */
  onViewDetail?: (reading: TakenReadingConnection) => void;
  /** Estado del panel colapsado */
  collapsed: boolean;
  /** Toggle para colapsar/expandir */
  onToggle: () => void;
}

/**
 * ReadingMapSidePanel — SRP: lista lateral de lecturas en la vista mapa.
 * Permite seleccionar una lectura para centrarla en el mapa.
 * OCP: extensible sin modificar (solo agregar props).
 * Equivalente a IncidentMapSidePanel del módulo incidents.
 *
 * NOTA: Los datos de `readings` serán conectados desde el padre (ReadingMapFeature)
 * cuando se integre la vista global de lecturas. Por el momento el componente
 * está listo para recibir la lista.
 */
export const ReadingMapSidePanel: React.FC<ReadingMapSidePanelProps> = ({
  readings,
  selectedReading,
  onSelect,
  onViewDetail,
  collapsed,
  onToggle
}) => {
  const withCapture = readings.filter((r) => r.locationCapture);
  const withoutCapture = readings.filter((r) => !r.locationCapture);

  const insideCount = readings.filter((r) => r.isInsideAllowedRadius === true).length;
  const outsideCount = readings.filter((r) => r.isInsideAllowedRadius === false).length;

  return (
    <div className={`reading-side-panel ${collapsed ? 'collapsed' : ''}`}>
      {/* ── Toggle button ─────────────────────────────────────────────────── */}
      <button
        className="reading-side-panel-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <>
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="reading-side-panel-header-container">
            <div className="reading-side-panel-header">
              <BookOpen size={16} className="reading-side-panel-icon" />
              <span className="reading-side-panel-title">Lecturas en Mapa</span>
              <span className="reading-side-panel-count">{readings.length}</span>
            </div>

            {/* Stats row */}
            <div className="reading-side-panel-stats">
              <div className="reading-stat-pill stat-total">
                <span>{readings.length}</span>
                <label>Total</label>
              </div>
              <div className="reading-stat-pill stat-inside">
                <span>{insideCount}</span>
                <label>Dentro</label>
              </div>
              <div className="reading-stat-pill stat-outside">
                <span>{outsideCount}</span>
                <label>Fuera</label>
              </div>
            </div>
          </div>

          {/* ── List ────────────────────────────────────────────────────── */}
          <div className="reading-side-panel-list">
            {readings.length === 0 && (
              <EmptyState
                message="Sin lecturas para mostrar"
                description="No se han encontrado lecturas con coordenadas para los filtros seleccionados."
                icon={<BookOpen size={24} opacity={0.3} />}
                variant="info"
              />
            )}

            {withCapture.map((reading, idx) => {
              const statusKey = getRadiusStatus(reading.isInsideAllowedRadius);
              const statusCfg = RADIUS_STATUS_CONFIG[statusKey];
              const isSelected =
                selectedReading?.readingId === reading.readingId;

              return (
                <div
                  key={reading.readingId ?? idx}
                  className={`reading-item-container ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(reading)}
                >
                  {/* Main content */}
                  <div className="reading-item-bottom">
                    <div>
                      <div className="reading-item-dot-content">
                        <div
                          className="reading-item-dot"
                          style={{ background: statusCfg.color }}
                        />
                        <div className="reading-item-body">
                          <span className="reading-item-meter">
                            {truncateText(reading.meterNumber, 18)}
                          </span>
                          <span className="reading-item-client">
                            {truncateText(reading.clientName, 22)}
                          </span>
                        </div>
                      </div>

                      {reading.readingCode && (
                        <ColorChip
                          label={reading.readingCode}
                          size="sm"
                          variant="ghost"
                          borderRadius={5}
                        />
                      )}
                    </div>

                    <div className="reading-item-main-info">
                      <span
                        className="reading-item-status"
                        style={{ color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                      {reading.distanceMeters != null && (
                        <span className="reading-item-distance">
                          {reading.distanceMeters.toFixed(1)} m
                        </span>
                      )}
                      <span
                        className="reading-item-type"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {truncateText(reading.readingTypeName, 14)}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="reading-item-address">
                    <p className="reading-item-address-text">
                      {truncateText(reading.address, 55)}
                    </p>
                  </div>

                  <Divider variant="dashed" thickness="thin" />

                  {/* Action buttons */}
                  <div className="reading-action-buttons">
                    <div className="reading-actions-left">
                      <span
                        className="reading-item-badge"
                        style={{
                          background: reading.isInsideAllowedRadius
                            ? 'rgba(16,185,129,0.12)'
                            : reading.isInsideAllowedRadius === false
                              ? 'rgba(239,68,68,0.12)'
                              : 'rgba(107,114,128,0.12)',
                          color: statusCfg.color,
                          border: `1px solid ${statusCfg.color}44`
                        }}
                      >
                        {reading.isInsideAllowedRadius === true ? (
                          <FaCheckCircle size={9} />
                        ) : reading.isInsideAllowedRadius === false ? (
                          <IoIosCloseCircle size={9} />
                        ) : null}
                        {reading.calculatedConsumption ?? '—'} m³
                      </span>
                    </div>

                    <div className="reading-actions-right">
                      {onViewDetail && (
                        <Tooltip
                          themeColor="warning"
                          content="Ver detalle de la lectura"
                          position="bottom"
                          followCursor={false}
                        >
                          <Button
                            variant="dashed"
                            size="xs"
                            leftIcon={<BookOpen size={12} />}
                            circle
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetail(reading);
                            }}
                          />
                        </Tooltip>
                      )}

                      <Tooltip
                        themeColor="warning"
                        content="Centrar en el mapa"
                        position="bottom"
                        followCursor={false}
                      >
                        <Button
                          variant="dashed"
                          color="green"
                          size="xs"
                          leftIcon={<MdMyLocation size={18} />}
                          circle
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(reading);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Readings without coordinates */}
            {withoutCapture.length > 0 && (
              <div className="reading-side-panel-no-coords">
                <span>{withoutCapture.length} sin coordenadas de captura</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
