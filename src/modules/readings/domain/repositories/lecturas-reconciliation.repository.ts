import type {
  ConsultarDetalleAuditoriaParams,
  DetalleAuditoriaResponse,
  DuplicateReconciliationRecord,
  ReconciliationMismatchRecord,
  ReconciliationPeriod,
  ReconciliationSummary,
  ResumenAuditoriaResponse
} from '../models/lecturas-reconciliation';

/**
 * Compares `AP_LECTURAS` (legacy production table) directly against
 * `lecturas_postgres` (migration staging table), both living in the same
 * SQL Server instance. Unlike `LecturasSourceRepository`/`LecturasTargetRepository`
 * (which compare PostgreSQL vs SQL Server in-memory), this runs native T-SQL
 * joins since both tables share the same engine.
 */
export interface LecturasReconciliationRepository {
  getSummary(period: ReconciliationPeriod): Promise<ReconciliationSummary>;
  getDuplicates(
    period: ReconciliationPeriod
  ): Promise<DuplicateReconciliationRecord[]>;
  getMismatches(
    period: ReconciliationPeriod
  ): Promise<ReconciliationMismatchRecord[]>;

  // Método 1: Solo métricas
  getReconciliationKpis(
    params: ReconciliationPeriod
  ): Promise<ResumenAuditoriaResponse>;

  // Método 2: Solo grilla con filtros
  getDiscrepanciesDetail(
    params: ConsultarDetalleAuditoriaParams
  ): Promise<DetalleAuditoriaResponse>;

  migrateLecturas(months?: string[]): Promise<any>;
  compareLecturas(months?: string[]): Promise<any>;
}
