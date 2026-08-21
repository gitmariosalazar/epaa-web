import React, { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { MdMyLocation } from 'react-icons/md';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { truncateText } from '@/shared/utils/text/truncate-text';
import type {
  MapRouteFeatureCollection,
  MapFeature
} from '../../../domain/models/map-geojson';
import './AuditMapSidePanel.css';
import { ConverDateTime } from '@/shared/utils/datetime/ConverDate';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { GiPathDistance } from 'react-icons/gi';
import { HiUser } from 'react-icons/hi';

interface AuditMapSidePanelProps {
  geojsonData: MapRouteFeatureCollection | null;
  selectedFeatureId: string | null;
  onSelectFeature: (feature: MapFeature) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number]
) => {
  const R = 6371e3; // metres
  const lat1 = (coord1[1] * Math.PI) / 180;
  const lat2 = (coord2[1] * Math.PI) / 180;
  const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // distance in meters
};

export const AuditMapSidePanel: React.FC<AuditMapSidePanelProps> = ({
  geojsonData,
  selectedFeatureId,
  onSelectFeature,
  collapsed,
  onToggle
}) => {
  const statsContainerRef = useRef<HTMLDivElement>(null);

  const scrollStats = (direction: 'left' | 'right') => {
    if (statsContainerRef.current) {
      const container = statsContainerRef.current;
      const scrollAmount = 150;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const groupedItems = useMemo(() => {
    if (!geojsonData?.features) return [];

    const groups = new Map<
      string,
      { clave_catastral: string; medidor?: any; captura?: any }
    >();

    geojsonData.features.forEach((f, originalIndex) => {
      const type = f.properties.tipo;
      // Tratar punto_inicio y punto_final como capturas
      const isCaptura =
        type === 'captura' || type === 'punto_inicio' || type === 'punto_final';
      const isMedidor = type === 'medidor';

      if (!isMedidor && !isCaptura) return;

      const cc = f.properties.clave_catastral;
      if (!cc) return;

      if (!groups.has(cc)) {
        groups.set(cc, { clave_catastral: cc });
      }

      const group = groups.get(cc)!;
      if (isMedidor) {
        group.medidor = { ...f, originalIndex };
      } else {
        group.captura = { ...f, originalIndex };
      }
    });

    return Array.from(groups.values());
  }, [geojsonData]);

  const countMeters = groupedItems.filter((g) => g.medidor).length;
  const countCaptures = groupedItems.filter((g) => g.captura).length;
  const { countInside, countOutside } = useMemo(() => {
    let inside = 0;
    let outside = 0;
    groupedItems.forEach((g) => {
      if (
        g.medidor?.geometry?.type === 'Point' &&
        g.captura?.geometry?.type === 'Point'
      ) {
        const dist = Number(
          calculateDistance(
            g.medidor.geometry.coordinates as [number, number],
            g.captura.geometry.coordinates as [number, number]
          )
        );
        if (dist < 15) {
          inside++;
        } else {
          outside++;
        }
      }
    });
    return { countInside: inside, countOutside: outside };
  }, [groupedItems]);

  // A rough estimate of route lines
  const countRoutes =
    geojsonData?.features.filter((f) => f.geometry.type === 'LineString')
      .length || 0;

  return (
    <div className={`audit-side-panel ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="audit-side-panel-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <>
          <div className="audit-side-panel-header-container">
            <div className="audit-side-panel-header">
              <MapPin size={16} className="audit-side-panel-icon" />
              <span className="audit-side-panel-title">Puntos de Lectura</span>
              <span className="audit-side-panel-count">
                {groupedItems.length}
              </span>
            </div>

            <div className="audit-side-panel-stats-wrapper">
              <button className="stats-scroll-btn left" onClick={() => scrollStats('left')}>
                <ChevronLeft size={16} />
              </button>

              <div className="audit-side-panel-stats" ref={statsContainerRef}>
                <Tooltip content="Total de medidores registrados" position="bottom" followCursor={false}
                  themeColor='info'
                >
                  <div className="audit-stat-pill stat-meters">
                    <span>{countMeters}</span>
                    <label>Medidores</label>
                  </div>
                </Tooltip>

                <Tooltip content="Total de lecturas registradas" position="bottom" followCursor={false}
                  themeColor='info'
                >
                  <div className="audit-stat-pill stat-captures">
                    <span>{countCaptures}</span>
                    <label>Capturas</label>
                  </div>
                </Tooltip>

                <Tooltip content="Total de lecturas dentro del rango" position="bottom" followCursor={false}
                  themeColor='success'
                >
                  <div className="audit-stat-pill stat-inside">
                    <span>{countInside}</span>
                    <label>Dentro</label>
                  </div>
                </Tooltip>

                <Tooltip content="Total de lecturas fuera del rango" position="bottom" followCursor={false}
                  themeColor='error'
                >
                  <div className="audit-stat-pill stat-outside">
                    <span>{countOutside}</span>
                    <label>Fuera</label>
                  </div>
                </Tooltip>

                <Tooltip content="Total de tramos registrados" position="bottom" followCursor={false}
                  themeColor='warning'
                >
                  <div className="audit-stat-pill stat-route">
                    <span>{countRoutes}</span>
                    <label>Tramos</label>
                  </div>
                </Tooltip>
              </div>

              <button className="stats-scroll-btn right" onClick={() => scrollStats('right')}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="audit-side-panel-list">
            {groupedItems.length === 0 && (
              <EmptyState
                message="Ruta vacía"
                description="No hay puntos de auditoría en la ruta seleccionada."
                icon={<MapPin size={24} opacity={0.3} />}
                variant="info"
              />
            )}

            {groupedItems.map((group, idx) => {
              const medidor = group.medidor;
              const captura = group.captura;
              const primaryFeature = captura || medidor;
              if (!primaryFeature) return null;

              const medidorId = medidor
                ? `${medidor.properties.acometida_id || medidor.properties.clave_catastral || ''}-${medidor.properties.tipo}-${medidor.originalIndex}`
                : null;
              const capturaId = captura
                ? `${captura.properties.acometida_id || captura.properties.clave_catastral || ''}-${captura.properties.tipo}-${captura.originalIndex}`
                : null;

              const isSelected =
                selectedFeatureId === medidorId ||
                selectedFeatureId === capturaId;

              const captureProps = captura?.properties || {};
              const medidorProps = medidor?.properties || {};

              let distance: string | null = null;
              if (
                medidor?.geometry?.type === 'Point' &&
                captura?.geometry?.type === 'Point'
              ) {
                distance = calculateDistance(
                  medidor.geometry.coordinates as [number, number],
                  captura.geometry.coordinates as [number, number]
                );
              }

              const dotColor =
                captureProps['marker-color'] ||
                medidorProps['marker-color'] ||
                '#3b82f6';
              const hasWarning = captureProps.novedad || medidorProps.novedad;
              const warningText = captureProps.novedad || medidorProps.novedad;

              const color = distance && Number(distance) < 15 ? 'green' : 'red';

              return (
                <div
                  key={`${group.clave_catastral}-${idx}`}
                  className={`audit-item-container ${isSelected ? 'is-selected' : ''}`}
                  onClick={() =>
                    onSelectFeature({
                      ...primaryFeature,
                      id: capturaId || medidorId
                    } as any)
                  }
                >
                  <div className="audit-item-bottom">
                    <div>
                      <div className="audit-item-dot-content">
                        <div
                          className="audit-item-dot"
                          style={{ background: dotColor }}
                        />
                        <div className="audit-item-body">
                          <span className="audit-item-meter">
                            {medidorProps.numero_medidor
                              ? truncateText(medidorProps.numero_medidor, 18)
                              : 'Acometida & Lectura'}
                          </span>
                          <span className="audit-item-client">
                            CC: {group.clave_catastral}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="audit-item-main-info"
                      style={{ alignItems: 'flex-end' }}
                    >
                      <Tooltip
                        content={`Distancia: ${distance} m`}
                        position="top"
                        variant="soft"
                        themeColor={color}
                        followCursor={false}
                      >
                        <ColorChip
                          color={color}
                          label={`${distance} m`}
                          size="xs"
                          icon={<GiPathDistance size={16} />}
                        />
                      </Tooltip>
                      {captureProps.fecha_lectura && (
                        <Tooltip
                          content={`Fecha de lectura: ${captureProps.fecha_lectura}`}
                          position="top"
                          variant="soft"
                          followCursor={false}
                        >
                          <span className="audit-item-time">
                            {ConverDateTime(captureProps.fecha_lectura).split(
                              ' '
                            )[1] || captureProps.fecha_lectura}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {hasWarning && (
                    <div
                      className="audit-item-address"
                      style={{ padding: '4px' }}
                    >
                      <ColorChip
                        label={warningText}
                        color={getNoveltyColor(warningText || 'NOT_READ')}
                        size="xs"
                        borderRadius="10px"
                        variant="soft"
                      />
                    </div>
                  )}

                  <Divider variant="dashed" thickness="thin" />

                  <div
                    className="audit-action-buttons"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      marginTop: '4px'
                    }}
                  >
                    <div
                      className="audit-actions-left"
                      style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                    >
                      <span
                        className="audit-item-badge"
                        style={{
                          background: captura
                            ? 'rgba(16,185,129,0.1)'
                            : 'rgba(239,68,68,0.1)',
                          color: captura ? '#10b981' : '#ef4444'
                        }}
                      >
                        Captura {captura ? '✓' : '✗'}
                      </span>
                      <span
                        className="audit-item-badge"
                        style={{
                          background: medidor
                            ? 'rgba(59,130,246,0.1)'
                            : 'rgba(239,68,68,0.1)',
                          color: medidor ? '#3b82f6' : '#ef4444'
                        }}
                      >
                        Acometida {medidor ? '✓' : '✗'}
                      </span>
                      {captureProps.usuario_lectura && (
                        <Tooltip
                          content={`Lectura realizada por el usuario: ${captureProps.usuario_lectura}`}
                          position="bottom"
                          variant="soft"
                          followCursor={false}
                        >
                          <ColorChip
                            label={captureProps.usuario_lectura}
                            size="xs"
                            borderRadius={10}
                            variant="ghost"
                            icon={<HiUser size={18} />}
                            color="gray"

                          />
                        </Tooltip>
                      )}
                    </div>

                    <div className="audit-actions-right">
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
                            onSelectFeature({
                              ...primaryFeature,
                              id: capturaId || medidorId
                            } as any);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
