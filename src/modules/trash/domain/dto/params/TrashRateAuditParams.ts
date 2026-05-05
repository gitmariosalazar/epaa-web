import type { AuditAccountingSubTab } from '@/shared/utils/tabs-accounting/tabs';
import { ParamsTrashRateAudit } from './DateRangeParams';

/**
 * Tipos de auditoría disponibles para el reporte de tasa de basura.
 * SRP: definido aquí como única fuente de verdad del dominio de auditoría.
 * Sincronizado con backend: AuditTrashRateType en trash-rate-audit-report.params.ts
 */

/**
 * Columna de fecha que usa el backend para filtrar.
 * incomeDate → Fecha_Ingreso (emisión)
 * paymentDate → Fecha_Pago (cobro)
 */
export type AuditDateFilter = 'incomeDate' | 'paymentDate';

/**
 * Parámetros específicos para el reporte de auditoría de tasa de basura.
 * Extiende ParamsTrashRateAudit añadiendo auditType y dateFilter.
 * OCP: extiende sin modificar el DTO base compartido.
 */
export class TrashRateAuditReportParams extends ParamsTrashRateAudit {
  public auditType: AuditAccountingSubTab;
  public dateFilter: AuditDateFilter;

  constructor(
    startDate: string,
    endDate: string,
    diagnosticFilter: 'DIFFERENT_AND_NO_RECORD' | 'ALL',
    auditType: AuditAccountingSubTab = 'Pagados (Recaudados)',
    dateFilter: AuditDateFilter = 'incomeDate',
    top?: number,
    limit?: number,
    offset?: number
  ) {
    super(startDate, endDate, diagnosticFilter, top, limit, offset);
    this.auditType = auditType;
    this.dateFilter = dateFilter;
  }
}
