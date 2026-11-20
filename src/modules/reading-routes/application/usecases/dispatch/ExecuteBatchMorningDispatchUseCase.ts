import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';
import type { BatchMorningDispatchRequest } from '../../../domain/dto/request/route-requests.dto';
import type {
  BatchDispatchResponse,
  BatchDispatchProgress,
} from '../../../domain/dto/response/route-responses.dto';
import type { DispatchedRouteSummary } from '../../../domain/models/RouteAssignment';

/**
 * Caso de uso: ExecuteBatchMorningDispatchUseCase
 *
 * Principios SOLID y Clean Architecture:
 * - SRP: Orquestar el despacho matutino dividiendo solicitudes masivas en lotes seguros
 *        (Chunking) para evitar sobrecarga o caída del microservicio backend.
 * - DIP: Depende de la abstracción `RouteDispatchRepository`.
 * - OCP: Extensible para emitir progreso en tiempo real mediante callbacks (Observer Pattern).
 */
export class ExecuteBatchMorningDispatchUseCase {
  private readonly repository: RouteDispatchRepository;
  private readonly defaultChunkSize = 6; // Lote seguro de rutas por petición (evita OOM y lock timeouts)

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(
    request: BatchMorningDispatchRequest,
    onProgress?: (progress: BatchDispatchProgress) => void,
  ): Promise<BatchDispatchResponse> {
    const asignaciones = request.asignaciones;

    // Si no hay asignaciones manuales o la cantidad es pequeña (<= 6), despachar directamente
    if (!asignaciones || asignaciones.length <= this.defaultChunkSize) {
      const response = await this.repository.executeBatchMorningDispatch(request);
      if (asignaciones && asignaciones.length > 0) {
        onProgress?.({
          completed: asignaciones.length,
          total: asignaciones.length,
          currentChunk: 1,
          totalChunks: 1,
          percent: 100,
        });
      }
      return response;
    }

    // Estrategia de Chunking para lotes masivos (ej: 79 rutas)
    const total = asignaciones.length;
    const chunkSize = this.defaultChunkSize;
    const chunks: Array<typeof asignaciones> = [];

    for (let i = 0; i < total; i += chunkSize) {
      chunks.push(asignaciones.slice(i, i + chunkSize));
    }

    const totalChunks = chunks.length;
    let completedRoutes = 0;
    let totalAcometidas = 0;
    const allRutasDespachadas: DispatchedRouteSummary[] = [];

    // Notificar inicio
    onProgress?.({
      completed: 0,
      total,
      currentChunk: 1,
      totalChunks,
      percent: 0,
    });

    for (let i = 0; i < totalChunks; i++) {
      const chunkAsignaciones = chunks[i];
      const chunkLecturistaIds = Array.from(
        new Set(chunkAsignaciones.map((a) => a.lecturistaId).filter(Boolean)),
      );

      const chunkRequest: BatchMorningDispatchRequest = {
        ...request,
        asignaciones: chunkAsignaciones,
        lecturistaIds: chunkLecturistaIds,
      };

      const chunkResponse =
        await this.repository.executeBatchMorningDispatch(chunkRequest);

      const rutasCount =
        chunkResponse?.totalRutasAsignadas || chunkAsignaciones.length;
      completedRoutes += rutasCount;
      totalAcometidas += chunkResponse?.totalAcometidasDespachadas || 0;

      if (chunkResponse?.rutasDespachadas) {
        allRutasDespachadas.push(...chunkResponse.rutasDespachadas);
      }

      const percent = Math.min(
        100,
        Math.round((completedRoutes / total) * 100),
      );

      onProgress?.({
        completed: completedRoutes,
        total,
        currentChunk: i + 1,
        totalChunks,
        percent,
      });
    }

    return {
      success: true,
      message: `Despacho completado con éxito: ${completedRoutes} rutas asignadas (${totalAcometidas} medidores).`,
      periodo: request.periodo,
      totalRutasAsignadas: completedRoutes,
      totalAcometidasDespachadas: totalAcometidas,
      rutasDespachadas: allRutasDespachadas,
    };
  }
}
