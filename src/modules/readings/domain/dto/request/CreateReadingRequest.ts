export interface CreateReadingRequest {
  connectionId: string;
  sector: number;
  account: number;
  cadastralKey: string;
  sewerRate: number;
  previousReading: number;
  currentReading: number;
  incomeCode: number;
  readingDate: Date;
  readingTime: string;
  readingValue: number;
  rentalIncomeCode: number;
  novelty: string | null;
  averageConsumption: number;
  typeNoveltyReadingId: number;
  previousMonthReading: string;
  newCurrentReading: number;
}
