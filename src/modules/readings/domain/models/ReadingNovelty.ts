export interface ReadingNovelty {
  readingId: number;
  readingDate: Date | null;
  readingMonth: string;
  readingTime: string | null;
  cadastralKey: string;
  meterNumber: string;
  address: string;
  sector: number;
  account: number;
  clientName: string;
  cardId: string;
  previousReading: number;
  currentReading: number | null;
  readingValue: number | null;
  calculatedConsumption: number | null;
  averageConsumption: number | null;
  rateName: string;
  readingTypeId: number;
  readingTypeName: string;
  novelty: string;
  noveltyTypeId: number | null;
  noveltyTypeName: string | null;
  noveltyTypeDescription: string | null;
  images: string[];
}
