import { useRealtimeEvent } from '@/shared/presentation/hooks/useRealtimeEvent';
import '@/modules/connections/domain/events/ConnectionWsEvents';
import '@/modules/readings/domain/events/ReadingWsEvents';

/**
 * Hook `useReadingImagesRealtimeSync`
 * 
 * SRP: Orquesta la sincronización en tiempo real exclusivamente para la vista 
 * de Imágenes de Lecturas, abstrayendo los eventos WebSocket de la UI.
 */
export const useReadingImagesRealtimeSync = (
  month: string | undefined,
  sector: string | number | undefined,
  refetch: () => void
) => {
  
  useRealtimeEvent('connection.created', (payload) => {
    if (!sector || payload.sector.toString() === sector.toString()) {
      setTimeout(() => refetch(), 1500);
    }
  });

  useRealtimeEvent('connection.updated', (payload) => {
    if (!sector || payload.sector.toString() === sector.toString()) {
      setTimeout(() => refetch(), 1500);
    }
  });

  useRealtimeEvent('reading:updated', (payload) => {
    if (!sector || payload.sectorId.toString() === sector.toString()) {
      if (month && payload.month.startsWith(month)) {
        setTimeout(() => refetch(), 1500);
      }
    }
  });
};
