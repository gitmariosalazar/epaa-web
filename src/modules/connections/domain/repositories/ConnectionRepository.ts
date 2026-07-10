import type {
  Connection,
  ConnectionAndPropertyResponse,
  ConnectionWithProperty,
  Rate
} from '../models/Connection';
import type {
  DashboardAdvanceResponse,
  LiveMapConnectionResponse
} from '../models/DashboardStats';

export interface ConnectionRepository {
  getAdvanceDashboardStats(): Promise<DashboardAdvanceResponse>;

  getLiveUpdateMapConnections(): Promise<LiveMapConnectionResponse[]>;
  getConnections(
    limit: number,
    offset: number,
    query?: string,
    hasIncidents?: 'yes' | 'no',
    status?: string,
    sewerage?: 'yes' | 'no',
    hasCoordinates?: 'yes' | 'no',
    searchField?: string
  ): Promise<Connection[]>;
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
  findConnectionAndPropertyByCadastralKeyOrCardId(
    searchValue: string
  ): Promise<ConnectionAndPropertyResponse[]>;
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
