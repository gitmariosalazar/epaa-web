import type { LecturasSourceRepository } from '@/modules/readings/domain/repositories/lecturas-source.repository';
import type { LecturasTargetRepository } from '@/modules/readings/domain/repositories/lecturas-target.repository';

const DEFAULT_MONTHS = ['2026-07', '2026-06', '2026-05', '2026-04', '2026-03'];
const BATCH_SIZE = 500;
const TARGET_TABLE_NAME = 'dbo.lecturas_postgres';

export interface MigrationResult {
  targetTable: string;
  totalRecords: number;
  insertedRecords: number;
  durationMs: number;
}

export class MigrateLecturasUseCase {
  private readonly sourceRepository: LecturasSourceRepository;
  private readonly targetRepository: LecturasTargetRepository;

  constructor(
    sourceRepository: LecturasSourceRepository,
    targetRepository: LecturasTargetRepository
  ) {
    this.sourceRepository = sourceRepository;
    this.targetRepository = targetRepository;
  }

  async execute(months: string[] = DEFAULT_MONTHS): Promise<MigrationResult> {
    const startedAt = Date.now();
    try {
      console.log('Leyendo lecturas desde PostgreSQL...');
      const records = await this.sourceRepository.findLecturasByMonths(months);

      if (records.length === 0) {
        console.warn('No hay registros para migrar.');
        return {
          targetTable: TARGET_TABLE_NAME,
          totalRecords: 0,
          insertedRecords: 0,
          durationMs: Date.now() - startedAt
        };
      }

      console.log(`Recreando tabla destino "${TARGET_TABLE_NAME}"...`);
      await this.targetRepository.recreateTable();

      console.log(
        `Insertando ${records.length} registros en lotes de ${BATCH_SIZE}...`
      );
      const totalInserted = await this.targetRepository.bulkInsert(
        records,
        BATCH_SIZE
      );

      return {
        targetTable: TARGET_TABLE_NAME,
        totalRecords: records.length,
        insertedRecords: totalInserted,
        durationMs: Date.now() - startedAt
      };
    } catch (error) {
      console.error('Error durante la migración de lecturas', error);
      throw new Error((error as Error).message);
    }
  }
}
