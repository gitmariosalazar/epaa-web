/**
 * Clean Architecture & SOLID Date Constraints Specification & Policy
 *
 * Principles Applied:
 * - SRP (Single Responsibility Principle):
 *   Centralizes canonical date string normalization, range evaluation, boundary clamping,
 *   and disabled-state calculation in a single pure, framework-agnostic policy module.
 *
 * - OCP (Open / Closed Principle):
 *   Extensible via `isDateDisabled` predicate or custom ranges without altering internal
 *   rendering loops or parsing logic.
 *
 * - LSP (Liskov Substitution Principle):
 *   Accepts Date instances, ISO strings ('YYYY-MM-DD', 'YYYY-MM-DDTHH:mm'), or timestamps
 *   uniformly across DatePicker, DateRangePicker, and DateTimePicker.
 *
 * - ISP (Interface Segregation Principle):
 *   Clear, segregated contract (`DateConstraintProps`) with only optional properties,
 *   guaranteeing 100% backward compatibility for all existing components.
 *
 * - DIP (Dependency Inversion Principle):
 *   Presentation components depend on the `IDateConstraintPolicy` abstraction rather than
 *   coupled, ad-hoc date comparison operations inside JSX.
 */

export interface DateRange {
  /**
   * Start date of the allowed range (inclusive).
   */
  start?: string | Date | null;
  /**
   * End date of the allowed range (inclusive).
   */
  end?: string | Date | null;
}

export interface DateConstraintProps {
  /**
   * Fecha mínima seleccionable. Cualquier fecha anterior a esta quedará deshabilitada.
   * Acepta string 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm', o instancia de Date.
   */
  minDate?: string | Date | null;

  /**
   * Fecha máxima seleccionable. Cualquier fecha posterior a esta quedará deshabilitada.
   * Acepta string 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm', o instancia de Date.
   */
  maxDate?: string | Date | null;

  /**
   * Alias de `minDate` para compatibilidad retroactiva 100% transparente.
   */
  min?: string | Date | null;

  /**
   * Alias de `maxDate` para compatibilidad retroactiva 100% transparente.
   */
  max?: string | Date | null;

  /**
   * Rango de fechas hábiles / permitidas. Solo las fechas dentro de este rango son seleccionables.
   * Las fechas fuera del rango quedan deshabilitadas.
   */
  allowedRange?: DateRange;

  /**
   * Múltiples rangos de fechas hábiles permitidas.
   * Si se define, la fecha debe pertenecer al menos a uno de ellos.
   */
  allowedRanges?: DateRange[];

  /**
   * Lista explícita de fechas puntuales deshabilitadas (ej. feriados, días inhábiles).
   */
  disabledDates?: Array<string | Date>;

  /**
   * Predicado extensible para inhabilitar fechas por regla de negocio
   * (ej: deshabilitar fines de semana: `(d) => d.getDay() === 0 || d.getDay() === 6`).
   *
   * @param date - Objeto Date evaluado en tiempo local.
   * @param dateStr - Cadena canónica en formato 'YYYY-MM-DD'.
   * @returns `true` si la fecha debe quedar deshabilitada; `false` si es hábil/habilitada.
   */
  isDateDisabled?: (date: Date, dateStr: string) => boolean;
}

export interface IDateConstraintPolicy {
  readonly minDateStr: string | null;
  readonly maxDateStr: string | null;
  readonly minMonthStr: string | null;
  readonly maxMonthStr: string | null;
  readonly minYear: number | null;
  readonly maxYear: number | null;

  /**
   * Evalúa si un día específico (año, mes 0-11, día 1-31) está deshabilitado.
   */
  isDayDisabled(year: number, monthIndex: number, day: number): boolean;

  /**
   * Evalúa si un objeto Date o string canónico está deshabilitado.
   * Soporta vistas 'date', 'month' y 'year'.
   */
  isDateDisabled(
    dateOrStr: Date | string | null | undefined,
    view?: 'date' | 'month' | 'year'
  ): boolean;

  /**
   * Evalúa si un mes completo (año, mes 0-11) debe deshabilitarse en la vista mensual.
   */
  isMonthDisabled(year: number, monthIndex: number): boolean;

  /**
   * Evalúa si un año completo debe deshabilitarse en la vista anual.
   */
  isYearDisabled(year: number): boolean;

  /**
   * Evalúa si el botón de mes anterior debe deshabilitarse en la navegación.
   */
  isPrevNavDisabled(currentMonth: Date, view?: 'date' | 'month' | 'year'): boolean;

  /**
   * Evalúa si el botón de mes siguiente debe deshabilitarse en la navegación.
   */
  isNextNavDisabled(currentMonth: Date, view?: 'date' | 'month' | 'year'): boolean;
}

const pad = (n: number): string => String(n).padStart(2, '0');

export type DatePickerView = 'date' | 'month' | 'year';

/**
 * Retorna las partes numéricas de año, mes (0-indexado) y día en la zona horaria
 * oficial de Ecuador ('America/Guayaquil', UTC-5).
 */
export function getEcuadorDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date);
  const year = parseInt(
    parts.find((p) => p.type === 'year')?.value || '0',
    10
  );
  const month =
    parseInt(parts.find((p) => p.type === 'month')?.value || '0', 10) - 1;
  const day = parseInt(parts.find((p) => p.type === 'day')?.value || '0', 10);
  return { year, month, day };
}

/**
 * SRP / Clean Architecture: Parser robusto y puro para interpretar cualquier
 * valor de entrada de fecha (Date, ISO string, YYYY-MM-DD, timestamp, etc.)
 * garantizando SIEMPRE la interpretación correcta en la zona horaria ecuatoriana (America/Guayaquil).
 */
export function parseSafeDate(
  value: unknown,
  view: DatePickerView = 'date'
): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // 1. Instancia de Date
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    // Si fue parseado como medianoche UTC desde "YYYY-MM-DD", evitar desplazamiento de día
    if (
      value.getUTCHours() === 0 &&
      value.getUTCMinutes() === 0 &&
      value.getUTCSeconds() === 0 &&
      value.getUTCMilliseconds() === 0
    ) {
      return new Date(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      );
    }
    // Para cualquier otro Date (ej: new Date()), extraer componentes en zona horaria de Ecuador
    const { year, month, day } = getEcuadorDateParts(value);
    return new Date(year, month, day);
  }

  // 2. Si es timestamp numérico
  if (typeof value === 'number') {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const { year, month, day } = getEcuadorDateParts(d);
    return new Date(year, month, day);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.toLowerCase().includes('invalid')
  ) {
    return null;
  }

  // 3. Cadena YYYY-MM-DD pura o serializada con medianoche UTC (ej: "2026-11-22T00:00:00.000Z")
  const pureDateMatch = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ]00:00:00(?:\.000)?(?:Z|[+-]00:?00)?)?$/
  );
  if (pureDateMatch) {
    const year = Number(pureDateMatch[1]);
    const month = Number(pureDateMatch[2]) - 1;
    const day = Number(pureDateMatch[3]);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // 4. Cadena YYYY-MM pura (mes)
  const monthMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (view === 'month' && monthMatch) {
    const year = Number(monthMatch[1]);
    const month = Number(monthMatch[2]) - 1;
    const d = new Date(year, month, 1);
    return isNaN(d.getTime()) ? null : d;
  }

  // 5. Cadena YYYY pura (año)
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (view === 'year' && yearMatch) {
    const year = Number(yearMatch[1]);
    const d = new Date(year, 0, 1);
    return isNaN(d.getTime()) ? null : d;
  }

  // 6. Cadena ISO con hora/minutos o formato parseable por Date: extraer fecha en Ecuador
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const { year, month, day } = getEcuadorDateParts(parsed);
    return new Date(year, month, day);
  }

  return null;
}

/**
 * Normaliza cualquier entrada de fecha (Date, ISO string, timestamp) a un string
 * canónico 'YYYY-MM-DD' en la zona horaria oficial de Ecuador.
 */
export function normalizeDateToCanonicalString(
  value: string | Date | number | null | undefined
): string | null {
  if (value === null || value === undefined || value === '') return null;
  const d = parseSafeDate(value, 'date');
  if (!d || isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Factoría que genera una política inmutable de restricciones de fecha.
 */
export function createDateConstraintPolicy(
  constraints: DateConstraintProps = {}
): IDateConstraintPolicy {
  // 1. Extraer límites directos o aliases
  const rawMin = constraints.minDate ?? constraints.min;
  const rawMax = constraints.maxDate ?? constraints.max;

  const directMinStr = normalizeDateToCanonicalString(rawMin);
  const directMaxStr = normalizeDateToCanonicalString(rawMax);

  // 2. Extraer límites del allowedRange explícito si existe
  const allowedRange = constraints.allowedRange;
  const allowedStartStr = allowedRange
    ? normalizeDateToCanonicalString(allowedRange.start)
    : null;
  const allowedEndStr = allowedRange
    ? normalizeDateToCanonicalString(allowedRange.end)
    : null;

  // 3. Intersección canónica del límite mínimo y máximo
  const minCandidates = [directMinStr, allowedStartStr].filter(
    (s): s is string => Boolean(s)
  );
  const effectiveMinDateStr =
    minCandidates.length > 0 ? minCandidates.sort().pop()! : null;

  const maxCandidates = [directMaxStr, allowedEndStr].filter(
    (s): s is string => Boolean(s)
  );
  const effectiveMaxDateStr =
    maxCandidates.length > 0 ? maxCandidates.sort()[0]! : null;

  // Derivados de mes y año
  const minMonthStr = effectiveMinDateStr ? effectiveMinDateStr.slice(0, 7) : null;
  const maxMonthStr = effectiveMaxDateStr ? effectiveMaxDateStr.slice(0, 7) : null;
  const minYear = effectiveMinDateStr ? Number(effectiveMinDateStr.slice(0, 4)) : null;
  const maxYear = effectiveMaxDateStr ? Number(effectiveMaxDateStr.slice(0, 4)) : null;

  // 4. Múltiples allowedRanges
  const normalizedAllowedRanges: Array<{ start: string | null; end: string | null }> = [];
  if (constraints.allowedRanges && constraints.allowedRanges.length > 0) {
    for (const r of constraints.allowedRanges) {
      normalizedAllowedRanges.push({
        start: normalizeDateToCanonicalString(r.start),
        end: normalizeDateToCanonicalString(r.end)
      });
    }
  }

  // 5. Conjunto O(1) de fechas inhabilitadas puntuales
  const disabledDatesSet = new Set<string>();
  if (constraints.disabledDates && constraints.disabledDates.length > 0) {
    for (const d of constraints.disabledDates) {
      const canonical = normalizeDateToCanonicalString(d);
      if (canonical) disabledDatesSet.add(canonical);
    }
  }

  const customPredicate = constraints.isDateDisabled;

  return {
    minDateStr: effectiveMinDateStr,
    maxDateStr: effectiveMaxDateStr,
    minMonthStr,
    maxMonthStr,
    minYear,
    maxYear,

    isDayDisabled(year: number, monthIndex: number, day: number): boolean {
      const dateStr = `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

      // 1. Min Date boundary
      if (effectiveMinDateStr && dateStr < effectiveMinDateStr) {
        return true;
      }

      // 2. Max Date boundary
      if (effectiveMaxDateStr && dateStr > effectiveMaxDateStr) {
        return true;
      }

      // 3. Multi-range check (allowedRanges)
      if (normalizedAllowedRanges.length > 0) {
        const inAnyRange = normalizedAllowedRanges.some((r) => {
          if (r.start && dateStr < r.start) return false;
          if (r.end && dateStr > r.end) return false;
          return true;
        });
        if (!inAnyRange) return true;
      }

      // 4. Specific disabled dates set
      if (disabledDatesSet.has(dateStr)) {
        return true;
      }

      // 5. Custom business rule predicate
      if (customPredicate) {
        const dateObj = new Date(year, monthIndex, day);
        if (customPredicate(dateObj, dateStr)) {
          return true;
        }
      }

      return false;
    },

    isDateDisabled(
      dateOrStr: Date | string | null | undefined,
      view?: 'date' | 'month' | 'year'
    ): boolean {
      if (!dateOrStr) return false;

      // Evaluación en vista de meses o formato YYYY-MM
      if (
        view === 'month' ||
        (typeof dateOrStr === 'string' && /^\d{4}-\d{2}$/.test(dateOrStr.trim()))
      ) {
        let year: number;
        let monthIndex: number;
        if (dateOrStr instanceof Date) {
          year = dateOrStr.getFullYear();
          monthIndex = dateOrStr.getMonth();
        } else if (typeof dateOrStr === 'number') {
          const d = new Date(dateOrStr);
          year = d.getFullYear();
          monthIndex = d.getMonth();
        } else {
          const match = String(dateOrStr).trim().match(/^(\d{4})-(\d{2})/);
          if (match) {
            year = parseInt(match[1], 10);
            monthIndex = parseInt(match[2], 10) - 1;
          } else {
            const canonical = normalizeDateToCanonicalString(dateOrStr);
            if (!canonical) return false;
            const [y, m] = canonical.split('-').map(Number);
            year = y;
            monthIndex = m - 1;
          }
        }
        return this.isMonthDisabled(year, monthIndex);
      }

      // Evaluación en vista de años o formato YYYY
      if (
        view === 'year' ||
        (typeof dateOrStr === 'string' && /^\d{4}$/.test(dateOrStr.trim()))
      ) {
        let year: number;
        if (dateOrStr instanceof Date) {
          year = dateOrStr.getFullYear();
        } else if (typeof dateOrStr === 'number') {
          year = new Date(dateOrStr).getFullYear();
        } else {
          year = parseInt(String(dateOrStr).trim().substring(0, 4), 10);
        }
        return isNaN(year) ? false : this.isYearDisabled(year);
      }

      const canonical = normalizeDateToCanonicalString(dateOrStr);
      if (!canonical) return false;

      const [y, m, d] = canonical.split('-').map(Number);
      return this.isDayDisabled(y, m - 1, d);
    },

    isMonthDisabled(year: number, monthIndex: number): boolean {
      const monthStr = `${year}-${pad(monthIndex + 1)}`;

      if (minMonthStr && monthStr < minMonthStr) {
        return true;
      }
      if (maxMonthStr && monthStr > maxMonthStr) {
        return true;
      }

      // Rango hábil (normalizedAllowedRanges): el mes debe tener al menos un día que caiga en algún rango
      if (normalizedAllowedRanges.length > 0) {
        const monthStart = `${monthStr}-01`;
        const lastDay = new Date(year, monthIndex + 1, 0).getDate();
        const monthEnd = `${monthStr}-${pad(lastDay)}`;
        const hasOverlap = normalizedAllowedRanges.some(
          (r) =>
            (!r.start || r.start <= monthEnd) && (!r.end || r.end >= monthStart)
        );
        if (!hasOverlap) {
          return true;
        }
      }

      return false;
    },

    isYearDisabled(year: number): boolean {
      if (minYear !== null && year < minYear) {
        return true;
      }
      if (maxYear !== null && year > maxYear) {
        return true;
      }

      // Rango hábil (normalizedAllowedRanges): el año debe tener al menos un día que caiga en algún rango
      if (normalizedAllowedRanges.length > 0) {
        const yearStart = `${year}-01-01`;
        const yearEnd = `${year}-12-31`;
        const hasOverlap = normalizedAllowedRanges.some(
          (r) =>
            (!r.start || r.start <= yearEnd) && (!r.end || r.end >= yearStart)
        );
        if (!hasOverlap) {
          return true;
        }
      }

      return false;
    },

    isPrevNavDisabled(currentMonth: Date, view = 'date'): boolean {
      if (view === 'date') {
        if (!minMonthStr) return false;
        // Last day of previous month
        const prevMonthDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          0
        );
        const prevMonthLastDayStr = `${prevMonthDate.getFullYear()}-${pad(prevMonthDate.getMonth() + 1)}-${pad(prevMonthDate.getDate())}`;
        return Boolean(effectiveMinDateStr && prevMonthLastDayStr < effectiveMinDateStr);
      }

      if (view === 'month') {
        if (minYear === null) return false;
        return currentMonth.getFullYear() - 1 < minYear;
      }

      if (view === 'year') {
        if (minYear === null) return false;
        const startYear = Math.floor(currentMonth.getFullYear() / 12) * 12;
        return startYear - 1 < minYear;
      }

      return false;
    },

    isNextNavDisabled(currentMonth: Date, view = 'date'): boolean {
      if (view === 'date') {
        if (!maxMonthStr) return false;
        // First day of next month
        const nextMonthDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        );
        const nextMonthFirstDayStr = `${nextMonthDate.getFullYear()}-${pad(nextMonthDate.getMonth() + 1)}-01`;
        return Boolean(effectiveMaxDateStr && nextMonthFirstDayStr > effectiveMaxDateStr);
      }

      if (view === 'month') {
        if (maxYear === null) return false;
        return currentMonth.getFullYear() + 1 > maxYear;
      }

      if (view === 'year') {
        if (maxYear === null) return false;
        const startYear = Math.floor(currentMonth.getFullYear() / 12) * 12;
        return startYear + 12 > maxYear;
      }

      return false;
    }
  };
}
