/**
 * CheckReadingMonthUseCase
 *
 * Capa:   Application (Clean Architecture)
 * Patrón: Use Case / Interactor
 *
 * Principios SOLID aplicados:
 *  SRP – Una única responsabilidad: determinar si una lectura pertenece
 *         al mes en curso.
 *  OCP – La lógica de comparación puede extenderse sin modificar la firma.
 *  DIP – No depende de ningún servicio externo ni de infraestructura.
 *
 * @param monthReading  Cadena en formato "YYYY-MM" (ej.: "2026-04")
 * @returns `true` si el mes de la lectura coincide con el mes actual,
 *          `false` si es de un mes anterior (o futuro).
 */
export const checkReadingIsCurrentMonth = (monthReading: string): boolean => {
  if (!monthReading) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() es 0-indexed

  const [yearStr, monthStr] = monthReading.split('-');
  const readingYear = parseInt(yearStr, 10);
  const readingMonth = parseInt(monthStr, 10);

  if (isNaN(readingYear) || isNaN(readingMonth)) return false;

  return readingYear === currentYear && readingMonth === currentMonth;
};

/**
 * Retorna el mes de una lectura en formato legible (ej.: "abril 2026")
 */
export const formatReadingMonth = (monthReading: string): string => {
  if (!monthReading) return 'Desconocido';

  const [yearStr, monthStr] = monthReading.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (isNaN(year) || isNaN(month)) return monthReading;

  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};
