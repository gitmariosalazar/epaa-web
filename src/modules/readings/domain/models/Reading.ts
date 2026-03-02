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

export interface PendingReadingConnection {
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  rateName: string;
  averageConsumption: number;
}

export interface TakenReadingConnection {
  readingId: string;
  readingDate: Date | null;
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  previousReading: number;
  currentReading: number;
  readingValue: number;
  calculatedConsumption: number;
  averageConsumption: number;
  rateName: string;
  readingTypeId: number;
  readingTypeName: string;
  novelty?: string;
}
