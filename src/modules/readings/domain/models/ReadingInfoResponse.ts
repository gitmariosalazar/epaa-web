export interface phones {
  telefonoid: number;
  numero: string;
}

export interface emails {
  emailid: number;
  email: string;
}

export interface ReadingInfo {
  readingId: number;
  previousReadingDate: Date | null;
  readingTime: Date | null;
  cadastralKey: string;
  cardId: string;
  clientName: string;
  clientPhones: phones[];
  clientEmails: emails[];
  address: string;
  previousReading: number;
  currentReading: number | null;
  sector: number;
  account: number;
  readingValue: number;
  averageConsumption: number;
  meterNumber: string;
  rateId: number;
  rateName: string;
  hasCurrentReading: boolean;
  monthReading: string;
  startDatePeriod: Date;
  endDatePeriod: Date;
}
