import type { TakenReadingConnection } from '../models/Reading';

export interface TakenReadingConnectionRepository {
  getTakenReadingsByMonth(
    dateMonth: string,
    sector?: number
  ): Promise<TakenReadingConnection[]>;

  getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number
  ): Promise<TakenReadingConnection[]>;
}
