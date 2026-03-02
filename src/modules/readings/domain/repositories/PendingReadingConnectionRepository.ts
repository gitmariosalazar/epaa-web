import type { PendingReadingConnection } from '../models/Reading';

export interface PendingReadingConnectionRepository {
  getPendingReadingsByMonth(
    dateMonth: string,
    sector?: number
  ): Promise<PendingReadingConnection[]>;
}
