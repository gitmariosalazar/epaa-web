export interface ReadingHistory {
  readingId: number;
  connectionId: string;
  readingYear: number;
  readingMonth: string;
  readingDate: Date;
  readingTime: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  observation: string;
}
