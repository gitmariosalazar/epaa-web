import type { ReadingInfo } from '../models/ReadingInfoResponse';

export interface ReadingInfoRepository {
  getReadingInfo(cadastralKey: string): Promise<ReadingInfo[]>;
}
