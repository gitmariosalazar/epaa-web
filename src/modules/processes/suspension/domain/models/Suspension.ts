import type { Requisito, TipoPersona } from '@/shared/domain/models/TramiteBase';
export interface Suspension { id: string; nombre: string; descripcion: string; tipoPersona: TipoPersona; requisitos: Requisito[]; costoTotal: number; tiempoEstimadoDias: number; color: string; icono: string; activo: boolean; }
