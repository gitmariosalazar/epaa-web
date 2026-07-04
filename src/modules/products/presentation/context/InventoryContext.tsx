import React, { createContext, useContext, useMemo, useState } from 'react';
import type { InventoryResponse } from '../../domain/models/products-inventory';
import { InventoryRepositoryImpl } from '../../infrastructure/InventoryRepositoryImpl';
import { FindAllInventoriesPaginatedUseCase } from '../../application/usecases/FindAllInventoriesPaginatedUseCase';
import { GetInventoriesBelowMinStockUseCase } from '../../application/usecases/GetInventoriesBelowMinStockUseCase';
import { GetInventoriesByAccountCodeUseCase } from '../../application/usecases/GetInventoriesByAccountCodeUseCase';
import { GetInventoriesByCompanyCodeUseCase } from '../../application/usecases/GetInventoriesByCompanyCodeUseCase';
import { GetInventoriesByItemTypeUseCase } from '../../application/usecases/GetInventoriesByItemTypeUseCase';
import { GetInventoriesByStatusUseCase } from '../../application/usecases/GetInventoriesByStatusUseCase';
import { GetInventoriesByUnitOfMeasureUseCase } from '../../application/usecases/GetInventoriesByUnitOfMeasureUseCase';
import { GetInventoriesLikeItemCodeUseCase } from '../../application/usecases/GetInventoriesLikeItemCodeUseCase';
import { GetInventoriesLikeItemNameUseCase } from '../../application/usecases/GetInventoriesLikeItemNameUseCase';
import { GetInventoriesUseCase } from '../../application/usecases/GetInventoriesUseCase';
import { GetInventoryByIdUseCase } from '../../application/usecases/GetInventoryByIdUseCase';

interface InventoryContextState {
  inventories: InventoryResponse[];
  selectedInventory: InventoryResponse | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number; // for pagination
}

interface InventoryContextValue {
  state: InventoryContextState;
  actions: {
    loadInventoriesPaginated: (limit: number, offset: number, query?: string) => Promise<void>;
    loadInventoryById: (id: number) => Promise<void>;
    loadInventoriesBelowMinStock: () => Promise<void>;
    loadInventoriesByStatus: (status: string) => Promise<void>;
    loadInventoriesByItemType: (itemType: string) => Promise<void>;
    loadInventoriesLikeItemName: (name: string) => Promise<void>;
    loadInventoriesLikeItemCode: (code: string) => Promise<void>;
    loadInventoriesByCompanyCode: (companyCode: string) => Promise<void>;
    loadInventoriesByAccountCode: (accountCode: string) => Promise<void>;
    loadInventoriesByUnitOfMeasure: (unit: string) => Promise<void>;
    loadInventories: (limit: number, offset: number) => Promise<void>;
    setSelectedInventory: (inventory: InventoryResponse | null) => void;
    clearError: () => void;
  };
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<InventoryContextState>({
    inventories: [],
    selectedInventory: null,
    isLoading: false,
    error: null,
    totalCount: 0,
  });

  // Dependencies
  const repository = useMemo(() => new InventoryRepositoryImpl(), []);
  
  const findAllPaginatedUC = useMemo(() => new FindAllInventoriesPaginatedUseCase(repository), [repository]);
  const getByIdUC = useMemo(() => new GetInventoryByIdUseCase(repository), [repository]);
  const getBelowMinStockUC = useMemo(() => new GetInventoriesBelowMinStockUseCase(repository), [repository]);
  const getByStatusUC = useMemo(() => new GetInventoriesByStatusUseCase(repository), [repository]);
  const getByItemTypeUC = useMemo(() => new GetInventoriesByItemTypeUseCase(repository), [repository]);
  const getLikeItemNameUC = useMemo(() => new GetInventoriesLikeItemNameUseCase(repository), [repository]);
  const getLikeItemCodeUC = useMemo(() => new GetInventoriesLikeItemCodeUseCase(repository), [repository]);
  const getByCompanyCodeUC = useMemo(() => new GetInventoriesByCompanyCodeUseCase(repository), [repository]);
  const getByAccountCodeUC = useMemo(() => new GetInventoriesByAccountCodeUseCase(repository), [repository]);
  const getByUnitOfMeasureUC = useMemo(() => new GetInventoriesByUnitOfMeasureUseCase(repository), [repository]);
  const getInventoriesUC = useMemo(() => new GetInventoriesUseCase(repository), [repository]);

  const setLoading = (isLoading: boolean) => setState(prev => ({ ...prev, isLoading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error }));

  const actions = useMemo(() => ({
    loadInventoriesPaginated: async (limit: number, offset: number, query?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await findAllPaginatedUC.execute({ limit, offset, query });
        setState(prev => ({
          ...prev,
          inventories: result,
          // Since the API doesn't return totalCount natively in ApiResponse according to typical implementation, 
          // we might just estimate or rely on next implementation. For now, length + offset:
          totalCount: result.length === limit ? offset + limit + 1 : offset + result.length
        }));
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    },
    
    loadInventoryById: async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByIdUC.execute(id);
        setState(prev => ({ ...prev, selectedInventory: result }));
      } catch (err) {
        setError('Error al obtener el inventario');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesBelowMinStock: async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBelowMinStockUC.execute();
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al cargar el inventario (stock mínimo)');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesByStatus: async (status: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByStatusUC.execute(status);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesByItemType: async (itemType: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByItemTypeUC.execute(itemType);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesLikeItemName: async (name: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getLikeItemNameUC.execute(name);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al buscar inventario');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesLikeItemCode: async (code: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getLikeItemCodeUC.execute(code);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al buscar inventario');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesByCompanyCode: async (companyCode: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByCompanyCodeUC.execute(companyCode);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al buscar inventario por empresa');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesByAccountCode: async (accountCode: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByAccountCodeUC.execute(accountCode);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al buscar inventario por cuenta');
      } finally {
        setLoading(false);
      }
    },

    loadInventoriesByUnitOfMeasure: async (unit: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getByUnitOfMeasureUC.execute(unit);
        setState(prev => ({ ...prev, inventories: result }));
      } catch (err) {
        setError('Error al buscar inventario por unidad');
      } finally {
        setLoading(false);
      }
    },

    loadInventories: async (limit: number, offset: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getInventoriesUC.execute(limit, offset);
        setState(prev => ({ 
          ...prev, 
          inventories: result,
          totalCount: result.length === limit ? offset + limit + 1 : offset + result.length
        }));
      } catch (err) {
        setError('Error al cargar inventarios');
      } finally {
        setLoading(false);
      }
    },

    setSelectedInventory: (inventory: InventoryResponse | null) => {
      setState(prev => ({ ...prev, selectedInventory: inventory }));
    },
    
    clearError: () => setError(null)
  }), [
    findAllPaginatedUC,
    getByIdUC,
    getBelowMinStockUC,
    getByStatusUC,
    getByItemTypeUC,
    getLikeItemNameUC,
    getLikeItemCodeUC,
    getByCompanyCodeUC,
    getByAccountCodeUC,
    getByUnitOfMeasureUC,
    getInventoriesUC
  ]);

  return (
    <InventoryContext.Provider value={{ state, actions }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
};
