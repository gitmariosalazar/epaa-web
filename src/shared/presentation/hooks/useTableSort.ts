import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T | string;
  direction: SortDirection;
}

export const useTableSort = <T>(data: T[], initialConfig?: SortConfig<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialConfig || null
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle numerical sorting (even if values are strings like "123")
      const aNum = Number(aValue);
      const bNum = Number(bValue);

      // Check if both are valid numbers and not empty strings
      // We check for typeof object because null is object, arrays are object
      // But Number(null) is 0, Number([]) is 0.
      const isANumber =
        !isNaN(aNum) &&
        aValue !== null &&
        aValue !== '' &&
        aValue !== undefined;
      const isBNumber =
        !isNaN(bNum) &&
        bValue !== null &&
        bValue !== '' &&
        bValue !== undefined;

      if (isANumber && isBNumber) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Fallback to string comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof T | string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  return { sortedData, sortConfig, requestSort };
};
