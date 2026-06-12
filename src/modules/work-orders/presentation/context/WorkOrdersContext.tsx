/**
 * WorkOrdersContext
 *
 * Clean Architecture — Presentation layer context.
 * Espejo exacto de SolicitudesContext para el módulo de OTs.
 *
 * SOLID:
 *   SRP: provee y mantiene la lista de OTs cargadas por solicitud.
 *   DIP: consume ProcessWorkOrderRepository a través de UseCase.
 *   OCP: añadir nueva query = añadir UseCase, no modificar el contexto.
 *
 * Nota: La lista global de OTs (todas las del sistema) requeriría un
 *       endpoint GET /work-orders/list. Por ahora, el contexto carga las OTs
 *       por solicitudId y las almacena en memoria, lo que es suficiente para
 *       la integración con SolicitudDetailPage.
 *       Cuando exista el endpoint de lista global, solo hay que añadir
 *       un nuevo use-case y un método `loadAll` aquí.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import { GetOrdenesTrabajoBySolicitudIdUseCase } from '../../application/usecases/GetOrdenesTrabajoBySolicitudIdUseCase';

// ── Context shape ────────────────────────────────────────────────────────────
interface WorkOrdersContextType {
  /** OTs actualmente cargadas (de la última solicitud consultada) */
  ordenes: OrdenTrabajoVistaCliente[];
  /** ID de la solicitud cuyas OTs están cargadas */
  solicitudIdActual: string | null;
  isLoading: boolean;
  error: string | null;
  /** Carga las OTs de una solicitud específica */
  loadBySolicitud: (solicitudId: string) => Promise<void>;
  /** Recarga con el mismo solicitudId actual */
  refresh: () => Promise<void>;
}

const WorkOrdersContext = createContext<WorkOrdersContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────
export const WorkOrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajoVistaCliente[]>([]);
  const [solicitudIdActual, setSolicitudIdActual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);
  const loadBySolicitudUseCase = useMemo(
    () => new GetOrdenesTrabajoBySolicitudIdUseCase(repository),
    [repository]
  );

  const loadBySolicitud = useCallback(
    async (solicitudId: string) => {
      if (!solicitudId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadBySolicitudUseCase.execute(solicitudId);
        setOrdenes(data);
        setSolicitudIdActual(solicitudId);
      } catch (err: any) {
        console.error('[WorkOrdersContext] Error loading OTs:', err);
        setError(err.message || 'Error al cargar las órdenes de trabajo.');
      } finally {
        setIsLoading(false);
      }
    },
    [loadBySolicitudUseCase]
  );

  const refresh = useCallback(async () => {
    if (solicitudIdActual) {
      await loadBySolicitud(solicitudIdActual);
    }
  }, [solicitudIdActual, loadBySolicitud]);

  const value = useMemo(
    () => ({
      ordenes,
      solicitudIdActual,
      isLoading,
      error,
      loadBySolicitud,
      refresh,
    }),
    [ordenes, solicitudIdActual, isLoading, error, loadBySolicitud, refresh]
  );

  return (
    <WorkOrdersContext.Provider value={value}>
      {children}
    </WorkOrdersContext.Provider>
  );
};

// ── Consumer hook ─────────────────────────────────────────────────────────────
export const useWorkOrdersContext = (): WorkOrdersContextType => {
  const context = useContext(WorkOrdersContext);
  if (!context) {
    throw new Error(
      'useWorkOrdersContext must be used within a WorkOrdersProvider'
    );
  }
  return context;
};
