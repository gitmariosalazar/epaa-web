export class DateRangeParams {
  public startDate: string; // ISO string: '2026-02-01T00:00:00.000Z'
  public endDate: string; // ISO string: '2026-02-28T23:59:59.999Z'

  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export type dateFilter = 'paymentDate' | 'incomeDate';
export class GeneralCollectionsParams {
  dateFilter?: dateFilter;
  year?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  titleCode?: string; // Cod_Titulo_Datos
  limit?: number; // Para paginación, opcional
  offset?: number; // Para paginación, opcional
}

export class GeneralTrendCollectionsParams {
  dateFilter?: dateFilter;
  startYear?: number;
  endYear?: number;
  titleCode?: string;
  limit?: number;
  offset?: number;
}
