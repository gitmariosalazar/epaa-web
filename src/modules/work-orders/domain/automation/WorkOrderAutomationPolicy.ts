/**
 * Política de automatización del proceso de Órdenes de Trabajo.
 *
 * Espejo de domain/automation/work_order_automation_policy.dart (Mobile).
 *
 * Algunos pasos del flujo siempre se aprueban hoy (recepción, preparación,
 * checklist, control de calidad...). Para reducir clics se ejecutan
 * automáticamente con descripciones por defecto, SIN eliminar ningún paso:
 * cada transición sigue registrándose en el backend y la UI manual se conserva.
 *
 * Principios SOLID:
 *   - SRP: decide qué paso automático corresponde según el estado de la OT.
 *   - OCP: nuevos pasos => nuevo valor en AutoStep + regla en el resolver.
 *   - DIP: los componentes dependen de esta abstracción de política, no de reglas hardcodeadas.
 */
import type { OrdenTrabajoDetalle } from '../schemas/dto/response/work-orders.get.response';

/** Pasos del flujo que pueden ejecutarse automáticamente. */
export type AutoStep =
  | 'receive'
  | 'startPreparation'
  | 'createChecklist'
  | 'approveChecklist'
  | 'restartPreparation'
  | 'finishExecution'
  | 'qualityControl';

/** Descripciones por defecto enviadas en los pasos automáticos. */
export const AutoStepDefaults = {
  checklistObservations: 'Checklist de preparación aprobado automáticamente.',
  checklistApproval: 'Preparación aprobada automáticamente — iniciando ejecución.',
  qualityControlComments: 'Control de calidad aprobado automáticamente al completar la orden.',
} as const;

/** Configuración de qué pasos son automáticos. */
export class WorkOrderAutomationPolicy {
  readonly enabled: ReadonlySet<AutoStep>;

  constructor(enabled: Iterable<AutoStep>) {
    this.enabled = new Set(enabled);
  }

  /** Configuración por defecto: todos los pasos de aprobación son automáticos. */
  static defaults(): WorkOrderAutomationPolicy {
    return new WorkOrderAutomationPolicy([
      'receive',
      'startPreparation',
      'createChecklist',
      'approveChecklist',
      'restartPreparation',
      'finishExecution',
      'qualityControl',
    ]);
  }

  /** Flujo 100 % manual (comportamiento original sin automatización). */
  static manual(): WorkOrderAutomationPolicy {
    return new WorkOrderAutomationPolicy([]);
  }

  isAuto(step: AutoStep): boolean {
    return this.enabled.has(step);
  }
}

/** Resuelve el paso automático que corresponde al estado actual de la OT. */
export class WorkOrderAutoStepResolver {
  static readonly executionStates: ReadonlySet<string> = new Set([
    'EN_PROCESO',
    'EN_PROCESO_INSPECCION',
    'EN_PROCESO_INSTALACION',
  ]);

  static readonly executedStates: ReadonlySet<string> = new Set([
    'EJECUTADA',
    'INSPECCION_EJECUTADA',
    'INSTALACION_EJECUTADA',
  ]);

  static isExecution(estado?: string | null): boolean {
    return this.executionStates.has((estado ?? '').toUpperCase());
  }

  static isExecuted(estado?: string | null): boolean {
    return this.executedStates.has((estado ?? '').toUpperCase());
  }

  /**
   * Pasos de "fondo" (no requieren datos del usuario). null => ninguno:
   * el usuario debe actuar (asignar responsable, personal, materiales...).
   */
  static nextBackgroundStep(
    order: OrdenTrabajoDetalle,
    policy: WorkOrderAutomationPolicy
  ): AutoStep | null {
    const estado = (order.estado ?? '').toUpperCase();
    let step: AutoStep | null = null;

    switch (estado) {
      case 'NOTIFICADA':
        step = 'receive';
        break;
      case 'ASIGNADA':
        step = 'startPreparation';
        break;
      case 'PREPARACION':
        step = !order.idInspeccion ? 'createChecklist' : 'approveChecklist';
        break;
      case 'REVISION_RECHAZADA':
        step = 'restartPreparation';
        break;
      default:
        step = null;
    }

    return step && policy.isAuto(step) ? step : null;
  }

  /** Pasos previos al cierre que se ejecutan al pulsar "Completar Orden". */
  static completionSteps(
    order: OrdenTrabajoDetalle,
    policy: WorkOrderAutomationPolicy
  ): AutoStep[] {
    const steps: AutoStep[] = [];

    if (this.isExecution(order.estado) && policy.isAuto('finishExecution')) {
      steps.push('finishExecution');
    }

    if (
      (this.isExecution(order.estado) || this.isExecuted(order.estado)) &&
      !order.idControl &&
      policy.isAuto('qualityControl')
    ) {
      steps.push('qualityControl');
    }

    return steps;
  }
}
