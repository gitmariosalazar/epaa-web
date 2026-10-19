export interface UpdateReadingRequest {
  previousReading: number;
  currentReading: number;
  rentalIncomeCode: number;
  novelty: string;
  meterStatus: string;
  incomeCode: number;
  cadastralKey: string;
  sector: number;
  account: number;
  connectionId: string;
  averageConsumption: number;
  readingMonth: string;
}
