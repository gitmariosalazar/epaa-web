import { useInventoryContext } from '../context/InventoryContext';
import { useState, useCallback } from 'react';

export interface InventoryFilterState {
  search: string;
  filterBy: 'codigo' | 'nombre' | 'status' | 'tipo' | '';
}

export const useInventoryViewModel = () => {
  const { state, actions } = useInventoryContext();
  const [filters, setFilters] = useState<InventoryFilterState>({
    search: '',
    filterBy: '',
  });

  const loadInitialData = useCallback(async () => {
    await actions.loadInventoriesPaginated(100, 0);
  }, [actions]);

  const handleSearch = useCallback(async () => {
    if (!filters.search.trim()) {
      await loadInitialData();
      return;
    }

    const term = filters.search.trim();

    if (filters.filterBy === 'codigo') {
      await actions.loadInventoriesLikeItemCode(term);
    } else if (filters.filterBy === 'nombre') {
      await actions.loadInventoriesLikeItemName(term);
    } else if (filters.filterBy === 'status') {
      await actions.loadInventoriesByStatus(term);
    } else if (filters.filterBy === 'tipo') {
      await actions.loadInventoriesByItemType(term);
    } else {
      // Default: try paginated with search query
      await actions.loadInventoriesPaginated(100, 0, term);
    }
  }, [filters, actions, loadInitialData]);

  const updateFilters = (updates: Partial<InventoryFilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    actions,
    filters,
    updateFilters,
    handleSearch,
    loadInitialData
  };
};
