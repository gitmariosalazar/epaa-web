
import type { InspectionReportResponse } from '@/modules/processes/solicitudes/domain/dto/WorkOrderReportResponse';
import logoEpaa from '@/assets/images/epaa.png';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { colors, styles } from './stylesDetailWorkOrderTemplate';
import type { ClientResponse, CompanyResponse, RequestDetailByClientResponse } from '@/modules/processes/solicitudes/domain/models/Solicitud';

interface Props {
  inspectionReport: InspectionReportResponse;
  requestByClient: RequestDetailByClientResponse;
}

export const InspectionReportDocument: React.FC<Props> = ({ inspectionReport: inspectionReport, requestByClient: requestByClient }) => {
  const dateStr = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const reqDate = inspectionReport.createdAt ? new Date(inspectionReport.createdAt) : new Date();
  const day = reqDate.getDate().toString().padStart(2, '0');
  const month = (reqDate.getMonth() + 1).toString().padStart(2, '0');
  const year = reqDate.getFullYear().toString();

  const reqNumber = inspectionReport.request?.requestNumber || 'S/N';
  const materials = inspectionReport.workOrder?.materials || [];
  const workers = inspectionReport.workOrder?.workers || [];

  const totalMaterials = materials.reduce((acc, m) => acc + Number(m.subtotal || 0), 0);


  const companyClient: CompanyResponse | null = requestByClient.company !== null ? requestByClient.company : null;
  const personClient: ClientResponse | null = requestByClient.company !== null ? null : requestByClient.person;

  console.log('data', inspectionReport);
  console.log('requestByClient', requestByClient);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ========== HEADER ========== */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {logoEpaa && typeof logoEpaa === 'string' && (
              <Image source={logoEpaa} style={styles.logo} />
            )}
            <Text style={styles.companyName}>
              EMPRESA PÚBLICA DE AGUA POTABLE Y {'\n'} ALCANTARILLADO DE ANTONIO ANTE
            </Text>
          </View>
          <Text style={styles.generatedDate}>Generado: {dateStr}</Text>
        </View>

        {/* ========== FOOTER INSTITUCIONAL ========== */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLine}>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeTitle}>Antonio Ante</Text>
              <Text style={styles.footerBadgeSub}>ADMINISTRACIÓN 2023 - 2027</Text>
            </View>
            <Text style={styles.footerInfo}>
              Atuntaqui-Ecuador{'\n'}
              Calle Bolívar y González Suárez esq.{'\n'}
              Telf: (+593) 062 906 823{'\n'}
              www.epaa.gob.ec{'\n'}
            </Text>
          </View>
        </View>

        {/* ========== CABECERA SOLICITUD + ESPECIE ========== */}
        {/* ========== CABECERA SOLICITUD + ESPECIE ========== */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          {/* Izquierda: Especie Valorada */}
          <View style={{
            alignItems: 'center',
            padding: 4,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#7f8c8d',
          }}>
            <Text style={{ fontSize: 7.5, color: '#7f8c8d', letterSpacing: 0.3 }}>
              ESPECIE VALORADA
            </Text>
            <Text style={{
              fontFamily: 'Helvetica-Bold',
              fontSize: 12,
              marginTop: 3,
              color: '#2c3e50',
            }}>
              $ 3,00
            </Text>
          </View>

          {/* Derecha: Solicitud + Número + Fecha (misma fila) */}

          {/* Solicitud */}
          <View style={styles.solicitudWrapper}>
            <View style={styles.solicitudBox}>
              <Text style={styles.solicitudTitle}>SOLICITUD DE SERVICIOS VARIOS</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.labelNumber}>
                N°:{' '}
              </Text>
              <Text style={styles.reqNumber}>{reqNumber}</Text>
            </View>
            <Text style={styles.reqDate}>Fecha de Solicitud: {day}/{month}/{year}</Text>
          </View>
        </View>

        <View style={styles.bannerInspectionMain}>
          <Text style={styles.bannerText}>INFORME DE INSPECCIÓN TÉCNICA</Text>
        </View>

        {/* ========== CONTENIDO ========== */}
        <View>
          {
            companyClient ? (
              <View style={styles.clientInfoContainer} wrap={false}>
                <Text style={styles.clientTitle}>INFORMACIÓN DEL SOLICITANTE</Text>
                <View style={styles.clientInfoRow}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>CLIENTE:</Text>
                    <Text style={styles.clientInfoValue}>{companyClient?.businessName || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>C.I. / RUC:</Text>
                    <Text style={styles.clientInfoValue}>{companyClient?.ruc || 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.clientInfoRow, { marginBottom: 0 }]}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>DIRECCIÓN:</Text>
                    <Text style={styles.clientInfoValue}>{companyClient?.address || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>TELÉFONO:</Text>
                    <Text style={styles.clientInfoValue}>{companyClient?.phones.map(phone => phone.numero).join(', ') || 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.clientInfoRow, { marginBottom: 0 }]}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>CORREO:</Text>
                    <Text style={styles.clientInfoValue}>{companyClient?.emails.map(email => email.correo).join(', ') || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>TIPO:</Text>
                    <Text style={styles.clientInfoValue}>{'PERSONA JURÍDICA'}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.clientInfoContainer} wrap={false}>
                <Text style={styles.clientTitle}>INFORMACIÓN DEL SOLICITANTE</Text>
                <View style={styles.clientInfoRow}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>CLIENTE:</Text>
                    <Text style={styles.clientInfoValue}>{personClient?.firstName + ' ' + personClient?.lastName || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>C.I. / RUC:</Text>
                    <Text style={styles.clientInfoValue}>{personClient?.personId || 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.clientInfoRow, { marginBottom: 0 }]}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>DIRECCIÓN:</Text>
                    <Text style={styles.clientInfoValue}>{personClient?.address || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>TELÉFONO:</Text>
                    <Text style={styles.clientInfoValue}>{personClient?.phones.map(phone => phone.numero).join(', ') || 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.clientInfoRow, { marginBottom: 0 }]}>
                  <View style={{ flex: 2, flexDirection: 'row', paddingRight: 10 }}>
                    <Text style={styles.clientInfoLabel}>CORREO:</Text>
                    <Text style={styles.clientInfoValue}>{personClient?.emails.map(email => email.correo).join(', ') || 'N/A'}</Text>
                  </View>
                  <View style={{ flex: 1.2, flexDirection: 'row' }}>
                    <Text style={styles.clientInfoLabel}>TIPO:</Text>
                    <Text style={styles.clientInfoValue}>{'PERSONA NATURAL'}</Text>
                  </View>
                </View>
              </View>
            )
          }

          {/* ========== INFORME DE AGUA POTABLE ========== */}
          <View style={styles.banner}>
            <Text style={styles.bannerText}>INFORME DE AGUA POTABLE</Text>
          </View>
          <Text style={styles.sectionNote}>En caso afirmativo se tienen los siguientes costos</Text>

          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>Presupuestos de construcción</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputBoxValue}>
                {`$ ${Number(inspectionReport.materialsCost || 0).toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>Costo supervisión y/o Fiscalización</Text>
            <View style={styles.inputBox} >
              <Text style={styles.inputBoxValue}>
                {`$ ${Number(inspectionReport.materialsCost || 0).toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>COSTO DE AGUA POTABLE</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputBoxValue}>
                {`$ ${Number(inspectionReport.materialsCost || 0).toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.label}>INFORMES ADICIONALES:</Text>
            <Text style={{ marginLeft: 18, fontSize: 9 }}>Se anexa Presupuestos y costos</Text>
          </View>

          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>(P) PRESIÓN PROMEDIO EN EL SECTOR (Psi)</Text>
            <View style={[styles.inputBox, { minWidth: 45, marginLeft: 10 }]} />
            <Text style={{ marginLeft: 6, fontSize: 8.5 }}>PSI</Text>
          </View>

          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>(ø) DIÁMETRO DE LA TUBERÍA EXISTENTE (mm):</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginLeft: 6 }}>
              {inspectionReport.connectionDiameter || '—'} mm
            </Text>
          </View>

          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>RED MATRIZ A</Text>
            <View style={[styles.inputLine, { maxWidth: 40 }]} />
            <Text style={styles.label}>m   MATERIAL:</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', marginLeft: 4 }}>
              {inspectionReport.terrainConditions || '—'}
            </Text>
            <Text style={{ marginLeft: 8 }}>EN LA CALLE</Text>
            <View style={styles.inputLine} />
          </View>

          {/* ========== INFORME DE ALCANTARILLADO ========== */}
          <View style={styles.banner}>
            <Text style={styles.bannerText}>INFORME DE ALCANTARILLADO</Text>
          </View>
          <Text style={styles.sectionNote}>En caso afirmativo se tienen los siguientes costos</Text>

          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>Presupuestos de construcción</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>Costo Dirección Técnica y Fiscalización 2%</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.checkbox} />
            <Text style={styles.label}>COSTO ALCANTARILLADO</Text>
          </View>

          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.label}>INFORMES ADICIONALES:</Text>
            <Text style={{ marginLeft: 18, fontSize: 9 }}>Se anexa Presupuestos y costos</Text>
          </View>

          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>(h) ALTURA DE POZOS EXISTENTES (m):</Text>
            <View style={styles.inputLine} />
          </View>
          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>(ø) DIÁMETRO DE LA TUBERÍA EXISTENTE (m):</Text>
            <View style={styles.inputLine} />
          </View>
          <View style={[styles.row, { marginTop: 4 }]}>
            <Text style={styles.label}>RED MATRIZ A</Text>
            <View style={styles.inputLine} />
            <Text style={styles.label}>EN LA CALLE</Text>
            <View style={styles.inputLine} />
          </View>

          {/* ========== OBSERVACIONES ========== */}
          <View style={styles.observationsBox} wrap={false}>
            <Text style={styles.obsTitle}>OBSERVACIONES EMITIDAS EN LA INSPECCIÓN</Text>
            {inspectionReport.observations ? (
              <Text style={styles.obsContent}>Revisión: {inspectionReport.observations}</Text>
            ) : (
              <Text style={[styles.obsContent, { color: colors.muted }]}>—</Text>
            )}
          </View>

          {/* ========== SEGUNDA HOJA: TABLAS Y FIRMAS ========== */}
          <View break>
            {/* ========== TABLA PERSONAL TÉCNICO ========== */}
            {workers.length > 0 && (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.colName]}>PERSONAL TÉCNICO</Text>
                  <Text style={[styles.tableHeaderText, styles.colResp]}>RESPONSABLE</Text>
                </View>
                {workers.map((w, idx) => (
                  <View
                    key={idx}
                    style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                    wrap={false}
                  >
                    <Text style={[styles.tableCell, styles.colName]}>{w.fullName}</Text>
                    <Text style={[styles.tableCell, styles.colResp]}>
                      {w.isResponsible ? 'Sí' : 'No'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* ========== TABLA MATERIALES ========== */}
            {materials.length > 0 && (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.colCode]}>CÓDIGO</Text>
                  <Text style={[styles.tableHeaderText, styles.colMaterial]}>MATERIAL</Text>
                  <Text style={[styles.tableHeaderText, styles.colQty]}>CANT.</Text>
                  <Text style={[styles.tableHeaderText, styles.colUnit]}>V. UNITARIO</Text>
                  <Text style={[styles.tableHeaderText, styles.colSub]}>SUBTOTAL</Text>
                </View>

                {materials.map((m, idx) => (
                  <View
                    key={idx}
                    style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                    wrap={false}
                  >
                    <Text style={[styles.tableCell, styles.colCode]}>{m.code}</Text>
                    <Text style={[styles.tableCell, styles.colMaterial]}>{m.name}</Text>
                    <Text style={[styles.tableCell, styles.colQty]}>{m.quantity}</Text>
                    <Text style={[styles.tableCell, styles.colUnit]}>
                      $ {Number(m.unitCost).toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, styles.colSub]}>
                      $ {Number(m.subtotal).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.tableTotal} wrap={false}>
                  <Text style={[styles.tableTotalText, styles.colCode]} />
                  <Text style={[styles.tableTotalText, styles.colMaterial]} />
                  <Text style={[styles.tableTotalText, styles.colQty]} />
                  <Text style={[styles.tableTotalText, styles.colUnit]}>TOTAL</Text>
                  <Text style={[styles.tableTotalText, styles.colSub]}>
                    $ {totalMaterials.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {/* ========== CAJA DE OBSERVACIONES ADICIONALES ========== */}
            <View style={styles.observationsAdditionalBox} wrap={false}>
              <Text style={styles.obsTitle}>OBSERVACIONES ADICIONALES</Text>
              {inspectionReport.observations ? (
                <Text style={styles.obsContent}>Revisión: {inspectionReport.observations}</Text>
              ) : (
                <Text style={[styles.obsContent, { color: colors.muted }]}>—</Text>
              )}
            </View>

            {/* ========== FIRMAS ========== */}
            <View style={styles.signatures} wrap={false}>
              <View style={styles.sigBox}>
                <Text style={styles.sigTitle}>ELABORADO</Text>
                <Text style={styles.sigLine}>DPT. AGUA POTABLE</Text>
              </View>
              <View style={styles.sigBox}>
                <Text style={styles.sigTitle}>ELABORADO</Text>
                <Text style={styles.sigLine}>DPT. ALCANTARILLADO</Text>
              </View>
              <View style={styles.sigBox}>
                <Text style={styles.sigTitle}>REVISADO</Text>
                <Text style={styles.sigLine}>JEFE DE COMERCIALIZACIÓN</Text>
              </View>
              <View style={styles.sigBox}>
                <Text style={styles.sigTitle}>APROBADO</Text>
                <Text style={styles.sigLine}>DIRECTOR TÉCNICO</Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
};