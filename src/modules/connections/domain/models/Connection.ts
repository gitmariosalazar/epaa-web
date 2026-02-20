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
  connectionCoordinates: string;
  connectionReference: string;
  connectionMetaData: Record<string, any>;
  connectionAltitude: number;
  connectionPrecision: number;
  connectionGeolocationDate: Date;
  connectionGeometricZone: string;
  propertyCadastralKey: string;
  zoneId: number;
}
