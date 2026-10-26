/**
 * Professional utility class for currency formatting.
 * Adheres to Clean Architecture by providing a single source of truth for financial presentation.
 */
export class CurrencyFormatter {
  private static readonly DEFAULT_LOCALE = 'es-EC';
  private static readonly DEFAULT_CURRENCY = 'USD';

  /**
   * Formats a value as a standard currency string ($1,234.56).
   * @param value The numerical value to format.
   * @param showDecimals Whether to show decimal places (default: true).
   * @returns Formatted currency string.
   */
  static format(
    value: number | string | null | undefined,
    showDecimals = true
  ): string {
    const num = Number(value || 0);
    const formatted = new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      style: 'currency',
      currency: this.DEFAULT_CURRENCY,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(num);

    // Corrige el patrón por defecto de 'es-EC' donde el signo menos queda después del '$' (ej. '$-4,22' -> '-$4,22')
    return formatted.replace(/^(\$)\s*-/, '-$1');
  }

  /**
   * Formats a value into a small currency string for charts (e.g., $1.2k).
   * @param value The numerical value to format.
   * @returns Formatted small string.
   */
  static formatCompact(value: number | string | null | undefined): string {
    const num = Number(value || 0);
    if (!num) return '$0';

    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);

    if (abs >= 1000000) {
      return `${sign}$${(abs / 1000000).toFixed(1)}M`;
    }
    if (abs >= 1000) {
      return `${sign}$${(abs / 1000).toFixed(1)}k`;
    }
    return `${sign}$${abs.toFixed(0)}`;
  }

  /**
   * Specifically for Y-Axis ticks where precision is less important than brevity. (No decimal)
   */
  static formatAxis(value: number | string | null | undefined): string {
    const num = Number(value || 0);
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);

    if (abs >= 1000) {
      return `${sign}$${(abs / 1000).toFixed(0)}k`;
    }
    return `${sign}$${abs.toFixed(0)}`;
  }
}
