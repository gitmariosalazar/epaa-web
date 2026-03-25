import type {
  Connection,
  ConnectionWithProperty,
  Rate
} from '../models/Connection';

export interface ConnectionRepository {
  getConnections(limit: number, offset: number): Promise<Connection[]>;
  createConnection(connection: CreateConnectionRequest): Promise<Connection>;
  updateConnection(
    id: string,
    connection: UpdateConnectionRequest
  ): Promise<Connection>;
  deleteConnection(id: string): Promise<void>;
  getRates(): Promise<Rate[]>;
  findConnectionWithPropertyByCadastralKey(
    cadastralKey: string
  ): Promise<ConnectionWithProperty | null>;
  findConnectionsBySector(
    sector: string,
    limit: number,
    offset: number
  ): Promise<Connection[]>;
  findAllConnectionsByClientId(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Connection[]>;
}

export interface CreateConnectionRequest {
  connectionId: string;
  clientId: string;
  connectionRateId: number;
  connectionRateName: string;
  connectionMeterNumber: string;
  connectionContractNumber: string;
  connectionSewerage: boolean;
  connectionStatus: boolean;
  connectionAddress: string;
  connectionInstallationDate: Date;
  connectionPeopleNumber: number;
  connectionZone: number;
  longitude: number;
  latitude: number;
  connectionReference: string;
  ConnectionMetaData: { [key: string]: any };
  connectionAltitude: number;
  connectionPrecision: number;
  connectionGeolocationDate: Date;
  connectionGeometricZone: string;
  propertyCadastralKey: string;
  zoneId: number;
}

export interface UpdateConnectionRequest {
  connectionId: string;
  clientId: string;
  connectionRateId: number;
  connectionRateName: string;
  connectionMeterNumber: string;
  connectionContractNumber: string;
  connectionSewerage: boolean;
  connectionStatus: boolean;
  connectionAddress: string;
  connectionInstallationDate: Date;
  connectionPeopleNumber: number;
  connectionZone: number;
  longitude: number;
  latitude: number;
  connectionReference: string;
  ConnectionMetaData: { [key: string]: any };
  connectionAltitude: number;
  connectionPrecision: number;
  connectionGeolocationDate: Date;
  connectionGeometricZone: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  propertyCadastralKey: string;
  zoneId: number;
}
