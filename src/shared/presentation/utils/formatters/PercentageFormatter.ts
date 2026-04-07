export class PercentageFormatter {
  private static readonly DEFAULT_LOCALE = 'es-EC';

  /**
   * Formats a value as a percentage string (e.g., "50%").
   * @param value The numerical value to format.
   * @returns Formatted percentage string.
   */
  static format(value: number | string | null | undefined): string {
    const num = Number(value || 0);
    return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  /**
   * Formats a value as a percentage string with decimals (e.g., "50.25%").
   * @param value The numerical value to format.
   * @returns Formatted percentage string.
   */
  static formatWithDecimals(value: number | string | null | undefined): string {
    const num = Number(value || 0);
    return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  /**
   * Formats a value as a percentage string with thousands separators (e.g., "1,234.56%").
   * @param value The numerical value to format.
   * @returns Formatted percentage string.
   */
  static formatWithThousandsSeparators(
    value: number | string | null | undefined
  ): string {
    const num = Number(value || 0);
    return new Intl.NumberFormat(this.DEFAULT_LOCALE, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
}
