import type { Requisito } from '@/shared/domain/models/TramiteBase';
export interface BeneficioTerceraEdad { id: string; nombre: string; descripcion: string; requisitos: Requisito[]; costoTotal: number; tiempoEstimadoDias: number; color: string; icono: string; activo: boolean; }
