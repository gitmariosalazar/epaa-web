import type {
  ReadingDetailed,
  ReadingInfo
} from '../models/ReadingInfoResponse';

export interface ReadingInfoRepository {
  getReadingInfo(cadastralKey: string): Promise<ReadingInfo[]>;
  getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string
  ): Promise<ReadingDetailed | null>;
}
