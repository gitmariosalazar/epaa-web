import type { Connection } from '../models/Connection';

export interface ConnectionRepository {
  getConnections(limit: number, offset: number): Promise<Connection[]>;
  createConnection(
    connection: Omit<Connection, 'connectionId'>
  ): Promise<Connection>;
  updateConnection(
    id: string,
    connection: Partial<Connection>
  ): Promise<Connection>;
  deleteConnection(id: string): Promise<void>;
}
