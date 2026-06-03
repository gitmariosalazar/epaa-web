import type { Suspension } from '../models/Suspension';
export interface SuspensionRepository { get(): Promise<Suspension>; }
