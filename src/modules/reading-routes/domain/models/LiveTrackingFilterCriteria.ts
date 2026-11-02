import type { RouteAssignmentStatus } from './RouteAssignment';

export type LiveTrackingSortOption =
  | 'DEFAULT'
  | 'PROGRESS_ASC'
  | 'PROGRESS_DESC'
  | 'CODE_ASC'
  | 'READER_ASC'
  | 'PENDING_DESC'
  | 'NOVELTIES_DESC';

export interface LiveTrackingFilterCriteria {
  searchTerm: string;
  estado: RouteAssignmentStatus | 'TODOS';
  sectorId: number | 'TODOS';
  operatorId: string | 'TODOS';
  onlyWithNovelties: boolean;
  onlyPending: boolean;
  sortBy: LiveTrackingSortOption;
}

export interface LiveTrackingStatusCounts {
  todos: number;
  asignada: number;
  enProceso: number;
  pausada: number;
  reasignada: number;
  completada: number;
}

export interface FilterOperatorOption {
  id: string;
  name: string;
  routeCount: number;
}
