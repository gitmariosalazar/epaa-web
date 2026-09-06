import type { HistorialAjusteLectura } from '../models/Reading';

export interface GetReadingAdjustmentHistoryByReadingIdRepository {
  getReadingAdjustmentHistoryByReadingId(
    readingId: number
  ): Promise<HistorialAjusteLectura[]>;
}
