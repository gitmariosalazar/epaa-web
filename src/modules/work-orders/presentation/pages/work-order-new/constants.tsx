// ── Constants for the Create Work Order wizard ─────────────────────────────
import { User, Wrench, FileCheck } from 'lucide-react';
import type { WorkOrderForm } from './types';

export const STEPS = [
  { id: 1, label: 'Cliente', icon: <User size={18} /> },
  { id: 2, label: 'Detalle OT', icon: <Wrench size={18} /> },
  { id: 3, label: 'Confirmación', icon: <FileCheck size={18} /> },
];

export const INITIAL_FORM: WorkOrderForm = {
  clientId: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  tipoPersona: 'NATURAL',
  origin: 'SOLICITUD',
  workTypeId: 0,
  workTypeName: '',
  departmentName: '',
  priorityId: 2,
  cadastralKey: '',
  location: '',
  description: '',
  longitude: '',
  latitude: '',
  images: [],
};

export const ORIGINS = [
  { value: 'EMERGENCIA', label: '🚨 Emergencia' },
  { value: 'PLANIFICADA', label: '📅 Planificada' },
  { value: 'SOLICITUD', label: '📋 Solicitud ciudadana' },
  { value: 'INSPECCION', label: '🔍 Inspección' },
] as const;

export const WORK_TYPES = [
  { id: 1, label: 'Inspección de acometida' },
  { id: 2, label: 'Reparación de fuga' },
  { id: 3, label: 'Instalación de medidor' },
  { id: 4, label: 'Corte de servicio' },
  { id: 5, label: 'Reconexión de servicio' },
  { id: 6, label: 'Limpieza de red' },
  { id: 7, label: 'Mantenimiento preventivo' },
] as const;

/*
id_prioridad,nivel,descripcion,sla_horas
1,Emergencia,Falla crítica con riesgo de salud pública o daño masivo,4
2,Urgente,"Interrupción grave del servicio, afecta a más de 50 clientes",8
3,Alta,Falla que afecta a un sector de clientes de forma notable,24
4,Media,Mantenimiento correctivo o preventivo planificado,48
5,Baja,Mejoras menores o trabajos de baja criticidad,120
*/

export const PRIORITIES = [
  { id: 5, label: '🔵 Baja', color: '#3b82f6' },
  { id: 4, label: '🟡 Media', color: '#f59e0b' },
  { id: 3, label: '🟠 Alta', color: '#f97316' },
  { id: 2, label: '🔴 Urgente', color: '#ef4444' },
  { id: 1, label: '⚡ Emergencia', color: '#8b5cf6' },
] as const;
