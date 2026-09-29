import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useNetworkMapViewModel } from '../../hooks/useNetworkMapViewModel';

import styles from './ScadaDashboardPage.module.css';
import { ScadaMap } from '../../components/Map/ScadaMap';

export const ScadaDashboardPage: React.FC = () => {
  const { geoJsonData, loading, error, fetchMapData } = useNetworkMapViewModel();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>EPAA Network Operations & SCADA</h1>
      </header>

      <div className={styles.content}>
        {loading && <div className={styles.loading}>Loading telemetry...</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.mapContainer}>
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <ScadaMap 
              geoJsonData={geoJsonData} 
              onNodeSelect={setSelectedNode}
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
                <span>Nombre/Código</span>
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
              <button className={styles.actionBtn} onClick={() => setSelectedNode(null)}>Cerrar</button>
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
