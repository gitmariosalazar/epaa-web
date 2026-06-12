// ── Constants for the Create Work Order wizard ─────────────────────────────
import { User, Wrench, FileCheck } from 'lucide-react';
import type { WorkOrderForm } from './types';

export const STEPS = [
  { id: 1, label: 'Cliente',      icon: <User    size={18} /> },
  { id: 2, label: 'Detalle OT',  icon: <Wrench  size={18} /> },
  { id: 3, label: 'Confirmación', icon: <FileCheck size={18} /> },
];

export const INITIAL_FORM: WorkOrderForm = {
  clientId:    '',
  clientName:  '',
  clientEmail: '',
  clientPhone: '',
  tipoPersona: 'NATURAL',
  origin:       'SOLICITUD',
  workTypeId:   1,
  priorityId:   2,
  cadastralKey: '',
  location:     '',
  description:  '',
  longitude:    '',
  latitude:     '',
};

export const ORIGINS = [
  { value: 'EMERGENCIA',  label: '🚨 Emergencia' },
  { value: 'PLANIFICADA', label: '📅 Planificada' },
  { value: 'SOLICITUD',   label: '📋 Solicitud ciudadana' },
  { value: 'INSPECCION',  label: '🔍 Inspección' },
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

export const PRIORITIES = [
  { id: 1, label: '🔵 Baja',      color: '#3b82f6' },
  { id: 2, label: '🟡 Media',     color: '#f59e0b' },
  { id: 3, label: '🟠 Alta',      color: '#f97316' },
  { id: 4, label: '🔴 Urgente',   color: '#ef4444' },
  { id: 5, label: '⚡ Emergencia', color: '#8b5cf6' },
] as const;
