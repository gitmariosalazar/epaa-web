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
