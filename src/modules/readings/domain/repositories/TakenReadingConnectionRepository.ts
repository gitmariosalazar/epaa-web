import type { TakenReadingConnection } from '../models/Reading';

export interface TakenReadingConnectionRepository {
  getTakenReadingsByMonth(
    dateMonth: string,
    sector?: number,
    userId?: string,
    date?: string
  ): Promise<TakenReadingConnection[]>;

  getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number,
    userId?: string,
    date?: string
  ): Promise<TakenReadingConnection[]>;
}
