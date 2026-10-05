import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from '@react-pdf/renderer';
import { styles as defaultStyles } from './stylesTechnicalDataSheetTemplate';
import type { ConnectionWithoutProperty, PhotoResponse } from '../../../../../domain/models/Connection';
import { decodeEWKBPoint } from '@/shared/utils/geoUtils';
import { environments } from '@/settings/environments/environments';

// Helper to resolve absolute or relative image URLs for react-pdf
const resolveImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath || typeof imagePath !== 'string' || !imagePath.trim()) return null;
  const cleanPath = imagePath.trim();

  if (
    cleanPath.startsWith('http://') ||
    cleanPath.startsWith('https://') ||
    cleanPath.startsWith('data:') ||
    cleanPath.startsWith('blob:')
  ) {
    return cleanPath;
  }

  const filename = cleanPath.split('/').pop() || cleanPath;
  const baseUrl = environments.FILES_URL || environments.API_URL || '';

  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    return `${cleanBase}/files/connection_documents/${encodeURIComponent(filename)}/preview`;
  }

  return `/files/connection_documents/${encodeURIComponent(filename)}/preview`;
};

// Extend the existing styles to include tables, grids and photo cards for the Technical Data Sheet
const styles = StyleSheet.create({
  ...defaultStyles,
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 4,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  col2: {
    width: '50%',
    paddingRight: 5,
    marginBottom: 2,
  },
  col3: {
    width: '33.33%',
    paddingRight: 5,
    marginBottom: 2,
  },
  col1: {
    width: '100%',
    paddingRight: 5,
    marginBottom: 6,
  },
  gridLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    marginBottom: 1,
  },
  gridValue: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#333333',
  },
  photosSection: {
    marginTop: 5,
    marginBottom: 5,
  },
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  photoCard: {
    width: '48.5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 3,
    padding: 5,
    backgroundColor: '#fafafa',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  photoTitle: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    color: '#1a202c',
    textTransform: 'uppercase',
  },
  photoDate: {
    fontSize: 8,
    fontFamily: 'Times-Roman',
    color: '#666666',
  },
  photoFrame: {
    height: 100,
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  photoPlaceholderText: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: '#94a3b8',
    textAlign: 'center',
  },
  photoDescription: {
    fontSize: 8,
    fontFamily: 'Times-Italic',
    color: '#475569',
    marginTop: 3,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 9,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
  },
  tableCell: {
    margin: 4,
    fontSize: 9,
    fontFamily: 'Times-Roman',
    textAlign: 'center',
  }
});

interface Props {
  connections: ConnectionWithoutProperty[];
}

export const TechnicalDataSheetDocument: React.FC<Props> = ({ connections }) => {
  return (
    <Document>
      {connections.map((connection, index) => {
        const person = connection.person;
        const company = connection.company;

        const userName = person
          ? `${person.firstName || ''} ${person.lastName || ''}`.trim()
          : company?.businessName || company?.commercialName || '';

        const userId = person?.personId || company?.ruc || '';
        const userAddress = connection.connectionAddress || person?.address || company?.address || '';
        const cadastralKey = connection.connectionCadastralKey || connection.propertyCadastralKey || '';

        const facadePhotos = connection.photoFacade || [];
        const meterPhotos = connection.photoMeter || [];

        const primaryFacade: PhotoResponse | null = facadePhotos.length > 0 ? facadePhotos[0] : null;
        const primaryMeter: PhotoResponse | null = meterPhotos.length > 0 ? meterPhotos[0] : null;

        const primaryFacadeUrl = resolveImageUrl(primaryFacade?.imagePath);
        const primaryMeterUrl = resolveImageUrl(primaryMeter?.imagePath);

        const extraFacadePhoto: PhotoResponse | null = facadePhotos.length > 1 ? facadePhotos[1] : null;
        const extraMeterPhoto: PhotoResponse | null = meterPhotos.length > 1 ? meterPhotos[1] : null;

        return (
          <Page key={`page-${connection.connectionId}-${index}`} size="A4" style={styles.page}>
            {/* BACKGROUND IMAGE (MARCAS DE COLORES) */}
            <Image src="/sigepaa.png" style={styles.backgroundImage} fixed />

            <View style={styles.contentWrapper}>
              {/* HEADER SPACER FOR ALL PAGES */}
              <View style={styles.headerSpacer} fixed />

              {/* DATE */}
              <Text style={styles.dateText}>Atuntaqui, {new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

              {/* DOCUMENT TITLE */}
              <View style={styles.titleContainer}>
                <Text style={styles.documentTitle}>FICHA TÉCNICA DE ACOMETIDA</Text>
                {connection.connectionAccount && (
                  <Text style={styles.documentControl}>C.C: {connection.connectionId}</Text>
                )}
              </View>

              {/* DATOS DEL USUARIO */}
              <View wrap={false}>
                <Text style={styles.sectionTitle}>1. DATOS DEL USUARIO</Text>
                <View style={styles.grid}>
                  <View style={styles.col1}>
                    <Text style={styles.gridLabel}>Nombres / Razón Social:</Text>
                    <Text style={styles.gridValue}>{userName || 'N/A'}</Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.gridLabel}>Cédula / RUC:</Text>
                    <Text style={styles.gridValue}>{userId || 'N/A'}</Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.gridLabel}>Dirección de Facturación:</Text>
                    <Text style={styles.gridValue}>{userAddress || 'N/A'}</Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.gridLabel}>Teléfonos:</Text>
                    <Text style={styles.gridValue}>
                      {person?.phones?.map(p => p.numero).join(', ') || company?.phones?.map(p => p.numero).join(', ') || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={styles.gridLabel}>Correos Electrónicos:</Text>
                    <Text style={styles.gridValue}>
                      {person?.emails?.map(e => e.email).join(', ') || company?.emails?.map(e => e.email).join(', ') || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* DATOS DE LA ACOMETIDA */}
              <View wrap={false}>
                <Text style={styles.sectionTitle}>2. DATOS DE LA ACOMETIDA</Text>
                <View style={styles.grid}>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Clave Catastral:</Text>
                    <Text style={styles.gridValue}>{cadastralKey || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Cuenta:</Text>
                    <Text style={styles.gridValue}>{connection.connectionAccount || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Sector:</Text>
                    <Text style={styles.gridValue}>{connection.connectionSector || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Zona:</Text>
                    <Text style={styles.gridValue}>{connection.zoneName || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Tarifa:</Text>
                    <Text style={styles.gridValue}>{connection.connectionRateName || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Tipo:</Text>
                    <Text style={styles.gridValue}>{connection.connectionTypeName || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Estado:</Text>
                    <Text style={styles.gridValue}>{connection.connectionStatus || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Número de Medidor:</Text>
                    <Text style={styles.gridValue}>{connection.connectionMeterNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Alcantarillado:</Text>
                    <Text style={styles.gridValue}>{connection.connectionSewerage ? 'Sí' : 'No'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Fecha de Instalación:</Text>
                    <Text style={styles.gridValue}>
                      {connection.connectionInstallationDate ? new Date(connection.connectionInstallationDate).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Número de Habitantes:</Text>
                    <Text style={styles.gridValue}>{connection.connectionPeopleNumber ?? 'N/A'}</Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={styles.gridLabel}>Coordenadas:</Text>
                    <Text style={styles.gridValue}>{connection.connectionCoordinates ? decodeEWKBPoint(connection.connectionCoordinates!)?.lat + ', ' + decodeEWKBPoint(connection.connectionCoordinates!)?.lng : 'N/A'}</Text>
                  </View>
                  <View style={styles.col1}>
                    <Text style={styles.gridLabel}>Referencia de Ubicación:</Text>
                    <Text style={styles.gridValue}>{connection.connectionReference || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* EVIDENCIAS FOTOGRÁFICAS */}
              <View style={styles.photosSection} wrap={false}>
                <Text style={styles.sectionTitle}>3. EVIDENCIAS FOTOGRÁFICAS</Text>
                <View style={styles.photosGrid}>
                  {/* FACHADA CARD */}
                  <View style={styles.photoCard}>
                    <View style={styles.photoHeader}>
                      <Text style={styles.photoTitle}>FOTO DE LA FACHADA</Text>
                      {primaryFacade?.date && (
                        <Text style={styles.photoDate}>
                          {new Date(primaryFacade.date).toLocaleDateString('es-EC')}
                        </Text>
                      )}
                    </View>
                    <View style={styles.photoFrame}>
                      {primaryFacadeUrl ? (
                        <Image src={primaryFacadeUrl} style={styles.photoImage} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Text style={styles.photoPlaceholderText}>Sin evidencia de fachada</Text>
                        </View>
                      )}
                    </View>
                    {primaryFacade?.description && (
                      <Text style={styles.photoDescription}>
                        {primaryFacade.description}
                      </Text>
                    )}
                  </View>

                  {/* MEDIDOR CARD */}
                  <View style={styles.photoCard}>
                    <View style={styles.photoHeader}>
                      <Text style={styles.photoTitle}>FOTO DEL MEDIDOR</Text>
                      {primaryMeter?.date && (
                        <Text style={styles.photoDate}>
                          {new Date(primaryMeter.date).toLocaleDateString('es-EC')}
                        </Text>
                      )}
                    </View>
                    <View style={styles.photoFrame}>
                      {primaryMeterUrl ? (
                        <Image src={primaryMeterUrl} style={styles.photoImage} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Text style={styles.photoPlaceholderText}>Sin evidencia de medidor</Text>
                        </View>
                      )}
                    </View>
                    {primaryMeter?.description && (
                      <Text style={styles.photoDescription}>
                        {primaryMeter.description}
                      </Text>
                    )}
                  </View>
                </View>

                {/* SECUNDARIAS (SI EXISTEN MÁS FOTOS) */}
                {(extraFacadePhoto || extraMeterPhoto) && (
                  <View style={[styles.photosGrid, { marginTop: 4 }]}>
                    {extraFacadePhoto ? (
                      <View style={styles.photoCard}>
                        <View style={styles.photoHeader}>
                          <Text style={styles.photoTitle}>FOTO FACHADA #2</Text>
                          {extraFacadePhoto.date && (
                            <Text style={styles.photoDate}>
                              {new Date(extraFacadePhoto.date).toLocaleDateString('es-EC')}
                            </Text>
                          )}
                        </View>
                        <View style={styles.photoFrame}>
                          {resolveImageUrl(extraFacadePhoto.imagePath) ? (
                            <Image src={resolveImageUrl(extraFacadePhoto.imagePath)!} style={styles.photoImage} />
                          ) : (
                            <View style={styles.photoPlaceholder}>
                              <Text style={styles.photoPlaceholderText}>Sin imagen adicional</Text>
                            </View>
                          )}
                        </View>
                        {extraFacadePhoto.description && (
                          <Text style={styles.photoDescription}>
                            {extraFacadePhoto.description}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={{ width: '48.5%' }} />
                    )}

                    {extraMeterPhoto ? (
                      <View style={styles.photoCard}>
                        <View style={styles.photoHeader}>
                          <Text style={styles.photoTitle}>FOTO MEDIDOR #2</Text>
                          {extraMeterPhoto.date && (
                            <Text style={styles.photoDate}>
                              {new Date(extraMeterPhoto.date).toLocaleDateString('es-EC')}
                            </Text>
                          )}
                        </View>
                        <View style={styles.photoFrame}>
                          {resolveImageUrl(extraMeterPhoto.imagePath) ? (
                            <Image src={resolveImageUrl(extraMeterPhoto.imagePath)!} style={styles.photoImage} />
                          ) : (
                            <View style={styles.photoPlaceholder}>
                              <Text style={styles.photoPlaceholderText}>Sin imagen adicional</Text>
                            </View>
                          )}
                        </View>
                        {extraMeterPhoto.description && (
                          <Text style={styles.photoDescription}>
                            {extraMeterPhoto.description}
                          </Text>
                        )}
                      </View>
                    ) : (
                      <View style={{ width: '48.5%' }} />
                    )}
                  </View>
                )}
              </View>

              {/* LECTURAS RECIENTES */}
              {connection.lastReadings && connection.lastReadings.length > 0 && (
                <View wrap={false}>
                  <Text style={styles.sectionTitle}>4. ÚLTIMAS LECTURAS</Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Mes</Text></View>
                      <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Fecha</Text></View>
                      <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Lect. Ant.</Text></View>
                      <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Lect. Act.</Text></View>
                      <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Consumo</Text></View>
                      <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Novedad</Text></View>
                    </View>
                    {connection.lastReadings.slice(0, 5).map((reading, rIndex) => (
                      <View style={styles.tableRow} key={`reading-${rIndex}`}>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{reading.readingMonth || 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{reading.readingDate ? new Date(reading.readingDate).toLocaleDateString() : 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{reading.readingValuePreview ?? 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{reading.readingValueCurrent ?? 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{(reading.readingValueCurrent !== null && reading.readingValueCurrent !== undefined && reading.readingValuePreview !== null && reading.readingValuePreview !== undefined) ? reading.readingValueCurrent - reading.readingValuePreview : 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{reading.novelty || 'Ninguna'}</Text></View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* HISTORIAL DE MEDIDORES */}
              {connection.historyMeters && connection.historyMeters.length > 0 && (
                <View wrap={false}>
                  <Text style={styles.sectionTitle}>5. HISTORIAL DE MEDIDORES</Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Medidor Anterior</Text></View>
                      <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Medidor Nuevo</Text></View>
                      <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Fecha Instalación</Text></View>
                      <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Estado</Text></View>
                    </View>
                    {connection.historyMeters.slice(0, 5).map((history, hIndex) => (
                      <View style={styles.tableRow} key={`history-${hIndex}`}>
                        <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{history.previousMeter || 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{history.newMeter || 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{history.installationDate ? new Date(history.installationDate).toLocaleDateString() : 'N/A'}</Text></View>
                        <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{history.status || 'N/A'}</Text></View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default TechnicalDataSheetDocument;

