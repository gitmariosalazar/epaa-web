export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FilterModel {
  id: string; // Unique ID for the filter instance
  columnField: string; // The accessor/id of the column to filter
  operatorValue: FilterOperator; // The chosen operator
  value: any; // The value to compare against
}
