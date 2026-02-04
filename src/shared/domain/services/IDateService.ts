export interface IDateService {
  /**
   * Returns the current date in Ecuador timezone.
   */
  getCurrentDate(): Date;

  /**
   * Returns the current date as a string in YYYY-MM-DD format (Ecuador time).
   */
  getCurrentDateString(): string;

  /**
   * Returns the current month as a string in YYYY-MM format (Ecuador time).
   */
  getCurrentMonthString(): string;

  /**
   * Formats a date to a locale string representing Ecuador time.
   * @param date Date, string, or number to format
   * @param options Intl.DateTimeFormatOptions
   */
  formatToLocaleString(
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string;

  /**
   * Formats a date to ISO string (YYYY-MM-DD) respecting Ecuador time.
   * Useful for input[type="date"] values.
   */
  toISODateString(date: Date | string | number): string;
}
