/**
 * Domain Models for Seasonal / Festive Themes
 * Clean Architecture - Pure Domain Layer
 */

export const HOLIDAY_TYPES = {
  CHRISTMAS: 'christmas',
  NEW_YEAR: 'new-year',
  NONE: 'none'
} as const;

export type SeasonalHoliday =
  (typeof HOLIDAY_TYPES)[keyof typeof HOLIDAY_TYPES];

/**
 * SRP: User-specific preferences that are persisted in client storage.
 * Separates persistent user choices from runtime theme presentation data.
 */
export interface SeasonalUserPreferences {
  /** Master user switch */
  enabled: boolean;
  /** User preference for the falling snow animation */
  showSnow: boolean;
  /** User preference for the top banner display */
  showBanner: boolean;
}

export interface SeasonalConfig {
  /** Switch maestro: activa o desactiva todo el sistema festivo */
  enabled: boolean;
  /** Tipo de festividad activa */
  holiday: SeasonalHoliday;
  /** Mostrar animación de nieve que cae en toda la pantalla */
  showSnow: boolean;
  /** Mostrar banner o saludo festivo */
  showBanner: boolean;
  /** Mostrar decoraciones sutiles (sombreros, guirnaldas, luces) */
  showDecorations: boolean;
  /** Mensaje opcional personalizado (si se omite, el componente UI usa su propia fuente de verdad) */
  bannerMessage?: string;
  /** Subtítulo o dedicatoria opcional (si se omite, el componente UI usa su propia fuente de verdad) */
  bannerSubMessage?: string;
  /** Activar automáticamente por fecha (Diciembre 1 a Enero 6) */
  autoSchedule: boolean;
}

/**
 * Switch global de compilación: ponlo en false si deseas apagarlo
 * por completo de raíz en toda la aplicación.
 */

const today = new Date();
const month = today.getMonth(); // 0 = Enero, 11 = Diciembre
const day = today.getDate(); // 1 al 31

// Es true si es todo Diciembre (mes 11) O si es Enero (mes 0) hasta el día 6
export const GLOBAL_SEASONAL_MASTER_SWITCH =
  month === 11 || (month === 0 && day <= 6);

/**
 * Evalúa si la fecha actual corresponde a la temporada navideña
 * (Desde el 1 de Diciembre hasta el 6 de Enero)
 */
export function isHolidaySeasonDate(now: Date = new Date()): boolean {
  const month = now.getMonth(); // 0 = Enero, 11 = Diciembre
  const day = now.getDate();
  return month === 11 || (month === 0 && day <= 6);
}
