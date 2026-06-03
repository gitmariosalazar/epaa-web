import type { CambioTitular } from '../models/CambioTitular';
export interface CambioTitularRepository { get(): Promise<CambioTitular>; }
