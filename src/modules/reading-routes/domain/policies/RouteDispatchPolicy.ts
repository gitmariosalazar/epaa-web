/**
 * Política de Dominio: Capacidad y Despacho Diario de Rutas
 *
 * Clean Architecture & Principios SOLID:
 * - SRP: Encapsula de forma única y exclusiva las reglas de negocio sobre límites de
 *   capacidad diaria por lecturista, umbrales de advertencia y validación de carga.
 * - OCP: Abierto a extensión (configuraciones dinámicas desde backend o variables de entorno),
 *   cerrado a modificación en los componentes consumidores.
 * - DIP: Los componentes de presentación dependen de esta abstracción de política,
 *   eliminando números mágicos (hardcoded limits) en la UI.
 */

export interface RouteDispatchPolicyConfig {
  /** Límite máximo diario de rutas que puede tener asignadas un lecturista (4 rutas). */
  readonly maxDailyRoutesPerOperator: number;
  /** Umbral en el que se considera carga alta (3 rutas). */
  readonly highLoadThresholdRoutesPerOperator: number;
}

export const DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG: RouteDispatchPolicyConfig = {
  maxDailyRoutesPerOperator: 4, // Límite máximo diario de rutas (4 rutas)
  highLoadThresholdRoutesPerOperator: 3 // Umbral de carga alta (3 rutas)
};

export class RouteDispatchPolicy {
  private readonly config: RouteDispatchPolicyConfig;

  constructor(
    config: RouteDispatchPolicyConfig = DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG
  ) {
    this.config = Object.freeze({ ...config });
  }

  /** Límite máximo de rutas por lecturista en un día. */
  public get maxDailyRoutes(): number {
    return this.config.maxDailyRoutesPerOperator;
  }

  /** Umbral de carga alta para advertencias tempranas. */
  public get highLoadThreshold(): number {
    return this.config.highLoadThresholdRoutesPerOperator;
  }

  /**
   * Determina si el lecturista ya ha alcanzado el límite máximo diario de rutas.
   */
  public hasReachedMaxLimit(currentCount: number): boolean {
    return currentCount >= this.config.maxDailyRoutesPerOperator;
  }

  /**
   * Valida si es factible asignar una cantidad adicional de rutas al lecturista.
   */
  public canAssign(currentCount: number, additionalCount: number = 1): boolean {
    return (
      currentCount + additionalCount <= this.config.maxDailyRoutesPerOperator
    );
  }

  /**
   * Calcula el cupo remanente disponible para asignar a un lecturista.
   */
  public getRemainingCapacity(currentCount: number): number {
    return Math.max(0, this.config.maxDailyRoutesPerOperator - currentCount);
  }

  /**
   * Evalúa el nivel de carga de trabajo de un lecturista.
   * - 'MAX_REACHED': Ya tiene el máximo (3/3).
   * - 'HIGH': En el umbral de advertencia (3/3).
   * - 'NORMAL': Entre 1 y 2 rutas.
   * - 'IDLE': Sin rutas asignadas (0).
   */
  public getWorkloadLevel(
    currentCount: number
  ): 'IDLE' | 'NORMAL' | 'HIGH' | 'MAX_REACHED' {
    if (currentCount >= this.config.maxDailyRoutesPerOperator)
      return 'MAX_REACHED';
    if (currentCount >= this.config.highLoadThresholdRoutesPerOperator)
      return 'HIGH';
    if (currentCount > 0) return 'NORMAL';
    return 'IDLE';
  }

  /**
   * Genera el mensaje amigable de validación en caso de intento de exceder el límite.
   */
  public getLimitExceededMessage(operatorName?: string): string {
    const nameStr = operatorName
      ? `El lecturista ${operatorName}`
      : 'El lecturista';
    return `${nameStr} ya cuenta con el límite máximo diario permitido de ${this.config.maxDailyRoutesPerOperator} rutas.`;
  }

  /**
   * Factoría para crear la política por defecto (3 rutas diarias).
   */
  public static defaults(): RouteDispatchPolicy {
    return new RouteDispatchPolicy(DEFAULT_ROUTE_DISPATCH_POLICY_CONFIG);
  }
}

/** Instancia singleton por defecto para uso directo en presentación y aplicación */
export const defaultRouteDispatchPolicy = RouteDispatchPolicy.defaults();
