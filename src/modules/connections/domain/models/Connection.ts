import type { Property } from '@/modules/properties/domain/models/Property';

export interface Connection {
  connectionId: string;
  clientId: string;
  connectionRateId: number;
  connectionRateName: string;
  connectionMeterNumber: string;
  connectionSector: number;
  connectionAccount: number;
  connectionCadastralKey: string;
  connectionContractNumber: string;
  connectionSewerage: boolean;
  connectionStatus: boolean;
  connectionAddress: string;
  connectionInstallationDate: Date;
  connectionPeopleNumber: number;
  connectionZone: number;
  longitude: number;
  latitude: number;
  connectionCoordinates: string;
  connectionReference: string;
  ConnectionMetaData: Record<string, any>;
  connectionAltitude: number;
  connectionPrecision: number;
  connectionGeolocationDate: Date;
  connectionGeometricZone: string;
  propertyCadastralKey: string;
  zoneId: number;
}

export interface Rate {
  rateId: number;
  rateName: string;
  rateDescription: string;
  effectiveDate: Date;
  endDate: Date | null;
}

export interface ConnectionWithProperty {
  // Connection Data
  connectionId: string;
  clientId: string;
  connectionRateId: string;
  connectionRateName: string;
  connectionMeterNumber: string | null;
  connectionSector: string | null;
  connectionAccount: string | null;
  connectionCadastralKey: string | null;
  connectionContractNumber: string | null;
  connectionSewerage: boolean | null;
  connectionStatus: string | null;
  connectionAddress: string | null;
  connectionInstallationDate: string | Date | null;
  connectionPeopleNumber: number | null;
  connectionZone: string | null;
  longitude: number | null;
  latitude: number | null;
  connectionCoordinates: string | null;
  connectionReference: string | null;
  connectionMetadata: Record<string, any> | null;
  connectionAltitude: number | null;
  connectionPrecision: number | null;
  connectionGeolocationDate: string | Date | null;
  connectionGeometricZone: string | null;
  propertyCadastralKey: string | null;
  zoneId: number;
  zoneCode: string;
  zoneName: string;
  // Client Data
  company: Company | null;
  person: Client | null;
  // Property Data
  properties: Property[];
}

export interface Client {
  address: string;
  country: string;
  genderId: number;
  lastName: string;
  parishId: string;
  personId: string;
  birthDate: string;
  firstName: string;
  isDeceased: boolean;
  professionId: number;
  civilStatusId: number;
  phones: Phone[];
  emails: Email[];
}

export interface Company {
  ruc: string;
  address: string;
  country: string;
  clientId: string;
  parishId: string;
  companyId: number;
  businessName: string;
  commercialName: string;
  phones: Phone[];
  emails: Email[];
}

export interface Phone {
  telefonoid: number;
  numero: string;
}

export interface Email {
  emailid: number;
  email: string;
}
