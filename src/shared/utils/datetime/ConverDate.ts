/**
 * Formats a date (string or Date object) into DD-MM-YYYY format.
 * Includes padding for days/months and handles timezone shifts for date-only strings.
 *
 * @param date - The date to format
 * @returns Formatted date string (DD-MM-YYYY) or '-' if invalid
 */
export const ConverDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  let dateObj: Date;

  if (typeof date === 'string') {
    // Handle YYYY-MM-DD pattern to avoid timezone shifts
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      // Split by 'T' or space to get the date part
      const datePart = date.split(/[T ]/)[0];
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
      }
    }
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return '-';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};
