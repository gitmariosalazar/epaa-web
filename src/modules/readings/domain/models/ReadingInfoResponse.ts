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
  readingDate: string | null;
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
  connectionStateId: number;
  connectionStateName: string;
  connectionStateDescription: string;
  permitReading: boolean;
  connectionLocation?: { lat: number; lng: number } | null;
  images?: { id: number; path: string; novelty: string }[];
  observations?: { id: number; title: string; observation: string }[];
  readingLocation?: { lat: number; lng: number } | null;
}

export interface ReadingDetailed {
  readingId: number;
  readingTime: string | null;
  readingDate: Date | null;
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
  readingMonth: string;
  readingMonthName: string;
  novelty: string;
  consumption: number;
  startDatePeriod: Date;
  endDatePeriod: Date;
  connectionStateId: number;
  connectionStateName: string;
  connectionStateDescription: string;
  permitReading: boolean;
  connectionLocation?: { lat: number; lng: number } | null;
  images?: { id: number; path: string; novelty: string }[];
  observations?: { id: number; title: string; observation: string }[];
  readingLocation?: { lat: number; lng: number } | null;
}
