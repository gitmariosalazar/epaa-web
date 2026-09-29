import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useNetworkMapViewModel } from '../../hooks/useNetworkMapViewModel';
import { useScadaTelemetryViewModel } from '../../hooks/useScadaTelemetryViewModel';
import { useScadaConnectionDetails } from '../../hooks/useScadaConnectionDetails';
import { Button } from '@/shared/presentation/components/Button/Button';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';

import styles from './ScadaDashboardPage.module.css';
import { ScadaMap } from '../../components/Map/ScadaMap';

export const ScadaDashboardPage: React.FC = () => {
  const { geoJsonData, loading, error, fetchMapData } = useNetworkMapViewModel();
  const { scadaData, loadingScada, errorScada, fetchScadaData } = useScadaTelemetryViewModel();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { theme } = useTheme();

  const { connectionDetails, loadingConnection, errorConnection } = useScadaConnectionDetails(
    selectedNode?.properties?.nodeType === 'CONNECTION' ? selectedNode?.properties?.cadastralKey : null
  );

  useEffect(() => {
    fetchMapData();
    fetchScadaData();
  }, [fetchMapData, fetchScadaData]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Red de Distribución de Agua</h1>
        <Button
          leftIcon={<RefreshCw size={18} className={(loading || loadingScada) ? styles.spin : ''} />}
          onClick={() => { fetchMapData(); fetchScadaData(); }}
          disabled={loading || loadingScada}
          variant="outline"
          size="sm"
        >
          Actualizar
        </Button>
      </header>

      <div className={styles.content}>
        {(loading || loadingScada) && <div className={styles.loading}>Loading telemetry...</div>}
        {(error || errorScada) && <div className={styles.error}>{error || errorScada}</div>}

        <div className={styles.mapContainer}>
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <ScadaMap
              key={theme}
              geoJsonData={geoJsonData}
              onNodeSelect={setSelectedNode}
              selectedNode={selectedNode}
            />
          </APIProvider>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.glassPanel}>
            <h3>SCADA Telemetry (EPAA)</h3>
            <div className={styles.statRow}>
              <span>Estado General</span>
              <span className={styles.highlightGlow}>Óptimo</span>
            </div>
            <div className={styles.statRow}>
              <span>Conexiones Activas</span>
              <span>Online</span>
            </div>
          </div>

          {selectedNode ? (
            <div className={`${styles.glassPanel} ${styles.activePanel}`}>
              <h3>Detalle del Nodo</h3>
              <div className={styles.statRow}>
                <span>Tipo</span>
                <span className={styles.highlightBlue}>{selectedNode.properties.nodeType}</span>
              </div>
              <div className={styles.statRow}>
                <span>Nombre:</span>
                <span>{selectedNode.properties.name || selectedNode.properties.code || 'N/A'}</span>
              </div>
              {selectedNode.properties.cadastralKey && (
                <div className={styles.statRow}>
                  <span>Clave Catastral</span>
                  <span>{selectedNode.properties.cadastralKey}</span>
                </div>
              )}
              {selectedNode.properties.suppliedByTank && (
                <div className={styles.statRow}>
                  <span>Abastecido Por</span>
                  <span className={styles.highlightGlow}>{selectedNode.properties.suppliedByTank}</span>
                </div>
              )}
              {selectedNode.properties.distanceInMeters && (
                <div className={styles.statRow}>
                  <span>Distancia</span>
                  <span>{Math.round(selectedNode.properties.distanceInMeters)} m</span>
                </div>
              )}

              {/* Basic Connection Details */}
              {selectedNode.properties.nodeType === 'CONNECTION' && (
                <>
                  <div style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px dashed var(--border-color)' }}></div>
                  {loadingConnection ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cargando datos del cliente...</div>
                  ) : errorConnection ? (
                    <div style={{ fontSize: '0.8rem', color: '#f87171' }}>{errorConnection}</div>
                  ) : connectionDetails ? (
                    <>
                      <div className={styles.statRow}>
                        <span>Titular</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '65%' }}>
                          {connectionDetails.person ? `${connectionDetails.person.firstName} ${connectionDetails.person.lastName}` : connectionDetails.company ? connectionDetails.company.businessName : 'N/A'}
                        </span>
                      </div>
                      <div className={styles.statRow}>
                        <span>Estado</span>
                        <span className={connectionDetails.connectionStatus === 'ACTIVO' ? styles.statusOk : ''} style={{ fontWeight: 600 }}>
                          {connectionDetails.connectionStatus}
                        </span>
                      </div>
                      <div className={styles.statRow}>
                        <span>Tarifa</span>
                        <span>{connectionDetails.connectionRateName || 'N/A'}</span>
                      </div>
                      {connectionDetails.connectionMeterNumber && (
                        <div className={styles.statRow}>
                          <span>Medidor</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{connectionDetails.connectionMeterNumber}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No se encontraron datos para esta clave.</div>
                  )}
                </>
              )}

              {/* SCADA Telemetry UI for Tanks/Plants and Connections */}
              {(() => {
                const nodeType = selectedNode.properties.nodeType;
                let scadaInfo = null;

                if (['TANK', 'PUMP', 'PLANT'].includes(nodeType) && selectedNode.id) {
                  const nodeIdStr = selectedNode.id.split('_')[1];
                  scadaInfo = scadaData.find((s) => s.tankId.toString() === nodeIdStr);
                } else if (nodeType === 'CONNECTION' && selectedNode.properties.suppliedByTank) {
                  // Muestra el SCADA del tanque que abastece a esta acometida
                  scadaInfo = scadaData.find((s) => s.tankName === selectedNode.properties.suppliedByTank);
                }

                if (!scadaInfo) return null;

                return (
                  <div className={styles.tankFillWidget}>
                    {scadaInfo.levelTelemetry?.percentage !== undefined && (
                      <div className={styles.tankContainer}>
                        <div
                          className={styles.tankFill}
                          style={{ height: `${scadaInfo.levelTelemetry.percentage}%` }}
                        ></div>
                      </div>
                    )}
                    <div className={styles.tankDetails}>
                      {scadaInfo.levelTelemetry && (
                        <div>
                          <div className={styles.tankValue}>
                            {scadaInfo.levelTelemetry.percentage}%
                          </div>
                          <div className={styles.tankLabel}>Nivel de Llenado</div>
                        </div>
                      )}
                      {scadaInfo.flowTelemetry && (
                        <div>
                          <div className={`${styles.tankValue} ${styles.tankValueBlue}`}>
                            {scadaInfo.flowTelemetry.value} {scadaInfo.flowTelemetry.unit}
                          </div>
                          <div className={styles.tankLabel}>Caudal Salida</div>
                        </div>
                      )}
                      {scadaInfo.pressureTelemetry && (
                        <div>
                          <div className={`${styles.tankValue} ${styles.tankValuePurple}`}>
                            {scadaInfo.pressureTelemetry.value} {scadaInfo.pressureTelemetry.unit}
                          </div>
                          <div className={styles.tankLabel}>Presión Media</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <Button className={styles.actionBtn} onClick={() => setSelectedNode(null)} variant="dashed" size="sm">Cerrar</Button>
            </div>
          ) : (
            <div className={styles.glassPanel}>
              <h3>Selección</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                Haz clic en un nodo o enlace en el mapa para ver sus detalles de telemetría.
              </p>
            </div>
          )}
        </aside>

        {/* Legend Panel customized for EPAA (Antonio Ante) */}
        <div className={styles.legendPanel}>
          <div className={styles.legendHeader}>
            <div className={styles.legendCol}>Infraestructura</div>
            <div className={styles.legendCol}>Sistemas</div>
          </div>
          <div className={styles.legendBody}>
            <div className={styles.legendRow}>
              <span className={styles.lineGreen}></span> Red de Distribución Principal
            </div>
            <div className={styles.legendRow}>
              <span className={styles.lineRed}></span> Líneas de Conducción
            </div>
            <div className={styles.legendRow}>
              <span className={styles.lineBlue}></span> Acometidas Domiciliarias
            </div>
            <div className={styles.legendRow}>
              <span className={styles.linePurple}></span> Enlaces Virtuales
            </div>
            <div className={styles.legendRow}>
              <span className={styles.lineCyan}></span> Sectores Hidráulicos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
