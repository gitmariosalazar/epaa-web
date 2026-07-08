import { useState, useCallback, useEffect } from 'react';
import type { Position } from '../../domain/models/Position';
import { GetPositionsUseCase } from '../../application/usecases/GetPositionsUseCase';
import { CreatePositionUseCase } from '../../application/usecases/CreatePositionUseCase';
import { UpdatePositionUseCase } from '../../application/usecases/UpdatePositionUseCase';
import { DisablePositionUseCase } from '../../application/usecases/DisablePositionUseCase';

export const usePositionsViewModel = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPositionsUseCase = new GetPositionsUseCase();
  const createPositionUseCase = new CreatePositionUseCase();
  const updatePositionUseCase = new UpdatePositionUseCase();
  const disablePositionUseCase = new DisablePositionUseCase();

  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPositionsUseCase.execute();
      setPositions(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los cargos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPosition = async (position: Omit<Position, 'positionId' | 'creationDate' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await createPositionUseCase.execute(position);
      await fetchPositions();
    } catch (err: any) {
      setError(err.message || 'Error al crear el cargo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePosition = async (positionId: number, position: Partial<Position>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePositionUseCase.execute(positionId, position);
      await fetchPositions();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el cargo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disablePosition = async (positionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await disablePositionUseCase.execute(positionId);
      await fetchPositions();
    } catch (err: any) {
      setError(err.message || 'Error al inhabilitar el cargo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    isLoading,
    error,
    fetchPositions,
    createPosition,
    updatePosition,
    disablePosition
  };
};
