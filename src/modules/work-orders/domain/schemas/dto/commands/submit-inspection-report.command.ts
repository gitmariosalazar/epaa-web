/**
 * SubmitInspectionReportCommand — Comando de dominio (Domain Layer)
 *
 * SRP : Encapsula los datos necesarios para enviar el informe técnico
 *       de una OT de inspección de factibilidad de acometida.
 *
 * Dependency Rule: No importa nada de capas externas (infra/presentation).
 */
export interface SubmitInspectionReportCommand {
  /** UUID de la Orden de Trabajo de inspección */
  workOrderId: string;

  /** UUID de la solicitud de acometida vinculada */
  solicitudId: string;

  /** Resultado técnico: 'FACTIBLE' | 'NO_FACTIBLE' | 'CONDICIONADA' */
  result: 'FACTIBLE' | 'NO_FACTIBLE' | 'CONDICIONADA';

  /** Distancia a la red más cercana (metros) */
  networkDistanceM?: number;

  /** Diámetro de conexión recomendado (Ej: '1/2"', '3/4"') */
  connectionDiameter?: string;

  /** Descripción de las condiciones del terreno */
  terrainConditions?: string;

  /** Observaciones adicionales del inspector */
  observations?: string;

  /** Coordenadas del punto de inspección */
  longitude?: number;
  latitude?: number;

  /** Costos estimados */
  materialCost?: number;
  laborCost?: number;

  /** UUID del técnico inspector */
  technicianId: string;

  /**
   * Status ID que se asignará a la OT al cerrar (tipicamente el que
   * corresponde a COMPLETADA en el catálogo work_orders.cat_estado_orden).
   */
  completedStatusId: number;
}
