import type { StateHistory } from './StateHistory';

export interface ReversibleRecord {
  connectionId: string;
  isReversible: boolean;
  message: string;
  record: StateHistory | null;
}
