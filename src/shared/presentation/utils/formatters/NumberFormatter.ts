/**
 * Professional utility class for general number formatting.
 * Adheres to Clean Architecture by providing a single source of truth for numeric representation.
 */
export class NumberFormatter {
  private static readonly DEFAULT_LOCALE = 'es-EC';

  /**
   * Formats a value with locale-aware thousand separators. (With decimals, e.g. 1.000,00)
   * @param value The numerical value to format.
   * @param decimals Whether to show decimals (default: 0).
   * @returns Formatted number string.
   */
  static format(
    value: number | string | null | undefined,
    decimals = 0
  ): string {
    const num = Number(value || 0);
    return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  /**
   * Rounds a value and formats it without decimals. (No decimals, e.g. 1.000)
   * @param value The numerical value to format.
   * @returns Formatted integer string.
   */
  static formatInteger(value: number | string | null | undefined): string {
    const num = Math.round(Number(value || 0));
    return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  /**
   * Formats raw client/entity counts with clarity. (No decimals, e.g. 1.000)
   */
  static formatCount(value: number | string | null | undefined): string {
    return this.formatInteger(value);
  }
}
