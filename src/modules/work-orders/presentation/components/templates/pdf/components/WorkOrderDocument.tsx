import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Path,
} from '@react-pdf/renderer';
import { styles } from './stylesWorkOrderTemplate';
import type {
  OrdenTrabajoDetalle,
  WorkOrderListItem,
  OrdenTrabajoVistaCliente,
  MaterialUtilizado,
  TrabajadorAsignado,
  AdjuntoEvidencia,
  ObservacionBitacora,
  CostoAdicional,
  AcometidaResult,
  CompanyResponse,
  ClientResponse
} from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';

const WaterDropIcon: React.FC = () => (
  <Svg width={30} height={36} viewBox="0 0 100 120">
    <Path
      d="M 50,5 C 50,5 10,55 10,80 C 10,102 28,118 50,118 C 72,118 90,102 90,80 C 90,55 50,5 50,5 Z"
      fill="#8ed1fc"
      stroke="#1e3a5f"
      strokeWidth={7}
    />
    <Path
      d="M 22,78 Q 38,68 50,78 T 78,78"
      fill="none"
      stroke="#1e3a5f"
      strokeWidth={5}
    />
    <Path
      d="M 25,92 Q 38,82 50,92 T 75,92"
      fill="none"
      stroke="#1e3a5f"
      strokeWidth={5}
    />
  </Svg>
);

export interface WorkOrderMaterialRow {
  cantidad?: number | string;
  descripcion?: string;
  caracteristicas?: string;
}

export interface WorkOrderPdfItem {
  // Identificación
  orderCode: string;
  idOrdenTrabajo?: string;
  numeroSecuencial?: number;
  version?: number;
  estado?: string;
  estadoLabel?: string;
  origen?: string;
  origenLabel?: string;
  codigoEntidadOrigen?: string | null;
  idEntidadOrigen?: string | null;

  // Personal / Elaboración / Impresión
  createdBy?: string;
  printedBy?: string;
  department?: string;

  // Fechas y Tiempos
  entryDate?: string;
  entryTime?: string;
  printDate?: string;
  fechaCreacion?: string;
  fechaAsignacion?: string | null;
  fechaInicioCampo?: string | null;
  fechaCompletada?: string | null;
  deliveryDate?: string;
  startTime?: string;
  endTime?: string;
  diasEnProceso?: number;
  horasTotalesProceso?: number;
  horasHastaAsignacion?: number | null;
  horasEjecucionCampo?: number | null;

  // SLA
  slaHoras?: number;
  escalaSupervisor?: boolean;
  motivoEscalamiento?: string | null;
  cumpleSla?: boolean;
  horasRestantesSla?: number;

  // Ubicación / Cliente / Acometida / Empresa / Persona
  accountSector?: string;
  claveCatastral?: string | null;
  clientId?: string;
  clientName?: string;
  telephones?: string;
  parish?: string;
  neighborhood?: string;
  streetType?: string;
  mainStreet?: string;
  secondaryStreet?: string;
  reference?: string;
  coordenadasPunto?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  acometida?: AcometidaResult | null;
  company?: CompanyResponse | null;
  person?: ClientResponse | null;

  // Descripción y Clasificación
  workType?: string;
  workTypeDescription?: string | null;
  workDescription?: string;

  // Asignación Operativa
  inspectorUsername?: string | null;
  inspectorNombre?: string | null;
  nombreAsignador?: string | null;
  nombreCompletador?: string | null;
  assignedWorkers?: string[];
  personalAsignado?: TrabajadorAsignado[];

  // Bloques Agregados y Costos
  materials?: WorkOrderMaterialRow[];
  materiales?: MaterialUtilizado[];
  observaciones?: ObservacionBitacora[];
  observation?: string;
  adjuntos?: AdjuntoEvidencia[];
  costosAdicionales?: CostoAdicional[];
  costoTotalMateriales?: number;
  costoTotalAdicionales?: number;
  costoTotalOrden?: number;

  // Inspección, Calidad y Satisfacción
  checklistAprobado?: boolean | null;
  observacionesChecklist?: string | null;
  calidadAprobada?: boolean | null;
  comentariosCalidad?: string | null;
  calificacionSatisfaccion?: number | null;
  comentariosSatisfaccion?: string | null;

  // Corte de Servicio
  tipoCorte?: string | null;
  sectorAfectado?: string | null;
  corteFechaInicio?: string | null;

  // Referencia nativa al objeto completo del dominio
  rawDetail?: OrdenTrabajoDetalle;
}

export type WorkOrderInputData =
  | WorkOrderPdfItem
  | OrdenTrabajoDetalle
  | WorkOrderListItem
  | OrdenTrabajoVistaCliente;

/**
 * Normalizes input objects (WorkOrderPdfItem, OrdenTrabajoDetalle, WorkOrderListItem, OrdenTrabajoVistaCliente)
 * into a standard WorkOrderPdfItem model.
 */
export function mapWorkOrderToPdfItem(input: WorkOrderInputData): WorkOrderPdfItem {
  const now = new Date();
  const printDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const printTimeStr = now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Handle OrdenTrabajoVistaCliente
  if ('departamentoEjecutor' in input) {
    const vista = input as OrdenTrabajoVistaCliente;
    const entryDateObj = vista.fechaCreacion ? new Date(vista.fechaCreacion) : now;
    const entryDateStr = `${entryDateObj.getFullYear()}-${String(entryDateObj.getMonth() + 1).padStart(2, '0')}-${String(entryDateObj.getDate()).padStart(2, '0')}`;
    const entryTimeStr = entryDateObj.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return {
      orderCode: vista.codigoOrden,
      createdBy: vista.tecnicoNombre || '',
      printedBy: (input as any).printedBy || '',
      department: vista.departamentoEjecutor || '',
      entryDate: entryDateStr,
      entryTime: entryTimeStr,
      printDate: printDateStr,
      accountSector: '',
      clientId: vista.idCliente || '',
      clientName: '',
      telephones: '',
      parish: '',
      neighborhood: '',
      streetType: '',
      mainStreet: vista.direccionTrabajo || '',
      secondaryStreet: '',
      reference: vista.ubicacionDetalles || '',
      workDescription: vista.descripcion || vista.tipoTrabajo || '',
      assignedWorkers: vista.tecnicoNombre ? [vista.tecnicoNombre] : [],
      deliveryDate: vista.fechaCompletada ? new Date(vista.fechaCompletada).toLocaleDateString('es-EC') : undefined,
      startTime: vista.fechaInicioCampo ? new Date(vista.fechaInicioCampo).toLocaleTimeString('es-EC') : undefined,
      endTime: vista.fechaCompletada ? new Date(vista.fechaCompletada).toLocaleTimeString('es-EC') : undefined,
      observation: vista.ultimoComentarioTecnico || undefined
    };
  }

  // Handle OrdenTrabajoDetalle
  if ('codigoOrden' in input && ('numeroSecuencial' in input || 'idOrdenTrabajo' in input || 'personalAsignado' in input)) {
    const detail = input as OrdenTrabajoDetalle;
    const entryDateObj = detail.fechaCreacion ? new Date(detail.fechaCreacion) : now;
    const entryDateStr = `${entryDateObj.getFullYear()}-${String(entryDateObj.getMonth() + 1).padStart(2, '0')}-${String(entryDateObj.getDate()).padStart(2, '0')}`;
    const entryTimeStr = entryDateObj.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const mappedMaterials: WorkOrderMaterialRow[] = (detail.materiales || []).map((m: MaterialUtilizado) => ({
      cantidad: m.cantidad,
      descripcion: m.nombreMaterial || m.codigoMaterial || '—',
      caracteristicas: `Costo: $${m.costoUnitario || 0}`
    }));

    const workers = (detail.personalAsignado || []).map((w: TrabajadorAsignado) => w.nombreTrabajador);
    const mainObservation = (detail.observaciones && detail.observaciones.length > 0) ? detail.observaciones[0].texto : undefined;

    const personName = detail.person ? `${detail.person.firstName} ${detail.person.lastName}`.trim() : '';
    const companyName = detail.company ? (detail.company.businessName || detail.company.commercialName || '') : '';
    const resolvedClientName = personName || companyName || (detail.metadata as any)?.nombreCliente || '';

    const resolvedClientId = detail.company?.ruc || detail.person?.personId || detail.idCliente || '';

    const personPhones = detail.person?.phones?.map((p: any) => p.numero).join('; ');
    const companyPhones = detail.company?.phones?.map((p: any) => p.numero).join('; ');
    const resolvedTelephones = personPhones || companyPhones || (detail.metadata as any)?.telefonos || '';

    const resolvedAccountSector = (detail.acometida?.sector != null && detail.acometida?.account != null)
      ? `${detail.acometida.sector}-${detail.acometida.account}`
      : (detail.claveCatastral || '');

    const resolvedAddress = detail.acometida?.address || detail.direccion || (detail.metadata as any)?.callePrincipal || '';

    return {
      rawDetail: detail,
      acometida: detail.acometida,
      company: detail.company,
      person: detail.person,

      orderCode: detail.codigoOrden || `${detail.numeroSecuencial || ''}`,
      idOrdenTrabajo: detail.idOrdenTrabajo,
      numeroSecuencial: detail.numeroSecuencial,
      version: detail.version,
      estado: detail.estado,
      estadoLabel: detail.estadoLabel,
      origen: detail.origen,
      origenLabel: detail.origenLabel,
      codigoEntidadOrigen: detail.codigoEntidadOrigen,
      idEntidadOrigen: detail.idEntidadOrigen,

      createdBy: detail.creadorNombre || detail.creadorUsername || '',
      printedBy: (input as any).printedBy || detail.creadorUsername || '',
      department: detail.departamento || '',

      entryDate: entryDateStr,
      entryTime: entryTimeStr,
      printDate: printDateStr,
      fechaCreacion: detail.fechaCreacion,
      fechaAsignacion: detail.fechaAsignacion || undefined,
      fechaInicioCampo: detail.fechaInicioCampo || undefined,
      fechaCompletada: detail.fechaCompletada || undefined,
      deliveryDate: detail.fechaCompletada ? new Date(detail.fechaCompletada).toLocaleDateString('es-EC') : undefined,
      startTime: detail.fechaInicioCampo ? new Date(detail.fechaInicioCampo).toLocaleTimeString('es-EC') : undefined,
      endTime: detail.fechaCompletada ? new Date(detail.fechaCompletada).toLocaleTimeString('es-EC') : undefined,
      diasEnProceso: detail.diasEnProceso,
      horasTotalesProceso: detail.horasTotalesProceso,
      horasHastaAsignacion: detail.horasHastaAsignacion,
      horasEjecucionCampo: detail.horasEjecucionCampo,

      slaHoras: detail.slaHoras,
      escalaSupervisor: detail.escalaSupervisor,
      motivoEscalamiento: detail.motivoEscalamiento,
      cumpleSla: detail.cumpleSla,
      horasRestantesSla: detail.horasRestantesSla,

      accountSector: resolvedAccountSector,
      claveCatastral: detail.claveCatastral,
      clientId: resolvedClientId,
      clientName: resolvedClientName,
      telephones: resolvedTelephones,
      parish: (detail.metadata as any)?.parroquia || '',
      neighborhood: (detail.metadata as any)?.barrio || '',
      streetType: (detail.metadata as any)?.tipoCalle || '',
      mainStreet: resolvedAddress,
      secondaryStreet: (detail.metadata as any)?.calleSecundaria || '',
      reference: detail.ubicacionDetalles || (detail.metadata as any)?.referencia || '',
      coordenadasPunto: detail.coordenadasPunto,
      latitud: detail.latitud,
      longitud: detail.longitud,

      workType: detail.tipoTrabajo,
      workTypeDescription: detail.tipoTrabajoDescripcion,
      workDescription: detail.descripcion || detail.tipoTrabajo || '',

      inspectorUsername: detail.inspectorUsername,
      inspectorNombre: detail.inspectorNombre,
      nombreAsignador: detail.nombreAsignador,
      nombreCompletador: detail.nombreCompletador,
      assignedWorkers: workers,
      personalAsignado: detail.personalAsignado || [],

      materials: mappedMaterials,
      materiales: detail.materiales || [],
      observaciones: detail.observaciones || [],
      observation: mainObservation,
      adjuntos: detail.adjuntos || [],
      costosAdicionales: detail.costosAdicionales || [],
      costoTotalMateriales: detail.costoTotalMateriales || 0,
      costoTotalAdicionales: detail.costoTotalAdicionales || 0,
      costoTotalOrden: detail.costoTotalOrden || 0,

      checklistAprobado: detail.checklistAprobado,
      observacionesChecklist: detail.observacionesChecklist,
      calidadAprobada: detail.calidadAprobada,
      comentariosCalidad: detail.comentariosCalidad,
      calificacionSatisfaccion: detail.calificacionSatisfaccion,
      comentariosSatisfaccion: detail.comentariosSatisfaccion,

      tipoCorte: detail.tipoCorte,
      sectorAfectado: detail.sectorAfectado,
      corteFechaInicio: detail.corteFechaInicio,
    };
  }

  // Handle WorkOrderListItem
  if ('orderCode' in input && 'workTypeId' in input) {
    const list = input as WorkOrderListItem;
    const entryDateObj = list.creationDate ? new Date(list.creationDate) : now;
    const entryDateStr = `${entryDateObj.getFullYear()}-${String(entryDateObj.getMonth() + 1).padStart(2, '0')}-${String(entryDateObj.getDate()).padStart(2, '0')}`;
    const entryTimeStr = entryDateObj.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let metaObj: Record<string, any> = {};
    if (list.metadata) {
      try {
        metaObj = typeof list.metadata === 'string' ? JSON.parse(list.metadata) : list.metadata;
      } catch {
        metaObj = {};
      }
    }

    return {
      orderCode: list.orderCode,
      createdBy: list.createdUserId || '',
      printedBy: (input as any).printedBy || list.createdUserId || '',
      department: metaObj.department || '',
      entryDate: entryDateStr,
      entryTime: entryTimeStr,
      printDate: printDateStr,
      accountSector: list.cadastralKey || metaObj.sectorCuenta || '',
      clientId: list.clientId || '',
      clientName: list.clientName || '',
      telephones: metaObj.telefonos || '',
      parish: metaObj.parroquia || '',
      neighborhood: metaObj.barrio || '',
      streetType: metaObj.tipoCalle || '',
      mainStreet: list.location || metaObj.callePrincipal || '',
      secondaryStreet: metaObj.calleSecundaria || '',
      reference: metaObj.referencia || '',
      workDescription: list.description || list.workTypeName || '',
      materials: metaObj.materials || [],
      assignedWorkers: metaObj.assignedWorkers || [],
      deliveryDate: list.completionDate ? new Date(list.completionDate).toLocaleDateString('es-EC') : undefined,
      observation: metaObj.observation || undefined
    };
  }

  // Raw WorkOrderPdfItem fallback
  const pdfItem = input as WorkOrderPdfItem;
  return {
    ...pdfItem,
    createdBy: pdfItem.createdBy || '',
    printedBy: pdfItem.printedBy || '',
    department: pdfItem.department || '',
    entryDate: pdfItem.entryDate || printDateStr,
    entryTime: pdfItem.entryTime || printTimeStr,
    printDate: pdfItem.printDate || printDateStr,
    accountSector: pdfItem.accountSector || '',
    clientId: pdfItem.clientId || '',
    clientName: pdfItem.clientName || '',
    telephones: pdfItem.telephones || '',
    parish: pdfItem.parish || '',
    neighborhood: pdfItem.neighborhood || '',
    streetType: pdfItem.streetType || '',
    mainStreet: pdfItem.mainStreet || '',
    secondaryStreet: pdfItem.secondaryStreet || '',
    reference: pdfItem.reference || '',
    workDescription: pdfItem.workDescription || '',
  };
}

interface Props {
  items: WorkOrderInputData[];
}

export const WorkOrderDocument: React.FC<Props> = ({ items }) => {
  const normalizedItems = (items && items.length > 0)
    ? items.map(mapWorkOrderToPdfItem)
    : [mapWorkOrderToPdfItem({ orderCode: '70254' })];

  return (
    <Document>
      {normalizedItems.map((item, index) => {
        const materialsList = item.materials || [];
        const rows = [0, 1, 2, 3, 4, 5];

        return (
          <Page key={`wo-page-${item.orderCode}-${index}`} size="A4" style={styles.page}>
            <View style={styles.contentWrapper}>

              {/* Header Text Brand & Company Title (Fixed across all pages) */}
              <View style={styles.headerRow} fixed>
                {/* Brand Text: EPAA Antonio Ante */}
                <View style={styles.epaaBrandBox}>
                  <Text style={styles.epaaText}>EPAA</Text>
                  <Text style={styles.epaaSubText}>Antonio Ante</Text>
                </View>

                {/* Water Drop Icon SVG */}
                <View style={styles.waterIconContainer}>
                  <WaterDropIcon />
                </View>

                {/* Company Name stretching to the right border */}
                <View style={styles.companyTitleBox}>
                  <Text style={styles.companyName}>Empresa Pública de Agua Potable y</Text>
                  <Text style={styles.companyName}>Alcantarillado de Antonio Ante</Text>
                </View>
              </View>

              {/* Main Document Title */}
              <Text style={styles.orderTitle}>ORDEN DE TRABAJO Nro.{item.orderCode}</Text>

              {/* Top Metadata Section */}
              <View style={styles.metaSection}>
                <View style={styles.metaRowTwoCol}>
                  <View style={styles.metaColLeft}>
                    <Text style={styles.metaLabelLeft}>ELABORADO POR     :</Text>
                    <Text style={styles.metaValue}>{item.createdBy}</Text>
                  </View>
                  <View style={styles.metaColRight}>
                    <Text style={styles.metaLabelRight}>IMPRESO POR :</Text>
                    <Text style={styles.metaValue}>{item.printedBy}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>DEPARTAMENTO      :</Text>
                  <Text style={styles.metaValue}>{item.department}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>FECHA DE INGRESO  :</Text>
                  <Text style={styles.metaValue}>
                    {item.entryDate} HORA: {item.entryTime}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>FECHA IMPRESION   :</Text>
                  <Text style={styles.metaValue}>{item.printDate}</Text>
                </View>
              </View>

              {/* Dotted Divider */}
              <View style={styles.dottedDivider} />

              {/* Location & Client Metadata Section */}
              <View style={styles.metaSection}>
                <View style={styles.metaRowTwoCol}>
                  <View style={styles.metaColLeft}>
                    <Text style={styles.metaLabelLeft}>SECTOR-CUENTA     :</Text>
                    <Text style={styles.metaValue}>{item.accountSector}</Text>
                  </View>
                  <View style={styles.metaColRight}>
                    <Text style={styles.metaLabelRight}>CEDULA      :</Text>
                    <Text style={styles.metaValue}>{item.clientId}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>NOMBRES           :</Text>
                  <Text style={styles.metaValue}>{item.clientName}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>TELEFONOS         :</Text>
                  <Text style={styles.metaValue}>{item.telephones}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>PARROQUIA         :</Text>
                  <Text style={styles.metaValue}>{item.parish}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>BARRIO            :</Text>
                  <Text style={styles.metaValue}>{item.neighborhood}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>TIPO CALLE        :</Text>
                  <Text style={styles.metaValue}>{item.streetType}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>CALLE PRINCIPAL   :</Text>
                  <Text style={styles.metaValue}>{item.mainStreet}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>CALLE SECUNDARIA  :</Text>
                  <Text style={styles.metaValue}>{item.secondaryStreet}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>REFERENCIA        :</Text>
                  <Text style={styles.metaValue}>{item.reference}</Text>
                </View>

                <Text style={styles.descHeader}>DESCRIPCION DEL TRABAJO:</Text>
                <Text style={styles.descText}>{item.workDescription}</Text>
              </View>

              {/* Materials & Croquis Table Section */}
              <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.tableLeftColumns}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.tableHeaderCellLeft, { width: '23%' }]}>CANTIDAD</Text>
                      <Text style={[styles.tableHeaderCellLeft, { width: '54%' }]}>DESCRIPCION</Text>
                      <Text style={[styles.tableHeaderCellLeft, { width: '23%' }]}>CARACT.</Text>
                    </View>
                  </View>
                  <Text style={styles.tableHeaderCroquisCell}>C R O Q U I S</Text>
                </View>

                {/* Table Body */}
                <View style={styles.tableBodyContainer}>
                  {/* Left columns (4 rows) */}
                  <View style={styles.tableLeftColumns}>
                    {rows.map((rowIndex) => {
                      const mat = materialsList[rowIndex];
                      const isGray = rowIndex % 2 === 0;
                      const isLast = rowIndex === rows.length - 1;
                      const rowStyle = [
                        isLast ? styles.tableRowLast : styles.tableRow,
                        isGray ? styles.tableRowGray : styles.tableRowWhite
                      ];

                      return (
                        <View key={`row-${rowIndex}`} style={rowStyle}>
                          <View style={styles.cellCantidad}>
                            <Text style={styles.cellText}>{mat?.cantidad ?? ''}</Text>
                          </View>
                          <View style={styles.cellDescripcion}>
                            <Text style={styles.cellText}>{mat?.descripcion ?? ''}</Text>
                          </View>
                          <View style={styles.cellCaract}>
                            <Text style={styles.cellText}>{mat?.caracteristicas ?? ''}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Right side Croquis Box */}
                  <View style={styles.croquisBoxRight} />
                </View>
              </View>

              {/* Work Execution Details */}
              <View style={styles.executionSection}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabelWide}>FECHA DE ENTREGA DEL TRABAJO :</Text>
                  <Text style={styles.metaValue}>{item.deliveryDate || '....................'}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabelWide}>HORA INICIO                  :</Text>
                  <Text style={styles.metaValue}>{item.startTime || '....................'}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabelWide}>HORA FINALIZACION            :</Text>
                  <Text style={styles.metaValue}>{item.endTime || '....................'}</Text>
                </View>

                <Text style={styles.descHeader}>TRABAJADORES ASIGNADOS:</Text>
                <Text style={styles.dotsLine}>
                  {item.assignedWorkers && item.assignedWorkers.length > 0
                    ? item.assignedWorkers.join(', ')
                    : '.................................................................................'}
                </Text>
                <Text style={styles.dotsLine}>
                  .................................................................................
                </Text>

                <Text style={styles.descHeader}>OBSERVACION:</Text>
                <Text style={styles.dotsLine}>
                  {item.observation || '.................................................................................'}
                </Text>
              </View>

              {/* Signatures Footer */}
              <View style={styles.signaturesSection}>
                <View style={styles.signatureBox}>
                  <View style={styles.signatureDottedLine} />
                  <Text style={styles.signatureLabel}>FIRMA USUARIO</Text>
                </View>

                <View style={styles.signatureBox}>
                  <View style={styles.signatureDottedLine} />
                  <Text style={styles.signatureLabel}>FIRMA RESPONSABLE</Text>
                </View>
              </View>

            </View>
          </Page>
        );
      })}
    </Document>
  );
};
