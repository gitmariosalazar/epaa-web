import type { LecturaRecord } from './lecturas-source.repository';

export interface LecturasTargetRepository {
  recreateTable(): Promise<void>;
  bulkInsert(records: LecturaRecord[], batchSize: number): Promise<number>;
  findAll(): Promise<LecturaRecord[]>;
}
