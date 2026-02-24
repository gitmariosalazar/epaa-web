export interface ReadingResponse {
  readingId: number;
  connectionId: string;
  readingDate: Date | null;
  readingTime: string | null;
  sector: number;
  account: number;
  cadastralKey: string;
  readingValue: number | null;
  sewerRate: number | null;
  previousReading: number | null;
  currentReading: number | null;
  rentalIncomeCode: number | null;
  novelty: string | null;
  incomeCode: number | null;
}
