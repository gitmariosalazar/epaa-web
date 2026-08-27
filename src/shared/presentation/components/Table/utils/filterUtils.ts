import type { Column } from '../Table';
import type { FilterModel, FilterOperator } from '../types/TableFilter';

/**
 * Applies an array of filters to the dataset.
 * Follows Single Responsibility and Open/Closed Principles.
 * If new operators are needed, simply add them to the `applyOperator` switch.
 */
export function applyTableFilters<T>(
  data: T[],
  filters: FilterModel[],
  columns: Column<T>[]
): T[] {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    // A row must pass ALL filters (AND logic)
    return filters.every((filter) => {
      // Find the corresponding column to know how to access the value
      const column = columns.find(
        (col, idx) =>
          col.id === filter.columnField ||
          (typeof col.accessor === 'string' && col.accessor === filter.columnField) ||
          `col-${idx}` === filter.columnField
      );

      if (!column) return true; // If column not found, ignore filter

      let cellValue: any;
      if (column.filterValueGetter) {
        cellValue = column.filterValueGetter(item);
      } else if (typeof column.accessor === 'string') {
        cellValue = item[column.accessor as keyof T];
      } else if (column.id && column.id in (item as any)) {
        cellValue = (item as any)[column.id];
      } else {
        return true;
      }

      return applyOperator(cellValue, filter.operatorValue, filter.value);
    });
  });
}

function applyOperator(
  cellValue: any,
  operator: FilterOperator,
  filterValue: any
): boolean {
  // Handle empty/notEmpty immediately
  if (operator === 'isEmpty') {
    return cellValue === null || cellValue === undefined || cellValue === '';
  }
  if (operator === 'isNotEmpty') {
    return cellValue !== null && cellValue !== undefined && cellValue !== '';
  }

  // If the cell is empty but the filter expects a value, it doesn't match
  if (cellValue === null || cellValue === undefined) return false;

  const cellString = String(cellValue).toLowerCase();
  const filterString = filterValue ? String(filterValue).toLowerCase() : '';

  switch (operator) {
    case 'contains':
      return cellString.includes(filterString);
    case 'equals':
      return cellString === filterString;
    case 'startsWith':
      return cellString.startsWith(filterString);
    case 'endsWith':
      return cellString.endsWith(filterString);
    case 'greaterThan':
      return Number(cellValue) > Number(filterValue);
    case 'lessThan':
      return Number(cellValue) < Number(filterValue);
    default:
      return true;
  }
}
