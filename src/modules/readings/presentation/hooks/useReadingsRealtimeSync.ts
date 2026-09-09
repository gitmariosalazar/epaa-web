import { useRealtimeEvent } from '@/shared/presentation/hooks/useRealtimeEvent';
import '@/modules/connections/domain/events/ConnectionWsEvents';
import '@/modules/readings/domain/events/ReadingWsEvents';

interface UseReadingsRealtimeSyncProps {
  activeTab: string;
  month: string;
  sector: string | number;
  userId: string;
  fetchReadings: (
    activeTab: string,
    monthIso: string,
    sectorToFetch?: string | number,
    userId?: string
  ) => void;
}

/**
 * Hook `useReadingsRealtimeSync`
 * 
 * SRP (Single Responsibility Principle): Este hook se encarga ÚNICAMENTE de la 
 * orquestación en tiempo real. Abstrae la complejidad de los sockets fuera 
 * de la Vista (UI) y escucha de forma silenciosa para recargar los datos.
 */
export const useReadingsRealtimeSync = ({
  activeTab,
  month,
  sector,
  userId,
  fetchReadings,
}: UseReadingsRealtimeSyncProps) => {
  
  useRealtimeEvent('connection.created', (payload) => {
    console.log('[RealtimeSync] connection.created received:', payload);
    if (!sector || payload.sector.toString() === sector.toString()) {
      setTimeout(() => fetchReadings(activeTab, month, sector, userId), 1500);
    }
  });

  useRealtimeEvent('connection.updated', (payload) => {
    console.log('[RealtimeSync] connection.updated received:', payload);
    if (!sector || payload.sector.toString() === sector.toString()) {
      setTimeout(() => fetchReadings(activeTab, month, sector, userId), 1500);
    }
  });

  useRealtimeEvent('reading:updated', (payload) => {
    console.log('[RealtimeSync] reading:updated received:', payload);
    if (!sector || payload.sectorId.toString() === sector.toString()) {
      if (payload.month.startsWith(month)) {
        setTimeout(() => fetchReadings(activeTab, month, sector, userId), 1500);
      }
    }
  });
};
