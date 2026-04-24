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

/**
 * Formats a date and time into DD-MM-YYYY HH:mm format.
 *
 * @param date - The date to format
 * @param includeSeconds - Whether to include seconds (DD-MM-YYYY HH:mm:ss)
 * @returns Formatted date and time string or '-' if invalid
 */
export const ConverDateTime = (date: string | Date | null | undefined, includeSeconds: boolean = false): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '-';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  if (includeSeconds) {
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Formats a date into a readable Spanish text format (e.g., "24 de abril de 2026").
 *
 * @param date - The date to format
 * @returns Formatted string in text or '-' if invalid
 */
export const ConverDateToText = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  let dateObj: Date;

  if (typeof date === 'string') {
    // Para evitar desfases de zona horaria con fechas "YYYY-MM-DD" sin hora
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return '-';

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} de ${month} de ${year}`;
};

/**
 * Formats a date and time into a readable Spanish text format with time (e.g., "24 de abril de 2026, 14:30").
 *
 * @param date - The date to format
 * @returns Formatted date and time string in text or '-' if invalid
 */
export const ConverDateTimeToText = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '-';

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day} de ${month} de ${year}, ${hours}:${minutes}`;
};
